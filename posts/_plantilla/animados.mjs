// Carruseles educativos animados: cada diapositiva es un vídeo corto (1080×1350) con estilo Pauta Posible.
// Las animaciones se declaran con atributos data-* (ver animado.html). La última diapositiva (la fija de la web y la app) sigue siendo el PNG estático.
const F = '#2E6F57', CR = '#FAFAF7', M = '#DDEEDF', S = '#6FA67A', G = '#D7A95B', CH = '#24322A', RJ = '#D9714E';
const BLANCO = '#FFFFFF', MORENO = '#B7793F', MORENO2 = '#9A6232';

// Texto con palabras que entran una a una; **x** resalta.
export function words(text, t0, step = 0.08, kind = 'up') {
  let i = 0;
  return text.split(/(\*\*.+?\*\*)/).map((part) => {
    const hl = /^\*\*/.test(part); const ws = part.replace(/\*\*/g, '').split(' ').filter(Boolean);
    const html = ws.map((w) => `<span class="w" data-in="${(t0 + step * i++).toFixed(2)} ${kind}">${w}</span>`).join(' ');
    return hl ? `<span class="hl">${html}</span>` : html;
  }).join(' ');
}
const md = (s) => s.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
const leaf = (col) => `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="${col}" stroke-width="1.8" stroke-linecap="round"><path d="M5 19C5 10 10 5 20 4c-1 10-6 15-15 15z"/><path d="M5 19l9-9"/></svg>`;
const brand = (dark) => `<div class="brand">${leaf(dark ? CR : F)}<span>pauta posible</span></div>`;
const foot = (l, r, rAttr = '') => `<div class="foot"><span>${l}</span><span${rAttr}>${r}</span></div>`;
const kick = (txt, at = 0.1) => `<div class="kick" data-in="${at} pop">${txt}</div>`;
const blobs = (dark) => dark
  ? `<div class="blob" data-float="16 6" style="width:560px;height:560px;right:-200px;top:-190px;background:rgba(111,166,122,.28)"></div><div class="blob" data-pulse=".12 2.4" style="width:90px;height:90px;right:96px;top:60px;background:${G}"></div><div class="blob" data-float="12 7 .3" style="width:420px;height:420px;left:-210px;bottom:-170px;background:rgba(111,166,122,.2)"></div>`
  : `<div class="blob" data-float="14 6" style="width:380px;height:380px;right:-170px;top:-150px;background:${M}"></div><div class="blob" data-pulse=".15 2.2" style="width:56px;height:56px;right:120px;top:70px;background:${G}"></div>`;
const svgLayer = (inner) => `<svg class="a" style="left:0;top:0" width="1080" height="1350" viewBox="0 0 1080 1350">${inner}</svg>`;

// ---------- Ilustraciones (SVG) ----------
// Terrón isométrico de lado s con la esquina superior en (x, y).
const cube = (x, y, s, col, dark) => { const h = s * 0.5;
  return `<path d="M${x} ${y + h / 2} L${x + s / 2} ${y} L${x + s} ${y + h / 2} L${x + s} ${y + h / 2 + s * 0.62} L${x + s / 2} ${y + h + s * 0.62} L${x} ${y + h / 2 + s * 0.62} Z" fill="${col}"/>` +
    `<path d="M${x} ${y + h / 2} L${x + s / 2} ${y} L${x + s} ${y + h / 2} L${x + s / 2} ${y + h} Z" fill="${col}" stroke="${dark}" stroke-width="${s * 0.02}"/>` +
    `<path d="M${x} ${y + h / 2} L${x + s / 2} ${y + h} L${x + s / 2} ${y + h + s * 0.62} L${x} ${y + h / 2 + s * 0.62} Z" fill="${dark}" opacity=".35"/>` +
    `<path d="M${x + s} ${y + h / 2} L${x + s / 2} ${y + h} L${x + s / 2} ${y + h + s * 0.62} L${x + s} ${y + h / 2 + s * 0.62} Z" fill="${dark}" opacity=".18"/>` +
    `<path d="M${x} ${y + h / 2} L${x + s / 2} ${y + h} L${x + s} ${y + h / 2} L${x + s} ${y + h / 2 + s * 0.62} L${x + s / 2} ${y + h + s * 0.62} L${x} ${y + h / 2 + s * 0.62} Z" fill="none" stroke="${dark}" stroke-width="${s * 0.02}"/>`; };
