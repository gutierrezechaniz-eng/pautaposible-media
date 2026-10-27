import { auth, firebaseApp } from "/auth.js";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";
import {
  calculateNutrition,
  nutritionTargetFromUserData,
  personalizedRecipe,
  recipeCategoryLabels,
  recipeSlug,
} from "/recetas/personalization.js";
import { initScanner } from "/app/escaner.js";
import {
  ACTIVITIES,
  EXERCISES,
  SESSIONS,
  WEEK_PLANS,
  activityById,
  activityKcal,
  downloadReminder,
  mountFigure,
  sessionMinutes,
  startSession,
} from "/app/moverme.js";
import { ACHIEVEMENTS, WEEK_CHALLENGE_DAYS, computeStats, dayId, isUnlocked, newAchievements, nextStep, recommendedLevel, weekStart } from "/app/logros.js";

const db = getFirestore(firebaseApp);
const CARE_API_BASE = "https://pauta-posible-files.gutierrezechaniz.chatgpt.site";
// Servidor de la IA del escáner (Cloudflare Worker). Si se deja vacío, el escáner solo lee códigos de barras.
const SCANNER_API_BASE = "https://pautaposible-escaner.gutierrezechaniz.workers.dev";

// Permite instalar la app en el móvil y empaquetarla para Android (ver sw.js).
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/app/sw.js", { scope: "/app/" }).catch(() => {});
}
// Versión de la política a la que se dio el consentimiento. Cámbiala solo si cambia algo de lo que
// se consiente (por ejemplo, nuevos datos de salud); los añadidos informativos, como el escáner del
// 14/10/2026, cambian la fecha de /privacidad/ pero no esta.
// Ojo: la app compara esta fecha con la del consentimiento guardado en cada cuenta. Si la cambias,
// pedirá de nuevo el consentimiento a todas las cuentas la próxima vez que entren en su espacio.
const PRIVACY_POLICY_VERSION = "2026-10-13";

const views = {
  loading: document.querySelector("#loading-view"),
  auth: document.querySelector("#auth-view"),
  consent: document.querySelector("#consent-view"),
  profile: document.querySelector("#profile-view"),
  client: document.querySelector("#client-view"),
  professional: document.querySelector("#professional-view"),
};

const state = {
  registering: true,
  user: null,
  userData: null,
  selectedClientId: null,
  professionalClients: [],
  stopClientListener: null,
  stopUserListener: null,
  isProfessional: false,
  selectedClientMeasurements: [],
  notifiedCareRequestIds: new Set(),
  closedClientGroups: new Set(),
  recipeDeepLinkHandled: false,
  // Mientras se crea una cuenta: promesa que termina cuando se ha guardado (o ha fallado) su documento.
  pendingRegistration: null,
  pendingRegistrationMode: null,
  // Días guardados de la persona (los últimos 120) y lo que se calcula con ellos.
  days: [],
  stats: null,
  measurementCount: 0,
  latestWeight: null,
  savingAchievements: false,
};
// drafts: borradores sin enviar por persona, para que un texto nunca pase al chat de otra.
const chatContexts = {
  client: { prefix: "client", role: "client", clientId: null, stop: null, lastMarkedId: null, firstRender: true, drafts: new Map(), messages: [], seenIds: new Set(), remarkedFor: 0 },
  pro: { prefix: "pro", role: "pro", clientId: null, stop: null, lastMarkedId: null, firstRender: true, drafts: new Map(), messages: [], seenIds: new Set(), remarkedFor: 0 },
};

