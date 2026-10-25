# Estado entre conversaciones

Actualízalo al final de cada sesión: breve, con fecha. Lo que ya está hecho va al historial de `calendario.md`, no aquí.

_Última actualización: domingo 25/10/2026_

## Hecho recientemente
- 23/10: el pack UI UX Pro Max también está subido a la cuenta de claude.ai de Iván (vale en todas sus conversaciones).
- 23/10: instalado el pack de skills de diseño «UI UX Pro Max» (7 skills en `.claude/skills/`, commit 28327f2 de nextlevelbuilder/ui-ux-pro-max-skill). Ver «Skills del proyecto» en `CLAUDE.md`.
- Aviso de voz por email: workflow de GitHub `.github/workflows/aviso-voz.yml` (lunes y miércoles 8:51 Madrid). Abre un issue con la etiqueta `aviso-voz` que menciona y asigna a Iván, y GitHub se lo envía por email. Probado el 10/10: a Iván le llegó. Se lanza a mano con workflow_dispatch (fecha opcional). La routine trig_01VLSsVajJm6F5WjA5stBthe queda desactivada porque sus emails no llegaban. Los guiones tienen que estar en `voz/GUIONES.md` en main, con el título «# Guiones de voz · semana del D de mes de AAAA» y las secciones «## Reel del martes|jueves D · tema».
- 10/10 (2.ª sesión): el aviso de voz no llegaba porque la prueba del 10/10 cayó en sábado y la routine decidió no enviar nada. Corregido el prompt de la routine «Recordatorio voz reels» (trig_01VLSsVajJm6F5WjA5stBthe, lunes y miércoles 8:51, notificación por email y móvil): ahora envía siempre y, si se dispara otro día, manda el próximo guion como prueba. Prueba enviada el 10/10 a las 7:35 con el guion del jueves 15. Iván ya no quiere avisos de Google Calendar: solo email.
- Lo que hay que hacer con la nota de voz: Iván la adjunta en una conversación del proyecto Pauta Posible → `/programar-reel` (sustituye la versión sin voz en la misma publicación de Metricool).
- Reel del jueves 15 (3 desayunos) con la voz de Iván (nota del 10/10) programado: 392576485 (antes 392568483 sin voz). Marcado «Ya grabado» en `voz/GUIONES.md`.
- Semana del 19 oct lista: plan en `calendario.md`, guiones en `voz/GUIONES.md` (debajo de los de la semana del 12; la routine elige la semana de hoy), 3 carruseles programados (392569523, 392569539, 392569546) y página de copias actualizada (versión 5).
- Transcripción de notas de voz: `pip install sherpa-onnx` + modelo `sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8` (releases asr-models de k2-fsa/sherpa-onnx) en el scratchpad.

- 11/10: aviso de voz por email (`aviso-voz.yml`) pausado: con la voz «santa» ya no hace falta que Iván grabe. Se puede lanzar a mano con workflow_dispatch.

- 12/10: Iván eligió empezar el 19/10 las series de suplementos (lunes) y salsas caseras (miércoles). Programados suplementos 1/4 (393679028) y ketchup casero (393679081); azúcar moreno pasa al lunes 16/11 (393675755) y arroz salteado al miércoles 2/12 (393675795). Plan completo de las series en `calendario.md`.

