// Escáner de alimentos con la cámara del móvil.
//
// Dos modos:
// - «Etiqueta»: se enfoca un alimento y, cuando la imagen está quieta, aparecen su nombre y sus
//   valores por 100 g junto a él. Si se ve un código de barras, se usa la etiqueta real del producto
//   (Open Food Facts) en lugar de la IA.
// - «Mi plato»: se analiza el plato entero, se estiman los gramos de cada alimento y se puede
//   apuntar en el diario.
//
// No se guarda ninguna imagen: para la IA se envía una copia pequeña al servidor del escáner, que
// la reenvía a la IA (Workers AI de Cloudflare, o Claude si se configura) y la descarta. Los códigos de barras se leen en el propio móvil.

const ZXING_URL = "https://cdn.jsdelivr.net/npm/@zxing/browser@0.1.5/+esm";
const OPEN_FOOD_FACTS_URL = "https://world.openfoodfacts.org/api/v2/product/";
const BARCODE_FORMATS = ["ean_13", "ean_8", "upc_a", "upc_e"];
const TICK_MS = 400;
const STEADY_TICKS = 3; // ~1,2 s quieto antes de preguntar a la IA
const STEADY_DIFF = 9; // diferencia media por píxel (0-255) por debajo de la cual la imagen está quieta
const NEW_SCENE_DIFF = 22; // cuánto tiene que cambiar la imagen para volver a preguntar
const MIN_GAP_MS = 3500; // tiempo mínimo entre dos consultas automáticas
const AI_MAX_SIDE = 768;

const ui = {};
const scanner = {
  apiBase: "",
  getIdToken: null,
  onAddMeal: null,
  mode: "live",
  stream: null,
  timer: null,
  busy: false,
  lastAskAt: 0,
  steadyTicks: 0,
  previousSignature: null,
  askedSignature: null,
  detector: null,
  zxing: null,
  zxingLoading: null,
  lastBarcode: "",
  results: [],
  open: false,
  returnFocus: null,
};

export function initScanner({ apiBase, getIdToken, onAddMeal }) {
  scanner.apiBase = apiBase || "";
  scanner.getIdToken = getIdToken;
  scanner.onAddMeal = onAddMeal;
  ui.root = document.querySelector("#scanner");
  ui.video = document.querySelector("#scanner-video");
  ui.labels = document.querySelector("#scanner-labels");
  ui.hint = document.querySelector("#scanner-hint");
  ui.sheet = document.querySelector("#scanner-sheet");
  ui.shutter = document.querySelector("#scanner-shutter");
  ui.close = document.querySelector("#scanner-close");
  ui.tabs = [...document.querySelectorAll("[data-scanner-mode]")];
  ui.manualForm = document.querySelector("#scanner-manual");
  ui.manualInput = document.querySelector("#scanner-manual-code");
  ui.note = document.querySelector("#scanner-note");

  document.querySelectorAll("[data-open-scanner]").forEach((button) => {
    button.addEventListener("click", () => openScanner(button.dataset.openScanner || "live"));
  });
  ui.close.addEventListener("click", closeScanner);
  ui.tabs.forEach((tab) => tab.addEventListener("click", () => setMode(tab.dataset.scannerMode)));
  ui.shutter.addEventListener("click", () => askAi({ manual: true }));
  ui.manualForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const code = ui.manualInput.value.replace(/\D/g, "");
    if (code.length >= 8) lookupBarcode(code);
  });
  ui.root.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeScanner();
    if (event.key === "Tab") keepFocusInside(event);
  });
  document.addEventListener("visibilitychange", () => {
    if (!scanner.open) return;
    if (document.hidden) stopCamera();
    else startCamera();
  });
  ui.note.textContent = scanner.apiBase
    ? "Valores orientativos. Para reconocer el alimento, una imagen pequeña se envía a la IA (Cloudflare o Anthropic, ver privacidad) y no se guarda."
    : "De momento el escáner lee códigos de barras de productos envasados. El reconocimiento de alimentos con IA llegará muy pronto.";
}

async function openScanner(mode) {
  scanner.open = true;
  scanner.returnFocus = document.activeElement;
  ui.root.classList.remove("hidden");
  document.body.classList.add("scanner-open");
  setMode(mode === "plate" ? "plate" : "live");
  ui.close.focus();
  await startCamera();
}

