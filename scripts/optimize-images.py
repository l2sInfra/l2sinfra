#!/usr/bin/env python3
"""
Generate responsive, modern-format variants of the site's photography.

Run from the repo root:  python3 scripts/optimize-images.py

Outputs to public/img/. The results are committed, so there is no build-time
image dependency and nothing is added to the Vercel build — these source photos
change perhaps once a year. Re-run this after replacing one.

Why the hero gets a full srcset and the rest do not: the hero is the LCP
element and spans the viewport, so a phone was downloading a 1920px, 373 kB
JPEG to paint into roughly 412 CSS px. The other three sit below the fold in
fixed-height boxes at about 800px, so they only need one width — but they were
1024x1024 JPEGs being cropped by object-cover, i.e. paying for pixels that are
thrown away.

Files land in public/ rather than src/assets/ deliberately: Vite hashes
anything imported from src/, and the prerendered HTML needs a stable path it
can name.
"""

from __future__ import annotations

import os
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src" / "assets"
OUT = ROOT / "public" / "img"

# Widths a phone, tablet and desktop actually request at 1x and 2x DPR.
# Capped at the source width — upscaling only adds bytes.
HERO_WIDTHS = [640, 828, 1280, 1893]
CARD_WIDTH = 800

# The hero source is a 2.54:1 panorama; a phone's hero box is about 0.47:1, so
# object-cover would throw away ~82% of the width and leave a narrow strip with
# neither the tower nor the sky in it. Narrow screens get their own 3:4 crop
# instead — art direction, not just a resize. 0.42 is the horizontal centre of
# the crop, chosen so the headline sits over open sky.
MOBILE_CROP_CENTRE = 0.42
MOBILE_CROP_RATIO = 0.75  # 3:4 portrait
MOBILE_WIDTHS = [480, 750]

# Quality falls as width rises: the big variants only reach large screens with
# the bandwidth for them, and the hero sits behind a 40-80% dark gradient that
# hides compression artefacts. Chosen by measuring, not by taste — at 828w
# (a phone at 2x, the LCP case) q45 is 36 kB against a 373 kB original.
AVIF_QUALITY = {640: 48, 828: 45, 1280: 40, 1920: 35}
CARD_AVIF_QUALITY = 45
WEBP_OFFSET = 28  # WebP needs a higher number for comparable perceived quality
JPEG_QUALITY = 80


def kb(path: Path) -> float:
    return os.path.getsize(path) / 1024


def resize(img: Image.Image, width: int) -> Image.Image:
    if img.width <= width:
        return img.copy()
    height = round(img.height * width / img.width)
    return img.resize((width, height), Image.LANCZOS)


def save(img: Image.Image, path: Path, fmt: str, quality: int) -> None:
    params: dict = {"quality": quality}
    if fmt == "jpg":
        params.update(optimize=True, progressive=True)
    img.convert("RGB").save(path, **params)


def crop_portrait(img: Image.Image, centre: float, ratio: float) -> Image.Image:
    """A portrait slice of a wide image, centred on `centre` (0-1 across)."""
    width = int(img.height * ratio)
    left = int(img.width * centre - width / 2)
    left = max(0, min(img.width - width, left))
    return img.crop((left, 0, left + width, img.height))


def build(name: str, widths: list[int], mobile: bool = False) -> float:
    source = SRC / f"{name}.png"
    if not source.exists():
        source = SRC / f"{name}.jpg"
    original = kb(source)
    img = Image.open(source)
    widths = [w for w in widths if w <= img.width] or [img.width]
    produced = []

    for width in widths:
        variant = resize(img, width)
        q = AVIF_QUALITY.get(width, CARD_AVIF_QUALITY)
        save(variant, OUT / f"{name}-{width}.avif", "avif", q)
        save(variant, OUT / f"{name}-{width}.webp", "webp", q + WEBP_OFFSET)
        produced.extend([OUT / f"{name}-{width}.avif", OUT / f"{name}-{width}.webp"])

    # One JPEG fallback at the largest width, for anything without AVIF or WebP.
    fallback = OUT / f"{name}-{max(widths)}.jpg"
    save(resize(img, max(widths)), fallback, "jpg", JPEG_QUALITY)
    produced.append(fallback)

    if mobile:
        portrait = crop_portrait(img, MOBILE_CROP_CENTRE, MOBILE_CROP_RATIO)
        for width in MOBILE_WIDTHS:
            variant = resize(portrait, width)
            save(variant, OUT / f"{name}-mobile-{width}.avif", "avif", 48)
            save(variant, OUT / f"{name}-mobile-{width}.webp", "webp", 48 + WEBP_OFFSET)
        save(resize(portrait, max(MOBILE_WIDTHS)), OUT / f"{name}-mobile.jpg", "jpg", JPEG_QUALITY)
        print(f"  {name} mobile 3:4  ->  AVIF {kb(OUT / f'{name}-mobile-750.avif'):5.1f} kB @750w")

    smallest_avif = kb(OUT / f"{name}-{widths[0]}.avif")
    largest_avif = kb(OUT / f"{name}-{max(widths)}.avif")
    print(f"  {name}.jpg  {original:6.0f} kB  ->  AVIF {smallest_avif:5.1f} kB @{widths[0]}w"
          f"  ·  {largest_avif:6.1f} kB @{max(widths)}w")
    return original


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    print("Generating responsive variants:\n")

    total_before = build("hero-bg", HERO_WIDTHS, mobile=True)
    for name in ("luxury-residential", "commercial", "lands-farmhouses"):
        total_before += build(name, [CARD_WIDTH])

    after = sum(kb(p) for p in OUT.glob("*"))
    print(f"\n  source JPEGs   {total_before:7.0f} kB")
    print(f"  all variants   {after:7.0f} kB  (a browser downloads one per image)")


if __name__ == "__main__":
    main()
