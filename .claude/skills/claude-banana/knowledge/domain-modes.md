# Domain Mode Profiles

Claude Banana supports nine domain modes that reshape the prompt generation formula to match the conventions, vocabulary, and visual expectations of specific creative disciplines. Each mode adjusts the weight distribution of the 7-component base formula and introduces domain-specific techniques, terminology, and structural patterns.

**Base formula weights (default / general purpose):**

| Component | Base Weight |
|---|---|
| Subject | 25% |
| Style | 20% |
| Environment | 15% |
| Lighting | 15% |
| Action | 10% |
| Composition | 10% |
| Material | 5% |

When a domain mode is activated, these weights shift to prioritize the components that matter most for that discipline. Components that receive less emphasis in a given domain are not removed — they are de-weighted so the formula still sums to 100%.

---

## 1. Cinema / Cinematic Scene

### When to Use

Activate Cinema mode when the goal is a dramatic narrative frame — a moment that feels pulled from a film. This covers movie stills, storyboard keyframes, short-film concept art, and any image that needs to communicate story tension through a single composition. If the request mentions a character in a situation with implied before-and-after, Cinema mode is the right call.

### Weight Adjustment Table

| Component | Base | Cinema | Delta |
|---|---|---|---|
| Subject | 25% | 22% | -3% |
| Style | 20% | 20% | 0% |
| Environment | 15% | 15% | 0% |
| Lighting | 15% | 20% | +5% |
| Action | 10% | 8% | -2% |
| Composition | 10% | 12% | +2% |
| Material | 5% | 3% | -2% |

Lighting and composition carry the narrative weight in cinema. A well-lit, well-framed shot can elevate a simple subject into something emotionally resonant, which is why both receive a five-point boost.

### Key Techniques

1. **Teal-orange color grading** — the dominant complementary palette in modern cinema, placing warm skin tones against cool shadow fills.
2. **Anamorphic lens characteristics** — horizontal flares, oval bokeh, and subtle barrel distortion that signal "this was shot on cinema glass."
3. **Depth staging** — placing foreground, midground, and background elements at deliberate distances to guide the viewer through the scene.
4. **Rack focus implication** — describing one plane as sharp and another as soft suggests motion and temporal shift within the frame.
5. **Dutch angle and cant** — tilting the horizon line to inject unease or dynamism into an otherwise static composition.
6. **Motivated lighting** — every light source in frame should have a plausible origin: a window, a lamp, a fire, a screen glow.
7. **Negative fill and controlled shadow** — using the absence of light as deliberately as its presence, carving volume out of darkness.

### Equipment and Reference Vocabulary

Cameras: RED V-Raptor, ARRI Alexa 35, Sony Venice 2, Blackmagic URSA. Lenses: Cooke S7/i, Zeiss Supreme Prime, Panavision C-Series anamorphic, Atlas Mercury. Film stocks (when emulating analog): Kodak Vision3 500T, Kodak 5219, Fujifilm Eterna Vivid. Terms: dolly push-in, Steadicam float, crane descent, whip pan, letterbox matte, 24fps cadence, film grain structure, DaVinci Resolve grade.

### Example Prompt Skeleton

```
A {character_description} standing in {environment}, lit by {motivated_light_source} casting {shadow_quality} across {surface}. Shot on {camera_system} with {lens_type} at {focal_length}mm, {aperture}. {Color_grade_style} color palette. Composition uses {framing_technique} with {foreground_element} softly out of focus. Cinematic still, {aspect_ratio} frame.
```

### Recommended Aspect Ratios

- **2.39:1** — anamorphic widescreen, the default cinematic choice
- **16:9** — suitable for broadcast-style cinematic frames and streaming content

---

## 2. Product Photography

### When to Use

Product mode is designed for commercial and e-commerce imagery where the object itself is the entire story. Use it for packshots, catalog images, hero product shots, and any scenario where the viewer needs to understand the object's form, finish, and materiality at a glance. The environment recedes; the product advances.

### Weight Adjustment Table

