# Prompt Engineering Master Reference

A working guide for crafting high-quality image generation prompts. Every technique here is battle-tested and organized for quick lookup during active prompt construction.

---

## 1. The Specificity Hierarchy

Prompt quality maps directly to specificity. There are four distinct levels, and each jump upward produces a noticeable improvement in output fidelity.

### Level 1: Vague
The prompt gestures at a concept without committing to anything concrete.

- "A nice photo"
- "Something cool looking"
- "A portrait"

Results at this level are generic, unpredictable, and rarely usable. The model fills in every missing detail with its own median assumptions.

### Level 2: Generic
The prompt names a subject and a basic context but stays in safe, interchangeable territory.

- "A woman standing in a city at night"
- "A plate of food on a wooden table"
- "A dog running through a field"

You get recognizable scenes, but they feel like stock photography. Nothing anchors the image to a specific reality.

### Level 3: Specific
The prompt commits to concrete details — age, setting, materials, time of day, mood.

- "A 30-year-old woman in a dark green linen blazer, standing on a rain-slicked Tokyo side street at 11pm, neon signs reflecting off wet asphalt"
- "A bowl of hand-pulled biang biang noodles in chili oil with pickled mustard greens, served on a scratched marble counter under a single warm pendant light"
- "A border collie mid-leap catching a frisbee in a sun-bleached Wyoming meadow, late August afternoon"

This is where outputs start to feel intentional. The model has enough constraints to produce something with character.

### Level 4: Visceral
The prompt reaches into micro-details that make a viewer feel physical presence in the scene.

- "A 24-year-old woman with olive skin, hazel eyes, and baby hairs catching the light along her temples, wearing a rumpled ivory silk camisole, leaning against a plaster wall with hairline cracks, 6:40am light hitting the left side of her face, a half-drunk espresso with a crescent lipstick mark on the rim sitting on the windowsill behind her"
- "Close-up of a 58-year-old fisherman's hands — salt-cracked knuckles, a faded anchor tattoo on the left wrist, three silver rings worn smooth, holding a wet hemp rope with frayed ends, sea spray misting across the foreground"

Visceral detail works because it forces the model to render with the kind of granularity that only exists in real, observed moments. When you specify baby hairs, salt-cracked knuckles, or a lipstick mark on a cup, you are implicitly demanding the resolution and attention to detail of a skilled photographer who noticed those things. The model rises to meet the implied standard.

**The core principle:** Age, ethnicity, and micro-features always outperform generic descriptions. "A 24-year-old with olive skin, hazel eyes, and baby hairs along the temples" produces dramatically better results than "a young woman" because it eliminates thousands of ambiguous possibilities and forces the model into a narrow, high-fidelity rendering target.

---

## 2. Sensory Detail Injection

The fastest way to elevate a competent prompt into a remarkable one is to layer in sensory micro-textures that most people forget to specify.

### Micro-Textures That Elevate Quality

These small details signal "high production value" to the model:

- **Skin:** Subsurface scattering visible at ear edges and fingertips, peach fuzz catching backlight, visible pores on a close crop, the slight sheen of moisturized skin vs. matte foundation
- **Eyes:** Catch lights (the white reflection dots that make eyes look alive), visible iris texture, wet lower lash line, the red inner corner of the eye
- **Sweat and moisture:** Individual droplets on a cold glass, condensation trails, dew on morning petals, the wet sheen on someone's collarbone after a run
- **Hair:** Individual strand flyaways, the way light passes through thin edges, root shadow vs. mid-shaft color

### Material Descriptions

Replace every generic noun with a material-specific one:

| Weak | Strong |
|------|--------|
| old book | weathered leather journal with gilt-edged pages |
| nice watch | brushed titanium dive watch with a scratched sapphire crystal |
| coffee cup | handmade stoneware mug with an uneven glaze drip |
| wooden desk | reclaimed oak desk with visible ring stains and pen gouges |
| glass bottle | hand-blown green glass apothecary bottle with a cork stopper |

### Tactile Language

Words that carry inherent texture trigger richer rendering. Build a working vocabulary:

- **Soft surfaces:** velvety, plush, hand-tufted, brushed, napped, chenille
- **Rough surfaces:** weathered, pitted, sandblasted, raw-hewn, bark-textured
- **Cold/smooth surfaces:** frosted, polished, mirror-finished, lacquered, glazed
- **Warm surfaces:** sun-baked, oiled, waxed, patinated, honey-toned

### Brand Names as Visual Shorthand

Specific brand names carry enormous visual information because the model has seen thousands of images associated with each one:

- "Tom Ford charcoal suit" triggers slim-cut, peak-lapel, editorial-quality tailoring
- "Lululemon Align leggings" triggers specific fabric sheen, body-contour fit, studio setting associations
- "Aesop amber glass bottle" triggers minimalist, apothecary-style, matte label aesthetics
- "Le Creuset Dutch oven in Marseille blue" triggers specific color, cast iron weight, kitchen warmth
- "Eames lounge chair" triggers mid-century modern, molded plywood, black leather, specific proportions

Use brand references not for product placement but as precision tools. They compress paragraphs of description into two or three words.

---

## 3. Authority Anchoring

Models are trained on images that are tagged, captioned, and contextualized. When you invoke the name of a prestigious publication, photographer, or equipment standard, you bias the model toward the production quality associated with that source.

### Publication References

Each publication carries a distinct visual signature:

- **Vanity Fair editorial** — dramatic lighting, strong poses, celebrity-level grooming, rich tonal contrast
- **National Geographic feature** — saturated natural color, storytelling composition, environmental context, human-scale perspective in vast landscapes
- **Architectural Digest interior** — precise symmetry, curated objects, natural light flooding through large windows, lived-in luxury
- **Magnum Photos documentary** — raw grain, decisive moment composition, unflinching humanity, black and white with deep blacks
- **Pulitzer Prize-winning photograph** — emotional intensity, journalistic framing, frozen-action clarity, narrative weight

Prepend these to your prompt: "In the style of a Vanity Fair editorial portrait..." immediately sets a quality floor.

### Camera and Equipment Naming

Specific camera models anchor the output to the optical characteristics of real hardware:

- **Sony A7R IV** — high resolution, clinical sharpness, excellent dynamic range, slightly cool rendering
- **Canon EOS R5** — natural skin tones, slight warmth, smooth bokeh
- **iPhone 16 Pro Max** — computational photography look, deep depth of field, natural but processed feel
- **Hasselblad X2D** — medium format rendering, shallow depth transitions, extraordinary detail
- **85mm f/1.4** — portrait compression, creamy out-of-focus areas, subject isolation
- **35mm f/1.8** — environmental portrait, moderate distortion, context-inclusive framing
- **24mm f/2.8** — wide environmental, slight barrel distortion at edges, immersive perspective

### Film Stock References

For cinematic and analog aesthetics, name the stock:

- **Kodak Vision3 500T** — tungsten-balanced, warm shadows, cinema-grade grain, slightly teal highlights
- **Fuji Pro 400H** — pastel highlight rendering, soft greens, flattering skin tones, fine grain
- **Kodak Portra 800** — warm midtones, grain visible but pleasing, slightly lifted blacks
- **Ilford HP5** — high-contrast black and white, coarse grain, gritty documentary feel
- **CineStill 800T** — halation around highlights (red glow bleed), neon-friendly, night photography signature look

### Studio and Brand Aesthetics

Some brand visual identities are so well-established they function as single-word style guides:

- **Apple product photography** — infinite white background, single dramatic shadow, obsessive material rendering, one hero light source
- **Bang & Olufsen minimalism** — negative space, brushed aluminum, Scandinavian restraint, museum-like presentation
- **Wes Anderson** — centered symmetry, pastel palette, flat staging, dollhouse perspective
- **Terrence Malick** — golden hour backlighting, handheld intimacy, nature intercuts, magic-hour haze

---

## 4. Composition & Framing

### Camera Specification Framework

For maximum control, specify the full technical stack:

**Lens type** → **Aperture** → **ISO** → **Color temperature** → **Angle**

Example: "Shot on 85mm f/1.4, ISO 200, 4200K warm white balance, slightly below eye level, shallow depth of field with background dissolved into soft circles of light."

This level of specification does not guarantee the model simulates actual optics, but it anchors the output to the visual characteristics associated with those settings.

### Shot Types and When to Use Each

