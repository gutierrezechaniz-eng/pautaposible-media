// Figura de los ejercicios de «Moverme»: una persona dibujada de perfil, con huesos de largo fijo.
// Cada postura se describe con ángulos (no con puntos), así brazos y piernas nunca cambian de tamaño
// y el movimiento entre posturas es un giro natural de las articulaciones.
//
// Ángulos en grados: 0 = hacia abajo, 90 = hacia delante (hacia donde mira la persona),
// 180 = hacia arriba, -90 = hacia atrás.
// Postura: { hip: [x, y?], torso, neck?, armN: [brazo, antebrazo], armF, legN: [muslo, pierna, pie?], legF, ground? }
// En vez de ángulos, un brazo o una pierna puede llevar un objetivo: handN/handF o footN/footF = [x, y]
// (la mano o el tobillo van a ese punto; codo hacia abajo y rodilla hacia delante, o al revés con bendN/bendF).
// Con objetivos, la postura lleva ground: false y la altura de la cadera.
// N = brazo o pierna del lado cercano (oscuro, por delante); F = lado lejano (claro, por detrás).

const SVG_NS = "http://www.w3.org/2000/svg";
export const FLOOR = 186;
const LEN = { torso: 54, neck: 19, upper: 30, fore: 27, thigh: 40, shin: 38, foot: 13 };
const RADIUS = { head: 12, torso: 11, hand: 5, shoe: 4.5, knee: 7, elbow: 5 };

const dir = (deg) => [Math.sin((deg * Math.PI) / 180), Math.cos((deg * Math.PI) / 180)];
const step = (p, deg, length) => { const [dx, dy] = dir(deg); return [p[0] + dx * length, p[1] + dy * length]; };

// Pasa de ángulos a puntos y, si `ground` (por defecto), apoya en el suelo el punto más bajo.
export function solve(pose) {
  const hip = [pose.hip[0], pose.hip[1] ?? 100];
  const shoulder = step(hip, pose.torso ?? 180, LEN.torso);
  const neckAngle = pose.neck ?? pose.torso ?? 180;
  const head = step(shoulder, neckAngle, LEN.neck);
  const arm = (angles = [0, 0], target, bend = -1) => {
    if (target) angles = reach(shoulder, target, LEN.upper, LEN.fore, bend);
    const elbow = step(shoulder, angles[0], LEN.upper);
    return { elbow, hand: step(elbow, angles[1], LEN.fore) };
  };
  const leg = (angles = [0, 0], target, bend = 1) => {
    const footAngle = angles?.[2];
    if (target) angles = [...reach(hip, target, LEN.thigh, LEN.shin, bend), footAngle ?? 90];
    const knee = step(hip, angles[0], LEN.thigh);
    const ankle = step(knee, angles[1], LEN.shin);
    const foot = angles[2] ?? angles[1] + 90;
    return { knee, ankle, toe: step(ankle, foot, LEN.foot), footAngle: foot };
  };
  const p = {
    hip, shoulder, head, neckAngle,
    armN: arm(pose.armN, pose.handN, pose.bendN), armF: arm(pose.armF, pose.handF, pose.bendF),
    legN: leg(pose.legN, pose.footN, pose.kneeN), legF: leg(pose.legF, pose.footF, pose.kneeF),
  };
  if (pose.ground !== false) {
    const bottoms = [
      hip[1] + RADIUS.torso, shoulder[1] + RADIUS.torso, head[1] + RADIUS.head,
      ...["armN", "armF"].flatMap((k) => [p[k].elbow[1] + RADIUS.elbow, p[k].hand[1] + RADIUS.hand]),
      ...["legN", "legF"].flatMap((k) => [p[k].knee[1] + RADIUS.knee, p[k].ankle[1] + RADIUS.shoe, p[k].toe[1] + RADIUS.shoe]),
    ];
    const shift = FLOOR - Math.max(...bottoms) - (pose.lift || 0);
    shiftPose(p, shift);
    p.hipY = hip[1];
  }
  return p;
}

// Dos huesos (a y b) que salen de `root` y llegan a `target`: devuelve sus dos ángulos.
function reach(root, target, a, b, bend) {
  const d = Math.max(Math.abs(a - b) + 0.01, Math.min(Math.hypot(target[0] - root[0], target[1] - root[1]), a + b - 0.01));
  const towards = angleOf(root, target);
  const inner = (Math.acos((a * a + d * d - b * b) / (2 * a * d)) * 180) / Math.PI;
  const upper = towards + bend * inner;
  const joint = step(root, upper, a);
  return [upper, angleOf(joint, target)];
}

