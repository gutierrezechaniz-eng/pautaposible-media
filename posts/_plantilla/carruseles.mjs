// Contenido de cada carrusel. La última diapositiva siempre es { type: 'final' } (norma de calendario.md).
export const carruseles = {
  'legumbres-bote': {
    slides: [
      { type: 'portada', tag: 'Mito o realidad', title: '¿Las legumbres de bote son peores que las secas?', sub: 'La respuesta te ahorra tiempo en la cocina.' },
      { type: 'texto', kicker: 'Respuesta corta', title: 'No: son las mismas legumbres, ya cocidas.', p: 'Se cuecen dentro del bote y conservan casi toda su **proteína, fibra y minerales**.', box: 'Lo que cambia es la **sal** del líquido de conserva… y tiene fácil solución.' },
      { type: 'texto', kicker: 'El truco', title: 'Escúrrelas y enjuágalas.', steps: ['**Escurre** todo el líquido del bote.', '**Enjuágalas** bajo el grifo unos segundos, en un colador.'], box: 'Así quitas **hasta un 40 % de la sal** añadida.' },
      { type: 'texto', kicker: 'Al comprar', title: 'Mira la etiqueta.', p: 'Los ingredientes deberían ser casi solo estos:', chips: ['Legumbre', 'agua', 'sal'], p2: 'Si ves la versión **«bajo en sal»** o «sin sal añadida», mejor todavía. Cristal o lata: las dos sirven.' },
      { type: 'texto', kicker: '¿Y las secas?', title: 'También son una gran opción.', p: 'Salen más baratas y tú decides la sal, pero necesitan remojo y cocción (o una olla exprés).', box: 'La mejor legumbre es **la que comes**: la recomendación es tomar **al menos 4 raciones a la semana**.' },
      { type: 'cierre', title: 'Legumbre de bote enjuagada: legumbre de verdad.', sub: 'Recetas con legumbre lista en 15 minutos.', url: 'pautaposible.es/recetas', foot: 'Guárdalo para tu próxima compra' },
      { type: 'final' },
    ],
  },
  'merluza-bandeja': {
    slides: [
      { type: 'portada', tag: 'Receta sencilla', title: 'Merluza al horno con patata y verduras', sub: 'Para 2 · 35 minutos · una sola bandeja que fregar.' },
      { type: 'texto', kicker: 'Ingredientes · para 2', title: 'Lo que necesitas.', checks: ['2 lomos de merluza (unos 300 g)', '2 patatas medianas', '1 calabacín', '1 pimiento rojo', '1 cebolla', '2 cucharadas de aceite de oliva'], p2: 'Y además: ajo, perejil, medio limón, sal y pimienta.' },
      { type: 'texto', kicker: 'Paso a paso', title: 'Primero, la patata.', steps: ['**Precalienta** el horno a 200 °C.', 'Corta la patata en **rodajas finas** y la cebolla en tiras. Mézclalas en la bandeja con 1 cucharada de aceite y sal, y **hornea 15 minutos**.'] },
      { type: 'texto', kicker: 'Paso a paso', title: 'Después, el resto.', start: 3, steps: ['Añade el calabacín y el pimiento en trozos y **hornea 5 minutos** más.', 'Pon la merluza encima con ajo picado, perejil, el resto del aceite y un chorrito de limón. **Hornea 10-12 minutos**, hasta que se separe en láminas.'] },
      { type: 'texto', kicker: 'Trucos', title: 'Para que salga bien.', box: '**¿Merluza congelada?** Descongélala la noche antes en la nevera y sécala con papel de cocina.', p2: '**Plato completo:** verdura, pescado y patata en la misma bandeja. Si sobra, al táper y a la nevera: tómalo en **1-2 días**.' },
      { type: 'cierre', title: 'Una bandeja y la cena resuelta.', sub: 'Más recetas sencillas con cantidades.', url: 'pautaposible.es/recetas', foot: 'Guárdala para esta semana' },
      { type: 'final' },
    ],
  },
  'lista-compra': {
    slides: [
      { type: 'portada', tag: 'Hábito práctico', title: 'Tu lista de la compra básica para la semana', sub: 'Guárdala y úsala cada vez que vayas al súper.' },
      { type: 'texto', kicker: 'Antes de salir', title: '5 minutos que te ahorran tiempo y dinero.', steps: ['Mira qué tienes en la **nevera y la despensa**.', 'Piensa **3-4 comidas** de la semana.', 'Apunta **solo lo que falta**.'] },
      { type: 'texto', kicker: '1 · Fruta y verdura', title: 'La base del carro.', checks: ['Fruta de temporada para 5-7 días', '2-3 verduras para cocinar', 'Tomate y hojas para ensalada', 'Cebolla, ajo y patatas', 'Una bolsa de verdura congelada'], p2: 'En octubre: **mandarina, manzana, uva, calabaza y setas**.' },
      { type: 'texto', kicker: '2 · Proteínas', title: 'Para 3-4 comidas.', checks: ['2-3 botes de legumbre', 'Una docena de huevos', 'Pescado fresco o congelado (2 veces)', 'Pollo o pavo', 'Atún o sardinas en lata'] },
      { type: 'texto', kicker: '3 · Hidratos y lácteos', title: 'Para completar el plato.', checks: ['Pan integral', 'Arroz y pasta (mejor integrales)', 'Copos de avena', 'Leche o bebida de soja con calcio', 'Yogur natural', 'Queso fresco'] },
      { type: 'texto', kicker: '4 · Despensa', title: 'Lo que conviene tener siempre.', checks: ['Aceite de oliva virgen extra', 'Frutos secos naturales', 'Tomate triturado', 'Especias y vinagre'], box: 'No hace falta comprarlo todo cada semana: **repón solo lo que se acabe**.' },
      { type: 'cierre', title: 'Con la lista hecha, comer bien es más fácil.', sub: 'Más guías sencillas para organizarte.', url: 'pautaposible.es/aprende', foot: 'Guárdala para tu próxima compra' },
      { type: 'final' },
    ],
  },
};