function closeScanner() {
  scanner.open = false;
  stopCamera();
  ui.root.classList.add("hidden");
  document.body.classList.remove("scanner-open");
  clearLabels();
  scanner.results = [];
  scanner.lastBarcode = "";
  ui.sheet.replaceChildren();
  scanner.returnFocus?.focus?.();
}

function setMode(mode) {
  scanner.mode = mode;
  ui.tabs.forEach((tab) => tab.setAttribute("aria-pressed", String(tab.dataset.scannerMode === mode)));
  ui.root.dataset.mode = mode;
  clearLabels();
  scanner.results = [];
  scanner.askedSignature = null;
  scanner.lastBarcode = "";
  ui.sheet.replaceChildren();
  ui.shutter.textContent = mode === "plate" ? "Analizar mi plato" : "Analizar ahora";
  ui.shutter.classList.toggle("hidden", !scanner.apiBase);
  setHint(mode === "plate"
    ? "Encuadra el plato entero desde arriba y pulsa «Analizar mi plato»."
    : scanner.apiBase ? "Enfoca un alimento o un código de barras y mantén el móvil quieto." : "Enfoca el código de barras del producto.");
}

function setHint(text, tone = "") {
  ui.hint.textContent = text;
  ui.hint.dataset.tone = tone;
}

// ---- Cámara -------------------------------------------------------------------------------------

async function startCamera() {
  if (scanner.stream) return;
  if (!navigator.mediaDevices?.getUserMedia) {
    setHint("Este navegador no permite usar la cámara. Puedes escribir el código de barras abajo.", "error");
    return;
  }
  try {
    scanner.stream = await navigator.mediaDevices.getUserMedia({
      audio: false,
      video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 720 } },
    });
  } catch {
    setHint("No hay acceso a la cámara. Dale permiso en el navegador o escribe el código de barras abajo.", "error");
    return;
  }
  if (!scanner.open) {
    stopCamera();
    return;
  }
  ui.video.srcObject = scanner.stream;
  await ui.video.play().catch(() => {});
  scanner.timer = window.setInterval(tick, TICK_MS);
}

function stopCamera() {
  window.clearInterval(scanner.timer);
  scanner.timer = null;
  scanner.stream?.getTracks().forEach((track) => track.stop());
  scanner.stream = null;
  ui.video.srcObject = null;
  scanner.steadyTicks = 0;
  scanner.previousSignature = null;
}

function videoReady() {
  return ui.video.readyState >= 2 && ui.video.videoWidth > 0;
}

// Huella pequeña en grises de la imagen para saber si el móvil está quieto o si ha cambiado lo enfocado.
const signatureCanvas = document.createElement("canvas");
signatureCanvas.width = 48;
signatureCanvas.height = 36;

function frameSignature() {
  const context = signatureCanvas.getContext("2d", { willReadFrequently: true });
  context.drawImage(ui.video, 0, 0, signatureCanvas.width, signatureCanvas.height);
  const { data } = context.getImageData(0, 0, signatureCanvas.width, signatureCanvas.height);
  const gray = new Uint8Array(data.length / 4);
  for (let i = 0; i < gray.length; i += 1) gray[i] = (data[i * 4] * 3 + data[i * 4 + 1] * 6 + data[i * 4 + 2]) / 10;
  return gray;
}

function difference(a, b) {
  if (!a || !b) return 255;
  let total = 0;
  for (let i = 0; i < a.length; i += 1) total += Math.abs(a[i] - b[i]);
  return total / a.length;
}

async function tick() {
  if (!scanner.open || !videoReady()) return;
  const signature = frameSignature();
  const steady = difference(signature, scanner.previousSignature) < STEADY_DIFF;
  scanner.previousSignature = signature;
  scanner.steadyTicks = steady ? scanner.steadyTicks + 1 : 0;

  // Mientras la persona escribe los gramos no se cambia lo que está viendo.
  if (ui.sheet.contains(document.activeElement)) return;

  const code = await readBarcode();
  if (code && code !== scanner.lastBarcode) {
    scanner.askedSignature = signature;
    lookupBarcode(code);
    return;
  }
  // Tras leer un código, la IA espera a que se enfoque otra cosa.
  if (scanner.lastBarcode && !code && steady && difference(signature, scanner.askedSignature) >= NEW_SCENE_DIFF) {
    scanner.lastBarcode = "";
  }
  if (scanner.mode !== "live" || !scanner.apiBase || scanner.busy || scanner.lastBarcode) return;
  if (scanner.steadyTicks < STEADY_TICKS || Date.now() - scanner.lastAskAt < MIN_GAP_MS) return;
  if (difference(signature, scanner.askedSignature) < NEW_SCENE_DIFF) return;
  askAi({ signature });
}

