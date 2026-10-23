// Racha, reto semanal, medallas y copas. Todo se calcula a partir de los días guardados
// (dailyNutrition): un día cuenta como «activo» si tiene alguna comida apuntada o alguna actividad.
// Los logros premian la constancia, nunca el peso ni las calorías.

const DAY_MS = 86400000;

export function dayId(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function fromId(id) {
  const [year, month, day] = id.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}

function addDays(date, amount) {
  return new Date(date.getTime() + amount * DAY_MS);
}

// Lunes de la semana de `date` (las semanas van de lunes a domingo).
export function weekStart(date) {
  const noon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
  return addDays(noon, -((noon.getDay() + 6) % 7));
}

const list = (value) => (Array.isArray(value) ? value : []);
const minutesOf = (day) => list(day.activities).reduce((sum, item) => sum + Number(item.minutes || 0), 0);
const sessionsOf = (day) => list(day.activities).filter((item) => item.source === "session").length;
const isActive = (day) => list(day.meals).length > 0 || list(day.activities).length > 0;

export const WEEK_CHALLENGE_DAYS = 4;

function weekFacts(byId, monday) {
  const dots = [];
  let minutes = 0;
  let sessions = 0;
  for (let index = 0; index < 7; index += 1) {
    const day = byId.get(dayId(addDays(monday, index)));
    dots.push(Boolean(day && isActive(day)));
    if (day) {
      minutes += minutesOf(day);
      sessions += sessionsOf(day);
    }
  }
  const activeDays = dots.filter(Boolean).length;
  return { monday: dayId(monday), dots, activeDays, minutes, sessions, challengeDone: activeDays >= WEEK_CHALLENGE_DAYS };
}

// days: lista de documentos { day|id, meals, activities, water }. extras: { measurements, achievements }.
export function computeStats(days, { today = new Date(), measurements = 0 } = {}) {
  const byId = new Map(days.map((day) => [day.day || day.id, day]));
  const activeIds = [...byId.entries()].filter(([, day]) => isActive(day)).map(([id]) => id).sort();
  const todayKey = dayId(today);

  // Racha: días activos seguidos hasta hoy. Si hoy aún no hay nada, sigue viva desde ayer.
  let cursor = byId.has(todayKey) && isActive(byId.get(todayKey)) ? fromId(todayKey) : addDays(fromId(todayKey), -1);
  let streak = 0;
  while (byId.has(dayId(cursor)) && isActive(byId.get(dayId(cursor)))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  // Racha más larga y «vuelta» después de una pausa de 5 días o más.
  let best = 0;
  let run = 0;
  let comeback = false;
  activeIds.forEach((id, index) => {
    const gap = index ? Math.round((fromId(id) - fromId(activeIds[index - 1])) / DAY_MS) : 1;
    run = gap === 1 ? run + 1 : 1;
    if (gap >= 6) comeback = true;
    best = Math.max(best, run);
  });

  const thisMonday = weekStart(today);
  const week = weekFacts(byId, thisMonday);
  const pastWeeks = Array.from({ length: 8 }, (_, index) => weekFacts(byId, addDays(thisMonday, -7 * (index + 1))));
  const challengeWeeks = [week, ...pastWeeks].filter((item) => item.challengeDone).length;
  // Objetivo semanal de movimiento: empieza en 60 minutos y sube 15 por cada semana de reto
  // cumplida, hasta los 150 minutos semanales que recomienda la OMS como mínimo para adultos.
  const recentDone = pastWeeks.filter((item) => item.challengeDone).length;
  const weeklyGoal = Math.min(150, 60 + 15 * recentDone);

  const allActivities = days.flatMap((day) => list(day.activities));
  const allMeals = days.flatMap((day) => list(day.meals));
  const totalSessions = allActivities.filter((item) => item.source === "session").length;
  const maxWeekSessions = Math.max(week.sessions, ...pastWeeks.map((item) => item.sessions));
  const maxWeekMinutes = Math.max(week.minutes, ...pastWeeks.map((item) => item.minutes));
  const todayDoc = byId.get(todayKey) || {};

  return {
    todayKey,
    streak,
    bestStreak: Math.max(best, streak),
    comeback,
    week,
    pastWeeks,
    weeklyGoal,
    challengeWeeks,
    totalSessions,
    totalActivities: allActivities.length,
    totalMeals: allMeals.length,
    scannedMeals: allMeals.filter((meal) => meal.source === "scanner").length,
    maxWeekSessions,
    maxWeekMinutes,
    measurements,
    today: {
      meals: list(todayDoc.meals),
      activities: list(todayDoc.activities),
      minutes: minutesOf(todayDoc),
      water: Number(todayDoc.water || 0),
      calories: list(todayDoc.meals).reduce((sum, meal) => sum + Number(meal.calories || 0), 0),
    },
  };
}

// Nivel recomendado de las sesiones guiadas según las que ya se han hecho.
export function recommendedLevel(stats) {
  if (stats.totalSessions >= 16 && stats.maxWeekSessions >= 3) return 3;
  if (stats.totalSessions >= 6) return 2;
  return 1;
}

// kind: "medal" o "cup". progress(stats) devuelve [hecho, total] para la barra de las bloqueadas.
export const ACHIEVEMENTS = [
  { id: "primera-comida", kind: "medal", icon: "🥗", name: "Primer plato", text: "Apunta tu primera comida.", progress: (s) => [Math.min(s.totalMeals, 1), 1] },
  { id: "primer-escaneo", kind: "medal", icon: "📸", name: "Ojo de chef", text: "Escanea tu primer plato o alimento.", progress: (s) => [Math.min(s.scannedMeals, 1), 1] },
  { id: "primer-movimiento", kind: "medal", icon: "👟", name: "En marcha", text: "Apunta tu primera actividad.", progress: (s) => [Math.min(s.totalActivities, 1), 1] },
  { id: "primera-sesion", kind: "medal", icon: "⏱️", name: "Primera sesión", text: "Termina una sesión guiada.", progress: (s) => [Math.min(s.totalSessions, 1), 1] },
  { id: "primera-medida", kind: "medal", icon: "📏", name: "Punto de partida", text: "Guarda tu primera medición.", progress: (s) => [Math.min(s.measurements, 1), 1] },
  { id: "reto-semana", kind: "medal", icon: "🎯", name: "Reto cumplido", text: `Ten ${WEEK_CHALLENGE_DAYS} días activos en una semana.`, progress: (s) => [Math.min(Math.max(s.week.activeDays, s.challengeWeeks ? WEEK_CHALLENGE_DAYS : 0), WEEK_CHALLENGE_DAYS), WEEK_CHALLENGE_DAYS] },
  { id: "tres-sesiones", kind: "medal", icon: "💪", name: "Tres en una semana", text: "Haz 3 sesiones guiadas en la misma semana.", progress: (s) => [Math.min(s.maxWeekSessions, 3), 3] },
  { id: "150-minutos", kind: "medal", icon: "🌿", name: "150 minutos", text: "Suma 150 minutos de actividad en una semana.", progress: (s) => [Math.min(s.maxWeekMinutes, 150), 150] },
  { id: "racha-7", kind: "medal", icon: "🔥", name: "Una semana seguida", text: "Llega a 7 días activos seguidos.", progress: (s) => [Math.min(s.bestStreak, 7), 7] },
  { id: "racha-21", kind: "medal", icon: "🌳", name: "Hábito en marcha", text: "Llega a 21 días activos seguidos.", progress: (s) => [Math.min(s.bestStreak, 21), 21] },
  { id: "vuelta", kind: "medal", icon: "🔄", name: "De vuelta", text: "Retoma después de una pausa de 5 días o más. Volver también cuenta.", progress: (s) => [s.comeback ? 1 : 0, 1] },
  { id: "copa-10", kind: "cup", icon: "🏆", name: "Copa de bronce", text: "10 sesiones guiadas en total.", progress: (s) => [Math.min(s.totalSessions, 10), 10] },
  { id: "copa-30", kind: "cup", icon: "🏆", name: "Copa de plata", text: "30 sesiones guiadas en total.", progress: (s) => [Math.min(s.totalSessions, 30), 30] },
  { id: "copa-retos", kind: "cup", icon: "🥇", name: "Copa de la constancia", text: "Cumple el reto semanal 4 semanas.", progress: (s) => [Math.min(s.challengeWeeks, 4), 4] },
];

export function isUnlocked(achievement, stats) {
  const [done, total] = achievement.progress(stats);
  return done >= total;
}

// Logros recién conseguidos que todavía no estaban guardados en la cuenta.
export function newAchievements(stats, stored = {}) {
  return ACHIEVEMENTS.filter((item) => !stored[item.id] && isUnlocked(item, stats));
}

// Lo siguiente que conviene hacer hoy, en una frase, para la pantalla de inicio.
export function nextStep(stats, { hasTarget }) {
  const { today, week } = stats;
  if (!today.meals.length && !today.activities.length) {
    return stats.streak ? { text: `Llevas ${stats.streak} ${stats.streak === 1 ? "día" : "días"} seguidos. Apunta algo hoy y la racha sigue.`, action: "comida" }
      : { text: "Empieza por lo fácil: escanea tu próxima comida o apúntala a mano.", action: "comida" };
  }
  if (!today.activities.length) return { text: "Ya tienes comida apuntada. ¿Diez minutos de movimiento? Prueba una sesión guiada.", action: "moverme" };
  if (!week.challengeDone) {
    const left = WEEK_CHALLENGE_DAYS - week.activeDays;
    return { text: `Te ${left === 1 ? "falta 1 día activo" : `faltan ${left} días activos`} para el reto de esta semana.`, action: "logros" };
  }
  if (!hasTarget) return { text: "Completa tu perfil para ver tu referencia diaria y tus cantidades en cada receta.", action: "perfil" };
  return { text: "Reto de la semana cumplido. Hoy toca disfrutar: mira una receta nueva.", action: "comida" };
}
