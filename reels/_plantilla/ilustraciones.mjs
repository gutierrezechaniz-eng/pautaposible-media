// Ilustraciones propias (SVG) para los reels con voz. Lienzo 960×700 (tarjeta superior).
// Cada elemento con data-at aparece en ese segundo de la voz; data-pop="cx cy" le da un pequeño rebote.
const F = '#2E6F57', CR = '#FAFAF7', M = '#DDEEDF', S = '#6FA67A', G = '#D7A95B', CH = '#24322A';

const icons = {
  rice: `<path d="M8 52 H92 A42 38 0 0 1 8 52Z" fill="${F}"/><path d="M14 53 C18 26 82 26 86 53Z" fill="#fff" stroke="#E4E0D3" stroke-width="2"/>
    <g fill="#E9E4D6"><ellipse cx="35" cy="42" rx="4" ry="2"/><ellipse cx="50" cy="36" rx="4" ry="2"/><ellipse cx="62" cy="44" rx="4" ry="2"/><ellipse cx="45" cy="47" rx="4" ry="2"/><ellipse cx="70" cy="38" rx="3.5" ry="2"/></g>
    <path d="M30 70 H70" stroke="${S}" stroke-width="5" stroke-linecap="round" opacity=".6"/>`,
  broccoli: `<path d="M44 58 L40 92 H60 L56 58Z" fill="#8DBF7A"/><g fill="#3F8A5A"><circle cx="30" cy="42" r="18"/><circle cx="50" cy="28" r="20"/><circle cx="70" cy="42" r="18"/><circle cx="50" cy="50" r="18"/></g>
    <g fill="#2F7049"><circle cx="40" cy="30" r="5"/><circle cx="60" cy="38" r="5"/><circle cx="30" cy="46" r="4"/><circle cx="52" cy="52" r="4"/></g>`,
  carrot: `<path d="M34 30 C46 24 60 30 62 40 L30 94 C26 98 20 94 22 88Z" fill="#E8964A"/><g stroke="#C9772F" stroke-width="3" stroke-linecap="round"><path d="M38 50 L46 53"/><path d="M33 64 L40 66"/><path d="M28 78 L34 79"/></g>
    <g fill="${S}"><path d="M52 30 C50 12 58 6 64 4 C62 14 60 22 56 32Z"/><path d="M56 34 C66 22 78 22 84 24 C76 30 68 34 58 38Z"/></g>`,
  tomato: `<circle cx="50" cy="56" r="36" fill="#D9634C"/><path d="M32 46 C36 38 44 34 50 34" stroke="#F09A86" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M50 22 L55 32 L67 30 L58 38 L64 46 L50 41 L36 46 L42 38 L33 30 L45 32Z" fill="${S}"/>`,
  leaf: `<path d="M18 82 C14 40 46 14 86 14 C88 56 60 86 18 82Z" fill="#8DBF7A"/><path d="M22 78 C44 58 60 40 80 20" stroke="#5C9A5E" stroke-width="4" fill="none"/>`,
  egg: `<path d="M16 54 C8 30 36 14 56 22 C80 12 96 36 86 56 C94 78 66 92 48 84 C26 94 6 76 16 54Z" fill="#fff" stroke="#E4E0D3" stroke-width="2"/><circle cx="52" cy="52" r="17" fill="${G}"/><circle cx="46" cy="46" r="5" fill="#EFCB8A"/>`,
  fish: `<path d="M14 50 C28 28 60 26 76 50 C60 74 28 72 14 50Z" fill="#7FA9B8"/><path d="M74 50 L94 32 L90 50 L94 68Z" fill="#6A95A5"/><circle cx="30" cy="46" r="4" fill="${CH}"/>
    <path d="M44 38 C50 44 50 56 44 62" stroke="#9FC3CF" stroke-width="4" fill="none"/>`,
  meat: `<path d="M20 40 C22 20 60 14 78 28 C94 40 88 70 66 78 C44 86 16 72 20 40Z" fill="#B5654A"/><path d="M26 42 C30 28 58 22 72 32 C84 42 80 62 64 68" stroke="#F3E3D6" stroke-width="7" fill="none" stroke-linecap="round"/>
    <circle cx="50" cy="50" r="8" fill="#F3E3D6"/>`,
  beans: `<g fill="#9A5B3F"><path d="M20 40 C14 26 34 18 42 28 C48 34 40 38 44 46 C48 58 26 58 20 40Z"/><path d="M52 58 C46 44 66 36 74 46 C80 52 72 56 76 64 C80 76 58 76 52 58Z"/><path d="M40 76 C34 62 54 54 62 64 C68 70 60 74 64 82 C68 94 46 94 40 76Z" fill="#B87150"/><path d="M60 22 C54 8 74 2 80 12 C86 18 78 22 82 30 C86 42 66 40 60 22Z" fill="#B87150"/></g>`,
  bread: `<path d="M12 56 C8 34 30 22 50 22 C70 22 92 34 88 56 L84 84 H16Z" fill="${G}"/><path d="M16 60 C14 42 32 32 50 32 C68 32 86 42 84 60 L80 80 H20Z" fill="#E9C68A"/>
    <g stroke="#B98A3E" stroke-width="4" stroke-linecap="round"><path d="M34 44 L42 36"/><path d="M48 44 L56 36"/><path d="M62 44 L70 36"/></g>`,
  pasta: `<path d="M8 50 H92 A42 36 0 0 1 8 50Z" fill="${S}"/><g stroke="#EFCB8A" stroke-width="5" fill="none" stroke-linecap="round"><path d="M20 50 C26 30 40 44 46 30 C52 18 62 40 70 28 C76 20 82 36 82 50"/><path d="M28 50 C34 38 48 50 54 38 C60 30 66 46 74 40"/></g>
    <circle cx="44" cy="40" r="5" fill="#D9634C"/><circle cx="64" cy="36" r="4" fill="#D9634C"/>`,
  potato: `<path d="M16 50 C12 28 40 18 60 22 C84 26 94 48 84 66 C74 84 40 86 24 74 C18 68 18 60 16 50Z" fill="#C9A36B"/><g fill="#A9834D"><circle cx="36" cy="44" r="3"/><circle cx="60" cy="38" r="3"/><circle cx="70" cy="62" r="3"/><circle cx="44" cy="66" r="3"/></g>`,
  moon: `<path d="M64 14 C40 16 22 34 22 56 C22 78 42 94 64 90 C46 82 38 66 38 52 C38 36 48 22 64 14Z" fill="${G}"/>`,
  sun: `<circle cx="50" cy="50" r="22" fill="${G}"/><g stroke="${G}" stroke-width="6" stroke-linecap="round"><path d="M50 8 V18"/><path d="M50 82 V92"/><path d="M8 50 H18"/><path d="M82 50 H92"/><path d="M20 20 L27 27"/><path d="M73 73 L80 80"/><path d="M80 20 L73 27"/><path d="M27 73 L20 80"/></g>`,
  star: `<path d="M50 14 L58 42 L86 50 L58 58 L50 86 L42 58 L14 50 L42 42Z" fill="${G}"/>`,
  flame: `<path d="M50 6 C58 26 80 36 80 62 C80 82 66 94 50 94 C34 94 20 82 20 62 C20 46 30 38 36 28 C38 40 44 44 48 44 C46 30 44 18 50 6Z" fill="${G}"/>
    <path d="M50 50 C56 60 66 64 66 76 C66 86 58 92 50 92 C42 92 34 86 34 76 C34 66 44 62 50 50Z" fill="#F3D9A4"/>`,
  clock: `<circle cx="50" cy="50" r="42" fill="#fff" stroke="${CH}" stroke-width="6"/><path d="M50 50 V24 M50 50 L68 60" stroke="${CH}" stroke-width="6" stroke-linecap="round"/><circle cx="50" cy="50" r="5" fill="${F}"/>`,
  ladle: `<path d="M50 8 C54 8 56 12 56 16 L56 52" stroke="${F}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M22 54 H80 C80 74 68 88 51 88 C34 88 22 74 22 54Z" fill="${F}"/><path d="M30 58 H72 C70 68 62 76 51 76 C40 76 32 68 30 58Z" fill="#fff"/>`,
  check: `<circle cx="50" cy="50" r="42" fill="${F}"/><path d="M30 52 L44 66 L72 36" stroke="#fff" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  fork: `<g fill="#B9C4BC"><rect x="44" y="40" width="10" height="56" rx="5"/><rect x="36" y="4" width="6" height="40" rx="3"/><rect x="46" y="4" width="6" height="40" rx="3"/><rect x="56" y="4" width="6" height="40" rx="3"/><path d="M34 34 H64 V44 C64 52 34 52 34 44Z"/></g>`,
  knife: `<g fill="#B9C4BC"><rect x="44" y="52" width="12" height="44" rx="6"/><path d="M44 56 V10 C44 4 62 8 62 30 C62 46 56 54 56 56Z"/></g>`,
};

// Icono colocado en (x, y) con tamaño `sz` px; aparece en `at` segundos (opcional).
export function ic(name, x, y, sz, at) {
  const k = sz / 100, cx = x + sz / 2, cy = y + sz / 2;
  const a = at === undefined ? '' : ` data-at="${at}" data-pop="${cx} ${cy}" opacity="0"`;
  return `<g${a}><g transform="translate(${x} ${y}) scale(${k})">${icons[name]}</g></g>`;
}
export const svg = (inner, bg = M) => `<svg viewBox="0 0 960 700" xmlns="http://www.w3.org/2000/svg"><rect width="960" height="700" fill="${bg}"/>${inner}</svg>`;
const label = (x, y, txt, at, col = CH, size = 40) =>
  `<text x="${x}" y="${y}" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="${size}" fill="${col}"${at === undefined ? '' : ` data-at="${at}" opacity="0"`}>${txt}</text>`;

// Plato de 1/2 verdura, 1/4 proteína, 1/4 hidratos. show: {lines, v, p, h} → segundo en que aparece cada parte (o true = ya visible).
export function plate(cx, cy, r, show = {}) {
  const at = (v) => (v === true ? '' : v === undefined ? ' opacity="0" data-at="9999"' : ` opacity="0" data-at="${v}"`);
  const R = r - 18;
  return `<circle cx="${cx}" cy="${cy + 10}" r="${r}" fill="rgba(36,50,42,.08)"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff" stroke="#E7E3D8" stroke-width="4"/>
  <circle cx="${cx}" cy="${cy}" r="${R}" fill="#F4F2EC"/>
  <path${at(show.v)} d="M${cx},${cy} L${cx},${cy - R} A${R},${R} 0 0 1 ${cx},${cy + R} Z" fill="#CFE6CF"/>
  <path${at(show.p)} d="M${cx},${cy} L${cx - R},${cy} A${R},${R} 0 0 1 ${cx},${cy - R} Z" fill="#F3E1BE"/>
  <path${at(show.h)} d="M${cx},${cy} L${cx},${cy + R} A${R},${R} 0 0 1 ${cx - R},${cy} Z" fill="#E6EFE9"/>
  <g${at(show.lines)} stroke="${S}" stroke-width="6" stroke-dasharray="14 12" stroke-linecap="round"><path d="M${cx} ${cy - R} V${cy + R}"/><path d="M${cx - R} ${cy} H${cx}"/></g>`;
}

// ---------- Reel martes: ¿Cenar hidratos engorda? ----------
export function hidratosCena() {
  return [
    { start: 0, end: 3.6, pan: 1, svg: svg(
        ic('sun', 150, 170, 170) + ic('moon', 650, 160, 170) + ic('rice', 330, 190, 300) +
        label(235, 420, 'Mediodía', undefined, F) + label(735, 420, 'Cena', undefined, F) +
        `<path d="M300 520 Q480 600 660 520" stroke="${S}" stroke-width="6" fill="none" stroke-dasharray="12 12"/>`) },
    { start: 3.6, end: 9.4, pan: -1, tag: 'De noche también gastas energía', svg: svg(
        ic('moon', 120, 90, 190) + ic('star', 360, 90, 60, 3.9) + ic('star', 800, 120, 70, 4.2) + ic('star', 700, 330, 50, 4.5) + ic('star', 90, 380, 50, 4.8) +
        ic('clock', 380, 170, 220, 3.8) + ic('flame', 640, 150, 210, 7.9), '#DCE9E1') },
    { start: 9.4, end: 12.5, pan: 1, tag: 'El conjunto del día', svg: svg(
        `<path d="M110 300 H850" stroke="${S}" stroke-width="8" stroke-linecap="round"/>` +
        ic('sun', 60, 70, 120) + ic('moon', 790, 70, 120) +
        ic('egg', 110, 230, 140, 9.6) + ic('pasta', 300, 230, 140, 10.0) + ic('tomato', 490, 230, 140, 10.4) + ic('rice', 680, 230, 140, 10.8) +
        label(180, 430, 'Desayuno', 9.6, CH, 30) + label(370, 430, 'Comida', 10.0, CH, 30) + label(560, 430, 'Merienda', 10.4, CH, 30) + label(750, 430, 'Cena', 10.8, CH, 30)) },
    { start: 12.5, end: 18.9, pan: -1, svg: svg(
        ic('rice', 90, 130, 200, 12.6) + label(190, 390, 'Qué hidrato', 12.6, F, 38) +
        ic('ladle', 380, 120, 200, 13.8) + label(480, 390, 'Cuánto', 13.8, F, 38) +
        ic('broccoli', 650, 110, 130, 15.3) + ic('egg', 740, 190, 130, 16.9) + label(770, 390, 'Con qué', 15.3, F, 38) +
        `<g data-at="16.8" opacity="0"><rect x="530" y="430" width="400" height="80" rx="40" fill="${F}"/>` + label(730, 484, 'verdura + proteína', undefined, CR, 36) + `</g>`) },
    { start: 18.9, end: 99, pan: 1, tag: 'Arroz en la cena: sí', svg: svg(
        ic('moon', 90, 70, 150) + ic('star', 260, 60, 50) + ic('star', 820, 90, 60) +
        plate(480, 300, 230, { v: true, p: true, h: true }) +
        ic('broccoli', 490, 130, 120, 19.2) + ic('carrot', 600, 220, 110, 19.4) + ic('tomato', 500, 300, 110, 19.6) +
        ic('egg', 300, 120, 140, 19.8) + ic('rice', 290, 300, 160, 20.6) + ic('check', 780, 330, 110, 21.4), '#DCE9E1') },
  ];
}

// ---------- Reel jueves: Monta tu plato sin báscula ----------
export function platoSinBascula() {
  const cx = 480, cy = 330, r = 250;
  const base = (show) => ic('fork', 110, 180, 200) + ic('knife', 660, 180, 200) + plate(cx, cy, r, show);
  return [
    { start: 0, end: 3.3, pan: 1, svg: svg(base({}) + label(cx, 345, 'A ojo', 0.3, S, 56)) },
    { start: 3.3, end: 5.5, pan: -1, tag: 'Divide tu plato', svg: svg(base({ lines: 4.4 })) },
    { start: 5.5, end: 11.6, pan: 1, tag: '½ verduras y hortalizas', svg: svg(base({ lines: true, v: 5.6 }) +
        ic('broccoli', 510, 130, 130, 6.4) + ic('carrot', 620, 260, 120, 7.0) + ic('tomato', 500, 300, 120, 8.1) + ic('leaf', 540, 440, 110, 9.0)) },
    { start: 11.6, end: 16.3, pan: -1, tag: '¼ proteína', svg: svg(base({ lines: true, v: true, p: 11.8 }) +
        ic('broccoli', 510, 130, 130) + ic('carrot', 620, 260, 120) + ic('tomato', 500, 300, 120) + ic('leaf', 540, 440, 110) +
        ic('beans', 290, 130, 110, 13.4) + ic('egg', 380, 210, 90, 14.3) + ic('fish', 270, 250, 110, 14.9) + ic('meat', 340, 110, 80, 15.6)) },
    { start: 16.3, end: 22.0, pan: 1, tag: '¼ hidratos', svg: svg(base({ lines: true, v: true, p: true, h: 17.4 }) +
        ic('broccoli', 510, 130, 130) + ic('carrot', 620, 260, 120) + ic('tomato', 500, 300, 120) + ic('leaf', 540, 440, 110) +
        ic('beans', 290, 130, 110) + ic('egg', 380, 210, 90) + ic('fish', 270, 250, 110) + ic('meat', 340, 110, 80) +
        ic('rice', 270, 360, 110, 18.2) + ic('pasta', 370, 360, 100, 18.7) + ic('bread', 300, 450, 90, 19.1) + ic('potato', 390, 450, 80, 19.5) +
        `<g data-at="20.1" opacity="0"><rect x="30" y="30" width="300" height="76" rx="38" fill="${G}"/>` + label(180, 82, 'Mejor integrales', undefined, CH, 32) + `</g>`) },
    { start: 22.0, end: 99, pan: -1, svg: svg(
        plate(cx, 300, 230, { lines: true, v: true, p: true, h: true }) +
        ic('broccoli', 505, 110, 120) + ic('carrot', 610, 230, 110) + ic('tomato', 500, 280, 110) + ic('leaf', 530, 400, 100) +
        ic('beans', 300, 120, 100) + ic('egg', 380, 200, 80) + ic('fish', 290, 230, 100) +
        ic('rice', 290, 330, 100) + ic('pasta', 380, 330, 90) + ic('bread', 310, 410, 80) +
        `<g data-at="24.0" opacity="0"><rect x="60" y="560" width="840" height="100" rx="50" fill="#fff"/>` +
        `<rect x="100" y="600" width="560" height="20" rx="10" fill="${M}"/><rect x="100" y="600" width="380" height="20" rx="10" fill="${S}"/><circle cx="480" cy="610" r="26" fill="${F}"/>` +
        label(780, 624, 'Ajusta', undefined, F, 40) + `</g>`) },
  ];
}
