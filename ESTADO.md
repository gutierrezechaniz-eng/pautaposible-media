# Estado entre conversaciones

Actualízalo al final de cada sesión: breve, con fecha. Lo que ya está hecho va al historial de `calendario.md`, no aquí.

_Última actualización: jueves 15/10/2026_

## Hecho recientemente
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

## Pendiente
- [ ] Domingo 18-lunes 19: mirar las métricas del reel de lanzamiento (397084088) y, si funciona, repetir el formato con cada función de la app.
- [ ] Semana del 26: los carruseles del lunes y el miércoles son de las series (suplementos 2/4 y mayonesa casera segura); ver «Series de lunes y miércoles» en `calendario.md`.
- [ ] Reels del martes 20 (¿El pan engorda?) y jueves 22 (Más verdura sin darte cuenta): con narrador (voz «santa»), ver `/programar-reel`, con `isAiGenerated: true`. Guiones en `voz/GUIONES.md`.
- [ ] Viernes 16-sábado 17: métricas de la semana del 12 (incluye el táper del 09/10, que el 10/10 seguía a 0 en Metricool).
- [ ] Antes del lunes 26: plan, guiones (en main) y carruseles de la semana del 26 oct.
- [ ] Revisar las métricas del reel «Tu vida, no la de un influencer» (sábado 10/10, 18:30, Metricool 392827236) con las de la semana.

## Decisiones vigentes
- 12/10: el carrusel de legumbres (10:00) salió como carrusel de vídeos: se quedó en la primera diapositiva repitiendo una frase y Iván lo borró. Desde ahora lo que lleva narrador se publica como **reel** con `animado/reel.mp4` (`posts/_plantilla/reel-vertical.mjs`). Cambiados en Metricool el 14, 16, 21, 23, 16/11 y 2/12. El lunes 19 (suplementos) también, tras elegirlo Iván: 394062221.
- 11/10: todas las publicaciones van **animadas, con narrador sintético (voz «santa», Kokoro) y subtítulos**, también las recetas (`posts/_plantilla/render-animado.mjs`; ver la norma en `calendario.md`). Se marcan como contenido de IA en Instagram (`isAiGenerated: true`), como pide Instagram; Iván está de acuerdo. Los modelos de voz se descargan en el scratchpad (releases `tts-models` de k2-fsa/sherpa-onnx: `kokoro-multi-lang-v1_0`).
- 11/10 (Iván): **de ahora en adelante todas las publicaciones, reels incluidos, van con la voz «santa»**, salvo que Iván diga lo contrario. Ya no hay que pedirle notas de voz; si manda una y pide usarla, se usa.
- Los reels llegan a más gente que los carruseles, y los que tienen voz el doble que los mudos: nunca publicar reels sin voz.
- Los carruseles necesitan ideas más concretas para guardar (listas, chuletas, cantidades).
- 12/10 (Iván): «no quiero dos publicaciones iguales». Los reels tienen tema propio y nunca repiten un carrusel. El reel del martes 13 pasó de legumbres de bote a «¿2 litros de agua al día?» (393679420); los del 20 y 22 pasan a «¿El pan engorda?» y «Más verdura sin darte cuenta».