// ---- Códigos de barras --------------------------------------------------------------------------

const barcodeCanvas = document.createElement("canvas");

async function readBarcode() {
  try {
    if (scanner.detector === null && "BarcodeDetector" in window) {
      const supported = await window.BarcodeDetector.getSupportedFormats();
      const formats = BARCODE_FORMATS.filter((format) => supported.includes(format));
      scanner.detector = formats.length ? new window.BarcodeDetector({ formats }) : false;
    }
    if (scanner.detector) {
      const found = await scanner.detector.detect(ui.video);
      return found[0]?.rawValue?.replace(/\D/g, "") || "";
    }
    const reader = await loadZxing();
    if (!reader) return "";
    const width = Math.min(ui.video.videoWidth, 960);
    barcodeCanvas.width = width;
    barcodeCanvas.height = Math.round(ui.video.videoHeight * (width / ui.video.videoWidth));
    barcodeCanvas.getContext("2d").drawImage(ui.video, 0, 0, barcodeCanvas.width, barcodeCanvas.height);
    return reader.decodeFromCanvas(barcodeCanvas).getText().replace(/\D/g, "");
  } catch {
    // Sin código a la vista (ZXing avisa lanzando un error) o lector no disponible.
    return "";
  }
}

// iPhone y algunos navegadores no traen lector de códigos: se carga ZXing la primera vez que hace falta.
function loadZxing() {
  if (scanner.zxing !== null) return Promise.resolve(scanner.zxing);
  if (!scanner.zxingLoading) {
    scanner.zxingLoading = import(ZXING_URL)
      .then((module) => {
        scanner.zxing = new module.BrowserMultiFormatReader();
        return scanner.zxing;
      })
      .catch(() => {
        scanner.zxing = false;
        return false;
      });
  }
  return scanner.zxingLoading;
}

async function lookupBarcode(code) {
  scanner.lastBarcode = code;
  clearLabels();
  setHint(`Buscando el código ${code}…`);
  try {
    const fields = "product_name,product_name_es,brands,nutriments,serving_quantity";
    const response = await fetch(`${OPEN_FOOD_FACTS_URL}${encodeURIComponent(code)}.json?fields=${fields}`);
    const payload = response.ok ? await response.json() : null;
    const product = payload?.status === 1 ? payload.product : null;
    const values = product ? productValues(product.nutriments || {}) : null;
    if (!scanner.open || scanner.lastBarcode !== code) return;
    if (!product || !values) {
      setHint("Ese código no está en la base de datos de productos. Prueba a enfocar el alimento.", "error");
      renderSheet([], { barcodeMissing: code });
      return;
    }
    const name = (product.product_name_es || product.product_name || "Producto envasado").trim();
    const brand = (product.brands || "").split(",")[0].trim();
    const serving = Number(product.serving_quantity);
    const item = {
      name: brand ? `${name} · ${brand}` : name,
      grams: Number.isFinite(serving) && serving > 0 && serving < 2000 ? Math.round(serving) : 100,
      ...values,
      source: "label",
    };
    scanner.results = [item];
    setHint("Etiqueta del producto. Valores por 100 g.", "ok");
    renderSheet([item]);
  } catch {
    if (scanner.lastBarcode === code) setHint("No se ha podido consultar el producto. Revisa tu conexión.", "error");
  }
}

function productValues(nutriments) {
  const kcal = Number(nutriments["energy-kcal_100g"] ?? (Number(nutriments.energy_100g) / 4.184));
  const protein = Number(nutriments.proteins_100g);
  const carbs = Number(nutriments.carbohydrates_100g);
  const fat = Number(nutriments.fat_100g);
  if (![kcal, protein, carbs, fat].some(Number.isFinite)) return null;
  const safe = (value) => (Number.isFinite(value) && value >= 0 ? value : 0);
  return {
    kcal100: Math.round(safe(kcal)),
    protein100: Math.round(safe(protein) * 10) / 10,
    carbs100: Math.round(safe(carbs) * 10) / 10,
    fat100: Math.round(safe(fat) * 10) / 10,
  };
}

// ---- IA -------------------------------------------------------------------------------------------

