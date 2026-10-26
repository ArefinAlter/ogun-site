#!/usr/bin/env python3
"""Ogun art pipeline: public-domain paintings of forges, translated into ember pixel art.

    python -I art/build.py --raw <empty scratch dir> --download     # fetch the originals (once)
    python -I art/build.py --raw <scratch dir>                      # treat them, write public/art/*.png

Every original is a public-domain painting or a CC0 print (see art/SOURCES.md). The treatment is deterministic:
crop, reduce to a fixed logical grid, stretch the tones (local contrast, black and white points), then map the
luminance onto a 10-colour ember ramp with an 8x8 Bayer ordered dither. The result is stored at the logical size
(one image pixel = one art pixel, 2 to 4 CSS pixels on screen) as an indexed PNG and drawn with
`image-rendering: pixelated`. A second ramp, "sepia", keeps the same tones on bone paper for the light theme.
Only the processed files are committed; the originals stay in the scratch directory.
"""
import argparse
import hashlib
import io
import json
import sys
import urllib.request
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'art'
UA = 'ogun-site-art/1.0 (https://ogun-site.vercel.app; info@vernesystems.com)'

# --------------------------------------------------------------------------- originals (see SOURCES.md)
SOURCES = {
    'wright-iron-forge': 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Joseph_Wright_-_An_Iron_Forge_-_Google_Art_Project.jpg',
    'wright-blacksmiths-shop': 'https://upload.wikimedia.org/wikipedia/commons/c/c4/Joseph_Wright_of_Derby_-_The_Blacksmith%27s_Shop_-_Google_Art_Project.jpg',
    'menzel-eisenwalzwerk': 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Adolph_Menzel_-_Eisenwalzwerk_-_Google_Art_Project.jpg',
    'wright-forge-from-without': 'https://upload.wikimedia.org/wikipedia/commons/9/96/The_Iron_Forge_Viewed_from_Without.jpg',
}

# --------------------------------------------------------------------------- colour ramps, dark to light
def hexrgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

RAMPS = {
    # iron black, soot, deep brown, rust, ember red, ember (the brand accent), amber, hot, white-hot, bone
    'ember': [hexrgb(c) for c in ['#0B0908', '#1A1210', '#2E1A12', '#4F2615', '#7E2F15', '#B8441B', '#E8662E', '#F59A3B', '#FFD08A', '#F3E7CF']],
    # the same tones on paper: umber ink to bone, for the light theme
    'sepia': [hexrgb(c) for c in ['#2B1B13', '#46291B', '#633826', '#82482B', '#A0552A', '#C0642B', '#D98A45', '#E8AF70', '#F0CC9A', '#F6EEDD']],
}


def bayer(n):
    """n x n ordered-dither thresholds in (0, 1)."""
    m = np.array([[0]])
    while m.shape[0] < n:
        m = np.block([[4 * m, 4 * m + 2], [4 * m + 3, 4 * m + 1]])
    return (m + 0.5) / (n * n)


BAYER = bayer(8)


