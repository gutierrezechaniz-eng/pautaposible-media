# Anti-Patterns: What to Avoid

This reference documents keywords, habits, and structural mistakes that actively degrade image generation quality. Consult this during prompt composition to catch problems before they reach the model.

## Banned Keywords

These terms are either ignored by modern image models or actively trigger quality degradation. Never include them in a prompt.

| Banned Term | Why It Fails | What to Use Instead |
|-------------|-------------|-------------------|
| "4K", "8K", "ultra HD" | Resolution is set via API parameters, not prompt text. Including these wastes token budget on noise. | Set resolution via `imageSize` parameter ("2K", "4K"). |
| "high resolution" | Same as above — has no effect on actual output resolution. | Omit entirely. Use the resolution API parameter. |
| "masterpiece" | Overloaded term from fine-tuned Stable Diffusion models. Has no positive effect on Gemini or most modern models. | Use a specific authority anchor: "Pulitzer Prize-winning photograph" or "exhibited at the Tate Modern." |
| "best quality" | Same issue as "masterpiece" — a fine-tuning artifact, not a real quality lever. | Describe the specific quality you want: sharp focus, rich tonal range, precise color accuracy. |
| "highly detailed", "ultra detailed" | Vague intensifiers that add nothing. The model doesn't have a "detail dial" to turn up. | Name the specific details you want: "visible wood grain in the table surface", "individual eyelashes catching the light." |
| "trending on ArtStation" | A relic from early Stable Diffusion. Modern models don't index against ArtStation popularity. | Reference a specific aesthetic: "digital concept art with painterly brushwork" or "matte painting for a AAA game studio." |
| "hyperrealistic", "photorealistic" | Overused to the point of meaninglessness. Ironically, including these often produces uncanny, plastic-looking results. | Describe what realism means in context: "natural skin texture with visible pores", "environmental reflections in glass surfaces." |
| "ultra realistic" | Same issue as hyperrealistic. | Be specific: "documentary photography style", "shot on location with available light." |
| "award-winning" | Too vague to convey any visual information. | Name the specific award context: "World Press Photo finalist", "Communication Arts annual." |

## The 10 Critical Mistakes

### 1. Keyword Stuffing
Stacking quality terms ("8K, masterpiece, ultra-detailed, best quality, award-winning photograph") actively degrades results. Each term competes for the model's attention, diluting the meaningful parts of your prompt.

**Fix**: Delete all quality keywords. Let specific descriptions do the work.

### 2. Tag Lists Instead of Prose
Comma-separated keyword lists ("woman, forest, sunset, ethereal, magical, flowing dress") are a habit from Stable Diffusion workflows. Gemini and modern models respond to narrative description.

**Fix**: Write complete sentences. "A woman in a flowing white dress walks through a dense forest as golden sunset light filters through the canopy" communicates mood, motion, and atmosphere that tags cannot.

### 3. Missing Lighting Direction
Lighting is the single biggest quality differentiator, yet most prompts omit it entirely. Without lighting guidance, the model defaults to flat, directionless illumination.

**Fix**: Always specify at minimum: light direction (camera-left, overhead, backlighting), quality (soft diffused, hard direct), and optionally color temperature (warm golden, cool blue-white).

### 4. Vague Composition
"A nice photo of a cat" gives the model no compositional guidance. It defaults to centered, eye-level, medium-distance framing — the most generic possible choice.

**Fix**: Specify shot type (close-up, wide establishing, over-the-shoulder), camera angle (low angle looking up, bird's-eye), and ideally a lens reference (85mm f/1.4 for shallow depth, 24mm for environmental context).

### 5. Generic Style Language
"Make it look cool" or "cinematic style" are too broad to produce consistent results. "Cinematic" alone could mean anything from a Wes Anderson symmetrical frame to a Michael Bay explosion.

**Fix**: Reference specific equipment (ARRI Alexa Mini, anamorphic lens), film stocks (Kodak Vision3 500T), color grading approaches (teal-orange split tone), or named aesthetic traditions (French New Wave, neo-noir).

### 6. Ignoring Aspect Ratio
Many users generate images without setting aspect ratio first, then try to crop afterward. This wastes compositions and often cuts critical elements.

**Fix**: Set aspect ratio before generating. Match it to intended use: 1:1 for avatars, 16:9 for blog headers, 9:16 for mobile stories, 4:5 for Instagram, 3:2 for print.

### 7. Overlong Prompts
Diminishing returns set in around 200-250 words. Beyond that point, additional words tend to be vague filler that dilutes the specific, meaningful content.

**Fix**: Target 100-200 words for most prompts. If you need more, ensure every additional word adds a specific, unique detail. Cut any word that doesn't change the output.

### 8. Text Longer Than 25 Characters
AI image models can render short text reliably but degrade rapidly past roughly 25 characters. Long sentences, multi-line paragraphs, or body copy will be garbled.

**Fix**: Keep rendered text to 25 characters max. Use 2-3 distinct short phrases at most. Specify placement and font characteristics explicitly.

### 9. Burying Key Details at the End
Models weight early prompt content more heavily than later content. Placing critical constraints ("must include exactly three people", "text reads 'HELLO'") at the end reduces compliance.

**Fix**: Lead with hard constraints and must-have elements in the first third of the prompt. Descriptive atmosphere and style can come later.

### 10. Single-Generation Perfectionism
Trying to get a perfect result in one shot leads to bloated prompts packed with hedging language. This is slower and less effective than iterative refinement.

**Fix**: Start with a focused 100-word prompt. Evaluate the result. Add or adjust specific elements in a follow-up. Two or three focused iterations beat one overloaded attempt.

## Structural Anti-Patterns

### Contradictory Instructions
"A bright, sunny scene with moody, dark shadows and high-key lighting" forces the model to choose. It usually picks whichever instruction comes first.

**Fix**: Decide on one lighting approach. If you want contrast, describe it precisely: "bright afternoon sun from camera-right casting deep, hard-edged shadows across the left side of the face."

### Ungrounded Superlatives
"The most beautiful landscape ever created" tells the model nothing about what beauty means to you.

**Fix**: Describe the specific visual properties you find beautiful: "sweeping valley with layered mountain ridges fading to blue, a single twisted pine in the foreground catching the last amber light."

### Platform Syntax in Gemini Prompts
Midjourney flags (`--ar 16:9`, `--v 6`, `--chaos 50`), Stable Diffusion weighting (`(word:1.5)`), and DALL-E bracketing don't work in Gemini. They're ignored at best, confusing at worst.

**Fix**: See `platform-adaptation.md` for conversion guidelines.

### Negative Prompt Attempts
Writing "no blur, no watermark, no text" in a Gemini prompt. Gemini has no negative prompt parameter and doesn't reliably interpret "no X" phrasing.

**Fix**: Rephrase as positives: "sharp focus throughout", "clean uncluttered surface", "text-free composition." See `prompt-engineering.md` section on Positive Framing.