function showView(name) {
  Object.entries(views).forEach(([key, element]) => {
    element.classList.toggle("hidden", key !== name);
  });
  document.body.classList.toggle("in-client", name === "client");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setMessage(element, message = "", type = "success") {
  element.textContent = message;
  element.classList.toggle("hidden", !message);
  element.classList.toggle("error", type === "error");
}

function setBusy(button, busy, busyText, normalText) {
  button.disabled = busy;
  button.textContent = busy ? busyText : normalText;
}

function selectedMode() {
  return document.querySelector('input[name="service-mode"]:checked')?.value || "self_guided";
}

function labelForMode(mode) {
  return mode === "professional_care" ? "Con seguimiento" : "Por mi cuenta";
}

function userHasCare(data) {
  return (data?.serviceMode || "self_guided") === "professional_care" || ["requested", "active"].includes(data?.careStatus);
}

// Consentimiento vigente: las dos casillas aceptadas y para la versión actual de la política.
function hasValidConsent(data) {
  const consent = data?.consent;
  return consent?.privacyAccepted === true
    && consent?.healthData === true
    && consent?.policyVersion === PRIVACY_POLICY_VERSION;
}

function missingConsentMessage(privacyChecked, healthChecked) {
  if (!privacyChecked && !healthChecked) return "marca las dos casillas: la del aviso legal y la política de privacidad y la del consentimiento para tus datos de salud.";
  if (!privacyChecked) return "marca la casilla de aceptación del aviso legal y la política de privacidad.";
  if (!healthChecked) return "marca la casilla de consentimiento para el tratamiento de tus datos de salud.";
  return "";
}

function resetConsentBoxes() {
  ["#consent-privacy", "#consent-health", "#consent-view-privacy", "#consent-view-health"].forEach((selector) => {
    const box = document.querySelector(selector);
    if (box) box.checked = false;
  });
}

function formatDate(value) {
  if (!value) return "Sin fecha";
  const date = typeof value?.toDate === "function" ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return "Sin fecha";
  return new Intl.DateTimeFormat("es-ES", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function formatTime(value) {
  const date = typeof value?.toDate === "function" ? value.toDate() : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("es-ES", { hour: "2-digit", minute: "2-digit" }).format(date);
}

function menuRowsFromText(value = "") {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const separator = line.includes("\t") ? "\t" : line.includes("|") ? "|" : null;
      return separator ? line.split(separator).map((cell) => cell.trim()) : [line];
    })
    .slice(0, 80);
}

function renderMenuTable(menuText) {
  const rows = menuRowsFromText(menuText);
  if (!rows.length) return null;
  const widestRow = Math.max(...rows.map((row) => row.length));
  if (widestRow === 1) {
    const text = document.createElement("p");
    text.className = "care-plan-menu-text";
    text.textContent = rows.map((row) => row[0]).join("\n");
    return text;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "care-plan-table-wrap";
  const table = document.createElement("table");
  table.className = "care-plan-table";
  const head = document.createElement("thead");
  const headRow = document.createElement("tr");
  for (let index = 0; index < widestRow; index += 1) {
    const th = document.createElement("th");
    th.scope = "col";
    th.textContent = rows[0][index] || `Columna ${index + 1}`;
    headRow.append(th);
  }
  head.append(headRow);
  const body = document.createElement("tbody");
  rows.slice(1).forEach((row) => {
    const tr = document.createElement("tr");
    for (let index = 0; index < widestRow; index += 1) {
      const cell = document.createElement("td");
      cell.textContent = row[index] || "";
      tr.append(cell);
    }
    body.append(tr);
  });
  table.append(head, body);
  wrapper.append(table);
  return wrapper;
}

function renderCarePlans(container, plans, userId) {
  const visiblePlans = plans.filter((plan) => plan.kind !== "body_check" && plan.kind !== "care_document_chunk");
  container.replaceChildren();
  if (!visiblePlans.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "Todavía no hay ningún plan publicado.";
    container.append(empty);
    return;
  }

  visiblePlans.forEach((plan, index) => {
    const article = document.createElement("article");
    article.className = "care-plan-card";
    const header = document.createElement("div");
    header.className = "care-plan-card-head";
    const heading = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = plan.title || "Plan de seguimiento";
    const date = document.createElement("small");
    date.textContent = plan.periodStart ? `Desde el ${formatDate(`${plan.periodStart}T12:00:00`)}` : `Publicado el ${formatDate(plan.createdAt)}`;
    heading.append(title, date);
    const badges = document.createElement("div");
    badges.className = "care-plan-card-badges";
    if (plan.attachment?.name) {
      const documentBadge = document.createElement("span");
      documentBadge.className = "care-plan-document-count";
      documentBadge.textContent = /\.pdf$/i.test(plan.attachment.name) ? "PDF incluido" : "Documento incluido";
      badges.append(documentBadge);
    }
    if (index === 0) {
      const badge = document.createElement("span");
      badge.className = "care-plan-latest";
      badge.textContent = "Actual";
      badges.append(badge);
    }
    header.append(heading, badges);
    article.append(header);

    if (plan.reviewFrequency || plan.nextReviewDate) {
      const schedule = document.createElement("div");
      schedule.className = "plan-schedule";
      if (plan.reviewFrequency) {
        const frequency = document.createElement("span");
        frequency.textContent = `Seguimiento ${reviewFrequencyLabel(plan.reviewFrequency).toLowerCase()}`;
        schedule.append(frequency);
      }
      if (plan.nextReviewDate) {
        const nextReview = document.createElement("span");
        nextReview.textContent = `Próxima revisión: ${formatDate(`${plan.nextReviewDate}T12:00:00`)}`;
        schedule.append(nextReview);
      }
      article.append(schedule);
    }

    const menu = renderMenuTable(plan.menuText || "");
    if (menu) {
      const menuHeading = document.createElement("h4");
      menuHeading.textContent = "Menú";
      article.append(menuHeading, menu);
    }
    if (plan.guidelines) {
      const guidelinesHeading = document.createElement("h4");
      guidelinesHeading.textContent = "Pautas";
      const guidelines = document.createElement("p");
      guidelines.className = "care-plan-guidelines";
      guidelines.textContent = plan.guidelines;
      article.append(guidelinesHeading, guidelines);
    }
    if (plan.attachment?.name) {
      const documentBox = document.createElement("div");
      const isPdf = plan.attachment.type === "application/pdf" || /\.pdf$/i.test(plan.attachment.name);
      documentBox.className = `care-document ${isPdf ? "is-pdf" : "is-word"}`;
      const documentInfo = document.createElement("span");
      const documentName = document.createElement("strong");
      documentName.textContent = plan.attachment.name;
      const documentMeta = document.createElement("small");
      documentMeta.textContent = `${isPdf ? "Documento PDF" : "Documento Word"} · ${formatFileSize(plan.attachment.size)}`;
      const documentStatus = document.createElement("small");
      documentStatus.className = "document-open-status hidden";
      documentInfo.append(documentName, documentMeta, documentStatus);
      const openButton = document.createElement("button");
      openButton.className = "document-link";
      openButton.type = "button";
      openButton.textContent = isPdf ? "Abrir PDF" : "Descargar Word";
      openButton.addEventListener("click", () => openCareDocument(userId, plan, openButton, documentStatus));
      documentBox.append(documentInfo, openButton);
      article.append(documentBox);
    }
    container.append(article);
  });
}

function formatFileSize(bytes) {
  const size = Number(bytes || 0);
  if (size < 1024) return `${size} B`;
  if (size >= 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`;
  return `${Math.round(size / 1024)} KB`;
}

const MAX_CARE_FILE_SIZE = 5 * 1024 * 1024;

function validateCareFile(file) {
  const allowedExtensions = /\.(pdf|doc|docx)$/i;
  if (!allowedExtensions.test(file.name)) throw new Error("El documento debe ser un PDF o un archivo Word.");
  if (file.size > MAX_CARE_FILE_SIZE) throw new Error(`El documento ${file.name} supera los 5 MB permitidos.`);
}

function openBlob(blob, name, previewWindow = null) {
  const url = URL.createObjectURL(blob);
  const isPdf = blob.type === "application/pdf" || /\.pdf$/i.test(name);
  if (isPdf && previewWindow) {
    previewWindow.location.replace(url);
  } else {
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    if (isPdf) link.target = "_blank";
    document.body.append(link);
    link.click();
    link.remove();
  }
  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
}

async function careApi(path, options = {}) {
  if (!state.user) throw new Error("Inicia sesión de nuevo.");
  const token = await state.user.getIdToken();
  const headers = new Headers(options.headers || {});
  headers.set("Authorization", `Bearer ${token}`);
  const response = await fetch(`${CARE_API_BASE}${path}`, { ...options, headers });
  if (!response.ok) {
    let message = "No se ha podido completar la operación.";
    try {
      const payload = await response.json();
      if (payload?.error) message = payload.error;
    } catch {
      // El servidor puede responder sin cuerpo cuando está temporalmente indisponible.
    }
    throw new Error(message);
  }
  return response;
}

async function fetchCarePlans(userId) {
  const response = await careApi(`/api/care-plans?clientId=${encodeURIComponent(userId)}`);
  const payload = await response.json();
  return Array.isArray(payload.plans) ? payload.plans : [];
}

async function publishCarePlan(fields, file = null) {
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== null && value !== undefined) form.append(key, String(value));
  });
  if (file) form.append("file", file, file.name);
  const response = await careApi("/api/care-plans", { method: "POST", body: form });
  return response.json();
}

async function openCareDocument(userId, plan, button, status) {
  const isPdf = plan.attachment.type === "application/pdf" || /\.pdf$/i.test(plan.attachment.name);
  const previewWindow = isPdf ? window.open("", "_blank") : null;
  if (previewWindow) {
    previewWindow.document.title = "Abriendo documento…";
    previewWindow.document.body.textContent = "Abriendo documento…";
  }
  const idleText = button.textContent;
  button.disabled = true;
  button.textContent = "Abriendo…";
  status.classList.add("hidden");
  try {
    const response = await careApi(`/api/care-files?clientId=${encodeURIComponent(userId)}&planId=${encodeURIComponent(plan.id)}`);
    const blob = await response.blob();
    openBlob(blob, plan.attachment.name, previewWindow);
  } catch (error) {
    if (previewWindow) previewWindow.close();
    status.textContent = "No se ha podido abrir. Vuelve a intentarlo.";
    status.classList.remove("hidden");
  } finally {
    button.disabled = false;
    button.textContent = idleText;
  }
}

// ¿Sigue en pantalla la persona para la que se pidieron estos datos? Evita que una respuesta lenta
// de una persona se pinte (o se vuelva a publicar) bajo el nombre de otra.
function isCurrentTarget(userId, containerSelector) {
  return containerSelector.startsWith("#client-")
    ? state.user?.uid === userId
    : state.selectedClientId === userId;
}

async function loadCarePlans(userId, containerSelector) {
  const container = document.querySelector(containerSelector);
  container.innerHTML = '<p class="empty-state">Cargando menús y pautas…</p>';
  try {
    const plans = await fetchCarePlans(userId);
    if (!isCurrentTarget(userId, containerSelector)) return [];
    renderCarePlans(container, plans, userId);
    return plans;
  } catch (error) {
    if (!isCurrentTarget(userId, containerSelector)) return [];
    container.innerHTML = '<p class="form-message error">No se han podido cargar los menús y pautas.</p>';
    return [];
  }
}

function todayId() {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

const progressMetrics = [
  { key: "weight", label: "Peso", unit: "kg", color: "#2e6f57" },
  { key: "bodyFat", label: "Grasa corporal", unit: "%", color: "#d97706" },
  { key: "muscleMass", label: "Masa muscular", unit: "kg", color: "#2563eb" },
  { key: "waist", label: "Cintura", unit: "cm", color: "#9333ea" },
];

function numericInput(selector) {
  const raw = document.querySelector(selector).value;
  if (raw === "") return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

function metricStatus(client) {
  if (client.careStatus === "active") return { label: "Seguimiento activo", className: "active" };
  if (client.careStatus === "requested" || client.serviceMode === "professional_care") {
    return { label: "Seguimiento solicitado", className: "requested" };
  }
  return { label: "Por mi cuenta", className: "self" };
}

function renderProgressChart(container, measurements) {
  container.replaceChildren();
  container.className = "progress-visual";
  const series = progressMetrics.map((metric) => ({
    ...metric,
    points: measurements
      .map((measurement, index) => ({ index, date: measurement.date || measurement.id, value: Number(measurement[metric.key]) }))
      .filter((point) => Number.isFinite(point.value) && point.value > 0),
  })).filter((metric) => metric.points.length);

  if (!series.length) {
    container.classList.add("empty-state");
    container.textContent = "Añade la primera medición para comenzar la gráfica.";
    return;
  }

  const summary = document.createElement("div");
  summary.className = "progress-summary";
  series.forEach((metric) => {
    const item = document.createElement("div");
    item.className = "progress-metric";
    const label = document.createElement("span");
    const dot = document.createElement("i");
    dot.style.backgroundColor = metric.color;
    label.append(dot, document.createTextNode(metric.label));
    const latest = document.createElement("strong");
    latest.textContent = `${metric.points.at(-1).value.toLocaleString("es-ES", { maximumFractionDigits: 1 })} ${metric.unit}`;
    item.append(label, latest);
    summary.append(item);
  });

  const weightSeries = series.find((metric) => metric.key === "weight");
  const chartNodes = [summary];
  if (weightSeries) chartNodes.push(renderWeightChart(weightSeries.points));
  if (!series.some((metric) => metric.key !== "weight")) {
    container.append(...chartNodes);
    renderMeasurementTimeline(container, measurements);
    return;
  }

  const width = 760;
  const height = 310;
  const margin = { top: 24, right: 28, bottom: 48, left: 58 };
  const graphWidth = width - margin.left - margin.right;
  const graphHeight = height - margin.top - margin.bottom;
  const totalPositions = Math.max(measurements.length - 1, 1);
  const percentageSeries = series.map((metric) => {
    const baseline = metric.points[0].value;
    return {
      ...metric,
      points: metric.points.map((point) => ({ ...point, change: ((point.value / baseline) - 1) * 100 })),
    };
  });
  const maxAbsoluteChange = Math.max(0, ...percentageSeries.flatMap((metric) => metric.points.map((point) => Math.abs(point.change))));
  const extent = Math.max(5, Math.ceil(maxAbsoluteChange / 5) * 5);
  const x = (index) => margin.left + (index / totalPositions) * graphWidth;
  const y = (value) => margin.top + ((extent - value) / (extent * 2)) * graphHeight;
  const svgNamespace = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNamespace, "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Evolución porcentual del peso y la composición corporal");

  [extent, extent / 2, 0, -extent / 2, -extent].forEach((tick) => {
    const line = document.createElementNS(svgNamespace, "line");
    line.setAttribute("x1", margin.left);
    line.setAttribute("x2", width - margin.right);
    line.setAttribute("y1", y(tick));
    line.setAttribute("y2", y(tick));
    line.setAttribute("class", tick === 0 ? "chart-zero" : "chart-grid");
    const label = document.createElementNS(svgNamespace, "text");
    label.setAttribute("x", margin.left - 10);
    label.setAttribute("y", y(tick) + 4);
    label.setAttribute("class", "chart-axis-label");
    label.setAttribute("text-anchor", "end");
    label.textContent = `${tick > 0 ? "+" : ""}${Number(tick.toFixed(1))}%`;
    svg.append(line, label);
  });

  percentageSeries.forEach((metric) => {
    if (metric.points.length > 1) {
      const path = document.createElementNS(svgNamespace, "path");
      path.setAttribute("d", metric.points.map((point, index) => `${index ? "L" : "M"} ${x(point.index)} ${y(point.change)}`).join(" "));
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", metric.color);
      path.setAttribute("stroke-width", "4");
      path.setAttribute("stroke-linecap", "round");
      path.setAttribute("stroke-linejoin", "round");
      svg.append(path);
    }
    metric.points.forEach((point) => {
      const circle = document.createElementNS(svgNamespace, "circle");
      circle.setAttribute("cx", x(point.index));
      circle.setAttribute("cy", y(point.change));
      circle.setAttribute("r", "5");
      circle.setAttribute("fill", metric.color);
      circle.setAttribute("stroke", "white");
      circle.setAttribute("stroke-width", "2");
      svg.append(circle);
    });
  });

  const dateIndexes = [...new Set([0, Math.floor((measurements.length - 1) / 2), measurements.length - 1])];
  dateIndexes.forEach((index) => {
    const label = document.createElementNS(svgNamespace, "text");
    label.setAttribute("x", x(index));
    label.setAttribute("y", height - 15);
    label.setAttribute("class", "chart-date-label");
    label.setAttribute("text-anchor", index === 0 ? "start" : index === measurements.length - 1 ? "end" : "middle");
    label.textContent = formatDate(`${measurements[index].date || measurements[index].id}T12:00:00`);
    svg.append(label);
  });

  const chartScroll = document.createElement("div");
  chartScroll.className = "progress-chart-scroll";
  chartScroll.append(svg);
  const note = document.createElement("p");
  note.className = "progress-note";
  note.textContent = "Las líneas muestran el cambio porcentual respecto al primer registro de cada medida.";
  if (weightSeries) {
    const compositionTitle = document.createElement("h3");
    compositionTitle.className = "progress-subtitle";
    compositionTitle.textContent = "Todas las medidas: cambio en %";
    chartNodes.push(compositionTitle);
  }
  container.append(...chartNodes, chartScroll, note);
  renderMeasurementTimeline(container, measurements);
}

function renderWeightChart(points) {
  const wrapper = document.createElement("div");
  wrapper.className = "weight-chart";
  const sorted = [...points].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const first = sorted[0];
  const last = sorted.at(-1);
  const head = document.createElement("div");
  head.className = "weight-chart-head";
  const latest = document.createElement("strong");
  latest.textContent = `${last.value.toLocaleString("es-ES", { maximumFractionDigits: 1 })} kg`;
  const delta = document.createElement("span");
  delta.className = "weight-delta";
  if (sorted.length > 1) {
    const change = last.value - first.value;
    delta.textContent = `${change > 0 ? "+" : ""}${change.toLocaleString("es-ES", { minimumFractionDigits: 1, maximumFractionDigits: 1 })} kg desde el ${formatDate(`${first.date}T12:00:00`)}`;
  } else {
    delta.textContent = "Tu primer registro";
  }
  head.append(latest, delta);

  const width = 640;
  const height = 220;
  const pad = { top: 16, right: 18, bottom: 30, left: 42 };
  const time = (point) => new Date(`${point.date}T12:00:00`).getTime();
  const t0 = time(first);
  const t1 = time(last);
  const span = t1 - t0 || 1;
  const values = sorted.map((point) => point.value);
  let low = Math.floor(Math.min(...values) - 0.5);
  let high = Math.ceil(Math.max(...values) + 0.5);
  if (high - low < 2) high = low + 2;
  // Paso «redondo» para que el eje tenga como mucho 6 tramos (unas 7 etiquetas), aunque el rango sea grande.
  const step = [1, 2, 5, 10, 20, 50, 100].find((candidate) => (high - low) / candidate <= 6) || 100;
  low = Math.floor(low / step) * step;
  high = Math.ceil(high / step) * step;
  const x = (point) => sorted.length === 1 ? width / 2 : pad.left + (width - pad.left - pad.right) * ((time(point) - t0) / span);
  const y = (value) => pad.top + (height - pad.top - pad.bottom) * (1 - (value - low) / (high - low));
  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", `Evolución del peso: ${sorted.length} registros, último ${last.value.toLocaleString("es-ES")} kg`);
  const make = (tag, attrs) => {
    const node = document.createElementNS(ns, tag);
    Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
    svg.append(node);
    return node;
  };
  for (let tick = low; tick <= high; tick += step) {
    make("line", { x1: pad.left, x2: width - pad.right, y1: y(tick), y2: y(tick), class: "weight-grid" });
    make("text", { x: pad.left - 8, y: y(tick) + 4, "text-anchor": "end", class: "weight-axis" }).textContent = String(tick);
  }
  const coords = sorted.map((point) => [x(point), y(point.value)]);
  const line = coords.map(([cx, cy], index) => `${index ? "L" : "M"}${cx.toFixed(1)} ${cy.toFixed(1)}`).join(" ");
  if (coords.length > 1) {
    make("path", { d: `${line} L${coords.at(-1)[0].toFixed(1)} ${height - pad.bottom} L${coords[0][0].toFixed(1)} ${height - pad.bottom} Z`, class: "weight-area" });
    make("path", { d: line, class: "weight-line" });
  }
  coords.forEach(([cx, cy], index) => {
    const isLast = index === coords.length - 1;
    make("circle", { cx, cy, r: isLast ? 6 : 3.5, class: isLast ? "weight-last" : "weight-point" });
  });
  const labels = sorted.length > 1 ? [[first, "start", pad.left], [last, "end", width - pad.right]] : [[first, "middle", width / 2]];
  labels.forEach(([point, anchor, lx]) => {
    make("text", { x: lx, y: height - 8, "text-anchor": anchor, class: "weight-axis" }).textContent = formatDate(`${point.date}T12:00:00`);
  });
  wrapper.append(head, svg);
  return wrapper;
}

function renderMeasurementTimeline(container, measurements) {
  const timeline = document.createElement("div");
  timeline.className = "measurement-timeline";
  measurements.slice().reverse().slice(0, 8).forEach((measurement) => {
    const record = document.createElement("article");
    record.className = "measurement-record";
    const head = document.createElement("div");
    head.className = "measurement-record-head";
    const date = document.createElement("strong");
    date.textContent = formatDate(`${measurement.date || measurement.id}T12:00:00`);
    const source = document.createElement("small");
    source.textContent = measurement.source === "professional" ? "Control profesional" : "Registro personal";
    head.append(date, source);
    const values = progressMetrics
      .filter((metric) => Number.isFinite(Number(measurement[metric.key])) && Number(measurement[metric.key]) > 0)
      .map((metric) => `${metric.label}: ${Number(measurement[metric.key]).toLocaleString("es-ES", { maximumFractionDigits: 1 })} ${metric.unit}`);
    const valuesText = document.createElement("p");
    valuesText.className = "measurement-record-values";
    valuesText.textContent = values.join(" · ");
    record.append(head, valuesText);
    if (measurement.assessment) {
      const assessment = document.createElement("p");
      assessment.className = "measurement-assessment";
      assessment.textContent = measurement.assessment;
      record.append(assessment);
    }
    timeline.append(record);
  });
  container.append(timeline);
}

function reviewFrequencyLabel(value) {
  return { weekly: "Semanal", biweekly: "Quincenal", monthly: "Mensual" }[value] || "Semanal";
}

function reviewTitle(value) {
  return `Menú ${reviewFrequencyLabel(value).toLowerCase()}`;
}

function addReviewInterval(dateValue, frequency = "weekly") {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue || "")) return null;
  const date = new Date(`${dateValue}T12:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  if (frequency === "monthly") {
    const originalDay = date.getDate();
    date.setDate(1);
    date.setMonth(date.getMonth() + 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    date.setDate(Math.min(originalDay, lastDay));
  } else {
    date.setDate(date.getDate() + (frequency === "biweekly" ? 15 : 7));
  }
  return date.toISOString().slice(0, 10);
}

function nextCheckDate(measurements, frequency = document.querySelector("#review-frequency")?.value || "weekly") {
  const latest = measurements.at(-1);
  return addReviewInterval(latest?.date || todayId(), frequency);
}

function updateNextCheck(measurements) {
  const badge = document.querySelector("#next-check-date");
  if (!badge) return;
  const chosenDate = document.querySelector("#next-review-date")?.value;
  const nextDate = chosenDate || nextCheckDate(measurements);
  badge.textContent = nextDate ? `Próxima revisión: ${formatDate(`${nextDate}T12:00:00`)}` : "Fecha de revisión pendiente";
}

async function loadProgressMeasurements(userId, containerSelector) {
  const container = document.querySelector(containerSelector);
  container.textContent = "Cargando evolución…";
  container.className = "progress-visual empty-state";
  // En el espacio de la propia persona, los controles del profesional (API de archivos) solo se
  // piden si tiene seguimiento: así no se envía su sesión a esa API si va por su cuenta.
  const includeCareChecks = containerSelector !== "#client-progress-chart" || userHasCare(state.userData);
  try {
    const [personalSnapshot, carePlans] = await Promise.all([
      getDocs(query(collection(db, "users", userId, "progressMeasurements"), orderBy("date", "desc"), limit(90))),
      includeCareChecks ? fetchCarePlans(userId).catch(() => []) : Promise.resolve([]),
    ]);
    if (!isCurrentTarget(userId, containerSelector)) return [];
    const byDate = new Map();
    personalSnapshot.docs.forEach((item) => {
      const measurement = { id: item.id, source: "personal", ...item.data() };
      byDate.set(measurement.date || item.id, measurement);
    });
    carePlans.forEach((data) => {
      if (data.kind !== "body_check" || !data.date) return;
      byDate.set(data.date, { ...(byDate.get(data.date) || {}), id: data.id, source: "professional", ...data });
    });
    const measurements = [...byDate.values()].sort((a, b) => String(a.date || a.id).localeCompare(String(b.date || b.id)));
    renderProgressChart(container, measurements);
    if (containerSelector === "#detail-progress-chart") {
      state.selectedClientMeasurements = measurements;
      updateNextCheck(measurements);
    }
    return measurements;
  } catch (error) {
    if (!isCurrentTarget(userId, containerSelector)) return [];
    container.textContent = "No se ha podido cargar la evolución.";
    if (containerSelector === "#detail-progress-chart") {
      state.selectedClientMeasurements = [];
      updateNextCheck([]);
    }
    return [];
  }
}

function readableGoal(value) {
  return {
    loseFat: "Perder grasa",
    gainMuscle: "Ganar masa muscular",
    maintain: "Mantenerse",
    improveHealth: "Mejorar la salud",
  }[value] || "Sin completar";
}

function readableActivity(value) {
  return { low: "Baja", moderate: "Moderada", high: "Alta" }[value] || "Sin completar";
}

function currentNutritionTarget() {
  return nutritionTargetFromUserData(state.userData || {});
}

function renderPersonalRecipe() {
  const select = document.querySelector("#personal-recipe-select");
  const container = document.querySelector("#personal-recipe-result");
  const recipes = window.PAUTA_RECIPES || [];
  const recipe = recipes.find((item) => recipeSlug(item.title) === select.value) || recipes[0];
  if (!recipe) {
    container.innerHTML = '<p class="empty-state">Las recetas no están disponibles en este momento.</p>';
    return;
  }
  const target = currentNutritionTarget();
  if (!target) {
    document.querySelector("#personal-recipe-target").textContent = "Perfil pendiente";
    container.innerHTML = '<p class="empty-state">Completa primero tus datos y tu objetivo para que podamos calcular tus cantidades automáticamente.</p>';
    return;
  }
  const personalized = personalizedRecipe(recipe, target);
  document.querySelector("#personal-recipe-target").textContent = `Referencia actual: ${target.toLocaleString("es-ES")} kcal/día`;

  const article = document.createElement("article");
  article.className = "recipe-result-card";
  const image = document.createElement("img");
  image.src = `/assets/recipes/${recipe.category}/${recipeSlug(recipe.title)}.webp`;
  image.alt = recipe.title;
  image.loading = "lazy";
  const content = document.createElement("div");
  content.className = "recipe-result-content";
  const title = document.createElement("h3");
  title.textContent = recipe.title;
  const meta = document.createElement("div");
  meta.className = "recipe-result-meta";
  [recipeCategoryLabels[recipe.category] || recipe.category, recipe.time, "Cantidades para tu ración"].forEach((value) => {
    const chip = document.createElement("span");
    chip.textContent = value;
    meta.append(chip);
  });
  const ingredients = document.createElement("ul");
  ingredients.className = "personal-ingredients";
  personalized.ingredients.forEach((ingredient) => {
    const item = document.createElement("li");
    item.textContent = ingredient;
    ingredients.append(item);
  });
  const actions = document.createElement("div");
  actions.className = "recipe-result-actions";
  const link = document.createElement("a");
  link.href = `/recetas/#${recipeSlug(recipe.title)}`;
  link.textContent = "Ver preparación completa";
  const scale = document.createElement("small");
  scale.textContent = `Ración orientativa ajustada al ${personalized.portionPercent} % de la referencia base.`;
  actions.append(link, scale);
  content.append(title, meta, ingredients, actions);
  article.append(image, content);
  container.replaceChildren(article);
}

function prepareRecipeCalculator() {
  const recipes = window.PAUTA_RECIPES || [];
  const select = document.querySelector("#personal-recipe-select");
  const current = select.value;
  select.replaceChildren();
  Object.entries(recipeCategoryLabels).forEach(([category, label]) => {
    const group = document.createElement("optgroup");
    group.label = label;
    recipes.filter((recipe) => recipe.category === category).forEach((recipe) => {
      const option = document.createElement("option");
      option.value = recipeSlug(recipe.title);
      option.textContent = recipe.title;
      group.append(option);
    });
    select.append(group);
  });
  const requested = new URLSearchParams(window.location.search).get("recipe");
  const preferred = requested && recipes.some((recipe) => recipeSlug(recipe.title) === requested) ? requested : current;
  if (preferred) select.value = preferred;
  renderPersonalRecipe();
  if (requested && !state.recipeDeepLinkHandled) {
    state.recipeDeepLinkHandled = true;
    window.setTimeout(() => document.querySelector("#personal-recipe-calculator").scrollIntoView({ behavior: "smooth", block: "start" }), 150);
  }
}

document.querySelector("#personal-recipe-select").addEventListener("change", renderPersonalRecipe);
document.querySelector("#personal-recipe-calculate").addEventListener("click", renderPersonalRecipe);

function authErrorMessage(error) {
  const code = error?.code || "";
  if (code.includes("email-already-in-use")) return "Ya existe una cuenta con este correo.";
  if (code.includes("invalid-email")) return "Introduce un correo válido.";
  if (code.includes("weak-password")) return "La contraseña debe tener al menos 6 caracteres.";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")) return "El correo o la contraseña no son correctos.";
  if (code.includes("too-many-requests")) return "Demasiados intentos. Espera unos minutos.";
  if (code.includes("network-request-failed")) return "No hay conexión. Comprueba internet e inténtalo de nuevo.";
  return "No se ha podido completar el acceso. Inténtalo de nuevo.";
}

function configureAuthMode(registering) {
  state.registering = registering;
  const registerTab = document.querySelector("#register-tab");
  const loginTab = document.querySelector("#login-tab");
  const modeFieldset = document.querySelector("#mode-fieldset");
  const consentField = document.querySelector("#consent-field");
  const password = document.querySelector("#password");
  const submit = document.querySelector("#auth-submit");
  registerTab.classList.toggle("active", registering);
  loginTab.classList.toggle("active", !registering);
  registerTab.setAttribute("aria-selected", String(registering));
  loginTab.setAttribute("aria-selected", String(!registering));
  modeFieldset.classList.toggle("hidden", !registering);
  consentField.classList.toggle("hidden", !registering);
  document.querySelector("#auth-title").textContent = registering ? "Crea tu cuenta" : "Bienvenido de nuevo";
  document.querySelector("#auth-subtitle").textContent = registering ? "Empieza en Pauta Posible y guarda tu progreso." : "Accede a tu perfil y continúa donde lo dejaste.";
  password.autocomplete = registering ? "new-password" : "current-password";
  submit.textContent = registering ? "Crear cuenta y continuar" : "Entrar en mi cuenta";
  setMessage(document.querySelector("#auth-error"));
}

document.querySelector("#register-tab").addEventListener("click", () => configureAuthMode(true));
document.querySelector("#login-tab").addEventListener("click", () => configureAuthMode(false));

document.querySelectorAll('.mode-card input[type="radio"]').forEach((input) => {
  input.addEventListener("change", () => {
    document.querySelectorAll(".mode-card").forEach((card) => {
      card.classList.toggle("selected", card.querySelector("input").checked);
    });
  });
});

const initialMode = new URLSearchParams(window.location.search).get("mode");
// Los enlaces «App» de la web llevan ?vista=app: así una cuenta profesional abre su propia app
// (diario y escáner) en lugar del panel de seguimiento.
const wantsOwnApp = new URLSearchParams(window.location.search).get("vista") === "app";
const requestedRecipe = new URLSearchParams(window.location.search).get("recipe");

function returnToRequestedRecipe() {
  if (!requestedRecipe) return false;
  const available = (window.PAUTA_RECIPES || []).some((recipe) => recipeSlug(recipe.title) === requestedRecipe);
  if (!available) return false;
  window.location.replace(`/recetas/?recipe=${encodeURIComponent(requestedRecipe)}#${encodeURIComponent(requestedRecipe)}`);
  return true;
}
if (initialMode === "care" || initialMode === "professional_care") {
  const careRadio = document.querySelector('input[value="professional_care"]');
  careRadio.checked = true;
  careRadio.dispatchEvent(new Event("change"));
}

document.querySelector("#auth-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.querySelector("#email").value.trim();
  const password = document.querySelector("#password").value;
  const errorElement = document.querySelector("#auth-error");
  const submit = document.querySelector("#auth-submit");
  setMessage(errorElement);

  if (!email.includes("@") || password.length < 6) {
    setMessage(errorElement, "Introduce un correo válido y una contraseña de al menos 6 caracteres.", "error");
    return;
  }
  // Dos casillas separadas: aceptar el aviso legal y la política, y dar el consentimiento para los datos de salud.
  const privacyBox = document.querySelector("#consent-privacy");
  const healthBox = document.querySelector("#consent-health");
  const missingConsent = state.registering ? missingConsentMessage(privacyBox.checked, healthBox.checked) : "";
  if (missingConsent) {
    setMessage(errorElement, `Para crear la cuenta, ${missingConsent}`, "error");
    return;
  }

  setBusy(submit, true, "Conectando…", state.registering ? "Crear cuenta y continuar" : "Entrar en mi cuenta");
  try {
    if (state.registering) {
      const mode = selectedMode();
      const consent = { privacyAccepted: privacyBox.checked, healthData: healthBox.checked };
      let finishRegistration = () => {};
      state.pendingRegistration = new Promise((resolve) => { finishRegistration = resolve; });
      state.pendingRegistrationMode = mode;
      try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", result.user.uid), {
          uid: result.user.uid,
          email: result.user.email?.trim().toLowerCase() || email.toLowerCase(),
          role: "client",
          environment: "beta",
          serviceMode: mode,
          careStatus: mode === "professional_care" ? "requested" : "self_guided",
          reviewFrequency: mode === "professional_care" ? "weekly" : null,
          careRequestedAt: mode === "professional_care" ? serverTimestamp() : null,
          profileCompleted: false,
          consent: {
            privacyAccepted: consent.privacyAccepted,
            healthData: consent.healthData,
            policyVersion: PRIVACY_POLICY_VERSION,
            acceptedAt: serverTimestamp(),
          },
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          lastActiveAt: serverTimestamp(),
        });
        resetConsentBoxes();
      } finally {
        state.pendingRegistration = null;
        finishRegistration();
      }
    } else {
      await signInWithEmailAndPassword(auth, email, password);
    }
  } catch (error) {
    setMessage(errorElement, authErrorMessage(error), "error");
  } finally {
    setBusy(submit, false, "", state.registering ? "Crear cuenta y continuar" : "Entrar en mi cuenta");
  }
});

