// Vídeo de YouTube (1920×1080) con los órganos como personajes de cómic.
// node render.mjs <carpeta con tiempos.json y voz.wav> [salida.mp4]
// Con SNAPS=5,30,… solo saca esos fotogramas en PNG (para revisar sin montar el vídeo).
import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire(import.meta.url);
const dir = path.dirname(new URL(import.meta.url).pathname);
const src = path.resolve(process.argv[2]);
const out = path.resolve(process.argv[3] || path.join(src, 'video.mp4'));
const cfg = JSON.parse(fs.readFileSync(path.join(src, 'tiempos.json'), 'utf8'));
const fuente = (pkg, f) => 'file://' + path.join(path.dirname(require.resolve(`@fontsource/${pkg}/package.json`)), 'files', f);
cfg.fuentes = `@font-face{font-family:Bangers;src:url(${fuente('bangers', 'bangers-latin-400-normal.woff2')})}
@font-face{font-family:Bangers;src:url(${fuente('bangers', 'bangers-latin-ext-400-normal.woff2')});unicode-range:U+0100-024F,U+2190-21FF}
@font-face{font-family:'Comic Neue';font-weight:700;src:url(${fuente('comic-neue', 'comic-neue-latin-700-normal.woff2')})}`;
const ffmpeg = process.env.FFMPEG || 'ffmpeg';
const FPS = cfg.fps;

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
await page.goto('file://' + path.join(dir, 'organos.html'));
const dur = await page.evaluate((c) => window.setup(c), cfg);
await page.evaluate(() => document.fonts.load('40px Bangers').then(() => document.fonts.load('700 40px "Comic Neue"')));
const frames = Math.round(dur * FPS);

const snaps = (process.env.SNAPS || '').split(',').filter(Boolean).map(Number);
if (snaps.length) {
  for (const s of snaps) {
    await page.evaluate((t) => window.render(t), s);
    await page.screenshot({ path: path.join(process.env.SNAPDIR || src, `f-${String(s).padStart(6, '0')}.png`) });
  }
  await browser.close();
  process.exit(0);
}

console.log('duración', dur, 's ·', frames, 'fotogramas');
const ff = spawn(ffmpeg, ['-y', '-v', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-', '-i', path.join(src, 'voz.wav'),
  '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS),
  '-c:a', 'aac', '-b:a', '192k', '-ar', '48000', '-t', String(frames / FPS), '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
const t0 = Date.now();
for (let f = 0; f < frames; f++) {
  await page.evaluate((t) => window.render(t), f / FPS);
  const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  if (f % 300 === 0) console.log(`${f}/${frames} · ${((Date.now() - t0) / 1000).toFixed(0)} s`);
}
ff.stdin.end();
await new Promise((r) => ff.on('close', r));
await browser.close();
// Miniatura: un fotograma del título
console.log('listo', out);