const terron = (x, y, s, moreno) => cube(x, y, s, moreno ? MORENO : BLANCO, moreno ? MORENO2 : '#CFCABD');
const bowl = (cx, by, w, pile) => `<ellipse cx="${cx}" cy="${by - w * 0.36}" rx="${w * 0.42}" ry="${w * 0.17}" fill="${pile}" stroke="rgba(0,0,0,.08)"/>` +
  `<path d="M${cx - w / 2} ${by - w * 0.38} H${cx + w / 2} C${cx + w / 2} ${by - w * 0.05} ${cx + w * 0.3} ${by} ${cx} ${by} C${cx - w * 0.3} ${by} ${cx - w / 2} ${by - w * 0.05} ${cx - w / 2} ${by - w * 0.38}Z" fill="${CR}" stroke="${CH}" stroke-width="6"/>` +
  `<path d="M${cx - w * 0.36} ${by - w * 0.22} H${cx + w * 0.36}" stroke="${S}" stroke-width="10" stroke-linecap="round" opacity=".5"/>`;
const cucharita = (x, y, s, col = BLANCO) => `<g transform="translate(${x} ${y}) scale(${s / 100})"><rect x="45" y="44" width="10" height="54" rx="5" fill="#8E9A94"/><ellipse cx="50" cy="40" rx="30" ry="20" fill="#B8C2BC"/>` +
  `<path d="M24 38 C30 14 70 14 76 38 C66 44 34 44 24 38Z" fill="${col}" stroke="#CFCABD" stroke-width="2"/><g fill="#E9E4D6"><circle cx="40" cy="30" r="2.5"/><circle cx="55" cy="26" r="2.5"/><circle cx="62" cy="33" r="2.5"/></g></g>`;
const taza = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s / 100})"><path d="M14 40 H74 V70 C74 86 62 94 44 94 C26 94 14 86 14 70Z" fill="${CR}" stroke="${CH}" stroke-width="5"/><path d="M74 50 C92 50 92 74 72 74" fill="none" stroke="${CH}" stroke-width="5"/><ellipse cx="44" cy="42" rx="28" ry="6" fill="#8A5A3C"/>` +
  `<g data-float="5 1.6" opacity=".7"><path d="M32 30 C26 22 38 16 32 6" stroke="${S}" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M52 30 C46 22 58 16 52 6" stroke="${S}" stroke-width="5" fill="none" stroke-linecap="round"/></g></g>`;
const yogur = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s / 100})"><path d="M10 46 H90 C90 76 72 94 50 94 C28 94 10 76 10 46Z" fill="${CR}" stroke="${CH}" stroke-width="5"/><ellipse cx="50" cy="46" rx="40" ry="9" fill="#fff" stroke="${CH}" stroke-width="5"/></g>`;
const fruta = (x, y, s, col) => `<rect x="${x}" y="${y}" width="${s}" height="${s}" rx="${s * 0.25}" fill="${col}"/>`;
const etiqueta = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s / 100})"><rect x="14" y="6" width="72" height="88" rx="8" fill="#fff" stroke="${CH}" stroke-width="4"/><rect x="22" y="16" width="56" height="9" rx="4" fill="${CH}"/>` +
  [32, 46, 60, 74].map((yy, i) => `<rect x="22" y="${yy}" width="${i === 2 ? 56 : 40}" height="7" rx="3.5" fill="${i === 2 ? G : '#C9D2CC'}"/>`).join('') + `</g>`;
