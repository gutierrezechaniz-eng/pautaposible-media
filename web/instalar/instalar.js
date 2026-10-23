// Página «Instalar la app»: muestra el paso que corresponde a cada móvil o navegador.
(() => {
  const box = document.querySelector("[data-install]");
  if (!box) return;
  const ua = navigator.userAgent || "";
  const isIos = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isInAppBrowser = /instagram|fban|fbav|tiktok/i.test(ua);
  const isStandalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  let deferredPrompt = null;

  function rememberDirect() {
    try {
      localStorage.setItem("pp-app-direct", "1");
    } catch {
      // Sin almacenamiento, la próxima vez volverá a pasar por esta página.
    }
  }

  function show(state) {
    box.querySelectorAll("[data-install-state]").forEach((step) => {
      step.hidden = step.dataset.installState !== state;
    });
    box.querySelector("[data-install-skip]").hidden = state === "installed";
    if (state === "installed") rememberDirect();
  }

  document.querySelectorAll("[data-app-direct]").forEach((link) => link.addEventListener("click", rememberDirect));

  if (isStandalone) show("installed");
  else if (isInAppBrowser) show("inapp");
  else if (isIos) show("ios");

  // Chrome y Edge (Android y ordenador) avisan cuando la app se puede instalar con un toque.
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    if (!isStandalone && !isInAppBrowser) show("prompt");
  });

  box.querySelector("[data-install-button]").addEventListener("click", async () => {
    if (!deferredPrompt) return show("manual");
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    show(outcome === "accepted" ? "installed" : "manual");
  });

  window.addEventListener("appinstalled", () => show("installed"));
})();
