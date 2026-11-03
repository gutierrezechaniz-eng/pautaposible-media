// Reel con la cara y la voz clonada de Iban:
//   node render-iban.mjs <escenas.mjs> <gancho.mp4 (HeyGen)> <cuerpo.mp3> <palabras.json> <carpeta-salida>
// palabras.json: {dur, hook:{texto}, words:[{w,s,e}]} con tiempos respecto a cuerpo.mp3.
// Gancho: vídeo de Iban hablando (HeyGen Avatar 4, 9:16) con la pregunta arriba. Después, diapositivas
// (escenas.mjs) con su foto en un círculo que late con la voz, subtítulos palabra a palabra y cierre de 2,5 s.
// Necesita ivan-foto.png en esta carpeta (no se sube al repo). Variables: CHROMIUM, SNAPS=1,5,12 (solo fotogramas), PREGUNTA.
import { createRequire } from 'module';
const { chromium } = createRequire(import.meta.url)('playwright');
import { execFileSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
const dir = path.dirname(new URL(import.meta.url).pathname);
const FPS = 30, GAP = 0.15, END = 2.5;
const [escenasMod, hookVid, body, wordsFile, outDir, outroVid] = process.argv.slice(2).map((p) => p && path.resolve(p));
// Opcional, 6.º argumento: vídeo de cierre (HeyGen) con la última frase; OUTRO_DESDE = segundo del cuerpo donde empieza esa frase
fs.mkdirSync(outDir, { recursive: true });
const ff = (args) => execFileSync('ffmpeg', ['-v', 'error', '-y', ...args], { maxBuffer: 1 << 28 });
const dur = (f) => parseFloat(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).toString());
const P = JSON.parse(fs.readFileSync(wordsFile, 'utf8'));

// 1. Fotogramas del gancho
const fdir = path.join(dir, 'hook-frames');
fs.rmSync(fdir, { recursive: true, force: true }); fs.mkdirSync(fdir);
ff(['-i', hookVid, '-vf', `fps=${FPS},scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920`, path.join(fdir, '%04d.jpg')]);
const frames = fs.readdirSync(fdir).sort().map((f) => 'hook-frames/' + f);
const hookEnd = frames.length / FPS;
let outroFrames = null;
if (outroVid) {
  const odir = path.join(dir, 'outro-frames');
  fs.rmSync(odir, { recursive: true, force: true }); fs.mkdirSync(odir);
  ff(['-i', outroVid, '-vf', `fps=${FPS},scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920`, path.join(odir, '%04d.jpg')]);
  outroFrames = fs.readdirSync(odir).sort().map((f) => 'outro-frames/' + f);
}
const bodyStart = hookEnd + GAP;

// 2. Audio: voz del gancho (la del propio vídeo) + voz del cuerpo, a -14 LUFS
const audio = path.join(outDir, '_audio.wav');
const ms = Math.round(bodyStart * 1000);
ff(['-i', hookVid, '-i', body, '-filter_complex',
  `[0:a]aresample=48000,pan=mono|c0=c0,atrim=0:${hookEnd.toFixed(3)},apad=whole_dur=${hookEnd.toFixed(3)},loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[h];[1:a]aresample=48000,pan=mono|c0=c0,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000,adelay=${ms}[b];[h][b]amix=inputs=2:duration=longest:normalize=0,highpass=f=70,alimiter=limit=0.89[a]`,
  '-map', '[a]', '-ar', '48000', '-ac', '1', audio]);

// Envolvente de volumen por fotograma para el anillo de la foto
const pcm = execFileSync('ffmpeg', ['-v', 'error', '-i', audio, '-ac', '1', '-ar', '48000', '-f', 'f32le', '-'], { maxBuffer: 1 << 28 });
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

// Palabras del gancho: si no vienen con tiempos, se reparten por longitud entre 0,15 s y el final de la voz
let hookWords = P.hook.words;
if (!hookWords) {
  const ws = P.hook.texto.split(/\s+/), tot = ws.reduce((a, w) => a + w.length + 2, 0);
  const t0 = 0.15, t1 = Math.min(hookEnd, P.hook.dur || hookEnd) - 0.15;
  let acc = 0;
  hookWords = ws.map((w) => { const s = t0 + (t1 - t0) * acc / tot; acc += w.length + 2; return { w, s, e: t0 + (t1 - t0) * acc / tot - 0.04 }; });
}
const words = P.words.map((w) => ({ ...w, s: w.s + bodyStart, e: w.e + bodyStart }));
const voiceEnd = bodyStart + P.dur;
const { default: escenas } = await import(pathToFileURL(escenasMod).href);
const cfg = { frames, fps: FPS, hookEnd, hookQ: process.env.PREGUNTA || P.hook.pregunta, hookWords, words, voiceEnd, scenes: escenas(bodyStart), env, endDur: END,
  outro: outroFrames ? { frames: outroFrames, start: bodyStart + parseFloat(process.env.OUTRO_DESDE), pill: process.env.OUTRO_TEXTO || '' } : null };

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
await page.goto('file://' + path.join(dir, 'reel-iban.html'));
const total = await page.evaluate((c) => window.setup(c), cfg);
await page.evaluate(() => document.fonts.ready);
const draw = async (t, o) => page.evaluate(async ([t, o]) => { window.render(t, o); await Promise.all([...document.images].filter((i) => i.offsetParent !== null || i.id === 'hfr').map((i) => i.decode().catch(() => {}))); }, [t, o]);
const n = Math.round(total * FPS);
console.log('gancho', hookEnd.toFixed(2), 's · voz hasta', voiceEnd.toFixed(2), 's · total', total.toFixed(2), 's ·', n, 'fotogramas');

// Portada: Iban hablando con la pregunta, sin subtítulos
await draw(1.2, { nosubs: true });
await page.screenshot({ path: path.join(outDir, 'portada.png') });

const snaps = (process.env.SNAPS || '').split(',').filter(Boolean).map(Number);
if (snaps.length) {
  for (const s of snaps) { await draw(s, {}); await page.screenshot({ path: path.join(outDir, `f-${s.toFixed(1)}.png`) }); }
  await browser.close(); process.exit(0);
}
const out = path.join(outDir, 'reel-iban.mp4');
const enc = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-', '-i', audio,
  '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', '-r', String(FPS),
  '-af', 'apad', '-c:a', 'aac', '-b:a', '160k', '-ar', '48000', '-ac', '1', '-t', String(n / FPS), '-movflags', '+faststart', out],
  { stdio: ['pipe', 'inherit', 'inherit'] });
for (let f = 0; f < n; f++) {
  await draw(f / FPS, {});
  const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
  if (!enc.stdin.write(buf)) await new Promise((r) => enc.stdin.once('drain', r));
}
enc.stdin.end();
await new Promise((r) => enc.on('close', r));
await browser.close();
fs.rmSync(audio);
console.log('listo:', out);
