# Reel del viernes 06/11 · ¿Por qué caminar 10 minutos después de comer?

Formato: reel vertical de los órganos (`youtube/_plantilla`, `"vertical": true`), voces Kokoro con narrador «santa», 36,9 s. Guion en `guion.json`.

## Texto de la publicación
Caminar 10 minutos después de comer: por qué funciona 🚶

Cuando el músculo se mueve, abre sus puertas a la glucosa aunque no llegue la insulina. Por eso un paseo tranquilo en la primera hora después de comer ayuda a bajar el pico de azúcar.

¿Tú paseas después de comer o eres de sofá? Mándaselo a quien se va directo al sofá nada más comer.

#glucosa #resistenciaalainsulina #diabetestipo2 #habitossaludables #pautaposible

## Fuentes
- Richter EA, Hargreaves M. Exercise, GLUT4, and skeletal muscle glucose uptake. Physiol Rev. 2013;93:993-1017 (la contracción muscular mueve GLUT4 a la membrana sin depender de la insulina).
- Buffey AJ et al. The acute effects of interrupting prolonged sitting time in adults with standing and light-intensity walking on biomarkers of cardiometabolic health: a systematic review and meta-analysis. Sports Med. 2022;52:1765-1787 (caminar suave tras comer reduce la glucosa posprandial frente a seguir sentado).

Imágenes: dibujos propios en SVG.

## Versión con la cara y la voz de Iban (3/11/2026)

Sustituye en Metricool al reel de los órganos con la voz «santa» (mismo tema y mismo texto de la publicación). Archivo: `reel-iban.mp4` (33,2 s), portada `portada-iban.png`.

- **Gancho (0-3,4 s):** Iban hablando a cámara, generado con HeyGen Avatar 4 (vía ElevenLabs) a partir de «foto personal.png» (la que eligió él; retrato ilustrado sobre fondo menta) y su voz clonada «iban 2». Texto en pantalla: «¿Nada más comer, al sofá?». Voz: «¿Nada más comer, al sofá? Espera un momento.»
- **Cuerpo (voz clonada «iban 2», eleven_v4, 27,1 s):** «Cuando comes, el azúcar de la comida pasa a la sangre y la glucosa sube. Es normal. Pero un paseo de diez minutos ayuda a bajar ese pico. Al moverte, tus músculos usan esa glucosa como energía, incluso sin esperar a la insulina. No hace falta correr: basta con caminar tranquilo en la primera hora después de comer. Fregar, tender la ropa o bajar al perro también cuenta. Mándaselo a quien se va directo al sofá nada más comer.» Transcripción comprobada con Scribe: coincide palabra por palabra.
- **Diapositivas** (`escenas-iban.mjs`, dibujos propios en SVG; las curvas son un esquema orientativo, sin datos): glucosa tras comer, sin paseo / con paseo, el músculo usa la glucosa, tabla de la pauta, «también cuenta», «mándaselo». Foto de Iban en un círculo que late con la voz.
- **Cierre (última frase + 2,5 s):** Iban hablando otra vez (HeyGen, «Mándaselo a quien se va directo al sofá nada más comer») y «Sigue a @pautaposible» encima del mismo vídeo (Iban, 3/11: «introducir todo lo que se pueda mi imagen»). Render: `OUTRO_DESDE=24.25 OUTRO_TEXTO=… node render-iban.mjs … cierre.mp4`.
- Montaje: `reels/_plantilla/render-iban.mjs` + `reel-iban.html`.
- Evidencia: Reynolds AN et al. *Diabetologia* 2016;59:2572-8 (10 min de paseo tras cada comida mejoran la glucosa posprandial); Buffey AJ et al. *Sports Med* 2022;52:1765-87 (caminar suave tras estar sentado baja la glucosa posprandial); captación de glucosa por el músculo en contracción independiente de la insulina (GLUT4).
- Contenido de IA: `isAiGenerated: true`. Coste en ElevenLabs: ~7.600 créditos (voz 942 + gancho HeyGen con la foto equivocada 2.424 + gancho con foto personal 2.424 + cierre 1.818).
