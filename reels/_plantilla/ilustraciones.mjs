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
  jar: `<rect x="26" y="8" width="48" height="14" rx="5" fill="${G}"/><path d="M28 22 H72 V28 C80 32 84 38 84 46 V84 C84 91 79 96 72 96 H28 C21 96 16 91 16 84 V46 C16 38 20 32 28 28Z" fill="#EEF6F1" stroke="#B7D3C2" stroke-width="3"/>
    <path d="M19 52 H81 V84 C81 89 77 93 72 93 H28 C23 93 19 89 19 84Z" fill="#F3E3C0"/>
    <g fill="#D8AE63"><circle cx="30" cy="62" r="7"/><circle cx="44" cy="60" r="7"/><circle cx="58" cy="63" r="7"/><circle cx="71" cy="60" r="7"/><circle cx="36" cy="74" r="7"/><circle cx="50" cy="72" r="7"/><circle cx="64" cy="75" r="7"/><circle cx="29" cy="86" r="6"/><circle cx="43" cy="86" r="7"/><circle cx="57" cy="87" r="7"/><circle cx="71" cy="86" r="6"/></g>
    <path d="M25 36 V80" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/>`,
  bowlBeans: `<g stroke="#B9C4BC" stroke-width="4" fill="none" stroke-linecap="round"><path d="M36 26 C30 20 42 14 36 6"/><path d="M52 26 C46 20 58 14 52 6"/><path d="M68 26 C62 20 74 14 68 6"/></g>
    <g fill="#D8AE63"><circle cx="24" cy="46" r="8"/><circle cx="38" cy="40" r="8"/><circle cx="52" cy="38" r="8"/><circle cx="66" cy="40" r="8"/><circle cx="78" cy="46" r="8"/><circle cx="45" cy="47" r="7"/><circle cx="60" cy="47" r="7"/></g>
    <path d="M8 48 H92 C92 74 74 92 50 92 C26 92 8 74 8 48Z" fill="${F}"/><path d="M20 60 C24 72 32 80 42 84" stroke="#4E8C72" stroke-width="5" fill="none" stroke-linecap="round"/>`,
  salt: `<path d="M34 34 C34 18 66 18 66 34Z" fill="#B9C4BC"/><g fill="#7D8A82"><circle cx="44" cy="27" r="2.5"/><circle cx="50" cy="24" r="2.5"/><circle cx="56" cy="27" r="2.5"/></g>
    <path d="M32 34 H68 L74 88 C74 92 71 95 67 95 H33 C29 95 26 92 26 88Z" fill="#fff" stroke="#C9D2CC" stroke-width="3"/>
    <text x="50" y="72" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="18" fill="${CH}">SAL</text>`,
  colander: `<rect x="2" y="38" width="16" height="9" rx="4.5" fill="${F}"/><rect x="82" y="38" width="16" height="9" rx="4.5" fill="${F}"/>
    <g fill="#D8AE63"><circle cx="26" cy="40" r="8"/><circle cx="39" cy="35" r="8"/><circle cx="52" cy="33" r="8"/><circle cx="65" cy="35" r="8"/><circle cx="76" cy="40" r="7"/></g>
    <path d="M10 42 H90 C90 68 72 84 50 84 C28 84 10 68 10 42Z" fill="${F}"/>
    <g fill="${M}"><circle cx="28" cy="54" r="3"/><circle cx="41" cy="56" r="3"/><circle cx="54" cy="56" r="3"/><circle cx="67" cy="54" r="3"/><circle cx="35" cy="66" r="3"/><circle cx="48" cy="68" r="3"/><circle cx="61" cy="66" r="3"/><circle cx="48" cy="78" r="3"/></g>
    <path d="M36 84 L32 94 H68 L64 84Z" fill="${F}"/>`,
  drop: `<path d="M50 8 C64 30 76 44 76 62 C76 78 64 90 50 90 C36 90 24 78 24 62 C24 44 36 30 50 8Z" fill="#8EC5D6"/><path d="M38 62 C38 54 42 48 46 44" stroke="#D3ECF3" stroke-width="6" fill="none" stroke-linecap="round"/>`,
  tap: `<rect x="22" y="4" width="28" height="8" rx="4" fill="#9AA79F"/><rect x="30" y="10" width="12" height="12" rx="3" fill="#9AA79F"/>
    <path d="M6 20 H60 C72 20 80 28 80 40 V50 H66 V40 C66 36 64 34 60 34 H6Z" fill="#B9C4BC"/>`,
  basket: `<path d="M24 42 C24 12 76 12 76 42" stroke="${F}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M6 40 H94 L84 88 C83 93 79 96 74 96 H26 C21 96 17 93 16 88Z" fill="${G}"/>
    <g stroke="#B98A3E" stroke-width="4"><path d="M10 56 H90"/><path d="M14 72 H86"/><path d="M34 40 L36 96"/><path d="M50 40 V96"/><path d="M66 40 L64 96"/></g>`,
  sack: `<g fill="#C79A55"><circle cx="40" cy="18" r="5"/><circle cx="50" cy="14" r="5"/><circle cx="60" cy="18" r="5"/></g>
    <path d="M30 28 C18 40 12 60 16 78 C18 90 28 96 40 96 H60 C72 96 82 90 84 78 C88 60 82 40 70 28Z" fill="#EBDDBF"/>
    <rect x="27" y="24" width="46" height="8" rx="4" fill="#B98A3E"/><rect x="28" y="54" width="44" height="24" rx="5" fill="#fff" opacity=".9"/>
    <text x="50" y="71" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="13" fill="${CH}">SECAS</text>`,
  toast: `<path d="M10 92 V40 C10 14 34 8 50 16 C66 8 90 14 90 40 V92Z" fill="${G}"/><path d="M18 86 V42 C18 24 36 20 50 26 C64 20 82 24 82 42 V86Z" fill="#EBC98C"/>
    <path d="M22 46 C40 38 60 38 78 46 V74 C60 82 40 82 22 74Z" fill="#D9634C" opacity=".9"/><g fill="#B9A23A"><ellipse cx="38" cy="54" rx="7" ry="4"/><ellipse cx="62" cy="64" rx="8" ry="4"/></g>`,
  oil: `<rect x="40" y="4" width="20" height="12" rx="3" fill="${F}"/><path d="M42 16 H58 V28 C72 34 78 44 78 58 V88 C78 93 74 96 69 96 H31 C26 96 22 93 22 88 V58 C22 44 28 34 42 28Z" fill="#C9B54A"/>
    <rect x="30" y="56" width="40" height="26" rx="5" fill="#fff" opacity=".9"/><path d="M44 62 C40 70 46 76 50 76 C54 76 60 70 56 62 C54 58 50 56 50 56 C50 56 46 58 44 62Z" fill="${S}"/>`,
  orange: `<circle cx="50" cy="56" r="38" fill="#E8963A"/><circle cx="50" cy="56" r="38" fill="none" stroke="#C97A26" stroke-width="4"/><path d="M50 18 C52 10 58 6 64 4" stroke="#6b4a2b" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M54 14 C66 2 80 6 86 12 C76 20 64 20 54 14Z" fill="${S}"/><ellipse cx="36" cy="44" rx="8" ry="12" fill="#fff" opacity=".25"/>`,
  milk: `<path d="M20 6 H80 L72 96 H28Z" fill="#fff" stroke="#B7D3C2" stroke-width="4" stroke-linejoin="round"/><path d="M24 26 H76 L70 92 H30Z" fill="#F4F1E8"/><path d="M24 26 H76" stroke="#E4E0D3" stroke-width="3"/>
    <path d="M36 36 V80" stroke="#fff" stroke-width="6" stroke-linecap="round"/>`,
  sandwich: `<rect x="4" y="26" width="92" height="52" rx="26" fill="${G}"/><rect x="10" y="46" width="80" height="12" rx="6" fill="#fff"/>
    <g stroke="#B98A3E" stroke-width="4" stroke-linecap="round"><path d="M28 34 L36 28"/><path d="M48 34 L56 28"/><path d="M68 34 L76 28"/></g>`,
  yogurt: `<path d="M8 44 H92 C92 72 74 92 50 92 C26 92 8 72 8 44Z" fill="#fff" stroke="${F}" stroke-width="4"/><ellipse cx="50" cy="44" rx="42" ry="10" fill="#FAFAF7" stroke="${F}" stroke-width="4"/>
    <g fill="#F3E3A0" stroke="#D9C36A" stroke-width="2"><circle cx="30" cy="42" r="7"/><circle cx="48" cy="38" r="7"/><circle cx="64" cy="43" r="7"/></g><g fill="#8B5E34"><ellipse cx="76" cy="38" rx="7" ry="5"/><ellipse cx="40" cy="47" rx="6" ry="4"/></g>`,
  banana: `<path d="M10 30 C14 70 50 92 90 72 C92 68 90 64 86 64 C56 74 30 60 22 28 C20 22 10 22 10 30Z" fill="#F2CF4A"/><path d="M22 34 C30 58 52 70 80 68" stroke="#D9AF2C" stroke-width="3" fill="none"/>
    <path d="M8 26 L14 16 L20 24Z" fill="#6b4a2b"/>`,
  walnut: `<path d="M50 10 C74 10 90 28 90 52 C90 76 72 92 50 92 C28 92 10 76 10 52 C10 28 26 10 50 10Z" fill="#B07A44"/><path d="M50 12 V90" stroke="#7E5229" stroke-width="4"/>
    <g stroke="#7E5229" stroke-width="3" fill="none" stroke-linecap="round"><path d="M24 34 C32 40 30 50 22 54"/><path d="M76 34 C68 40 70 50 78 54"/><path d="M28 66 C36 70 38 78 34 84"/><path d="M72 66 C64 70 62 78 66 84"/></g>`,
  phone: `<rect x="22" y="2" width="56" height="96" rx="11" fill="${CH}"/><rect x="27" y="11" width="46" height="76" rx="5" fill="#fff"/>
    <rect x="31" y="15" width="38" height="26" rx="4" fill="${M}"/><path d="M38 28 H62 C62 35 57 39 50 39 C43 39 38 35 38 28Z" fill="${F}"/><g fill="#D8AE63"><circle cx="44" cy="27" r="3"/><circle cx="50" cy="25" r="3"/><circle cx="56" cy="27" r="3"/></g>
    <rect x="31" y="46" width="30" height="5" rx="2.5" fill="${CH}"/><rect x="31" y="56" width="38" height="4" rx="2" fill="#C9D2CC"/><rect x="31" y="64" width="34" height="4" rx="2" fill="#C9D2CC"/>
    <rect x="31" y="74" width="38" height="9" rx="4.5" fill="${F}"/><rect x="42" y="91" width="16" height="3" rx="1.5" fill="#55665B"/>`,
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

