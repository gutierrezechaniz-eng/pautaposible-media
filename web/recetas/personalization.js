export const recipeCategoryLabels = {
  pastas: "Pastas",
  legumbres: "Legumbres",
  carnes: "Carnes",
  pescados: "Pescados",
  ensaladas: "Ensaladas",
  salsas: "Salsas que alegran",
};

export function calculateNutrition(profile = {}) {
  const weight = Number(profile.weight);
  const height = Number(profile.height);
  const age = Number(profile.age);
  const hasRequiredChoices = ["female", "male"].includes(profile.gender)
    && ["low", "moderate", "high"].includes(profile.activityLevel)
    && ["loseFat", "gainMuscle", "maintain", "improveHealth"].includes(profile.goal);
  if (!hasRequiredChoices || ![weight, height, age].every((value) => Number.isFinite(value) && value > 0)) {
    return { calories: null, protein: null, carbs: null, fat: null };
  }

  const base = 10 * weight + 6.25 * height - 5 * age;
  const basal = base + (profile.gender === "male" ? 5 : -161);
  const activityFactor = { low: 1.2, moderate: 1.55, high: 1.725 }[profile.activityLevel] || 1.2;
  const goalFactor = { loseFat: 0.85, gainMuscle: 1.1, maintain: 1, improveHealth: 1 }[profile.goal] || 1;
  const proteinFactor = { loseFat: 1.8, gainMuscle: 1.8, maintain: 1.6, improveHealth: 1.4 }[profile.goal] || 1.4;
  // Nunca por debajo de un mínimo prudente (1200 kcal mujeres, 1500 kcal hombres): por debajo hace
  // falta la supervisión de un profesional.
  const floor = profile.gender === "male" ? 1500 : 1200;
  const calories = Math.max(floor, Math.round(basal * activityFactor * goalFactor));
  const protein = Math.round(weight * proteinFactor);
  const fat = Math.round((calories * 0.25) / 9);
  const carbs = Math.max(0, Math.round((calories - protein * 4 - fat * 9) / 4));
  return { calories, protein, carbs, fat };
}

export function nutritionTargetFromUserData(userData = {}) {
  const profile = userData.profile || {};
  const stored = Number(userData.nutritionTargetCalories || profile.calories);
  if (Number.isFinite(stored) && stored > 0) return Math.round(stored);
  const calculated = calculateNutrition(profile).calories;
  return Number.isFinite(calculated) && calculated > 0 ? Math.round(calculated) : null;
}

export function recipeSlug(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function recipeServings(recipe) {
  const value = Number.parseInt(String(recipe?.servings || "1"), 10);
  return Number.isFinite(value) && value > 0 ? value : 1;
}

function formatScaledQuantity(value) {
  const rounded = value >= 100
    ? Math.round(value / 5) * 5
    : value >= 10
      ? Math.round(value)
      : Math.round(value * 4) / 4;
  return new Intl.NumberFormat("es-ES", { maximumFractionDigits: 2 }).format(rounded);
}

// Si la cantidad ajustada queda en 1 o menos, el sustantivo va en singular («1 puñado», no «1 puñados»).
const SINGULAR = {
  aguacates: "aguacate", cebollas: "cebolla", cucharadas: "cucharada", cucharaditas: "cucharadita", dientes: "diente",
  doradas: "dorada", filetes: "filete", huevos: "huevo", latas: "lata", limones: "limón", lomos: "lomo",
  manzanas: "manzana", panes: "pan", pepinos: "pepino", pimientos: "pimiento", placas: "placa", puerros: "puerro",
  puñados: "puñado", rebanadas: "rebanada", tomates: "tomate", tortillas: "tortilla", unidades: "unidad", zanahorias: "zanahoria",
};

function withQuantity(value, rest) {
  const text = formatScaledQuantity(value);
  const rounded = Number(text.replace(",", "."));
  if (rounded > 1) return `${text}${rest}`;
  return `${text}${rest.replace(/^(\s+)([a-záéíóúñ]+)/i, (match, space, word) => `${space}${SINGULAR[word.toLowerCase()] || word}`)}`;
}

export function scaleIngredient(ingredient, baseServings, portionFactor) {
  const factor = portionFactor / baseServings;
  const fraction = ingredient.match(/^(\d+)\/(\d+)(.*)$/);
  if (fraction) {
    const quantity = Number(fraction[1]) / Number(fraction[2]);
    return withQuantity(quantity * factor, fraction[3]);
  }
  const range = ingredient.match(/^(\d+(?:[.,]\d+)?)-(\d+(?:[.,]\d+)?)(.*)$/);
  if (range) {
    const low = Number(range[1].replace(",", "."));
    const high = Number(range[2].replace(",", "."));
    return `${formatScaledQuantity(low * factor)}-${formatScaledQuantity(high * factor)}${range[3]}`;
  }
  const number = ingredient.match(/^(\d+(?:[.,]\d+)?)(.*)$/);
  if (!number) return ingredient;
  const quantity = Number(number[1].replace(",", "."));
  return withQuantity(quantity * factor, number[2]);
}

export function personalizedRecipe(recipe, targetCalories) {
  const portionFactor = targetCalories / 2000;
  return {
    ingredients: recipe.ingredients.map((ingredient) => (
      scaleIngredient(ingredient, recipeServings(recipe), portionFactor)
    )),
    portionPercent: Math.round(portionFactor * 100),
  };
}
