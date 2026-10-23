// «Moverme»: actividades, ejercicios básicos con dibujos animados propios y sesiones guiadas.
// Nivel general, para empezar a moverse: nada de entrenamientos especializados.
// Las calorías de la actividad son una estimación (MET × peso × horas, Compendio de actividades
// físicas de Ainsworth y col., 2011) y se muestran siempre como aproximadas.

import { mountExerciseFigure } from "/app/figura.js";

export const ACTIVITIES = [
  { id: "caminar", label: "Caminar tranquilo", met: 3.0 },
  { id: "caminar-rapido", label: "Caminar a paso rápido", met: 4.3 },
  { id: "escaleras", label: "Subir escaleras", met: 4.0 },
  { id: "bici", label: "Bici suave", met: 5.8 },
  { id: "correr", label: "Correr suave", met: 7.0 },
  { id: "nadar", label: "Nadar suave", met: 6.0 },
  { id: "bailar", label: "Bailar", met: 5.0 },
  { id: "gimnasio", label: "Gimnasio ligero", met: 3.5 },
  { id: "estiramientos", label: "Yoga o estiramientos", met: 2.5 },
  { id: "casa", label: "Tareas de casa activas", met: 3.3 },
  { id: "sesion", label: "Sesión guiada de Pauta Posible", met: 3.8 },
];

export function activityById(id) {
  return ACTIVITIES.find((item) => item.id === id) || ACTIVITIES[0];
}

// Estimación de la energía gastada. Sin peso válido no se calcula.
export function activityKcal(met, weightKg, minutes) {
  const kg = Number(weightKg);
  if (!Number.isFinite(kg) || kg <= 0) return null;
  return Math.round(Number(met) * kg * (Number(minutes) / 60));
}

/* ---------- Ejercicios ---------- */
// Dibujos propios (app/figura.js): persona de perfil mirando a la derecha. Lado cercano oscuro,
// lado lejano claro. Las posturas van en ángulos (0 abajo, 90 delante, 180 arriba) o con objetivos.
// `arrow` marca qué parte del cuerpo se mueve y hacia dónde.
const FLOOR_Y = 181.5; // altura del tobillo apoyado en el suelo
const STAND = { hip: [120], torso: 180, neck: 180, armN: [4, 8], armF: [-6, -2], legN: [2, 0], legF: [-3, -2] };
const stand = (changes = {}) => ({ ...STAND, ...changes });
// Tumbado boca arriba, cabeza a la izquierda, rodillas dobladas y pies apoyados.
const SUPINE = {
  hip: [116, 174], torso: -90, neck: -94, ground: false,
  armN: [96, 92], armF: [92, 90],
  footN: [160, FLOOR_Y], footF: [154, FLOOR_Y], legN: [0, 0, 92], legF: [0, 0, 92],
};
const supine = (changes = {}) => ({ ...SUPINE, ...changes });