document.querySelectorAll(".sign-out").forEach((button) => {
  button.addEventListener("click", async () => {
    await signOut(auth);
    // Recargar borra de la pestaña todo lo que se había pintado de la cuenta (mensajes, borradores,
    // pesos, fichas), para que la siguiente persona que use este dispositivo no pueda verlo.
    window.location.reload();
  });
});

// Pantalla de consentimiento: para cuentas sin consentimiento registrado (anteriores a este cambio,
// o si no se pudo guardar al crearlas) y cuando cambia la versión de la política de privacidad.
document.querySelector("#consent-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.user) return;
  const privacyBox = document.querySelector("#consent-view-privacy");
  const healthBox = document.querySelector("#consent-view-health");
  const errorElement = document.querySelector("#consent-error");
  const submit = document.querySelector("#consent-submit");
  setMessage(errorElement);
  const missing = missingConsentMessage(privacyBox.checked, healthBox.checked);
  if (missing) {
    setMessage(errorElement, `Para continuar, ${missing}`, "error");
    return;
  }
  const consent = { privacyAccepted: privacyBox.checked, healthData: healthBox.checked, policyVersion: PRIVACY_POLICY_VERSION };
  setBusy(submit, true, "Guardando…", "Aceptar y continuar");
  try {
    await setDoc(doc(db, "users", state.user.uid), {
      consent: { ...consent, acceptedAt: serverTimestamp() },
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    setMessage(errorElement, "No se ha podido guardar tu consentimiento. Revisa tu conexión e inténtalo de nuevo.", "error");
    return;
  } finally {
    setBusy(submit, false, "", "Aceptar y continuar");
  }
  state.userData = { ...state.userData, consent: { ...consent, acceptedAt: new Date() } };
  resetConsentBoxes();
  await enterClientArea();
});

document.querySelector("#profile-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.user) return;
  const submit = event.currentTarget.querySelector('button[type="submit"]');
  const message = document.querySelector("#profile-message");
  const profile = {
    name: document.querySelector("#profile-name").value.trim(),
    age: Number(document.querySelector("#profile-age").value),
    gender: document.querySelector("#profile-gender").value,
    height: Number(document.querySelector("#profile-height").value),
    weight: Number(document.querySelector("#profile-weight").value),
    goal: document.querySelector("#profile-goal").value,
    activityLevel: document.querySelector("#profile-activity").value,
    createdAt: state.userData?.profile?.createdAt || new Date().toISOString(),
  };
  Object.assign(profile, calculateNutrition(profile));
  const whatsappRaw = document.querySelector("#profile-whatsapp").value.trim();
  const whatsappPhone = normalizeWhatsapp(whatsappRaw);
  if (whatsappRaw && !whatsappPhone) {
    setMessage(message, "Revisa el móvil: escribe solo números, con el prefijo del país si no es de España.", "error");
    return;
  }
  setBusy(submit, true, "Guardando…", "Guardar y entrar");
  setMessage(message);
  try {
    await setDoc(doc(db, "users", state.user.uid), {
      profile,
      whatsappPhone,
      profileCompleted: true,
      updatedAt: serverTimestamp(),
      lastActiveAt: serverTimestamp(),
    }, { merge: true });
    state.userData = { ...state.userData, profile, whatsappPhone, profileCompleted: true };
    if (returnToRequestedRecipe()) return;
    await showClientWorkspace();
  } catch (error) {
    setMessage(message, "No se ha podido guardar el perfil. Inténtalo de nuevo.", "error");
  } finally {
    setBusy(submit, false, "", "Guardar y entrar");
  }
});

document.querySelector("#edit-profile").addEventListener("click", () => {
  populateProfileForm(state.userData?.profile || {});
  syncDeleteAccount();
  showView("profile");
});

// «Eliminar mi cuenta» (lo exige Google Play): solo aparece al editar un perfil ya creado. Marca la
// petición en el documento de la persona; el borrado lo hace el profesional desde Firebase.
function syncDeleteAccount() {
  const section = document.querySelector("#delete-account");
  const requested = state.userData?.deletionRequested === true;
  section.classList.toggle("hidden", !state.userData?.profileCompleted);
  document.querySelector("#delete-account-request").classList.toggle("hidden", requested);
  setMessage(
    document.querySelector("#delete-account-message"),
    requested ? "Ya hemos recibido tu petición. Borraremos tu cuenta en un máximo de 30 días y te avisaremos por correo." : "",
  );
}

document.querySelector("#delete-account-request").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  if (!state.user) return;
  if (!window.confirm("¿Seguro que quieres que borremos tu cuenta y todos tus datos? No se puede deshacer.")) return;
  setBusy(button, true, "Enviando…", "Pedir que se borre mi cuenta");
  try {
    await setDoc(doc(db, "users", state.user.uid), {
      deletionRequested: true,
      deletionRequestedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
    state.userData = { ...state.userData, deletionRequested: true };
    syncDeleteAccount();
  } catch (error) {
    console.error(error);
    setMessage(document.querySelector("#delete-account-message"), "No se ha podido enviar. Escríbenos a hola@pautaposible.es con el asunto «Eliminar mi cuenta».", "error");
  } finally {
    setBusy(button, false, "Enviando…", "Pedir que se borre mi cuenta");
  }
});

function populateProfileForm(profile) {
  document.querySelector("#profile-name").value = profile.name || "";
  document.querySelector("#profile-age").value = profile.age || "";
  document.querySelector("#profile-gender").value = profile.gender || "";
  document.querySelector("#profile-height").value = profile.height || "";
  document.querySelector("#profile-weight").value = profile.weight || "";
  document.querySelector("#profile-goal").value = profile.goal || "";
  document.querySelector("#profile-activity").value = profile.activityLevel || "";
  document.querySelector("#profile-whatsapp").value = state.userData?.whatsappPhone ? `+${state.userData.whatsappPhone}` : "";
}

