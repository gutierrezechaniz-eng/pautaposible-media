# Vídeos de YouTube: los órganos hablan

Vídeos horizontales (1920×1080, 30 fps) en estilo cómic. Los órganos son personajes con voz propia y explican qué pasa en cada patología. Dibujos propios en SVG (sin imágenes de terceros) y voces sintéticas Kokoro.

## Cómo se hace uno

```
cd _plantilla
npm i playwright ffmpeg-static @fontsource/bangers @fontsource/comic-neue
# 1. Voces (modelo kokoro-multi-lang-v1_0 de las releases tts-models de k2-fsa/sherpa-onnx; pip install sherpa-onnx soundfile)
TTS_MODELOS=<carpeta de modelos> python3 voces.py ../01-diabetes-tipo-2/guion.json <salida>
# 2. Fotogramas de prueba y vídeo (ffmpeg del sistema, con rubberband)
CHROMIUM=/opt/pw-browsers/chromium SNAPS=10,40,90 node render.mjs <salida>
CHROMIUM=/opt/pw-browsers/chromium node render.mjs <salida> <salida>/video.mp4
```

- `guion.json`: escenas con rótulo y líneas `[personaje, texto, pegatina opcional]`. Personajes: narrador, pancreas, higado, musculo, grasa, insulina, glucosa.
- `voces.py`: voz de cada personaje (tabla `VOCES`: voz Kokoro, velocidad y tono). El narrador es «santa», la voz de Pauta Posible. Deja `voz.wav` (-16 LUFS) y `tiempos.json`.
- `organos.html`: dibujo y animación. `ESTADOS` dice cómo está el escenario en cada escena (tamaño de la grasa, hígado graso, puerta del músculo abierta o con candado, cuántas glucosas y llaves de insulina hay en la sangre, ánimo de cada órgano). Para otra patología se añaden escenas y personajes aquí.
- Revisión: transcribir `voz.wav` con Parakeet (sherpa-onnx) y comparar con el guion, y ver fotogramas de cada escena antes de entregar.
- Los vídeos no se suben al repo (pesan): se entregan en la carpeta del proyecto.

## Capítulos

| Nº | Tema | Estado |
|---|---|---|
| 01 | Diabetes tipo 2 | piloto, 3:10, pendiente del visto bueno de Iván |
| 02 | Obesidad | próximo |
| 03 | Síndrome del intestino irritable | |
| 04 | SIBO | |
| 05 | Malabsorción | |