| Component | Base | Product | Delta |
|---|---|---|---|
| Subject | 25% | 25% | 0% |
| Style | 20% | 20% | 0% |
| Environment | 15% | 10% | -5% |
| Lighting | 15% | 15% | 0% |
| Action | 10% | 3% | -7% |
| Composition | 10% | 12% | +2% |
| Material | 5% | 15% | +10% |

Material receives the largest boost of any component in any mode. In product photography, the surface — matte, glossy, brushed metal, soft-touch polymer — is the primary communicator of quality and desirability.

### Key Techniques

1. **Softbox diffusion** — large, even light panels that wrap around the product and minimize harsh specular highlights.
2. **Hero angle at 45 degrees** — the standard three-quarter view that shows both the front face and one side, maximizing visual information.
3. **Gradient backdrop** — a seamless sweep from light to slightly darker tone, adding depth without distraction.
4. **Shadow play with bounce cards** — controlling fill light to allow just enough shadow to define edges and dimensionality.
5. **Flat lay composition** — overhead arrangement for multi-product or lifestyle-context shots.
6. **Focus stacking** — combining multiple focal planes to achieve edge-to-edge sharpness across the entire product.
7. **Scale indicators** — subtle contextual objects that communicate the product's real-world size.

### Equipment and Reference Vocabulary

Cameras: Phase One IQ4 150MP, Canon EOS R5, Sony A7R V. Lenses: macro lenses (90-105mm), tilt-shift lenses for plane-of-focus control. Terms: infinity cove, product turntable, acrylic riser, prop styling, negative space framing, white sweep, color-accurate profile, clipping path, reflection table, beauty dish for rounded products.

### Example Prompt Skeleton

```
{Product_name} photographed at {angle_description} on a {backdrop_type} background. {Lighting_setup} creating {highlight_quality} along the {surface_material} finish. {Secondary_prop} placed {spatial_relationship} for scale. Sharp focus throughout, {color_temperature}K white balance. Commercial product photography, {aspect_ratio} frame.
```

### Recommended Aspect Ratios

- **1:1** — square, the e-commerce standard for grids and catalogs
- **4:3** — slightly taller frame for products with vertical orientation

---

## 3. Portrait

### When to Use

Portrait mode centers on a person or character as the primary subject. It applies to headshots, environmental portraits, character studies, avatar generation, and any frame where a face or figure dominates the composition. The mode emphasizes the relationship between the subject and the light falling on them.

### Weight Adjustment Table

| Component | Base | Portrait | Delta |
|---|---|---|---|
| Subject | 25% | 30% | +5% |
| Style | 20% | 20% | 0% |
| Environment | 15% | 7% | -8% |
| Lighting | 15% | 18% | +3% |
| Action | 10% | 12% | +2% |
| Composition | 10% | 10% | 0% |
| Material | 5% | 3% | -2% |

Subject weight increases because the person is the message. Lighting gains because portrait lighting patterns (Rembrandt, split, butterfly) are the most powerful tool for shaping how a face reads emotionally.

### Key Techniques

1. **Rembrandt lighting** — a single key light positioned to create a triangle of light on the shadow-side cheek, the hallmark of classical portraiture.
2. **Catch lights** — specular reflections in the eyes that bring life and focus to the gaze; their shape and position are deliberate choices.
3. **Shallow depth of field** — wide apertures (f/1.4 to f/2.8) that dissolve the background into creamy bokeh, isolating the subject.
4. **Subsurface scattering** — light penetrating translucent skin at the ears, fingertips, or backlit hair edges, adding realism and warmth.
5. **Gaze direction and confrontation** — whether the subject looks directly at the viewer (confrontational) or away (candid/contemplative) changes the entire emotional register.
6. **Negative space placement** — positioning the subject off-center with open space in the direction of their gaze.
7. **Hair and rim light separation** — a backlight or edge light that carves the subject away from the background.
8. **Skin tone fidelity** — accurate rendering of diverse skin tones without washing out highlights or crushing shadow detail.

### Equipment and Reference Vocabulary