// Móvil para el aviso de WhatsApp: se guarda solo con números y prefijo de país (sin «+»),
// que es como lo pide wa.me. Un número español de 9 cifras sin prefijo recibe el 34.
// Devuelve "" si está vacío y null si no parece un número válido.
function normalizeWhatsapp(value) {
  if (!value) return "";
  let digits = value.replace(/[^0-9+]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  else if (digits.startsWith("00")) digits = digits.slice(2);
  else if (/^[6-9]\d{8}$/.test(digits)) digits = `34${digits}`;
  return /^[1-9]\d{8,14}$/.test(digits) ? digits : null;
}

// Solo crea el documento si no existe. routeAuthenticatedUser espera antes a que termine el guardado
// del registro, así que nunca se escribe encima del documento con el consentimiento.
// mode: la modalidad elegida al registrarse, por si el guardado del registro falló.
async function ensureUserDocument(user, mode = "self_guided") {
  const ref = doc(db, "users", user.uid);
  const snapshot = await getDoc(ref);
  if (snapshot.exists()) return snapshot.data();
  const wantsCare = mode === "professional_care";
  const data = {
    uid: user.uid,
    email: user.email?.trim().toLowerCase() || "",
    role: "client",
    environment: "beta",
    serviceMode: wantsCare ? "professional_care" : "self_guided",
    careStatus: wantsCare ? "requested" : "self_guided",
    ...(wantsCare ? { reviewFrequency: "weekly", careRequestedAt: serverTimestamp() } : {}),
    profileCompleted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastActiveAt: serverTimestamp(),
  };
  await setDoc(ref, data);
  return data;
}

async function isProfessional(user) {
  const [adminSnapshot, professionalSnapshot] = await Promise.all([
    getDoc(doc(db, "admins", user.uid)),
    getDoc(doc(db, "professionals", user.uid)),
  ]);
  return adminSnapshot.exists() || professionalSnapshot.exists();
}

// Entrada al espacio personal: primero el consentimiento, luego el perfil y después el espacio.
async function enterClientArea() {
  if (!hasValidConsent(state.userData)) {
    resetConsentBoxes();
    setMessage(document.querySelector("#consent-error"));
    document.querySelector("#consent-back-professional").classList.toggle("hidden", !state.isProfessional);
    showView("consent");
    return;
  }
  if (!state.userData.profileCompleted || !state.userData.profile?.name) {
    populateProfileForm(state.userData.profile || {});
    document.querySelector("#delete-account").classList.add("hidden");
    showView("profile");
    return;
  }
  if (returnToRequestedRecipe()) return;
  await showClientWorkspace();
}

async function showClientWorkspace() {
  const profile = state.userData?.profile || {};
  const mode = state.userData?.serviceMode || "self_guided";
  const hasCare = userHasCare(state.userData);
  document.querySelector("#client-greeting").textContent = profile.name ? `Hola, ${profile.name}` : "Hola";
  document.querySelector("#client-mode").textContent = labelForMode(mode);
  const dateText = new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long" }).format(new Date());
  document.querySelector("#client-date").textContent = dateText.charAt(0).toUpperCase() + dateText.slice(1);
  document.querySelector("#open-professional").classList.toggle("hidden", !state.isProfessional);
  document.querySelector("#care-plan-section").classList.toggle("hidden", !hasCare);
  syncClientChat(hasCare);
  const quickDate = document.querySelector("#quick-weight-date");
  if (!quickDate.value) quickDate.value = todayId();
  const progressDate = document.querySelector("#progress-date");
  if (!progressDate.value) progressDate.value = todayId();
  // El peso de «Medición completa» ya no se rellena con el del perfil: si no, al guardar solo la
  // cintura se escribiría ese peso antiguo encima del que se acaba de apuntar con «Añadir».
  prepareRecipeCalculator();
  // Aviso para instalar la app; no aparece si ya se ha abierto desde el icono instalado.
  const installed = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  document.querySelector("#install-banner").classList.toggle("hidden", installed);
  showView("client");
  showTab(requestedRecipe ? "comida" : savedTab());
  const loaders = [loadClientDays(), loadClientProgress()];
  if (hasCare) loaders.push(loadCarePlans(state.user.uid, "#client-care-plan"));
  await Promise.all(loaders);
}

document.querySelector("#progress-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.user) return;
  const submit = event.currentTarget.querySelector('button[type="submit"]');
  const message = document.querySelector("#progress-message");
  const date = document.querySelector("#progress-date").value;
  const measurement = {
    date,
    weight: numericInput("#progress-weight"),
    bodyFat: numericInput("#progress-body-fat"),
    muscleMass: numericInput("#progress-muscle"),
    waist: numericInput("#progress-waist"),
  };
  const hasMetric = progressMetrics.some((metric) => Number.isFinite(measurement[metric.key]));
  if (!date || !hasMetric) {
    setMessage(message, "Indica la fecha y al menos una medida.", "error");
    return;
  }
  setBusy(submit, true, "Guardando…", "Guardar medición");
  setMessage(message);
  try {
    const measurementPayload = { date, updatedAt: serverTimestamp() };
    progressMetrics.forEach((metric) => {
      if (Number.isFinite(measurement[metric.key])) measurementPayload[metric.key] = measurement[metric.key];
    });
    await setDoc(doc(db, "users", state.user.uid, "progressMeasurements", date), {
      ...measurementPayload,
    }, { merge: true });
    await setDoc(doc(db, "users", state.user.uid), { lastActiveAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
    setMessage(message, "Medición guardada.");
    ["#progress-weight", "#progress-body-fat", "#progress-muscle", "#progress-waist"].forEach((selector) => { document.querySelector(selector).value = ""; });
    await loadClientProgress();
  } catch (error) {
    setMessage(message, "No se ha podido guardar la medición.", "error");
  } finally {
    setBusy(submit, false, "", "Guardar medición");
  }
});

document.querySelector("#meal-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.user) return;
  const submit = event.currentTarget.querySelector('button[type="submit"]');
  const message = document.querySelector("#meal-message");
  const form = event.currentTarget;
  const title = document.querySelector("#meal-title").value.trim();
  const amount = (selector) => Number(document.querySelector(selector).value || 0);
  if (!title) return;
  setBusy(submit, true, "Guardando…", "Guardar comida");
  setMessage(message);
  try {
    await saveMeal({
      title,
      calories: amount("#meal-calories"),
      protein: amount("#meal-protein"),
      carbs: amount("#meal-carbs"),
      fat: amount("#meal-fat"),
    });
    form.reset();
    setMessage(message, "Comida guardada.");
  } catch (error) {
    setMessage(message, "No se ha podido guardar. Revisa tu conexión e inténtalo de nuevo.", "error");
  } finally {
    setBusy(submit, false, "", "Guardar comida");
  }
});

// Añade una comida al registro de hoy (formulario y escáner). Mismo formato que la app del móvil.
async function saveMeal({ title, calories = 0, protein = 0, carbs = 0, fat = 0, source = null }) {
  if (!state.user) throw new Error("Sin sesión");
  const dayRef = doc(db, "users", state.user.uid, "dailyNutrition", todayId());
  const snapshot = await getDoc(dayRef);
  const meals = snapshot.exists() && Array.isArray(snapshot.data().meals) ? [...snapshot.data().meals] : [];
  meals.push({
    id: `web-${Date.now()}`,
    title,
    calories,
    protein,
    carbs,
    fat,
    fiber: 0,
    vitaminC: 0,
    calcium: 0,
    iron: 0,
    vegetableServings: 0,
    consumedAt: new Date().toISOString(),
    ...(source ? { source } : {}),
  });
  await setDoc(dayRef, { day: todayId(), meals, updatedAt: serverTimestamp() }, { merge: true });
  await setDoc(doc(db, "users", state.user.uid), { lastActiveAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
  await loadClientDays();
}

initScanner({
  apiBase: SCANNER_API_BASE,
  getIdToken: () => state.user.getIdToken(),
  onAddMeal: (meal) => saveMeal({ ...meal, source: "scanner" }),
});

// Una sola lectura de los últimos días alimenta el registro de hoy, el historial, «Moverme»,
// el progreso y los logros.
async function loadClientDays() {
  if (!state.user) return;
  const uid = state.user.uid;
  try {
    const snapshot = await getDocs(query(collection(db, "users", uid, "dailyNutrition"), orderBy("day", "desc"), limit(120)));
    if (state.user?.uid !== uid) return;
    state.days = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    renderMeals(document.querySelector("#meal-list"), todayDoc().meals || []);
    renderHistory(document.querySelector("#client-history"), state.days.slice(0, 14));
  } catch (error) {
    document.querySelector("#meal-list").textContent = "No se ha podido cargar el registro.";
    document.querySelector("#meal-list").className = "empty-state";
    document.querySelector("#client-history").textContent = "No se ha podido cargar el historial.";
    document.querySelector("#client-history").className = "history-list empty-state";
  }
  refreshStats();
}

function todayDoc() {
  return state.days.find((day) => (day.day || day.id) === todayId()) || {};
}

async function loadClientProgress() {
  const measurements = await loadProgressMeasurements(state.user.uid, "#client-progress-chart");
  state.measurementCount = measurements.length;
  const withWeight = measurements.filter((item) => Number(item.weight) > 0);
  state.latestWeight = withWeight.length ? Number(withWeight[withWeight.length - 1].weight) : null;
  refreshStats();
}

function renderMeals(container, meals) {
  container.replaceChildren();
  container.className = meals.length ? "meal-list" : "empty-state";
  if (!meals.length) {
    container.textContent = "Todavía no has añadido ninguna comida.";
    return;
  }
  [...meals].reverse().forEach((meal) => {
    const row = document.createElement("div");
    row.className = "meal-row";
    const head = document.createElement("div");
    head.className = "meal-row-head";
    const title = document.createElement("strong");
    title.textContent = meal.title || "Comida";
    const time = document.createElement("small");
    time.textContent = formatTime(meal.consumedAt);
    head.append(title, time);
    const detail = document.createElement("small");
    const facts = [];
    if (Number(meal.calories) > 0) facts.push(`${Math.round(meal.calories)} kcal`);
    if (Number(meal.protein) > 0) facts.push(`${Number(meal.protein).toFixed(1)} g proteína`);
    if (Number(meal.carbs) > 0) facts.push(`${Number(meal.carbs).toFixed(1)} g hidratos`);
    if (Number(meal.fat) > 0) facts.push(`${Number(meal.fat).toFixed(1)} g grasa`);
    detail.textContent = facts.join(" · ") || "Registro sin cantidades";
    row.append(head, detail);
    container.append(row);
  });
}

function renderHistory(container, days) {
  container.replaceChildren();
  container.className = days.length ? "history-list" : "history-list empty-state";
  if (!days.length) {
    container.textContent = "Todavía no hay días guardados.";
    return;
  }
  days.forEach((day) => {
    const meals = Array.isArray(day.meals) ? day.meals : [];
    const calories = meals.reduce((sum, meal) => sum + Number(meal.calories || 0), 0);
    const row = document.createElement("div");
    row.className = "history-row";
    const head = document.createElement("div");
    head.className = "history-row-head";
    const date = document.createElement("strong");
    date.textContent = formatDate(`${day.day || day.id}T12:00:00`);
    const count = document.createElement("small");
    count.textContent = `${meals.length} ${meals.length === 1 ? "comida" : "comidas"}`;
    head.append(date, count);
    const detail = document.createElement("small");
    const moved = (Array.isArray(day.activities) ? day.activities : []).reduce((sum, item) => sum + Number(item.minutes || 0), 0);
    const facts = [calories > 0 ? `${Math.round(calories)} kcal registradas` : "Sin cantidades registradas"];
    if (moved > 0) facts.push(`${moved} min de actividad`);
    detail.textContent = facts.join(" · ");
    row.append(head, detail);
    container.append(row);
  });
}

function beginProfessionalWorkspace() {
  showView("professional");
  state.selectedClientId = null;
  stopChat("pro");
  document.querySelector("#pro-chat-section").classList.add("hidden");
  document.querySelector("#professional-empty").classList.remove("hidden");
  document.querySelector("#professional-detail").classList.add("hidden");
  if (state.stopClientListener) state.stopClientListener();
  const listQuery = query(collection(db, "users"));
  state.stopClientListener = onSnapshot(listQuery, (snapshot) => {
    // «estimate»: mientras se guarda una marca de lectura propia no aparece un falso «Mensaje nuevo».
    state.professionalClients = snapshot.docs.map((item) => ({ id: item.id, ...item.data({ serverTimestamps: "estimate" }) }));
    const pendingIds = new Set(snapshot.docs.filter((item) => item.metadata?.hasPendingWrites).map((item) => item.id));
    renderProfessionalClientList();
    const selected = state.professionalClients.find((item) => item.id === state.selectedClientId);
    if (selected && !views.professional.classList.contains("hidden")) syncProChat(selected);
    refreshProReadMark(pendingIds);
  }, () => {
    const list = document.querySelector("#professional-client-list");
    list.innerHTML = '<p class="form-message error">No se puede abrir el panel hasta completar la autorización profesional.</p>';
  });
}

document.querySelector("#client-search").addEventListener("input", renderProfessionalClientList);

function pendingCareClients() {
  return state.professionalClients.filter((client) => (
    client.id !== state.user?.uid
    && client.careStatus !== "active"
    && (client.careStatus === "requested" || client.serviceMode === "professional_care")
  ));
}

function updateCareRequestAlert() {
  const pending = pendingCareClients();
  const alert = document.querySelector("#care-request-alert");
  const count = document.querySelector("#care-request-count");
  const notificationButton = document.querySelector("#enable-browser-notifications");
  alert.classList.toggle("hidden", pending.length === 0);
  count.textContent = pending.length === 1
    ? "Hay 1 persona esperando activación."
    : `Hay ${pending.length} personas esperando activación.`;
  const notificationsAvailable = "Notification" in window;
  const notificationPermission = notificationsAvailable ? Notification.permission : "unavailable";
  notificationButton.classList.toggle("hidden", !notificationsAvailable || notificationPermission === "granted");
  notificationButton.disabled = notificationPermission === "denied";
  notificationButton.textContent = notificationPermission === "denied"
    ? "Avisos bloqueados en este navegador"
    : "Activar avisos del navegador";
  if (pending.length && notificationsAvailable && Notification.permission === "granted") {
    const newRequests = pending.filter((client) => !state.notifiedCareRequestIds.has(client.id));
    if (newRequests.length) {
      const first = newRequests[0];
      try {
        new Notification("Nuevo seguimiento en Pauta Posible", {
          body: newRequests.length === 1
            ? `${first.profile?.name || first.email || "Una persona"} está esperando activación.`
            : `${newRequests.length} personas están esperando activación.`,
        });
      } catch {
        // El aviso permanente dentro del panel sigue visible si el sistema bloquea la notificación.
      }
      newRequests.forEach((client) => state.notifiedCareRequestIds.add(client.id));
    }
  }
}

document.querySelector("#open-care-request").addEventListener("click", () => {
  const first = pendingCareClients()[0];
  if (first) openProfessionalClient(first);
});

document.querySelector("#enable-browser-notifications").addEventListener("click", async () => {
  if (!("Notification" in window)) return;
  try {
    await Notification.requestPermission();
  } catch {
    // Algunos navegadores no permiten solicitar avisos desde esta vista.
  }
  updateCareRequestAlert();
});

function renderProfessionalClientList() {
  const list = document.querySelector("#professional-client-list");
  const search = document.querySelector("#client-search").value.trim().toLowerCase();
  const filtered = state.professionalClients.filter((client) => {
    const haystack = `${client.profile?.name || ""} ${client.email || ""}`.toLowerCase();
    return haystack.includes(search);
  });
  updateCareRequestAlert();
  list.replaceChildren();
  if (!filtered.length) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = search ? "No hay resultados." : "Todavía no hay cuentas registradas.";
    list.append(empty);
    return;
  }
  // Dos grupos plegables: quienes tienen o han pedido seguimiento y quienes van por libre.
  const groups = [
    { key: "care", title: "Con seguimiento", items: [] },
    { key: "self", title: "Por libre", items: [] },
  ];
  filtered
    .sort((a, b) => {
      const priority = (client) => client.careStatus === "requested" ? 0 : client.careStatus === "active" ? 1 : 2;
      return priority(a) - priority(b)
        || (a.profile?.name || a.email || "").localeCompare(b.profile?.name || b.email || "", "es");
    })
    .forEach((client) => {
      groups[metricStatus(client).className === "self" ? 1 : 0].items.push(client);
    });
  groups.forEach((group) => {
    const section = document.createElement("details");
    section.className = `client-group client-group-${group.key}`;
    section.open = !state.closedClientGroups.has(group.key);
    section.addEventListener("toggle", () => {
      if (section.open) state.closedClientGroups.delete(group.key);
      else state.closedClientGroups.add(group.key);
    });
    const summary = document.createElement("summary");
    const title = document.createElement("span");
    title.textContent = group.title;
    const count = document.createElement("span");
    count.className = "client-group-count";
    count.textContent = String(group.items.length);
    summary.append(title, count);
    const body = document.createElement("div");
    body.className = "client-group-items";
    section.append(summary, body);
    list.append(section);
    if (!group.items.length) {
      const empty = document.createElement("p");
      empty.className = "client-group-empty";
      empty.textContent = group.key === "care" ? "Nadie con seguimiento todavía." : "Nadie por libre todavía.";
      body.append(empty);
    }
    group.items.forEach((client) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `client-item${client.id === state.selectedClientId ? " active" : ""}`;
      const name = document.createElement("strong");
      name.textContent = client.profile?.name || "Perfil pendiente";
      const email = document.createElement("small");
      email.textContent = client.email || "Sin correo";
      const status = document.createElement("span");
      const clientStatus = metricStatus(client);
      status.className = `client-status ${clientStatus.className}`;
      status.textContent = clientStatus.label;
      button.append(name, email, status);
      if (client.deletionRequested) {
        const deletion = document.createElement("span");
        deletion.className = "client-deletion";
        deletion.textContent = "Pide borrar su cuenta";
        button.append(deletion);
      }
      if (client.id !== state.selectedClientId && hasUnreadClientMessage(client)) {
        const unread = document.createElement("span");
        unread.className = "client-unread";
        unread.textContent = "Mensaje nuevo";
        button.append(unread);
        button.setAttribute("aria-label", `${name.textContent}, ${email.textContent}, ${status.textContent}, mensaje nuevo sin leer`);
      }
      button.addEventListener("click", () => openProfessionalClient(client));
      body.append(button);
    });
  });
}

function populateCarePlanEditor(plans, client) {
  const visiblePlans = plans.filter((plan) => plan.kind !== "body_check" && plan.kind !== "care_document_chunk");
  const latest = visiblePlans.find((plan) => plan.menuText || plan.guidelines) || visiblePlans[0];
  const frequency = client.reviewFrequency || "weekly";
  const savedTitle = latest?.title || "";
  document.querySelector("#care-plan-name").value = !savedTitle || /^menú (semanal|quincenal|mensual)$/i.test(savedTitle)
    ? reviewTitle(frequency)
    : savedTitle;
  document.querySelector("#care-plan-date").value = latest?.periodStart || todayId();
  document.querySelector("#care-plan-menu").value = latest?.menuText || "";
  document.querySelector("#care-plan-guidelines").value = latest?.guidelines || "";
  document.querySelector("#care-plan-table-option").open = Boolean(latest?.menuText);
}

// Al cambiar de persona se vacían el editor del plan, los documentos elegidos y la nota sin guardar,
// para que nada de la persona anterior se pueda publicar o guardar en la nueva.
function resetProfessionalDrafts(client) {
  populateCarePlanEditor([], client);
  document.querySelector("#care-plan-files").value = "";
  renderSelectedCareFiles();
  setMessage(document.querySelector("#care-plan-message"));
  document.querySelector("#note-text").value = "";
  setMessage(document.querySelector("#note-message"));
}

// Chat del panel: solo con personas que tienen seguimiento (las que pueden verlo en su espacio).
function syncProChat(client) {
  const section = document.querySelector("#pro-chat-section");
  const isOwnAccount = client.id === state.user?.uid;
  const available = !isOwnAccount && userHasCare(client);
  section.classList.toggle("hidden", isOwnAccount);
  section.classList.toggle("chat-off", !available);
  if (!isOwnAccount) {
    document.querySelector("#pro-chat-title").textContent = `Chat con ${client.profile?.name || client.email || "esta persona"}`;
    document.querySelector("#pro-chat-initials").textContent = initialsFor(client.profile?.name || client.email);
  }
  syncWhatsappNotice(available ? client : null);
  if (available) openChat("pro", client.id);
  else stopChat("pro");
}

// «Avisar por WhatsApp»: abre el WhatsApp del profesional con un aviso ya escrito para esta persona.
// Lo envía el profesional a mano y el aviso no lleva el contenido de ningún mensaje.
function syncWhatsappNotice(client) {
  const link = document.querySelector("#pro-chat-whatsapp");
  const phone = client && typeof client.whatsappPhone === "string" && /^[1-9]\d{8,14}$/.test(client.whatsappPhone)
    ? client.whatsappPhone
    : "";
  link.classList.toggle("hidden", !phone);
  if (!phone) {
    link.removeAttribute("href");
    return;
  }
  const firstName = (client.profile?.name || "").trim().split(/\s+/)[0];
  const text = `Hola${firstName ? ` ${firstName}` : ""}, te he escrito un mensaje en tu espacio de Pauta Posible. Puedes leerlo aquí: https://pautaposible.es/app/`;
  link.href = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  link.setAttribute("aria-label", `Avisar por WhatsApp a ${client.profile?.name || "esta persona"} de que tiene un mensaje nuevo`);
}

async function openProfessionalClient(client) {
  const switching = state.selectedClientId !== client.id;
  state.selectedClientId = client.id;
  if (switching) resetProfessionalDrafts(client);
  renderProfessionalClientList();
  document.querySelector("#professional-empty").classList.add("hidden");
  document.querySelector("#professional-detail").classList.remove("hidden");
  document.querySelector("#detail-name").textContent = client.profile?.name || "Perfil pendiente";
  document.querySelector("#detail-email").textContent = client.email || "Sin correo";
  const clientStatus = metricStatus(client);
  document.querySelector("#detail-status").textContent = clientStatus.label;
  const activateButton = document.querySelector("#activate-care");
  const isOwnAccount = client.id === state.user?.uid;
  activateButton.classList.toggle("hidden", isOwnAccount);
  activateButton.disabled = client.careStatus === "active";
  activateButton.textContent = client.careStatus === "active" ? "Seguimiento activo" : "Activar seguimiento";
  setMessage(document.querySelector("#care-message"));
  renderProfileFacts(client);
  syncProChat(client);
  const reviewFrequency = client.reviewFrequency || "weekly";
  document.querySelector("#review-frequency").value = reviewFrequency;
  document.querySelector("#review-calorie-target").value = client.nutritionTargetCalories || client.profile?.calories || "";
  document.querySelector("#next-review-date").value = client.nextReviewDate || nextCheckDate([], reviewFrequency) || todayId();
  setMessage(document.querySelector("#review-settings-message"));
  document.querySelector("#professional-progress-date").value = todayId();
  updateReviewCalendarLink(client);
  document.querySelector("#professional-progress-weight").value = client.profile?.weight || "";
  ["#professional-progress-body-fat", "#professional-progress-muscle", "#professional-progress-waist", "#professional-progress-assessment"].forEach((selector) => {
    document.querySelector(selector).value = "";
  });
  setMessage(document.querySelector("#professional-progress-message"));
  const [, , measurements, plans] = await Promise.all([
    loadProfessionalHistory(client.id),
    loadProfessionalNotes(client.id),
    loadProgressMeasurements(client.id, "#detail-progress-chart"),
    loadCarePlans(client.id, "#professional-care-plan-list"),
  ]);
  // Si mientras cargaba se ha abierto a otra persona, no se toca nada de su ficha.
  if (state.selectedClientId !== client.id) return;
  if (!client.nextReviewDate) {
    document.querySelector("#next-review-date").value = nextCheckDate(measurements, reviewFrequency) || todayId();
  }
  populateCarePlanEditor(plans, client);
  updateNextCheck(measurements);
  updateReviewCalendarLink(client);
}

document.querySelector("#activate-care").addEventListener("click", async () => {
  const client = state.professionalClients.find((item) => item.id === state.selectedClientId);
  if (!client || client.id === state.user?.uid) return;
  const button = document.querySelector("#activate-care");
  const message = document.querySelector("#care-message");
  setBusy(button, true, "Activando…", "Activar seguimiento");
  setMessage(message);
  try {
    await setDoc(doc(db, "users", client.id), {
      serviceMode: "professional_care",
      careStatus: "active",
      careActivatedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
    client.serviceMode = "professional_care";
    client.careStatus = "active";
    document.querySelector("#detail-status").textContent = "Seguimiento activo";
    button.textContent = "Seguimiento activo";
    button.disabled = true;
    setMessage(message, "Seguimiento activado.");
    renderProfessionalClientList();
    if (state.selectedClientId === client.id) syncProChat(client);
  } catch (error) {
    setMessage(message, "No se ha podido activar el seguimiento.", "error");
    setBusy(button, false, "", "Activar seguimiento");
  }
});

document.querySelector("#open-professional").addEventListener("click", beginProfessionalWorkspace);
document.querySelector("#consent-back-professional").addEventListener("click", beginProfessionalWorkspace);

function calendarDate(dateValue, hour, minute) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue || "")) return "";
  return `${dateValue.replaceAll("-", "")}T${String(hour).padStart(2, "0")}${String(minute).padStart(2, "0")}00`;
}

