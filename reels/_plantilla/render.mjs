import { chromium } from 'playwright';
import { spawn } from 'child_process';
import { createRequire } from 'module';
import path from 'path';
const require = createRequire(import.meta.url);
const ffmpeg = require('ffmpeg-static');
const dir = path.dirname(new URL(import.meta.url).pathname);

function plate(active) {
  const c = (k, col) => (k === active || active === 'all' ? col : '#E9ECE6');
  return `<svg width="380" height="380" viewBox="0 0 360 360">
  <circle cx="180" cy="180" r="176" fill="#fff" stroke="#DDEEDF" stroke-width="8"/>
  <path d="M180,180 L180,24 A156,156 0 0 1 180,336 Z" fill="${c('v', '#6FA67A')}"/>
  <path d="M180,180 L24,180 A156,156 0 0 1 180,24 Z" fill="${c('p', '#D7A95B')}"/>
  <path d="M180,180 L180,336 A156,156 0 0 1 24,180 Z" fill="${c('h', '#2E6F57')}"/>
  <line x1="180" y1="24" x2="180" y2="336" stroke="#fff" stroke-width="8"/>
  <line x1="24" y1="180" x2="180" y2="180" stroke="#fff" stroke-width="8"/></svg>`;
}

const reels = {
  'hidratos-cena': {
    scenes: [
      { kind: 'hook', dur: 3.2, title: '¿Cenar hidratos<br>engorda?', sub: 'Spoiler: no es cosa de la hora' },
      { kind: 'mid', dur: 4, tag: 'Mito o realidad', title: 'De noche tu cuerpo <em>también gasta</em> energía', small: 'Respira, repara y mantiene la temperatura mientras duermes.' },
      { kind: 'mid', dur: 4, title: 'Lo que más cuenta es <em>el conjunto</em> del día', small: 'Lo que comes en total y cuánto te mueves, no la hora.' },
      { kind: 'mid', dur: 4.3, top: 330, title: 'Fíjate en esto:', pills: ['Qué hidrato', 'Cuánto te sirves', 'Con qué lo acompañas'] },
      { kind: 'mid', dur: 4, title: 'Cenar hidratos <em>no es un error</em>', small: 'Arroz con verduras y huevo: una cena completa.' },
      { kind: 'end', dur: 4 },
    ],
  },
  'plato-sin-bascula': {
    scenes: [
      { kind: 'hook', dur: 3.2, title: 'Deja la<br>báscula', sub: 'Monta tu plato a ojo' },
      { kind: 'mid', dur: 4, top: 300, visual: plate('v'), title: '<em>½</em> verduras y hortalizas', small: 'Crudas, al horno o en crema: todas cuentan.' },
      { kind: 'mid', dur: 3.8, top: 300, visual: plate('p'), title: '<em>¼</em> proteína', small: 'Legumbres, huevo, pescado o carne.' },
      { kind: 'mid', dur: 3.8, top: 300, visual: plate('h'), title: '<em>¼</em> hidratos', small: 'Arroz, pasta, pan o patata. Mejor integrales.' },
      { kind: 'mid', dur: 4.2, top: 300, visual: plate('all'), title: 'Una guía, <em>no una regla</em>', small: '¿Entrenas o tienes más hambre? Ajusta la cantidad.' },
      { kind: 'end', dur: 4 },
    ],
  },
};

const [name, outDir] = process.argv.slice(2);
const cfg = reels[name];
const FPS = 30;
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.goto('file://' + path.join(dir, 'reel.html'));
const total = await page.evaluate((c) => window.build(c), cfg);
await page.evaluate(() => document.fonts.ready);
await page.waitForFunction(() => [...document.images].every((i) => i.complete));
const frames = Math.round(total * FPS);
console.log(name, 'duration', total, 'frames', frames);

const ff = spawn(ffmpeg, ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
  '-f', 'lavfi', '-i', 'anullsrc=channel_layout=stereo:sample_rate=44100',
  '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '20', '-pix_fmt', 'yuv420p',
  '-r', String(FPS), '-c:a', 'aac', '-b:a', '128k', '-shortest', '-t', String(frames / FPS), '-movflags', '+faststart',
  path.join(outDir, 'reel.mp4')], { stdio: ['pipe', 'inherit', 'inherit'] });

for (let f = 0; f < frames; f++) {
  const t = f / FPS;
  await page.evaluate((t) => window.render(t), t);
  const buf = await page.screenshot({ type: 'png' });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  if (Math.abs(t - 2.0) < 1e-6) await page.screenshot({ path: path.join(outDir, 'portada.png') });
}
ff.stdin.end();
await new Promise((r) => ff.on('close', r));
await browser.close();
