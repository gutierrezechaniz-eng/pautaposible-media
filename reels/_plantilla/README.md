# Plantilla de reels automáticos

Reels sin voz generados con HTML/CSS + Playwright + ffmpeg.

```
npm i @fontsource/manrope ffmpeg-static playwright
cp ../../assets/ivan.png .
node render.mjs <hidratos-cena|plato-sin-bascula> <carpeta-de-salida>
```

Los textos de cada reel están en `render.mjs` (objeto `reels`). La animación se controla por tiempo (`render(t)`), así que cada fotograma es determinista. Salida: 1080×1920, 30 fps, H.264 yuv420p +faststart, audio AAC silencioso.