function updateReviewCalendarLink(client = state.professionalClients.find((item) => item.id === state.selectedClientId)) {
  const link = document.querySelector("#review-calendar-link");
  if (!link || !client) return;
  const frequency = document.querySelector("#review-frequency").value || "weekly";
  const selectedDate = document.querySelector("#next-review-date").value || nextCheckDate(state.selectedClientMeasurements, frequency) || todayId();
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Revisión Pauta Posible · ${client.profile?.name || client.email || "Seguimiento"}`,
    dates: `${calendarDate(selectedDate, 9, 0)}/${calendarDate(selectedDate, 9, 30)}`,
    ctz: "Europe/Madrid",
    details: `Revisión ${reviewFrequencyLabel(frequency).toLowerCase()} de Pauta Posible. Persona: ${client.profile?.name || "Sin nombre"}. Contacto: ${client.email || "Sin correo"}.`,
    recur: frequency === "monthly"
      ? "RRULE:FREQ=MONTHLY;INTERVAL=1"
      : frequency === "biweekly"
        ? "RRULE:FREQ=DAILY;INTERVAL=15"
        : "RRULE:FREQ=WEEKLY;INTERVAL=1",
  });
  link.href = `https://calendar.google.com/calendar/render?${params.toString()}`;
}

document.querySelector("#review-frequency").addEventListener("change", () => {
  const frequency = document.querySelector("#review-frequency").value;
  const title = document.querySelector("#care-plan-name");
  if (!title.value.trim() || /^menú (semanal|quincenal|mensual)$/i.test(title.value.trim())) {
    title.value = reviewTitle(frequency);
  }
  document.querySelector("#next-review-date").value = nextCheckDate(state.selectedClientMeasurements, frequency) || todayId();
  updateNextCheck(state.selectedClientMeasurements);
  updateReviewCalendarLink();
});

document.querySelector("#next-review-date").addEventListener("change", () => {
  updateNextCheck(state.selectedClientMeasurements);
  updateReviewCalendarLink();
});

function readReviewSettings() {
  const reviewFrequency = document.querySelector("#review-frequency").value;
  const nextReviewDate = document.querySelector("#next-review-date").value;
  const rawTarget = document.querySelector("#review-calorie-target").value;
  const nutritionTargetCalories = rawTarget === "" ? null : Number(rawTarget);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(nextReviewDate)) throw new Error("Indica la fecha de la próxima revisión.");
  if (nutritionTargetCalories !== null && (!Number.isFinite(nutritionTargetCalories) || nutritionTargetCalories < 1000 || nutritionTargetCalories > 5000)) {
    throw new Error("Indica una referencia entre 1.000 y 5.000 kcal, o déjala vacía para usar la calculada.");
  }
  return { reviewFrequency, nextReviewDate, nutritionTargetCalories };
}

async function persistReviewSettings(client) {
  const settings = readReviewSettings();
  await setDoc(doc(db, "users", client.id), {
    ...settings,
    updatedAt: serverTimestamp(),
  }, { merge: true });
  Object.assign(client, settings);
  if (state.selectedClientId === client.id) {
    renderProfileFacts(client);
    updateNextCheck(state.selectedClientMeasurements);
    updateReviewCalendarLink(client);
  }
  return settings;
}

document.querySelector("#save-review-settings").addEventListener("click", async () => {
  const client = state.professionalClients.find((item) => item.id === state.selectedClientId);
  if (!client || client.id === state.user?.uid) return;
  const button = document.querySelector("#save-review-settings");
  const message = document.querySelector("#review-settings-message");
  setBusy(button, true, "Guardando…", "Guardar periodicidad y fecha");
  setMessage(message);
  try {
    await persistReviewSettings(client);
    setMessage(message, "Periodicidad y próxima revisión guardadas.");
  } catch (error) {
    setMessage(message, error?.message || "No se ha podido guardar la configuración.", "error");
  } finally {
    setBusy(button, false, "", "Guardar periodicidad y fecha");
  }
});

document.querySelector("#professional-progress-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.user || !state.selectedClientId) return;
  const submit = event.currentTarget.querySelector('button[type="submit"]');
  const message = document.querySelector("#professional-progress-message");
  const date = document.querySelector("#professional-progress-date").value;
  const assessment = document.querySelector("#professional-progress-assessment").value.trim();
  const measurement = {
    weight: numericInput("#professional-progress-weight"),
    bodyFat: numericInput("#professional-progress-body-fat"),
    muscleMass: numericInput("#professional-progress-muscle"),
    waist: numericInput("#professional-progress-waist"),
  };
  const hasMetric = progressMetrics.some((metric) => Number.isFinite(measurement[metric.key]));
  if (!date || !hasMetric) {
    setMessage(message, "Indica la fecha y al menos una medida.", "error");
    return;
  }
  setBusy(submit, true, "Guardando…", "Guardar control");
  setMessage(message);
  try {
    const payload = {
      clientId: state.selectedClientId,
      kind: "body_check",
      date,
      assessment,
    };
    progressMetrics.forEach((metric) => {
      if (Number.isFinite(measurement[metric.key])) payload[metric.key] = measurement[metric.key];
    });
    await publishCarePlan(payload);
    setMessage(message, "Control guardado y visible en la cuenta de esta persona.");
    ["#professional-progress-body-fat", "#professional-progress-muscle", "#professional-progress-waist", "#professional-progress-assessment"].forEach((selector) => {
      document.querySelector(selector).value = "";
    });
    const measurements = await loadProgressMeasurements(state.selectedClientId, "#detail-progress-chart");
    const suggestedDate = nextCheckDate(measurements);
    if (suggestedDate) {
      document.querySelector("#next-review-date").value = suggestedDate;
      updateNextCheck(measurements);
      updateReviewCalendarLink();
    }
  } catch (error) {
    setMessage(message, "No se ha podido guardar el control.", "error");
  } finally {
    setBusy(submit, false, "", "Guardar control");
  }
});

document.querySelector("#care-plan-template").addEventListener("click", () => {
  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const rows = [["Día", "Desayuno", "Comida", "Cena"], ...days.map((day) => [day, "", "", ""])];
  document.querySelector("#care-plan-table-option").open = true;
  document.querySelector("#care-plan-menu").value = rows.map((row) => row.join("\t")).join("\n");
  document.querySelector("#care-plan-menu").focus();
});

function renderSelectedCareFiles() {
  const list = document.querySelector("#selected-care-files");
  const files = [...document.querySelector("#care-plan-files").files];
  const message = document.querySelector("#care-plan-message");
  list.replaceChildren();
  list.classList.toggle("hidden", files.length === 0);
  let firstError = "";
  files.forEach((file) => {
    const item = document.createElement("li");
    const info = document.createElement("span");
    info.className = "selected-file-info";
    const name = document.createElement("strong");
    name.textContent = file.name;
    const size = document.createElement("small");
    size.textContent = formatFileSize(file.size);
    info.append(name, size);
    const preview = document.createElement("button");
    preview.className = "selected-file-preview";
    preview.type = "button";
    preview.textContent = /\.pdf$/i.test(file.name) ? "Vista previa" : "Descargar";
    preview.addEventListener("click", () => {
      const previewWindow = /\.pdf$/i.test(file.name) ? window.open("", "_blank") : null;
      openBlob(file, file.name, previewWindow);
    });
    try {
      validateCareFile(file);
    } catch (error) {
      item.classList.add("invalid");
      preview.disabled = true;
      size.textContent = error.message;
      if (!firstError) firstError = error.message;
    }
    item.append(info, preview);
    list.append(item);
  });
  if (firstError) setMessage(message, firstError, "error");
  else if (files.length) setMessage(message, `${files.length} ${files.length === 1 ? "documento listo" : "documentos listos"} para publicar.`);
  else setMessage(message);
}

document.querySelector("#care-plan-files").addEventListener("change", renderSelectedCareFiles);

document.querySelector("#care-plan-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.user || !state.selectedClientId) return;
  const title = document.querySelector("#care-plan-name").value.trim();
  const periodStart = document.querySelector("#care-plan-date").value;
  const menuText = document.querySelector("#care-plan-menu").value.trim();
  const guidelines = document.querySelector("#care-plan-guidelines").value.trim();
  const files = [...document.querySelector("#care-plan-files").files];
  const submit = event.currentTarget.querySelector('button[type="submit"]');
  const message = document.querySelector("#care-plan-message");
  setMessage(message);
  if (!title || (!menuText && !guidelines && !files.length)) {
    setMessage(message, "Añade un título y al menos un menú, una pauta o un documento.", "error");
    return;
  }
  if (files.length > 10) {
    setMessage(message, "Puedes publicar un máximo de 10 documentos cada vez.", "error");
    return;
  }
  try {
    files.forEach(validateCareFile);
  } catch (error) {
    setMessage(message, error.message, "error");
    return;
  }
  setBusy(submit, true, "Publicando…", "Publicar para esta persona");
  try {
    const client = state.professionalClients.find((item) => item.id === state.selectedClientId);
    if (!client) throw new Error("Selecciona de nuevo a la persona.");
    const reviewSettings = await persistReviewSettings(client);
    const sharedFields = {
      // La persona elegida al pulsar «Publicar», aunque después se abra otra.
      clientId: client.id,
      periodStart,
      reviewFrequency: reviewSettings.reviewFrequency,
      nextReviewDate: reviewSettings.nextReviewDate,
    };
    let textSaved = false;
    if (!files.length && (menuText || guidelines)) {
      await publishCarePlan({
        ...sharedFields,
        title,
        menuText,
        guidelines,
      });
      textSaved = true;
    }
    let savedFiles = 0;
    for (const [index, file] of files.entries()) {
      try {
        const documentTitle = files.length > 1 ? `${title} · ${file.name.replace(/\.(pdf|docx?)$/i, "")}` : title;
        await publishCarePlan({
          ...sharedFields,
          title: documentTitle,
          menuText,
          guidelines,
        }, file);
        if (index === 0 && (menuText || guidelines)) textSaved = true;
        savedFiles += 1;
      } catch (error) {
        setMessage(message, `${textSaved ? "Las pautas se han guardado. " : ""}${savedFiles ? `${savedFiles} documentos se han guardado. ` : ""}No se ha podido subir ${file.name}; vuelve a seleccionarlo e inténtalo de nuevo.`, "error");
        await loadCarePlans(client.id, "#professional-care-plan-list");
        return;
      }
    }
    document.querySelector("#care-plan-files").value = "";
    renderSelectedCareFiles();
    setMessage(message, savedFiles > 1
      ? `${savedFiles} documentos publicados. Ya aparecen abajo y en la cuenta de esta persona.`
      : "Contenido publicado. Ya aparece abajo y en la cuenta de esta persona.");
    await loadCarePlans(client.id, "#professional-care-plan-list");
  } catch (error) {
    const knownMessage = typeof error?.message === "string" && error.message !== "No se ha podido completar la operación.";
    setMessage(message, knownMessage ? error.message : "No se ha podido publicar el contenido.", "error");
  } finally {
    setBusy(submit, false, "", "Publicar para esta persona");
  }
});