Lenses: 85mm f/1.4, 105mm f/1.4, 135mm f/2 — the classic portrait focal lengths that compress perspective flatteringly. Cameras: any full-frame or medium-format body. Lighting: beauty dish, large octabox, strip light with grid, V-flat for fill/negative fill. Terms: butterfly lighting, clamshell setup, loop shadow, editorial pose, three-quarter turn, high-key vs low-key, color gel accent, Peter Lindbergh grain, Annie Leibovitz environmental style.

### Example Prompt Skeleton

```
{Character_description} in a {pose_type} pose, {gaze_direction}. {Lighting_pattern} from a {light_source} at {angle}, creating {shadow_description} across {facial_feature}. Shot at {focal_length}mm, {aperture}, with {bokeh_quality} background showing {background_hint}. {Skin_detail_note}. {Mood_descriptor} portrait, {aspect_ratio} frame.
```

### Recommended Aspect Ratios

- **4:5** — Instagram portrait standard, tight and intimate
- **3:4** — slightly more breathing room, classic portrait format
- **2:3** — full-frame sensor native ratio, natural for half-body and three-quarter portraits

---

## 4. Editorial / Fashion

### When to Use

Editorial mode is for images that belong between magazine covers — styled, aspirational, and concept-driven. Use it for fashion spreads, lifestyle campaigns, brand storytelling, and any scenario where clothing, attitude, and art direction converge. The distinction from Portrait mode is that Editorial treats the entire frame as a designed surface, not just the subject.

### Weight Adjustment Table

| Component | Base | Editorial | Delta |
|---|---|---|---|
| Subject | 25% | 25% | 0% |
| Style | 20% | 25% | +5% |
| Environment | 15% | 15% | 0% |
| Lighting | 15% | 15% | 0% |
| Action | 10% | 12% | +2% |
| Composition | 10% | 5% | -5% |
| Material | 5% | 3% | -2% |

Style takes the lead because editorial work is fundamentally about aesthetic vision. Action gets a small boost because movement — fabric in wind, a stride, a gesture — is the lifeblood of fashion photography.

### Key Techniques

1. **Fabric movement and drape** — capturing cloth in motion reveals cut, weight, and texture in ways static poses cannot.
2. **Power stance and body geometry** — angular, elongated poses that create visual tension and convey confidence.
3. **Location as narrative** — the environment is not backdrop but co-author, whether it is a sun-drenched terrace or a brutalist parking structure.
4. **Layered textures** — combining materials (silk against concrete, leather against skin) to create tactile contrast.
5. **Golden hour and directional natural light** — the preferred lighting condition for on-location editorial shoots.
6. **Color story commitment** — limiting the palette to a deliberate color story that unifies wardrobe, set, and post-processing.
7. **Typographic space** — leaving deliberate areas for headline and body text placement, a hallmark of true editorial thinking.

### Equipment and Reference Vocabulary

Publications: Vogue Italia, Harper's Bazaar, W Magazine, i-D, Dazed, Another Magazine. Photographers to reference as style anchors: Steven Meisel, Mert Alas & Marcus Piggott, Tim Walker, Juergen Teller. Terms: editorial spread, tear sheet, look book, campaign image, moodboard, art direction, stylist pull, haute couture vs ready-to-wear, location scouting, wind machine effect.

### Example Prompt Skeleton

```
{Model_description} wearing {garment_description} in {location_type}. {Action_or_pose} with {fabric_movement_detail}. {Lighting_condition} casting {light_quality} across the scene. Styled in the visual language of {publication_or_photographer_reference}. {Color_story} palette. Editorial fashion photography, {aspect_ratio} frame.
```

### Recommended Aspect Ratios

- **3:4** or **2:3** — portrait orientation for single-page editorial layouts
- **16:9** — landscape orientation for double-page spreads

---

## 5. UI / Web Design

### When to Use

UI mode generates assets intended for digital interfaces — icons, illustrations, hero images, app screen mockups, and decorative web elements. The output must work within the constraints of screen rendering: clean edges, legible forms at small sizes, and compatibility with design system conventions. This mode deprioritizes photorealism in favor of clarity and systemic consistency.

### Weight Adjustment Table