- **Macro (1:1 or closer):** Product texture detail, food photography close-ups, jewelry, botanical specimens. Extremely shallow depth of field, one plane in focus.
- **Close-up (head and shoulders):** Emotional portraits, beauty photography, expressing subtle facial detail. Background becomes irrelevant.
- **Medium shot (waist up):** Editorial fashion, conversational portraits, product-in-use scenarios. Balances subject detail with context.
- **Wide shot (full body + environment):** Establishing shots, architectural context, landscape with human scale. Subject becomes part of the scene rather than dominating it.
- **Telephoto compression (200mm+):** Stacking distant elements together, flattening perspective, isolating a subject from a busy environment. Creates that "pulled in" look common in street photography and sports.
- **Over-the-shoulder:** Narrative framing, implying a viewer/participant, creating depth through foreground framing. Powerful for storytelling sequences.
- **Aerial/drone perspective:** Patterns, scale revelation, geographic context. Specify altitude for different effects — 10 meters gives intimate overhead, 100 meters gives map-like abstraction.

### Negative Space and Centered Isolation

Negative space is one of the most underused tools in prompt engineering. Explicitly calling for it produces cleaner, more impactful compositions:

- "Subject centered in frame with 60% negative space, plain backdrop"
- "Isolated figure in the lower-right third, vast empty sky filling the upper two-thirds"

Centered isolation (subject dead-center, surrounded by uniform space) triggers the model's associations with high-end product photography, album covers, and editorial layouts.

### Grid Layouts

For multi-image outputs or structured compositions:

- **2x2 grid:** Four variations of one concept, comparison layouts, before/after pairs
- **3x3 grid:** Product color variations, expression sheets, character turnarounds
- **Bento grid (8 modules):** Mixed-size panels — one large hero image with smaller supporting detail shots arranged asymmetrically. Specify: "bento grid layout, 8 panels, one large hero panel on the left, smaller detail panels on the right"
- **Sequential manga panels:** Left-to-right or top-to-bottom narrative flow, varying panel sizes for pacing emphasis

### Forced Perspective and Tilt-Shift

- **Forced perspective:** "Toy-like miniature effect" or "person appearing to hold a distant building" — specify the spatial relationship explicitly
- **Tilt-shift:** "Tilt-shift lens effect making the real scene appear as a miniature model, selective focus band across the middle third" — powerful for cityscapes and crowd scenes

### Layered Depth Composition

Specify three depth planes with different treatments:

"Foreground: out-of-focus wildflowers creating a soft color wash. Midground: subject in tack-sharp focus, sitting on a fallen log. Background: misty pine forest dissolving into atmospheric haze."

This three-layer approach produces images with cinematic depth that flat compositions cannot achieve.

---

## 5. Lighting Mastery

Light is the single biggest quality differentiator in generated images. A mediocre subject under masterful lighting will always outperform a perfect subject under flat, default lighting. Spend more prompt budget on lighting than on any other single element.

### Direction Specification

Never say "good lighting." Always say where the light is coming from:

- **Camera-left key light:** Most common studio setup, creates gentle modeling shadows on the right side of the face
- **Rembrandt lighting:** Key light at 45 degrees above and to one side, creating a triangle of light on the shadow-side cheek. Named after the painter who used this consistently. Specify: "Rembrandt lighting with the characteristic triangle on the left cheek"
- **Rim lighting (backlight):** Light source behind the subject, creating a bright outline that separates them from the background. "Strong rim light creating a bright edge along the shoulders and hair"
- **Three-point setup:** Key (main), fill (shadow-side, softer), back (separation). "Classic three-point lighting: key from camera-right, soft fill from camera-left at half intensity, backlight for hair separation"
- **Butterfly lighting:** Light directly above and in front, creating a symmetrical shadow under the nose. Glamour and beauty photography standard.
- **Split lighting:** Light hitting exactly one half of the face, the other half in shadow. Dramatic, moody, often used for musicians and actors.

### Color Temperature for Emotional Tone

Color temperature is measured in Kelvin and directly controls the emotional register of an image:

