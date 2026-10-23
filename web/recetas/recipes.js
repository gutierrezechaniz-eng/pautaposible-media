import {
  nutritionTargetFromUserData,
  personalizedRecipe,
  recipeSlug,
} from "/recetas/personalization.js";

const recipes = window.PAUTA_RECIPES || [];
const grid = document.querySelector("#recipe-grid");
const search = document.querySelector("#recipe-search");
const status = document.querySelector("#catalog-status");
const buttons = [...document.querySelectorAll("[data-filter]")];
const accountTitle = document.querySelector("#recipe-account-title");
const accountCopy = document.querySelector("#recipe-account-copy");
const accountLink = document.querySelector("#recipe-account-link");
const navLogin = document.querySelector(".nav-login");
const categories = {
  pastas: { label: "Pastas" },
  legumbres: { label: "Legumbres" },
  carnes: { label: "Carnes" },
  pescados: { label: "Pescados" },
  ensaladas: { label: "Ensaladas" },
  salsas: { label: "Salsas que alegran" },
};
const account = {
  ready: false,
  user: null,
  userData: null,
  readFailed: false,
};
let activeCategory = "todas";
let expandedRecipeSlug = null;

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

function recipeLoginUrl(recipe) {
  return `/app/?mode=login&recipe=${recipeSlug(recipe.title)}`;
}

function personalizationMarkup(recipe) {
  const slug = recipeSlug(recipe.title);
  if (expandedRecipeSlug !== slug) return "";

  if (!account.user) {
    return `
      <div class="recipe-personalization recipe-personalization-prompt" role="status" tabindex="-1">
        <strong>Necesitas una cuenta para calcular tus cantidades.</strong>
        <p>Inicia sesión o regístrate, completa tus datos y Pauta Posible hará el cálculo automáticamente.</p>
        <a href="${recipeLoginUrl(recipe)}">Crear cuenta o iniciar sesión</a>
      </div>`;
  }

  const target = nutritionTargetFromUserData(account.userData || {});
  if (!target) {
    return `
      <div class="recipe-personalization recipe-personalization-prompt" role="status" tabindex="-1">
        <strong>${account.readFailed ? "No hemos podido leer tu perfil ahora mismo." : "Tu cuenta está activa, pero faltan datos de tu perfil."}</strong>
        <p>Completa tus parámetros y tu objetivo para que podamos calcular esta receta sin que tengas que hacer cuentas.</p>
        <a href="${recipeLoginUrl(recipe)}">Completar mis datos</a>
      </div>`;
  }

  const personalized = personalizedRecipe(recipe, target);
  const firstName = String(account.userData?.profile?.name || "").trim().split(/\s+/)[0];
  const title = firstName ? `Cantidades para ${firstName}` : "Tus cantidades";
  const ingredients = personalized.ingredients.map((ingredient) => `<li>${escapeHtml(ingredient)}</li>`).join("");
  return `
    <div class="recipe-personalization" role="status" tabindex="-1">
      <div class="recipe-personalization-head">
        <strong>${escapeHtml(title)}</strong>
        <span>${target.toLocaleString("es-ES")} kcal/día</span>
      </div>
      <p class="recipe-personalization-copy">Una ración orientativa calculada automáticamente con la referencia de tu perfil o seguimiento:</p>
      <ul class="recipe-personalization-ingredients">${ingredients}</ul>
      <small>Si tienes una pauta clínica, alergias o intolerancias, sigue siempre las indicaciones de tu profesional.</small>
    </div>`;
}

function recipeCard(recipe) {
  const category = categories[recipe.category];
  const slug = recipeSlug(recipe.title);
  const recipeImage = `/assets/recipes/${recipe.category}/${slug}.webp`;
  const ingredients = recipe.ingredients.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const steps = recipe.steps.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const isExpanded = expandedRecipeSlug === slug;
  const buttonLabel = !account.ready
    ? "Comprobando tu cuenta…"
    : isExpanded && account.user && nutritionTargetFromUserData(account.userData || {})
      ? "Ocultar mis cantidades"
      : "Calcular mis cantidades";
  return `
    <article class="catalog-card" id="${slug}">
      <img src="${recipeImage}" loading="lazy" width="640" height="427" alt="${escapeHtml(recipe.title)}." onerror="this.onerror=null;this.src='/assets/receta-${recipe.category === "pastas" ? "pasta" : recipe.category}.webp'">
      <div class="catalog-card-body">
        <div class="catalog-meta"><span>${category.label}</span><span>${escapeHtml(recipe.time)}</span><span>${escapeHtml(recipe.servings)}</span></div>
        <h2>${escapeHtml(recipe.title)}</h2>
        <p>${escapeHtml(recipe.summary)}</p>
        <details>
          <summary>Ingredientes</summary>
          <ul>${ingredients}</ul>
        </details>
        <details>
          <summary>Preparación</summary>
          <ol>${steps}</ol>
        </details>
        <details>
          <summary>Idea para adaptarla</summary>
          <p>${escapeHtml(recipe.tip)}</p>
        </details>
        <button class="recipe-personalize-link" type="button" data-recipe-calculator="${slug}" aria-expanded="${isExpanded}" ${account.ready ? "" : "disabled"}>
          <span>${buttonLabel}</span><span aria-hidden="true">${isExpanded ? "−" : "→"}</span>
        </button>
        ${personalizationMarkup(recipe)}
      </div>
    </article>`;
}

