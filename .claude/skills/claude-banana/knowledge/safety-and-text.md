# Safety Filters & Text Rendering

## Text Rendering in Generated Images

AI image models can produce readable text, but with strict practical limits.

### Hard Rules

- **25-character maximum** for reliable rendering. Beyond this, characters become garbled, duplicated, or illegible.
- **2-3 distinct text elements max** per image. More than three separate text blocks compete for the model's attention.
- **Enclose all desired text in quotation marks** within the prompt: `the sign reads "OPEN"` — this signals to the model that the quoted content is literal text to render.
- **Describe font characteristics, not font names.** "Bold condensed sans-serif" works; "Helvetica Bold" does not — models don't have font libraries.
- **High contrast is mandatory.** Light text on dark surfaces or dark text on light surfaces. Low-contrast text (gray on gray) will be unreadable.

### Placement Specification

Always specify where text should appear:
- "centered at the bottom third of the frame"
- "upper left corner, small and understated"
- "across the middle of the image in large block letters"
- "on the surface of the sign/label/banner"

Vague placement ("include the text somewhere") gives unpredictable results.

### The Text-First Technique

For prompts where text is critical (logos, posters, signage), establish the text concept in conversation before generating:

1. First message: "I need an image with the text 'BLOOM' as the central element"
2. Describe the visual context around the text
3. Generate with the text element as the leading constraint in the prompt

This gives the model more context for treating text as a primary compositional element rather than an afterthought.

### Multi-Language Text

- Latin alphabet text renders most reliably
- CJK characters (Chinese, Japanese, Korean) work but with lower consistency
- Arabic and Hebrew (RTL scripts) are unreliable — expect errors
- For non-Latin text, reduce character count to 10-15 for safety

## Safety Filter Navigation

Image generation models apply multi-layer safety filtering. Understanding how filters work helps you craft prompts that produce your intended output without false-positive blocks.

### How Filters Work

- **Layer 1 (Prompt analysis)**: Scans the text prompt for flagged terms before generation begins
- **Layer 2 (Output analysis)**: Analyzes the generated image itself for policy violations — this is the harder layer to address because it evaluates visual content, not just words

### Common Filter Categories

| Category | Common Triggers | Rephrase Strategy |
|----------|----------------|-------------------|
| **Violence / Weapons** | Combat, blood, firearms, bladed weapons | Use metaphor and aftermath: "battle-worn" → "weathered veteran"; "sword fight" → "two fencers in competitive stance" |
| **Medical / Gore** | Surgery, open wounds, exposed organs | Abstract to clinical context: "open wound" → "anatomical medical illustration"; "blood" → "red pigment splash" |
| **Real Public Figures** | Named celebrities, politicians, public personalities | Use archetypes: "Elon Musk" → "a tech entrepreneur in a minimalist industrial office"; describe the archetype, not the person |
| **Children + Risk** | Minors in ambiguous, dangerous, or adult-adjacent contexts | Add explicit safety framing: "educational illustration", "family-friendly scene", "children's book artwork" |
| **NSFW / Suggestive** | Revealing clothing, intimate poses, bedroom settings | Redirect to artistic context: "fashion editorial, fully clothed, editorial pose, published in Vogue" |

### Rephrase Strategies

**Abstraction**: Move from literal to conceptual. Instead of depicting the thing directly, depict its artistic or metaphorical representation.

**Artistic Framing**: Position the content within a recognized artistic tradition. "Renaissance oil painting depicting the myth of..." carries different safety weight than a literal depiction.

**Context Shifting**: Place the subject in an unambiguous professional context. Medical, educational, journalistic, and artistic contexts receive more latitude.

**Metaphorical Language**: Replace direct terms with visual metaphors. "Destruction" becomes "aftermath of a storm"; "conflict" becomes "tension between two figures standing at opposite ends of a bridge."

### When Filters Block Despite Good Prompts

Layer 2 evaluates the actual generated image, not just your words. If a well-phrased prompt still gets blocked:

1. **Shift the visual concept further** from the trigger. The image itself may look too close to a violation even though the prompt is clean.
2. **Change the angle, distance, or framing.** A wide shot with more context often passes where a close-up doesn't.
3. **Add more context elements.** A scene with more environmental detail and multiple elements is less likely to be flagged than an isolated subject.
4. **Maximum 3 rephrase attempts.** If three rephrasings all fail, the concept is likely too close to a hard policy boundary. Discuss alternatives with the user rather than continuing to iterate.

### Important Protocol

- **Never auto-retry** a blocked prompt without user approval
- Present 2-3 rephrase suggestions and let the user choose
- Explain what was likely triggered and why the rephrase should help
- If the user's intent genuinely conflicts with safety policies, be transparent about the limitation