- 14/10: instaladas 12 skills externas (PR #15 y #16, ya en main). Las útiles para el contenido: `claude-banana` (prompts de imágenes con IA; una imagen de IA para Instagram necesita antes el visto bueno de Iván por la norma de imágenes propias o con licencia) y `verification-before-completion` (comprobar antes de dar algo por hecho). Las demás son para programar: `find-skills`, `skill-creator`, `mcp-builder`, `writing-plans`, `subagent-driven-development`, `code-review-and-quality`, `systematic-debugging` y `/grill-with-docs` (con `grilling` y `domain-modeling`). Están en `.agents/skills/` (enlazadas desde `.claude/skills/`) y `skills-lock.json`; `claude-banana` está en `.claude/skills/claude-banana/`. Iván prefiere que le escriban siempre en español.

- 15/10: reel especial de lanzamiento de la app programado para el sábado 17/10 a las 18:00 (397084088): capturas reales de la app con datos de ejemplo, narrador «santa», 38 s. Plantilla nueva `reels/_plantilla/render-app.mjs` + `reel-app.html`. Instagram solo admite 5 hashtags por publicación.

- 18/10: Iván trajo el traspaso de otra conversación (sin cara, voz IA, gancho de mito, recetas llegan menos). Contrastado con Metricool: se mantiene este sistema (voz «santa», repo, Metricool) y se añade la sección «QUÉ FUNCIONA» en `calendario.md`: gancho de pregunta siempre, máximo una receta por semana, reel extra los sábados a las 18:00 (24/10: «¿Un día de pasarte lo arruina todo?», guion en `voz/GUIONES.md`) y pregunta para comentar. Las publicaciones que citaba el traspaso (19, 21, 23/10 y 16/11) son las que ya estaban programadas: no hay duplicados. El reel de lanzamiento salió el 17/10: https://www.instagram.com/reel/Demf61ciDnM/

- 19/10: reel del sábado 24 «¿Pasarte un día lo arruina todo?» programado (400121244), con narrador, 32 s. Escenas en `ilustraciones.mjs` (`unDiaNoArruina`).

- 20/10: reel del martes 20 «¿El pan engorda?» programado (400938509), con narrador, 31,5 s, colaboradora añadida. Escenas en `ilustraciones.mjs` (`elPan`).

- 22/10: reel del jueves 22 «Más verdura sin darte cuenta» programado (402992141), con narrador, 30,3 s, colaboradora añadida. Escenas en `ilustraciones.mjs` (`masVerdura`).

- 25/10 (tarea del domingo): semana del 26 lista. Carruseles animados con narrador programados como reel: lunes suplementos 2/4 (405510303), miércoles mayonesa casera segura (405511492), viernes menú del día (405512928), todos a las 10:00 con colaboradora e `isAiGenerated`. Guiones de martes 27 (fruta por la noche), jueves 29 (legumbre 4 veces por semana) y sábado 31 (¿tienes que ganarte la comida?) en `voz/GUIONES.md`. Página de copias actualizada.
- 25/10: el narrador falla con `sherpa-onnx` 2.0 (sale audio vacío): instalar `python3 -m pip install "sherpa-onnx<2" numpy soundfile` (con 1.13.8 funciona). `render-animado.mjs` admite `SOLO=7` para volver a renderizar solo una diapositiva.

## Pendiente
- [ ] **Web pautaposible.es más vistosa y más visible (Iván, 23/10).** Sin pagar nada más. Lo averiguado:
  - Está en Netlify (plan gratis, proyecto `pauta-posible`, id 469aacc8-f7a4-4927-a334-eee7a2dd9727). La última versión (16/10) se subió arrastrando una carpeta: el código no está en ningún repo ni en Netlify. Páginas conocidas: inicio e `instalar/`.
  - Google no la tiene indexada (`site:pautaposible.es` no devuelve nada): dar de alta en Google Search Console y Bing Webmaster (gratis), con sitemap.
  - El entorno de la nube bloquea `pautaposible.es` y `*.netlify.app`: Iván tiene que añadirlos en Network access → Allowed domains para poder verla y medirla.
  - Propuesta: guardar el código en este repo, carpeta `web/` (todo unificado, sin repos ni ramas aparte), y conectar Netlify al repo con `web/` como directorio base. Enseñar el rediseño en un enlace de prueba de Netlify y no publicar en pautaposible.es sin el visto bueno de Iván.
  - Skills elegidas (gratis): `frontend-design` (anthropics/skills, Apache 2.0), `taste-skill` (leonxlnx, MIT), `ui-ux-pro-max` (ya instalada), claude-seo (AgriciDaniel, MIT, sin las partes de pago de DataForSEO), marketingskills (coreyhaines31, MIT: `copywriting`, `cro`, `seo-audit`, `ai-seo`, `schema`), `web-design-guidelines` (vercel-labs). Medir antes y después con Lighthouse y Playwright.
  - Falta de Iván: dónde está la carpeta de la web y permitir esos dominios.
- [ ] Rama `claude/reel-sabado-24` (reel del sábado 24, ya programado en Metricool 400121244 con el vídeo de esa rama): abrir PR y fusionar en main cuando Iván dé el visto bueno. No borrar la rama antes del 24/10 a las 18:00.
- [ ] Sábados siguientes (31/10…): un reel extra a las 18:00 con tono sin culpa; la rutina de martes y jueves no lo cubre.
- [ ] Domingo 18-lunes 19: mirar las métricas del reel de lanzamiento (397084088) y, si funciona, repetir el formato con cada función de la app.
- [ ] Viernes 16-sábado 17: métricas de la semana del 12 (incluye el táper del 09/10, que el 10/10 seguía a 0 en Metricool).
- [ ] Sábado 31: reel extra «¿Tienes que ganarte la comida?» (guion ya en `voz/GUIONES.md`), por montar y programar.
- [ ] Revisar las métricas del reel «Tu vida, no la de un influencer» (sábado 10/10, 18:30, Metricool 392827236) con las de la semana.

## Decisiones vigentes
- 12/10: el carrusel de legumbres (10:00) salió como carrusel de vídeos: se quedó en la primera diapositiva repitiendo una frase y Iván lo borró. Desde ahora lo que lleva narrador se publica como **reel** con `animado/reel.mp4` (`posts/_plantilla/reel-vertical.mjs`). Cambiados en Metricool el 14, 16, 21, 23, 16/11 y 2/12. El lunes 19 (suplementos) también, tras elegirlo Iván: 394062221.
- 11/10: todas las publicaciones van **animadas, con narrador sintético (voz «santa», Kokoro) y subtítulos**, también las recetas (`posts/_plantilla/render-animado.mjs`; ver la norma en `calendario.md`). Se marcan como contenido de IA en Instagram (`isAiGenerated: true`), como pide Instagram; Iván está de acuerdo. Los modelos de voz se descargan en el scratchpad (releases `tts-models` de k2-fsa/sherpa-onnx: `kokoro-multi-lang-v1_0`).
- 11/10 (Iván): **de ahora en adelante todas las publicaciones, reels incluidos, van con la voz «santa»**, salvo que Iván diga lo contrario. Ya no hay que pedirle notas de voz; si manda una y pide usarla, se usa.
- Los reels llegan a más gente que los carruseles, y los que tienen voz el doble que los mudos: nunca publicar reels sin voz.
- Los carruseles necesitan ideas más concretas para guardar (listas, chuletas, cantidades).
- 12/10 (Iván): «no quiero dos publicaciones iguales». Los reels tienen tema propio y nunca repiten un carrusel. El reel del martes 13 pasó de legumbres de bote a «¿2 litros de agua al día?» (393679420); los del 20 y 22 pasan a «¿El pan engorda?» y «Más verdura sin darte cuenta».
