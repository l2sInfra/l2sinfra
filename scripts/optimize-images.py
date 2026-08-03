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
HERO_WIDTHS = [640, 828, 1280, 1920]
CARD_WIDTH = 800

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


def build(name: str, widths: list[int]) -> float:
    source = SRC / f"{name}.jpg"
    original = kb(source)
    img = Image.open(source)
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

    smallest_avif = kb(OUT / f"{name}-{widths[0]}.avif")
    largest_avif = kb(OUT / f"{name}-{max(widths)}.avif")
    print(f"  {name}.jpg  {original:6.0f} kB  ->  AVIF {smallest_avif:5.1f} kB @{widths[0]}w"
          f"  ·  {largest_avif:6.1f} kB @{max(widths)}w")
    return original


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    print("Generating responsive variants:\n")

    total_before = build("hero-bg", HERO_WIDTHS)
    for name in ("luxury-residential", "commercial", "lands-farmhouses"):
        total_before += build(name, [CARD_WIDTH])

    after = sum(kb(p) for p in OUT.glob("*"))
    print(f"\n  source JPEGs   {total_before:7.0f} kB")
    print(f"  all variants   {after:7.0f} kB  (a browser downloads one per image)")


if __name__ == "__main__":
    main()