- **2200K (candlelight):** Extreme warmth, intimacy, romance, nostalgia, quiet evenings
- **2700K (warm tungsten):** Cozy interiors, restaurant ambiance, golden skin tones
- **3500K (warm neutral):** Comfortable but not overtly warm, modern residential interiors
- **4500K (neutral daylight):** Clean, balanced, no emotional bias, product photography standard
- **5500K (midday sun):** Bright, energetic, outdoor clarity
- **6500K (overcast/cool):** Clinical, melancholic, institutional, winter light
- **8000K+ (deep shade/blue hour):** Cold, isolating, ethereal, twilight atmosphere

### Natural vs. Studio vs. Cinematic Lighting

- **Natural light** — unpredictable, organic, one dominant source (sun or sky). Best for: environmental portraits, lifestyle, documentary. Specify: "natural window light only, no artificial sources"
- **Studio light** — controlled, repeatable, multiple sources with modifiers. Best for: product, beauty, fashion editorial. Specify: "studio lighting with octabox key and white v-flat fill"
- **Cinematic light** — motivated by story (a lamp in frame, headlights, a fire), often colored, atmospheric. Best for: narrative scenes, mood pieces, character moments. Specify: "cinematic practical lighting from the desk lamp in frame, warm pool of light surrounded by shadow"

### Golden Hour, Blue Hour, Magic Hour

These are not interchangeable:

- **Golden hour:** The first and last hour of direct sunlight. Long horizontal rays, warm orange-gold tone, long shadows, flattering on skin. "Late golden hour, sun 10 degrees above horizon, long shadows stretching left"
- **Blue hour:** The 20-40 minutes after sunset (or before sunrise) when the sky turns deep saturated blue but ambient light remains. City lights start appearing. "Blue hour, deep cobalt sky, warm artificial lights in windows creating contrast"
- **Magic hour:** A colloquial term that usually refers to the transition between golden hour and blue hour — the sky has multiple color bands from warm horizon to cool zenith.

### Atmospheric Light Effects

- **Volumetric light rays:** Visible shafts of light passing through dust, fog, or gaps. "Volumetric god rays streaming through the cathedral's clerestory windows, dust particles visible in the beams"
- **God rays (crepuscular rays):** Specifically the fan-shaped light beams breaking through clouds. "Dramatic god rays breaking through storm clouds, illuminating a single patch of green hillside"
- **Lens flare:** Intentional optical artifact from shooting toward a light source. Use sparingly. "Subtle warm lens flare from the setting sun entering frame at the upper left"

### Product Photography Lighting

- **Softbox diffusion:** "Large softbox directly above, creating even diffused light with soft shadows underneath, product photography style"
- **Light tent:** "Object inside a light tent, shadowless even illumination from all sides, pure white background"
- **Gradient background:** "Single strip light from the left, dark-to-light gradient on the seamless backdrop, dramatic product reveal"

---

## 6. Color & Palette Control

### Hex Color Specification

Do not say "blue." Say which blue. Hex codes give you precision:

- `#2563EB` — a vivid medium blue (think: hyperlink blue, tech-forward)
- `#DC2626` — a clear warning red (think: alert, passion, urgency)
- `#059669` — a balanced teal-green (think: wellness, growth, calm energy)
- `#7C3AED` — a saturated violet (think: creativity, premium, unconventional)
- `#F59E0B` — a warm amber (think: warmth, optimism, craft)

"Color palette restricted to #1E293B (dark slate), #F8FAFC (near-white), and #F59E0B (amber accent)" gives the model a precise three-color constraint to work within.

### Coordinated Color Schemes

- **Complementary (opposites on the wheel):** High contrast, vibrant energy. "Complementary palette of deep navy and burnt sienna"
- **Analogous (neighbors on the wheel):** Harmonious, unified, low tension. "Analogous palette of sage green, seafoam, and pale teal"
- **Triadic (three equidistant points):** Balanced vibrancy. "Triadic palette of coral, teal, and soft gold"
- **Monochromatic (one hue, varied saturation/value):** Sophisticated, cohesive. "Monochromatic blues ranging from #1E3A5F to #BFDBFE"

### Color Temperature as Emotional Lever

Color temperature in post-processing is separate from lighting color temperature, though they interact:

- Push overall color temperature warm (add yellow/orange cast) for: nostalgia, comfort, summer, intimacy
- Push cool (add blue/teal cast) for: modernity, isolation, winter, technology, tension
- Split toning (warm shadows + cool highlights) for: cinematic depth, visual sophistication