| Component | Base | UI/Web | Delta |
|---|---|---|---|
| Subject | 25% | 25% | 0% |
| Style | 20% | 25% | +5% |
| Environment | 15% | 15% | 0% |
| Lighting | 15% | 10% | -5% |
| Action | 10% | 5% | -5% |
| Composition | 10% | 15% | +5% |
| Material | 5% | 5% | 0% |

Composition gains because UI assets must align to grids, maintain padding, and respect spatial hierarchies. Style increases because the visual language (flat, isometric, glassmorphic) defines usability as much as aesthetics. Lighting drops because most UI styles use implied or ambient light rather than directional sources.

### Key Techniques

1. **Flat vector style** — solid fills, clean outlines, and minimal gradients; the dominant aesthetic for scalable UI elements.
2. **Isometric projection** — a 30-degree axonometric view that gives 3D depth without vanishing-point perspective, popular for feature illustrations.
3. **Glassmorphism** — frosted-glass panels with background blur, transparency, and subtle border highlights.
4. **Neumorphism** — soft, extruded forms using same-hue highlights and shadows to create tactile, pillow-like interfaces.
5. **Consistent stroke weight** — maintaining uniform line thickness across all elements in an icon set or illustration system.
6. **Retina-ready construction** — designing at 2x or 3x resolution with pixel-snapped edges to prevent anti-aliasing blur on high-density screens.
7. **Brand palette constraint** — limiting color use to a defined set of hex values that map to a design token system.

### Equipment and Reference Vocabulary

Tools: Figma, Sketch, Adobe Illustrator. Design systems: Material Design 3, Apple Human Interface Guidelines, Fluent Design. Terms: design token, spacing unit (4px/8px grid), breakpoint, responsive behavior, component state (default, hover, active, disabled), SVG export, PNG with transparency, hex color code, HSL value, border radius, drop shadow offset, backdrop-filter blur.

### Example Prompt Skeleton

```
A {asset_type} for a {platform} application, rendered in {visual_style} style. {Subject_description} centered on a {background_color} background. {Color_palette_description} palette with {accent_color} highlights. Clean edges, {stroke_weight} outlines, {corner_style} corners. Designed for {resolution} display. {Aspect_ratio} frame.
```

### Recommended Aspect Ratios

- **1:1** — icons and avatar slots
- **16:9** — hero banners and feature illustrations
- **Custom** — component-specific dimensions as needed by the layout

---

## 6. Logo / Brand Identity

### When to Use

Logo mode is for generating brand marks, wordmarks, monograms, and identity design concepts. The output must function at extreme scale variations — from a favicon at 16 pixels to a billboard at 16 meters. This mode aggressively strips away environmental and narrative complexity in favor of geometric precision, negative space control, and instant recognizability.

### Weight Adjustment Table

| Component | Base | Logo | Delta |
|---|---|---|---|
| Subject | 25% | 25% | 0% |
| Style | 20% | 25% | +5% |
| Environment | 15% | 5% | -10% |
| Lighting | 15% | 7% | -8% |
| Action | 10% | 3% | -7% |
| Composition | 10% | 20% | +10% |
| Material | 5% | 15% | +10% |

Composition dominates because a logo is pure spatial arrangement — every curve, counter, and proportion must be intentional. Material jumps because the mark needs to be described in terms of how it will render across substrates (screen, print, emboss, etch). Environment and lighting are near-irrelevant; logos exist context-free.

### Key Techniques

1. **Golden ratio grid construction** — using mathematical proportions to guide the placement of curves and intersections.
2. **Two-to-three color maximum** — restricting the palette to ensure the mark works in full color, single color, and reversed-out versions.
3. **Monochrome versatility test** — designing so the mark retains its identity when reduced to pure black on white.
4. **Negative space storytelling** — embedding secondary meaning in the spaces between and within letterforms (the FedEx arrow principle).
5. **Geometric primitive foundation** — building the mark from circles, squares, and triangles to ensure mathematical consistency.
6. **Scalability across media** — ensuring legibility from app icon to signage, accounting for minimum size thresholds.
7. **Wordmark vs symbol distinction** — understanding when the brand needs a standalone symbol, a typographic wordmark, or a combination mark.
8. **Clear space rules** — defining the minimum unoccupied area surrounding the mark.

