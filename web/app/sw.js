// Service worker mínimo para que la app se pueda instalar (y empaquetar para Android).
// No guarda datos personales: solo una página de «sin conexión» por si falla la red al abrirla.
const CACHE = "pauta-posible-app-v1";
const OFFLINE_URL = "/app/sin-conexion.html";

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll([OFFLINE_URL, "/app/icons/icon-192.png"])));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

// Solo intercepta la carga de páginas: todo lo demás (Firebase, escáner, imágenes) va directo a la red.
self.addEventListener("fetch", (event) => {
  if (event.request.mode !== "navigate") return;
  event.respondWith(fetch(event.request).catch(() => caches.match(OFFLINE_URL)));
});