### Platform-Specific Color Expectations

Different platforms have evolved distinct color norms:

- **Instagram:** Warm, slightly saturated, golden tones, lifestyle warmth
- **LinkedIn:** Cool neutrals, corporate blues and grays, clean professionalism
- **Pinterest:** Bright, high-saturation, aspirational palettes, strong color blocking
- **Editorial/print:** Muted, film-like, desaturated slightly, sophisticated restraint

### Color Grading References

Name the grade to invoke its full palette:

- **Teal-orange (blockbuster cinema):** Cool shadows, warm skin tones, the dominant look of modern action and drama films. "Teal-orange color grade, cool blue-green shadows with warm orange skin tones"
- **Black-gold (luxury):** Deep true blacks with warm gold highlights and accents. "Black and gold color grade, deep shadows, warm metallic highlights, luxury aesthetic"
- **High-key white (tech/medical):** Blown-out whites, minimal shadow, ultra-clean. "High-key color grade, predominantly white with subtle gray tones, clinical cleanliness"
- **Bleach bypass (desaturated contrast):** Reduced saturation with increased contrast, gritty and raw. "Bleach bypass grade, desaturated with crushed blacks, war-correspondent feel"
- **Pastel wash (editorial fashion):** Lifted shadows, reduced contrast, soft candy-colored cast. "Pastel color grade, lifted shadows, soft pink-lavender cast, editorial fashion mood"

---

## 7. Positive Framing (Critical for Gemini)

Gemini's image generation API has no negative prompt parameter. This is not a minor limitation — it is a fundamental constraint that must shape every prompt you write. You cannot tell Gemini what to exclude. You can only tell it what to include.

### The Core Rule

Every exclusion must be reframed as a positive description of what you want instead. This requires a mental inversion that becomes automatic with practice but feels unnatural at first.

### Conversion Reference Table

| What You Want to Avoid | Positive Reframing |
|---|---|
| No blur | Sharp focus, tack-sharp detail, crisp edges, pin-sharp resolution |
| No people | Empty space, deserted scene, uninhabited environment, solitary stillness |
| No text or watermarks | Clean surface, uncluttered, text-free, pristine and unmarked |
| Not dark | Brightly lit, high-key lighting, luminous, well-exposed, daylight-flooded |
| No background clutter | Minimal backdrop, clean negative space, solid-color background, seamless studio backdrop |
| Not blurry background | Deep depth of field, everything in sharp focus, f/11 landscape sharpness |
| No harsh shadows | Soft diffused lighting, overcast even illumination, fill light eliminating hard shadows |
| Not overexposed | Properly exposed, balanced highlights, detail retained in bright areas |
| No grain or noise | Clean sensor output, low-ISO smoothness, noise-free rendering |
| Not cropped awkwardly | Full figure visible, complete composition with breathing room, generous framing |
| No artificial look | Natural rendering, lifelike skin texture, organic imperfections |
| Not symmetrical | Dynamic asymmetrical composition, rule-of-thirds placement, organic arrangement |
| No warm tones | Cool color temperature, blue-cast lighting, 6500K daylight white balance |
| Not static | Dynamic motion, mid-action pose, implied movement, wind-blown elements |

### Emphasis Through Capitalization

When a constraint is non-negotiable, use ALL CAPS to weight it:

- "MUST contain exactly three figures standing in a triangle formation"
- "ABSOLUTELY lifelike rendering with natural skin texture, no illustration or cartoon style"
- "EXACTLY four items on the table, no more, no fewer"

This is not guaranteed to work, but empirically it biases outputs toward compliance.

### Prompt Position Weighting

Models tend to weight content that appears earlier in the prompt more heavily than content buried at the end. Structure your prompts accordingly:

1. **First third:** Critical constraints, style directives, non-negotiable requirements
2. **Middle third:** Subject description, scene setting, environmental details
3. **Final third:** Atmospheric refinements, secondary details, nice-to-haves

If something absolutely must be present (or must characterize the output), put it in the opening sentence.

---

## 8. Search-Grounded Generation

When you need the generated image to reflect real, current, or factual information, use a three-part formula that chains search retrieval into visual output.