// Fija la altura de la cadera de una postura apoyada en el suelo, para poder mezclarla con otras.
export function settle(pose) {
  if (pose.ground === false) return pose;
  const p = solve(pose);
  return { ...pose, hip: [pose.hip[0], p.hipY], ground: false, lift: 0 };
}

function shiftPose(p, dy) {
  const move = (pt) => { pt[1] += dy; };
  [p.hip, p.shoulder, p.head].forEach(move);
  ["armN", "armF"].forEach((k) => { move(p[k].elbow); move(p[k].hand); });
  ["legN", "legF"].forEach((k) => { move(p[k].knee); move(p[k].ankle); move(p[k].toe); });
}

// Mezcla dos posturas ya asentadas (ground: false). Para no mezclar un ángulo con un objetivo,
// cada brazo o pierna se mezcla en el mismo formato que tengan las dos posturas; si no coincide,
// se usan los ángulos resueltos.
export function blend(a, b, t) {
  const mix = (x, y) => x + (y - x) * t;
  const out = { hip: [mix(a.hip[0], b.hip[0]), mix(a.hip[1], b.hip[1])], ground: false };
  out.torso = mix(a.torso ?? 180, b.torso ?? 180);
  out.neck = mix(a.neck ?? a.torso ?? 180, b.neck ?? b.torso ?? 180);
  const pa = solve(a); const pb = solve(b);
  const limbAngles = (p, key) => {
    const root = key.startsWith("arm") ? p.shoulder : p.hip;
    const limb = p[key];
    if (key.startsWith("arm")) return [angleOf(root, limb.elbow), angleOf(limb.elbow, limb.hand)];
    return [angleOf(root, limb.knee), angleOf(limb.knee, limb.ankle), limb.footAngle];
  };
  [["armN", "handN", "bendN"], ["armF", "handF", "bendF"], ["legN", "footN", "kneeN"], ["legF", "footF", "kneeF"]].forEach(([key, target, bend]) => {
    if (a[target] && b[target]) {
      out[target] = [mix(a[target][0], b[target][0]), mix(a[target][1], b[target][1])];
      out[bend] = a[bend];
      const footA = a[key]?.[2]; const footB = b[key]?.[2];
      if (footA !== undefined || footB !== undefined) out[key] = [0, 0, mix(footA ?? 90, footB ?? 90)];
      return;
    }
    const x = limbAngles(pa, key); const y = limbAngles(pb, key);
    out[key] = x.map((value, i) => mix(value, y[i] + 360 * Math.round((value - y[i]) / 360)));
  });
  return out;
}

function el(name, attrs = {}) {
  const node = document.createElementNS(SVG_NS, name);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
}

// Crea las piezas de una figura dentro de `group`. Devuelve paint(p) para colocarla.
function buildBody(group, { ghost = false, prop = null } = {}) {
  const parts = [];
  const seg = (cls, width) => {
    const outline = ghost ? null : el("line", { class: "fig-out", "stroke-width": width + 3.5 });
    const line = el("line", { class: ghost ? "fig-ghost" : cls, "stroke-width": width });
    if (outline) group.append(outline);
    group.append(line);
    return (a, b) => [outline, line].forEach((node) => {
      if (!node) return;
      node.setAttribute("x1", a[0].toFixed(1)); node.setAttribute("y1", a[1].toFixed(1));
      node.setAttribute("x2", b[0].toFixed(1)); node.setAttribute("y2", b[1].toFixed(1));
    });
  };
  const dot = (cls, r) => {
    const node = el("circle", { class: ghost ? "fig-ghost-fill" : cls, r });
    group.append(node);
    return (pt) => { node.setAttribute("cx", pt[0].toFixed(1)); node.setAttribute("cy", pt[1].toFixed(1)); };
  };
  // Lado lejano primero (queda detrás), luego tronco y cabeza, luego el lado cercano.
  const farArm = [seg("fig-sleeve-far", 10), seg("fig-skin-far", 8), dot("fig-skin-far-fill", 4.5)];
  const farLeg = [seg("fig-pants-far", 14), seg("fig-pants-far", 11.5), seg("fig-shoe-far", 8)];
  const neckLine = seg("fig-skin", 8);
  const torso = seg("fig-shirt", 23);
  const hair = dot("fig-hair", RADIUS.head);
  const face = dot("fig-skin-fill", RADIUS.head - 1.6);
  const eye = ghost ? null : dot("fig-eye", 1.6);
  const nearLeg = [seg("fig-pants", 14), seg("fig-pants", 11.5), seg("fig-shoe", 8)];
  const bag = prop === "bag" && !ghost ? el("rect", { width: 20, height: 24, rx: 6, class: "fig-bag" }) : null;
  if (bag) group.append(bag);
  const nearArm = [seg("fig-sleeve", 10), seg("fig-skin", 8), dot("fig-skin-fill", 4.5)];
  parts.push(farArm, farLeg, nearLeg, nearArm);

  return (p) => {
    const paintArm = ([upper, fore, hand], a) => { upper(p.shoulder, a.elbow); fore(a.elbow, a.hand); hand(a.hand); };
    const paintLeg = ([thigh, shin, foot], l) => { thigh(p.hip, l.knee); shin(l.knee, l.ankle); foot(l.ankle, l.toe); };
    paintArm(farArm, p.armF);
    paintLeg(farLeg, p.legF);
    neckLine(p.shoulder, p.head);
    // El tronco se dibuja un poco más corto para que los hombros queden redondeados.
    torso(step(p.hip, angleOf(p.hip, p.shoulder), 2), step(p.shoulder, angleOf(p.shoulder, p.hip), 3));
    hair(p.head);
    // La cara mira hacia delante: el pelo asoma por detrás y por arriba.
    const faceAngle = p.neckAngle - 90;
    face(step(step(p.head, faceAngle, 2.2), p.neckAngle + 180, 1.2));
    if (eye) eye(step(step(p.head, faceAngle, 6.5), p.neckAngle, 1.5));
    paintLeg(nearLeg, p.legN);
    if (bag) {
      bag.setAttribute("x", (p.armN.hand[0] - 10).toFixed(1));
      bag.setAttribute("y", (p.armN.hand[1] - 3).toFixed(1));
    }
    paintArm(nearArm, p.armN);
  };
}

