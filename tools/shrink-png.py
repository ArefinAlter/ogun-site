#!/usr/bin/env python3
"""Reduces a rendered PNG to an indexed palette (default 160 colours, Floyd-Steinberg): the social card shrinks from ~480 KB to ~150 KB.
    python -I tools/shrink-png.py public/og.png"""
import sys
from PIL import Image

path = sys.argv[1]
colours = int(sys.argv[2]) if len(sys.argv) > 2 else 160
im = Image.open(path).convert('RGB')
im.quantize(colors=colours, method=Image.MEDIANCUT, dither=Image.FLOYDSTEINBERG).save(path, optimize=True)
print(path, 'shrunk')
