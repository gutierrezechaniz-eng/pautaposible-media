---
name: programar-reel
description: Genera el reel del día de @pautaposible (con la voz de Iván si hay nota de voz, si no la versión sin voz), lo programa en Metricool y actualiza calendario.md. Úsala cuando haya que preparar, renderizar, programar o sustituir un reel del martes o del jueves.
---

# Programar un reel

Argumento opcional: fecha o tema (por ejemplo `jueves 15/10` o `meriendas`). Sin argumento, el siguiente reel sin programar según `calendario.md` y `voz/GUIONES.md`.

## 1. Contexto mínimo
- Lee la norma permanente de `calendario.md` (sección REELS) y el guion del día en `voz/GUIONES.md`.
- Usa un reel anterior como modelo de formato: `reels/2026-10-08-meriendas/guion.md`.
- No leas `reels/_plantilla/render.mjs` entero: busca con grep `const reels` y el bloque de un reel parecido.

## 2. ¿Con voz o sin voz?
- **Con voz** si Iván envió la nota por el chat o hay un audio en `voz/` antes de las 12:00 del día de publicación.
- Si no la hay, **sin voz** (opción B). Anótalo en el `guion.md`: «No había nota de voz de Iván para hoy…».

## 3. Generar
Desde `reels/_plantilla/` (instrucciones completas en su README):

```
npm i @fontsource/manrope ffmpeg-static ffprobe-static playwright
cp ../../assets/ivan.png .
# Sin voz: añade el reel al objeto `reels` de render.mjs (escenas, cierre de 3 s con la web y la app)
CHROMIUM=/opt/pw-browsers/chromium node render.mjs <clave> ../AAAA-MM-DD-tema
# Con voz: limpia el audio, crea palabras.json y añade las escenas a ilustraciones.mjs
CHROMIUM=/opt/pw-browsers/chromium node render-voz.mjs <clave> <audio-limpio.m4a> <palabras.json> ../AAAA-MM-DD-tema
```

Comprueba: 1080×1920, 30 fps, H.264 yuv420p, con pista AAC, y que el cierre muestra pautaposible.es y «Enlace en la bio». Saca `portada.png` del gancho (~2 s).

## 4. `guion.md` de la carpeta
Igual que en el reel de modelo: datos de publicación, tabla de escenas, imágenes con sus fuentes y licencias, notas de evidencia y **texto de la publicación**, que termina con la frase fija de la web y la app y después los hashtags.

## 5. Commit y push
- Nunca añadas audios originales (`*.m4a`, `*.wav`, `*.words.json`, `ivan.png` de la plantilla ya están en `.gitignore`).
- Commit: `Reel <con|sin> voz del <día> DD/MM: <tema>`. Haz push antes de programar si Metricool va a tomar el vídeo desde una URL pública del repositorio.

## 6. Programar en Metricool
- Comprueba que la autorización de `calendario.md` siga **vigente**. Si no, prepáralo con `createScheduledPostForReview`.
- Instagram Reel, a las 18:00 (Europe/Madrid), con el texto de la publicación, el vídeo y la portada, y la colaboradora `ibangutierrezetxaniz`.
- Si sustituyes un reel ya programado (por ejemplo, el de voz en lugar del sin voz), actualiza esa publicación o crea la nueva y anota los ids anteriores como «(antes …)».

## 7. Cerrar
- `calendario.md`: añade la fila al historial (fecha, pilar/formato, tema, 18:00, carpeta y archivo, id de Metricool · colaboradora) y el tema a «Temas usados».
- Commit: `Calendario: reel <con|sin> voz del <día> DD/MM programado (Metricool <id>)` y push.
- Actualiza `ESTADO.md` en una o dos líneas.
