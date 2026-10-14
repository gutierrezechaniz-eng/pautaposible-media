# Prompt Templates

Parameterized prompt templates for common image generation scenarios. Each template is a proven structure with placeholder variables you can customize.

## How Templates Work

Each template contains a **Prompt Template** section with `{placeholder}` variables in curly braces. Replace these with your specific values to produce a ready-to-use prompt.

### Variable Syntax

- `{subject}` — Replace with your specific value
- Variables are described in the **Variables** section of each template with examples
- All templates produce narrative prose (not keyword lists) following the 7-component formula

## Template Index

### By Domain Mode

| Template | Domain | Best For |
|----------|--------|----------|
| `cinematic-landscape.md` | Cinema | Dramatic environments with film aesthetics |
| `cinematic-scene.md` | Cinema | Character-driven narrative moments |
| `product-showcase.md` | Product | Hero product with studio lighting |
| `product-flat-lay.md` | Product | Overhead arranged compositions |
| `portrait-editorial.md` | Portrait | Fashion/magazine portraits |
| `portrait-environmental.md` | Portrait | Subjects in meaningful contexts |
| `editorial-fashion.md` | Editorial | Styled fashion shoots |
| `ui-mockup.md` | UI/Web | App interfaces with modern effects |
| `logo-minimal.md` | Logo | Brand marks with geometric construction |
| `landscape-atmospheric.md` | Landscape | Multi-layer nature environments |
| `abstract-generative.md` | Abstract | Mathematical patterns and generative art |
| `infographic-data.md` | Infographic | Data visualization layouts |

### By Special Technique

| Template | Technique | Best For |
|----------|-----------|----------|
| `chibi-transformation.md` | Chibi/Q-Version | Cute 3D character figures |
| `hybrid-sketch-photo.md` | Pencil + Photo | Mixed-media contrast compositions |
| `containment-scene.md` | Containment | Miniature worlds inside objects |
| `frame-breakout.md` | Frame Breakout | Characters breaking through boundaries |
| `social-media-asset.md` | Social Media | Platform-specific assets with UI elements |
| `style-transfer-anime.md` | Anime Conversion | Photo-to-anime transformations |
| `tilt-shift-miniature.md` | Tilt-Shift | Overhead miniature world effect |
| `material-override.md` | Material Transform | Objects in unexpected materials |
| `multi-panel-manga.md` | Sequential Panels | Manga-style emotional storytelling |
| `voxel-conversion.md` | Voxel Art | Blocky 3D icon conversion |
| `weather-cityscape.md` | Weather + Isometric | City scenes with weather visualization |
| `creative-ad-doodle.md` | Doodle + Real | Product with illustrated elements |
| `coloring-page.md` | Dual-Output | B&W line art with color reference |

## Creating New Templates

Follow the same format as existing templates:

1. Use the 7-component formula structure
2. Write narrative prose, not keyword lists
3. Include `{placeholder}` variables for customization
4. Provide at least one fully-resolved Example Output
5. Never use banned keywords (see `knowledge/anti-patterns.md`)
6. Specify recommended aspect ratio and usage context
