# Claude Banana

**Le dices que imagen quieres. Te escribe las instrucciones perfectas para crear esa imagen.**

Eso es todo. Eso es lo que hace Claude Banana.

---

## El Problema

Quieres que la IA te haga una imagen. Escribes "un atardecer bonito." Recibes... algo mas o menos. Pero no lo que imaginabas.

**Por que?** Porque los generadores de imagenes necesitan instrucciones muy especificas. Entre mas detalles les des — iluminacion, angulo de camara, colores, atmosfera, texturas — mejor sera el resultado. Pero escribir esas instrucciones detalladas es dificil y requiere practica.

## La Solucion

Claude Banana es tu **asistente creativo**. Tu describes lo que quieres en tus propias palabras, y el:

1. **Te hace unas preguntas rapidas** para entender tu vision
2. **Construye un prompt detallado y optimizado** usando una formula probada
3. **Te da un prompt listo para copiar** que obtiene resultados increibles de los generadores de imagenes

Piensa en el como tener un fotografo profesional en tu bolsillo que traduce "quiero un atardecer bonito" en un parrafo de instrucciones perfectas que la IA realmente entiende.

---

## Como Usarlo

### Paso 1: Instala Claude Code

Instala [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (la herramienta de linea de comandos de Anthropic).

### Paso 2: Descarga Este Proyecto

```bash
git clone https://github.com/Hainrixz/claude-banana.git
cd claude-banana
```

### Paso 3: Inicia Claude y Pide

```bash
claude
```

Luego simplemente describe lo que quieres con tus propias palabras:

```
"Ayudame a crear un prompt para una cafeteria acogedora con luz calida y un gato dormido sobre unos libros"
```

Claude automaticamente detecta el agente prompt-architect y la base de conocimiento de este proyecto. Te hara un par de preguntas (como "Cual es el ambiente?" o "Donde vas a usar esta imagen?"), y luego te dara un prompt perfecto listo para pegar en cualquier generador de imagenes.

---

## Que Lo Hace Especial

### La Formula de 7 Ingredientes

Cada prompt que Claude Banana crea tiene 7 ingredientes cuidadosamente balanceados:

| Ingrediente | Que Hace | Ejemplo |
|------------|---------|---------|
| **Sujeto** | Quien o que esta en la imagen | "Un gato gris atigrado acurrucado sobre una pila de libros" |
| **Estilo** | Como se ve visualmente | "Ilustracion en acuarela calida con bordes suaves" |
| **Entorno** | Donde sucede | "Dentro de una pequena cafeteria-libreria con estantes de madera" |
| **Iluminacion** | Como cae la luz en la escena | "Luz dorada de tarde entrando por un ventanal" |
| **Accion** | Que esta pasando | "El gato duerme con una pata sobre el lomo de un libro" |
| **Camara** | Como esta encuadrada la foto | "Primer plano a nivel de los ojos, angulo ligeramente elevado" |
| **Textura** | Como se sienten las cosas | "Cubiertas de cuero gastado, pelaje suave, vapor subiendo de una taza" |

### 9 Modos de Especialidad

El agente ajusta su formula dependiendo de que tipo de imagen quieres:

- **Cine** — Escenas dramaticas tipo pelicula
- **Producto** — Fotos de producto limpias y profesionales
- **Retrato** — Fotos hermosas de personas
- **Moda** — Looks editoriales tipo revista
- **UI/Web** — Iconos de apps, disenos web, interfaces
- **Logo** — Marcas y simbolos
- **Paisaje** — Naturaleza y ambientes
- **Abstracto** — Patrones y texturas artisticas
- **Infografia** — Graficos, datos visuales, diagramas

### 70+ Tecnicas Creativas

Quieres algo especial? El agente sabe como hacer cosas como:

- Convertir fotos a **estilo anime/Ghibli**
- Crear **mundos miniatura dentro de bolas de cristal**
- Hacer que personajes **salgan rompiendo marcos de fotos**
- Mezclar **dibujos a lapiz con fotos reales**
- Construir **ciudades miniatura con efecto tilt-shift**
- Disenar iconos en **arte voxel/pixel**
- Y 60+ efectos creativos mas

### Funciona Con Tus Prompts Existentes

Ya tienes prompts de Midjourney, DALL-E o Stable Diffusion? Pegalos y Claude Banana los convierte para que funcionen mejor con Nano Banana Pro (el generador de imagenes de Google).

### Presets de Marca

Haciendo imagenes para una marca? Carga un preset con los colores, estilo y ambiente de tu marca para que cada imagen mantenga consistencia.

---

## Que Hay Adentro

```
claude-banana/
  knowledge/           -- El cerebro: todo lo que el agente sabe sobre hacer buenos prompts
  templates/examples/  -- 25 plantillas de prompts listas para usar y personalizar
  presets/             -- Presets de estilo de marca (colores, tipografia, ambiente)
  scripts/             -- Herramientas Python para generar imagenes directamente
  .claude/agents/      -- El agente en si
```

### Opcional: Genera Imagenes Directamente

Si tienes una API key de Google AI (gratis en [aistudio.google.com](https://aistudio.google.com/apikey)), puedes generar imagenes sin salir de tu terminal:

```bash
# Verifica tu configuracion
python3 scripts/validate_setup.py

# Genera una imagen desde un prompt
python3 scripts/generate.py --prompt "tu prompt optimizado aqui"

# Genera desde una plantilla con valores personalizados
python3 scripts/generate.py --template templates/examples/cinematic-landscape.md \
  --vars '{"location": "lago de montana", "time_of_day": "atardecer"}'

# Edita una imagen existente
python3 scripts/edit.py --image foto.png --instruction "hazlo ver como otono"

# Genera un lote de variaciones
python3 scripts/batch.py --template templates/examples/product-showcase.md \
  --variations mis_productos.json
```

---

## Quieres Contribuir?

Nos encantaria tu ayuda! Puedes:

- **Compartir una plantilla de prompt** — Abre un issue con tu prompt favorito
- **Agregar una tecnica** — Documenta una nueva tecnica creativa
- **Mejorar el conocimiento** — Haz que las guias de referencia sean aun mejores
- **Corregir bugs** — Envia un pull request

Mira las [plantillas de issues](.github/ISSUE_TEMPLATE/) para formularios de envio faciles.

---

## Licencia

MIT — libre de usar, modificar y compartir. Ver [LICENSE](LICENSE).

---

**[Read in English / Leer en Ingles](README.md)**
