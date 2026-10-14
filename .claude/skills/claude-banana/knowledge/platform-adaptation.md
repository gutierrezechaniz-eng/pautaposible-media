# Platform Adaptation

How to convert prompts written for other image generation platforms into optimized Gemini-compatible format.

## Conversion Table

| Source Syntax | Platform | Gemini Equivalent |
|---------------|----------|------------------|
| `--ar 16:9` | Midjourney | Set aspect ratio via API parameter (`set_aspect_ratio("16:9")`) before generating. Remove from prompt text. |
| `--v 6`, `--v 5.2` | Midjourney | Remove entirely. Gemini has no version flags. |
| `--style raw` | Midjourney | Remove. If the intent is "less stylized", add "documentary photography style, naturalistic rendering" to the prompt. |
| `--chaos 50` | Midjourney | Describe the desired variety: "unexpected composition, surreal juxtaposition, unconventional framing." |
| `--no trees, buildings` | Midjourney | Rephrase as positive: "open meadow, clear unobstructed sky, minimal foreground elements." |
| `--q 2` | Midjourney | Remove. Set quality through resolution parameter and thinking level. |
| `--s 750` (stylize) | Midjourney | Describe the specific style you want rather than a numerical dial. |
| `--iw 2` (image weight) | Midjourney | Use reference images via API. Describe which elements to emphasize from the reference. |
| `--seed 12345` | Midjourney | Not supported. For consistency, use detailed descriptions and reference images instead. |
| `(word:1.5)` | Stable Diffusion | Remove weighting syntax. Use descriptive emphasis: "prominently featuring [word]", "the dominant element is [word]." |
| `[word:0.5]` | Stable Diffusion | Remove. If de-emphasizing, simply mention the element briefly or move it later in the prompt. |
| Comma-separated tag lists | SD / NAI | Expand into narrative paragraphs. See below for examples. |
| `8K, masterpiece, best quality, ultra detailed` | SD / NAI | **DELETE entirely.** These are fine-tuning artifacts. Use authority anchors instead. |
| `negative_prompt: ...` | SD / NAI | Gemini has no negative prompt parameter. Rephrase each exclusion as a positive description. |
| `shot on Hasselblad` | Any | **Keep.** Camera and equipment references work well in Gemini prompts. |
| `Unreal Engine, Octane Render` | SD / various | Keep if the 3D rendered look is desired. These terms are understood by Gemini. |
| `DALL-E style` | DALL-E | Remove. Describe the actual visual characteristics you want. |

## Tag-to-Prose Conversion

### Before (Stable Diffusion tag list)
```
1girl, long black hair, red kimono, cherry blossoms, shrine, sunset,
golden hour, detailed eyes, soft lighting, depth of field, 85mm,
bokeh, masterpiece, best quality, ultra detailed
```

### After (Gemini narrative prose)
```
A young Japanese woman with long black hair cascading over a deep
crimson silk kimono walks beneath a canopy of cherry blossom branches
at a weathered stone shrine. Late afternoon golden hour light filters
through the petals, casting warm dappled shadows across the path.
Shot with an 85mm lens at f/2, the background dissolves into a soft
wash of pink and amber bokeh. Gentle rim lighting outlines her
profile against the glowing sky.
```

The narrative version communicates the same visual elements but adds atmosphere, spatial relationships, and emotional register that tags cannot convey.

## Midjourney Multi-Prompt Conversion

Midjourney uses `::` to separate concepts with different weights:

```
cyberpunk city::2 neon rain::1.5 lone figure::1 --ar 16:9
```

In Gemini, express the weighting through descriptive emphasis and prompt ordering:

```
A sprawling cyberpunk megalopolis dominates the frame, its towering
structures bristling with holographic advertisements and exposed
conduit. Heavy neon-tinted rain streaks through the scene, each
droplet catching pink and cyan light from the signage above. Far
below, a lone figure in a dark coat crosses a reflective wet street,
small against the scale of the architecture.
```

Place the highest-weighted concept first and give it the most descriptive detail. Lower-weighted concepts get less description and appear later.

## DALL-E Prompt Conversion

DALL-E prompts tend to be shorter and more natural-language:

```
A cozy bookstore cafe with warm lighting, plants hanging from the
ceiling, and a cat sleeping on a stack of books
```

This is already close to Gemini-compatible format. To optimize:
1. Add specific lighting direction and quality
2. Include a camera/composition reference
3. Add material and texture details
4. Anchor with a prestigious context

```
A cozy independent bookstore cafe with honey-warm Edison bulb lighting
from exposed copper fixtures. Trailing pothos and spider plants hang
from reclaimed wood ceiling beams, casting soft leaf shadows on the
worn oak tables below. A marmalade tabby sleeps curled on a stack of
cloth-bound hardcovers near the window, where afternoon light catches
floating dust motes. Captured at eye level with a 35mm lens, the
scene has the intimate warmth of a Kinfolk magazine feature.
```

## General Conversion Principles

1. **Remove all platform-specific flags and syntax.** Anything starting with `--` or using `::`/`()` weighting is platform-specific.
2. **Delete quality keywords.** "Masterpiece", "best quality", "8K", etc. Replace with authority anchors.
3. **Expand tags into sentences.** Every comma-separated tag should become part of a descriptive sentence.
4. **Add the missing components.** Most converted prompts lack explicit lighting, composition, and material details. Add them.
5. **Rephrase negative prompts as positives.** Every "no X" becomes a positive description of what should be there instead.
6. **Set technical parameters via API.** Aspect ratio, resolution, and model selection happen outside the prompt text.