const aiCanvas = document.createElement("canvas");

function captureForAi() {
  const scale = Math.min(1, AI_MAX_SIDE / Math.max(ui.video.videoWidth, ui.video.videoHeight));
  aiCanvas.width = Math.round(ui.video.videoWidth * scale);
  aiCanvas.height = Math.round(ui.video.videoHeight * scale);
  aiCanvas.getContext("2d").drawImage(ui.video, 0, 0, aiCanvas.width, aiCanvas.height);
  return aiCanvas.toDataURL("image/jpeg", 0.72).split(",")[1];
}

async function askAi({ manual = false, signature = null } = {}) {
  if (!scanner.apiBase || scanner.busy || !videoReady()) return;
  const mode = scanner.mode;
  scanner.busy = true;
  scanner.lastAskAt = Date.now();
  scanner.askedSignature = signature || frameSignature();
  if (manual) scanner.lastBarcode = "";
  ui.root.classList.add("scanner-busy");
  setHint(mode === "plate" ? "Analizando tu plato…" : "Reconociendo…");
  try {
    const image = captureForAi();
    const token = await scanner.getIdToken();
    const response = await fetch(`${scanner.apiBase}/analizar`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ image, mode }),
    });
    const payload = await response.json().catch(() => ({}));
    if (!scanner.open || scanner.mode !== mode) return;
    if (!response.ok) {
      setHint(payload.error || "No se ha podido analizar la imagen.", "error");
      return;
    }
    if (!payload.isFood) {
      clearLabels();
      setHint("No veo ningún alimento. Acércate un poco más.");
      return;
    }
    scanner.results = payload.items.map((item) => ({ ...item, grams: item.grams || 100, source: "ai" }));
    if (mode === "live") {
      scanner.results.forEach((item) => { item.grams = 100; });
      showLabels(scanner.results);
    }
    const left = Number.isFinite(payload.remaining) ? ` Te quedan ${payload.remaining} consultas hoy.` : "";
    setHint(`Estimación de la IA.${left}`, "ok");
    renderSheet(scanner.results);
  } catch {
    setHint("No se ha podido analizar la imagen. Revisa tu conexión.", "error");
  } finally {
    scanner.busy = false;
    ui.root.classList.remove("scanner-busy");
  }
}

// ---- Etiquetas sobre la imagen ------------------------------------------------------------------

function clearLabels() {
  ui.labels.replaceChildren();
}

// La imagen se muestra recortada para llenar la pantalla (object-fit: cover): se traslada la posición
// que da la IA, relativa a la imagen completa, a la parte visible.
function showLabels(items) {
  clearLabels();
  const box = ui.video.getBoundingClientRect();
  const scale = Math.max(box.width / ui.video.videoWidth, box.height / ui.video.videoHeight);
  const offsetX = (box.width - ui.video.videoWidth * scale) / 2;
  const offsetY = (box.height - ui.video.videoHeight * scale) / 2;
  items.forEach((item) => {
    const left = offsetX + item.x * ui.video.videoWidth * scale;
    const top = offsetY + item.y * ui.video.videoHeight * scale;
    const label = document.createElement("div");
    label.className = "scanner-label";
    label.style.left = `${Math.min(Math.max(left, 12), box.width - 12)}px`;
    label.style.top = `${Math.min(Math.max(top, 12), box.height - 12)}px`;
    if (left > box.width * 0.6) label.classList.add("to-left");
    const name = document.createElement("strong");
    name.textContent = item.name;
    const facts = document.createElement("span");
    facts.textContent = `${item.kcal100} kcal · P ${formatNumber(item.protein100)} · H ${formatNumber(item.carbs100)} · G ${formatNumber(item.fat100)}`;
    const per = document.createElement("small");
    per.textContent = "por 100 g";
    label.append(name, facts, per);
    ui.labels.append(label);
  });
}

// ---- Resultados y diario -------------------------------------------------------------------------

function formatNumber(value) {
  return Number(value).toLocaleString("es-ES", { maximumFractionDigits: 1 });
}