### Equipment and Reference Vocabulary

Tools: Adobe Illustrator (vector construction), Figma (presentation), FontForge (custom type). Terms: kerning, tracking, counter space, x-height alignment, baseline grid, bezier curve, anchor point, path simplification, brand guidelines, style guide, lockup variation, responsive logo system, favicon rendering, emboss simulation, foil stamp proof.

### Example Prompt Skeleton

```
A {mark_type} logo for {brand_name}, a {industry_description} company. Constructed from {geometric_basis} with {color_count} colors: {color_list}. {Design_principle} guides the composition. The mark conveys {brand_attribute_1} and {brand_attribute_2}. Minimal, scalable, displayed on a {background} background. {Aspect_ratio} frame.
```

### Recommended Aspect Ratios

- **1:1** — the universal logo presentation format, ensuring the mark is designed to balance in all directions

---

## 7. Landscape / Environment

### When to Use

Landscape mode prioritizes the scene over any individual subject. Use it for nature photography, wallpapers, world-building environment art, scenic vistas, and any image where the place itself is the protagonist. Humans or creatures, if present, serve as scale indicators rather than focal subjects.

### Weight Adjustment Table

| Component | Base | Landscape | Delta |
|---|---|---|---|
| Subject | 25% | 15% | -10% |
| Style | 20% | 20% | 0% |
| Environment | 15% | 25% | +10% |
| Lighting | 15% | 20% | +5% |
| Action | 10% | 5% | -5% |
| Composition | 10% | 10% | 0% |
| Material | 5% | 5% | 0% |

Environment becomes the primary component because the place is the subject. Lighting gains because natural light conditions (golden hour, blue hour, overcast, storm light) are the single most transformative variable in landscape imagery.

### Key Techniques

1. **Foreground-midground-background layering** — constructing depth by placing distinct visual elements at three or more distance planes.
2. **Atmospheric perspective** — using haze, color shift, and contrast reduction to communicate distance; far objects appear lighter and bluer.
3. **Golden hour exploitation** — the period shortly after sunrise or before sunset when light is warm, directional, and low-angled.
4. **Blue hour stillness** — the twilight period where ambient sky light produces a cool, even illumination with no harsh shadows.
5. **Volumetric light rays** — visible beams of light cutting through fog, forest canopy, or cloud breaks, adding drama and depth.
6. **Leading lines from terrain** — using rivers, ridgelines, paths, or fences to guide the eye from foreground to vanishing point.
7. **Weather as character** — fog, rain, snow, and storm clouds are not obstacles but compositional tools that add mood and texture.

### Equipment and Reference Vocabulary

Cameras: full-frame or medium-format for maximum dynamic range. Lenses: wide-angle (14-35mm) for expansive scenes, telephoto (70-200mm) for compression and layer isolation. Terms: hyperfocal distance, focus stacking for front-to-back sharpness, graduated ND filter, polarizer for sky contrast, panoramic stitch, HDR bracket, exposure blending, Milky Way alignment (for astrophotography crossover), tidal prediction (for coastal work). Photographers: Ansel Adams (zone system), Galen Rowell (adventure light), Marc Adamus (dramatic weather).

### Example Prompt Skeleton

```
A {landscape_type} scene during {time_of_day}, with {foreground_element} in the near ground, {midground_feature} in the middle distance, and {background_feature} on the horizon. {Lighting_condition} producing {light_quality} across the terrain. {Weather_or_atmosphere} adds {mood_descriptor} atmosphere. {Lens_description} perspective. Landscape photography, {aspect_ratio} frame.
```

### Recommended Aspect Ratios

- **16:9** — widescreen standard, natural for horizontal landscapes
- **3:2** — full-frame native ratio, slightly less panoramic
- **2.39:1** — ultra-wide panoramic for sweeping vistas

---

## 8. Abstract / Generative Art

### When to Use

