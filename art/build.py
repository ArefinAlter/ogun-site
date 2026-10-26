#!/usr/bin/env python3
"""Ogun art pipeline: public-domain paintings of forges, fire and iron, translated into ember pixel art.

    python -I art/build.py --raw <empty scratch dir> --download     # fetch the originals (once)
    python -I art/build.py --raw <scratch dir>                      # treat them, write public/art/*.png
    python -I art/build.py --raw <scratch dir> --preview <dir>      # 3x previews and a contact sheet instead

Every original is a public-domain painting (see art/library.json and art/SOURCES.md). The treatment is deterministic: crop to a
target aspect, reduce to a fixed logical grid, stretch the tones (local contrast, black and white points), then map the
luminance onto a 10-colour ember ramp with an 8x8 Bayer ordered dither. Every painting gets the same ramp, so they read as one
family whatever the original palette. The result is stored at the logical size (one image pixel = one art pixel, 2 to 4 CSS
pixels on screen) as an indexed PNG and drawn with `image-rendering: pixelated`. A second ramp, "sepia", keeps the same tones
on bone paper for the light theme. Only the processed files are committed; the originals stay in the scratch directory.
"""
import argparse
import hashlib
import io
import json
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / 'public' / 'art'
UA = 'ogun-site-art/1.0 (https://ogun-site.vercel.app; info@vernesystems.com)'
LIBRARY = json.loads((Path(__file__).resolve().parent / 'library.json').read_text(encoding='utf8'))['paintings']


# --------------------------------------------------------------------------- colour ramps, dark to light
def hexrgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