document.querySelector("#open-my-progress").addEventListener("click", async () => {
  // Al salir del panel se cierra el chat abierto: si no, seguiría marcando como leídos
  // los mensajes que lleguen sin que nadie los vea.
  stopChat("pro");
  if (!state.userData && state.user) state.userData = await ensureUserDocument(state.user);
  await enterClientArea();
});

function renderProfileFacts(client) {
  const profile = client.profile || {};
  const nutritionTarget = Number(client.nutritionTargetCalories || profile.calories);
  const container = document.querySelector("#detail-profile");
  const facts = [
    ["Edad", profile.age ? `${profile.age} años` : "Sin completar"],
    ["Altura", profile.height ? `${profile.height} cm` : "Sin completar"],
    ["Peso", profile.weight ? `${profile.weight} kg` : "Sin completar"],
    ["Objetivo", readableGoal(profile.goal)],
    ["Actividad", readableActivity(profile.activityLevel)],
    ["Referencia energética", Number.isFinite(nutritionTarget) && nutritionTarget > 0 ? `${Math.round(nutritionTarget)} kcal` : "Sin calcular"],
    ["Revisión", reviewFrequencyLabel(client.reviewFrequency)],
    ["Próxima revisión", client.nextReviewDate ? formatDate(`${client.nextReviewDate}T12:00:00`) : "Sin fijar"],
    ["Proteína orientativa", profile.protein ? `${Math.round(profile.protein)} g` : "Sin calcular"],
    ["Alta", formatDate(profile.createdAt)],
  ];
  container.replaceChildren();
  facts.forEach(([label, value]) => {
    const box = document.createElement("div");
    box.className = "fact";
    const small = document.createElement("small");
    small.textContent = label;
    const strong = document.createElement("strong");
    strong.textContent = value;
    box.append(small, strong);
    container.append(box);
  });
}

async function loadProfessionalHistory(clientId) {
  const container = document.querySelector("#detail-history");
  container.textContent = "Cargando…";
  container.className = "history-list empty-state";
  try {
    const snapshot = await getDocs(query(collection(db, "users", clientId, "dailyNutrition"), orderBy("day", "desc"), limit(30)));
    if (state.selectedClientId !== clientId) return;
    renderHistory(container, snapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
  } catch (error) {
    if (state.selectedClientId !== clientId) return;
    container.textContent = "No se ha podido cargar el historial.";
  }
}

document.querySelector("#note-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.user || !state.selectedClientId) return;
  const text = document.querySelector("#note-text").value.trim();
  if (!text) return;
  const submit = event.currentTarget.querySelector('button[type="submit"]');
  const message = document.querySelector("#note-message");
  setBusy(submit, true, "Guardando…", "Guardar nota");
  setMessage(message);
  try {
    await addDoc(collection(db, "users", state.selectedClientId, "professionalNotes"), {
      text,
      authorUid: state.user.uid,
      createdAt: serverTimestamp(),
    });
    document.querySelector("#note-text").value = "";
    setMessage(message, "Nota guardada.");
    await loadProfessionalNotes(state.selectedClientId);
  } catch (error) {
    setMessage(message, "No se ha podido guardar la nota.", "error");
  } finally {
    setBusy(submit, false, "", "Guardar nota");
  }
});

async function loadProfessionalNotes(clientId) {
  const container = document.querySelector("#note-list");
  container.replaceChildren();
  try {
    const snapshot = await getDocs(query(collection(db, "users", clientId, "professionalNotes"), orderBy("createdAt", "desc"), limit(30)));
    if (state.selectedClientId !== clientId) return;
    if (snapshot.empty) {
      const empty = document.createElement("p");
      empty.className = "empty-state";
      empty.textContent = "Todavía no hay notas.";
      container.append(empty);
      return;
    }
    snapshot.docs.forEach((item) => {
      const data = item.data();
      const row = document.createElement("div");
      row.className = "note-row";
      const text = document.createElement("p");
      text.textContent = data.text || "";
      const date = document.createElement("small");
      date.textContent = formatDate(data.createdAt);
      row.append(text, date);
      container.append(row);
    });
  } catch (error) {
    if (state.selectedClientId !== clientId) return;
    const failed = document.createElement("p");
    failed.className = "form-message error";
    failed.textContent = "No se han podido cargar las notas.";
    container.append(failed);
  }
}

/* ---------- Peso rápido (misma ruta que «Añadir una medición») ---------- */
document.querySelector("#quick-weight-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!state.user) return;
  const submit = event.currentTarget.querySelector('button[type="submit"]');
  const message = document.querySelector("#quick-weight-message");
  const date = document.querySelector("#quick-weight-date").value;
  const weight = numericInput("#quick-weight-value");
  if (!date || !Number.isFinite(weight) || weight < 30 || weight > 350) {
    setMessage(message, "Indica la fecha y un peso entre 30 y 350 kg.", "error");
    return;
  }
  setBusy(submit, true, "Guardando…", "Añadir");
  setMessage(message);
  try {
    await setDoc(doc(db, "users", state.user.uid, "progressMeasurements", date), {
      date,
      weight,
      updatedAt: serverTimestamp(),
    }, { merge: true });
    await setDoc(doc(db, "users", state.user.uid), { lastActiveAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
    document.querySelector("#quick-weight-value").value = "";
    setMessage(message, "Peso añadido.");
    await loadClientProgress();
  } catch (error) {
    setMessage(message, "No se ha podido guardar el peso. Revisa tu conexión.", "error");
  } finally {
    setBusy(submit, false, "", "Añadir");
  }
});

/* ---------- Chat privado persona ↔ profesional ---------- */
const CHAT_MAX_LENGTH = 1000;
// WhatsApp de Iván: las personas con seguimiento le escriben por aquí en lugar del chat de la web.
// Con el número vacío vuelve el chat de la web tal cual.
const PRO_WHATSAPP = "34608861858";

function toMillis(value) {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
}

function initialsFor(value = "") {
  const parts = String(value).replace(/@.*/, "").split(/[\s._-]+/).filter(Boolean);
  return (parts.slice(0, 2).map((part) => part[0]).join("") || "P").toUpperCase();
}

function hasUnreadClientMessage(client) {
  const lastClient = toMillis(client.lastClientMessageAt);
  return lastClient > 0 && lastClient > toMillis(client.lastProReadAt);
}

function chatDayLabel(date) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Hoy";
  if (date.toDateString() === yesterday.toDateString()) return "Ayer";
  return new Intl.DateTimeFormat("es-ES", { weekday: "long", day: "numeric", month: "long" }).format(date);
}

function chatElements(kind) {
  const { prefix } = chatContexts[kind];
  return {
    messages: document.querySelector(`#${prefix}-chat-messages`),
    form: document.querySelector(`#${prefix}-chat-form`),
    input: document.querySelector(`#${prefix}-chat-input`),
    count: document.querySelector(`#${prefix}-chat-count`),
    announcer: document.querySelector(`#${prefix}-chat-announce`),
  };
}

function setComposer(kind, text = "") {
  const { input, count } = chatElements(kind);
  input.value = text;
  input.style.height = "";
  if (text && input.scrollHeight) input.style.height = `${Math.min(input.scrollHeight, 140)}px`;
  count.textContent = `${text.length}/${CHAT_MAX_LENGTH}`;
}

// Cierra el chat abierto y vacía su lista y su caja de texto. Lo que estuviera escrito se guarda
// como borrador de esa misma persona (solo en esta pestaña); con forget se borran todos los borradores.
function stopChat(kind, { forget = false } = {}) {
  const context = chatContexts[kind];
  if (context.stop) context.stop();
  const { messages: list, input, announcer } = chatElements(kind);
  if (forget) {
    context.drafts.clear();
  } else if (context.clientId) {
    if (input.value.trim()) context.drafts.set(context.clientId, input.value);
    else context.drafts.delete(context.clientId);
  }
  context.stop = null;
  context.clientId = null;
  context.lastMarkedId = null;
  context.messages = [];
  context.seenIds = new Set();
  context.remarkedFor = 0;
  list.replaceChildren();
  announcer.textContent = "";
  setComposer(kind, "");
}

function renderChatMessages(kind, messages) {
  const context = chatContexts[kind];
  const { messages: list } = chatElements(kind);
  const nearBottom = list.scrollHeight - list.scrollTop - list.clientHeight < 90;
  list.replaceChildren();
  if (!messages.length) {
    const empty = document.createElement("p");
    empty.className = "chat-empty";
    empty.textContent = kind === "client"
      ? (PRO_WHATSAPP
        ? "Aquí verás los mensajes que te deje en la web. Para escribirme, usa el botón de WhatsApp."
        : "Aún no hay mensajes. Escribe aquí tus dudas cortas o cuéntame qué tal va la semana.")
      : "Aún no hay mensajes con esta persona.";
    list.append(empty);
    return;
  }
  let lastDay = "";
  messages.forEach((message) => {
    const date = message.createdAt ? new Date(toMillis(message.createdAt)) : new Date();
    const day = date.toDateString();
    if (day !== lastDay) {
      const separator = document.createElement("p");
      separator.className = "chat-day";
      separator.textContent = chatDayLabel(date);
      list.append(separator);
      lastDay = day;
    }
    const bubble = document.createElement("div");
    const mine = message.senderRole === context.role;
    bubble.className = `chat-bubble ${mine ? "mine" : "theirs"}`;
    const text = document.createElement("p");
    text.textContent = message.text || "";
    const time = document.createElement("time");
    time.dateTime = date.toISOString();
    time.textContent = message.pending ? "Enviando…" : formatTime(date);
    const who = document.createElement("span");
    who.className = "sr-only";
    who.textContent = mine ? "Tú: " : (message.senderRole === "pro" ? "Profesional: " : "Persona: ");
    bubble.append(who, text, time);
    list.append(bubble);
  });
  if (context.firstRender || nearBottom || messages.at(-1)?.pending) list.scrollTop = list.scrollHeight;
  context.firstRender = false;
}

// La lista de mensajes no es una región «en directo»: se repinta entera en cada cambio y un lector
// de pantalla volvería a leer toda la conversación. Aquí solo se anuncian los mensajes nuevos de la otra parte.
function announceNewMessages(kind, messages) {
  const context = chatContexts[kind];
  const fresh = messages.filter((message) => !context.seenIds.has(message.id));
  messages.forEach((message) => context.seenIds.add(message.id));
  if (context.firstRender) return;
  const incoming = fresh.filter((message) => message.senderRole !== context.role && !message.pending);
  if (!incoming.length) return;
  const { announcer } = chatElements(kind);
  const last = incoming.at(-1);
  const text = incoming.length > 1
    ? `${incoming.length} mensajes nuevos. El último: ${last.text || ""}`
    : `Mensaje nuevo: ${last.text || ""}`;
  const clientId = context.clientId;
  announcer.textContent = "";
  window.setTimeout(() => {
    if (context.clientId === clientId) announcer.textContent = text;
  }, 60);
}

function proChatVisible() {
  return !views.professional.classList.contains("hidden") && document.visibilityState === "visible";
}

function markProRead(clientId, messages) {
  const context = chatContexts.pro;
  // Solo cuenta como leído si el chat está a la vista (no desde «Mi progreso personal» ni con la pestaña en segundo plano).
  if (!proChatVisible()) return;
  const lastClientMessage = [...messages].reverse().find((message) => message.senderRole === "client" && !message.pending);
  if (!lastClientMessage || context.lastMarkedId === lastClientMessage.id) return;
  context.lastMarkedId = lastClientMessage.id;
  setDoc(doc(db, "users", clientId), { lastProReadAt: serverTimestamp() }, { merge: true }).catch(() => {
    // Si las reglas no permiten este campo, el chat sigue funcionando sin el aviso de no leídos.
  });
}

// La hora del último mensaje de la persona se guarda después del mensaje, así que puede llegar
// después de la marca de «leído». Si el chat de esa persona está abierto y a la vista, se vuelve
// a marcar como leído (una vez por cada mensaje nuevo) para que no aparezca un falso «Mensaje nuevo».
function refreshProReadMark(pendingIds) {
  const context = chatContexts.pro;
  if (!context.clientId || !context.stop || pendingIds.has(context.clientId)) return;
  const client = state.professionalClients.find((item) => item.id === context.clientId);
  if (!client || !hasUnreadClientMessage(client) || !proChatVisible()) return;
  const stampedAt = toMillis(client.lastClientMessageAt);
  if (context.remarkedFor === stampedAt) return;
  context.remarkedFor = stampedAt;
  context.lastMarkedId = null;
  markProRead(context.clientId, context.messages);
}

document.addEventListener("visibilitychange", () => {
  const context = chatContexts.pro;
  if (document.visibilityState === "visible" && context.clientId && context.stop) {
    markProRead(context.clientId, context.messages);
  }
});

function openChat(kind, clientId) {
  const context = chatContexts[kind];
  if (context.clientId === clientId && context.stop) return;
  stopChat(kind);
  context.clientId = clientId;
  context.firstRender = true;
  // Cada persona recupera solo su propio borrador; nunca el texto que se escribía a otra.
  setComposer(kind, context.drafts.get(clientId) || "");
  context.drafts.delete(clientId);
  const { messages: list } = chatElements(kind);
  list.innerHTML = '<p class="chat-empty">Cargando mensajes…</p>';
  const messagesQuery = query(collection(db, "users", clientId, "messages"), orderBy("createdAt", "desc"), limit(100));
  context.stop = onSnapshot(messagesQuery, (snapshot) => {
    if (context.clientId !== clientId) return;
    const messages = snapshot.docs.map((item) => ({
      id: item.id,
      pending: item.metadata.hasPendingWrites,
      ...item.data({ serverTimestamps: "estimate" }),
    })).reverse();
    announceNewMessages(kind, messages);
    context.messages = messages;
    renderChatMessages(kind, messages);
    if (kind === "pro") markProRead(clientId, messages);
  }, () => {
    if (context.clientId !== clientId) return;
    // La pista de las reglas solo tiene sentido para el profesional; a la persona, un mensaje neutro.
    list.innerHTML = kind === "pro"
      ? '<p class="chat-empty chat-error">No se ha podido abrir el chat. Si acabas de activarlo, puede faltar publicar las reglas de seguridad.</p>'
      : '<p class="chat-empty chat-error">No se ha podido abrir el chat. Inténtalo de nuevo más tarde.</p>';
  });
}

