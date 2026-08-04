#!/usr/bin/env python3
"""
Generate the favicon set, logo.png and og-image.jpg for l2sinfra.com.

Run from the repo root:  python3 scripts/generate-brand-assets.py

By default the mark is drawn from the brand itself — a gold "L2S" on navy,
set in Georgia Bold, which is the CSS fallback the site already declares for
Playfair Display. To use a real logo file instead, pass it as an argument:

    python3 scripts/generate-brand-assets.py path/to/logo.png

The source image should be square-ish and at least 512px on its longest side;
it is centred on the navy tile with a 12% margin.

Outputs to public/:
    favicon.ico (16/32/48), favicon-16x16.png, favicon-32x32.png,
    apple-touch-icon.png (180), logo.png (512), og-image.jpg (1200x630),
    site.webmanifest + its 192/512 icons
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"

# Brand tokens, mirrored from src/index.css
NAVY = (27, 37, 50)       # --navy:  hsl(213 30% 15%)
GOLD = (196, 160, 95)     # --gold:  hsl(39 46% 57%)
GOLD_LIGHT = (212, 183, 129)  # --gold-light: hsl(39 55% 68%)
CREAM = (250, 248, 244)   # --cream: hsl(40 30% 97%)

SERIF_BOLD = "/System/Library/Fonts/Supplemental/Georgia Bold.ttf"
SANS = "/System/Library/Fonts/Supplemental/Arial.ttf"
SANS_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"


def font(path: str, size: int) -> ImageFont.FreeTypeFont:
    try:
        return ImageFont.truetype(path, size)
    except OSError:
        return ImageFont.load_default()


def fit_font(draw: ImageDraw.ImageDraw, path: str, text: str, max_w: int, start: int):
    """Largest font size at or below `start` whose text fits within max_w.

    Picking a fixed ratio of the tile is what let the 16px mark overflow its
    own tile; measuring instead means it cannot.
    """
    for size in range(start, 3, -1):
        f = font(path, size)
        left, _, right, _ = draw.textbbox((0, 0), text, font=f)
        if right - left <= max_w:
            return f
    return font(path, 4)


def centred(draw: ImageDraw.ImageDraw, box, text: str, f, fill):
    """Draw `text` centred inside box=(x0, y0, x1, y1)."""
    x0, y0, x1, y1 = box
    left, top, right, bottom = draw.textbbox((0, 0), text, font=f)
    x = x0 + (x1 - x0 - (right - left)) / 2 - left
    y = y0 + (y1 - y0 - (bottom - top)) / 2 - top
    draw.text((x, y), text, font=f, fill=fill)


def make_tile(size: int, logo: Image.Image | None) -> Image.Image:
    """Square navy tile with rounded corners carrying the mark."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=int(size * 0.18), fill=NAVY)

    if logo is not None:
        margin = int(size * 0.12)
        inner = size - 2 * margin
        art = logo.copy()
        art.thumbnail((inner, inner), Image.LANCZOS)
        img.paste(art, ((size - art.width) // 2, (size - art.height) // 2), art)
    elif size >= 128:
        # Full mark: serif "L2S" over a gold rule, echoing the site's wordmark.
        f = font(SERIF_BOLD, int(size * 0.42))
        centred(draw, (0, int(-size * 0.02), size, size), "L2S", f, GOLD)
        bar_w, bar_h = int(size * 0.34), max(2, int(size * 0.045))
        bar_y = int(size * 0.72)
        draw.rounded_rectangle(
            [(size - bar_w) // 2, bar_y, (size + bar_w) // 2, bar_y + bar_h],
            radius=bar_h // 2,
            fill=GOLD,
        )
    elif size >= 32:
        # No rule — at this size it reads as noise rather than as a rule.
        f = fit_font(draw, SERIF_BOLD, "L2S", int(size * 0.80), int(size * 0.50))
        centred(draw, (0, 0, size, size), "L2S", f, GOLD)
    else:
        # Three glyphs cannot be read in 16px — about four pixels each, and
        # "2S" collapses into one shape whatever the weight. Drop to the initial
        # so the smallest frame is legible; 32px and up still carry the full
        # "L2S", and that is what retina tabs actually request.
        f = fit_font(draw, SERIF_BOLD, "L", size - 3, int(size * 0.82))
        centred(draw, (0, 0, size, size), "L", f, GOLD)
    return img


def make_og(logo: Image.Image | None) -> Image.Image:
    """1200x630 share card."""
    W, H = 1200, 630
    img = Image.new("RGB", (W, H), NAVY)
    draw = ImageDraw.Draw(img)

    # subtle gold frame
    draw.rectangle([40, 40, W - 41, H - 41], outline=(60, 72, 88), width=1)

    if logo is not None:
        art = logo.copy()
        art.thumbnail((150, 150), Image.LANCZOS)
        img.paste(art, ((W - art.width) // 2, 120), art)
        text_top = 300
    else:
        text_top = 190

    f_brand = font(SERIF_BOLD, 104)
    f_tag = font(SANS, 34)
    f_meta = font(SANS, 26)

    # "L2S Infra" — L2S in cream, Infra in gold, drawn as one centred run
    brand_a, brand_b = "L2S ", "Infra"
    wa = draw.textlength(brand_a, font=f_brand)
    wb = draw.textlength(brand_b, font=f_brand)
    x = (W - (wa + wb)) / 2
    draw.text((x, text_top), brand_a, font=f_brand, fill=CREAM)
    draw.text((x + wa, text_top), brand_b, font=f_brand, fill=GOLD)

    rule_y = text_top + 150
    draw.rounded_rectangle([(W - 90) // 2, rule_y, (W + 90) // 2, rule_y + 4], radius=2, fill=GOLD)

    centred(draw, (0, rule_y + 40, W, rule_y + 90),
            "Luxury Real Estate Agency", f_tag, (222, 226, 232))
    centred(draw, (0, rule_y + 96, W, rule_y + 140),
            "Gurgaon  ·  Delhi NCR", f_meta, GOLD_LIGHT)
    return img


def main() -> None:
    source = None
    if len(sys.argv) > 1:
        source = Image.open(sys.argv[1]).convert("RGBA")
        print(f"using logo: {sys.argv[1]} ({source.width}x{source.height})")
    else:
        print("no logo passed — drawing the L2S wordmark from brand tokens")

    PUBLIC.mkdir(exist_ok=True)

    # Render each size independently rather than downscaling one master —
    # otherwise the small-size branches in make_tile never run and 16px comes
    # out as an unreadable smudge of serif.
    master = make_tile(512, source)
    master.save(PUBLIC / "logo.png")
    master.save(PUBLIC / "android-chrome-512x512.png")
    make_tile(192, source).save(PUBLIC / "android-chrome-192x192.png")
    make_tile(180, source).save(PUBLIC / "apple-touch-icon.png")
    make_tile(32, source).save(PUBLIC / "favicon-32x32.png")
    make_tile(16, source).save(PUBLIC / "favicon-16x16.png")

    # Multi-resolution .ico, each frame drawn at its own size for the same reason
    ico = make_tile(48, source)
    ico.save(PUBLIC / "favicon.ico", sizes=[(48, 48), (32, 32), (16, 16)],
             append_images=[make_tile(32, source), make_tile(16, source)])

    make_og(source).save(PUBLIC / "og-image.jpg", quality=88, optimize=True)

    (PUBLIC / "site.webmanifest").write_text(json.dumps({
        "name": "L2S Infra",
        "short_name": "L2S Infra",
        "icons": [
            {"src": "/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png"},
            {"src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png"},
        ],
        "theme_color": "#1b2532",
        "background_color": "#1b2532",
        "display": "standalone",
    }, indent=2) + "\n")

    for p in sorted(PUBLIC.iterdir()):
        print(f"  {p.name}")


if __name__ == "__main__":
    main()
