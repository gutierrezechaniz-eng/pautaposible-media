// Convierte un carrusel animado (animado/vista-previa.mp4, 1080×1350) en un reel vertical de 1080×1920:
// node reel-vertical.mjs ../AAAA-MM-DD-tema
// Instagram no pasa solo las diapositivas de un carrusel de vídeos: la primera se repite en bucle hasta que alguien desliza.
// Por eso lo que lleva narrador se publica como reel (todas las diapositivas seguidas) y no como carrusel (decisión del 12/10/2026).
import { execFileSync } from 'child_process';
import { createRequire } from 'module';
import path from 'path';
const require = createRequire(import.meta.url);
const ffmpeg = require('ffmpeg-static');
const dir = path.resolve(process.argv[2], 'animado');
const src = path.join(dir, 'vista-previa.mp4');
const pad = 'scale=1080:1350,pad=1080:1920:0:285:color=0xFAFAF7,setsar=1';
execFileSync(ffmpeg, ['-y', '-v', 'error', '-i', src, '-vf', pad, '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-r', '30',
  '-c:a', 'aac', '-b:a', '128k', '-ar', '48000', '-ac', '2', '-movflags', '+faststart', path.join(dir, 'reel.mp4')]);
// Portada: fotograma del titular de la primera diapositiva
execFileSync(ffmpeg, ['-y', '-v', 'error', '-ss', '2.5', '-i', src, '-frames:v', '1', '-vf', pad, path.join(dir, 'portada-reel.png')]);
console.log('reel.mp4 y portada-reel.png en', dir);