RAMPS = {
    # iron black, soot, deep brown, rust, ember red, burnt orange, ember (the brand accent), amber, hot, bone
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

# Tone settings per painting: black point quantile, gamma, local contrast. Bright, hazy originals (Turner, Monet) need a high black
# point and a strong gamma to keep iron black dark; the lamp-lit Wrights are already dark.
TUNE = {
    'wright-iron-forge': dict(black=0.16, gamma=1.22, clahe=1.4),
    'wright-blacksmiths-shop': dict(black=0.06, gamma=1.05, clahe=1.4),
    'wright-forge-from-without': dict(black=0.05, gamma=0.95, clahe=1.6),
    'wright-vesuvius': dict(black=0.10, gamma=1.15, clahe=1.4),
    'wright-alchemist': dict(black=0.04, gamma=0.95, clahe=1.6),
    'wright-air-pump': dict(black=0.08, gamma=1.0, clahe=1.5),
    'menzel-eisenwalzwerk': dict(black=0.10, gamma=1.30, clahe=1.6),
    'loutherbourg-coalbrookdale': dict(black=0.12, gamma=1.25, clahe=1.4),
    'turner-burning-parliament': dict(black=0.22, gamma=1.55, clahe=1.2),
    'turner-rain-steam-speed': dict(black=0.20, gamma=1.35, clahe=1.6, invert=True),
    'monet-saint-lazare': dict(black=0.20, gamma=1.35, clahe=1.6, invert=True),
    'luce-charleroi': dict(black=0.22, gamma=1.5, clahe=1.2),
    'meunier-mining-region': dict(black=0.30, gamma=1.6, clahe=1.4),
    'courbet-stonebreakers': dict(black=0.14, gamma=1.35, clahe=1.4),
    'velazquez-vulcan': dict(black=0.14, gamma=1.25, clahe=1.4),
    'le-nain-forge': dict(black=0.10, gamma=1.15, clahe=1.5),
    'brueghel-fire': dict(black=0.16, gamma=1.3, clahe=1.4),
}


def treat(src, box, size, ramp='ember', black=0.02, white=0.985, gamma=1.0, clahe=2.2, sharpen=0.6, lift=0.0, strength=1.0, flip=False, invert=False):
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
    L = 1.0 - lin if invert else lin  # misty, pale paintings: the dark engine and rails become the hot iron
    if clahe:
        c = cv2.createCLAHE(clipLimit=clahe, tileGridSize=(max(2, size[0] // 60), max(2, size[1] // 60)))
        L = c.apply((L * 255).astype(np.uint8)).astype(np.float32) / 255.0
        L = 0.5 * L + 0.5 * (1.0 - lin if invert else lin)  # keep half of the original local contrast: the chiaroscuro is the point
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
    out = Image.fromarray(idx, 'P')
    out.putpalette([v for c in colours for v in c])
    return out


def box_for(img_size, cx, cy, wf, aspect):
    """A crop box (fractions) centred on (cx, cy), `wf` of the image wide, with the target aspect, kept inside the image."""
    W, H = img_size
    w = wf * W
    h = w / aspect
    if h > H:
        h = H
        w = h * aspect
    x0 = min(max(cx * W - w / 2, 0), W - w)
    y0 = min(max(cy * H - h / 2, 0), H - h)
    return (x0 / W, y0 / H, (x0 + w) / W, (y0 + h) / H)


# --------------------------------------------------------------------------- the plates
# name: (painting, cx, cy, crop width as a fraction of the painting, logical size, extra options)
# Sizes: wide band 480 x 96 (page banners, strips and the bands between home sections: one art pixel = 3 CSS pixels on a laptop, so a band is 1440 px wide
# and 288 px tall), 404 band 480 x 140, panorama 560 x 200 (behind the closing call to action), hero 480 x 300.
C, S, S404 = (560, 200), (480, 96), (480, 140)
PLATES = {
    # the hero is Wright of Derby's iron forge, mirrored so that the glowing iron sits under the Studio slab
    'forge-hero': ('wright-iron-forge', 0.5, 0.64, 1.0, (480, 300), dict(flip=True, glow=(280, 217))),
    'forge-smithy': ('wright-blacksmiths-shop', 0.55, 0.72, 0.85, (200, 160), {}),
    # one wide band for the head of each main page: the whole width of the painting, cut to the row that carries the light
    's-architecture': ('turner-rain-steam-speed', 0.66, 0.62, 0.72, S, {}),
    's-workflows': ('wright-blacksmiths-shop', 0.60, 0.58, 0.72, S, {}),
    's-operators': ('loutherbourg-coalbrookdale', 0.38, 0.60, 0.80, S, {}),
    's-lineage': ('turner-burning-parliament', 0.50, 0.55, 0.85, S, {}),
    's-benchmarks': ('wright-air-pump', 0.50, 0.58, 1.0, S, {}),
    's-security': ('le-nain-forge', 0.50, 0.55, 1.0, S, {}),
    's-faq': ('brueghel-fire', 0.50, 0.55, 1.0, S, {}),
    's-glossary': ('wright-alchemist', 0.50, 0.66, 1.0, S, {}),
    's-compare': ('luce-charleroi', 0.50, 0.50, 1.0, S, {}),
    's-roadmap': ('monet-saint-lazare', 0.50, 0.60, 1.0, S, {}),
    's-get-started': ('menzel-eisenwalzwerk', 0.50, 0.55, 1.0, S, {}),
    's-about': ('wright-forge-from-without', 0.62, 0.58, 0.80, S, {}),
    's-brand': ('velazquez-vulcan', 0.50, 0.55, 1.0, S, {}),
    's-credits': ('meunier-mining-region', 0.64, 0.55, 0.72, S, {}),
    's-legal': ('courbet-stonebreakers', 0.50, 0.55, 1.0, S, {}),
    's-404': ('wright-vesuvius', 0.50, 0.50, 1.0, S404, {}),
    # bands between the sections of the home page: closer crops, a different part of the painting from the page that uses the same work
    'w-durable': ('courbet-stonebreakers', 0.50, 0.45, 0.75, S, {}),
    'w-lifecycle': ('turner-rain-steam-speed', 0.66, 0.56, 0.60, S, {}),
    'w-run': ('monet-saint-lazare', 0.35, 0.62, 0.55, S, {}),
    'w-lineage': ('turner-burning-parliament', 0.50, 0.55, 0.70, S, {}),
    'w-bench': ('wright-air-pump', 0.50, 0.62, 0.75, S, {}),
    'w-principles': ('velazquez-vulcan', 0.62, 0.58, 0.55, S, {}),
    'w-integrations': ('le-nain-forge', 0.50, 0.55, 0.80, S, {}),
    'w-faq': ('brueghel-fire', 0.20, 0.50, 0.40, S, {}),
    # the other legal pages: the same wide band, cut closer
    's-legal-privacy': ('meunier-mining-region', 0.30, 0.50, 0.70, S, {}),
    's-legal-terms': ('velazquez-vulcan', 0.45, 0.60, 0.60, S, {}),
    's-legal-aup': ('le-nain-forge', 0.50, 0.75, 0.90, S, {}),
    's-legal-cookies': ('brueghel-fire', 0.72, 0.50, 0.50, S, {}),
    's-legal-trademark': ('luce-charleroi', 0.25, 0.45, 0.60, S, {}),
    's-legal-licenses': ('wright-air-pump', 0.78, 0.36, 0.50, S, {}),
    's-legal-security': ('loutherbourg-coalbrookdale', 0.30, 0.52, 0.60, S, {}),
    's-legal-accessibility': ('turner-burning-parliament', 0.72, 0.48, 0.60, S, {}),
    's-legal-company': ('wright-iron-forge', 0.30, 0.68, 0.70, S, {}),
    # panoramas behind the closing call to action
    'c-mill': ('menzel-eisenwalzwerk', 0.50, 0.45, 0.95, C, {}),
    'c-coal': ('loutherbourg-coalbrookdale', 0.50, 0.50, 1.0, C, {}),
    'c-fire': ('turner-burning-parliament', 0.50, 0.40, 1.0, C, {}),
    'c-rails': ('turner-rain-steam-speed', 0.62, 0.55, 0.9, C, {}),
    'c-station': ('monet-saint-lazare', 0.55, 0.62, 0.9, C, {}),
    'c-factory': ('luce-charleroi', 0.50, 0.40, 1.0, C, {}),
    'c-hills': ('meunier-mining-region', 0.50, 0.45, 1.0, C, {}),
    'c-vesuvius': ('wright-vesuvius', 0.50, 0.50, 1.0, C, {}),
}


def commons_url(title, width):
    return 'https://commons.wikimedia.org/wiki/Special:FilePath/' + urllib.parse.quote(title.split(':', 1)[1].replace(' ', '_')) + f'?width={width}'


def load(raw, name):
    p = Path(raw) / (name + '.jpg')
    if not p.exists():
        sys.exit(f'missing original {p}: run with --download first')
    im = Image.open(p)
    im.load()
    return im.convert('RGB')


def download(raw):
    Path(raw).mkdir(parents=True, exist_ok=True)
    for name, meta in LIBRARY.items():
        dest = Path(raw) / (name + '.jpg')
        if dest.exists():
            continue
        url = commons_url(meta['commons'], meta['width'])
        try:
            data = urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': UA}), timeout=180).read()
        except urllib.error.URLError:
            # an old certificate store: let curl fetch it
            data = subprocess.run(['curl', '-sL', '-A', UA, url], check=True, capture_output=True).stdout
        dest.write_bytes(data)
        print('downloaded', name, len(data), hashlib.sha256(data).hexdigest()[:16])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--raw', required=True)
    ap.add_argument('--download', action='store_true')
    ap.add_argument('--only', help='comma list of plate names or prefixes')
    ap.add_argument('--preview', help='write 3x previews of the plates here instead of public/art')
    a = ap.parse_args()
    if a.download:
        download(a.raw)
    cache, manifest = {}, {}
    if not a.preview:
        OUT.mkdir(parents=True, exist_ok=True)
        for old in OUT.glob('*.png'):
            old.unlink()
    previews = []
    for name, (paint, cx, cy, wf, size, opts) in PLATES.items():
        if a.only and not any(name == o or name.startswith(o) for o in a.only.split(',')):
            continue
        if paint not in cache:
            cache[paint] = load(a.raw, paint)
        src = cache[paint]
        o = dict(TUNE[paint])
        o.update({k: v for k, v in opts.items() if k not in ('glow',)})
        glow = opts.get('glow')
        box = box_for(src.size, cx, cy, wf, size[0] / size[1])
        for ramp in ('ember', 'sepia'):
            img = treat(src, box, size, ramp=ramp, **o)
            tag = name if ramp == 'ember' else name + '-sepia'
            if a.preview:
                Path(a.preview).mkdir(parents=True, exist_ok=True)
                if ramp == 'ember':
                    previews.append((name, img.convert('RGB').resize((size[0] * 2, size[1] * 2), Image.NEAREST)))
                    img.convert('RGB').resize((size[0] * 3, size[1] * 3), Image.NEAREST).save(Path(a.preview) / (tag + '.png'))
            else:
                buf = io.BytesIO()
                img.save(buf, 'PNG', optimize=True)
                (OUT / (tag + '.png')).write_bytes(buf.getvalue())
                manifest[tag] = {'painting': paint, 'size': list(size), 'bytes': len(buf.getvalue())}
                if glow:
                    manifest[tag]['glow'] = list(glow)
                print(f'{tag}.png {size[0]}x{size[1]} {len(buf.getvalue()) / 1024:.0f} KB')
    if previews:
        # one contact sheet, 4 across, with the plate names
        cw, ch = 640, 440
        cols = 4
        rows = (len(previews) + cols - 1) // cols
        sheet = Image.new('RGB', (cols * cw, rows * ch), (20, 18, 16))
        d = ImageDraw.Draw(sheet)
        for i, (n, im) in enumerate(previews):
            im.thumbnail((cw - 10, ch - 24))
            x, y = (i % cols) * cw + 5, (i // cols) * ch + 5
            sheet.paste(im, (x, y))
            d.text((x, y + im.size[1] + 4), n, fill=(230, 220, 200))
        sheet.save(Path(a.preview) / 'sheet.png')
    if manifest:
        (OUT / 'manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')


if __name__ == '__main__':
    main()
