import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { carruseles } from './carruseles.mjs';
const dir = path.dirname(new URL(import.meta.url).pathname);

const md = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
const leaf = (col) => `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="${col}" stroke-width="1.8" stroke-linecap="round"><path d="M5 19C5 10 10 5 20 4c-1 10-6 15-15 15z"/><path d="M5 19l9-9"/></svg>`;
const icons = {
  book: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v8"/>',
  cal: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
  phone: '<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 17h2"/>',
};
const icon = (k) => `<span class="ic"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#2E6F57" stroke-width="1.8" stroke-linecap="round">${icons[k]}</svg></span>`;

function slide(s, i, n) {
  const num = `${i} / ${n}`;
  if (s.type === 'portada') return `<div class="s dark">
    <div class="circ tr"></div><div class="dot" style="right:120px;top:150px;width:140px;height:140px"></div>
    <div class="brand">${leaf('#FAFAF7')}<span>pauta posible</span></div>
    <div class="mid"><span class="pill">${md(s.tag)}</span><h1>${md(s.title)}</h1><p class="sub">${md(s.sub)}</p></div>
    <div class="foot"><span>@pautaposible</span><span>Desliza →</span></div></div>`;
  if (s.type === 'cierre') return `<div class="s dark">
    <div class="circ bl"></div>
    <div class="brand">${leaf('#FAFAF7')}<span>pauta posible</span></div>
    <div class="mid"><h2 class="big">${md(s.title)}</h2><p class="sub">${md(s.sub)}</p><span class="btn">${md(s.url)}</span></div>
    <div class="foot"><span>${md(s.foot)}</span><span>${num}</span></div></div>`;
  if (s.type === 'final') return `<div class="s dark">
    <div class="circ tr2"></div><div class="dot" style="right:110px;top:120px;width:90px;height:90px"></div>
    <div class="brand">${leaf('#FAFAF7')}<span>pauta posible</span></div>
    <div class="fin">
      <h2 class="fh">¿Quieres ir un paso más allá?</h2>
      <div class="row">${icon('book')}<span>Recetas fáciles con cantidades para ti</span></div>
      <div class="row">${icon('cal')}<span>Organiza tus comidas y tu pauta</span></div>
      <div class="row">${icon('phone')}<span>App gratuita: cocina con lo que tienes en casa<br><em>Gratis por ahora</em></span></div>
      <span class="btn lg">pautaposible.es</span><p class="bio">Enlace en la bio</p>
      <div class="ivan"><img src="ivan.png"><div><b>Iván · Pauta Posible</b><span>Nutrición práctica, sin miedo ni culpa</span></div></div>
    </div>
    <div class="foot"><span>@pautaposible</span><span>${num}</span></div></div>`;
  // texto
  let h = `<div class="s light"><div class="mid">`;
  if (s.kicker) h += `<p class="kick">${md(s.kicker)}</p>`;
  if (s.title) h += `<h2>${md(s.title)}</h2>`;
  if (s.p) h += `<p class="body">${md(s.p)}</p>`;
  if (s.steps) h += `<ol>${s.steps.map((t, k) => `<li><span class="n">${(s.start || 1) + k}</span><span>${md(t)}</span></li>`).join('')}</ol>`;
  if (s.chips) h += `<div class="box chips">${s.chips.map((c) => `<b>${md(c)}</b>`).join('<i> · </i>')}</div>`;
  if (s.checks) h += `<ul class="checks">${s.checks.map((c) => `<li><span class="ck"></span><span>${md(c)}</span></li>`).join('')}</ul>`;
  if (s.box) h += `<div class="box">${md(s.box)}</div>`;
  if (s.p2) h += `<p class="body">${md(s.p2)}</p>`;
  return h + `</div><div class="foot"><span>pauta posible</span><b>${num}</b></div></div>`;
}