function angleOf(a, b) {
  return (Math.atan2(b[0] - a[0], b[1] - a[1]) * 180) / Math.PI;
}

function drawProps(svg, props = [], box) {
  svg.append(el("line", { x1: box.x + 4, y1: FLOOR, x2: box.x + box.w - 4, y2: FLOOR, class: "fig-floor" }));
  const prop = (name) => props.find((item) => (item.type || item) === name);
  if (prop("mat")) {
    const mat = prop("mat");
    svg.append(el("rect", { x: mat.x ?? box.x + 14, y: FLOOR - 2, width: mat.w ?? box.w - 28, height: 5, rx: 2.5, class: "fig-mat" }));
  }
  const wall = prop("wall");
  if (wall) svg.append(el("rect", { x: wall.x, y: FLOOR - 170, width: 9, height: 170, rx: 2, class: "fig-wall" }));
  const chair = prop("chair");
  if (chair) {
    // Silla de perfil: respaldo detrás de la persona y asiento a la altura de la rodilla.
    const x = chair.x; const seat = FLOOR - 44; const depth = 36;
    svg.append(el("path", { d: `M${x} ${FLOOR} V${seat} M${x - 2} ${seat} H${x + depth} M${x + depth - 3} ${seat} V${FLOOR} M${x} ${seat} V${seat - 44}`, class: "fig-chair" }));
  }
  const step = prop("step");
  if (step) svg.append(el("rect", { x: step.x, y: FLOOR - 22, width: step.w ?? 46, height: 22, rx: 3, class: "fig-step" }));
}

// Caja que contiene todas las posturas del ejercicio, con proporción fija 6:5.
function boundsOf(exercise) {
  const xs = []; const ys = [];
  const add = (pt, r = 0) => { xs.push(pt[0] - r, pt[0] + r); ys.push(pt[1] - r, pt[1] + r); };
  exercise.poses.forEach((pose) => {
    const p = solve(settle(pose));
    add(p.head, RADIUS.head); add(p.hip, RADIUS.torso); add(p.shoulder, RADIUS.torso);
    ["armN", "armF"].forEach((k) => { add(p[k].elbow, 6); add(p[k].hand, 6); });
    ["legN", "legF"].forEach((k) => { add(p[k].knee, 8); add(p[k].ankle, 6); add(p[k].toe, 6); });
  });
  (exercise.props || []).forEach((item) => {
    if (item.type === "wall") { xs.push(item.x, item.x + 9); ys.push(FLOOR - 170); }
    if (item.type === "chair") { xs.push(item.x, item.x + 36); ys.push(FLOOR - 88); }
    if (item.type === "step") { xs.push(item.x, item.x + (item.w ?? 46)); }
  });
  ys.push(FLOOR + 6);
  let x0 = Math.min(...xs) - 16; let x1 = Math.max(...xs) + 16;
  let y0 = Math.min(...ys) - 12; const y1 = Math.max(...ys) + 2;
  let w = x1 - x0; let h = y1 - y0;
  const ratio = 6 / 5;
  if (w / h < ratio) { const extra = h * ratio - w; x0 -= extra / 2; w = h * ratio; }
  else { const extra = w / ratio - h; y0 -= extra; h = w / ratio; }
  return { x: x0, y: y0, w, h };
}