def treat(src, box, size, ramp='ember', black=0.02, white=0.985, gamma=1.0, clahe=2.2, sharpen=0.6, lift=0.0, strength=1.0, flip=False):
    """Crop `box` (fractions x0, y0, x1, y1 of the original), reduce to `size` (w, h) and quantise to the ramp."""
    w0, h0 = src.size
    x0, y0, x1, y1 = box
    im = src.crop((round(x0 * w0), round(y0 * h0), round(x1 * w0), round(y1 * h0)))
    if flip:
        im = im.transpose(Image.FLIP_LEFT_RIGHT)
    # two-step reduction keeps thin features (rafters, ropes) from aliasing
    big = im.resize((size[0] * 4, size[1] * 4), Image.LANCZOS)
    small = np.asarray(big.resize(size, Image.BOX).convert('RGB'), dtype=np.float32) / 255.0
    lin = 0.2126 * small[..., 0] + 0.7152 * small[..., 1] + 0.0722 * small[..., 2]
    L = lin
    if clahe:
        c = cv2.createCLAHE(clipLimit=clahe, tileGridSize=(max(2, size[0] // 60), max(2, size[1] // 60)))
        L = c.apply((L * 255).astype(np.uint8)).astype(np.float32) / 255.0
        L = 0.5 * L + 0.5 * lin  # keep half of the original local contrast: the chiaroscuro is the point
    lo, hi = np.quantile(L, black), np.quantile(L, white)
    L = np.clip((L - lo) / max(hi - lo, 1e-6), 0, 1) ** gamma
    if sharpen:
        blur = cv2.GaussianBlur(L, (0, 0), 1.0)
        L = np.clip(L + sharpen * (L - blur), 0, 1)
    L = np.clip(lift + (1 - lift) * L, 0, 1)
    colours = RAMPS[ramp]
    n = len(colours) - 1
    f = L * n
    t = np.tile(BAYER, (size[1] // 8 + 1, size[0] // 8 + 1))[: size[1], : size[0]]
    idx = np.clip(np.floor(f + (t - 0.5) * strength + 0.5), 0, n).astype(np.uint8)
    pal = Image.new('P', (1, 1))
    pal.putpalette([v for c in colours for v in c])
    out = Image.fromarray(idx, 'P')
    out.putpalette([v for c in colours for v in c])
    return out


def glow_point(img):
    """Centroid (in art pixels) of the white-hot pixels in the lower three quarters: where the forge glows. Used to place embers."""
    a = np.asarray(img)
    h = a.shape[0]
    ys, xs = np.nonzero(a[h // 4:] >= 8)
    return [int(xs.mean()), int(ys.mean()) + h // 4] if len(xs) else [a.shape[1] // 2, h // 2]


# --------------------------------------------------------------------------- the plates
# name: (original, crop box, logical size, treatment options). One logical pixel is drawn 2 to 4 CSS pixels wide.
PLATES = {
    # Hero backdrop 1440 x 900 at 3 px per art pixel. Wright of Derby, "An Iron Forge" (1772): the glowing iron and the tilt hammer.
    'forge-hero': ('wright-iron-forge', (0.0, 0.30, 1.0, 0.98), (480, 300), dict(black=0.16, gamma=1.22, clahe=1.4, glow=(200, 217))),
    # A wide strip for the footer panorama: Menzel, "The Iron Rolling Mill (Modern Cyclops)" (1872-75): the white-hot slab and the shop.
    'forge-mill-wide': ('menzel-eisenwalzwerk', (0.02, 0.18, 0.98, 0.80), (560, 200), dict(black=0.10, gamma=1.30, clahe=1.6)),
    # A tall panel: Wright of Derby, "The Blacksmith's Shop" (1771): the smith and the anvil in lamplight.
    'forge-smithy': ('wright-blacksmiths-shop', (0.10, 0.50, 0.95, 0.95), (200, 160), dict(black=0.06, gamma=1.05, clahe=1.4)),
    # Square detail of the mill's slab and rollers, for plates inside the page.
    'forge-slab': ('menzel-eisenwalzwerk', (0.30, 0.38, 0.72, 0.78), (240, 160), dict(black=0.08, gamma=1.18, clahe=1.6)),
    # The forge seen from outside at night, for the 404 and credits.
    'forge-night': ('wright-forge-from-without', (0.12, 0.22, 0.98, 0.98), (240, 160), dict(black=0.05, gamma=0.95, clahe=1.6)),
}


def load(raw, name):
    p = Path(raw) / (name + '.jpg')
    if not p.exists():
        sys.exit(f'missing original {p}: run with --download first')
    im = Image.open(p)
    im.load()
    return im.convert('RGB')


def download(raw):
    Path(raw).mkdir(parents=True, exist_ok=True)
    for name, url in SOURCES.items():
        dest = Path(raw) / (name + '.jpg')
        if dest.exists():
            continue
        req = urllib.request.Request(url, headers={'User-Agent': UA})
        data = urllib.request.urlopen(req, timeout=120).read()
        dest.write_bytes(data)
        print('downloaded', name, len(data), hashlib.sha256(data).hexdigest()[:16])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--raw', required=True)
    ap.add_argument('--download', action='store_true')
    ap.add_argument('--only', help='comma list of plate names')
    ap.add_argument('--preview', help='write 4x previews of the plates here instead of public/art')
    a = ap.parse_args()
    if a.download:
        download(a.raw)
    OUT.mkdir(parents=True, exist_ok=True)
    cache = {}
    manifest = {}
    for name, (srcname, box, size, opts) in PLATES.items():
        if a.only and name not in a.only.split(','):
            continue
        if srcname not in cache:
            cache[srcname] = load(a.raw, srcname)
        for ramp in ('ember', 'sepia'):
            o = dict(opts)
            glow = o.pop('glow', None)
            if ramp == 'sepia':
                o['strength'] = o.get('strength', 1.0)
            img = treat(cache[srcname], box, size, ramp=ramp, **o)
            tag = name if ramp == 'ember' else name + '-sepia'
            if a.preview:
                Path(a.preview).mkdir(parents=True, exist_ok=True)
                img.convert('RGB').resize((size[0] * 3, size[1] * 3), Image.NEAREST).save(Path(a.preview) / (tag + '.png'))
            else:
                buf = io.BytesIO()
                img.save(buf, 'PNG', optimize=True)
                (OUT / (tag + '.png')).write_bytes(buf.getvalue())
                manifest[tag] = {'source': srcname, 'size': list(size), 'bytes': len(buf.getvalue()), 'glow': list(glow) if glow else glow_point(img)}
                print(f'{tag}.png {size[0]}x{size[1]} {len(buf.getvalue()) / 1024:.0f} KB')
    if manifest:
        (OUT / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')


if __name__ == '__main__':
    main()
