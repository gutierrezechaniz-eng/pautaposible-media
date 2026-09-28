# Plantilla de reels automáticos

Reels sin voz generados con HTML/CSS + Playwright + ffmpeg.

```
npm i @fontsource/manrope ffmpeg-static playwright
cp ../../assets/ivan.png .
node render.mjs <hidratos-cena|plato-sin-bascula> <carpeta-de-salida>
```

Los textos de cada reel están en `render.mjs` (objeto `reels`). La animación se controla por tiempo (`render(t)`), así que cada fotograma es determinista. Salida: 1080×1920, 30 fps, H.264 yuv420p +faststart, audio AAC silencioso.

## Reels con la voz de Iván

```
npm i @fontsource/manrope ffmpeg-static ffprobe-static playwright
cp ../../assets/ivan.png .
CHROMIUM=/opt/pw-browsers/chromium node render-voz.mjs <hidratos-cena|plato-sin-bascula> <audio-limpio.m4a> <palabras.json> <carpeta-de-salida>
```

- `reel-voz.html`: gancho (0–2,5 s) con retrato y zoom lento; después ilustración con zoom lento arriba, retrato pequeño con anillo que reacciona a la voz y subtítulos palabra a palabra (Manrope 800, palabra activa sobre píldora Mint); cierre de 1,5 s.
- `ilustraciones.mjs`: ilustraciones propias en SVG por escena (inicio/fin en segundos de voz; `data-at` hace aparecer cada elemento cuando se nombra).
- `palabras.json`: `{dur, words:[{w,s,e}]}`, texto del guion alineado con las marcas de tiempo de la transcripción (Parakeet/Whisper con sherpa-onnx; los modelos se descargan de las releases de GitHub de k2-fsa/sherpa-onnx).
- Audio: mono 48 kHz, paso alto 80 Hz, `afftdn` suave, compresión ligera, silencios recortados (~0,2 s), ≈ -14 LUFS, AAC 128 kbps.
- Los audios originales nunca se suben al repositorio (es público).