// Sin tildes ni mayúsculas: «salmon» encuentra «salmón».
function normalizeSearch(value) {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLocaleLowerCase("es");
}

function visibleRecipes() {
  const term = normalizeSearch(search.value.trim());
  return recipes.filter((recipe) => {
    const matchesCategory = activeCategory === "todas" || recipe.category === activeCategory;
    const haystack = normalizeSearch([recipe.title, recipe.summary, ...recipe.ingredients].join(" "));
    return matchesCategory && (!term || haystack.includes(term));
  });
}

function render() {
  const visible = visibleRecipes();
  grid.innerHTML = visible.length
    ? visible.map(recipeCard).join("")
    : '<p class="empty-state"><strong>No aparece ninguna receta con esa búsqueda.</strong><br>Prueba con otro ingrediente o vuelve a ver todas las categorías.</p>';
  status.textContent = `Mostrando ${visible.length} ${visible.length === 1 ? "receta" : "recetas"}.`;
}

function updateAccountUi() {
  if (!account.ready) return;
  if (!account.user) {
    accountTitle.textContent = "Tus cantidades, sin hacer cuentas";
    accountCopy.textContent = "Para calcularlas necesitas una cuenta con tus datos y tu objetivo nutricional.";
    accountLink.textContent = "Crear cuenta o iniciar sesión";
    accountLink.href = "/app/?mode=login";
    navLogin.textContent = "Iniciar sesión";
    navLogin.href = "/app/?mode=login";
    return;
  }

  const target = nutritionTargetFromUserData(account.userData || {});
  const firstName = String(account.userData?.profile?.name || "").trim().split(/\s+/)[0];
  navLogin.textContent = "Mi espacio";
  navLogin.href = "/app/";
  accountLink.href = "/app/";
  if (target) {
    accountTitle.textContent = firstName ? `${firstName}, tu perfil ya está conectado` : "Tu perfil ya está conectado";
    accountCopy.textContent = `Usaremos automáticamente tu referencia de ${target.toLocaleString("es-ES")} kcal al pulsar en cualquier receta.`;
    accountLink.textContent = "Ver mi espacio";
  } else {
    accountTitle.textContent = "Falta completar tu perfil";
    accountCopy.textContent = "Añade tus parámetros y tu objetivo para poder calcular las cantidades automáticamente.";
    accountLink.textContent = "Completar mis datos";
  }
}

buttons.forEach((button) => button.addEventListener("click", () => {
  activeCategory = button.dataset.filter;
  expandedRecipeSlug = null;
  buttons.forEach((item) => item.classList.toggle("is-active", item === button));
  render();
  history.replaceState(null, "", activeCategory === "todas" ? "/recetas/" : `/recetas/?categoria=${activeCategory}`);
}));

search.addEventListener("input", () => {
  expandedRecipeSlug = null;
  render();
});

grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-recipe-calculator]");
  if (!button || !account.ready) return;
  const slug = button.dataset.recipeCalculator;
  const hasPersonalResult = account.user && nutritionTargetFromUserData(account.userData || {});
  expandedRecipeSlug = expandedRecipeSlug === slug && hasPersonalResult ? null : slug;
  render();
  const result = document.querySelector(`#${CSS.escape(slug)} .recipe-personalization`);
  if (result) {
    result.focus({ preventScroll: true });
    result.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }
});

const pageParams = new URLSearchParams(location.search);
const requestedSearch = (pageParams.get("q") || "").trim();
if (requestedSearch) search.value = requestedSearch;
const requested = pageParams.get("categoria");
const requestedButton = buttons.find((button) => button.dataset.filter === requested);
if (requestedButton) {
  activeCategory = requested;
  buttons.forEach((button) => button.classList.toggle("is-active", button === requestedButton));
}
render();

async function connectAccount() {
  try {
    const [{ auth, firebaseApp }, firebaseAuthModule, firestoreModule] = await Promise.all([
      import("/auth.js"),
      import("https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js"),
      import("https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js"),
    ]);
    const db = firestoreModule.getFirestore(firebaseApp);
    firebaseAuthModule.onAuthStateChanged(auth, async (user) => {
      account.user = user;
      account.userData = null;
      account.readFailed = false;
      if (user) {
        try {
          const snapshot = await firestoreModule.getDoc(firestoreModule.doc(db, "users", user.uid));
          account.userData = snapshot.exists() ? snapshot.data() : null;
        } catch {
          account.readFailed = true;
        }
      }
      account.ready = true;
      const requestedRecipe = new URLSearchParams(location.search).get("recipe");
      if (user && requestedRecipe && recipes.some((recipe) => recipeSlug(recipe.title) === requestedRecipe)) {
        expandedRecipeSlug = requestedRecipe;
      }
      updateAccountUi();
      render();
      if (expandedRecipeSlug) {
        window.setTimeout(() => {
          const result = document.querySelector(`#${CSS.escape(expandedRecipeSlug)} .recipe-personalization`);
          result?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 80);
      }
    });
  } catch {
    account.ready = true;
    account.user = null;
    updateAccountUi();
    render();
  }
}

connectAccount();
