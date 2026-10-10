# Plantilla de carruseles

Genera los carruseles de 1080×1350 con HTML/CSS + Playwright, con el estilo de la marca (Manrope, crema #FAFAF7, Forest #2E6F57, Mint #DDEEDF, oro #D7A95B).

```
npm i @fontsource/manrope playwright
cp ../../assets/ivan.png .
CHROMIUM=/opt/pw-browsers/chromium node render.mjs <clave> ../AAAA-MM-DD-tema
```

- `render.mjs`: tipos de diapositiva (`portada`, `texto`, `cierre`, `final`) y el render.
- `carruseles.mjs`: el contenido de cada carrusel (objeto con una clave por carrusel). Para uno nuevo, añade su clave copiando uno parecido.
- `texto` admite: `kicker`, `title`, `p`, `steps` (lista numerada, con `start` opcional), `chips` (lista separada por puntos dentro de una caja Mint), `checks` (lista con casillas, una por línea), `box` y `p2`. Usa `**negrita**`.
- La última diapositiva (`final`) es la fija de la web y la app que exige la norma de `calendario.md`; no la cambies sin cambiar la norma.