export const EXERCISES = {
  marcha: {
    name: "Marcha en el sitio",
    muscles: "Calentamiento",
    steps: ["De pie, espalda alta y mirada al frente.", "Sube una rodilla hasta la altura de la cadera y bájala; luego la otra.", "Mueve los brazos al contrario que las piernas, como al caminar."],
    variant: "Más suave: sube poco las rodillas o apoya una mano en una pared.",
    poses: [
      stand({ legN: [80, 0], legF: [-2, 0], armN: [-35, -10], armF: [40, 95] }),
      stand({ legN: [2, 0], legF: [80, 0], armN: [40, 95], armF: [-35, -10] }),
    ],
    speed: 1.1,
    ghost: false,
  },
  sentadilla: {
    name: "Sentadilla a la silla",
    muscles: "Piernas y glúteos",
    steps: ["De pie, con una silla detrás y los pies a la anchura de los hombros.", "Lleva la cadera atrás y abajo, como para sentarte, con el pecho alto y los brazos al frente.", "Roza la silla y sube empujando con los talones."],
    variant: "Más suave: siéntate del todo y levántate. Para avanzar: sin silla.",
    props: [{ type: "chair", x: 62 }],
    poses: [
      stand({ armN: [4, 8], armF: [-6, -2] }),
      stand({ hip: [87], torso: 145, neck: 160, legN: [80, -10, 90], legF: [77, -12, 90], armN: [96, 92], armF: [90, 88] }),
    ],
    arrow: { joint: "hip", offset: [-6, -22], bend: 8 },
  },
  "flexion-pared": {
    name: "Flexión en la pared",
    muscles: "Pecho y brazos",
    steps: ["De cara a la pared, a un paso largo. Manos en la pared a la altura del pecho.", "Cuerpo recto de la cabeza a los talones.", "Dobla los codos hasta acercar el pecho a la pared y vuelve empujando."],
    variant: "Más fácil: ponte más cerca de la pared. Para avanzar: apoyada en una mesa firme.",
    props: [{ type: "wall", x: 196 }],
    poses: [
      { hip: [105, 114], torso: 150, neck: 150, ground: false, footN: [72, FLOOR_Y], footF: [66, FLOOR_Y], legN: [0, 0, 90], legF: [0, 0, 90], handN: [190, 68], handF: [190, 74] },
      { hip: [114, 122], torso: 138, neck: 140, ground: false, footN: [72, FLOOR_Y], footF: [66, FLOOR_Y], legN: [0, 0, 100], legF: [0, 0, 100], handN: [190, 68], handF: [190, 74] },
    ],
    arrow: { joint: "shoulder", offset: [0, -24] },
  },
  puente: {
    name: "Puente de glúteo",
    muscles: "Glúteos y espalda baja",
    steps: ["Boca arriba, rodillas dobladas y pies apoyados cerca del culo.", "Aprieta los glúteos y sube la cadera hasta que rodillas, cadera y hombros queden en línea.", "Baja despacio, sin dejarte caer."],
    variant: "Más suave: sube menos la cadera. Para avanzar: aguanta 2 segundos arriba.",
    props: [{ type: "mat" }],
    poses: [
      supine(),
      supine({ hip: [112, 140], torso: -53, neck: -96 }),
    ],
    arrow: { joint: "hip", offset: [0, 0] },
    hold: 700,
  },
  plancha: {
    name: "Plancha con rodillas",
    muscles: "Abdomen",
    steps: ["Boca abajo, apoya los antebrazos con los codos justo debajo de los hombros.", "Apoya las rodillas y sube la cadera hasta que el cuerpo quede recto de la cabeza a las rodillas.", "Aprieta el abdomen y aguanta respirando con calma."],
    variant: "Para avanzar: plancha con las piernas estiradas, apoyando las puntas de los pies.",
    props: [{ type: "mat" }],
    poses: [
      { hip: [100, 166], torso: 107, neck: 100, ground: false, armN: [0, 90], armF: [-3, 88], legN: [-71, -100, -150], legF: [-74, -102, -150] },
    ],
  },
  zancada: {
    name: "Zancada hacia atrás",
    muscles: "Piernas y equilibrio",
    steps: ["De pie, manos en la cintura.", "Da un paso largo hacia atrás y baja hasta que la rodilla de atrás casi toque el suelo.", "Vuelve empujando con la pierna de delante. Alterna las piernas."],
    variant: "Más fácil: apoya una mano en una pared o una silla y baja menos.",
    poses: [
      stand({ hip: [110], armN: [-40, 85], armF: [-48, 80] }),
      { hip: [100, 140], torso: 180, neck: 180, ground: false, armN: [-40, 85], armF: [-48, 80], footN: [140, FLOOR_Y], legN: [0, 0, 90], footF: [54, 172], legF: [0, 0, 140] },
    ],
    arrow: { joint: "hip", offset: [-24, 0] },
  },
  remo: {
    name: "Remo con mochila",
    muscles: "Espalda y brazos",
    steps: ["Mochila con algo de peso en la mano, rodillas un poco dobladas.", "Inclínate hacia delante desde la cadera, con la espalda recta.", "Sube la mochila hacia la cintura llevando el codo atrás y bájala despacio."],
    variant: "Más fácil: con una botella de agua o sin peso.",
    props: ["bag"],
    poses: [
      stand({ hip: [104], torso: 118, neck: 112, legN: [18, -6, 90], legF: [14, -8, 90], armN: [2, 0], armF: [-2, -2] }),
      stand({ hip: [104], torso: 118, neck: 112, legN: [18, -6, 90], legF: [14, -8, 90], armN: [-74, 4], armF: [-2, -2] }),
    ],
    arrow: { joint: "armN.hand", offset: [18, 0] },
  },
  "peso-muerto": {
    name: "Bisagra con mochila",
    muscles: "Glúteos y espalda",
    steps: ["De pie, pies a la anchura de la cadera y la mochila delante de los muslos.", "Lleva la cadera hacia atrás e inclínate con la espalda recta y las rodillas un poco dobladas.", "Sube apretando los glúteos, con la mochila cerca de las piernas."],
    variant: "Más fácil: sin peso, solo el movimiento.",
    props: ["bag"],
    poses: [
      stand({ armN: [6, 4], armF: [2, 0] }),
      stand({ hip: [110], torso: 112, neck: 108, legN: [16, -4, 90], legF: [12, -6, 90], armN: [2, 0], armF: [-2, -2] }),
    ],
    arrow: { joint: "head", offset: [6, -18], bend: -14 },
  },
  talones: {
    name: "Elevación de talones",
    muscles: "Gemelos y tobillos",
    steps: ["De pie, cerca de una pared por si necesitas apoyo.", "Sube los talones y quédate un segundo de puntillas.", "Baja despacio."],
    variant: "Más fácil: con las dos manos en la pared.",
    poses: [
      stand({ legN: [0, 0, 90], legF: [-2, -2, 88] }),
      stand({ legN: [0, 0, 150], legF: [-2, -2, 148] }),
    ],
    arrow: { joint: "head", offset: [24, 0] },
    hold: 700,
  },
  brazos: {
    name: "Brazos arriba",
    muscles: "Hombros y movilidad",
    steps: ["De pie, brazos relajados a los lados.", "Súbelos estirados por delante hasta arriba, sin forzar.", "Bájalos despacio y respira."],
    variant: "Más fácil: súbelos solo hasta la altura de los hombros.",
    poses: [
      stand({ armN: [4, 4], armF: [-2, -2] }),
      stand({ armN: [90, 90], armF: [86, 86] }),
      stand({ armN: [172, 172], armF: [168, 168] }),
    ],
    arrow: { joint: "armN.hand", from: 0, to: 2, offset: [0, 0], bend: 46 },
    speed: 0.8,
  },
  abdominal: {
    name: "Abdominales (encogimiento)",
    muscles: "Abdomen",
    steps: ["Boca arriba, rodillas dobladas y pies apoyados.", "Despega cabeza y hombros del suelo llevando las manos hacia las rodillas.", "Baja despacio, sin tirar del cuello."],
    variant: "Más fácil: sube menos. Para avanzar: aguanta 2 segundos arriba.",
    props: [{ type: "mat" }],
    poses: [
      supine({ armN: [96, 92], armF: [92, 90] }),
      supine({ torso: -122, neck: -132, armN: [108, 108], armF: [104, 104] }),
    ],
    arrow: { joint: "head", offset: [0, -10], bend: -10 },
  },
  cuadrupedia: {
    name: "Cuadrupedia (brazo y pierna)",
    muscles: "Abdomen y espalda",
    steps: ["A cuatro patas: manos bajo los hombros y rodillas bajo la cadera.", "Estira un brazo hacia delante y la pierna contraria hacia atrás, a la altura de la espalda.", "Vuelve despacio y cambia de lado."],
    variant: "Más fácil: estira solo el brazo o solo la pierna.",
    props: [{ type: "mat" }],
    poses: [
      { hip: [96, 141], torso: 108, neck: 104, ground: false, armN: [0, 0], armF: [-3, -3], legN: [2, -90, -95], legF: [-1, -90, -95] },
      { hip: [96, 141], torso: 108, neck: 104, ground: false, armN: [0, 0], armF: [100, 100], legN: [-84, -86, -12], legF: [-1, -90, -95] },
    ],
    arrow: { joint: "legN.ankle", offset: [0, -14], bend: -10 },
    speed: 0.7,
    hold: 700,
  },
  "sentadilla-pared": {
    name: "Sentadilla en la pared",
    muscles: "Piernas",
    steps: ["Espalda apoyada en la pared y pies un paso por delante.", "Baja deslizando la espalda hasta que las rodillas queden más o menos en ángulo recto, sobre los tobillos.", "Aguanta respirando y sube despacio."],
    variant: "Más fácil: baja menos y aguanta menos tiempo.",
    props: [{ type: "wall", x: 70 }],
    poses: [
      { hip: [91, 104], torso: 178, neck: 180, ground: false, footN: [118, FLOOR_Y], footF: [112, FLOOR_Y], armN: [4, 6], armF: [-2, 0] },
      { hip: [91, 140], torso: 178, neck: 180, ground: false, footN: [130, FLOOR_Y], footF: [124, FLOOR_Y], armN: [10, 70], armF: [4, 64] },
    ],
    arrow: { joint: "hip", offset: [-0, -26] },
    hold: 1000,
  },
  "flexion-rodillas": {
    name: "Flexión con rodillas",
    muscles: "Pecho, brazos y abdomen",
    steps: ["Manos en el suelo algo más abiertas que los hombros y rodillas apoyadas.", "Cuerpo recto de la cabeza a las rodillas.", "Baja el pecho doblando los codos y sube empujando el suelo."],
    variant: "Más fácil: flexión en la pared. Para avanzar: con las piernas estiradas.",
    props: [{ type: "mat" }],
    poses: [
      { hip: [96, 148], torso: 112, neck: 104, ground: false, handN: [156, 181], handF: [150, 181], footN: [24, 170], footF: [20, 172], kneeN: -1, kneeF: -1, legN: [0, 0, -40], legF: [0, 0, -40] },
      { hip: [98, 164], torso: 100, neck: 96, ground: false, handN: [156, 181], handF: [150, 181], footN: [24, 170], footF: [20, 172], kneeN: -1, kneeF: -1, legN: [0, 0, -40], legF: [0, 0, -40] },
    ],
    arrow: { joint: "shoulder", offset: [12, -18] },
  },
  escalon: {
    name: "Subir al escalón",
    muscles: "Piernas y glúteos",
    steps: ["De pie frente a un escalón bajo y firme.", "Sube un pie entero al escalón y empuja con esa pierna hasta subir del todo.", "Baja despacio y alterna la pierna."],
    variant: "Más fácil: con un escalón más bajo y la mano en la barandilla.",
    props: [{ type: "step", x: 120, w: 60 }],
    poses: [
      { hip: [104, 103.5], torso: 180, neck: 180, ground: false, footN: [138, 159.5], footF: [100, FLOOR_Y], armN: [-10, 0], armF: [12, 20], legN: [0, 0, 90], legF: [0, 0, 90] },
      { hip: [140, 82], torso: 180, neck: 180, ground: false, footN: [140, 159.5], footF: [128, 152], armN: [10, 20], armF: [-12, -4], legN: [0, 0, 90], legF: [0, 0, 130] },
    ],
    arrow: { joint: "hip", offset: [-22, -8], bend: 6 },
  },
  superman: {
    name: "Superman",
    muscles: "Espalda y glúteos",
    steps: ["Boca abajo, brazos estirados por delante.", "Despega a la vez un poco los brazos, el pecho y las piernas, mirando al suelo.", "Aguanta un segundo y baja despacio."],
    variant: "Más fácil: levanta solo los brazos o solo las piernas.",
    props: [{ type: "mat" }],
    poses: [
      { hip: [104, 176], torso: 92, neck: 98, ground: false, armN: [95, 95], armF: [93, 93], legN: [-92, -92, -80], legF: [-90, -90, -78] },
      { hip: [104, 176], torso: 104, neck: 112, ground: false, armN: [114, 114], armF: [110, 110], legN: [-104, -104, -92], legF: [-101, -101, -90] },
    ],
    arrow: { joint: "armN.hand", offset: [8, 0] },
    hold: 800,
  },
  "bicho-muerto": {
    name: "Bicho muerto",
    muscles: "Abdomen",
    steps: ["Boca arriba, brazos hacia el techo y rodillas dobladas en el aire, sobre la cadera.", "Estira despacio un brazo hacia atrás y la pierna contraria hacia delante, sin arquear la espalda.", "Vuelve al centro y cambia de lado."],
    variant: "Más fácil: mueve solo las piernas, una y luego la otra.",
    props: [{ type: "mat" }],
    poses: [
      { hip: [118, 174], torso: -90, neck: -94, ground: false, armN: [178, 178], armF: [176, 176], legN: [178, 90, 180], legF: [176, 88, 178] },
      { hip: [118, 174], torso: -90, neck: -94, ground: false, armN: [-112, -112], armF: [176, 176], legN: [178, 90, 180], legF: [102, 98, 186] },
    ],
    arrow: { joint: "armN.hand", offset: [0, 0], bend: 26 },
    speed: 0.7,
  },
  escalador: {
    name: "Escalador suave",
    muscles: "Abdomen y piernas",
    steps: ["Manos apoyadas en el suelo bajo los hombros y piernas estiradas atrás.", "Lleva una rodilla hacia el pecho y vuelve a estirarla.", "Alterna las piernas a un ritmo tranquilo."],
    variant: "Más fácil: con las manos en una silla firme o en un escalón.",
    props: [{ type: "mat" }],
    poses: [
      { hip: [100, 137], torso: 104, neck: 102, ground: false, handN: [154, 181], handF: [148, 181], footN: [30, FLOOR_Y - 6], footF: [24, FLOOR_Y - 4], legN: [0, 0, -30], legF: [0, 0, -30] },
      { hip: [100, 133], torso: 104, neck: 102, ground: false, handN: [154, 181], handF: [148, 181], footN: [104, 168], footF: [24, FLOOR_Y - 4], legN: [0, 0, 20], legF: [0, 0, -30] },
    ],
    arrow: { joint: "legN.knee", offset: [0, 18] },
    speed: 0.9,
  },
};

