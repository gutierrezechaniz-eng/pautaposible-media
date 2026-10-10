# Pauta Posible · contenido de Instagram (@pautaposible)

Repositorio **público** con el contenido de redes de Iván (Pauta Posible, nutrición práctica). Se publica y programa en Instagram con Metricool.

Al empezar cada sesión, lee **`ESTADO.md`** (qué quedó pendiente) y, si la tarea toca contenido, **`calendario.md`** (sus normas tienen prioridad).

## Estructura

| Ruta | Qué contiene |
|---|---|
| `calendario.md` | Norma permanente (cierre hacia la web y la app), autorización para publicar, historial con los ids de Metricool, métricas, temas usados y banco de temas |
| `ESTADO.md` | Estado entre conversaciones: pendientes, decisiones recientes y próxima semana |
| `posts/AAAA-MM-DD-tema/` | Carruseles: `01.png`…`08.png` (6-8 diapositivas; la última es la fija de la web y la app) |
| `reels/AAAA-MM-DD-tema/` | `guion.md` (escenas, fuentes, texto de la publicación), `portada.png`, `reel.mp4` (sin voz) y/o `reel-voz.mp4` |
| `reels/_plantilla/` | Generador de reels: `render.mjs` (sin voz), `render-voz.mjs` (con voz), `ilustraciones.mjs`; ver su README |
| `voz/GUIONES.md` | Textos que Iván lee para los reels de la semana |
| `assets/ivan.png` | Retrato de Iván (cierres y última diapositiva) |

## Calendario semanal habitual

- Carruseles: lunes, miércoles y viernes a las 10:00 (Madrid). Pilares: Mito o realidad, Receta sencilla, Hábito práctico.
- Reels: martes y jueves a las 18:00 (Madrid). Con voz si Iván envía su nota antes de las 12:00 de ese día; si no, la versión sin voz.
- Colaboradora en Metricool: `ibangutierrezetxaniz`.

## Reglas fijas

- Todo cierre lleva a pautaposible.es (ver la norma en `calendario.md`). El texto de la publicación termina con: «👉 Más recetas y la app gratuita para cocinar con lo que tienes en casa en pautaposible.es (enlace en la bio)» + hashtags.
- Sin el título «nutricionista» y sin prometer resultados de salud ni de peso. Base en evidencia (AESAN, SENC) y citarla en el `guion.md`.
- Solo imágenes propias (SVG) o con licencia, con los créditos en el `guion.md`.
- **Nunca subas los audios originales de Iván** (el repositorio es público; `.gitignore` de la plantilla ya los excluye).
- Tras programar algo: añade la fila al historial de `calendario.md` con el id de Metricool y el tema a «Temas usados».
- Página de copias semanal: el artifact cuyo enlace está en `calendario.md` (republicarlo pasando esa url).

## Commits

En español, describen la pieza y el día. Ejemplos:
- `Reel sin voz del jueves 08/10: 3 meriendas en 2 minutos`
- `Calendario: reel sin voz del jueves 08/10 programado (Metricool 391047175)`

## Skills del proyecto

- `/programar-reel`: generar el reel (con o sin voz), programarlo en Metricool y actualizar el calendario.

## Ahorro de tokens

- No abras los PNG ni los MP4 salvo que haga falta revisarlos visualmente.
- No leas `render.mjs` ni `ilustraciones.mjs` enteros: busca con grep el bloque del reel (`const reels`) o la función que necesites.
- Al cerrar una sesión, actualiza `ESTADO.md` en pocas líneas.