const lupa = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s / 100})"><circle cx="40" cy="40" r="30" fill="rgba(221,238,223,.55)" stroke="${CH}" stroke-width="8"/><path d="M62 62 L92 92" stroke="${CH}" stroke-width="12" stroke-linecap="round"/></g>`;
const bolsa = (x, y, w, h) => `<path d="M${x} ${y + 30} L${x + 20} ${y} H${x + w - 20} L${x + w} ${y + 30} V${y + h} H${x}Z" fill="#C79A63"/><path d="M${x + 20} ${y} L${x + 36} ${y + 30} H${x + w - 36} L${x + w - 20} ${y}" fill="#B7864F"/>` +
  `<rect x="${x + 30}" y="${y + h * 0.36}" width="${w - 60}" height="${h * 0.36}" rx="16" fill="${CR}"/>` +
  `<text x="${x + w / 2}" y="${y + h * 0.36 + 70}" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="44" fill="${CH}">AZÚCAR</text>` +
  `<text x="${x + w / 2}" y="${y + h * 0.36 + 122}" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="44" fill="${MORENO2}">MORENO</text>`;
const pegatina = (left, top, txt, at, rot, bg = G, col = CH) =>
  `<div class="a" style="left:${left}px;top:${top}px" data-in="${at} pop"><div style="transform:rotate(${rot}deg);background:${bg};color:${col};border-radius:999px;padding:16px 34px;font-weight:800;font-size:38px;box-shadow:0 10px 24px rgba(36,50,42,.15)">${txt}</div></div>`;

