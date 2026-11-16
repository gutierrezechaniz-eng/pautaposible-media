// Cinco Colores: el juego familiar de Pauta Posible para comer variado.
// Trece casillas al día, cinco colores y un campeón cada domingo.
// Gratis y sin cuenta: la partida de la familia se guarda solo en este dispositivo (localStorage).

/* ---------- Reglas del juego ---------- */
const GROUPS = [
  { k: "V", name: "Verdura", fixed: 3, opt: 0 },
  { k: "F", name: "Fruta", fixed: 2, opt: 1 },
  { k: "C", name: "Cereal", fixed: 3, opt: 3 },
  { k: "P", name: "Proteína", fixed: 2, opt: 0 },
  { k: "G", name: "Grasa buena", fixed: 3, opt: 0 },
];
const RETOS = [
  { k: "leg", name: "Legumbres", goal: 4, type: "min", txt: "4 raciones o más" },
  { k: "pes", name: "Pescado", goal: 3, type: "min", txt: "3 raciones o más, mejor azul" },
  { k: "fru", name: "Frutos secos", goal: 3, type: "min", txt: "3 raciones o más, al natural" },
  { k: "hue", name: "Huevos", goal: 4, type: "max", txt: "hasta 4 a la semana" },
  { k: "car", name: "Carne", goal: 3, type: "max", txt: "hasta 3 raciones, mejor blanca" },
];
const DAYS = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];
const PDF = "/cinco-colores/cinco-colores-para-imprimir.pdf";

// Lo que se aprende jugando: una frase corta al llenar una casilla de cada color.
const TIPS = {
  V: [
    "La verdura llena el plato con pocas calorías y mucha fibra.",
    "La fibra de la verdura alimenta a las bacterias buenas de la tripa.",
    "Cuantos más colores de verdura, más variedad de vitaminas.",
  ],
  F: [
    "Mejor la fruta entera que en zumo: conserva la fibra y sacia más.",
    "Una pieza de fruta es el postre o la merienda más fácil.",
    "La fruta de temporada suele ser más barata y más sabrosa.",
  ],
  C: [
    "Mejor integral: más fibra y te deja saciado más tiempo.",
    "La patata también cuenta como cereal en este juego.",
    "Una ración de pasta son 60–80 g en seco: un plato normal.",
  ],
  P: [
    "Las legumbres son proteína y fibra a la vez: al menos 4 a la semana.",
    "El pescado azul (sardina, caballa, salmón) aporta omega-3.",
    "Alterna legumbre, pescado, huevo y carne a lo largo de la semana.",
  ],
  G: [
    "El aceite de oliva virgen extra es la grasa de la dieta mediterránea.",
    "Un puñado de frutos secos al natural cuenta como grasa buena.",
    "Una cucharada de aceite por comida principal es una ración.",
  ],
};
const BLACK_TIPS = [
  "Los refrescos llevan mucho azúcar: el agua es la bebida de siempre.",
  "La bollería suma azúcar y grasa sin llenar: mejor pan con tomate o fruta.",
  "El alcohol no aporta nada bueno: cuanto menos, mejor.",
];

/* ---------- Estado y guardado ---------- */
const KEY = "cinco-colores-v1";
let state = { players: [], days: {}, weeks: {}, me: null };
function load() {
  try {
    const s = localStorage.getItem(KEY);
    if (s) state = Object.assign(state, JSON.parse(s));
  } catch { /* sin almacenamiento se juega igual, pero no se guarda */ }
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* sin almacenamiento */ }
}

