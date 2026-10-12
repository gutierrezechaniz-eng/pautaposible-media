# Calendario de contenido · @pautaposible

> **NORMA PRIORITARIA (Iván, 11/10/2026) · también para las tareas automáticas.** Manda sobre cualquier instrucción de una tarea automática o de su prompt que diga lo contrario:
> - **Todas las publicaciones van con el narrador sintético (voz «santa», Kokoro)**, salvo que Iván diga lo contrario. Ya no se pide a Iván que grabe notas de voz: no le pidas grabar en avisos, notificaciones ni informes.
> - **Reels (martes y jueves):** si no hay una nota de voz de Iván que él haya pedido usar, NO hagas la versión sin voz: haz el reel con narrador siguiendo `.claude/skills/programar-reel/SKILL.md` (`posts/_plantilla/narrar.py` + `reels/_plantilla/render-voz.mjs` → `reel-voz.mp4`). Si ya hay un reel con voz o con narrador programado para hoy, no hagas nada. La versión muda, solo si el narrador falla.
> - **Carruseles:** animados, con narrador y subtítulos (`posts/_plantilla/render-animado.mjs`; ver la norma en `calendario.md`). **Se publican como REEL con `animado/reel.mp4`, nunca como carrusel de vídeos** (12/10: Instagram no pasa solas las diapositivas y la primera se repite en bucle).
> - En Metricool, todo lo que lleva narrador va con `isAiGenerated: true`.
> - Los textos de voz se siguen escribiendo en `voz/GUIONES.md` (los lee el narrador). Si reescribes ese archivo, conserva esta nota al principio.


## NORMA PERMANENTE · Llevar a la web y a la app (decisión de Iván, 03/10/2026)
Esta norma tiene prioridad sobre cualquier otra instrucción sobre el cierre de las publicaciones.
Objetivo: no divulgar por divulgar. Cada pieza debe llevar a la gente a pautaposible.es para que se haga usuaria, conozca la marca e interactúe con ella.