// ---------- Reel martes 13/10: ¿Las legumbres de bote son peores que las secas? ----------
const pill = (x, y, w, txt, at, bg = '#fff', col = CH, size = 42) =>
  `<g data-at="${at}" opacity="0"><rect x="${x}" y="${y}" width="${w}" height="96" rx="48" fill="${bg}"/>` + label(x + w / 2, y + 62, txt, undefined, col, size) + `</g>`;
export function legumbresBote() {
  return [
    { start: 0, end: 6.6, pan: 1, tag: 'Las mismas legumbres', svg: svg(
        ic('jar', 110, 90, 300) + label(260, 470, 'De bote', undefined, F, 42) +
        label(480, 330, '=', 3.1, F, 140) +
        ic('bowlBeans', 560, 120, 280, 4.8) + label(700, 470, 'Cocidas en casa', 4.8, F, 42)) },
    { start: 6.6, end: 10.1, pan: -1, tag: 'Casi todo se conserva', svg: svg(
        ic('jar', 90, 120, 300) +
        `<g data-at="8.1" opacity="0"><rect x="450" y="90" width="430" height="96" rx="48" fill="#fff"/>${ic('check', 466, 102, 72)}${label(690, 152, 'Proteína', undefined, CH, 42)}</g>` +
        `<g data-at="8.75" opacity="0"><rect x="450" y="220" width="430" height="96" rx="48" fill="#fff"/>${ic('check', 466, 232, 72)}${label(690, 282, 'Fibra', undefined, CH, 42)}</g>` +
        `<g data-at="9.4" opacity="0"><rect x="450" y="350" width="430" height="96" rx="48" fill="#fff"/>${ic('check', 466, 362, 72)}${label(690, 412, 'Minerales', undefined, CH, 42)}</g>`, '#DCE9E1') },
    { start: 10.1, end: 13.0, pan: 1, tag: 'Lo único que cambia: la sal', svg: svg(
        ic('jar', 200, 100, 320) + ic('salt', 600, 120, 230, 11.3) +
        `<g data-at="11.6" opacity="0" fill="#fff" stroke="#C9D2CC" stroke-width="2"><rect x="640" y="380" width="10" height="10" rx="2"/><rect x="690" y="410" width="10" height="10" rx="2"/><rect x="740" y="390" width="10" height="10" rx="2"/><rect x="665" y="450" width="10" height="10" rx="2"/><rect x="720" y="470" width="10" height="10" rx="2"/></g>`) },
    { start: 13.0, end: 18.3, pan: -1, tag: 'Escurre y enjuaga', svg: svg(
        ic('colander', 520, 220, 320) + ic('tap', 540, 10, 200, 14.6) +
        ic('drop', 666, 140, 40, 14.85) + ic('drop', 680, 195, 40, 15.0) + ic('drop', 662, 250, 40, 15.15) +
        label(250, 300, '−40 %', 16.4, F, 120) + label(250, 380, 'de sal añadida', 16.5, CH, 40)) },
    { start: 18.3, end: 24.1, pan: 1, tag: 'Para tu próxima compra', svg: svg(
        ic('jar', 200, 95, 150, 18.5) + ic('basket', 110, 130, 330, 18.4) +
        ic('sack', 600, 170, 260, 21.6) + label(480, 100, '¿Bote o secas?', 22.8, F, 54), '#DCE9E1') },
    { start: 24.1, end: 99, pan: -1, tag: 'Recetas con legumbres', svg: svg(
        ic('phone', 90, 50, 440, 24.2) +
        pill(500, 140, 420, 'pautaposible.es', 25.6, '#fff', F, 44) +
        label(710, 320, 'Sección de recetas', 27.6, CH, 40) +
        pill(560, 380, 300, 'App gratis', 29.4, G, CH, 44)) },
  ];
}