/* ---------- Fechas ---------- */
function iso(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }
function parse(s) { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); }
function addDays(s, n) { const d = parse(s); d.setDate(d.getDate() + n); return iso(d); }
function monday(s) { const d = parse(s); const wd = (d.getDay() + 6) % 7; d.setDate(d.getDate() - wd); return iso(d); }
function weekDays(m) { return [0, 1, 2, 3, 4, 5, 6].map((i) => addDays(m, i)); }
function nice(s) { return parse(s).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" }); }
function cap(t) { return t.charAt(0).toUpperCase() + t.slice(1); }
function short(s) { return parse(s).toLocaleDateString("es-ES", { day: "numeric", month: "short" }); }
function today() { return iso(new Date()); }
let TODAY = today();
let cur = TODAY;
let tab = "hoy";
let shareUrl = null;

/* ---------- Registros ---------- */
function blank() {
  const cells = {};
  GROUPS.forEach((g) => { cells[g.k] = Array(g.fixed + g.opt).fill(0); });
  return { cells, kh: 0, kf: 0, agua: false, mov: false, dairy: 0, joker: false };
}
function emptyWeek() { return { leg: 0, pes: 0, fru: 0, hue: 0, car: 0 }; }
function rec(day, pid, create) {
  let d = state.days[day];
  if (!d) { if (!create) return null; d = state.days[day] = {}; }
  if (!d[pid]) { if (!create) return null; d[pid] = blank(); }
  return d[pid];
}
function wrec(m, pid, create) {
  let w = state.weeks[m];
  if (!w) { if (!create) return emptyWeek(); w = state.weeks[m] = {}; }
  if (!w[pid]) { if (!create) return emptyWeek(); w[pid] = emptyWeek(); }
  return w[pid];
}
function filled(r) { let t = 0; GROUPS.forEach((g) => { for (let i = 0; i < g.fixed; i++) t += r.cells[g.k][i]; }); return t; }
function penalty(r) { return (r.joker ? 0 : r.kh * 0.5 + r.kf) + Math.max(0, r.dairy - 3) * 0.5; }
function played(r) { return !!r && (filled(r) > 0 || r.kh > 0 || r.kf > 0 || r.agua || r.mov || r.dairy > 0 || GROUPS.some((g) => r.cells[g.k].some((v) => v > 0))); }
function score(r) { return r ? Math.max(0, filled(r) - penalty(r)) : 0; }
function stars(r) { return r ? (r.agua ? 1 : 0) + (r.mov ? 1 : 0) : 0; }
function fmt(n) { return (Math.round(n * 2) / 2).toLocaleString("es-ES"); }
function winners(day) {
  const list = state.players.map((p) => ({ p, r: rec(day, p.id) })).filter((x) => played(x.r));
  if (!list.length) return [];
  const best = Math.max(...list.map((x) => score(x.r)));
  let top = list.filter((x) => score(x.r) === best);
  const bs = Math.max(...top.map((x) => stars(x.r)));
  top = top.filter((x) => stars(x.r) === bs);
  return top.map((x) => x.p.id);
}
function weekTable(m) {
  const days = weekDays(m);
  const rows = state.players.map((p) => {
    const w = wrec(m, p.id);
    let pts = 0;
    let col = 0;
    const perDay = days.map((d) => {
      const r = rec(d, p.id);
      const win = winners(d).includes(p.id);
      if (win) pts++;
      col += score(r);
      return { played: played(r), s: score(r), win };
    });
    const retos = RETOS.filter((x) => x.type === "min" && w[x.k] >= x.goal).length;
    const topes = RETOS.filter((x) => x.type === "max" && w[x.k] > x.goal).length;
    return { p, perDay, pts, retos, topes, total: pts + retos - topes, col };
  });
  rows.sort((a, b) => b.total - a.total || b.col - a.col);
  return rows;
}

/* ---------- Pintado ---------- */
let root = null;
let toastEl = null;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function toast(t, ms = 1900) {
  toastEl.textContent = t;
  toastEl.classList.add("show");
  clearTimeout(toast.t);
  toast.t = setTimeout(() => toastEl.classList.remove("show"), ms);
}
function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

const TABS = [["hoy", "Hoy"], ["semana", "Mi semana"], ["marcador", "Marcador"], ["raciones", "Raciones"], ["reglas", "Cómo se juega"]];
function tabsBar() {
  return `<nav class="cc-tabs" aria-label="Secciones del juego">${TABS.map(([k, n]) => `<button type="button" aria-pressed="${tab === k}" data-cctab="${k}">${n}</button>`).join("")}</nav>`;
}
function playersBar() {
  return `<div class="cc-players">${state.players.map((p) => `<button type="button" class="cc-pill ${p.id === state.me ? "on" : ""}" data-me="${p.id}" aria-pressed="${p.id === state.me}">${esc(p.name)}</button>`).join("")}<button type="button" class="cc-pill ghost" data-cctab="jugadores">+ Jugadores</button></div>`;
}
function needPlayer() {
  return `<h3 class="cc-h">¿Quién juega?</h3><p class="cc-muted">Añade a las personas de casa, pequeños incluidos. Cada una tiene su tablero.</p>${playersForm()}
  <div class="cc-card"><h4>Así funciona</h4><p class="cc-muted" style="margin:0">Cada ración que coméis llena una casilla de su color: verdura, fruta, cereal, proteína y grasa buena. Quien más colores reúna se lleva el punto del día, y el domingo hay campeón.</p></div>`;
}
function playersForm() {
  return `<div class="cc-card"><h4>Jugadores</h4>
    ${state.players.map((p) => `<div class="cc-row cc-spread" style="padding:6px 0"><span>${esc(p.name)}</span><button type="button" class="cc-pill" data-del="${p.id}">Quitar</button></div>`).join("") || '<p class="cc-muted">Todavía no hay nadie.</p>'}
    <form class="cc-field" data-addp><input name="pname" maxlength="18" placeholder="Nombre" aria-label="Nombre del jugador" autocomplete="off"><button class="cc-pill on" type="submit">Añadir</button></form>
  </div>`;
}
function weekNav(m, days) {
  return `<div class="cc-daynav"><button type="button" class="cc-iconbtn" data-week="-1" aria-label="Semana anterior">‹</button><strong>Semana del ${short(m)} al ${short(days[6])}</strong><button type="button" class="cc-iconbtn" data-week="1" aria-label="Semana siguiente" ${addDays(m, 7) > TODAY ? "disabled" : ""}>›</button></div>`;
}

function viewHoy() {
  if (!state.players.length) return needPlayer();
  const r = rec(cur, state.me) || blank();
  const m = monday(cur);
  const jokerUsedElsewhere = weekDays(m).some((d) => d !== cur && (rec(d, state.me) || {}).joker);
  const groups = GROUPS.map((g) => {
    const cells = r.cells[g.k].map((v, i) => {
      const cls = (v === 1 ? "full" : v === 0.5 ? "half" : "") + (i >= g.fixed ? " opt" : "");
      const st = v === 1 ? "llena" : v === 0.5 ? "media" : "vacía";
      return `<button type="button" class="cc-cell ${cls}" data-cell="${g.k}:${i}" aria-label="${g.name} ${i + 1}, ${st}${i >= g.fixed ? ", opcional" : ""}">${g.k}${v === 0.5 ? "<small>½</small>" : ""}</button>`;
    }).join("");
    const extra = g.opt ? ` · +${g.opt} ${g.opt === 1 ? "opcional" : "opcionales"}` : "";
    return `<div class="cc-grp g${g.k}"><div class="cc-lab">${g.name} · ${g.fixed}${extra}</div><div class="cc-cells">${cells}</div></div>`;
  }).join("");
  return `${playersBar()}
  <div class="cc-daynav"><button type="button" class="cc-iconbtn" data-day="-1" aria-label="Día anterior">‹</button><strong>${cur === TODAY ? `Hoy, ${nice(cur)}` : cap(nice(cur))}</strong><button type="button" class="cc-iconbtn" data-day="1" aria-label="Día siguiente" ${cur >= TODAY ? "disabled" : ""}>›</button></div>
  <div class="cc-card"><div class="cc-row cc-spread"><div class="cc-score"><b>${fmt(score(r))}</b><span>de 13 colores</span></div><div class="cc-muted">${stars(r)} ${stars(r) === 1 ? "estrella" : "estrellas"}</div></div>
    ${groups}
    <p class="cc-muted" style="margin:12px 0 0">Toca una casilla para llenarla. Otro toque la deja a medias y otro la vacía. Las de borde discontinuo son opcionales: no suman ni restan.</p>
  </div>
  <div class="cc-kbox"><div class="cc-row cc-spread"><h4 style="margin:0">Fichas negras</h4><span class="cc-muted">picoteo y bares</span></div>
    <div class="cc-row" style="margin-top:10px"><button type="button" class="cc-kbtn" data-k="h" aria-label="Ficha negra pequeña, resta medio color">−½</button><span class="cc-kcount">${r.kh}</span><button type="button" class="cc-pill" data-ku="h" ${r.kh ? "" : "disabled"}>Quitar</button><span class="cc-muted">café con leche, pintxo, zumo</span></div>
    <div class="cc-row" style="margin-top:10px"><button type="button" class="cc-kbtn" data-k="f" aria-label="Ficha negra grande, resta un color">−1</button><span class="cc-kcount">${r.kf}</span><button type="button" class="cc-pill" data-ku="f" ${r.kf ? "" : "disabled"}>Quitar</button><span class="cc-muted">refresco, alcohol, bollería</span></div>
    <div class="cc-row" style="margin-top:12px"><button type="button" class="cc-pill ${r.joker ? "gold" : ""}" data-joker ${jokerUsedElsewhere && !r.joker ? "disabled" : ""}>${r.joker ? "Comodín usado hoy" : "Usar el comodín de la semana"}</button></div>
    <p class="cc-muted" style="margin:8px 0 0">${r.joker ? "Hoy las fichas negras no restan." : jokerUsedElsewhere ? "Ya has usado el comodín esta semana." : "Con el comodín, las fichas negras de hoy no restan."}</p>
  </div>
  <div class="cc-card"><h4>Estrellas</h4>
    <div class="cc-row"><button type="button" class="cc-pill ${r.agua ? "gold" : ""}" data-star="agua" aria-pressed="${r.agua}">★ Agua en todas las comidas</button><button type="button" class="cc-pill ${r.mov ? "gold" : ""}" data-star="mov" aria-pressed="${r.mov}">★ Movimiento</button></div>
    <p class="cc-muted" style="margin:8px 0 0">Movimiento: 7.000 pasos los mayores, una hora de juego o deporte los pequeños.</p>
    <div class="cc-row cc-spread" style="margin-top:12px"><div><b>Lácteos de hoy</b><div class="cc-muted">opcionales, hasta 3</div></div><div class="cc-step"><button type="button" data-dairy="-1" aria-label="Quitar un lácteo">−</button><b>${r.dairy}</b><button type="button" data-dairy="1" aria-label="Añadir un lácteo">+</button></div></div>
    ${r.dairy > 3 ? '<p class="cc-muted" style="margin:8px 0 0">Cada lácteo a partir del cuarto resta medio color.</p>' : ""}
  </div>`;
}

function viewSemana() {
  if (!state.players.length) return needPlayer();
  const m = monday(cur);
  const days = weekDays(m);
  const w = wrec(m, state.me);
  const rows = days.map((d, i) => {
    const r = rec(d, state.me);
    const win = winners(d).includes(state.me);
    return `<tr class="${win ? "win" : ""}"><td style="text-transform:capitalize">${DAYS[i]} <span class="cc-muted">${short(d)}</span></td><td>${played(r) ? fmt(score(r)) : "—"}</td><td>${played(r) ? stars(r) : "—"}</td><td>${win ? '<span class="cc-crown">●</span> 1' : played(r) ? "0" : "—"}</td></tr>`;
  }).join("");
  const retos = RETOS.map((x) => {
    const v = w[x.k];
    const ok = x.type === "min" ? v >= x.goal : v <= x.goal;
    const tag = x.type === "min"
      ? (ok ? '<span class="cc-tag ok">+1 punto</span>' : `<span class="cc-tag wait">faltan ${x.goal - v}</span>`)
      : (ok ? '<span class="cc-tag ok">dentro</span>' : '<span class="cc-tag bad">−1 punto</span>');
    return `<div class="cc-reto"><div><div class="cc-name">${x.name} ${tag}</div><div class="cc-goal">${x.txt}</div></div><div class="cc-step"><button type="button" data-reto="${x.k}:-1" aria-label="Quitar una de ${x.name}">−</button><b>${v}</b><button type="button" data-reto="${x.k}:1" aria-label="Añadir una de ${x.name}">+</button></div></div>`;
  }).join("");
  return `${playersBar()}
  ${weekNav(m, days)}
  <div class="cc-card cc-scroll"><table><thead><tr><th>Día</th><th>Colores</th><th>Estrellas</th><th>Punto</th></tr></thead><tbody>${rows}</tbody></table></div>
  <h3 class="cc-h">Retos de la semana</h3><p class="cc-muted">Suma uno cada vez que comas una ración. Los tres primeros dan un punto extra; pasarse en los dos últimos quita uno.</p>
  <div class="cc-card">${retos}</div>`;
}

function viewMarcador() {
  if (!state.players.length) return needPlayer();
  const m = monday(cur);
  const days = weekDays(m);
  const rows = weekTable(m);
  const any = rows.some((r) => r.perDay.some((d) => d.played));
  const head = ["L", "M", "X", "J", "V", "S", "D"].map((d) => `<th>${d}</th>`).join("");
  const body = rows.map((r, i) => `<tr class="${i === 0 && any ? "win" : ""}"><td>${i === 0 && any ? '<span class="cc-crown">●</span> ' : ""}${esc(r.p.name)}</td>${r.perDay.map((d) => `<td>${d.played ? (d.win ? "1" : "0") : "·"}</td>`).join("")}<td>${r.retos ? `+${r.retos}` : "0"}</td><td>${r.topes ? `−${r.topes}` : "0"}</td><td><b>${r.total}</b></td></tr>`).join("");
  return `${weekNav(m, days)}
  <div class="cc-card cc-scroll"><table class="tight"><thead><tr><th>Jugador</th>${head}<th>Retos</th><th>Topes</th><th>Total</th></tr></thead><tbody>${body}</tbody></table>
    <p class="cc-muted" style="margin:10px 0 0">${any ? `Va en cabeza ${esc(rows[0].p.name)}. Si hay empate, gana quien haya reunido más colores en la semana.` : "Aún no hay nada apuntado esta semana."}</p></div>
  <button type="button" class="cc-cta" data-share>Compartir el marcador</button>
  <button type="button" class="cc-cta alt" data-copy>Copiar el resultado en texto</button>
  ${shareUrl ? `<img class="cc-shareimg" src="${shareUrl}" alt="Marcador de la semana"><p class="cc-muted" style="margin-top:8px">Mantén pulsada la imagen para guardarla o enviarla por WhatsApp.</p>` : ""}
  ${playersForm()}`;
}

const RAC = [
  ["V", "Verduras", "3 raciones al día como mínimo", [["Ensalada variada", "150–200 g", "1 plato llano"], ["Verdura cocida, al vapor o salteada", "150–200 g", "1 plato"], ["Crema o puré de verduras", "150–200 g", "1 plato hondo"], ["Tomate", "150–200 g", "2 medianos"], ["Pimiento, calabacín", "150–200 g", "1 pieza"], ["Zanahoria", "150–200 g", "2 grandes"]]],
  ["F", "Frutas", "2 o 3 raciones al día, enteras", [["Manzana, pera, naranja, plátano", "120–200 g", "1 pieza mediana"], ["Fresas o cerezas", "120–200 g", "1 tazón mediano"], ["Melón o sandía", "120–200 g", "2 rodajas"], ["Mandarinas o kiwis", "120–200 g", "2 unidades"], ["Uvas", "120–200 g", "1 racimo pequeño"]]],
  ["C", "Cereales", "De 3 a 6 al día, mejor integrales", [["Pan", "40–60 g", "3–4 rebanadas o 1 panecillo"], ["Pasta o arroz", "60–80 g en seco", "1 plato normal"], ["Patata y otros tubérculos", "150–200 g", "1 grande o 2 pequeñas"], ["Copos de avena", "40–60 g", "4–6 cucharadas"], ["Quinoa, cuscús, bulgur", "60–80 g en seco", "1 plato normal"]]],
  ["P", "Proteínas", "2 al día: comida y cena", [["Legumbres", "50–60 g en seco", "1 plato individual"], ["Legumbre cocida o de bote", "unos 170 g", "1 plato individual"], ["Pescado", "125–150 g", "1 filete individual"], ["Carne", "100–125 g", "1 filete mediano"], ["Huevos", "1 o 2", "hasta 4 a la semana"]]],
  ["G", "Grasas buenas", "3 al día: una por comida principal", [["Aceite de oliva virgen extra", "10 ml", "1 cucharada sopera"], ["Almendras o avellanas", "20–30 g", "15–20 unidades"], ["Nueces", "20–30 g", "5 unidades"], ["Semillas", "20–30 g", "2 cucharadas"], ["Aguacate", "60–80 g", "½ pieza"]]],
];
function viewRaciones() {
  const blocks = RAC.map(([k, n, sub, rows], i) => `<details class="cc-details" ${i === 0 ? "open" : ""}><summary><span class="cc-dot" style="background:var(--cc-${k})"></span>${n}<span class="cc-muted" style="font-weight:500">${sub}</span></summary><div class="cc-in cc-scroll"><table><thead><tr><th>Alimento</th><th>Una ración</th><th>En casa</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td></tr>`).join("")}</tbody></table></div></details>`).join("");
  return `<h3 class="cc-h">Cuánto es una ración</h3><p class="cc-muted">Raciones de las recomendaciones dietéticas de la AESAN (2022) para la población general. Algunas medidas caseras son orientativas.</p>${blocks}
  <div class="cc-card"><h4>Lácteos</h4><p class="cc-muted" style="margin:0">Opcionales, hasta 3 al día y sin azúcares añadidos: un vaso de leche, un yogur, 85–125 g de queso fresco o 40–60 g de queso curado.</p></div>
  <a class="cc-cta alt" href="${PDF}" download>Descargar las tablas completas en PDF</a>`;
}
function viewReglas() {
  return `<h3 class="cc-h">Cómo se juega</h3>
  <div class="cc-card"><ol class="cc-how">
    <li><b>Come y toca.</b> Cada ración llena una casilla de su color. Un plato de lentejas es una P; una manzana, una F.</li>
    <li><b>Trece casillas fijas.</b> Cada una vale un color. Las de borde discontinuo son opcionales y no suman ni restan.</li>
    <li><b>Fichas negras.</b> El picoteo y lo del bar restan: medio color lo pequeño, uno entero el refresco, el alcohol o la bollería. El agua y el café solo no restan.</li>
    <li><b>Estrellas.</b> Una por beber agua en todas las comidas y otra por moverte. Deshacen los empates.</li>
    <li><b>Punto del día.</b> Se lo lleva quien más colores reúna. El domingo se suman los puntos, los retos cumplidos y los topes superados.</li>
    <li><b>Comodín.</b> Una vez por semana, en una comida especial, las fichas negras no restan.</li>
  </ol></div>
  <div class="cc-card"><h4>Con niños en casa</h4><p class="cc-muted" style="margin:0">Juegan con el mismo tablero. La ración se la sirve un adulto a su medida, sin báscula. El juego no sustituye al pediatra ni al dietista-nutricionista.</p></div>
  <div class="cc-card"><h4>¿Lo prefieres en papel o en la nevera?</h4><p class="cc-muted">El juego completo para imprimir: tablero, fichas, tablas e instrucciones.</p><a class="cc-cta" href="${PDF}" download>Descargar el PDF gratis</a><a class="cc-cta alt" href="/recetas/">Ideas de platos en las recetas</a></div>
  <p class="cc-muted" style="margin-top:14px">No hace falta cuenta: la partida se guarda solo en este móvil, tablet u ordenador. Si borras los datos del navegador, se pierde.</p>`;
}
function viewJugadores() {
  return `<h3 class="cc-h">Jugadores</h3><p class="cc-muted">Cada persona tiene su tablero y su semana. Hasta 8 jugadores.</p>${playersForm()}<button type="button" class="cc-cta" data-cctab="hoy">Volver al tablero</button>`;
}

function render() {
  const now = today();
  if (now !== TODAY) { if (cur === TODAY) cur = now; TODAY = now; }
  if (state.players.length && !state.players.some((p) => p.id === state.me)) state.me = state.players[0].id;
  const v = { hoy: viewHoy, semana: viewSemana, marcador: viewMarcador, raciones: viewRaciones, reglas: viewReglas, jugadores: viewJugadores }[tab] || viewHoy;
  root.querySelector("[data-cc-view]").innerHTML = tabsBar() + v();
}

/* ---------- Compartir ---------- */
function shareText() {
  const m = monday(cur);
  const rows = weekTable(m);
  return `Cinco Colores · semana del ${short(m)} al ${short(addDays(m, 6))}\n${rows.map((r, i) => `${i + 1}. ${r.p.name}: ${r.total} ${r.total === 1 ? "punto" : "puntos"} (${fmt(r.col)} colores)`).join("\n")}\npautaposible.es`;
}
function box(x, X, Y, w, h, r) {
  x.beginPath();
  if (x.roundRect) { x.roundRect(X, Y, w, h, r); return; }
  x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r);
  x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath();
}
function drawShare() {
  const m = monday(cur);
  const rows = weekTable(m);
  const font = getComputedStyle(document.body).fontFamily || "sans-serif";
  const c = document.createElement("canvas");
  c.width = 1080; c.height = 1350;
  const x = c.getContext("2d");
  x.fillStyle = "#2E6F57"; x.fillRect(0, 0, 1080, 1350);
  x.fillStyle = "#DDEEDF"; x.font = `800 30px ${font}`; x.fillText("PAUTA POSIBLE", 84, 120);
  x.fillStyle = "#fff"; x.font = `800 104px ${font}`; x.fillText("Cinco Colores", 84, 250, 912);
  x.fillStyle = "#DDEEDF"; x.font = `500 40px ${font}`; x.fillText(`Semana del ${short(m)} al ${short(addDays(m, 6))}`, 84, 320, 912);
  ["#3f9650", "#a8458c", "#2e6fb7", "#c2452d", "#d99a1e"].forEach((col, i) => { x.fillStyle = col; box(x, 84 + i * 84, 360, 64, 64, 14); x.fill(); });
  let y = 520;
  rows.slice(0, 6).forEach((r, i) => {
    x.fillStyle = i === 0 ? "#D7A95B" : "#ffffff"; box(x, 84, y, 912, 110, 28); x.fill();
    x.fillStyle = "#24322A"; x.font = `800 48px ${font}`; x.fillText(`${i + 1}. ${r.p.name}`, 120, y + 70, 560);
    x.textAlign = "right"; x.fillText(`${r.total} ${r.total === 1 ? "punto" : "puntos"}`, 960, y + 58);
    x.font = `500 26px ${font}`; x.fillText(`${fmt(r.col)} colores`, 960, y + 92); x.textAlign = "left";
    y += 130;
  });
  x.fillStyle = "#DDEEDF"; x.font = `500 34px ${font}`; x.fillText("¿Jugáis en casa? pautaposible.es", 84, 1270);
  return c;
}
async function doShare() {
  let c;
  try { c = drawShare(); } catch { toast("No se ha podido crear la imagen"); return; }
  try {
    const blob = await new Promise((res) => c.toBlob(res, "image/png"));
    const file = new File([blob], "cinco-colores.png", { type: "image/png" });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], text: "Nuestro marcador de Cinco Colores" });
      return;
    }
  } catch (e) {
    if (e && e.name === "AbortError") return; // la persona cerró el menú de compartir
  }
  try { shareUrl = c.toDataURL("image/png"); render(); toast("Imagen lista, más abajo"); } catch { toast("No se ha podido crear la imagen"); }
}
async function doCopy() {
  try { await navigator.clipboard.writeText(shareText()); toast("Resultado copiado"); } catch { toast("No se ha podido copiar"); }
}

/* ---------- Acciones ---------- */
function onClick(e) {
  const t = e.target.closest("button");
  if (!t || !root.contains(t)) return;
  const d = t.dataset;
  if (d.cctab) { tab = d.cctab; shareUrl = null; render(); root.scrollIntoView({ block: "start" }); return; }
  if (d.me) { state.me = d.me; save(); render(); return; }
  if (d.day) { const n = addDays(cur, +d.day); if (n <= TODAY) { cur = n; render(); } return; }
  if (d.week) {
    const n = addDays(monday(cur), 7 * +d.week);
    if (n <= TODAY) { cur = (+d.week > 0 && addDays(n, 6) > TODAY) ? TODAY : n; shareUrl = null; render(); }
    return;
  }
  if (d.del) {
    if (d.sure !== "1") { d.sure = "1"; t.textContent = "¿Seguro? Toca otra vez"; return; }
    state.players = state.players.filter((p) => p.id !== d.del);
    save(); render(); return;
  }
  if ("share" in d) { doShare(); return; }
  if ("copy" in d) { doCopy(); return; }
  if (!state.me) return;
  let tip = null;
  if (d.cell) {
    const [k, i] = d.cell.split(":");
    const r = rec(cur, state.me, true);
    const v = r.cells[k][+i];
    r.cells[k][+i] = v === 0 ? 1 : v === 1 ? 0.5 : 0;
    if (v === 0) tip = pick(TIPS[k]);
  } else if (d.k) {
    const r = rec(cur, state.me, true);
    if (d.k === "h") r.kh++; else r.kf++;
    if (d.k === "f") tip = pick(BLACK_TIPS);
  } else if (d.ku) {
    const r = rec(cur, state.me, true);
    if (d.ku === "h") r.kh = Math.max(0, r.kh - 1); else r.kf = Math.max(0, r.kf - 1);
  } else if ("joker" in d) {
    const r = rec(cur, state.me, true); r.joker = !r.joker;
  } else if (d.star) {
    const r = rec(cur, state.me, true); r[d.star] = !r[d.star];
  } else if (d.dairy) {
    const r = rec(cur, state.me, true); r.dairy = Math.max(0, Math.min(9, r.dairy + +d.dairy));
  } else if (d.reto) {
    const [k, n] = d.reto.split(":");
    const w = wrec(monday(cur), state.me, true);
    w[k] = Math.max(0, Math.min(30, w[k] + +n));
  } else return;
  save(); render();
  if (tip) toast(tip, 3200);
}
function onSubmit(e) {
  if (!e.target.matches("[data-addp]")) return;
  e.preventDefault();
  const input = e.target.elements.pname;
  const name = input.value.trim();
  if (!name) return;
  if (state.players.length >= 8) { toast("Máximo 8 jugadores"); return; }
  const id = `p${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
  state.players.push({ id, name });
  if (!state.me) state.me = id;
  save(); render();
  root.querySelector("[data-addp] input")?.focus();
}

/** Monta el juego online en el contenedor de la página /cinco-colores/. Se puede llamar varias veces. */
export function mountCincoColores(container) {
  if (!container) return;
  if (root !== container) {
    root = container;
    root.innerHTML = `<div data-cc-view></div><div class="cc-toast" role="status" aria-live="polite"></div>`;
    toastEl = root.querySelector(".cc-toast");
    root.addEventListener("click", onClick);
    root.addEventListener("submit", onSubmit);
    load();
  }
  render();
}
