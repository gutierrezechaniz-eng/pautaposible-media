// Inicio de sesión compartido por toda la web.
// Todas las páginas importan este módulo para usar la misma instancia de Firebase
// y el mismo almacenamiento de sesión. Así la sesión no se mueve ni se borra al navegar.
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
  initializeAuth,
  getAuth,
  browserLocalPersistence,
  indexedDBLocalPersistence,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

export const firebaseConfig = {
  apiKey: "AIzaSyCU6_DNODWO6VxV1HdnqbOifp8uhrodlxE",
  appId: "1:284767514283:web:e4634c3b8e47fd04e191ee",
  messagingSenderId: "284767514283",
  projectId: "corpore-sano-beta",
  authDomain: "corpore-sano-beta.firebaseapp.com",
  storageBucket: "corpore-sano-beta.firebasestorage.app",
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

function createAuth() {
  try {
    // localStorage primero (donde ya estaban guardadas las sesiones);
    // si hubiera alguna en IndexedDB se recupera y se pasa a localStorage una sola vez.
    return initializeAuth(firebaseApp, {
      persistence: [browserLocalPersistence, indexedDBLocalPersistence],
    });
  } catch {
    return getAuth(firebaseApp);
  }
}

export const auth = createAuth();
