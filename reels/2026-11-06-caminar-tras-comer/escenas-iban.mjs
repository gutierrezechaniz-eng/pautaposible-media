// Diapositivas del reel del viernes 6/11 con la voz de Iban (caminar tras comer).
// Tiempos en segundos de la voz del cuerpo (palabras-iban.json); o = desfase del cuerpo dentro del reel.
// Tarjeta de 980×760. Dibujos propios en SVG. Las curvas son un esquema orientativo, sin datos.
const F = '#2E6F57', CR = '#FAFAF7', M = '#DDEEDF', S = '#6FA67A', G = '#D7A95B', CH = '#24322A';
const txt = (x, y, s, size = 34, w = 800, fill = CH, anchor = 'middle', extra = '') =>
  `<text x="${x}" y="${y}" font-family="Manrope" font-weight="${w}" font-size="${size}" fill="${fill}" text-anchor="${anchor}" ${extra}>${s}</text>`;
const svg = (body) => `<svg viewBox="0 0 980 760" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const ejes = `<line x1="150" y1="640" x2="900" y2="640" stroke="${CH}" stroke-width="5" stroke-linecap="round" opacity=".7"/>
  <line x1="150" y1="640" x2="150" y2="170" stroke="${CH}" stroke-width="5" stroke-linecap="round" opacity=".7"/>
  ${txt(525, 700, 'Tiempo después de comer', 30, 700, CH, 'middle', 'opacity=".7"')}
  ${txt(95, 410, 'Glucosa en sangre', 30, 700, CH, 'middle', 'opacity=".7" transform="rotate(-90 95 410)"')}`;
const plato = (x, y) => `<g><circle cx="${x}" cy="${y}" r="58" fill="#fff" stroke="${CH}" stroke-width="5"/><circle cx="${x}" cy="${y}" r="38" fill="${M}"/>
  <circle cx="${x - 12}" cy="${y - 8}" r="13" fill="${G}"/><circle cx="${x + 14}" cy="${y + 6}" r="12" fill="${S}"/><circle cx="${x - 4}" cy="${y + 16}" r="8" fill="#C9776A"/>
  <rect x="${x - 90}" y="${y - 45}" width="9" height="90" rx="4" fill="${CH}" opacity=".7"/><rect x="${x + 82}" y="${y - 45}" width="9" height="90" rx="4" fill="${CH}" opacity=".7"/></g>`;
const andar = (x, y, c = F) => `<g transform="translate(${x} ${y})" stroke="${c}" stroke-width="12" stroke-linecap="round" fill="none">
  <circle cx="0" cy="-70" r="18" fill="${c}" stroke="none"/><line x1="0" y1="-48" x2="-6" y2="10"/><line x1="-6" y1="10" x2="-30" y2="62"/><line x1="-6" y1="10" x2="22" y2="60"/>
  <line x1="-2" y1="-34" x2="-30" y2="-4"/><line x1="-2" y1="-34" x2="26" y2="-10"/></g>`;
const check = (x, y) => `<g><circle cx="${x}" cy="${y}" r="30" fill="${F}"/><path d="M${x - 13} ${y + 1} l9 10 l18 -20" stroke="${CR}" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;