export const SESSIONS = [
  {
    id: "arranque", cover: "sentadilla", level: 1, name: "Arranque", tagline: "Para empezar desde cero",
    work: 30, rest: 30, rounds: 2,
    moves: ["marcha", "sentadilla", "flexion-pared", "puente", "talones"],
  },
  {
    id: "constancia", cover: "zancada", level: 2, name: "Constancia", tagline: "Cuando ya te mueves un poco",
    work: 35, rest: 25, rounds: 2,
    moves: ["marcha", "sentadilla", "zancada", "remo", "abdominal", "plancha", "puente"],
  },
  {
    id: "impulso", cover: "peso-muerto", level: 3, name: "Impulso", tagline: "Para seguir subiendo",
    work: 40, rest: 20, rounds: 3,
    moves: ["marcha", "sentadilla", "zancada", "peso-muerto", "flexion-pared", "abdominal", "plancha"],
  },
  {
    id: "movilidad", cover: "cuadrupedia", level: 0, name: "Movilidad", tagline: "6 minutos para cualquier día",
    work: 30, rest: 15, rounds: 2,
    moves: ["brazos", "cuadrupedia", "talones", "marcha"],
  },
];

export function sessionMinutes(session) {
  return Math.round((session.moves.length * session.rounds * (session.work + session.rest)) / 60);
}

