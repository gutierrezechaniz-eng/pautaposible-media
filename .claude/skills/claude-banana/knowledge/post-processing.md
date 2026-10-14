# Post-Processing Recipes

Command-line recipes for processing generated images using ImageMagick and FFmpeg. All commands assume ImageMagick 7 (`magick`); for ImageMagick 6, replace `magick` with `convert`.

## Platform Resizing

Center-gravity cropping to standard platform dimensions:

```bash
# Instagram square (1080x1080)
magick input.png -gravity center -crop 1:1 -resize 1080x1080 output_ig_square.png

# Instagram portrait (1080x1350)
magick input.png -gravity center -resize 1080x1350^ -extent 1080x1350 output_ig_portrait.png

# Twitter/X header (1500x500)
magick input.png -gravity center -resize 1500x500^ -extent 1500x500 output_twitter.png

# YouTube thumbnail (1280x720)
magick input.png -gravity center -resize 1280x720^ -extent 1280x720 output_yt.png

# LinkedIn banner (1584x396)
magick input.png -gravity center -resize 1584x396^ -extent 1584x396 output_linkedin.png

# Favicon (32x32 ICO)
magick input.png -resize 32x32 output_favicon.ico
```

## Background Removal

### Solid Color Removal
```bash
# Remove white background (10% fuzz tolerance)
magick input.png -fuzz 10% -transparent white output.png

# Remove green screen (#00FF00)
magick input.png -fuzz 15% -transparent "#00FF00" output.png
```

### Edge Anti-Aliasing
```bash
# Smooth edges after background removal
magick input.png -fuzz 12% -transparent white \
  -channel A -blur 0x1 -level 50%,100% +channel output.png
```

### Auto-Crop Transparent Padding
```bash
magick input.png -trim +repage output.png
```

## Transparent Background Workaround

Gemini cannot generate transparent backgrounds. Use this green-screen workflow:

1. **Generate with green background**: Include "on a solid bright green (#00FF00) background" in the prompt
2. **Remove green**:
```bash
magick input.png -fuzz 15% -transparent "#00FF00" output.png
```
3. **Despill** (remove green fringe from edges):
```bash
magick output.png \
  -channel G -evaluate multiply 0.8 +channel \
  -fuzz 5% -transparent "#00FF00" \
  clean_output.png
```

## Format Conversion

```bash
# PNG to WebP (quality 85 — good balance of size and quality)
magick input.png -quality 85 output.webp

# PNG to JPEG (quality 90, flatten transparency to white)
magick input.png -background white -flatten -quality 90 output.jpg

# PNG to AVIF (quality 80 — excellent compression)
magick input.png -quality 80 output.avif

# SVG trace for logo vectorization (requires potrace)
magick input.png -threshold 50% pbm:- | potrace -s -o output.svg
```

## Color Adjustments

```bash
# Increase contrast (stretch levels)
magick input.png -contrast-stretch 2%x2% output.png

# Warm shift (increase red/yellow)
magick input.png -modulate 100,110,95 output.png

# Cool shift (increase blue)
magick input.png -modulate 100,110,105 output.png

# Desaturate (reduce saturation by 40%)
magick input.png -modulate 100,60,100 output.png

# Full grayscale
magick input.png -colorspace Gray output.png

# Sepia tone
magick input.png -sepia-tone 80% output.png
```

## Compositing

```bash
# Add watermark (20% opacity, bottom-right)
magick input.png watermark.png \
  -gravity southeast -geometry +20+20 \
  -compose dissolve -define compose:args=20 \
  -composite output.png

# Side-by-side comparison
magick input1.png input2.png +append comparison.png

# Vertical stack
magick input1.png input2.png -append stacked.png

# Add border/padding (20px white border)
magick input.png -bordercolor white -border 20 output.png

# Rounded corners (20px radius)
magick input.png \
  \( +clone -alpha extract \
     -draw "fill black polygon 0,0 0,20 20,0 fill white circle 20,20 20,0" \
     -draw "fill black polygon %[fx:w-1],0 %[fx:w-20],0 %[fx:w-1],20 fill white circle %[fx:w-20],20 %[fx:w-20],0" \
     -draw "fill black polygon 0,%[fx:h-1] 0,%[fx:h-20] 20,%[fx:h-1] fill white circle 20,%[fx:h-20] 20,%[fx:h-1]" \
     -draw "fill black polygon %[fx:w-1],%[fx:h-1] %[fx:w-20],%[fx:h-1] %[fx:w-1],%[fx:h-20] fill white circle %[fx:w-20],%[fx:h-20] %[fx:w-1],%[fx:h-20]" \
  \) -alpha off -compose CopyOpacity -composite output.png
```

## Animation

```bash
# Create GIF from numbered frames (frame_001.png, frame_002.png, ...)
magick -delay 10 -loop 0 frame_*.png animation.gif

# Create MP4 from frame sequence
ffmpeg -framerate 24 -pattern_type glob -i 'frame_*.png' \
  -c:v libx264 -pix_fmt yuv420p output.mp4

# Convert GIF to MP4 (smaller file, better quality)
ffmpeg -i animation.gif -movflags faststart -pix_fmt yuv420p \
  -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" output.mp4
```

## Quality Assessment

```bash
# Check dimensions
magick identify -format "%wx%h" input.png

# Check file size
ls -lh input.png

# Check color profile
magick identify -verbose input.png | grep -i "colorspace\|type\|depth"
```

## Batch Processing

```bash
# Resize all PNGs in directory to 1080px width
for f in *.png; do
  magick "$f" -resize 1080x "$f"
done

# Convert all PNGs to WebP
for f in *.png; do
  magick "$f" -quality 85 "${f%.png}.webp"
done

# Generate thumbnails (200x200) for all images
mkdir -p thumbnails
for f in *.png; do
  magick "$f" -gravity center -resize 200x200^ -extent 200x200 "thumbnails/$f"
done
```
