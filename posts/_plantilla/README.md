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

## Carruseles educativos animados

Desde el 11/10 los educativos (mitos y hábitos) van animados: cada diapositiva es un vídeo corto de 1080×1350, y la final fija sigue siendo el PNG estático.

```
npm i @fontsource/manrope playwright ffmpeg-static
CHROMIUM=/opt/pw-browsers/chromium node render-animado.mjs <clave> ../AAAA-MM-DD-tema               # vídeos
CHROMIUM=/opt/pw-browsers/chromium node render-animado.mjs <clave> ../AAAA-MM-DD-tema --preview 1,3  # capturas rápidas
```

- `animados.mjs`: el contenido (una lista de diapositivas `{dur, cls, html}` por clave) y las ilustraciones SVG. `words()` hace entrar el titular palabra a palabra.
- `animado.html`: la animación por tiempo. Atributos: `data-in="seg up|down|left|right|pop|zoom|drop|draw|spin|fade [duración]"`, `data-out`, `data-float`, `data-nudge`, `data-sway`, `data-pulse`, `data-mv` y `data-count` (números que cuentan).
- Salida en `<post>/animado/`: `01.mp4`… (con su último fotograma en `01.png`…), la final estática copiada del post y `vista-previa.mp4` con todo seguido.
- Primero se renderiza el carrusel estático (`render.mjs`): de ahí sale la diapositiva final.