/* ---------- Plan de la semana ---------- */
// Un plan por nivel, de lunes a domingo. kind: cardio, fuerza, movilidad, libre o descanso.
// Los días de fuerza llevan una sesión guiada; los de cardio, la actividad con la que se apunta.
// Nivel general: suma minutos poco a poco hacia los 150-300 semanales de la OMS y 2 días de fuerza.
const day = (kind, title, minutes, detail, extra = {}) => ({ kind, title, minutes, detail, ...extra });
export const WEEK_PLANS = {
  1: {
    name: "Suave", tagline: "Para empezar a moverte",
    days: [
      day("cardio", "Caminata ligera", 30, "A un ritmo en el que puedas hablar.", { activity: "caminar" }),
      day("fuerza", "Ejercicios funcionales", 10, "Sentadilla, flexión en la pared, puente y talones.", { session: "arranque" }),
      day("cardio", "Cardio suave", 30, "Caminar, cinta, bici o elíptica, lo que tengas a mano.", { activity: "caminar-rapido" }),
      day("movilidad", "Movilidad", 6, "Para soltar el cuerpo. Si te apetece, suma un paseo.", { session: "movilidad" }),
      day("fuerza", "Ejercicios funcionales", 10, "Repite la sesión del martes.", { session: "arranque" }),
      day("libre", "Actividad que te guste", 40, "Paseo, bici, bailar, piscina… lo que te divierta.", { activity: "caminar" }),
      day("descanso", "Descanso activo", 0, "Un paseo tranquilo o estiramientos, sin exigirte."),
    ],
  },
  2: {
    name: "Medio", tagline: "Cuando ya te mueves un poco",
    days: [
      day("cardio", "Caminata a buen paso", 40, "Que te cueste un poco hablar, pero puedas.", { activity: "caminar-rapido" }),
      day("fuerza", "Ejercicios funcionales", 14, "Sentadilla, zancada, remo, abdominales, plancha y puente.", { session: "constancia" }),
      day("cardio", "Cardio", 45, "Cinta, caminar rápido, bici o elíptica.", { activity: "bici" }),
      day("movilidad", "Movilidad y paseo", 25, "6 minutos de movilidad y un paseo de 20.", { session: "movilidad" }),
      day("fuerza", "Ejercicios funcionales", 14, "Repite la sesión del martes.", { session: "constancia" }),
      day("libre", "Actividad larga", 60, "Una ruta a pie, bici o natación, a tu ritmo.", { activity: "caminar" }),
      day("descanso", "Descanso", 0, "Descansa o da un paseo tranquilo."),
    ],
  },
  3: {
    name: "Activo", tagline: "Para seguir subiendo",
    days: [
      day("cardio", "Caminata rápida", 40, "A buen ritmo, con cuestas si puedes.", { activity: "caminar-rapido" }),
      day("fuerza", "Ejercicios funcionales", 21, "Sentadilla, zancada, bisagra, flexiones, abdominales y plancha.", { session: "impulso" }),
      day("cardio", "1 hora de cardio", 60, "Cinta, caminar, bici o elíptica.", { activity: "bici" }),
      day("fuerza", "Ejercicios funcionales", 14, "Sesión Constancia y 6 minutos de movilidad.", { session: "constancia" }),
      day("cardio", "Cardio suave", 30, "O descanso, si notas el cuerpo cansado.", { activity: "caminar" }),
      day("libre", "Actividad larga", 75, "Ruta, bici, natación o un deporte con amigos.", { activity: "caminar" }),
      day("descanso", "Descanso activo", 0, "Paseo tranquilo o estiramientos."),
    ],
  },
};