// Cada diapositiva: {dur, cls, voz: [[lo que dice el narrador, subtítulo], …], html}. Sin «voz», sin narrador ni subtítulos.
// En el html, «c2+0.4» en data-in/out/mv/count = cuando el narrador empieza el trozo 2, más 0,4 s.
export const animados = {
  'azucar-moreno': [
    { dur: 6, cls: 'dark', voz: [['¿El azúcar moreno es mejor que el blanco?', '¿El azúcar moreno es mejor que el blanco?'], ['Spoiler:', 'Spoiler:'], ['lo que cambia es el color, no mucho más.', 'lo que cambia es el color, no mucho más.']],
      html: blobs(true) + brand(true) + kick('Mito o realidad', 0.15) +
        `<div class="title xl" style="font-size:88px">${words('¿El azúcar moreno es mejor que el blanco?', 0.35, 0.08)}</div>` +
        `<div class="a" style="left:80px;top:470px;font-size:40px;font-weight:600;opacity:.9" data-in="c2 fade">Lo que cambia es el color, no mucho más.</div>` +
        svgLayer(
          `<g data-in="0.6 up">${bowl(300, 1080, 380, BLANCO)}</g><g data-in="0.75 up">${bowl(780, 1080, 380, MORENO)}</g>` +
          [[180, 0.9], [255, 1.05], [330, 1.2]].map(([x, t], i) => `<g data-in="${t} drop"><g data-float="6 2.4 ${i * 0.2}">${terron(x, 835 - (i % 2) * 22, 90, false)}</g></g>`).join('') +
          [[660, 1.0], [735, 1.15], [810, 1.3]].map(([x, t], i) => `<g data-in="${t} drop"><g data-float="6 2.4 ${0.5 + i * 0.2}">${terron(x, 835 - (i % 2) * 22, 90, true)}</g></g>`).join('') +
          `<g data-in="c1 pop"><g data-pulse=".08 1.4"><circle cx="540" cy="700" r="74" fill="${G}"/><text x="540" y="727" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="72" fill="${CH}">VS</text></g></g>`) +
        `<div class="lbl" style="left:150px;width:300px;top:1090px;font-size:38px" data-in="1.6 up">Blanco</div><div class="lbl" style="left:630px;width:300px;top:1090px;font-size:38px" data-in="1.75 up">Moreno</div>` +
        foot('@pautaposible', 'Desliza →', ' data-nudge="14 1.2" style="display:inline-block"') },

    { dur: 6, cls: 'light', voz: [['Respuesta corta: no.', 'Respuesta corta: no.'], ['Los dos son casi todo sacarosa.', 'Los dos son casi todo sacarosa.'], ['El moreno solo lleva un poco de melaza,', 'El moreno solo lleva un poco de melaza,'], ['y aportan prácticamente las mismas calorías.', 'y aportan prácticamente las mismas calorías.']],
      html: blobs(false) + brand(false) + kick('Respuesta corta') +
        `<div class="title">${words('No: los dos son casi todo **sacarosa.**', 0.3, 0.09)}</div>` +
        svgLayer(
          `<g data-in="c1 pop"><g data-float="8 3">${terron(150, 470, 250, false)}</g></g>` +
          `<g data-in="c1+0.2 pop"><g data-float="8 3 .5">${terron(680, 470, 250, true)}</g></g>` +
          `<g data-in="c2+0.3 drop"><path d="M805 420 C790 445 790 462 805 470 C820 462 820 445 805 420Z" fill="#5A3B1E"/></g>` +
          `<g data-in="c3 pop"><g data-pulse=".1 1.2"><text x="540" y="650" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="190" fill="${G}">≈</text></g></g>`) +
        `<div class="lbl" style="left:650px;width:340px;top:370px;font-size:30px;color:${MORENO2}" data-in="c2+0.6 left">+ un poco de melaza</div>` +
        `<div class="lbl" style="left:125px;width:300px;top:780px;font-size:40px" data-in="c1+0.3 up">Blanco</div><div class="lbl" style="left:655px;width:300px;top:780px;font-size:40px" data-in="c1+0.5 up">Moreno</div>` +
        `<div class="lbl" style="left:125px;width:300px;top:835px;font-size:96px;color:${F}" data-in="c3 fade"><span data-count="c3 1.4 0 387">0</span></div>` +
        `<div class="lbl" style="left:655px;width:300px;top:835px;font-size:96px;color:${F}" data-in="c3+0.15 fade"><span data-count="c3+0.15 1.4 0 380">0</span></div>` +
        `<div class="lbl" style="left:0;width:1080px;top:960px;font-size:28px;font-weight:700;opacity:.65" data-in="c3+0.6 fade">kcal por cada 100 g</div>` +
        `<div class="note" style="top:1020px;padding:20px 30px;font-size:32px" data-in="c3+1.2 up">Unas <b>4 kcal por gramo</b>, sea del color que sea.</div>` +
        foot('pauta posible', '<b>2 / 7</b>') },

    { dur: 6, cls: 'light', voz: [['Y ojo con la etiqueta:', 'Y ojo con la etiqueta:'], ['muchos azúcares morenos son azúcar blanco con melaza.', 'muchos azúcares morenos son azúcar blanco con melaza.'], ['Que ponga moreno, de caña o natural', 'Que ponga «moreno», «de caña» o «natural»'], ['no quiere decir más sano.', 'no quiere decir más sano.']],
      html: blobs(false) + brand(false) + kick('Ojo con la etiqueta') +
        `<div class="title">${words('Muchos son azúcar blanco **con melaza.**', 0.3, 0.09)}</div>` +
        svgLayer(`<g data-in="0.8 pop"><g data-sway="2 3">${bolsa(380, 450, 320, 420)}</g></g>` +
          `<g data-in="c1 left"><g data-mv="c1+0.4 330 40 1.3">${lupa(140, 540, 200)}</g></g>`) +
        `<div class="a" style="left:0;width:1080px;top:895px;text-align:center" data-in="c1+1.9 pop"><span style="display:inline-block;background:${CH};color:${CR};border-radius:999px;padding:16px 40px;font-weight:800;font-size:44px">blanco + melaza</span></div>` +
        pegatina(70, 450, '«Moreno»', 'c2+0.25', -8) + pegatina(740, 500, '«De caña»', 'c2+0.9', 7, S, '#fff') + pegatina(720, 770, '«Natural»', 'c2+1.6', -5, M, F) +
        `<div class="note" style="top:1020px;padding:20px 30px;font-size:32px" data-in="c3 up">Ninguno es <b>más sano</b>: siguen siendo azúcar.</div>` +
        foot('pauta posible', '<b>3 / 7</b>') },

    { dur: 6.5, cls: 'light', voz: [['Lo que sí cuenta es cuánto tomas.', 'Lo que sí cuenta es cuánto tomas.'], ['Lo ideal, según la OMS, es no pasar de unos veinticinco gramos al día:', 'Lo ideal, según la OMS, es no pasar de unos 25 g al día:'], ['unas seis cucharaditas,', 'unas 6 cucharaditas,'], ['contando el que ya llevan los productos.', 'contando el que ya llevan los productos.']],
      html: blobs(false) + brand(false) + kick('Lo que sí cuenta') +
        `<div class="title">${words('Cuánto tomas, **no de qué color** es.', 0.3, 0.09)}</div>` +
        `<div class="a" style="left:80px;top:420px;font-size:36px;font-weight:700" data-in="c1 up">Lo ideal, según la OMS: menos de</div>` +
        `<div class="a" style="left:70px;top:455px;font-size:210px;font-weight:800;color:${F};letter-spacing:-6px" data-in="c1+0.4 zoom"><span data-count="c1+0.4 1.6 0 25">0</span> g</div>` +
        `<div class="a" style="left:560px;top:540px;font-size:52px;font-weight:800;line-height:1.1" data-in="c2 left">al día, unas<br><span class="hl">6 cucharaditas</span></div>` +
        svgLayer([0, 1, 2, 3, 4, 5].map((i) => `<g data-in="c2+${(0.1 + i * 0.16).toFixed(2)} drop"><g data-sway="6 2.2">${cucharita(95 + i * 150, 760, 150)}</g></g>`).join('')) +
        `<div class="note" style="top:960px" data-in="c3 up">Contando el que <b>ya llevan los productos</b>: refrescos, galletas, cereales, salsas…</div>` +
        foot('pauta posible', '<b>4 / 7</b>') },

    { dur: 7, cls: 'light', voz: [['Tres trucos para tomar menos:', 'Tres trucos para tomar menos:'], ['ve reduciendo poco a poco el azúcar del café,', 've reduciendo poco a poco el azúcar del café,'], ['endulza el yogur con fruta troceada,', 'endulza el yogur con fruta troceada,'], ['y en la etiqueta, mira: de los cuales azúcares.', 'y en la etiqueta, mira «de los cuales azúcares».']],
      html: blobs(false) + brand(false) + kick('Para tomar menos') +
        `<div class="title">${words('**3 trucos** fáciles.', 0.3, 0.1)}</div>` +
        [['c1', 'Ve <b>reduciendo poco a poco</b> el azúcar del café: el paladar se acostumbra.', taza(40, 30, 150)],
         ['c2', 'Endulza el yogur natural con <b>fruta troceada</b> o canela.', yogur(40, 50, 150) +
            [[70, '#E8964A', 0.5], [110, RJ, 0.65], [150, G, 0.8]].map(([x, c, d]) => `<g data-in="c2+${d} drop">${fruta(x, 48, 30, c)}</g>`).join('')],
         ['c3', 'En la etiqueta, mira «hidratos de carbono, <b>de los cuales azúcares</b>».', etiqueta(40, 25, 150) + `<g data-sway="10 2">${lupa(105, 85, 90)}</g>`]]
          .map(([t, txt, ill], i) => `<div class="card" style="left:80px;right:80px;top:${370 + i * 250}px;height:225px" data-in="${t} right">` +
            `<svg class="a" style="left:0;top:-8px" width="240" height="240" viewBox="0 0 240 240">${ill}</svg>` +
            `<div class="a" style="left:220px;top:22px;width:52px;height:52px;border-radius:50%;background:${F};color:#fff;font-weight:800;font-size:30px;display:flex;align-items:center;justify-content:center">${i + 1}</div>` +
            `<div class="a" style="left:290px;right:40px;top:0;bottom:0;display:flex;align-items:center;font-size:34px;font-weight:600;line-height:1.3"><div>${txt}</div></div></div>`).join('') +
        foot('pauta posible', '<b>5 / 7</b>') },

    { dur: 6, cls: 'dark', voz: [['Moreno o blanco: mejor, poco.', 'Moreno o blanco: mejor, poco.'], ['Guárdalo para tu próxima compra.', 'Guárdalo para tu próxima compra.'], ['Y si quieres más guías y la app gratis,', 'Y si quieres más guías y la app gratis,'], ['entra en pauta posible punto es.', 'entra en pautaposible.es']],
      html: blobs(true) + brand(true) +
        svgLayer([[150, 470, 0.8, 0], [880, 380, 1.0, 1], [820, 960, 1.2, 0], [120, 1000, 1.4, 1]].map(([x, y, t, m], i) => `<g data-in="${t} pop"><g data-float="12 3 ${i * 0.25}">${terron(x, y, 70, m)}</g></g>`).join('')) +
        `<div class="title xl" style="top:300px;text-align:center;font-size:104px">${words('Moreno o blanco: mejor,', 0.3, 0.1)} <span class="w gold" data-in="c0+1.4 pop">poco.</span></div>` +
        `<div class="a" style="left:80px;right:80px;top:640px;text-align:center;font-size:40px;font-weight:600;opacity:.9" data-in="c2 fade">Más guías y la app gratis en</div>` +
        `<div class="a" style="left:0;right:0;top:730px;text-align:center" data-in="c3 pop"><span class="btn" data-pulse=".05 1.4" style="display:inline-block">pautaposible.es/aprende</span></div>` +
        `<div class="a" style="left:0;right:0;top:880px;text-align:center;font-size:34px;font-weight:700" data-in="c1 up"><span data-float="4 1.4" style="display:inline-block;vertical-align:middle"><svg width="26" height="30" viewBox="0 0 26 30"><path d="M3 2 H23 V28 L13 21 L3 28Z" fill="#D7A95B"/></svg></span> Guárdalo para tu próxima compra</div>` +
        foot('@pautaposible', '6 / 7') },
  ],
};