function syncClientChat(hasCare) {
  const section = document.querySelector("#client-chat-section");
  section.classList.toggle("hidden", !hasCare);
  section.classList.toggle("chat-via-wa", Boolean(PRO_WHATSAPP));
  document.querySelector("#client-chat-wa").classList.toggle("hidden", !PRO_WHATSAPP);
  document.querySelector("#client-chat-sub").textContent = PRO_WHATSAPP
    ? "Por WhatsApp · suele responder en el día"
    : "Chat privado · suele responder en el día";
  if (PRO_WHATSAPP) {
    const name = state.userData?.profile?.name;
    const text = `Hola Iván, soy ${name || "una persona con seguimiento"} de Pauta Posible. `;
    document.querySelector("#client-chat-wa-link").href = `https://wa.me/${PRO_WHATSAPP}?text=${encodeURIComponent(text)}`;
  }
  document.querySelector("#client-chat-wa-hint").classList.toggle("hidden", Boolean(PRO_WHATSAPP || state.userData?.whatsappPhone));
  if (hasCare && state.user) openChat("client", state.user.uid);
  else stopChat("client");
}

async function sendChatMessage(kind) {
  const context = chatContexts[kind];
  const { input } = chatElements(kind);
  const text = input.value.trim();
  // La persona y la sesión se fijan antes de enviar: si mientras tanto se abre otro chat o se cierra
  // la sesión, ni la marca de hora ni un texto que no se haya podido enviar acaban en otra persona.
  const clientId = context.clientId;
  const senderId = state.user?.uid;
  if (!senderId || !clientId || !text) return;
  if (text.length > CHAT_MAX_LENGTH) return;
  setComposer(kind, "");
  try {
    await addDoc(collection(db, "users", clientId, "messages"), {
      text,
      senderId,
      senderRole: context.role,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    if (state.user?.uid !== senderId) return;
    if (context.clientId !== clientId) {
      // Ya está abierto otro chat: el texto vuelve al borrador de su persona, no a la caja de la otra.
      const previous = context.drafts.get(clientId);
      context.drafts.set(clientId, previous ? `${text}\n${previous}` : text);
      return;
    }
    setComposer(kind, text);
    const { messages: list } = chatElements(kind);
    const failed = document.createElement("p");
    failed.className = "chat-empty chat-error";
    failed.textContent = "No se ha podido enviar. Revisa tu conexión e inténtalo de nuevo.";
    list.append(failed);
    list.scrollTop = list.scrollHeight;
    return;
  }
  const stamp = context.role === "client"
    ? { lastClientMessageAt: serverTimestamp() }
    : { lastProMessageAt: serverTimestamp(), lastProReadAt: serverTimestamp() };
  setDoc(doc(db, "users", clientId), stamp, { merge: true }).catch(() => {});
}

Object.keys(chatContexts).forEach((kind) => {
  const { form, input, count } = chatElements(kind);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    sendChatMessage(kind);
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      sendChatMessage(kind);
    }
  });
  input.addEventListener("input", () => {
    count.textContent = `${input.value.length}/${CHAT_MAX_LENGTH}`;
    input.style.height = "";
    input.style.height = `${Math.min(input.scrollHeight, 140)}px`;
  });
});

async function routeAuthenticatedUser(user) {
  state.user = user;
  try {
    // Si la cuenta se acaba de crear, espera a que termine de guardarse su documento (con el
    // consentimiento) antes de leerlo, para no crear otro documento encima.
    const registration = state.pendingRegistration;
    const registrationMode = state.pendingRegistrationMode;
    state.pendingRegistrationMode = null;
    if (registration) await registration;
    state.userData = await ensureUserDocument(user, registration ? registrationMode || undefined : undefined);
    state.isProfessional = await isProfessional(user);
    await setDoc(doc(db, "users", user.uid), { lastActiveAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
    if (state.isProfessional && !requestedRecipe && !wantsOwnApp) {
      beginProfessionalWorkspace();
      return;
    }
    if (state.stopUserListener) state.stopUserListener();
    state.stopUserListener = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
      if (!snapshot.exists()) return;
      const previous = state.userData || {};
      state.userData = snapshot.data();
      if (views.client.classList.contains("hidden")) return;
      const profile = state.userData.profile || {};
      const mode = state.userData.serviceMode || "self_guided";
      const hasCare = userHasCare(state.userData);
      document.querySelector("#client-greeting").textContent = profile.name ? `Hola, ${profile.name}` : "Hola";
      document.querySelector("#client-mode").textContent = labelForMode(mode);
      document.querySelector("#care-plan-section").classList.toggle("hidden", !hasCare);
      syncClientChat(hasCare);
      if (nutritionTargetFromUserData(previous) !== nutritionTargetFromUserData(state.userData)) {
        renderPersonalRecipe();
        refreshStats();
      }
      if (hasCare && (previous.careStatus !== state.userData.careStatus || previous.serviceMode !== mode)) {
        loadCarePlans(user.uid, "#client-care-plan");
      }
    });
    // Sin consentimiento vigente no se entra al perfil ni al espacio (cuentas antiguas, registro
    // que no llegó a guardarse o política nueva).
    await enterClientArea();
  } catch (error) {
    console.error(error);
    configureAuthMode(false);
    showView("auth");
    setMessage(document.querySelector("#auth-error"), "La cuenta existe, pero todavía falta completar la configuración segura del acceso web.", "error");
  }
}

onAuthStateChanged(auth, async (user) => {
  if (state.stopClientListener) {
    state.stopClientListener();
    state.stopClientListener = null;
  }
  if (state.stopUserListener) {
    state.stopUserListener();
    state.stopUserListener = null;
  }
  const wasSignedIn = Boolean(state.user);
  state.selectedClientId = null;
  stopChat("client", { forget: true });
  stopChat("pro", { forget: true });
  if (!user) {
    state.user = null;
    state.userData = null;
    state.isProfessional = false;
    // Las casillas de consentimiento nunca quedan marcadas para la siguiente persona.
    resetConsentBoxes();
    if (wasSignedIn) {
      document.querySelector("#email").value = "";
      document.querySelector("#password").value = "";
    }
    configureAuthMode(initialMode !== "login");
    showView("auth");
    return;
  }
  await routeAuthenticatedUser(user);
});

/* ---------- Pestañas de la app ---------- */
const TAB_NAMES = ["hoy", "comida", "moverme", "progreso", "logros"];

function savedTab() {
  try {
    const value = localStorage.getItem("pp-tab");
    return TAB_NAMES.includes(value) ? value : "hoy";
  } catch {
    return "hoy";
  }
}