### The Three-Part Formula

**[Source/search request]** + **[Analytical task]** + **[Visual translation]**

### Worked Examples

**Data visualization:**
"Search the current top 5 programming languages by popularity in 2026. Analyze their relative market share percentages. Generate a clean horizontal bar chart infographic with each language's official logo, percentage labels, modern dark theme with #0F172A background and #38BDF8 accent bars, clean sans-serif typography."

**Current events:**
"Search for the tallest buildings completed in 2025. Create a comparison infographic showing their silhouettes to scale, labeled with name, city, and height in meters, minimal white background, architectural line-drawing style."

**Competitive analysis:**
"Search the top 5 project management tools by user count. Generate a feature comparison grid with checkmarks and crosses, each tool's brand color as its column header, clean tabular layout suitable for a slide deck."

### When to Use Search-Grounding

- Any prompt requiring factual numbers, dates, or rankings
- Content that references current events or recent developments
- Data-driven infographics where accuracy matters
- Comparison content where you need real feature sets or specifications

### When NOT to Use It

- Purely creative or artistic generation where facts are irrelevant
- Character or portrait work
- Abstract or conceptual imagery

---

## 9. Character Consistency

Maintaining a recognizable character across multiple generated images is one of the hardest challenges in image generation. These techniques improve consistency significantly.

### First Generation: The Anchor Image

Your first generation of a character should be exhaustively detailed. This becomes the reference point for everything that follows.

Include: exact age, skin tone, eye color, eye shape, hair color, hair texture, hair length, hair style, face shape, nose shape, lip shape, brow thickness, any distinctive marks (moles, scars, freckles, dimples), body type, height implication, and a signature outfit or accessory.

Example: "A 32-year-old East Asian woman with warm beige skin, monolid dark brown eyes, straight black hair cut in a sharp bob that ends exactly at her jawline, a small beauty mark below her left eye, strong angular jawline, thin arched eyebrows, wearing a charcoal oversized wool coat and silver hoop earrings."

### Follow-Up Generations: Key Identifiers

Once you have a successful anchor image, subsequent prompts should reference "the same character" plus two or three of the most distinctive visual identifiers:

- "The same woman with the sharp black bob, beauty mark below her left eye, and angular jawline — now sitting at a cafe table, different outfit: white turtleneck and reading glasses"
- "The same woman (black bob, beauty mark, angular jaw) — running through rain, wearing a navy trench coat, hair wet and clinging to her face"

The identifiers should be the features that are most visually distinctive and least likely to be shared with a generic face.

### Multi-Image Reference Technique

When the model supports image uploads, provide four to five reference images of your character from different angles and in different conditions. Assign clear labels:

"Character A is the red-haired knight shown in the uploaded reference images. Generate Character A sitting on a throne, wearing the same armor but with the helmet removed, in a torch-lit stone hall."

More reference images generally improve consistency, but diminishing returns set in past five or six.

### Identity Preservation from Reference Photos

When working from a real person's photo as reference, the model can maintain their features across new scenarios. The key is specifying which features to preserve and which to change:

"Maintain the subject's exact facial features, skin tone, and eye color from the reference photo. Change: environment to a rooftop garden at sunset, outfit to a linen shirt, expression to a relaxed smile."

### Consistency Across Style Transformations

When converting a character across different visual styles (photorealistic to illustration, illustration to pixel art), explicitly name the features that must survive the transformation:

"Convert to Studio Ghibli animation style. PRESERVE: the sharp black bob haircut, beauty mark placement, angular jawline, silver hoop earrings. Adapt all other features to the Ghibli aesthetic."

---

## 10. Iterative Refinement

Single-shot prompting — writing one prompt and expecting perfection — works sometimes but fails often, especially for complex scenes. Chat-based iterative refinement is usually more efficient.

### Effective Iteration Patterns

Instead of vague intensifiers ("make it better," "more realistic"), use specific descriptors:

- "The lighting is too flat — add a strong key light from camera-left with visible shadow falloff"
- "The background is too busy — simplify to a single-color gradient, dark teal to black"
- "The skin looks plasticky — add visible pore texture, subsurface scattering at the ear edges, and natural color variation"
- "The composition feels static — tilt the camera 5 degrees clockwise and add wind movement to the hair and clothing"

