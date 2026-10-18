// Reel de presentación de la app: node render-app.mjs <escenas.json> <audio.m4a> <palabras.json> <carpeta-salida>
// escenas.json: {hook, icon, endLine, endButton, shots:[{src,at,pan?}], taps:[{x,y,at}], badges:[{x,y,at,out?,ico,text,cls?}], tags:[{at,text}], zooms:[{at,until,amount}]}
// Las rutas de las imágenes son relativas a la carpeta de salida. Plantilla: reel-app.html.
import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
const require = createRequire(import.meta.url);
const ffmpeg = require('ffmpeg-static');
const dir = path.dirname(new URL(import.meta.url).pathname);
const FPS = 30;
const [scenesFile, audio, wordsFile, outDir] = process.argv.slice(2);
const { dur, words } = JSON.parse(fs.readFileSync(wordsFile, 'utf8'));
const cfg = JSON.parse(fs.readFileSync(scenesFile, 'utf8'));
const abs = (p) => 'file://' + path.resolve(outDir, p);
cfg.icon = abs(cfg.icon);
cfg.shots = cfg.shots.map((s) => ({ ...s, src: abs(s.src) }));
Object.assign(cfg, { words, dur });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.goto('file://' + path.join(dir, 'reel-app.html'));
const total = await page.evaluate((c) => window.setup(c), cfg);
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction(() => [...document.images].every((i) => i.complete));
const frames = Math.round(total * FPS);
console.log('voz', dur, 'total', total, 'fotogramas', frames);
await page.evaluate(() => window.render(1.6, { nosubs: true }));
await page.screenshot({ path: path.join(outDir, 'portada.png') });
const snaps = (process.env.SNAPS || '').split(',').filter(Boolean).map(Number);
if (process.env.SOLO_SNAPS) {
  for (const s of snaps) { await page.evaluate((t) => window.render(t), s); await page.screenshot({ path: path.join(process.env.SNAPDIR || outDir, `f-${s.toFixed(1)}.png`) }); }
  await browser.close(); process.exit(0);
}
const out = path.join(outDir, 'reel-voz.mp4');
const ff = spawn(ffmpeg, ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-i', audio,
  '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-r', String(FPS),
  '-af', 'apad', '-c:a', 'aac', '-b:a', '128k', '-ar', '48000', '-ac', '1', '-t', String(frames / FPS), '-movflags', '+faststart', out],
  { stdio: ['pipe', 'inherit', 'inherit'] });
for (let f = 0; f < frames; f++) {
  const t = f / FPS;
  await page.evaluate((t) => window.render(t), t);
  const buf = await page.screenshot({ type: 'png' });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  if (snaps.some((s) => Math.round(s * FPS) === f)) fs.writeFileSync(path.join(process.env.SNAPDIR || outDir, `f-${t.toFixed(1)}.png`), buf);
}
ff.stdin.end();
await new Promise((r) => ff.on('close', r));
await browser.close();
