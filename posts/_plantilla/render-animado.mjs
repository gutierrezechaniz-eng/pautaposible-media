// Carrusel educativo animado: node render-animado.mjs <clave> <carpeta-del-post> [--preview t1,t2]
// Crea <carpeta>/animado/01.mp4… (1080×1350, 30 fps, H.264 + audio AAC silencioso), copia la diapositiva final estática
// (último PNG de la carpeta) y monta vista-previa.mp4 con todas seguidas.
import { chromium } from 'playwright';
import { spawn, execFileSync } from 'child_process';
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { animados } from './animados.mjs';
const require = createRequire(import.meta.url);
const ffmpeg = require('ffmpeg-static');
const dir = path.dirname(new URL(import.meta.url).pathname);
const FPS = 30;
const [name, postDir, flag, times] = process.argv.slice(2);
const slides = animados[name];
const out = path.join(postDir, 'animado');
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => console.log('ERR', e.message));
await page.goto('file://' + path.join(dir, 'animado.html'));
await page.evaluate(() => document.fonts.ready);
const files = [];
for (const [i, s] of slides.entries()) {
  const n = String(i + 1).padStart(2, '0');
  const dur = await page.evaluate((c) => window.setup(c), s);
  if (flag === '--preview') {
    for (const t of (times || '1,3,5.9').split(',').map(Number)) { await page.evaluate((t) => window.render(t), t); await page.screenshot({ path: path.join(out, `p${n}-${t}.png`) }); }
    continue;
  }
  const file = path.join(out, `${n}.mp4`); files.push(file);
  const ff = spawn(ffmpeg, ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-c:a', 'aac', '-b:a', '64k', '-shortest', '-movflags', '+faststart', file], { stdio: ['pipe', 'ignore', 'inherit'] });
  const frames = Math.round(dur * FPS);
  for (let f = 0; f < frames; f++) {
    await page.evaluate((t) => window.render(t), f / FPS);
    const buf = await page.screenshot({ type: 'png' });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    if (f === frames - 1) fs.writeFileSync(path.join(out, `${n}.png`), buf); // fotograma final como imagen fija
  }
  ff.stdin.end(); await new Promise((r) => ff.on('close', r));
  console.log(n, dur, 's');
}
await browser.close();
if (flag !== '--preview') {
  // Diapositiva final fija: el último PNG estático del post
  const pngs = fs.readdirSync(postDir).filter((f) => /^\d\d\.png$/.test(f)).sort();
  const fin = pngs[pngs.length - 1], n = String(slides.length + 1).padStart(2, '0');
  fs.copyFileSync(path.join(postDir, fin), path.join(out, `${n}.png`));
  // Vista previa: todas las diapositivas seguidas (la final, 3 s)
  const finMp4 = path.join(out, '_final.mp4');
  execFileSync(ffmpeg, ['-y', '-v', 'error', '-loop', '1', '-t', '3', '-i', path.join(out, `${n}.png`), '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-shortest',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', String(FPS), '-c:a', 'aac', '-b:a', '64k', finMp4]);
  const list = path.join(out, '_lista.txt');
  fs.writeFileSync(list, [...files, finMp4].map((f) => `file '${path.resolve(f)}'`).join('\n'));
  execFileSync(ffmpeg, ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', path.join(out, 'vista-previa.mp4')]);
  fs.rmSync(list); fs.rmSync(finMp4);
}