export function desayunos() {
  return [
    { start: 0, end: 4.88, pan: 1, tag: '3 desayunos en 3 minutos', svg: svg(
        ic('clock', 380, 90, 200, 2.6) + label(480, 380, '3 minutos', 4.2, F, 64) +
        ic('toast', 190, 410, 130, 3.3) + ic('milk', 415, 410, 130, 3.5) + ic('yogurt', 640, 410, 130, 3.7)) },
    { start: 4.88, end: 10.48, pan: -1, tag: 'Desayuno 1', svg: svg(
        ic('toast', 100, 70, 300, 5.1) + label(250, 420, 'Tosta integral', 5.6, CH, 40) +
        ic('oil', 470, 100, 180, 6.2) + label(560, 330, 'Aceite y tomate', 7.2, CH, 36) +
        ic('orange', 700, 110, 180, 8.1) + label(790, 330, '+ fruta', 8.4, F, 40) +
        label(480, 510, 'Y la fruta, para el camino', 9.4, F, 44), '#DCE9E1') },
    { start: 10.48, end: 15.12, pan: 1, tag: 'Desayuno 2', svg: svg(
        ic('milk', 140, 70, 280, 10.7) + label(280, 410, 'Vaso de leche', 11.0, CH, 40) +
        ic('sandwich', 510, 90, 340, 11.5) + label(680, 410, 'Bocadillo de queso fresco', 12.5, CH, 36) +
        label(480, 510, 'Para llevar', 13.6, F, 44)) },
    { start: 15.12, end: 17.52, pan: -1, tag: 'Desayuno 3', svg: svg(
        ic('yogurt', 100, 90, 340, 15.3) + label(270, 470, 'Yogur natural', 15.8, CH, 40) +
        ic('walnut', 590, 60, 140, 16.2) + label(660, 240, 'Nueces', 16.3, CH, 38) +
        ic('banana', 570, 270, 190, 16.9) + label(665, 500, 'Plátano', 17.0, CH, 38), '#DCE9E1') },
    { start: 17.52, end: 22.0, pan: 1, tag: 'Guárdalo para mañana', svg: svg(
        ic('sun', 380, 80, 200, 17.6) + label(480, 380, 'Mañana, en 3 minutos', 18.1, F, 56) +
        ic('toast', 190, 410, 130, 19.4) + ic('milk', 415, 410, 130, 19.6) + ic('yogurt', 640, 410, 130, 19.8)) },
    { start: 22.0, end: 99, pan: -1, tag: 'Recetas y app gratis', svg: svg(
        ic('phone', 90, 50, 440, 22.1) +
        pill(500, 140, 420, 'pautaposible.es', 22.5, '#fff', F, 44) +
        pill(560, 290, 300, 'App gratis', 24.2, G, CH, 44) +
        label(710, 480, 'Cocina con lo que', 25.9, CH, 40) + label(710, 530, 'tienes en la nevera', 26.0, CH, 40), '#DCE9E1') },
  ];
}
