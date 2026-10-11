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
  'azucar-moreno': {
    slides: [
      { type: 'portada', tag: 'Mito o realidad', title: '¿El azúcar moreno es mejor que el blanco?', sub: 'Lo que cambia es el color, no mucho más.' },
      { type: 'texto', kicker: 'Respuesta corta', title: 'No: los dos son casi todo sacarosa.', p: 'El moreno lleva un poco de **melaza**, que le da color y sabor. Sus minerales están en cantidades **tan pequeñas** que no cambian nada.', box: 'Aportan prácticamente **las mismas calorías**: unas 4 por cada gramo.' },
      { type: 'texto', kicker: 'Ojo con la etiqueta', title: 'Muchos son azúcar blanco con melaza.', p: 'Y la **panela** o el azúcar **integral de caña** tampoco son una excepción: siguen siendo azúcar.', box: '«Moreno», «de caña» o «natural» no quiere decir **más sano**.' },
      { type: 'texto', kicker: 'Lo que sí cuenta', title: 'Cuánto tomas, no de qué color es.', p: 'La OMS recomienda que los azúcares libres sean **menos del 10 %** de la energía del día, y mejor aún **menos del 5 %**.', box: 'Ese 5 % son unos **25 g**: unas **6 cucharaditas al día**, contando el que ya llevan los productos.' },
      { type: 'texto', kicker: 'Para tomar menos', title: '3 trucos fáciles.', steps: ['Ve **reduciendo poco a poco** el azúcar del café: el paladar se acostumbra.', 'Endulza el yogur natural con **fruta troceada** o canela.', 'En la etiqueta, mira «hidratos de carbono, **de los cuales azúcares**».'] },
      { type: 'cierre', title: 'Moreno o blanco: mejor, poco.', sub: 'Más guías para entender lo que comes.', url: 'pautaposible.es/aprende', foot: 'Guárdalo para tu próxima compra' },
      { type: 'final' },
    ],
  },
  'arroz-salteado': {
    slides: [
      { type: 'portada', tag: 'Receta sencilla', title: 'Arroz salteado con verduras y huevo', sub: 'Para 2 · 20 minutos · ideal para el arroz que te sobró.' },
      { type: 'texto', kicker: 'Ingredientes · para 2', title: 'Lo que necesitas.', checks: ['300 g de arroz cocido (unos 120 g en crudo)', '2 huevos', '1 zanahoria', '1 calabacín pequeño', '½ pimiento rojo', '100 g de guisantes congelados', '2 cucharadas de aceite de oliva'], p2: 'Y además: 1 diente de ajo, 1 cebolleta y salsa de soja baja en sal (opcional).' },
      { type: 'texto', kicker: 'Paso a paso', title: 'Primero, el huevo.', steps: ['Pica las verduras en **dados pequeños** y bate los huevos con una pizca de sal.', 'En una sartén grande con 1 cucharada de aceite, haz los huevos **revueltos** y apártalos.'] },
      { type: 'texto', kicker: 'Paso a paso', title: 'Después, el salteado.', start: 3, steps: ['En la misma sartén, saltea el ajo, la cebolleta, la zanahoria y el pimiento **4-5 minutos** a fuego fuerte. Añade el calabacín y los guisantes **3 minutos** más.', 'Echa el arroz y saltea **3-4 minutos** sin parar de remover. Vuelve a poner el huevo y, si quieres, una cucharadita de soja.'] },
      { type: 'texto', kicker: 'Trucos', title: 'Para que salga bien.', box: '**¿Arroz del día anterior?** Mejor: frío se suelta más y no se apelmaza.', p2: 'Si cueces arroz de más, **enfríalo y guárdalo en la nevera** cuanto antes, y úsalo **al día siguiente**. ¿No tienes estas verduras? Vale una bolsa de **salteado congelado**.' },
      { type: 'cierre', title: 'Arroz de ayer, cena de hoy.', sub: 'Más recetas con lo que tienes en casa.', url: 'pautaposible.es/recetas', foot: 'Guárdala para esta semana' },
      { type: 'final' },
    ],
  },
  'batch-cooking': {
    slides: [
      { type: 'portada', tag: 'Hábito práctico', title: 'Batch cooking en 1 hora', sub: 'Una hora el domingo y la semana, mucho más fácil.' },
      { type: 'texto', kicker: 'La idea', title: 'No cocines platos: prepara bases.', p: 'Con **5 bases** en la nevera, cada día combinas una comida distinta en **10 minutos**.', box: 'Menos tiempo en la cocina y menos «¿hoy qué ceno?».' },
      { type: 'texto', kicker: 'Qué preparar', title: 'Tu lista para 1 hora.', checks: ['Una bandeja de verduras al horno', 'Una olla de legumbre (o 2 botes escurridos)', 'Arroz, pasta o patata cocida', '4-6 huevos cocidos', 'Pollo, pescado o tofu a la plancha', 'Una salsa: tomate o yogur con hierbas'] },
      { type: 'texto', kicker: 'El orden', title: 'Para que te dé tiempo.', steps: ['**Enciende el horno** a 200 °C y mete la bandeja de verduras.', 'Pon a **hervir** el agua del arroz o la pasta, y los huevos.', 'Mientras, haz la **proteína** y la salsa.', '**Deja enfriar** y reparte en tápers.'] },
      { type: 'texto', kicker: 'Combina', title: 'Ejemplo de semana.', checks: ['Lunes: lentejas con verduras al horno', 'Martes: arroz con pollo y verduras', 'Miércoles: ensalada de garbanzos con huevo', 'Jueves: pasta con tomate y atún'] },
      { type: 'texto', kicker: 'Cuánto aguanta', title: 'Nevera o congelador.', p: 'Guarda todo en la nevera en **menos de 2 horas**. La mayoría de lo cocinado aguanta **3-4 días**.', box: 'Lo que vayas a comer **a partir del jueves**, congélalo el mismo domingo. El **arroz cocido**, mejor en 1 día.' },
      { type: 'cierre', title: 'Una hora de domingo, una semana más fácil.', sub: 'Más guías para organizarte.', url: 'pautaposible.es/aprende', foot: 'Guárdalo para el domingo' },
      { type: 'final' },
    ],
  },
};