// ---------- Conversor automático: cualquier carrusel de carruseles.mjs → animado con narrador y subtítulos ----------
import { carruseles } from './carruseles.mjs';
import { ic } from '../../reels/_plantilla/ilustraciones.mjs';
const sinMd = (s) => s.replace(/\*\*/g, '');
// Lo que lee el narrador (números y símbolos dichos como se dicen)
const decir = (s) => sinMd(s).replace(/[«»]/g, '').replace(/(\d+)\s?g\b/g, '$1 gramos').replace(/°C/g, ' grados').replace(/(\d+)\s?%/g, '$1 por ciento')
  .replace(/(\d+)-(\d+)/g, '$1 o $2').replace(/½/g, 'medio').replace(/ · /g, ', ').replace(/pautaposible\.es(\/\w+)?/g, 'pauta posible punto es').replace(/\s+/g, ' ').trim();
// Trozos de voz de una frase larga: por oraciones y, si hace falta, por comas (≤ 75 caracteres)
function trozos(txt) {
  const out = [];
  sinMd(txt).split(/(?<=[.:?!])\s+/).forEach((o) => {
    if (o.length <= 75) return out.push(o);
    let cur = '';
    o.split(/(?<=,)\s+/).forEach((p) => { if (cur && (cur + ' ' + p).length > 75) { out.push(cur); cur = p; } else cur = cur ? cur + ' ' + p : p; });
    if (cur) out.push(cur);
  });
  return out.filter(Boolean);
}
const icono = (name, size, extra = '') => `<svg width="${size}" height="${size}" viewBox="0 0 100 100" style="overflow:visible${extra}">${ic(name, 0, 0, 100)}</svg>`;
const flota = (name, left, top, size, at, ph = 0) =>
  `<div class="a" style="left:${left}px;top:${top}px" data-in="${at} pop"><div data-float="10 2.8 ${ph}">${icono(name, size)}</div></div>`;

