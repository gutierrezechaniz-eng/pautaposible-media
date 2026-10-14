# The 7-Component Prompt Formula

Every effective image generation prompt is built from seven weighted components. This formula provides a systematic framework for constructing prompts that consistently produce high-quality results.

## The Formula

| # | Component | Base Weight | What It Controls |
|---|-----------|-------------|------------------|
| 1 | **Subject** | 25% | The primary focus — who or what appears in the image. Includes physical characteristics, age, ethnicity, expression, species, costume, and distinguishing features. |
| 2 | **Style & Aesthetic** | 20% | The visual language — art movement, rendering approach, color grading, film stock, medium (photography, illustration, 3D render). |
| 3 | **Environment** | 15% | The setting — location, background, time of day, season, weather conditions, atmospheric elements, world-building details. |
| 4 | **Lighting & Atmosphere** | 15% | Light source, direction, quality, color temperature, shadow behavior, mood. This is the single biggest quality differentiator between average and exceptional outputs. |
| 5 | **Action & Dynamics** | 10% | Motion, gesture, energy — always use present-tense verbs. Includes pose, physical state, and implied movement. |
| 6 | **Composition & Camera** | 10% | How the scene is framed — shot type, camera angle, focal distance, f-stop, specific camera or lens models. |
| 7 | **Material & Texture** | 5% | Surface qualities and tactile details — reflectivity, roughness, grain, fabric weave, skin texture, material properties. |

## Why These Weights

**Subject (25%)** gets the largest share because the model needs a clear anchor. Without a well-defined subject, other components have nothing to attach to.

**Style (20%)** sets the visual vocabulary. "Watercolor illustration" and "cinematic photography" produce fundamentally different outputs from the same subject.

**Environment and Lighting (15% each)** are separated because they serve different functions. Environment builds the world; lighting shapes how that world feels. A sunny park and a moonlit park are entirely different images. Lighting gets equal weight because it is the single element most correlated with perceived quality — a well-lit mediocre composition outperforms a poorly-lit excellent one.

**Action (10%)** provides energy but doesn't need to dominate. A single strong verb ("leaning against", "mid-stride", "clutching") does more than a paragraph of movement description.

**Composition (10%)** controls the camera. Specific lens references (85mm f/1.4) communicate more than abstract framing instructions.

**Material (5%)** is small but potent. A single texture detail ("weathered oak grain", "frosted glass surface") grounds the entire image in physical reality.

## The Construction Template

Use this template as a starting point, then adjust weights based on domain mode:

```
[Subject: age + appearance + expression + distinguishing features],
wearing [outfit with brand/texture/color details],
[action verb in present tense] in [specific location + time of day + weather].
[One micro-detail about texture, skin, or material].
Captured with [camera model], [focal length] lens at [f-stop],
[lighting direction + quality + color temperature].
[Prestigious context anchor — publication, competition, or studio reference].
```

### Example — Standard Production (150 words)

> A weathered fisherman in his late sixties, deep sun lines etched around pale blue eyes, salt-and-pepper stubble catching the light, wearing a faded navy wool sweater with fraying cuffs and a battered yellow rain slicker draped over one shoulder. He stands at the bow of a wooden trawler, one hand gripping a coiled rope, squinting toward a horizon where storm clouds meet a strip of amber sunset. Morning condensation beads on the slicker's surface. Shot on a Canon EOS R5 with a 70-200mm f/2.8 lens at f/4, the background softens into a wash of steel-blue sea. Overcast natural light from camera-right with a single break of warm golden light cutting through the cloud layer. The image carries the weight and intimacy of a National Geographic field assignment.

## Weight Adjustments by Domain

Each domain mode shifts the base weights to emphasize what matters most for that type of image. See `domain-modes.md` for complete profiles.

| Domain | Subject | Style | Environment | Lighting | Action | Composition | Material |
|--------|---------|-------|-------------|----------|--------|-------------|----------|
| Base | 25% | 20% | 15% | 15% | 10% | 10% | 5% |
| Cinema | 22% | 20% | 15% | 20% | 8% | 12% | 3% |
| Product | 25% | 20% | 10% | 15% | 3% | 12% | 15% |
| Portrait | 30% | 20% | 7% | 18% | 12% | 10% | 3% |
| Editorial | 25% | 25% | 15% | 15% | 12% | 5% | 3% |
| UI/Web | 25% | 25% | 15% | 10% | 5% | 15% | 5% |
| Logo | 25% | 25% | 5% | 7% | 3% | 20% | 15% |
| Landscape | 15% | 20% | 25% | 20% | 5% | 10% | 5% |
| Abstract | 15% | 30% | 10% | 15% | 5% | 15% | 10% |
| Infographic | 25% | 22% | 15% | 8% | 3% | 20% | 7% |

## Prompt Length Guidelines

| Use Case | Target Length | When to Use |
|----------|-------------|-------------|
| Quick concept / ideation | 20–60 words | Exploring directions, rapid iteration |
| Standard production | 100–200 words | Default for quality output across all domains |
| Complex professional | 200–300 words | Full 7-component treatment with extensive detail |
| Maximum specification | Up to 2,600 tokens | Structured prompts with JSON or markdown formatting |

**Diminishing returns set in around 200–250 words.** Beyond that, precision matters more than length — add one specific detail rather than three vague ones.

## Narrative Prose, Not Keyword Lists

Image generation models — especially Gemini — respond to descriptive sentences, not comma-separated tags.

**Weak** (keyword list):
> woman, red dress, city street, night, neon lights, rain, cinematic, 8K, masterpiece

**Strong** (narrative prose):
> A young woman in a crimson silk dress walks through rain-slicked city streets at midnight, neon signage reflecting in shallow puddles around her heels. The scene is captured with an anamorphic lens that stretches the bokeh lights into horizontal ovals, and the only sharp focus falls on her expression — half-smile, half-defiance.

The narrative version communicates mood, atmosphere, technical intent, and emotional register in ways that keywords cannot. A single well-constructed paragraph outperforms fifty comma-separated terms.

## Key Principles

1. **Place critical specifics in the first third.** Models weight early content more heavily. If exact text, hard constraints, or must-have elements exist, lead with them.

2. **One strong verb beats three weak ones.** "Sprinting through" is better than "running quickly and energetically forward."

3. **Specific over generic, always.** "24-year-old with olive skin, hazel eyes, and baby hairs along the forehead" beats "a young person."

4. **Each component earns its space.** If you can't articulate why a detail improves the output, cut it.

5. **The formula is a starting point.** Adjust weights based on domain, and break the rules when the creative brief demands it.
