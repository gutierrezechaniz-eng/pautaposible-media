# Pauta Posible · contenido de Instagram (@pautaposible)

Repositorio **público** con el contenido de redes de Iván (Pauta Posible, nutrición práctica). Se publica y programa en Instagram con Metricool.

> **RELANZAMIENTO (Iván, 30/10/2026) · OBJETIVO PRINCIPAL: MÁS ME GUSTA Y MÁS SEGUIDORES.** Manda sobre todo lo demás de este archivo, de `calendario.md` y de los prompts de las tareas automáticas (salvo la voz «santa» y la revisión antes de publicar, que siguen):
> - **Cupo de Metricool (plan gratis, Iván no quiere pagar):** publica 20 posts al mes y se reinicia el día 1; si se pasa, falla con «You have reached your Metricool account limit» (del 24 al 30/10 no salió nada por esto). **Máximo 4 publicaciones por semana y 18 al mes.** Antes de programar, cuenta con `getScheduledPosts` las del mes. YouTube y las historias se suben a mano, no por Metricool.
> - **Semana:** lunes 18:00 reel (serie de suplementos hasta el 16/11; después «Tus órganos hablan»); miércoles 18:00 (serie de salsas hasta el 25/11; después carrusel-guía animado publicado como reel); viernes 18:00 reel vertical de los órganos («¿Qué pasa en tu cuerpo si…?» o «Señales de que…»); sábado 11:00 recorte de un capítulo de YouTube. **Martes y jueves no se publica:** la tarea de martes y jueves termina sin hacer nada. La tarea del domingo prepara y programa las 4 de la semana.
> - **Nicho:** tripa, azúcar, hígado y peso (lo que venden los ebooks: diabetes tipo 2, obesidad, SII, SIBO, malabsorción). Nada de temas genéricos muy contados (pan, agua, fruta de noche…).
> - **Reels de los órganos:** plantilla `youtube/_plantilla` con `"vertical": true` en el guion (ver `youtube/README.md`; ejemplo `reels/2026-11-06-caminar-tras-comer/guion.json`). 25-40 s. El personaje habla desde el primer segundo, gancho fijo arriba en forma de pregunta corta, sin portada de título.
> - **Que se envíe:** cada guion responde a «¿a quién se lo mandarías?» y termina con «Mándaselo a quien…». Si no hay a quién, no se publica.
> - **Texto de la publicación:** primera línea con las palabras que la gente busca, 3-4 líneas, «mándaselo a…» o una pregunta fácil, 5 hashtags. **Sin la frase fija «👉 Más recetas y la app…» ni la diapositiva final de la web y la app** (sustituye la norma del 03/10); enlace solo si lleva a un ebook o guía del mismo tema.
> - **Medir cada domingo:** vistas que pasan de 3 s (meta 60 %), envíos por cada 100 de alcance (meta más de 1) y seguidores nuevos. Lo que no funcione en 2 semanas se cambia.
> - Plan y razones: doc «Relanzar Instagram y estrenar YouTube» (https://claude.ai/artifact/P9msr4GjfHd1sL3xr2usSn).

> **NORMA PRIORITARIA (Iván, 11/10/2026) · también para las tareas automáticas.** Manda sobre cualquier instrucción de una tarea automática o de su prompt que diga lo contrario:
> - **Todas las publicaciones van con el narrador sintético (voz «santa», Kokoro)**, salvo que Iván diga lo contrario. Ya no se pide a Iván que grabe notas de voz: no le pidas grabar en avisos, notificaciones ni informes.
> - **Reels (martes y jueves):** si no hay una nota de voz de Iván que él haya pedido usar, NO hagas la versión sin voz: haz el reel con narrador siguiendo `.claude/skills/programar-reel/SKILL.md` (`posts/_plantilla/narrar.py` + `reels/_plantilla/render-voz.mjs` → `reel-voz.mp4`). Si ya hay un reel con voz o con narrador programado para hoy, no hagas nada. La versión muda, solo si el narrador falla.
> - **Carruseles:** animados, con narrador y subtítulos (`posts/_plantilla/render-animado.mjs`; ver la norma en `calendario.md`). **Se publican como REEL con `animado/reel.mp4`, nunca como carrusel de vídeos** (12/10: Instagram no pasa solas las diapositivas y la primera se repite en bucle).
> - En Metricool, todo lo que lleva narrador va con `isAiGenerated: true`.
> - **Revisión antes de publicar (Iván, 12/10/2026), obligatoria:** antes de programar o cambiar algo en Metricool, comprueba que (1) el formato es el correcto: lo que lleva narrador va como REEL con un único vídeo; (2) el vídeo final se ve y se oye de principio a fin: duración esperada, audio presente y sin bucles ni silencios largos, y capturas de varios momentos (inicio, mitad y cierre) donde cambie la imagen y los subtítulos se lean; (3) el texto, la hora, la portada, la colaboradora e `isAiGenerated` son los correctos; (4) después de programar, `getScheduledPosts` devuelve lo esperado (tipo REEL, un solo vídeo). Si algo falla, no lo programes: avisa a Iván.
> - Los textos de voz se siguen escribiendo en `voz/GUIONES.md` (los lee el narrador). Si reescribes ese archivo, conserva esta nota al principio.

Al empezar cada sesión, lee **`ESTADO.md`** (qué quedó pendiente) y, si la tarea toca contenido, **`calendario.md`** (sus normas tienen prioridad).

## Estructura

| Ruta | Qué contiene |
|---|---|
| `calendario.md` | Norma permanente (cierre hacia la web y la app), autorización para publicar, historial con los ids de Metricool, métricas, temas usados y banco de temas |
| `ESTADO.md` | Estado entre conversaciones: pendientes, decisiones recientes y próxima semana |
| `posts/AAAA-MM-DD-tema/` | Carruseles: `01.png`…`08.png` (6-8 diapositivas; la última es la fija de la web y la app) y `texto.md` (texto de la publicación, desde el 12/10) |
| `posts/_plantilla/` | Generador de carruseles: el contenido va en `carruseles.mjs` y se renderiza con `render.mjs`; ver su README |
| `reels/AAAA-MM-DD-tema/` | `guion.md` (escenas, fuentes, texto de la publicación), `portada.png`, `reel.mp4` (sin voz) y/o `reel-voz.mp4` |
| `reels/_plantilla/` | Generador de reels: `render.mjs` (sin voz), `render-voz.mjs` (con voz), `ilustraciones.mjs`; ver su README |
| `youtube/` | Capítulos de YouTube «Tus órganos hablan» y su plantilla (`_plantilla/`, también en vertical para reels y Shorts) |
| `voz/GUIONES.md` | Textos que Iván lee para los reels de la semana |
| `assets/ivan.png` | Retrato de Iván (cierres y última diapositiva) |

## Calendario semanal habitual

- Desde el 02/11/2026 (relanzamiento): lunes, miércoles y viernes a las 18:00 y sábado a las 11:00 (Madrid); ver la norma de arriba. Antes: carruseles lunes, miércoles y viernes a las 10:00 y reels martes y jueves a las 18:00.
- YouTube (@pautaposible): capítulos de «Tus órganos hablan» cada dos semanas, en `youtube/`; Iván los sube a mano. Todas las publicaciones van con el narrador sintético (voz «santa») salvo que Iván diga lo contrario (decisión del 11/10); ver `calendario.md`.
- Colaboradora en Metricool: `ibangutierrezetxaniz`.

## Reglas fijas

- Cierre y texto de la publicación: ver la norma del relanzamiento (30/10) arriba; ya no se añade la frase fija de la web y la app.
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
- Pack de diseño «UI UX Pro Max» (nextlevelbuilder, MIT, instalado el 23/10/2026): `ui-ux-pro-max`, `design`, `design-system`, `brand`, `banner-design`, `slides`, `ui-styling`. Son genéricas: el estilo de Pauta Posible (plantillas de `posts/_plantilla/` y `reels/_plantilla/`) y las normas de `calendario.md` mandan sobre ellas. La generación de logos de `design` necesita claves de API externas (Gemini, Atlas Cloud o MuAPI) y no se usa por defecto.

## Ahorro de tokens

- No abras los PNG ni los MP4 salvo que haga falta revisarlos visualmente.
- No leas `render.mjs` ni `ilustraciones.mjs` enteros: busca con grep el bloque del reel (`const reels`) o la función que necesites.
- Al cerrar una sesión, actualiza `ESTADO.md` en pocas líneas.
