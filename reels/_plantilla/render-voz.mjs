// Reel con la voz de Iván: node render-voz.mjs <clave del objeto reels> <audio-limpio.m4a> <palabras.json> <carpeta-salida>
// palabras.json: {dur, words:[{w,s,e}]} con tiempos en segundos respecto al audio limpio.
import { chromium } from 'playwright';
import { spawn, execFileSync } from 'child_process';
import { createRequire } from 'module';
import fs from 'fs';
import path from 'path';
import { hidratosCena, platoSinBascula, legumbresBote } from './ilustraciones.mjs';
const require = createRequire(import.meta.url);
const ffmpeg = require('ffmpeg-static');
const dir = path.dirname(new URL(import.meta.url).pathname);
const FPS = 30;

const reels = {
  'hidratos-cena': { hook: '¿Cenar hidratos<br>engorda?', scenes: hidratosCena },
  'plato-sin-bascula': { hook: 'Monta tu plato<br>sin báscula', scenes: platoSinBascula },
  'legumbres-bote': { hook: '¿De bote<br>o secas?', scenes: legumbresBote },
};
const [name, audio, wordsFile, outDir] = process.argv.slice(2);
const { dur, words } = JSON.parse(fs.readFileSync(wordsFile, 'utf8'));

// Envolvente de volumen por fotograma (0–1) para el anillo del retrato
const pcm = execFileSync(ffmpeg, ['-v', 'error', '-i', audio, '-ac', '1', '-ar', '48000', '-f', 'f32le', '-'], { maxBuffer: 1 << 28 });
const smp = new Float32Array(pcm.buffer, pcm.byteOffset, pcm.length / 4);
const hop = 48000 / FPS, raw = [];
for (let i = 0; i * hop < smp.length; i++) {
  let s = 0; const a = Math.floor(i * hop), b = Math.min(smp.length, a + hop);
  for (let j = a; j < b; j++) s += smp[j] * smp[j];
  raw.push(Math.sqrt(s / Math.max(1, b - a)));
}
const p95 = [...raw].sort((x, y) => x - y)[Math.floor(raw.length * 0.95)] || 1;
let prev = 0;
const env = raw.map((v) => { const x = Math.min(1, v / p95); prev = x > prev ? 0.6 * x + 0.4 * prev : 0.25 * x + 0.75 * prev; return +prev.toFixed(3); });

const cfg = { hook: reels[name].hook, scenes: reels[name].scenes(), words, dur, env };
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.goto('file://' + path.join(dir, 'reel-voz.html'));
const total = await page.evaluate((c) => window.setup(c), cfg);
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction(() => [...document.images].every((i) => i.complete));
const frames = Math.round(total * FPS);
console.log(name, 'voz', dur, 'total', total, 'fotogramas', frames);

// Portada: fotograma del gancho sin subtítulos
await page.evaluate(() => window.render(1.6, { nosubs: true }));
await page.screenshot({ path: path.join(outDir, 'portada.png') });

const out = path.join(outDir, 'reel-voz.mp4');
const ff = spawn(ffmpeg, ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-i', audio,
  '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-r', String(FPS),
  '-af', 'apad', '-c:a', 'aac', '-b:a', '128k', '-ar', '48000', '-ac', '1', '-t', String(frames / FPS), '-movflags', '+faststart', out],
  { stdio: ['pipe', 'inherit', 'inherit'] });
const snaps = (process.env.SNAPS || '').split(',').filter(Boolean).map(Number);
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