Each iteration should change exactly one or two things. If you change everything at once, you cannot learn which modifications improved the output.

### When to Iterate vs. Start Fresh

**Iterate when:**
- The fundamental composition, subject, and framing are correct
- You need to adjust lighting, color, detail level, or mood
- A specific element needs refinement but the rest is working

**Start fresh when:**
- The composition is fundamentally wrong (subject in wrong position, wrong camera angle)
- The style interpretation went in a completely wrong direction
- Multiple core elements need changing simultaneously
- You have iterated more than four or five times without converging on improvement

### Building a Prompt Library

Every successful prompt is a future template. When you get a result you like:

1. Save the exact prompt text
2. Tag it with category (portrait, product, landscape, infographic, etc.)
3. Note which specific phrases seemed to have the most impact
4. Create a stripped-down template version with replaceable slots

Over time, your library of proven prompt structures becomes more valuable than any guide, because it reflects what actually works with the specific models you use.

---

## 11. Narrative Prose vs. Keyword Lists

### Why Sentences Outperform Tag Lists

Image generation models — Gemini in particular — are trained on image-text pairs where the text is descriptive natural language, not comma-separated keyword dumps. The model's understanding of spatial relationships, temporal context, and emotional tone is encoded in its language processing, which expects grammatical sentences.

Compare:

**Keyword approach:** "woman, portrait, studio, dramatic lighting, black background, Canon EOS R5, 85mm, f/1.4, editorial, high fashion, sharp focus, 4K"

**Narrative approach:** "A studio portrait of a woman photographed on a Canon EOS R5 with an 85mm lens at f/1.4. She is lit by a single dramatic key light from the upper left against a pure black background. The image has the polished, deliberate quality of a high-fashion editorial, with tack-sharp focus on her eyes and a gradual falloff into creamy bokeh around her shoulders."

The narrative version communicates the same technical specifications but also conveys spatial relationships (where the light comes from, where focus falls) and qualitative intent (polished, deliberate) that the keyword list cannot express.

### How to Structure a Prompt as a Story

Think of your prompt as a very short piece of descriptive writing with three beats:

1. **Set the scene:** Establish the environment, time, weather, mood. "A rain-soaked Brooklyn rooftop at dusk, the skyline softened by low clouds, puddles reflecting the last amber light."
2. **Introduce the subject:** Place the subject in the scene with specific physical details. "A woman in her late twenties stands near the edge, her dark curly hair pulled back loosely, wearing a worn olive field jacket and mud-stained boots."
3. **Describe the atmosphere:** Add the sensory and emotional layer. "The light catches the rain on her jacket's shoulders, and there is a quiet exhaustion in her posture — someone who has been up here for a while, thinking."

### Prompt Length Sweet Spots

Based on practical results across current models:

- **50-100 words:** Sufficient for simple subjects with clear style direction. Product shots, simple portraits, icons.
- **100-200 words:** The sweet spot for most standard generation tasks. Enough room for subject detail, lighting, composition, and mood.
- **200-300 words:** Appropriate for complex scenes with multiple subjects, specific spatial arrangements, or layered technical requirements.
- **300+ words:** Diminishing returns begin. The model may lose coherence on early details as it processes later ones. If your prompt exceeds 300 words, consider whether some details are redundant or whether you should split the generation into multiple focused prompts.

The ideal prompt is long enough to eliminate ambiguity but short enough that every word is load-bearing. If you can remove a phrase without changing the output, remove it.

---

## Quick Reference: Prompt Construction Checklist

Before submitting any prompt, verify you have addressed:

- [ ] **Subject:** Specific, with visceral detail (Level 3-4 on the hierarchy)
- [ ] **Style anchor:** Publication, photographer, camera, or brand reference
- [ ] **Lighting:** Direction, quality, color temperature — never left to default
- [ ] **Composition:** Shot type, framing, depth plane assignments
- [ ] **Color:** Palette specified with hex codes or named grade
- [ ] **Constraints:** Framed positively, critical ones in ALL CAPS, placed early
- [ ] **Format:** Written as narrative prose, not keyword list
- [ ] **Length:** In the 100-300 word sweet spot for the complexity level