function totalsFor(items) {
  return items.reduce((sum, item) => {
    const factor = (Number(item.grams) || 0) / 100;
    sum.calories += item.kcal100 * factor;
    sum.protein += item.protein100 * factor;
    sum.carbs += item.carbs100 * factor;
    sum.fat += item.fat100 * factor;
    return sum;
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
}

function totalsText(totals) {
  return `${Math.round(totals.calories)} kcal · ${formatNumber(totals.protein)} g proteína · ${formatNumber(totals.carbs)} g hidratos · ${formatNumber(totals.fat)} g grasa`;
}

function renderSheet(items, { barcodeMissing = "" } = {}) {
  ui.sheet.replaceChildren();
  if (!items.length) {
    if (barcodeMissing) {
      const p = document.createElement("p");
      p.className = "scanner-empty";
      p.textContent = `No hemos encontrado el código ${barcodeMissing}.`;
      ui.sheet.append(p);
    }
    return;
  }
  const plate = scanner.mode === "plate";
  const list = document.createElement("div");
  list.className = "scanner-items";
  const total = document.createElement("p");
  total.className = "scanner-total";
  const refreshTotal = () => { total.textContent = `Total: ${totalsText(totalsFor(items))}`; };

  items.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "scanner-item";
    const head = document.createElement("div");
    head.className = "scanner-item-head";
    const name = document.createElement("strong");
    name.textContent = item.name;
    const badge = document.createElement("small");
    badge.textContent = item.source === "label" ? "Etiqueta" : "IA";
    head.append(name, badge);
    const per100 = document.createElement("p");
    per100.className = "scanner-per100";
    per100.textContent = `Por 100 g: ${item.kcal100} kcal · ${formatNumber(item.protein100)} g proteína · ${formatNumber(item.carbs100)} g hidratos · ${formatNumber(item.fat100)} g grasa`;

    const controls = document.createElement("div");
    controls.className = "scanner-item-controls";
    const label = document.createElement("label");
    label.className = "scanner-grams";
    const labelText = document.createElement("span");
    labelText.textContent = plate ? "Gramos estimados" : "Gramos que tomas";
    const input = document.createElement("input");
    input.type = "number";
    input.inputMode = "decimal";
    input.min = "0";
    input.max = "3000";
    input.step = "1";
    input.value = String(item.grams);
    input.addEventListener("input", () => {
      item.grams = Math.min(3000, Math.max(0, Number(input.value) || 0));
      if (plate) refreshTotal();
      else button.textContent = `Añadir ${Math.round(totalsFor([item]).calories)} kcal`;
    });
    label.append(labelText, input);
    controls.append(label);

    let button;
    if (plate) {
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "scanner-remove";
      remove.textContent = "Quitar";
      remove.setAttribute("aria-label", `Quitar ${item.name}`);
      remove.addEventListener("click", () => {
        items.splice(index, 1);
        renderSheet(items);
      });
      controls.append(remove);
    } else {
      button = document.createElement("button");
      button.type = "button";
      button.className = "button primary scanner-add";
      button.textContent = `Añadir ${Math.round(totalsFor([item]).calories)} kcal`;
      button.addEventListener("click", () => addToDiary([item], item.name, button));
      controls.append(button);
    }
    row.append(head, per100, controls);
    list.append(row);
  });
  ui.sheet.append(list);

  if (plate) {
    refreshTotal();
    const add = document.createElement("button");
    add.type = "button";
    add.className = "button primary scanner-add-plate";
    add.textContent = "Añadir el plato al diario";
    add.addEventListener("click", () => {
      const kept = items.filter((item) => item.grams > 0);
      if (!kept.length) return;
      const title = kept.map((item) => item.name).join(", ").slice(0, 120);
      addToDiary(kept, title, add);
    });
    ui.sheet.append(total, add);
  }
}

async function addToDiary(items, title, button) {
  const totals = totalsFor(items);
  const original = button.textContent;
  button.disabled = true;
  button.textContent = "Guardando…";
  try {
    await scanner.onAddMeal({
      title,
      calories: Math.round(totals.calories),
      protein: Math.round(totals.protein * 10) / 10,
      carbs: Math.round(totals.carbs * 10) / 10,
      fat: Math.round(totals.fat * 10) / 10,
    });
    button.textContent = "Añadido al diario ✓";
    setHint("Guardado en tu registro de hoy.", "ok");
  } catch {
    button.disabled = false;
    button.textContent = original;
    setHint("No se ha podido guardar. Revisa tu conexión.", "error");
  }
}

function keepFocusInside(event) {
  const focusable = [...ui.root.querySelectorAll("button, input, [href], [tabindex]:not([tabindex='-1'])")]
    .filter((element) => !element.disabled && element.offsetParent !== null);
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}