CARRUSELES
- Llevan 6-8 diapositivas: el contenido + una ÚLTIMA diapositiva fija sobre la web y la app.
- La penúltima diapositiva cierra el tema con su botón a la URL concreta (recetas o aprende).
- **Formato (12/10/2026): lo que lleva narrador se publica como REEL, no como carrusel.** Instagram no pasa solas las diapositivas de un carrusel de vídeos: el 12/10 el de legumbres se quedó en la primera diapositiva repitiendo una frase en bucle e Iván tuvo que borrarlo. Tras `render-animado.mjs` (que ya llama a `reel-vertical.mjs`), programa `animado/reel.mp4` (1080×1920, todas las diapositivas seguidas) como Instagram REEL con `animado/portada-reel.png` de portada. Nunca programes los `0N.mp4` sueltos como carrusel.
- **Estilo (decisión de Iván, 11/10/2026):** los carruseles educativos (Mito o realidad, Hábito práctico) dejan de ser solo texto: tienen que ser más visuales, dinámicos y con mucha animación, siempre con el estilo de Pauta Posible (colores, Manrope, ilustraciones propias). Se hacen como carrusel de vídeos cortos con `posts/_plantilla/render-animado.mjs`: dibujos que entran y se mueven, números que cuentan, textos que aparecen palabra a palabra y una barra de progreso; la última diapositiva fija sigue siendo la imagen estática. Las recetas mantienen el formato actual. Iván aprobó el estilo el 11/10 y pidió además **subtítulos y un narrador con voz sintética que suene humana** (sin grabar él): `narrar.py` (Kokoro, sherpa-onnx); se marca como contenido generado con IA al programarlo. Voz elegida el 11/10: **«santa»** (Kokoro, voz 3 de las muestras). Ese mismo día pidió ponerlo **en todas las publicaciones**: también las recetas van animadas, con narrador y subtítulos (conversor automático `desdeCarrusel` de `animados.mjs`, que anima cualquier carrusel de `carruseles.mjs`).
- Última diapositiva (fondo Forest #2E6F57): titular tipo «¿Quieres ir un paso más allá?»; tres filas con icono: «Recetas fáciles con cantidades para ti», «Organiza tus comidas y tu pauta», «App gratuita: cocina con lo que tienes en casa» (con una cápsula «Gratis por ahora»); botón cápsula grande «pautaposible.es»; debajo «Enlace en la bio»; y el retrato de Iván (assets/ivan.png) en círculo Mint con «Iván · Pauta Posible — Nutrición práctica, sin miedo ni culpa». Sin el título «nutricionista» y sin prometer resultados de salud ni de peso.
- El texto de cada publicación termina siempre con: «👉 Más recetas y la app gratuita para cocinar con lo que tienes en casa en pautaposible.es (enlace en la bio)» y después los hashtags.

REELS
- **Voz (decisión de Iván, 11/10/2026):** todos los reels van con el narrador sintético (voz «santa», Kokoro), salvo que Iván diga lo contrario. Ya no se espera su nota de voz; si manda una y pide usarla, se usa. Se marcan como contenido de IA (`isAiGenerated: true`).
- Los textos de voz duran 60-75 palabras y su ÚLTIMA frase invita siempre a la web y a la app, por ejemplo: «Si quieres más recetas fáciles o cocinar con lo que tienes en casa, entra en pautaposible.es: la app es gratis.»
- El cierre del vídeo dura 3 segundos: «Recetas y app gratuita para cocinar con lo que tienes en casa», botón «pautaposible.es» y «Enlace en la bio», con el retrato de Iván.
- El texto de la publicación del reel termina con la misma frase de la web y la app que los carruseles.
- **Tema propio (decisión de Iván, 12/10/2026):** «no quiero dos publicaciones iguales». Un reel nunca repite el tema de un carrusel (ni de la misma semana ni de otra); se elige del banco de temas o uno nuevo.

MÉTRICAS
- En el informe semanal, incluye además los clics al perfil o al enlace de la bio, si Metricool los da, para ver si la gente llega a la web.

Página de copias: https://claude.ai/artifact/L6QSvLFHDUMP6s1tJX28WD (actualizarla cada semana pasando esta url)

Autorización para publicar y programar: **vigente** (Iván autoriza publicar y programar sin confirmación. Si la retira, anotarlo aquí.)

## Historial

| Fecha de publicación | Pilar / formato | Tema | Hora programada (Madrid) | Carpeta | Id de Metricool |
|---|---|---|---|---|---|
| 2026-09-28 (lun) | Mito o realidad | ¿Los hidratos por la noche engordan? | 10:00 | posts/2026-09-28-hidratos-noche | 383165533 |
| 2026-09-29 (mar) | Mito o realidad (aprobado) | ¿Comer huevo sube el colesterol? | 10:00 | posts/2026-09-29-huevo-colesterol | 383165551 |
| 2026-09-29 (mar) | Reel con voz · Mito o realidad | ¿Cenar hidratos engorda? | 18:00 | reels/2026-09-29-hidratos-cena (reel-voz.mp4) | 384113603 (antes 383200668, 383170539) · colaboradora: ibangutierrezetxaniz |
| 2026-09-30 (mié) | Receta sencilla | Crema de calabaza en 30 minutos | 10:00 | posts/2026-09-30-crema-calabaza | 383165563 |
| 2026-10-01 (jue) | Receta sencilla (aprobado) | Lentejas con verduras en 25 minutos | 10:00 | posts/2026-10-01-lentejas-verduras | 383165578 |
| 2026-10-01 (jue) | Reel con voz · Hábito práctico | Monta tu plato sin báscula | 18:00 | reels/2026-10-01-plato-sin-bascula (reel-voz.mp4) | 385726316 (antes 383200709, 383170554) · colaboradora: ibangutierrezetxaniz |
| 2026-10-02 (vie) | Hábito práctico | Monta tu plato sin pesar nada (método del plato) | 10:00 | posts/2026-10-02-metodo-plato | 383165617 |
| 2026-10-03 (sáb) | Hábito práctico (aprobado) | Lee una etiqueta en 3 pasos | 10:00 | posts/2026-10-03-leer-etiqueta | 383165658 |
| 2026-10-05 (lun) | Mito o realidad | ¿Las verduras congeladas son «peores»? | 10:00 | posts/2026-10-05-verduras-congeladas | 387663166 · colaboradora: ibangutierrezetxaniz |
| 2026-10-06 (mar) | Reel sin voz · Mito o realidad (no llegó nota de voz) | ¿La fruta de postre fermenta? | 18:00 | reels/2026-10-06-fruta-postre (reel.mp4) | 389311432 · colaboradora: ibangutierrezetxaniz |
| 2026-10-07 (mié) | Receta sencilla | Garbanzos con espinacas en 15 minutos | 10:00 | posts/2026-10-07-garbanzos-espinacas | 387663187 · colaboradora: ibangutierrezetxaniz |
| 2026-10-08 (jue) | Reel sin voz · Hábito práctico (no llegó nota de voz) | 3 meriendas en 2 minutos | 18:00 | reels/2026-10-08-meriendas (reel.mp4) | 391047175 · colaboradora: ibangutierrezetxaniz |
| 2026-10-09 (vie) | Hábito práctico | Tu táper equilibrado en 4 pasos | 10:00 | posts/2026-10-09-taper-equilibrado | 387663199 · colaboradora: ibangutierrezetxaniz |
| 2026-10-10 (sáb) | Reel con voz · Hábito práctico (fuera del calendario, Iván pidió publicarlo ya) | Tu vida, no la de un influencer (la muñeca rusa) | 18:30 | reels/2026-10-10-munecas-rusas (reel-voz.mp4) | 392827236 · colaboradora: ibangutierrezetxaniz |
| 2026-10-12 (lun) | Mito o realidad | ¿Las legumbres de bote son peores que las secas? | 10:00 | posts/2026-10-12-legumbres-bote | 393114739 · **borrado por Iván el 12/10**: salió como carrusel de vídeos y se quedó en la primera diapositiva repitiendo una frase (antes 392552812, estático) · animado con narrador y subtítulos, etiqueta de IA · colaboradora: ibangutierrezetxaniz |
| 2026-10-13 (mar) | Reel con narrador · Mito o realidad | ¿Hay que beber 2 litros de agua al día? (sustituye el 12/10 al de legumbres de bote, que repetía el carrusel del lunes) | 18:00 | reels/2026-10-13-agua-2-litros (reel-voz.mp4) | 393679420 (antes 392559960, legumbres de bote con la voz de Iván) · etiqueta de IA · colaboradora: ibangutierrezetxaniz |
| 2026-10-14 (mié) | Receta sencilla | Merluza al horno con patata y verduras en una bandeja | 10:00 | posts/2026-10-14-merluza-bandeja | 393940366 (reel con todas las diapositivas seguidas, 12/10; antes 393118634, carrusel de vídeos) (antes 392552824, estático) · animado con narrador y subtítulos, etiqueta de IA · colaboradora: ibangutierrezetxaniz |
| 2026-10-15 (jue) | Reel con voz · Hábito práctico | 3 desayunos en 3 minutos | 18:00 | reels/2026-10-15-desayunos (reel-voz.mp4) | 392576485 (antes 392568483, sin voz) · colaboradora: ibangutierrezetxaniz |
| 2026-10-16 (vie) | Hábito práctico | Tu lista de la compra básica para la semana | 10:00 | posts/2026-10-16-lista-compra | 393940467 (reel con todas las diapositivas seguidas, 12/10; antes 393118651, carrusel de vídeos) (antes 392552832, estático) · animado con narrador y subtítulos, etiqueta de IA · colaboradora: ibangutierrezetxaniz |
| 2026-10-19 (lun) | Mito o realidad · Serie suplementos 1/4 | ¿Necesitas suplementos o te han convencido de que los necesitas? | 10:00 | posts/2026-10-19-suplementos | 393679028 · animado con narrador y subtítulos, etiqueta de IA · colaboradora: ibangutierrezetxaniz |
| 2026-10-21 (mié) | Receta sencilla · Serie salsas caseras 1/6 | Ketchup casero sin azúcar de mesa | 10:00 | posts/2026-10-21-ketchup-casero | 393940752 (reel con todas las diapositivas seguidas, 12/10; antes 393679081, carrusel de vídeos) · animado con narrador y subtítulos, etiqueta de IA · colaboradora: ibangutierrezetxaniz |
| 2026-10-23 (vie) | Hábito práctico | Batch cooking en 1 hora | 10:00 | posts/2026-10-23-batch-cooking | 393940779 (reel con todas las diapositivas seguidas, 12/10; antes 393118676, carrusel de vídeos) (antes 392569546, estático) · animado con narrador y subtítulos, etiqueta de IA · colaboradora: ibangutierrezetxaniz |
| 2026-11-16 (lun) | Mito o realidad (movido del 19/10 por las series, decisión de Iván del 12/10) | ¿El azúcar moreno es mejor que el blanco? | 10:00 | posts/2026-10-19-azucar-moreno | 393940824 (reel con todas las diapositivas seguidas, 12/10; antes 393675755, carrusel de vídeos) (antes 393114051) · animado con narrador y subtítulos, etiqueta de IA · colaboradora: ibangutierrezetxaniz |
| 2026-12-02 (mié) | Receta sencilla (movido del 21/10 por las series, decisión de Iván del 12/10) | Arroz salteado con verduras y huevo | 10:00 | posts/2026-10-21-arroz-salteado | 393940881 (reel con todas las diapositivas seguidas, 12/10; antes 393675795, carrusel de vídeos) (antes 393118665) · animado con narrador y subtítulos, etiqueta de IA · colaboradora: ibangutierrezetxaniz |

Reels de la semana: reel con voz (voz real de Iván, subtítulos palabra a palabra e ilustraciones propias), guiones en voz/GUIONES.md. Sustituyen a los reels automáticos sin voz en las mismas publicaciones de Metricool (ver tabla); los reel.mp4 sin voz se conservan como respaldo.

## Métricas · semana del 28 sep (consultadas el 04/10/2026)
- Carruseles: alcance 4-16 personas cada uno (mejor: «Monta tu plato sin pesar nada», 16 de alcance y 38 visualizaciones). Casi sin guardados ni compartidos.
- Reels con voz: «Monta tu plato sin báscula» 100 de alcance y 181 reproducciones (13 s de media); «¿Cenar hidratos engorda?» 46 de alcance, 80 reproducciones y 1 comentario.
- Seguidores: de 6 a 9 (+3). Clics al enlace de la bio: Metricool no da datos todavía.
- Cambio: los reels llegan a 6-10 veces más gente, así que se mantienen los ganchos de mito y lo práctico y cotidiano (plato, táper, meriendas). Más ideas concretas para guardar en los carruseles.

## Métricas · semana del 5 oct (consultadas el 10/10/2026)
- Carruseles: «¿Las verduras congeladas son peores?» 22 de alcance y 59 visualizaciones; «Garbanzos con espinacas» 20 de alcance y 57 visualizaciones (los dos, más que cualquier carrusel de la semana anterior). «Tu táper equilibrado» (viernes) aún sin datos (segunda consulta el 10/10 a las 7:40, todo a 0: Metricool no ha actualizado; va en el informe de la semana del 12). Sin me gusta, guardados ni compartidos.
- Reels sin voz: «3 meriendas en 2 minutos» 33 de alcance, 48 reproducciones, 5,5 s de media y 2 me gusta; «¿La fruta de postre fermenta?» 30 de alcance, 34 reproducciones y 6,7 s de media.
- Seguidores: de 29 (lunes) a 33 (jueves), +4. Alcance de la cuenta: 24-42 personas al día.
- Clics al enlace de la bio: Metricool sigue sin dar datos.
- Lectura: los reels sin voz llegan a menos gente que los de voz de la semana anterior (100 y 46 de alcance) y se ven menos tiempo. Prioridad: conseguir las notas de voz de Iván. Los carruseles mejoran, pero nadie guarda: falta un motivo claro para guardar (lista, chuleta, cantidades).

## Plan · semana del 12 oct
| Fecha | Pilar / formato | Tema | Hora (Madrid) | Estado |
|---|---|---|---|---|
| 2026-10-12 (lun) | Mito o realidad | ¿Las legumbres de bote son peores que las secas? | 10:00 | programado (393114739, animado con narrador) |
| 2026-10-13 (mar) | Reel con narrador · Mito o realidad | ¿Hay que beber 2 litros de agua al día? (sustituye al de legumbres de bote) | 18:00 | programado (393679420) |
| 2026-10-14 (mié) | Receta sencilla | Merluza al horno con patata y verduras en una bandeja | 10:00 | programado (393940366 (reel con todas las diapositivas seguidas, 12/10; antes 393118634, carrusel de vídeos), animado con narrador) |
| 2026-10-15 (jue) | Reel · Hábito práctico | 3 desayunos en 3 minutos | 18:00 | con voz programado (392576485; antes 392568483 sin voz) |
| 2026-10-16 (vie) | Hábito práctico | Lista de la compra básica para la semana (para guardar) | 10:00 | programado (393940467 (reel con todas las diapositivas seguidas, 12/10; antes 393118651, carrusel de vídeos), animado con narrador) |

## Plan · semana del 19 oct
Los reels tienen tema propio y no repiten ningún carrusel (decisión de Iván, 12/10).
| Fecha | Pilar / formato | Tema | Hora (Madrid) | Estado |
|---|---|---|---|---|
| 2026-10-19 (lun) | Mito o realidad · Serie suplementos 1/4 | ¿Necesitas suplementos o te han convencido de que los necesitas? | 10:00 | programado (393679028, animado con narrador) |
| 2026-10-20 (mar) | Reel con narrador · Mito o realidad | ¿El pan engorda? | 18:00 | guion en voz/GUIONES.md |
| 2026-10-21 (mié) | Receta sencilla · Serie salsas caseras 1/6 | Ketchup casero sin azúcar de mesa | 10:00 | programado (393940752 (reel con todas las diapositivas seguidas, 12/10; antes 393679081, carrusel de vídeos), animado con narrador) |
| 2026-10-22 (jue) | Reel con narrador · Hábito práctico | Más verdura sin darte cuenta | 18:00 | guion en voz/GUIONES.md |
| 2026-10-23 (vie) | Hábito práctico | Batch cooking en 1 hora (para guardar) | 10:00 | programado (393940779 (reel con todas las diapositivas seguidas, 12/10; antes 393118676, carrusel de vídeos), animado con narrador) |

## Series de lunes y miércoles (decisión de Iván del 12/10/2026)
Desde el 19/10, los carruseles de los lunes son la **serie de suplementos** y los de los miércoles la **serie de salsas caseras**. Guiones diapositiva a diapositiva en `/mnt/project-files/contenido/series-suplementos-y-salsas.md` (carpeta del proyecto de Claude); las fechas de ese archivo quedan corridas una semana porque la serie empezó el 19/10. Cada pieza va con la plantilla de siempre (animada, con narrador «santa» y subtítulos).
| Fecha | Serie | Pieza | Estado |
|---|---|---|---|
| 2026-10-19 (lun) | Suplementos 1/4 | ¿Necesitas suplementos o te han convencido de que los necesitas? | programado (393679028) |
| 2026-10-21 (mié) | Salsas 1/6 | Ketchup casero sin azúcar de mesa | programado (393940752 (reel con todas las diapositivas seguidas, 12/10; antes 393679081, carrusel de vídeos)) |
| 2026-10-26 (lun) | Suplementos 2/4 | Lo que comes le gana al bote | por hacer |
| 2026-10-28 (mié) | Salsas 2/6 | Mayonesa casera segura | por hacer |
| 2026-11-02 (lun) | Suplementos 3/4 | Más no es mejor: el riesgo de las vitaminas A, D, E y K | por hacer |
| 2026-11-04 (mié) | Salsas 3/6 | Alioli de yogur | por hacer |
| 2026-11-09 (lun) | Suplementos 4/4 | Proteína, colágeno y quemagrasas: lo que pagas y lo que obtienes | por hacer |
| 2026-11-11 (mié) | Salsas 4/6 | Salsa barbacoa casera | por hacer |
| 2026-11-16 (lun) | (fin de la serie) | ¿El azúcar moreno es mejor que el blanco? | programado (393940824 (reel con todas las diapositivas seguidas, 12/10; antes 393675755, carrusel de vídeos)) |
| 2026-11-18 (mié) | Salsas 5/6 | Salsa rosa (cóctel) de yogur | por hacer |
| 2026-11-25 (mié) | Salsas 6/6 | Salsa César de yogur | por hacer |
| 2026-12-02 (mié) | (fin de la serie) | Arroz salteado con verduras y huevo | programado (393940881 (reel con todas las diapositivas seguidas, 12/10; antes 393675795, carrusel de vídeos)) |

## Temas usados

- Mito: huevo y colesterol
- Mito: hidratos por la noche
- Receta: lentejas con verduras (legumbre de bote)
- Receta: crema de calabaza
- Hábito: leer una etiqueta nutricional
- Hábito: método del plato (½ verdura, ¼ proteína, ¼ hidratos)
- Mito: verduras congeladas frente a frescas
- Receta: garbanzos con espinacas (legumbre de bote)
- Hábito: táper equilibrado y seguridad del táper
- Reel mito: la fruta de postre «fermenta»
- Reel hábito: 3 meriendas sencillas
- Mito: legumbres de bote frente a secas
- Receta: merluza al horno con patata y verduras en bandeja
- Hábito: lista de la compra básica semanal
- Reel mito: legumbres de bote frente a secas (con voz)
- Reel hábito: tu vida, no la de un influencer (muñeca rusa; personalizar y pequeños hábitos frente a las promesas de redes)
- Reel hábito: 3 desayunos en 3 minutos (con voz)
- Mito: azúcar moreno frente a blanco
- Receta: arroz salteado con verduras y huevo
- Hábito: batch cooking en 1 hora
- Reel mito: ¿hay que beber 2 litros de agua al día? (con narrador)
- Serie suplementos 1: ¿los necesitas o te han convencido?
- Serie salsas 1: ketchup casero

## Banco de temas

Mito o realidad
- ¿La fruta de noche engorda?
- ¿Hay que quitar el gluten sin ser celíaco? (el pan engorda: reel del 20/10)

Receta sencilla
- Bol de yogur natural con fruta y avena
- Hummus casero con crudités
- Tortilla de calabacín al horno

Hábito práctico
- Cómo añadir más legumbre a la semana