function animarDiapositiva(s, i, n, iconos) {
  const num = `${i + 1} / ${n}`;
  const voz = []; const cue = (txt) => { const c = voz.length; trozos(txt).forEach((t) => voz.push([decir(t), t])); return `c${c}`; };
  if (s.type === 'portada') {
    cue(s.title); const cs = cue(s.sub);
    const pos = [[90, 760, 180], [330, 830, 150], [560, 760, 190], [800, 840, 150], [450, 1000, 130]];
    return { dur: 5, cls: 'dark', voz, html: blobs(true) + brand(true) + kick(s.tag, 0.15) +
      `<div class="title xl" style="font-size:${s.title.length > 45 ? 84 : 96}px">${words(s.title, 0.35, 0.08)}</div>` +
      `<div class="a" style="left:80px;right:80px;top:600px;font-size:40px;font-weight:600;opacity:.92" data-in="${cs} fade">${sinMd(s.sub)}</div>` +
      iconos.slice(0, 5).map((k, j) => flota(k, pos[j][0], pos[j][1], pos[j][2], (0.9 + j * 0.18).toFixed(2), j * 0.2)).join('') +
      foot('@pautaposible', 'Desliza →', ' data-nudge="14 1.2" style="display:inline-block"') };
  }
  if (s.type === 'cierre') {
    cue(s.title); const cf = cue(s.foot + '.'); const cu = voz.length;
    voz.push(['Y si quieres más recetas y la app gratis, entra en pauta posible punto es.', 'Más recetas y la app gratis en pautaposible.es']);
    return { dur: 5, cls: 'dark', voz, html: blobs(true) + brand(true) +
      iconos.slice(0, 4).map((k, j) => flota(k, [90, 860, 830, 100][j], [150, 170, 990, 1000][j], 120, (0.8 + j * 0.2).toFixed(2), j * 0.25)).join('') +
      `<div class="title xl" style="top:300px;text-align:center;font-size:${s.title.length > 35 ? 84 : 100}px">${words(s.title, 0.3, 0.09)}</div>` +
      `<div class="a" style="left:80px;right:80px;top:660px;text-align:center;font-size:40px;font-weight:600;opacity:.9" data-in="1.5 fade">${sinMd(s.sub)}</div>` +
      `<div class="a" style="left:0;right:0;top:760px;text-align:center" data-in="c${cu} pop"><span class="btn" data-pulse=".05 1.4" style="display:inline-block">${s.url}</span></div>` +
      `<div class="a" style="left:0;right:0;top:910px;text-align:center;font-size:34px;font-weight:700" data-in="${cf} up"><span data-float="4 1.4" style="display:inline-block;vertical-align:middle"><svg width="26" height="30" viewBox="0 0 26 30"><path d="M3 2 H23 V28 L13 21 L3 28Z" fill="#D7A95B"/></svg></span> ${sinMd(s.foot)}</div>` +
      foot('@pautaposible', num) };
  }
  // texto
  let body = '';
  cue(s.title);
  const nItems = (s.steps || []).length + (s.checks || []).length;
  const fs = nItems > 5 ? 38 : 42;
  if (s.p) body += `<div style="font-size:${fs + 1}px;font-weight:600;line-height:1.35" data-in="${cue(s.p)} up">${md(s.p)}</div>`;
  if (s.steps) body += s.steps.map((st, k) => `<div class="card" style="position:relative;padding:22px 28px 22px 100px;font-size:${fs}px;font-weight:600;line-height:1.3" data-in="${cue(st)} right">` +
    `<span style="position:absolute;left:26px;top:50%;margin-top:-27px;width:54px;height:54px;border-radius:50%;background:${F};color:#fff;font-weight:800;font-size:30px;display:flex;align-items:center;justify-content:center">${(s.start || 1) + k}</span>${md(st)}</div>`).join('');
  if (s.checks) body += `<div style="display:flex;flex-direction:column;gap:${nItems > 5 ? 10 : 16}px">` + s.checks.map((ck) =>
    `<div style="display:flex;align-items:center;gap:22px;font-size:${fs}px;font-weight:600" data-in="${cue(ck)} left"><svg width="52" height="52" viewBox="0 0 46 46" style="flex:none"><circle cx="23" cy="23" r="21" fill="${F}"/><path d="M13 24 L20 31 L33 16" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg><span>${md(ck)}</span></div>`).join('') + `</div>`;
  if (s.chips) { const cc = cue(s.chips.join(', ') + '.'); body += `<div style="display:flex;gap:18px;flex-wrap:wrap">` + s.chips.map((c, k) => `<span style="background:${M};color:${F};border-radius:999px;padding:16px 34px;font-weight:800;font-size:40px" data-in="${cc}+${(k * 0.35).toFixed(2)} pop">${c}</span>`).join('') + `</div>`; }
  if (s.box) body += `<div style="border-radius:30px;background:${M};padding:24px 32px;font-size:${fs - 1}px;font-weight:600;line-height:1.32" data-in="${cue(s.box)} up">${md(s.box).replace(/<b>/g, `<b style="color:${F}">`)}</div>`;
  if (s.p2) body += `<div style="font-size:${fs - 2}px;font-weight:600;line-height:1.35;opacity:.9" data-in="${cue(s.p2)} up">${md(s.p2)}</div>`;
  const k1 = iconos[(i * 2) % iconos.length];
  return { dur: 5, cls: 'light', voz, html: blobs(false).replace(/<div class="blob" data-pulse[^>]*><\/div>/, '') + brand(false) + kick(s.kicker) +
    `<div class="a" style="right:70px;top:36px" data-in="0.5 pop"><div data-float="8 2.6" data-sway="6 3.2">${icono(k1, 120)}</div></div>` +
    `<div class="a" style="left:80px;right:80px;top:225px;bottom:228px;display:flex;flex-direction:column;gap:${nItems > 5 ? 26 : 34}px">` +
    `<div style="font-weight:800;font-size:${s.title.length > 40 ? 70 : 80}px;line-height:1.05;letter-spacing:-1.5px">${words(s.title, 0.3, 0.08)}</div>${body}</div>` +
    foot('pauta posible', `<b>${num}</b>`) };
}
export function desdeCarrusel(key, iconos) {
  const sl = carruseles[key].slides; const n = sl.length;
  return sl.filter((s) => s.type !== 'final').map((s, i) => animarDiapositiva(s, i, n, iconos));
}
Object.assign(animados, {
  'legumbres-bote': desdeCarrusel('legumbres-bote', ['jar', 'bowlBeans', 'colander', 'beans', 'drop']),
  'merluza-bandeja': desdeCarrusel('merluza-bandeja', ['fish', 'potato', 'carrot', 'tomato', 'leaf']),
  'lista-compra': desdeCarrusel('lista-compra', ['basket', 'carrot', 'egg', 'bread', 'fish']),
  'arroz-salteado': desdeCarrusel('arroz-salteado', ['rice', 'egg', 'carrot', 'broccoli', 'ladle']),
  'batch-cooking': desdeCarrusel('batch-cooking', ['clock', 'rice', 'egg', 'broccoli', 'beans']),
  'suplementos-1': desdeCarrusel('suplementos-1', ['pillBottle', 'pill', 'orange', 'fish', 'leaf']),
  'ketchup-casero': desdeCarrusel('ketchup-casero', ['ketchup', 'tomato', 'jar', 'ladle', 'salt']),
});