Abstract mode is for non-representational imagery — patterns, textures, generative compositions, and experimental visual explorations where form, color, and rhythm matter more than recognizable subjects. Use it for album artwork, background textures, creative explorations, and any request where the user wants something visually striking without narrative content.

### Weight Adjustment Table

| Component | Base | Abstract | Delta |
|---|---|---|---|
| Subject | 25% | 15% | -10% |
| Style | 20% | 30% | +10% |
| Environment | 15% | 10% | -5% |
| Lighting | 15% | 15% | 0% |
| Action | 10% | 5% | -5% |
| Composition | 10% | 15% | +5% |
| Material | 5% | 10% | +5% |

Style dominates because the aesthetic system is the content. There is no external subject to describe — the visual language itself carries all meaning. Material gains because surface quality (glossy, granular, translucent, iridescent) becomes the primary tactile signal. Composition increases to ensure the abstract arrangement has intentional rhythm and balance.

### Key Techniques

1. **Fractal recursion** — self-similar patterns at multiple scales that create visual complexity from simple mathematical rules.
2. **Voronoi tessellation** — cell-based partitioning that produces organic, membrane-like structures.
3. **Fluid dynamics simulation** — paint-pour, ink-in-water, and smoke-trail effects that produce unrepeatable organic forms.
4. **Marble veining** — turbulent noise patterns that mimic natural stone stratification.
5. **Color field composition** — large areas of saturated color interacting at their boundaries, inspired by Rothko and post-painterly abstraction.
6. **Chromatic aberration and glitch** — intentional color channel splitting and digital artifacts as aesthetic choices.
7. **Generative rule systems** — describing algorithmic processes (particle swarms, reaction-diffusion, L-systems) as the basis for visual output.
8. **Material iridescence** — holographic, oil-slick, and pearlescent surface effects that shift color with implied viewing angle.

### Equipment and Reference Vocabulary

Software lineage: Processing, TouchDesigner, Houdini, GLSL shaders, p5.js. Art references: Refik Anadol (data sculpture), Casey Reas (generative systems), Ryoji Ikeda (data-driven minimalism), Bridget Riley (op art). Terms: noise function, Perlin noise, simplex noise, displacement map, normal map, parametric surface, gradient mesh, isosurface, point cloud, signed distance field, ray marching.

### Example Prompt Skeleton

```
An abstract composition built from {generative_principle}, rendered with {material_quality} surfaces in a palette of {color_description}. {Pattern_behavior} creates rhythm across the {composition_structure}. {Texture_detail} at close inspection. {Lighting_treatment} emphasizes {dimensional_quality}. Generative art, {aspect_ratio} frame.
```

### Recommended Aspect Ratios

- **1:1** — square, the most common format for standalone art pieces and album covers
- **Varies** — abstract work is format-flexible; match to the intended use case

---

## 9. Infographic / Data Visualization

### When to Use

Infographic mode is for images that communicate structured information visually — charts, diagrams, process flows, comparison layouts, and educational illustrations. Clarity and hierarchy override aesthetic expression. Every visual element must serve a communicative purpose, and decoration that does not aid comprehension is stripped away.

### Weight Adjustment Table

| Component | Base | Infographic | Delta |
|---|---|---|---|
| Subject | 25% | 25% | 0% |
| Style | 20% | 22% | +2% |
| Environment | 15% | 15% | 0% |
| Lighting | 15% | 8% | -7% |
| Action | 10% | 3% | -7% |
| Composition | 10% | 20% | +10% |
| Material | 5% | 7% | +2% |

Composition receives the largest boost because information hierarchy — what the viewer sees first, second, and third — is the entire point of data visualization. Lighting drops sharply because infographic assets are typically rendered flat, with ambient illumination or no implied light source at all. Action is minimized; data does not move.

### Key Techniques