// Flecha de doble punta que enseña hacia dónde va el movimiento.
function drawArrow(svg, exercise) {
  if (!exercise.arrow) return;
  const { joint, from = 0, to = exercise.poses.length - 1, offset = [0, 0], bend = 0 } = exercise.arrow;
  const pick = (p) => joint.split(".").reduce((value, key) => value[key], p);
  const a = pick(solve(settle(exercise.poses[from]))); const b = pick(solve(settle(exercise.poses[to])));
  const s = [a[0] + offset[0], a[1] + offset[1]]; const e = [b[0] + offset[0], b[1] + offset[1]];
  const len = Math.hypot(e[0] - s[0], e[1] - s[1]) || 1;
  const ux = (e[0] - s[0]) / len; const uy = (e[1] - s[1]) / len;
  const trim = Math.min(5, len / 4);
  const s2 = [s[0] + ux * trim, s[1] + uy * trim]; const e2 = [e[0] - ux * trim, e[1] - uy * trim];
  const mid = [(s2[0] + e2[0]) / 2 - uy * bend, (s2[1] + e2[1]) / 2 + ux * bend];
  svg.append(el("path", { d: `M${s2[0].toFixed(1)} ${s2[1].toFixed(1)} Q${mid[0].toFixed(1)} ${mid[1].toFixed(1)} ${e2[0].toFixed(1)} ${e2[1].toFixed(1)}`, class: "fig-arrow", "marker-start": "url(#fig-head)", "marker-end": "url(#fig-head)" }));
}

let figureCount = 0;

// Dibuja el ejercicio en `container`. Con `animate`, se mueve entre posturas con una pausa en cada extremo.
// Sin animar, enseña la postura final con la inicial en gris y la flecha del movimiento.
// `frame` fija una postura concreta (para las viñetas «Empieza» y «Llega»).
export function mountExerciseFigure(container, exercise, { animate = true, frame = null, label = "" } = {}) {
  container.replaceChildren();
  if (!exercise) return () => {};
  const box = boundsOf(exercise);
  const svg = el("svg", { viewBox: `${box.x.toFixed(1)} ${box.y.toFixed(1)} ${box.w.toFixed(1)} ${box.h.toFixed(1)}`, class: "exercise-figure", role: "img", "aria-label": label || `Dibujo del ejercicio: ${exercise.name}` });
  const id = `fig-head-${(figureCount += 1)}`;
  const defs = el("defs");
  const marker = el("marker", { id, viewBox: "0 0 10 10", refX: "5", refY: "5", markerWidth: "4", markerHeight: "4", orient: "auto-start-reverse" });
  marker.append(el("path", { d: "M0 0 L10 5 L0 10 z", class: "fig-arrow-head" }));
  defs.append(marker);
  svg.append(defs);
  drawProps(svg, exercise.props, box);
  const poses = exercise.poses.map(settle);
  // La postura inicial en gris solo en el dibujo quieto: en movimiento ya se ve el recorrido.
  const showGhost = frame === null && !animate && poses.length > 1 && exercise.ghost !== false;
  if (showGhost) {
    const ghostGroup = el("g", { class: "fig-ghost-group" });
    svg.append(ghostGroup);
    buildBody(ghostGroup, { ghost: true })(solve(poses[0]));
  }
  if (frame === null) {
    drawArrow(svg, exercise);
    svg.querySelectorAll(".fig-arrow").forEach((path) => {
      path.setAttribute("marker-start", `url(#${id})`);
      path.setAttribute("marker-end", `url(#${id})`);
    });
  }
  const bodyGroup = el("g");
  svg.append(bodyGroup);
  const paint = buildBody(bodyGroup, { prop: exercise.props?.some((item) => (item.type || item) === "bag") ? "bag" : null });
  container.append(svg);

  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (frame !== null || !animate || reduced || poses.length < 2) {
    paint(solve(poses[frame ?? poses.length - 1]));
    return () => {};
  }
  // Ida y vuelta por las posturas: movimiento suave y una pausa corta en cada postura.
  const sequence = [...poses, ...poses.slice(1, -1).reverse()];
  const move = 1150 / (exercise.speed || 1);
  const hold = exercise.hold ?? 450;
  const span = move + hold;
  let raf = 0;
  const start = performance.now();
  const tick = (now) => {
    const elapsed = Math.max(0, now - start);
    const index = Math.floor(elapsed / span) % sequence.length;
    const local = elapsed % span;
    const t = local < hold ? 0 : (local - hold) / move;
    const eased = (1 - Math.cos(Math.PI * t)) / 2;
    paint(solve(blend(sequence[index], sequence[(index + 1) % sequence.length], eased)));
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}
