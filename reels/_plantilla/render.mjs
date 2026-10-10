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


function food(kind) {
  const w = (inner) => `<svg width="420" height="320" viewBox="0 0 420 320"><ellipse cx="210" cy="290" rx="170" ry="18" fill="#24322A" opacity=".08"/>${inner}</svg>`;
  if (kind === 'yogur') return w(`
  <path d="M60,150 Q60,280 210,280 Q360,280 360,150 Z" fill="#fff" stroke="#2E6F57" stroke-width="8"/>
  <ellipse cx="210" cy="150" rx="150" ry="34" fill="#FAFAF7" stroke="#2E6F57" stroke-width="8"/>
  <circle cx="150" cy="138" r="22" fill="#C8475A"/><circle cx="185" cy="128" r="18" fill="#C8475A"/>
  <circle cx="262" cy="140" r="17" fill="#4B4E8C"/><circle cx="288" cy="128" r="15" fill="#4B4E8C"/>
  <ellipse cx="225" cy="150" rx="13" ry="7" fill="#D7A95B"/><ellipse cx="120" cy="155" rx="12" ry="6" fill="#D7A95B" transform="rotate(20 120 155)"/>
  <ellipse cx="305" cy="156" rx="12" ry="6" fill="#D7A95B" transform="rotate(-25 305 156)"/><ellipse cx="200" cy="162" rx="11" ry="6" fill="#D7A95B"/>`);
  if (kind === 'tostada') return w(`
  <path d="M80,270 L80,120 Q80,50 150,55 Q210,20 270,55 Q340,50 340,120 L340,270 Z" fill="#D7A95B" stroke="#A97C35" stroke-width="8"/>
  <path d="M105,255 L105,128 Q105,82 155,84 Q210,55 265,84 Q315,82 315,128 L315,255 Z" fill="#EBC98C"/>
  <path d="M120,150 Q210,120 300,150 L300,210 Q210,235 120,210 Z" fill="#D9503F" opacity=".85"/>
  <rect x="140" y="160" width="60" height="44" rx="10" fill="#fff"/><rect x="220" y="168" width="58" height="42" rx="10" fill="#fff"/>
  <circle cx="200" cy="225" r="6" fill="#6FA67A"/><circle cx="250" cy="140" r="6" fill="#6FA67A"/>`);
  if (kind === 'tostada-tomate') return w(`
  <g transform="translate(-20,30) scale(.82)">
  <path d="M80,270 L80,120 Q80,50 150,55 Q210,20 270,55 Q340,50 340,120 L340,270 Z" fill="#D7A95B" stroke="#A97C35" stroke-width="9"/>
  <path d="M105,255 L105,128 Q105,82 155,84 Q210,55 265,84 Q315,82 315,128 L315,255 Z" fill="#EBC98C"/>
  <path d="M118,140 Q210,105 302,140 L302,235 Q210,260 118,235 Z" fill="#D9503F" opacity=".85"/>
  <ellipse cx="165" cy="170" rx="16" ry="9" fill="#B9A23A" opacity=".9"/><ellipse cx="245" cy="200" rx="19" ry="10" fill="#B9A23A" opacity=".9"/>
  <ellipse cx="200" cy="225" rx="12" ry="7" fill="#B9A23A" opacity=".9"/></g>
  <circle cx="330" cy="215" r="62" fill="#E8963A"/><circle cx="330" cy="215" r="62" fill="none" stroke="#C97A26" stroke-width="6"/>
  <path d="M330,153 q4,-22 18,-30" stroke="#6b4a2b" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M336,146 q30,-24 55,-4 q-28,20 -55,4" fill="#6FA67A"/><ellipse cx="308" cy="192" rx="14" ry="22" fill="#fff" opacity=".25"/>`);
  if (kind === 'leche-bocadillo') return w(`
  <path d="M58,70 L178,70 L164,280 L72,280 Z" fill="#fff" stroke="#2E6F57" stroke-width="8" stroke-linejoin="round"/>
  <path d="M64,112 L172,112 L164,272 L72,272 Z" fill="#F4F1E8"/><line x1="64" y1="112" x2="172" y2="112" stroke="#DDEEDF" stroke-width="6"/>
  <ellipse cx="96" cy="170" rx="8" ry="40" fill="#fff" opacity=".8"/>
  <rect x="200" y="150" width="200" height="110" rx="55" fill="#D7A95B" stroke="#A97C35" stroke-width="8"/>
  <rect x="214" y="196" width="172" height="20" rx="10" fill="#fff"/>
  <path d="M250,168 l22,-12 M295,166 l22,-12 M340,168 l22,-12" stroke="#A97C35" stroke-width="7" stroke-linecap="round"/>`);
  if (kind === 'yogur-platano') return w(`
  <path d="M60,150 Q60,280 210,280 Q360,280 360,150 Z" fill="#fff" stroke="#2E6F57" stroke-width="8"/>
  <ellipse cx="210" cy="150" rx="150" ry="34" fill="#FAFAF7" stroke="#2E6F57" stroke-width="8"/>
  <circle cx="140" cy="146" r="20" fill="#F3E3A0" stroke="#D9C36A" stroke-width="4"/><circle cx="140" cy="146" r="4" fill="#C9B45A"/>
  <circle cx="185" cy="132" r="19" fill="#F3E3A0" stroke="#D9C36A" stroke-width="4"/><circle cx="185" cy="132" r="4" fill="#C9B45A"/>
  <circle cx="232" cy="150" r="19" fill="#F3E3A0" stroke="#D9C36A" stroke-width="4"/><circle cx="232" cy="150" r="4" fill="#C9B45A"/>
  <path d="M262,128 q12,-14 26,-4 q14,-8 22,6 q8,14 -6,22 q-6,12 -22,6 q-16,4 -20,-10 q-12,-8 0,-20 Z" fill="#8B5E34"/>
  <path d="M100,152 q10,-12 22,-4 q12,-6 18,6 q6,12 -6,18 q-6,10 -18,4 q-14,2 -16,-8 q-10,-6 0,-16 Z" fill="#8B5E34" transform="translate(-6,-4) scale(.9)"/>
  <path d="M286,136 q-6,10 4,14 M282,148 q8,2 10,-6" stroke="#6b4a2b" stroke-width="3" fill="none"/>`);
  return w(`
  <circle cx="275" cy="175" r="95" fill="#C8475A"/><path d="M275,82 q5,-30 22,-42" stroke="#6b4a2b" stroke-width="9" fill="none" stroke-linecap="round"/>
  <path d="M282,70 q40,-30 70,-5 q-35,25 -70,5" fill="#6FA67A"/><ellipse cx="240" cy="140" rx="22" ry="34" fill="#fff" opacity=".25"/>
  <ellipse cx="95" cy="250" rx="34" ry="22" fill="#A97C35"/><ellipse cx="150" cy="262" rx="30" ry="19" fill="#C99A55"/>
  <ellipse cx="120" cy="215" rx="28" ry="18" fill="#B98843" transform="rotate(-20 120 215)"/><ellipse cx="70" cy="210" rx="26" ry="17" fill="#C99A55" transform="rotate(25 70 210)"/>`);
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
  'fruta-postre': {
    scenes: [
      { kind: 'hook', dur: 3.2, title: '¿La fruta de<br>postre fermenta?', sub: 'Spoiler: no' },
      { kind: 'mid', dur: 4, tag: 'Mito o realidad', title: 'Tu estómago es <em>muy ácido</em>', small: 'Y mezcla todo lo que comes.' },
      { kind: 'mid', dur: 4.2, title: 'La fruta se digiere <em>con el resto</em>', small: 'No se queda «pudriéndose» esperando su turno.' },
      { kind: 'mid', dur: 4.3, top: 330, title: '¿Te sienta pesada?', pills: ['Mira la cantidad', 'no el orden'] },
      { kind: 'mid', dur: 4, title: 'Lo importante: <em>fruta a diario</em>', small: 'De postre, a media mañana o cuando te apetezca.' },
      { kind: 'mid', dur: 3.6, title: 'Envíaselo a quien <em>la aparta</em> del postre' },
      { kind: 'end', dur: 3.5, lead: 'Recetas y app gratuita para<br>cocinar con lo que tienes en casa', url: 'pautaposible.es', bio: 'Enlace en la bio', save: 'Guárdalo 🔖' },
    ],
  },
  'meriendas': {
    scenes: [
      { kind: 'hook', dur: 3.2, title: '¿Llegas a la<br>cena con<br>hambre?', sub: '3 meriendas en 2 minutos' },
      { kind: 'mid', dur: 4.2, top: 300, tag: 'Merienda 1', visual: food('yogur'), title: 'Yogur natural con <em>fruta y avena</em>', small: 'Unos copos y la fruta que tengas.' },
      { kind: 'mid', dur: 4.2, top: 300, tag: 'Merienda 2', visual: food('tostada'), title: 'Tostada integral con <em>tomate y queso fresco</em>' },
      { kind: 'mid', dur: 4.2, top: 300, tag: 'Merienda 3', visual: food('frutos'), title: 'Un puñado de <em>frutos secos</em> y una fruta', small: 'Naturales o tostados, sin sal.' },
      { kind: 'mid', dur: 3.8, title: 'Dos minutos<br><em>y listo</em>', small: 'Llegas a la cena con hambre, no con ansia.' },
      { kind: 'mid', dur: 3.4, title: 'Guárdalo para <em>esta tarde</em>' },
      { kind: 'end', dur: 3.5, lead: 'Recetas y app gratuita para<br>cocinar con lo que tienes en casa', url: 'pautaposible.es', bio: 'Enlace en la bio', save: 'Guárdalo 🔖' },
    ],
  },
  'desayunos': {
    scenes: [
      { kind: 'hook', dur: 3.2, title: '¿Sales de casa<br>sin<br>desayunar?', sub: '3 desayunos en 3 minutos' },
      { kind: 'mid', dur: 4.2, top: 300, tag: 'Desayuno 1', visual: food('tostada-tomate'), title: 'Tostada integral con <em>aceite y tomate</em>', small: 'Y una pieza de fruta.' },
      { kind: 'mid', dur: 4.2, top: 300, tag: 'Desayuno 2', visual: food('leche-bocadillo'), title: 'Leche y un bocadillo pequeño de <em>queso fresco</em>' },
      { kind: 'mid', dur: 4.2, top: 300, tag: 'Desayuno 3', visual: food('yogur-platano'), title: 'Yogur natural con <em>nueces y plátano</em>', small: 'Si vas con prisa, llévatelo en un táper.' },
      { kind: 'mid', dur: 3.8, title: 'Tres minutos<br><em>y sales</em>', small: 'Con lo que ya tienes en casa.' },
      { kind: 'mid', dur: 3.4, title: 'Guárdalo para <em>mañana</em>' },
      { kind: 'end', dur: 3.5, lead: 'Recetas y app gratuita para<br>cocinar con lo que tienes en casa', url: 'pautaposible.es', bio: 'Enlace en la bio', save: 'Guárdalo 🔖' },
    ],
  },
};

const [name, outDir] = process.argv.slice(2);
const cfg = reels[name];
const FPS = 30;
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM });
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