1. **Modular section architecture** — dividing the canvas into clearly bounded regions, each containing one data point or concept.
2. **Visual hierarchy through scale and color** — the most important number or concept is the largest and highest-contrast element.
3. **Flow direction signaling** — using arrows, numbering, and spatial progression (top-to-bottom, left-to-right) to guide reading order.
4. **Color contrast compliance** — meeting WCAG accessibility standards for text-to-background contrast ratios (minimum 4.5:1 for body text).
5. **Icon consistency** — using a unified icon set with matching stroke weight, corner radius, and fill style throughout the piece.
6. **Bento grid layout** — a modular grid system where content blocks of varying sizes tile together without gaps, popularized by Apple keynote slides.
7. **Data label proximity** — placing labels directly adjacent to their data points rather than relying on legends, reducing cognitive load.
8. **Whitespace as structure** — using empty space to separate sections and prevent visual overload, treating whitespace as an active design element.

### Equipment and Reference Vocabulary

Tools: Figma, Adobe Illustrator, D3.js (for interactive), Tableau (for data-driven). References: Information is Beautiful (David McCandless), Edward Tufte's principles (data-ink ratio, chartjunk elimination), The Pudding (scrollytelling). Terms: data-ink ratio, annotation layer, callout line, stat card, comparison column, progress indicator, donut chart, treemap, Sankey diagram, sparkline, small multiples, color ramp, sequential vs diverging palette, legend placement.

### Example Prompt Skeleton

```
An infographic about {topic}, organized in a {layout_type} layout. {Section_count} sections covering {data_points}. {Primary_color} and {secondary_color} palette with {accent_color} for emphasis. {Icon_style} icons throughout. {Typography_note} for headlines and body. Data presented via {chart_types}. Clear hierarchy, accessible contrast. {Aspect_ratio} frame.
```

### Recommended Aspect Ratios

- **9:16** — vertical/tall format, the standard for scrollable social infographics
- **16:9** — horizontal format for presentation slides and dashboard views
- **1:1** — compact square format for social media data cards

---

## Domain Routing Decision Matrix

This table provides a quick-reference mapping from user intent signals to the recommended domain mode. When a user's prompt contains one or more of the listed keywords or contextual signals, route to the corresponding mode.

| If the user mentions... | Suggest mode | Confidence |
|---|---|---|
| movie, film, cinematic, scene, still frame, dramatic shot, storyboard | Cinema | High |
| product, packshot, e-commerce, catalog, hero shot, commercial | Product Photography | High |
| headshot, portrait, face, character, avatar, person close-up | Portrait | High |
| magazine, editorial, fashion, spread, campaign, styled, Vogue | Editorial / Fashion | High |
| app, UI, icon, mockup, web, interface, dashboard, button | UI / Web Design | High |
| logo, brand, mark, identity, monogram, emblem, wordmark | Logo / Brand Identity | High |
| landscape, nature, scenic, vista, wallpaper, environment, terrain | Landscape / Environment | High |
| abstract, pattern, texture, generative, experimental, organic, fractal | Abstract / Generative Art | High |
| infographic, chart, diagram, data, comparison, stats, process flow | Infographic / Data Viz | High |
| outfit, clothing, model wearing, runway, look book | Editorial / Fashion | Medium |
| album cover, artwork, visual experiment | Abstract / Generative Art | Medium |
| hero image, landing page, website banner | UI / Web Design | Medium |
| dramatic lighting, moody, noir | Cinema | Medium |
| beauty shot, close-up with bokeh | Portrait | Medium |
| packaging design, label, bottle shot | Product Photography | Medium |
| map, timeline, explainer, how-to visual | Infographic / Data Viz | Medium |
| sunrise, sunset, mountains, ocean, forest | Landscape / Environment | Medium |
| branding, business card, letterhead | Logo / Brand Identity | Medium |

**Routing priority rules:**

1. If multiple modes match, prefer the mode with the highest-confidence keyword match.
2. If confidence is equal, prefer the mode whose boosted components align with the user's explicit emphasis (e.g., "dramatic lighting on a product" routes to Product Photography with Cinema lighting techniques borrowed as a secondary influence).
3. When no keywords match, remain in default mode (base formula weights) and ask the user a clarifying question about their intended use case.
4. Modes can be combined: a primary mode sets the weight distribution while a secondary mode contributes vocabulary and technique suggestions without altering weights. Document this as "{Primary} + {Secondary} influence" in the prompt metadata.
