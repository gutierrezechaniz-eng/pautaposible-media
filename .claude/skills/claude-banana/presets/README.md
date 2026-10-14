# Presets

Brand and style presets that provide consistent aesthetic defaults for prompt generation.

## How Presets Work

Each preset is a JSON file containing default values for:

- **colors** — Primary, secondary, and accent hex codes
- **style** — Base visual approach and rendering direction
- **typography** — Font characteristic description for text rendering
- **lighting** — Default lighting setup
- **mood** — Emotional tone and atmosphere

When a preset is active, the prompt-architect agent uses these values as a base layer. Any explicit user instructions override preset values.

## Available Presets

| Preset | File | Best For |
|--------|------|----------|
| Tech / SaaS | `tech-saas.json` | Software products, startup branding, professional presentations |
| Luxury Brand | `luxury-brand.json` | High-end products, fashion, premium services |
| Editorial Magazine | `editorial-magazine.json` | Bold visual content, magazine spreads, provocative design |

## Creating Custom Presets

Create a new JSON file in this directory following the same structure:

```json
{
  "name": "your-preset-name",
  "colors": {
    "primary": "#HEX",
    "secondary": "#HEX",
    "accent": "#HEX"
  },
  "style": "description of visual approach",
  "typography": "description of font characteristics",
  "lighting": "description of lighting setup",
  "mood": "description of emotional tone"
}
```
