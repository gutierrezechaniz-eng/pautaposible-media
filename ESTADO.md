# Estado entre conversaciones

Actualízalo al final de cada sesión: breve, con fecha. Lo que ya está hecho va al historial de `calendario.md`, no aquí.

_Última actualización: sábado 10/10/2026 (2.ª sesión)_

## Hecho recientemente
- 10/10 (2.ª sesión): el aviso de voz no llegaba porque la prueba del 10/10 cayó en sábado y la routine decidió no enviar nada. Corregido el prompt de la routine «Recordatorio voz reels» (trig_01VLSsVajJm6F5WjA5stBthe, lunes y miércoles 8:51, notificación por email y móvil): ahora envía siempre y, si se dispara otro día, manda el próximo guion como prueba. Prueba enviada el 10/10 a las 7:35 con el guion del jueves 15. Iván ya no quiere avisos de Google Calendar: solo email.
- Lo que hay que hacer con la nota de voz: Iván la adjunta en una conversación del proyecto Pauta Posible → `/programar-reel` (sustituye la versión sin voz en la misma publicación de Metricool).
- Reel sin voz del jueves 15 (3 desayunos) programado como respaldo (392568483).
- Semana del 19 oct lista: plan en `calendario.md`, guiones en `voz/GUIONES.md` (debajo de los de la semana del 12; la routine elige la semana de hoy), 3 carruseles programados (392569523, 392569539, 392569546) y página de copias actualizada (versión 5).
- Transcripción de notas de voz: `pip install sherpa-onnx` + modelo `sherpa-onnx-nemo-parakeet-tdt-0.6b-v3-int8` (releases asr-models de k2-fsa/sherpa-onnx) en el scratchpad.

## Pendiente
- [ ] Los emails de la routine tampoco llegaron tras la corrección. Nuevo aviso: workflow de GitHub `.github/workflows/aviso-voz.yml` (lunes y miércoles 8:51 Madrid; abre un issue con la etiqueta `aviso-voz` que menciona y asigna a Iván, y GitHub se lo envía por email). Tras fusionarlo: lanzarlo a mano (workflow_dispatch) y confirmar que llega. Si llega, desactivar la routine trig_01VLSsVajJm6F5WjA5stBthe. Si no, revisar en GitHub → Settings → Notifications que el email esté activado.
- [ ] Jueves 15: si llega la nota de voz antes de las 12:00, `/programar-reel` con voz y sustituir 392568483.
- [ ] Martes 20 y jueves 22: reels con voz (azúcar moreno y batch cooking) con `/programar-reel`; sin nota, versión sin voz.
- [ ] Viernes 16-sábado 17: métricas de la semana del 12 (incluye el táper del 09/10, que el 10/10 seguía a 0 en Metricool).
- [ ] Antes del lunes 26: plan, guiones (en main) y carruseles de la semana del 26 oct.

## Decisiones vigentes
- Los reels llegan a más gente que los carruseles, y los de voz el doble que los sin voz: insistir a Iván en las notas de voz.
- Los carruseles necesitan ideas más concretas para guardar (listas, chuletas, cantidades).
- Los reels con voz acompañan al carrusel del día anterior o siguiente: Iván graba un tema que ya conoce.