/* ---------- Figura animada ---------- */
// Dibuja el ejercicio en `container` y lo anima. Devuelve una función para pararlo.
export function mountFigure(container, exerciseId, options = {}) {
  return mountExerciseFigure(container, EXERCISES[exerciseId], options);
}

/* ---------- Sesión guiada ---------- */
let audioContext = null;
function beep(frequency = 880, duration = 0.12) {
  try {
    audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.25, audioContext.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + duration);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration + 0.02);
  } catch {
    // Sin sonido no pasa nada: el temporizador sigue a la vista.
  }
}

function buildSteps(session) {
  const steps = [{ kind: "prep", seconds: 5, move: session.moves[0] }];
  for (let round = 1; round <= session.rounds; round += 1) {
    session.moves.forEach((move, index) => {
      steps.push({ kind: "work", seconds: session.work, move, round });
      const last = round === session.rounds && index === session.moves.length - 1;
      if (!last) {
        const next = session.moves[(index + 1) % session.moves.length];
        steps.push({ kind: "rest", seconds: session.rest, move: next, round: index === session.moves.length - 1 ? round + 1 : round });
      }
    });
  }
  return steps;
}

// Abre la sesión a pantalla completa. onFinish({ minutes, completed }) se llama al terminar o al
// salir antes (con lo que se haya hecho), salvo que no se haya llegado a trabajar nada.
export function startSession(session, { onFinish } = {}) {
  const steps = buildSteps(session);
  const overlay = document.createElement("div");
  overlay.className = "session-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("aria-label", `Sesión ${session.name}`);
  overlay.innerHTML = `
    <div class="session-top">
      <span class="session-name"></span>
      <button type="button" class="session-close" aria-label="Terminar la sesión">✕</button>
    </div>
    <p class="session-phase"></p>
    <h2 class="session-move"></h2>
    <div class="session-figure"></div>
    <div class="session-timer" aria-live="off">
      <svg viewBox="0 0 120 120" aria-hidden="true"><circle class="ring-bg" cx="60" cy="60" r="52"/><circle class="ring-fg" cx="60" cy="60" r="52"/></svg>
      <strong class="session-seconds">0</strong>
    </div>
    <p class="session-tip"></p>
    <p class="session-progress"></p>
    <div class="session-actions">
      <button type="button" class="button secondary session-pause">Pausa</button>
      <button type="button" class="button ghost session-skip">Saltar</button>
    </div>
    <p class="sr-only session-announce" role="status" aria-live="polite"></p>`;
  document.body.append(overlay);
  document.body.classList.add("session-open");
  document.querySelector("#achievement-toast")?.classList.add("hidden");
  const $ = (selector) => overlay.querySelector(selector);
  $(".session-name").textContent = `${session.name} · ${sessionMinutes(session)} min`;
  const ring = $(".ring-fg");
  const circumference = 2 * Math.PI * 52;
  ring.style.strokeDasharray = String(circumference);

  let wakeLock = null;
  navigator.wakeLock?.request("screen").then((lock) => { wakeLock = lock; }).catch(() => {});

  let index = 0;
  let remaining = steps[0].seconds;
  let paused = false;
  let stopFigure = () => {};
  let workedSeconds = 0;
  let elapsedSeconds = 0;
  let timer = null;
  let shownMove = null;

  const showStep = () => {
    const step = steps[index];
    const move = EXERCISES[step.move];
    const phase = { prep: "Prepárate", work: "¡Vamos!", rest: "Descansa · Lo siguiente" }[step.kind];
    overlay.dataset.phase = step.kind;
    $(".session-phase").textContent = phase;
    $(".session-move").textContent = move.name;
    $(".session-tip").textContent = step.kind === "work" ? move.steps[1] : move.variant;
    const total = session.moves.length;
    $(".session-progress").textContent = step.kind === "prep"
      ? `${total} ejercicios · ${session.rounds} ${session.rounds === 1 ? "ronda" : "rondas"}`
      : `Ronda ${step.round} de ${session.rounds} · ejercicio ${session.moves.indexOf(step.move) + 1} de ${total}`;
    $(".session-announce").textContent = `${phase}: ${move.name}`;
    if (shownMove !== step.move) {
      stopFigure();
      stopFigure = mountFigure($(".session-figure"), step.move);
      shownMove = step.move;
    }
  };

  const paintTimer = () => {
    const step = steps[index];
    $(".session-seconds").textContent = String(remaining);
    ring.style.strokeDashoffset = String(circumference * (1 - remaining / step.seconds));
  };

  const close = (completed) => {
    clearInterval(timer);
    stopFigure();
    wakeLock?.release?.().catch(() => {});
    overlay.remove();
    document.body.classList.remove("session-open");
    // Cuenta el tiempo de trabajo y de descanso; si no se ha llegado a un minuto de trabajo, no se apunta.
    if (workedSeconds >= 60 && onFinish) onFinish({ minutes: Math.max(1, Math.round(elapsedSeconds / 60)), completed });
  };

  const advance = () => {
    index += 1;
    if (index >= steps.length) {
      beep(1046, 0.3);
      navigator.vibrate?.([120, 60, 120]);
      close(true);
      return;
    }
    remaining = steps[index].seconds;
    beep(steps[index].kind === "work" ? 988 : 660, 0.18);
    navigator.vibrate?.(80);
    showStep();
    paintTimer();
  };

  timer = setInterval(() => {
    if (paused) return;
    remaining -= 1;
    if (steps[index].kind === "work") workedSeconds += 1;
    if (steps[index].kind !== "prep") elapsedSeconds += 1;
    if (remaining <= 3 && remaining > 0) beep(740, 0.08);
    if (remaining <= 0) advance();
    else paintTimer();
  }, 1000);

  $(".session-pause").addEventListener("click", (event) => {
    paused = !paused;
    event.currentTarget.textContent = paused ? "Seguir" : "Pausa";
    overlay.classList.toggle("is-paused", paused);
  });
  $(".session-skip").addEventListener("click", advance);
  $(".session-close").addEventListener("click", () => close(false));
  overlay.addEventListener("keydown", (event) => { if (event.key === "Escape") close(false); });

  showStep();
  paintTimer();
  beep(660, 0.12);
  $(".session-pause").focus();
}

/* ---------- Recordatorio en el calendario ---------- */
// Crea un evento diario (.ics) que funciona en el calendario de iPhone, Android y ordenador.
export function downloadReminder(time = "18:00", text = "Muévete 10 minutos con Pauta Posible") {
  const [hour, minute] = time.split(":").map((value) => value.padStart(2, "0"));
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  const day = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const stamp = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Pauta Posible//Recordatorio//ES", "BEGIN:VEVENT",
    `UID:recordatorio-${Date.now()}@pautaposible.es`, `DTSTAMP:${stamp}`,
    `DTSTART:${day}T${hour}${minute}00`, "DURATION:PT10M", "RRULE:FREQ=DAILY",
    `SUMMARY:${text}`, "DESCRIPTION:Abre la app: https://pautaposible.es/app/?vista=app",
    "BEGIN:VALARM", "ACTION:DISPLAY", `DESCRIPTION:${text}`, "TRIGGER:PT0M", "END:VALARM",
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const link = document.createElement("a");
  link.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  link.download = "recordatorio-pauta-posible.ics";
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 2000);
}