const css = `
@font-face{font-family:Manrope;font-weight:400;src:url(node_modules/@fontsource/manrope/files/manrope-latin-400-normal.woff2)}
@font-face{font-family:Manrope;font-weight:600;src:url(node_modules/@fontsource/manrope/files/manrope-latin-600-normal.woff2)}
@font-face{font-family:Manrope;font-weight:700;src:url(node_modules/@fontsource/manrope/files/manrope-latin-700-normal.woff2)}
@font-face{font-family:Manrope;font-weight:800;src:url(node_modules/@fontsource/manrope/files/manrope-latin-800-normal.woff2)}
*{box-sizing:border-box;margin:0}
html,body{width:1080px;height:1350px;overflow:hidden;font-family:Manrope,sans-serif}
.s{position:relative;width:1080px;height:1350px;overflow:hidden;padding:0 96px}
.light{background:#FAFAF7;color:#24322A}.dark{background:#2E6F57;color:#FAFAF7}
.circ{position:absolute;border-radius:50%;background:#3E7F67}
.tr{width:760px;height:760px;right:-420px;top:-380px}.tr2{width:560px;height:560px;right:-300px;top:-280px}
.bl{width:600px;height:600px;left:-300px;bottom:-320px}
.dot{position:absolute;border-radius:50%;background:#D7A95B}
.brand{position:absolute;left:96px;top:100px;display:flex;gap:16px;align-items:center;font-weight:800;font-size:30px}
.mid{position:absolute;left:96px;right:96px;top:50%;transform:translateY(-50%)}
.light .mid{transform:translateY(-54%)}
.pill{display:inline-block;background:#DDEEDF;color:#24322A;border-radius:999px;padding:14px 30px;font-weight:700;font-size:30px}
h1{font-weight:800;font-size:104px;line-height:1.06;letter-spacing:-2px;margin-top:40px}
.sub{font-size:40px;line-height:1.4;color:#DDEEDF;margin-top:30px}
.big{font-weight:800;font-size:84px;line-height:1.12;letter-spacing:-1.5px}
.btn{display:inline-block;margin-top:44px;background:#FAFAF7;color:#2E6F57;border-radius:999px;padding:26px 52px;font-weight:800;font-size:42px}
.btn.lg{font-size:56px;padding:30px 62px;margin-top:40px}
.foot{position:absolute;left:96px;right:96px;bottom:70px;display:flex;justify-content:space-between;font-size:26px;font-weight:700}
.light .foot{color:#55665B;font-weight:600}.light .foot b{color:#24322A;font-weight:800}
.kick{color:#2E6F57;font-weight:800;font-size:30px;letter-spacing:1px;text-transform:uppercase;margin-bottom:26px}
h2{font-weight:800;font-size:72px;line-height:1.1;letter-spacing:-1.2px}
.body{font-size:38px;line-height:1.42;margin-top:30px}
.body b,.box b{font-weight:800}
.box{background:#DDEEDF;border-radius:28px;padding:40px 48px;font-size:36px;line-height:1.42;margin-top:36px}
.chips i{font-style:normal;color:#55665B}
ol{list-style:none;padding:0;margin-top:40px;display:flex;flex-direction:column;gap:38px}
li{display:flex;gap:30px;font-size:36px;line-height:1.42}
li b{font-weight:800}
.n{flex:none;width:72px;height:72px;border-radius:50%;background:#2E6F57;color:#FAFAF7;font-weight:800;font-size:32px;display:flex;align-items:center;justify-content:center}
.checks{list-style:none;padding:36px 48px;margin-top:36px;background:#DDEEDF;border-radius:28px;display:flex;flex-direction:column;gap:22px}
.checks li{gap:24px;font-size:35px;line-height:1.3;align-items:flex-start}
.ck{flex:none;width:38px;height:38px;margin-top:3px;border:4px solid #2E6F57;border-radius:10px;background:#FAFAF7}
.fin{position:absolute;left:96px;right:96px;top:215px}
.fh{font-size:76px;letter-spacing:-1.5px;line-height:1.08;margin-bottom:40px}
.row{display:flex;gap:26px;align-items:center;font-size:34px;line-height:1.3;margin-bottom:22px}
.row em{display:inline-block;font-style:normal;background:#D7A95B;color:#24322A;border-radius:999px;padding:4px 18px;font-size:24px;font-weight:800;margin-top:8px}
.ic{flex:none;width:72px;height:72px;border-radius:18px;background:#DDEEDF;display:flex;align-items:center;justify-content:center}
.bio{font-size:30px;color:#DDEEDF;margin:18px 0 0 8px}
.ivan{display:flex;gap:32px;align-items:center;margin-top:44px}
.ivan img{width:150px;height:150px;border-radius:50%;background:#DDEEDF;object-fit:cover}
.ivan div{display:flex;flex-direction:column;gap:8px}.ivan b{font-size:36px;font-weight:800}.ivan span{font-size:30px;color:#DDEEDF}
`;

const [key, out] = process.argv.slice(2);
const c = carruseles[key];
if (!c || !out) { console.error('Uso: node render.mjs <' + Object.keys(carruseles).join('|') + '> <carpeta>'); process.exit(1); }
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM });
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
const n = c.slides.length;
for (let i = 0; i < n; i++) {
  const html = `<!doctype html><meta charset="utf-8"><style>${css}</style>${slide(c.slides[i], i + 1, n)}`;
  fs.writeFileSync(path.join(dir, '_tmp.html'), html);
  await page.goto('file://' + path.join(dir, '_tmp.html'));
  await page.evaluate(() => document.fonts.ready);
  const over = await page.evaluate(() => [...document.querySelectorAll('.mid,.fin')].some((e) => { const r = e.getBoundingClientRect(); return r.top < 170 || r.bottom > 1200; }));
  if (over) console.warn(`Aviso: la diapositiva ${i + 1} se sale del área segura`);
  await page.screenshot({ path: path.join(out, String(i + 1).padStart(2, '0') + '.png') });
}
fs.unlinkSync(path.join(dir, '_tmp.html'));
await browser.close();
console.log(`${n} diapositivas en ${out}`);
