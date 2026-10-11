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

export const animados = {
  'azucar-moreno': [
    { dur: 6, cls: 'dark', html: blobs(true) + brand(true) + kick('Mito o realidad', 0.15) +
        `<div class="title xl" style="font-size:88px">${words('¿El azúcar moreno es mejor que el blanco?', 0.35, 0.08)}</div>` +
        `<div class="a" style="left:80px;top:470px;font-size:40px;font-weight:600;opacity:.9" data-in="1.4 fade">Lo que cambia es el color, no mucho más.</div>` +
        svgLayer(
          `<g data-in="0.6 up">${bowl(300, 1150, 380, BLANCO)}</g><g data-in="0.75 up">${bowl(780, 1150, 380, MORENO)}</g>` +
          [[180, 0.9], [255, 1.05], [330, 1.2]].map(([x, t], i) => `<g data-in="${t} drop"><g data-float="6 2.4 ${i * 0.2}">${terron(x, 905 - (i % 2) * 22, 90, false)}</g></g>`).join('') +
          [[660, 1.0], [735, 1.15], [810, 1.3]].map(([x, t], i) => `<g data-in="${t} drop"><g data-float="6 2.4 ${0.5 + i * 0.2}">${terron(x, 905 - (i % 2) * 22, 90, true)}</g></g>`).join('') +
          `<g data-in="2.0 pop"><g data-pulse=".08 1.4"><circle cx="540" cy="760" r="78" fill="${G}"/><text x="540" y="788" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="76" fill="${CH}">VS</text></g></g>`) +
        `<div class="lbl" style="left:170px;width:300px;top:1170px;font-size:40px" data-in="2.3 up">Blanco</div><div class="lbl" style="left:610px;width:300px;top:1170px;font-size:40px" data-in="2.45 up">Moreno</div>` +
        foot('@pautaposible', 'Desliza →', ' data-nudge="14 1.2" style="display:inline-block"') },

    { dur: 6, cls: 'light', html: blobs(false) + brand(false) + kick('Respuesta corta') +
        `<div class="title">${words('No: los dos son casi todo **sacarosa.**', 0.3, 0.09)}</div>` +
        svgLayer(
          `<g data-in="0.9 pop"><g data-float="8 3">${terron(150, 470, 250, false)}</g></g>` +
          `<g data-in="1.1 pop"><g data-float="8 3 .5">${terron(680, 470, 250, true)}</g></g>` +
          `<g data-in="1.7 drop"><path d="M805 420 C790 445 790 462 805 470 C820 462 820 445 805 420Z" fill="#5A3B1E"/></g>` +
          `<g data-in="2.8 pop"><g data-pulse=".1 1.2"><text x="540" y="650" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="190" fill="${G}">≈</text></g></g>`) +
        `<div class="lbl" style="left:650px;width:340px;top:370px;font-size:30px;color:${MORENO2}" data-in="2.0 left">+ un poco de melaza</div>` +
        `<div class="lbl" style="left:125px;width:300px;top:780px;font-size:40px" data-in="1.2 up">Blanco</div><div class="lbl" style="left:655px;width:300px;top:780px;font-size:40px" data-in="1.4 up">Moreno</div>` +
        `<div class="lbl" style="left:125px;width:300px;top:835px;font-size:96px;color:${F}" data-in="1.3 fade"><span data-count="1.3 1.4 0 387">0</span></div>` +
        `<div class="lbl" style="left:655px;width:300px;top:835px;font-size:96px;color:${F}" data-in="1.5 fade"><span data-count="1.5 1.4 0 380">0</span></div>` +
        `<div class="lbl" style="left:0;width:1080px;top:960px;font-size:28px;font-weight:700;opacity:.65" data-in="2.2 fade">kcal por cada 100 g</div>` +
        `<div class="note" style="top:1035px" data-in="3.3 up">Aportan prácticamente <b>las mismas calorías</b>: unas 4 por cada gramo.</div>` +
        foot('pauta posible', '<b>2 / 7</b>') },

    { dur: 6, cls: 'light', html: blobs(false) + brand(false) + kick('Ojo con la etiqueta') +
        `<div class="title">${words('Muchos son azúcar blanco **con melaza.**', 0.3, 0.09)}</div>` +
        svgLayer(`<g data-in="0.8 pop"><g data-sway="2 3">${bolsa(380, 470, 320, 420)}</g></g>` +
          `<g data-in="1.2 left"><g data-mv="1.5 330 40 1.3">${lupa(140, 560, 200)}</g></g>`) +
        `<div class="a" style="left:0;width:1080px;top:925px;text-align:center" data-in="2.7 pop"><span style="display:inline-block;background:${CH};color:${CR};border-radius:999px;padding:16px 40px;font-weight:800;font-size:44px">blanco + melaza</span></div>` +
        pegatina(70, 470, '«Moreno»', 3.1, -8) + pegatina(740, 520, '«De caña»', 3.35, 7, S, '#fff') + pegatina(720, 790, '«Natural»', 3.6, -5, M, F) +
        `<div class="note" style="top:1040px" data-in="4.1 up">«Moreno», «de caña» o «natural» no quiere decir <b>más sano</b>.</div>` +
        foot('pauta posible', '<b>3 / 7</b>') },

    { dur: 6.5, cls: 'light', html: blobs(false) + brand(false) + kick('Lo que sí cuenta') +
        `<div class="title">${words('Cuánto tomas, **no de qué color** es.', 0.3, 0.09)}</div>` +
        `<div class="a" style="left:80px;top:420px;font-size:36px;font-weight:700" data-in="0.9 up">Lo ideal, según la OMS: menos de</div>` +
        `<div class="a" style="left:70px;top:455px;font-size:210px;font-weight:800;color:${F};letter-spacing:-6px" data-in="1.0 zoom"><span data-count="1.0 1.3 0 25">0</span> g</div>` +
        `<div class="a" style="left:560px;top:540px;font-size:52px;font-weight:800;line-height:1.1" data-in="2.2 left">al día, unas<br><span class="hl">6 cucharaditas</span></div>` +
        svgLayer([0, 1, 2, 3, 4, 5].map((i) => `<g data-in="${(2.5 + i * 0.18).toFixed(2)} drop"><g data-sway="6 2.2">${cucharita(95 + i * 150, 760, 150)}</g></g>`).join('')) +
        `<div class="note" style="top:960px" data-in="3.8 up">Contando el que <b>ya llevan los productos</b>: refrescos, galletas, cereales, salsas…</div>` +
        foot('pauta posible', '<b>4 / 7</b>') },

    { dur: 7, cls: 'light', html: blobs(false) + brand(false) + kick('Para tomar menos') +
        `<div class="title">${words('**3 trucos** fáciles.', 0.3, 0.1)}</div>` +
        [[0.7, 'Ve <b>reduciendo poco a poco</b> el azúcar del café: el paladar se acostumbra.', taza(40, 30, 150)],
         [1.7, 'Endulza el yogur natural con <b>fruta troceada</b> o canela.', yogur(40, 50, 150) +
            [[70, '#E8964A', 2.2], [110, RJ, 2.35], [150, G, 2.5]].map(([x, c, t]) => `<g data-in="${t} drop">${fruta(x, 48, 30, c)}</g>`).join('')],
         [2.7, 'En la etiqueta, mira «hidratos de carbono, <b>de los cuales azúcares</b>».', etiqueta(40, 25, 150) + `<g data-sway="10 2">${lupa(105, 85, 90)}</g>`]]
          .map(([t, txt, ill], i) => `<div class="card" style="left:80px;right:80px;top:${380 + i * 270}px;height:240px" data-in="${t} right">` +
            `<svg class="a" style="left:0;top:0" width="240" height="240" viewBox="0 0 240 240">${ill}</svg>` +
            `<div class="a" style="left:220px;top:22px;width:52px;height:52px;border-radius:50%;background:${F};color:#fff;font-weight:800;font-size:30px;display:flex;align-items:center;justify-content:center">${i + 1}</div>` +
            `<div class="a" style="left:290px;right:40px;top:0;bottom:0;display:flex;align-items:center;font-size:35px;font-weight:600;line-height:1.3"><div>${txt}</div></div></div>`).join('') +
        foot('pauta posible', '<b>5 / 7</b>') },

    { dur: 6, cls: 'dark', html: blobs(true) + brand(true) +
        svgLayer([[150, 470, 0.8, 0], [880, 380, 1.0, 1], [820, 960, 1.2, 0], [120, 1000, 1.4, 1]].map(([x, y, t, m], i) => `<g data-in="${t} pop"><g data-float="12 3 ${i * 0.25}">${terron(x, y, 70, m)}</g></g>`).join('')) +
        `<div class="title xl" style="top:300px;text-align:center;font-size:104px">${words('Moreno o blanco: mejor,', 0.3, 0.1)} <span class="w gold" data-in="0.9 pop">poco.</span></div>` +
        `<div class="a" style="left:80px;right:80px;top:640px;text-align:center;font-size:40px;font-weight:600;opacity:.9" data-in="1.6 fade">Más guías para entender lo que comes.</div>` +
        `<div class="a" style="left:0;right:0;top:760px;text-align:center" data-in="2.2 pop"><span class="btn" data-pulse=".05 1.4" style="display:inline-block">pautaposible.es/aprende</span></div>` +
        foot('<span data-float="4 1.4" style="display:inline-block;vertical-align:middle"><svg width="26" height="30" viewBox="0 0 26 30"><path d="M3 2 H23 V28 L13 21 L3 28Z" fill="#D7A95B"/></svg></span> Guárdalo para tu próxima compra', '6 / 7') },
  ],
};
