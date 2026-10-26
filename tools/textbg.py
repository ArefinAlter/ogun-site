# Reads the output of tools/textbg.cjs and prints the text runs whose contrast against the pixels behind them (8th percentile) is below WCAG AA.
#   python -I tools/textbg.py <outDir>
import sys, json, glob, re, os
import numpy as np
from PIL import Image
d = sys.argv[1]
def lin(c):
    c = c / 255.0
    return np.where(c <= 0.03928, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)
def lum(rgb): # rgb array (...,3) 0..255
    l = lin(rgb.astype(float)); return 0.2126 * l[..., 0] + 0.7152 * l[..., 1] + 0.0722 * l[..., 2]
def parse(c):
    m = re.match(r'rgba?\(([^)]+)\)', c); v = [float(x) for x in re.split(r'[ ,/]+', m.group(1).strip()) if x]
    return v[0], v[1], v[2], (v[3] if len(v) > 3 else 1.0)
bad = []; total = 0
for jf in sorted(glob.glob(d + '/*.json')):
    runs = json.load(open(jf)); im = np.asarray(Image.open(jf[:-5] + '.png').convert('RGB'))
    H, W, _ = im.shape
    seen = {}
    for r in runs:
        x0, y0 = max(0, int(r['x'])), max(0, int(r['y'])); x1, y1 = min(W, int(r['x'] + r['w'] + 1)), min(H, int(r['y'] + r['h'] + 1))
        if x1 - x0 < 2 or y1 - y0 < 2: continue
        reg = im[y0:y1, x0:x1].reshape(-1, 3)
        R, G, B, A = parse(r['c']); A *= r['op']
        L = lum(reg)
        # blend text colour over the median background for translucent text
        med = np.median(reg, axis=0)
        tc = np.array([R, G, B]) * A + med * (1 - A)
        Lt = lum(tc.reshape(1, 3))[0]
        cr = (np.maximum(L, Lt) + 0.05) / (np.minimum(L, Lt) + 0.05)
        worst = np.percentile(cr, 8)  # 8 % of the pixels behind the run may be worse (dither, glyph gaps)
        large = r['fs'] >= 24 or (r['fs'] >= 18.66 and r['fw'] >= 700)
        need = 3.0 if large else 4.5
        total += 1
        if worst < need:
            k = (r['t'][:28], round(r['y'] / 40))
            if k in seen: continue
            seen[k] = 1
            bad.append((os.path.basename(jf)[:-5], r.get('wh',''), r['t'], round(float(worst), 2), need, int(r['x']), int(r['y']), r['fs']))
print(total, 'text runs;', len(bad), 'below the threshold')
for b in bad: print(*b, sep=' | ')
