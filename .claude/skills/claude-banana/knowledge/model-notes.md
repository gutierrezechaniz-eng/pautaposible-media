# Model Notes

Guidance for selecting and working with image generation models. Focused on Nano Banana Pro (Gemini image models) but principles apply broadly.

## Model Routing

| Scenario | Recommended Model | Resolution | Why |
|----------|------------------|-----------|-----|
| Quick draft / ideation | gemini-2.5-flash-image | 512 or 1K | Fast, cheap, good enough for direction-setting |
| Standard production | gemini-3.1-flash-image-preview | 2K | Best balance of quality, speed, and cost |
| Hero images / final assets | gemini-3.1-flash-image-preview | 2K or 4K | Maximum quality for portfolio or publication use |
| Text-heavy (logos, infographics) | gemini-3.1-flash-image-preview | 2K | Better text rendering at higher resolution |
| Budget batch runs | gemini-2.5-flash-image | 1K | 50% Batch API discount available |

## Nano Banana 2 (gemini-3.1-flash-image-preview) — Current Default

- **Tier**: Flash (preview, actively recommended)
- **Max resolution**: 4K (4096x4096)
- **Aspect ratios**: 14 supported — 1:1, 16:9, 9:16, 3:4, 4:3, 3:2, 2:3, 4:5, 5:4, 1:2, 2:1, plus extreme formats 1:8 and 8:1
- **Reference images**: Up to 14 (10 object references, 4 character references)
- **Thinking levels**: Minimal, low, medium, high — use higher levels for complex multi-element compositions
- **Search grounding**: Can use Google Search for factual accuracy in data-driven visuals
- **Image-only output**: Can be configured to return only the image with no text response
- **Watermarks**: SynthID (invisible) on free tier; C2PA metadata on paid tier

### Pricing (per image)

| Resolution | Cost |
|-----------|------|
| 1K | ~$0.067 |
| 2K | ~$0.134 |
| 4K | ~$0.268 |

Batch API offers 50% discount on all tiers.

### Rate Limits

- **Free tier**: ~5-15 requests/minute, ~20-500 requests/day (varies)
- **Paid tier**: Higher limits, check current documentation

## Nano Banana (gemini-2.5-flash-image) — Budget Tier

- **Tier**: Flash (generally available)
- **Max resolution**: 1K (1024x1024)
- **Aspect ratios**: 10 standard ratios (excludes extreme formats)
- **Cost**: ~$0.039 per image
- **Best for**: Rapid prototyping, batch variations, concept exploration

## Critical Technical Constraints

### imageSize Requires UPPERCASE
The `imageSize` parameter must use uppercase values: `"1K"`, `"2K"`, `"4K"`. Lowercase (`"1k"`, `"2k"`) will fail silently or produce unexpected results.

### One Image Per API Call
There is no batch parameter. Each generation produces a single image. For multiple outputs, make sequential API calls. The `batch.py` script automates this.

### No Negative Prompt Parameter
Gemini does not support negative prompts at the API level. All exclusions must be rephrased as positive descriptions within the prompt text. See `anti-patterns.md` for the banned keywords list and replacement strategies.

### No Transparent Backgrounds
Gemini cannot generate images with alpha channel transparency. Workaround: generate on a bright green (#00FF00) background, then use ImageMagick fuzz-based removal. See `post-processing.md`.

### responseModalities Must Include "IMAGE"
When using the API directly, the `responseModalities` field must explicitly include `"IMAGE"` to receive image output. Without this, the model returns text only.

## Default Aspect Ratios by Use Case

| Use Case | Recommended Ratio | Reason |
|----------|------------------|--------|
| Avatar / profile photo | 1:1 | Universal square format |
| Blog header / YouTube thumbnail | 16:9 | Standard widescreen |
| Mobile story / TikTok | 9:16 | Vertical full-screen |
| Instagram post | 4:5 | Instagram's optimal portrait ratio |
| Instagram square | 1:1 | Classic feed format |
| Print photography | 3:2 | Standard print ratio |
| Portrait / headshot | 3:4 or 2:3 | Vertical emphasis on subject |
| Product listing | 1:1 or 4:3 | E-commerce standard |
| Panoramic landscape | 2:1 or wider | Environmental emphasis |
| Vertical infographic | 9:16 or 1:2 | Scrollable data visualization |

## Working with Reference Images

- Upload up to 14 reference images for style consistency
- Assign names to characters: "Character A: the red-haired knight with scar over left eye"
- For identity preservation: provide 4-5 photos of the same person from different angles
- Reference images work best when they share consistent lighting and style with the target output
- Object references (10 max) and character references (4 max) have separate slots

## Thinking Levels

Use thinking levels to control how much the model plans before generating:

| Level | When to Use |
|-------|-------------|
| Minimal | Simple compositions, single subject, quick iterations |
| Low | Standard generations with clear descriptions |
| Medium | Multi-element scenes, specific spatial relationships |
| High | Complex compositions, precise text placement, architectural accuracy |

Higher thinking levels increase generation time and cost but improve accuracy for complex prompts.