function showTab(name, { focus = null } = {}) {
  const tab = TAB_NAMES.includes(name) ? name : "hoy";
  document.querySelectorAll("[data-panel]").forEach((panel) => panel.classList.toggle("hidden", panel.dataset.panel !== tab));
  document.querySelectorAll("[data-tab]").forEach((button) => {
    const active = button.dataset.tab === tab;
    button.classList.toggle("active", active);
    if (active) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  try { localStorage.setItem("pp-tab", tab); } catch { /* sin almacenamiento no pasa nada */ }
  if (tab === "moverme") renderExerciseLibrary();
  window.scrollTo({ top: 0 });
  if (focus) window.setTimeout(() => document.querySelector(focus)?.focus(), 60);
}

document.querySelectorAll("[data-tab]").forEach((button) => button.addEventListener("click", () => showTab(button.dataset.tab)));
document.querySelectorAll("[data-goto]").forEach((button) => button.addEventListener("click", () => showTab(button.dataset.goto, { focus: button.dataset.focus })));

/* ---------- Resumen, racha y logros ---------- */
function refreshStats() {
  if (!state.user || views.client.classList.contains("hidden")) return;
  state.stats = computeStats(state.days, { measurements: state.measurementCount });
  state.stats.weeklyGoal = currentPlan().days.reduce((sum, item) => sum + item.minutes, 0);
  renderToday(state.stats);
  renderMove(state.stats);
  renderWeeksChart(state.stats);
  renderAchievements(state.stats);
  saveNewAchievements(state.stats);
}

function setRing(element, percent) {
  const value = Math.max(0, Math.min(100, Math.round(percent)));
  element.style.setProperty("--value", String(value));
  element.querySelector(".ring-fg").style.strokeDasharray = `${value} 100`;
  element.querySelector(".ring-fg").style.opacity = value ? "1" : "0";
}

function dailyMoveGoal() {
  return todayPlan().minutes;
}

function renderWeekDots(container, dots) {
  const names = ["L", "M", "X", "J", "V", "S", "D"];
  const todayIndex = (new Date().getDay() + 6) % 7;
  container.replaceChildren(...dots.map((done, index) => {
    const dot = document.createElement("span");
    dot.className = `week-dot${done ? " done" : ""}${index === todayIndex ? " today" : ""}`;
    dot.textContent = names[index];
    dot.title = done ? "Día activo" : "Sin actividad";
    return dot;
  }));
  container.setAttribute("aria-label", `Días activos de esta semana: ${dots.filter(Boolean).length} de 7`);
}

function renderToday(stats) {
  const target = currentNutritionTarget();
  const eaten = Math.round(stats.today.calories);
  document.querySelector("#ring-food-value").textContent = String(eaten);
  setRing(document.querySelector("#ring-food"), target ? (eaten / target) * 100 : 0);
  document.querySelector("#ring-food-note").textContent = target
    ? `Referencia orientativa: unas ${target} kcal`
    : "Completa tu perfil para ver tu referencia";
  const moveGoal = dailyMoveGoal();
  const plan = todayPlan();
  document.querySelector("#ring-move-value").textContent = String(stats.today.minutes);
  setRing(document.querySelector("#ring-move"), moveGoal ? (stats.today.minutes / moveGoal) * 100 : (stats.today.minutes ? 100 : 0));
  document.querySelector("#ring-move-note").textContent = !moveGoal
    ? "Hoy toca descanso"
    : stats.today.minutes >= moveGoal ? "Lo de hoy, hecho" : `Hoy: ${plan.title.toLowerCase()}, ${moveGoal} min`;

  document.querySelector("#streak-count").textContent = `${stats.streak} ${stats.streak === 1 ? "día" : "días"}`;
  document.querySelector("#streak-note").textContent = stats.streak ? "seguidos" : "Apunta algo hoy para empezar tu racha";
  renderWeekDots(document.querySelector("#week-dots"), stats.week.dots);
  document.querySelector("#week-challenge-text").textContent = stats.week.challengeDone
    ? "Reto de la semana cumplido. ¡Muy bien!"
    : `Reto de la semana: ${stats.week.activeDays} de ${WEEK_CHALLENGE_DAYS} días activos.`;

  let step = nextStep(stats, { hasTarget: Boolean(target) });
  // Si hoy toca moverse y aún no está hecho, «Lo siguiente» dice qué toca según el plan.
  if (plan.kind !== "descanso" && !planDayDone(plan, todayId()) && (step.action === "moverme" || stats.today.meals.length)) {
    step = { text: `Hoy toca: ${plan.title.toLowerCase()}, ${plan.minutes} minutos. ${plan.detail}`, action: "moverme" };
  }
  document.querySelector("#next-step-text").textContent = step.text;
  const button = document.querySelector("#next-step-button");
  button.dataset.action = step.action;
  button.textContent = { comida: "Ir a Comida", moverme: "Ver mi plan", logros: "Ver el reto", perfil: "Completar perfil" }[step.action] || "Vamos";

  const water = stats.today.water;
  document.querySelector("#water-count").textContent = `${water} ${water === 1 ? "vaso" : "vasos"}`;
  document.querySelector("#water-minus").disabled = water <= 0;
}

document.querySelector("#next-step-button").addEventListener("click", (event) => {
  const action = event.currentTarget.dataset.action;
  if (action === "perfil") document.querySelector("#edit-profile").click();
  else showTab(action || "comida");
});

// Guarda campos del día de hoy sin tocar lo demás (comidas, actividades, agua).
async function updateToday(fields) {
  if (!state.user) throw new Error("Sin sesión");
  await setDoc(doc(db, "users", state.user.uid, "dailyNutrition", todayId()), { day: todayId(), ...fields, updatedAt: serverTimestamp() }, { merge: true });
  await setDoc(doc(db, "users", state.user.uid), { lastActiveAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
}

async function changeWater(delta) {
  const current = Number(todayDoc().water || 0);
  const next = Math.max(0, Math.min(30, current + delta));
  if (next === current) return;
  const day = todayDoc();
  if (day.id) day.water = next;
  else state.days.unshift({ id: todayId(), day: todayId(), water: next });
  refreshStats();
  try {
    await updateToday({ water: next });
  } catch {
    await loadClientDays();
  }
}
document.querySelector("#water-plus").addEventListener("click", () => changeWater(1));
document.querySelector("#water-minus").addEventListener("click", () => changeWater(-1));

/* ---------- Moverme ---------- */
function currentWeight() {
  const profileWeight = Number(state.userData?.profile?.weight);
  return state.latestWeight || (Number.isFinite(profileWeight) && profileWeight > 0 ? profileWeight : null);
}

async function saveActivity({ type, minutes, source = "manual", sessionId = null, label = null }) {
  if (!state.user) throw new Error("Sin sesión");
  const activity = activityById(type);
  const snapshot = await getDoc(doc(db, "users", state.user.uid, "dailyNutrition", todayId()));
  const activities = snapshot.exists() && Array.isArray(snapshot.data().activities) ? [...snapshot.data().activities] : [];
  const kcal = activityKcal(activity.met, currentWeight(), minutes);
  activities.push({
    id: `act-${Date.now()}`,
    type: activity.id,
    label: label || activity.label,
    minutes: Math.round(minutes),
    met: activity.met,
    ...(kcal ? { kcal } : {}),
    source,
    ...(sessionId ? { sessionId } : {}),
    at: new Date().toISOString(),
  });
  await updateToday({ activities });
  await loadClientDays();
}

const activitySelect = document.querySelector("#activity-type");
ACTIVITIES.filter((item) => item.id !== "sesion").forEach((item) => {
  const option = document.createElement("option");
  option.value = item.id;
  option.textContent = item.label;
  activitySelect.append(option);
});

function updateActivityEstimate() {
  const minutes = Number(document.querySelector("#activity-minutes").value);
  const kcal = minutes > 0 ? activityKcal(activityById(activitySelect.value).met, currentWeight(), minutes) : null;
  document.querySelector("#activity-estimate").textContent = kcal
    ? `Gasto aproximado: unas ${kcal} kcal. Es una estimación a partir de tu peso, no una medida.`
    : "";
}
activitySelect.addEventListener("change", updateActivityEstimate);
document.querySelector("#activity-minutes").addEventListener("input", updateActivityEstimate);

document.querySelector("#activity-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const minutes = Number(document.querySelector("#activity-minutes").value);
  const message = document.querySelector("#activity-message");
  const submit = event.currentTarget.querySelector('button[type="submit"]');
  if (!(minutes >= 1 && minutes <= 600)) {
    setMessage(message, "Indica entre 1 y 600 minutos.", "error");
    return;
  }
  setBusy(submit, true, "Guardando…", "Apuntar");
  setMessage(message);
  try {
    await saveActivity({ type: activitySelect.value, minutes });
    document.querySelector("#activity-minutes").value = "";
    updateActivityEstimate();
    setMessage(message, "Actividad apuntada.");
  } catch {
    setMessage(message, "No se ha podido guardar. Revisa tu conexión e inténtalo de nuevo.", "error");
  } finally {
    setBusy(submit, false, "", "Apuntar");
  }
});

function renderActivities(container, activities) {
  container.replaceChildren();
  container.className = activities.length ? "meal-list" : "empty-state";
  if (!activities.length) {
    container.textContent = "Todavía no has apuntado actividad hoy.";
    return;
  }
  [...activities].reverse().forEach((item) => {
    const row = document.createElement("div");
    row.className = "meal-row";
    const head = document.createElement("div");
    head.className = "meal-row-head";
    const title = document.createElement("strong");
    title.textContent = item.label || "Actividad";
    const time = document.createElement("small");
    time.textContent = formatTime(item.at);
    head.append(title, time);
    const detail = document.createElement("small");
    detail.textContent = [`${item.minutes} min`, item.kcal ? `≈ ${item.kcal} kcal (estimación)` : ""].filter(Boolean).join(" · ");
    row.append(head, detail);
    container.append(row);
  });
}

function renderMove(stats) {
  const level = recommendedLevel(stats);
  document.querySelector("#move-level").textContent = `Tu nivel: ${level}`;
  document.querySelector("#week-minutes").textContent = `${stats.week.minutes} min`;
  document.querySelector("#week-goal-note").textContent = stats.week.minutes >= stats.weeklyGoal
    ? `Objetivo de ${stats.weeklyGoal} min cumplido esta semana`
    : `de ${stats.weeklyGoal} min esta semana`;
  document.querySelector("#week-goal-bar").style.width = `${Math.min(100, Math.round((stats.week.minutes / stats.weeklyGoal) * 100))}%`;
  renderActivities(document.querySelector("#activity-list"), stats.today.activities);
  renderPlan();
  renderSessions(level);
  updateActivityEstimate();
}

function recommendedSession() {
  const level = state.stats ? recommendedLevel(state.stats) : 1;
  return SESSIONS.find((session) => session.level === level) || SESSIONS[0];
}

function runSession(session) {
  startSession(session, {
    onFinish: async ({ minutes, completed }) => {
      try {
        await saveActivity({ type: "sesion", minutes, source: "session", sessionId: session.id, label: `Sesión guiada · ${session.name}` });
        showToast(completed ? `Sesión ${session.name} terminada: ${minutes} min apuntados.` : `Has hecho ${minutes} min de la sesión. Quedan apuntados.`, "⏱️");
      } catch {
        showToast("No se ha podido guardar la sesión. Revisa tu conexión.", "⚠️");
      }
    },
  });
}

let sessionsRenderedFor = null;
function renderSessions(level) {
  if (sessionsRenderedFor === level) return;
  sessionsRenderedFor = level;
  const container = document.querySelector("#session-list");
  container.replaceChildren(...SESSIONS.map((session) => {
    const card = document.createElement("article");
    card.className = `surface session-card${session.level === level ? " recommended" : ""}`;
    const figure = document.createElement("div");
    figure.className = "session-card-figure";
    mountFigure(figure, session.cover || session.moves[0], { animate: false });
    const body = document.createElement("div");
    const badge = session.level === level ? '<span class="session-badge">Para ti</span>' : "";
    const levelText = session.level ? `Nivel ${session.level}` : "Para cualquier día";
    body.innerHTML = `<p class="eyebrow">${levelText}</p><h3></h3><p class="session-tagline"></p><p class="session-meta"></p>${badge}`;
    body.querySelector("h3").textContent = session.name;
    body.querySelector(".session-tagline").textContent = session.tagline;
    body.querySelector(".session-meta").textContent = `${sessionMinutes(session)} min · ${session.moves.length} ejercicios · ${session.work} s de trabajo y ${session.rest} s de descanso`;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "button primary";
    button.textContent = "Empezar";
    button.addEventListener("click", () => runSession(session));
    card.append(figure, body, button);
    return card;
  }));
}

document.querySelectorAll("[data-start-recommended]").forEach((button) => button.addEventListener("click", () => runSession(recommendedSession())));

let libraryRendered = false;
function renderExerciseLibrary() {
  if (libraryRendered) return;
  libraryRendered = true;
  const container = document.querySelector("#exercise-list");
  Object.entries(EXERCISES).forEach(([id, exercise]) => {
    const card = document.createElement("details");
    card.className = "surface exercise-card";
    const summary = document.createElement("summary");
    const figure = document.createElement("div");
    figure.className = "exercise-figure-box";
    let stop = mountFigure(figure, id, { animate: false });
    const text = document.createElement("span");
    text.innerHTML = "<strong></strong><small></small>";
    text.querySelector("strong").textContent = exercise.name;
    text.querySelector("small").textContent = exercise.muscles;
    summary.append(figure, text);
    const body = document.createElement("div");
    body.className = "exercise-body";
    const steps = document.createElement("ol");
    exercise.steps.forEach((step) => {
      const item = document.createElement("li");
      item.textContent = step;
      steps.append(item);
    });
    const variant = document.createElement("p");
    variant.className = "exercise-variant";
    variant.textContent = exercise.variant;
    // Dos viñetas quietas: dónde empieza el movimiento y hasta dónde llega.
    const keyframes = document.createElement("div");
    keyframes.className = "exercise-keyframes";
    if (exercise.poses.length > 1) {
      [["1. Empieza así", 0], ["2. Llega hasta aquí", exercise.poses.length - 1]].forEach(([caption, frame]) => {
        const item = document.createElement("figure");
        const box = document.createElement("div");
        box.className = "exercise-figure-box";
        mountFigure(box, id, { frame, label: `${exercise.name}: ${caption.slice(3).toLowerCase()}` });
        const text = document.createElement("figcaption");
        text.textContent = caption;
        item.append(box, text);
        keyframes.append(item);
      });
    }
    body.append(keyframes, steps, variant);
    card.append(summary, body);
    card.addEventListener("toggle", () => {
      stop();
      stop = mountFigure(figure, id, { animate: card.open });
    });
    container.append(card);
  });
}

document.querySelector("#reminder-button").addEventListener("click", () => {
  downloadReminder(document.querySelector("#reminder-time").value || "18:00");
  showToast("Abre el archivo descargado para añadir el aviso a tu calendario.", "🔔");
});

/* ---------- Progreso: minutos por semana ---------- */
function renderWeeksChart(stats) {
  const container = document.querySelector("#weeks-chart");
  const weeks = [...stats.pastWeeks.slice(0, 7).reverse(), stats.week];
  const max = Math.max(stats.weeklyGoal, ...weeks.map((week) => week.minutes), 1);
  const goalLine = document.createElement("span");
  goalLine.className = "weeks-goal";
  goalLine.style.bottom = `${(stats.weeklyGoal / max) * 100}%`;
  goalLine.dataset.label = `Objetivo: ${stats.weeklyGoal} min`;
  const bars = weeks.map((week, index) => {
    const column = document.createElement("div");
    column.className = `weeks-col${index === weeks.length - 1 ? " current" : ""}`;
    const share = (week.minutes / max) * 100;
    const bar = document.createElement("span");
    bar.className = "weeks-bar";
    bar.style.height = `${share}%`;
    bar.title = `${week.minutes} min`;
    const value = document.createElement("small");
    value.style.bottom = `${share}%`;
    value.textContent = week.minutes ? String(week.minutes) : "";
    column.append(bar, value);
    return column;
  });
  const labels = weeks.map((week, index) => {
    const label = document.createElement("em");
    const [, month, day] = week.monday.split("-");
    label.textContent = index === weeks.length - 1 ? "Esta" : `${Number(day)}/${Number(month)}`;
    return label;
  });
  const plot = document.createElement("div");
  plot.className = "weeks-plot";
  plot.append(goalLine, ...bars);
  const axis = document.createElement("div");
  axis.className = "weeks-labels";
  axis.append(...labels);
  container.replaceChildren(plot, axis);
}

/* ---------- Logros ---------- */
function storedAchievements() {
  const value = state.userData?.achievements;
  return value && typeof value === "object" ? value : {};
}

function renderAchievements(stats) {
  const stored = storedAchievements();
  const unlocked = ACHIEVEMENTS.filter((item) => stored[item.id] || isUnlocked(item, stats));
  document.querySelector("#logros-count").textContent = `${unlocked.length} de ${ACHIEVEMENTS.length}`;
  document.querySelector("#logros-streak").textContent = String(stats.streak);
  document.querySelector("#logros-best").textContent = String(stats.bestStreak);
  document.querySelector("#logros-sessions").textContent = String(stats.totalSessions);
  document.querySelector("#logros-weeks").textContent = String(stats.challengeWeeks);
  document.querySelector("#logros-challenge-note").textContent = stats.week.challengeDone
    ? "¡Cumplido! Lo que sumes ahora es extra."
    : `${stats.week.activeDays} de ${WEEK_CHALLENGE_DAYS} días activos de lunes a domingo`;
  renderWeekDots(document.querySelector("#logros-week-dots"), stats.week.dots);
  const card = (item) => {
    const done = Boolean(stored[item.id] || isUnlocked(item, stats));
    const [progress, total] = item.progress(stats);
    const element = document.createElement("article");
    element.className = `medal${done ? " unlocked" : ""}${item.kind === "cup" ? " cup" : ""}`;
    element.innerHTML = '<span class="medal-icon" aria-hidden="true"></span><strong></strong><small></small>';
    element.querySelector(".medal-icon").textContent = item.icon;
    element.querySelector("strong").textContent = item.name;
    element.querySelector("small").textContent = item.text;
    if (done) {
      const date = typeof stored[item.id] === "string" ? stored[item.id] : null;
      const when = document.createElement("em");
      when.textContent = date ? `Conseguida el ${formatDate(`${date}T12:00:00`)}` : "Conseguida";
      element.append(when);
    } else if (total > 1) {
      const bar = document.createElement("span");
      bar.className = "medal-bar";
      bar.innerHTML = "<span></span>";
      bar.firstElementChild.style.width = `${Math.round((progress / total) * 100)}%`;
      const count = document.createElement("em");
      count.textContent = `${progress} de ${total}`;
      element.append(bar, count);
    }
    element.setAttribute("aria-label", `${item.name}: ${done ? "conseguida" : "pendiente"}. ${item.text}`);
    return element;
  };
  document.querySelector("#medal-grid").replaceChildren(...ACHIEVEMENTS.filter((item) => item.kind === "medal").map(card));
  document.querySelector("#cup-grid").replaceChildren(...ACHIEVEMENTS.filter((item) => item.kind === "cup").map(card));
}

async function saveNewAchievements(stats) {
  if (!state.user || state.savingAchievements) return;
  const fresh = newAchievements(stats, storedAchievements());
  if (!fresh.length) return;
  state.savingAchievements = true;
  const today = todayId();
  const achievements = { ...storedAchievements() };
  fresh.forEach((item) => { achievements[item.id] = today; });
  try {
    await setDoc(doc(db, "users", state.user.uid), { achievements, updatedAt: serverTimestamp() }, { merge: true });
    state.userData = { ...(state.userData || {}), achievements };
    renderAchievements(stats);
    if (fresh.length === 1) showToast(`¡Nueva ${fresh[0].kind === "cup" ? "copa" : "medalla"}! ${fresh[0].name}`, fresh[0].icon, { celebrate: true });
    else showToast(`¡Has conseguido ${fresh.length} logros! Míralos en Logros.`, "🏅", { celebrate: true });
  } catch (error) {
    console.error(error);
  } finally {
    state.savingAchievements = false;
  }
  // Si mientras se guardaba se ha conseguido otro, se guarda ahora.
  if (state.stats && newAchievements(state.stats, storedAchievements()).length) saveNewAchievements(state.stats);
}

let toastTimer = null;
function showToast(text, icon = "✓", { celebrate = false } = {}) {
  const toast = document.querySelector("#achievement-toast");
  toast.replaceChildren();
  const iconElement = document.createElement("span");
  iconElement.className = "toast-icon";
  iconElement.setAttribute("aria-hidden", "true");
  iconElement.textContent = icon;
  const message = document.createElement("span");
  message.textContent = text;
  toast.append(iconElement, message);
  if (celebrate) {
    const link = document.createElement("button");
    link.type = "button";
    link.className = "toast-link";
    link.textContent = "Ver";
    link.addEventListener("click", () => { toast.classList.add("hidden"); showTab("logros"); });
    toast.append(link);
  }
  toast.classList.toggle("celebrate", celebrate);
  toast.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add("hidden"), 5200);
}

/* ---------- Plan de la semana ---------- */
function planLevel() {
  const chosen = Number(state.userData?.movePlanLevel);
  if (WEEK_PLANS[chosen]) return chosen;
  return state.stats ? recommendedLevel(state.stats) : 1;
}

function currentPlan() {
  return WEEK_PLANS[planLevel()];
}

function todayPlan() {
  return currentPlan().days[(new Date().getDay() + 6) % 7];
}

function dayActivities(id) {
  const found = state.days.find((item) => (item.day || item.id) === id);
  return Array.isArray(found?.activities) ? found.activities : [];
}

// Un día del plan cuenta como hecho si se ha apuntado al menos el 80 % de sus minutos, o la sesión guiada.
function planDayDone(plan, id) {
  if (plan.kind === "descanso") return false;
  const activities = dayActivities(id);
  if (plan.session && activities.some((item) => item.source === "session")) return true;
  const minutes = activities.reduce((sum, item) => sum + Number(item.minutes || 0), 0);
  return minutes > 0 && minutes >= plan.minutes * 0.8;
}

const PLAN_ICONS = { cardio: "👟", fuerza: "💪", movilidad: "🧘", libre: "🚴", descanso: "🌿" };

function renderPlan() {
  const level = planLevel();
  const plan = WEEK_PLANS[level];
  document.querySelectorAll("[data-plan-level]").forEach((button) => {
    const active = Number(button.dataset.planLevel) === level;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  const total = plan.days.reduce((sum, item) => sum + item.minutes, 0);
  const recommended = state.stats ? recommendedLevel(state.stats) : 1;
  document.querySelector("#plan-note").textContent = `Plan ${plan.name.toLowerCase()}: unos ${total} minutos a la semana, con ${plan.days.filter((item) => item.kind === "fuerza").length} días de ejercicios funcionales.`
    + (recommended !== level ? ` Por lo que llevas hecho, te recomendamos el plan ${WEEK_PLANS[recommended].name.toLowerCase()}.` : "");
  const monday = weekStart(new Date());
  const todayIndex = (new Date().getDay() + 6) % 7;
  const names = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
  const rows = plan.days.map((item, index) => {
    const date = new Date(monday.getTime() + index * 86400000);
    const id = dayId(date);
    const done = planDayDone(item, id);
    const row = document.createElement("article");
    row.className = `plan-day plan-${item.kind}${index === todayIndex ? " today" : ""}${done ? " done" : ""}${index < todayIndex && !done && item.kind !== "descanso" ? " missed" : ""}`;
    const when = document.createElement("div");
    when.className = "plan-when";
    when.innerHTML = "<strong></strong><small></small>";
    when.querySelector("strong").textContent = index === todayIndex ? "Hoy" : names[index];
    when.querySelector("small").textContent = `${date.getDate()}/${date.getMonth() + 1}`;
    const icon = document.createElement("span");
    icon.className = "plan-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = done ? "✓" : PLAN_ICONS[item.kind];
    const body = document.createElement("div");
    body.className = "plan-body";
    body.innerHTML = "<strong></strong><small></small>";
    body.querySelector("strong").textContent = item.minutes ? `${item.title} · ${item.minutes} min` : item.title;
    body.querySelector("small").textContent = item.detail;
    row.append(when, icon, body);
    if (index === todayIndex && item.kind !== "descanso" && !done) {
      const action = document.createElement("button");
      action.type = "button";
      action.className = "button primary plan-action";
      action.textContent = item.session ? "Empezar" : "Apuntar";
      action.addEventListener("click", () => {
        if (item.session) {
          runSession(SESSIONS.find((session) => session.id === item.session));
          return;
        }
        activitySelect.value = item.activity || "caminar";
        document.querySelector("#activity-minutes").value = String(item.minutes);
        updateActivityEstimate();
        document.querySelector("#activity-form").scrollIntoView({ behavior: "smooth", block: "center" });
        window.setTimeout(() => document.querySelector("#activity-minutes").focus(), 400);
      });
      row.append(action);
    } else if (done) {
      const tag = document.createElement("span");
      tag.className = "plan-tag";
      tag.textContent = "Hecho";
      row.append(tag);
    }
    return row;
  });
  document.querySelector("#plan-list").replaceChildren(...rows);
}

document.querySelectorAll("[data-plan-level]").forEach((button) => button.addEventListener("click", async () => {
  const level = Number(button.dataset.planLevel);
  state.userData = { ...(state.userData || {}), movePlanLevel: level };
  refreshStats();
  try {
    await setDoc(doc(db, "users", state.user.uid), { movePlanLevel: level, updatedAt: serverTimestamp() }, { merge: true });
  } catch (error) {
    console.error(error);
  }
}));
