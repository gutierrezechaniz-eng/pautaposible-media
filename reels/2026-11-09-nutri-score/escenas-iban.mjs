// Diapositivas del reel del Nutri-Score con la voz de Iban.
// o = desfase del cuerpo en el reel; W = palabras de la voz del cuerpo ({w,s,e}, segundos del cuerpo).
// Los momentos se anclan a palabras del guion, así sirven para cualquier toma.
// La escala de letras es un dibujo propio (no el logotipo oficial).
const F = '#2E6F57', CR = '#FAFAF7', M = '#DDEEDF', G = '#D7A95B', CH = '#24322A';
const NS = { A: '#038141', B: '#85BB2F', C: '#FECB02', D: '#EE8100', E: '#E63E11' };
const txt = (x, y, s, size = 34, w = 800, fill = CH, anchor = 'middle', extra = '') =>
  `<text x="${x}" y="${y}" font-family="Manrope" font-weight="${w}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" ${extra}>${s}</text>`;
const svg = (body) => `<svg viewBox="0 0 980 760" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
// Escala de 5 letras con una destacada
const escala = (x, y, on, w = 300) => {
  const b = w / 5;
  return `<g>${'ABCDE'.split('').map((l, i) => {
    const big = l === on, h = big ? 86 : 62, yy = big ? y - 12 : y;
    return `<rect x="${x + i * b - (big ? 8 : 0)}" y="${yy}" width="${b + (big ? 16 : 0)}" height="${h}" rx="${big ? 18 : 6}" fill="${NS[l]}" ${big ? `stroke="#fff" stroke-width="6"` : 'opacity=".55"'}/>
      ${txt(x + i * b + b / 2, yy + h / 2 + (big ? 17 : 12), l, big ? 50 : 34, 800, '#fff')}`;
  }).join('')}</g>`;
};
const botella = (x, y) => `<g><rect x="${x - 22}" y="${y - 230}" width="44" height="50" rx="8" fill="${F}"/>
  <path d="M${x - 30} ${y - 180} h60 l25 60 v170 a20 20 0 0 1 -20 20 h-70 a20 20 0 0 1 -20 -20 v-170 z" fill="#C9B84A" stroke="${CH}" stroke-width="5"/>
  <rect x="${x - 44}" y="${y - 80}" width="88" height="70" rx="10" fill="${CR}"/>${txt(x, y - 37, 'AOVE', 26, 800, F)}</g>`;
const caja = (x, y) => `<g><rect x="${x - 80}" y="${y - 240}" width="160" height="250" rx="14" fill="#F2B84B" stroke="${CH}" stroke-width="5"/>
  <circle cx="${x}" cy="${y - 150}" r="44" fill="#fff"/><circle cx="${x - 14}" cy="${y - 158}" r="9" fill="${G}"/><circle cx="${x + 12}" cy="${y - 146}" r="9" fill="${G}"/><circle cx="${x - 2}" cy="${y - 134}" r="9" fill="${G}"/>
  ${txt(x, y - 60, 'CEREALES', 24, 800, CH)}${txt(x, y - 28, '+ azúcar', 22, 700, '#9B4A3E')}</g>`;
const check = (x, y, ok) => ok
  ? `<g><circle cx="${x}" cy="${y}" r="30" fill="${F}"/><path d="M${x - 13} ${y + 1} l9 10 l18 -20" stroke="${CR}" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`
  : `<g><circle cx="${x}" cy="${y}" r="30" fill="#C9776A"/><path d="M${x - 11} ${y - 11} l22 22 M${x + 11} ${y - 11} l-22 22" stroke="${CR}" stroke-width="8" stroke-linecap="round"/></g>`;

export default function escenas(o, words) {
  // t('palabra', n): inicio de la n-ésima aparición (1 por defecto), en segundos del reel
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]/g, '');
  const t = (w, n = 1) => { let c = 0; for (const x of words) if (norm(x.w) === norm(w) && ++c === n) return o + x.s; throw new Error('palabra no encontrada: ' + w); };
  const A = (x) => x.toFixed(2);
  const T1 = t('durante'), T2 = t('2024'), T3 = t('pero'), T4 = t('ultraprocesado'), T5 = t('usalo');
  const T4s = t('y', 2);
  return [
    { start: T1, end: T2 - 0.1, tag: 'ANTES DE 2024',
      svg: svg(`
        <g data-at="${A(t('aceite'))}">${botella(250, 470)}${escala(110, 560, 'C', 280)}</g>
        <g data-at="${A(t('cereales'))}">${caja(730, 470)}${escala(590, 560, 'B', 280)}</g>
        <g data-at="${A(t('amarilla'))}" data-pop="250 690">${txt(250, 700, '¿Aceite peor?', 34, 800, '#9B4A3E')}</g>
        <g data-at="${A(t('b'))}" data-pop="730 690">${txt(730, 700, '¿Cereales mejor?', 34, 800, '#9B4A3E')}</g>`) },
    { start: T2 - 0.1, end: T3 - 0.1, tag: '2024: LO CORRIGEN',
      svg: svg(`${botella(250, 470)}${caja(730, 470)}
        <g data-out="${A(t('corrigieron'))}">${escala(110, 560, 'C', 280)}${escala(590, 560, 'B', 280)}</g>
        <g data-at="${A(t('corrigieron'))}" data-pop="490 590">${escala(110, 560, 'B', 280)}${escala(590, 560, 'C', 280)}</g>
        <g data-at="${A(t('corrigieron') + 0.4)}">${txt(730, 700, 'C o peor', 34, 800, '#9B4A3E')}${txt(250, 700, 'Sube a B', 34, 800, F)}</g>`) },
    { start: T3 - 0.1, end: T4s - 0.1, tag: 'CALCULA POR 100 G',
      svg: svg(`
        <g data-at="${A(T3 + 0.3)}"><rect x="90" y="170" width="370" height="420" rx="36" fill="${M}"/>
          ${txt(275, 270, '100 g', 92, 800, F)}${txt(275, 330, 'de aceite', 34, 700)}
          ${[0, 1, 2, 3, 4, 5, 6].map((i) => `<ellipse cx="${150 + (i % 4) * 82}" cy="${420 + Math.floor(i / 4) * 80}" rx="34" ry="20" fill="#C9B84A" stroke="${CH}" stroke-width="4"/>`).join('')}
          ${txt(275, 580, '≈ 7 cucharadas', 30, 700)}</g>
        <g data-at="${A(t('comes'))}" data-pop="705 380"><rect x="520" y="170" width="370" height="420" rx="36" fill="#fff" stroke="${M}" stroke-width="6"/>
          ${txt(705, 270, 'Tu ración', 50, 800, CH)}<ellipse cx="705" cy="420" rx="44" ry="26" fill="#C9B84A" stroke="${CH}" stroke-width="4"/>
          ${txt(705, 580, '1 cucharada', 30, 700)}</g>`) },
    { start: T4s - 0.1, end: T5 - 0.1, tag: 'NO MIRA SI ES ULTRAPROCESADO',
      svg: svg(`
        <g data-at="${A(T4s)}"><rect x="140" y="160" width="700" height="440" rx="30" fill="#fff" stroke="${CH}" stroke-width="5"/>
          ${txt(180, 225, 'Ingredientes:', 34, 800, CH, 'start')}
          ${['harina, azúcar, jarabe de glucosa,', 'aceite de palma, emulgentes,', 'aromas, edulcorantes,', 'colorantes, sal…'].map((l, i) => `<g data-at="${A(T4s + 0.25 * i)}">${txt(180, 290 + i * 62, l, 34, 600, CH, 'start')}</g>`).join('')}
        </g>
        <g data-at="${A(T4)}" data-pop="760 560"><circle cx="760" cy="560" r="70" fill="${CR}" stroke="${CH}" stroke-width="5"/>
          <path d="M715 560 q45 -40 90 0 q-45 40 -90 0 z" fill="none" stroke="${CH}" stroke-width="6"/><circle cx="760" cy="560" r="13" fill="${CH}"/><line x1="712" y1="608" x2="808" y2="512" stroke="#C9776A" stroke-width="9" stroke-linecap="round"/></g>`) },
    { start: T5 - 0.1, end: o + 99, tag: 'CÓMO USARLO',
      svg: svg(`
        ${[['Cereales con cereales', true, T5 + 0.3], ['Cereales con aceite', false, t('parecidos')], ['Lee los ingredientes', true, t('lee')]].map(([s, ok, at], i) => {
          const y = 190 + i * 150;
          return `<g data-at="${A(at)}" data-pop="490 ${y + 50}"><rect x="110" y="${y}" width="760" height="110" rx="55" fill="${ok ? M : '#F3D9D2'}"/>${check(180, y + 55, ok)}${txt(240, y + 70, s, 44, 800, CH, 'start')}</g>`;
        }).join('')}`) },
  ];
}