export default function escenas(o) {
  const A = (x) => (o + x).toFixed(2);
  return [
    { // 1. Tras comer, la glucosa sube
      start: o + 0, end: o + 5.6, tag: 'TRAS COMER, LA GLUCOSA SUBE',
      svg: svg(`${ejes}
        <g data-at="${A(0.3)}" data-pop="245 520"><g>${plato(245, 520)}</g></g>${''}
        <path data-draw="${A(1.6)} 2.6" d="M330 590 C 380 585, 400 240, 470 230 S 640 520, 880 560" stroke="${G}" stroke-width="14" fill="none" stroke-linecap="round"/>
        <g data-at="${A(3.5)}" data-pop="470 200"><rect x="370" y="150" width="200" height="56" rx="28" fill="${G}"/>${txt(470, 189, '¡Pico!', 32, 800, '#fff')}</g>
        <g data-at="${A(4.7)}">${txt(735, 330, 'Es normal', 40, 800, F)}</g>`),
    },
    { // 2. Paseo de 10 minutos: pico más bajo
      start: o + 5.6, end: o + 9.4, tag: '10 MINUTOS DE PASEO',
      svg: svg(`${ejes}
        <path d="M330 590 C 380 585, 400 240, 470 230 S 640 520, 880 560" stroke="${G}" stroke-width="12" fill="none" stroke-linecap="round" opacity=".55" stroke-dasharray="2 22"/>
        <path data-draw="${A(6.4)} 2.0" d="M330 590 C 380 585, 400 390, 470 385 S 640 540, 880 570" stroke="${F}" stroke-width="14" fill="none" stroke-linecap="round"/>
        <g data-at="${A(6.0)}"><rect x="620" y="170" width="28" height="10" rx="5" fill="${G}"/>${txt(662, 184, 'Sin paseo', 30, 700, CH, 'start')}</g>
        <g data-at="${A(6.9)}"><rect x="620" y="222" width="28" height="10" rx="5" fill="${F}"/>${txt(662, 236, 'Con paseo', 30, 800, F, 'start')}</g>
        <g data-at="${A(8.2)}" data-mv="${A(8.2)} 0 60 0.8"><path d="M470 250 L470 340" stroke="${F}" stroke-width="8" stroke-linecap="round"/><path d="M448 318 L470 344 L492 318" stroke="${F}" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>
        <g data-at="${A(6.4)}">${andar(235, 480)}</g>
        <g data-at="${A(6.9)}"><rect x="160" y="575" width="150" height="50" rx="25" fill="${M}"/>${txt(235, 610, '10 min', 30, 800, F)}</g>
        ${txt(890, 742, 'Esquema orientativo', 22, 600, CH, 'end', 'opacity=".5"')}`),
    },
    { // 3. El músculo usa la glucosa como energía
      start: o + 9.4, end: o + 15.4, tag: 'TU MÚSCULO LA USA',
      svg: svg(`
        <rect x="520" y="170" width="380" height="440" rx="80" fill="#F3D9D2" stroke="#C9776A" stroke-width="7"/>
        <path d="M560 250 Q 710 225 860 250 M560 330 Q 710 305 860 330 M560 410 Q 710 385 860 410 M560 490 Q 710 465 860 490" stroke="#C9776A" stroke-width="5" fill="none" opacity=".45"/>
        ${txt(710, 575, 'Músculo', 36, 800, '#9B4A3E')}
        <g data-at="${A(9.6)}"><rect x="505" y="300" width="34" height="120" rx="10" fill="${CR}" stroke="${F}" stroke-width="6"/></g>
        <g data-at="${A(9.7)}">${txt(240, 205, 'Glucosa', 34, 800, '#9C7330')}</g>
        <g data-at="${A(10.6)}" data-out="${A(12.3)}" data-mv="${A(11.0)} 470 0 1.5"><circle cx="110" cy="330" r="30" fill="${G}"/></g>
        <g data-at="${A(10.8)}" data-out="${A(12.7)}" data-mv="${A(11.4)} 470 0 1.5"><circle cx="180" cy="390" r="30" fill="${G}"/></g>
        <g data-at="${A(11.0)}" data-out="${A(13.1)}" data-mv="${A(11.8)} 470 0 1.5"><circle cx="110" cy="450" r="30" fill="${G}"/></g>
        <g data-at="${A(11.2)}" data-out="${A(13.5)}" data-mv="${A(12.2)} 470 0 1.5"><circle cx="190" cy="510" r="30" fill="${G}"/></g>
        <g data-at="${A(12.24)}" data-pop="710 360"><path d="M730 270 L670 380 L715 380 L690 460 L765 340 L718 340 Z" fill="${G}" stroke="${CH}" stroke-width="5" stroke-linejoin="round"/></g>
        <g data-at="${A(12.5)}">${txt(710, 520, 'Energía', 40, 800, F)}</g>
        <g data-at="${A(13.2)}" data-pop="250 640"><rect x="60" y="610" width="380" height="64" rx="32" fill="${M}"/>${txt(250, 654, 'Sin esperar a la insulina', 28, 800, F)}</g>`),
    },
    { // 4. La pauta: tabla
      start: o + 15.4, end: o + 20.35, tag: 'LA PAUTA',
      svg: svg(`
        ${[['¿Correr?', 'No hace falta', 15.5], ['¿Cómo?', 'Caminar tranquilo', 17.3], ['¿Cuándo?', '1.ª hora tras comer', 18.6], ['¿Cuánto?', '10 minutos', 19.4]].map(([k, v, at], i) => {
          const y = 150 + i * 135;
          return `<g data-at="${A(at)}"><rect x="70" y="${y}" width="840" height="110" rx="30" fill="${i % 2 ? '#fff' : M}" stroke="${M}" stroke-width="4"/>
            ${txt(110, y + 70, k, 38, 700, CH, 'start', 'opacity=".75"')}${txt(870, y + 70, v, 40, 800, F, 'end')}</g>`;
        }).join('')}`),
    },
    { // 5. También cuenta
      start: o + 20.35, end: o + 24.3, tag: 'TAMBIÉN CUENTA',
      svg: svg(`
        ${[['Fregar', 20.48], ['Tender la ropa', 21.2], ['Bajar al perro', 22.2]].map(([s, at], i) => {
          const y = 210 + i * 140;
          return `<g data-at="${A(at)}" data-pop="490 ${y + 40}"><rect x="140" y="${y}" width="700" height="100" rx="50" fill="${M}"/>${check(210, y + 50)}${txt(270, y + 64, s, 44, 800, CH, 'start')}</g>`;
        }).join('')}
        <g data-at="${A(23.0)}" data-pop="490 680">${txt(490, 690, 'Todo lo que sea moverte suma', 34, 700, F)}</g>`),
    },
    { // 6. Mándaselo
      start: o + 24.3, end: o + 27.5, tag: '',
      svg: svg(`<rect width="980" height="760" fill="${F}"/>
        <g data-at="${A(24.4)}">${txt(490, 170, 'Mándaselo a quien', 58, 800, CR)}${txt(490, 240, 'se va directo al sofá', 58, 800, CR)}</g>
        <g data-at="${A(25.4)}" data-pop="490 480">
          <rect x="300" y="420" width="380" height="120" rx="34" fill="${G}"/><rect x="270" y="470" width="70" height="140" rx="26" fill="#C4923F"/><rect x="640" y="470" width="70" height="140" rx="26" fill="#C4923F"/>
          <rect x="320" y="520" width="340" height="80" rx="20" fill="#E6BE77"/><rect x="300" y="600" width="18" height="40" fill="${CH}"/><rect x="662" y="600" width="18" height="40" fill="${CH}"/></g>
        <g data-at="${A(26.2)}" data-float="8 1.6"><path d="M760 330 L900 280 L850 410 L815 360 Z" fill="${CR}"/><path d="M815 360 L900 280" stroke="${F}" stroke-width="5"/></g>`),
    },
  ];
}
