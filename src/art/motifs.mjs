// The Ogun motifs, in the manner of Renaissance technical engravings (Agricola, De re metallica, 1556; da Vinci's notebooks):
// gears that really mesh, an anvil and hammer, a windlass over a shaft, construction lines, plate frames.
// Every function returns SVG markup; `id` prefixes keep ids unique. No <style> and no style attributes (CSP).
import { hatch, n, prng } from './kit.mjs'

export const C = {
  forge: '#13110F',
  soot: '#1C1916',
  slag: '#2A2520',
  vellum: '#F1E9D8',
  vellumShade: '#E4D8BF',
  ink: '#1E1A16',
  ink2: '#57503F',
  bone: '#E9E1D0',
  ember: '#E8662E',
  emberText: '#9C4419',
  hematite: '#8F3A1F',
  brass: '#B89157',
  brassDeep: '#7A5A22',
  verdigris: '#5FAE9C',
  quench: '#7AA6CF',
  cinnabar: '#E0604A',
}

const deg = (a) => (a * Math.PI) / 180

// ---------------------------------------------------------------- gears
/** Gear outline with trapezoid teeth. Module m, N teeth: pitch radius m*N/2. Tooth 0 is centred on angle 0. */
export function gearPath(N, m, missing = []) {
  const r = (m * N) / 2
  const ro = r + m
  const rr = r - 1.25 * m
  const step = (Math.PI * 2) / N
  const p = []
  for (let i = 0; i < N; i++) {
    const a = i * step
    const top = missing.includes(i) ? rr + m * 0.35 : ro
    p.push([Math.cos(a - step * 0.3) * rr, Math.sin(a - step * 0.3) * rr])
    p.push([Math.cos(a - step * 0.16) * top, Math.sin(a - step * 0.16) * top])
    p.push([Math.cos(a + step * 0.16) * top, Math.sin(a + step * 0.16) * top])
    p.push([Math.cos(a + step * 0.3) * rr, Math.sin(a + step * 0.3) * rr])
  }
  return { d: 'M ' + p.map(([x, y]) => `${n(x)} ${n(y)}`).join(' L ') + ' Z', r, ro, rr }
}

/** A complete engraved gear: teeth, rim, spokes, hub, hatched rim band. */
export function gear(id, { N = 24, m = 6, spokes = 6, ink = C.ink, paper = C.vellum, cls = '', missing = [] } = {}) {
  const g = gearPath(N, m, missing)
  const rimIn = g.rr - m * 1.6
  const hub = Math.max(10, g.r * 0.2)
  const spokeW = Math.max(6, g.r * 0.12)
  const sp = []
  for (let i = 0; i < spokes; i++) {
    const a = (i / spokes) * 360
    sp.push(`<rect x="${n(hub - 2)}" y="${n(-spokeW / 2)}" width="${n(rimIn - hub + 4)}" height="${n(spokeW)}" transform="rotate(${n(a)})"/>`)
  }
  return `<g class="gear ${cls}"><defs><clipPath id="${id}-band"><path d="${g.d}"/></clipPath></defs>
<path d="${g.d}" fill="${paper}" stroke="${ink}" stroke-width="1.3" stroke-linejoin="round"/>
<g clip-path="url(#${id}-band)"><circle r="${n(g.rr - 1)}" fill="none" stroke="url(#${id}-hatch)" stroke-width="${n(m * 1.3)}"/></g>
<defs>${hatch(id + '-hatch', { gap: 3, width: 0.7, angle: 35, color: ink, opacity: 0.8 })}</defs>
<circle r="${n(rimIn)}" fill="${paper}" stroke="${ink}" stroke-width="1.1"/>
<g fill="${paper}" stroke="${ink}" stroke-width="1">${sp.join('')}</g>
<circle r="${n(hub)}" fill="${paper}" stroke="${ink}" stroke-width="1.2"/><circle r="${n(hub * 0.42)}" fill="${ink}"/>
<path d="M ${n(-hub * 0.42)} 0 H ${n(hub * 0.42)} M 0 ${n(-hub * 0.42)} V ${n(hub * 0.42)}" stroke="${paper}" stroke-width=".8"/></g>`
}

/**
 * A train of gears that mesh: each gear after the first is placed at angle `at` from the previous one,
 * turned so a gap meets a tooth, and spun in the opposite direction at the inverse tooth ratio.
 */
export function gearTrain(id, specs, { m = 6, period = 24, ink = C.ink, paper = C.vellum } = {}) {
  const placed = []
  specs.forEach((s, i) => {
    if (i === 0) {
      placed.push({ ...s, x: s.x, y: s.y, rot: s.rot || 0, dir: 1, dur: period })
      return
    }
    const prev = placed[s.to ?? i - 1]
    const dist = (m * (prev.N + s.N)) / 2
    const x = prev.x + Math.cos(deg(s.at)) * dist
    const y = prev.y + Math.sin(deg(s.at)) * dist
    const ratio = prev.N / s.N
    const rot = -prev.rot * ratio + s.at * (1 + ratio) + (s.N % 2 === 0 ? 180 / s.N : 0)
    placed.push({ ...s, x, y, rot, dir: -prev.dir, dur: prev.dur / ratio })
  })
  const out = placed
    .map(
      (p, i) =>
        `<g transform="translate(${n(p.x)} ${n(p.y)}) rotate(${n(p.rot)})"><g class="gear-spin gear-spin--${p.dir > 0 ? 'cw' : 'ccw'}" data-dur="${n(p.dur)}">${gear(`${id}${i}`, { N: p.N, m, spokes: p.spokes || (p.N > 20 ? 6 : 4), ink, paper })}</g></g>`,
    )
    .join('')
  return { svg: out, placed }
}

// ---------------------------------------------------------------- anvil, block, hammer
/** London-pattern anvil on a wooden block; local origin at the centre of the block's foot. */
export function anvil(id, { ink = C.ink, paper = C.vellum } = {}) {
  const body =
    'M -178 -150 C -150 -150 -120 -154 -96 -156 L 136 -156 L 136 -128 L 104 -124 C 84 -118 70 -100 66 -82 C 64 -66 72 -54 92 -46 L 104 -36 L -86 -36 L -74 -46 C -56 -54 -48 -66 -50 -82 C -54 -102 -72 -116 -98 -122 C -128 -128 -158 -138 -178 -150 Z'
  return `<g class="anvil"><defs>${hatch(id + '-h', { gap: 3.2, width: 0.75, angle: 60, color: ink, opacity: 0.85 })}${hatch(id + '-x', { gap: 4, width: 0.6, angle: -30, color: ink, opacity: 0.55 })}<clipPath id="${id}-c"><path d="${body}"/></clipPath></defs>
<path d="M -110 -36 L -120 0 L 124 0 L 112 -36 Z" fill="${paper}" stroke="${ink}" stroke-width="1.3"/>
<path d="M -112 -26 C -40 -30 40 -30 116 -26 M -116 -14 C -30 -18 50 -16 120 -14" fill="none" stroke="${ink}" stroke-width=".7" opacity=".6"/>
<path d="${body}" fill="${paper}" stroke="${ink}" stroke-width="1.5" stroke-linejoin="round"/>
<g clip-path="url(#${id}-c)"><path d="M 60 -130 L 140 -130 L 140 -36 L 40 -36 C 60 -60 50 -100 60 -130 Z" fill="url(#${id}-h)"/><path d="M -100 -122 C -72 -112 -52 -96 -50 -80 C -50 -64 -60 -52 -80 -44 L -100 -36 L -110 -36 L -110 -122 Z" fill="url(#${id}-x)"/><path d="M -178 -150 L 136 -150 L 136 -144 L -170 -144 Z" fill="${ink}" opacity=".85"/></g>
<rect x="112" y="-154" width="12" height="10" fill="${ink}"/><circle cx="92" cy="-149" r="3.2" fill="${ink}"/>
<path d="M -96 -156 L 136 -156" stroke="${paper}" stroke-width="1.2"/>
</g>`
}

/** Blacksmith's hammer drawn raised; pivot at (px, py) in the parent's user space. */
export function hammer({ px, py, ink = C.ink, paper = C.vellum, steel = '#D8CDB5' }) {
  const hx = px - 150
  const hy = py - 36
  return `<g class="hammer"><rect x="${n(hx)}" y="${n(py - 7)}" width="158" height="14" rx="6" fill="#C9A66B" stroke="${ink}" stroke-width="1.2"/>
<path d="M ${n(hx + 20)} ${n(py - 3)} H ${n(px - 6)} M ${n(hx + 30)} ${n(py + 2)} H ${n(px - 14)}" stroke="${ink}" stroke-width=".6" opacity=".6"/>
<path d="M ${n(hx - 24)} ${n(hy)} L ${n(hx + 22)} ${n(hy)} L ${n(hx + 26)} ${n(hy + 72)} L ${n(hx - 28)} ${n(hy + 72)} Z" fill="${steel}" stroke="${ink}" stroke-width="1.4" stroke-linejoin="round"/>
<path d="M ${n(hx - 30)} ${n(hy + 72)} L ${n(hx + 28)} ${n(hy + 72)} L ${n(hx + 24)} ${n(hy + 80)} L ${n(hx - 26)} ${n(hy + 80)} Z" fill="${ink}"/>
<path d="M ${n(hx + 8)} ${n(hy + 4)} L ${n(hx + 11)} ${n(hy + 68)} M ${n(hx + 14)} ${n(hy + 4)} L ${n(hx + 17)} ${n(hy + 68)}" stroke="${ink}" stroke-width=".7" opacity=".7"/>
<circle class="hammer-pivot" cx="${n(px)}" cy="${n(py)}" r="3" fill="${ink}"/></g>`
}

// ---------------------------------------------------------------- construction marks
export const centerMark = (x, y, r = 8, ink = C.ink) => `<path d="M ${n(x - r)} ${n(y)} H ${n(x + r)} M ${n(x)} ${n(y - r)} V ${n(y + r)}" stroke="${ink}" stroke-width=".8"/>`

/** Compass arc, dashed, as left by a draughtsman. */
export const compassArc = (x, y, r, a0, a1, ink = C.ink) => {
  const p0 = [x + Math.cos(deg(a0)) * r, y + Math.sin(deg(a0)) * r]
  const p1 = [x + Math.cos(deg(a1)) * r, y + Math.sin(deg(a1)) * r]
  return `<path class="construct" d="M ${n(p0[0])} ${n(p0[1])} A ${n(r)} ${n(r)} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${n(p1[0])} ${n(p1[1])}" fill="none" stroke="${ink}" stroke-width=".7" stroke-dasharray="5 4"/>`
}

/** Dimension line with arrowheads and a label. */
export function dimension(x1, y1, x2, y2, label, ink = C.ink) {
  const a = Math.atan2(y2 - y1, x2 - x1)
  const ah = (x, y, dir) => {
    const s = 7
    const b = a + (dir > 0 ? Math.PI : 0)
    return `M ${n(x + Math.cos(b + 0.32) * s)} ${n(y + Math.sin(b + 0.32) * s)} L ${n(x)} ${n(y)} L ${n(x + Math.cos(b - 0.32) * s)} ${n(y + Math.sin(b - 0.32) * s)}`
  }
  const mx = (x1 + x2) / 2
  const my = (y1 + y2) / 2
  return `<g class="dimension"><path d="M ${n(x1)} ${n(y1)} L ${n(x2)} ${n(y2)} ${ah(x1, y1, -1)} ${ah(x2, y2, 1)}" fill="none" stroke="${ink}" stroke-width=".8"/><text x="${n(mx)}" y="${n(my - 6)}" class="plate-label" text-anchor="middle">${label}</text></g>`
}

/** Leader line with an italic letter, as in Renaissance figure keys. */
export const leader = (x1, y1, x2, y2, letter, ink = C.ink) =>
  `<g class="leader"><path d="M ${n(x1)} ${n(y1)} L ${n(x2)} ${n(y2)}" stroke="${ink}" stroke-width=".7"/><circle cx="${n(x1)}" cy="${n(y1)}" r="1.8" fill="${ink}"/><text x="${n(x2 + (x2 > x1 ? 4 : -4))}" y="${n(y2 + 5)}" class="plate-key" text-anchor="${x2 > x1 ? 'start' : 'end'}">${letter}</text></g>`

/** Engraved plate frame: double rule, corner fleurons, a title cartouche. Content goes inside. */
export function plateFrame(id, { w, h, title = 'FIG. I', ink = C.ink, paper = C.vellum, noise = true }) {
  const corner = (x, y, sx, sy) => `<path transform="translate(${x} ${y}) scale(${sx} ${sy})" d="M 0 18 C 0 8 8 0 18 0 M 6 18 C 6 11 11 6 18 6 M 0 0 L 9 9" fill="none" stroke="${ink}" stroke-width=".9"/>`
  return `<defs>${noise ? `<filter id="${id}-paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .38  0 0 0 0 .26  0 0 0 .12 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>` : ''}</defs>
<rect width="${w}" height="${h}" fill="${paper}"/>${noise ? `<rect width="${w}" height="${h}" fill="#000" filter="url(#${id}-paper)"/>` : ''}
<rect x="12" y="12" width="${w - 24}" height="${h - 24}" fill="none" stroke="${ink}" stroke-width="1.6"/><rect x="18" y="18" width="${w - 36}" height="${h - 36}" fill="none" stroke="${ink}" stroke-width=".6"/>
${corner(22, 22, 1, 1)}${corner(w - 22, 22, -1, 1)}${corner(22, h - 22, 1, -1)}${corner(w - 22, h - 22, -1, -1)}
<g transform="translate(${w / 2} 18)"><rect x="-46" y="-9" width="92" height="18" fill="${paper}" stroke="${ink}" stroke-width=".9"/><text y="4.5" class="plate-title" text-anchor="middle">${title}</text></g>`
}

// ---------------------------------------------------------------- windlass (Fig. II)
/** A windlass over a mine shaft, after Agricola. The bucket rises and falls (CSS). */
export function windlass(id, { ink = C.ink, paper = C.vellum } = {}) {
  const rnd = prng(9)
  const stones = []
  for (let i = 0; i < 60; i++) {
    const x = rnd() * 520 + 20
    const y = 250 + rnd() * 170
    if (x > 230 && x < 330) continue
    stones.push(`<ellipse cx="${n(x)}" cy="${n(y)}" rx="${n(3 + rnd() * 7)}" ry="${n(2 + rnd() * 4)}" transform="rotate(${n(rnd() * 180)} ${n(x)} ${n(y)})"/>`)
  }
  const spokes = Array.from({ length: 8 }, (_, i) => `<path transform="rotate(${i * 22.5})" d="M -36 0 H 36"/>`).join('')
  return `<g class="windlass"><defs>${hatch(id + '-e', { gap: 4, width: 0.7, angle: 45, color: ink, opacity: 0.55 })}${hatch(id + '-w', { gap: 2.6, width: 0.8, angle: 90, color: ink, opacity: 0.8 })}</defs>
<path d="M 20 250 H 230 M 330 250 H 540" stroke="${ink}" stroke-width="1.4"/>
<rect x="20" y="250" width="210" height="170" fill="url(#${id}-e)"/><rect x="330" y="250" width="210" height="170" fill="url(#${id}-e)"/>
<g fill="none" stroke="${ink}" stroke-width=".8">${stones.join('')}</g>
<rect x="222" y="250" width="8" height="170" fill="url(#${id}-w)"/><rect x="330" y="250" width="8" height="170" fill="url(#${id}-w)"/>
<path d="M 230 250 V 420 M 330 250 V 420" stroke="${ink}" stroke-width="1.3"/>
<path d="M 236 300 H 324 M 236 360 H 324" stroke="${ink}" stroke-width=".7" stroke-dasharray="3 4"/>
<g stroke="${ink}" stroke-width="1.4" fill="${paper}"><path d="M 196 250 L 214 120 L 226 120 L 214 250 Z"/><path d="M 364 250 L 346 120 L 334 120 L 346 250 Z"/><rect x="206" y="112" width="148" height="14" rx="3"/></g>
<g transform="translate(280 119)"><g class="windlass-drum"><circle r="40" fill="none" stroke="${ink}" stroke-width="1.4"/><circle r="34" fill="none" stroke="${ink}" stroke-width=".7"/><g stroke="${ink}" stroke-width="1.1">${spokes}</g><circle r="8" fill="${ink}"/></g></g>
<path d="M 354 119 L 392 119 L 392 150" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round"/><circle cx="392" cy="156" r="6" fill="${paper}" stroke="${ink}" stroke-width="1.4"/>
<g class="windlass-load"><path class="windlass-rope" d="M 280 159 V 300" stroke="${ink}" stroke-width="1.6"/><g transform="translate(280 300)"><path d="M -22 0 L 22 0 L 17 34 L -17 34 Z" fill="${paper}" stroke="${ink}" stroke-width="1.4"/><path d="M -22 0 C -22 -18 22 -18 22 0" fill="none" stroke="${ink}" stroke-width="1.2"/><path d="M -19 8 H 19 M -18 18 H 18 M -17 27 H 17" stroke="${ink}" stroke-width=".6"/><circle cx="-6" cy="-3" r="5" fill="${C.ember}" stroke="${ink}" stroke-width=".8"/><circle cx="6" cy="-4" r="4" fill="${C.brass}" stroke="${ink}" stroke-width=".8"/></g></g>
<path d="M 20 250 C 60 246 100 248 140 244 M 420 246 C 470 242 510 248 540 246" fill="none" stroke="${ink}" stroke-width=".7"/>
</g>`
}

// ---------------------------------------------------------------- the mark
/** Logo mark: a gear ring (the O of Ogun) around an anvil with one spark. 32 x 32. */
export function markInner(id, { ink = C.bone, accent = C.ember, bg = 'none' } = {}) {
  const g = gearPath(14, 2.6)
  return `${bg !== 'none' ? `<rect width="32" height="32" rx="7" fill="${bg}"/>` : ''}<g transform="translate(16 16)"><path d="${g.d}" fill="none" stroke="${ink}" stroke-width="1.5" stroke-linejoin="round"/><circle r="${n(g.rr - 2.2)}" fill="none" stroke="${ink}" stroke-width=".8" opacity=".55"/>
<path d="M -8.4 -1.4 C -7 -1.4 -5.5 -1.6 -4.6 -1.8 L 6.4 -1.8 L 6.4 -0.4 L 4.8 -0.2 C 3.8 .2 3.3 1.2 3.2 2 C 3.1 2.8 3.5 3.3 4.4 3.7 L 5 4.3 L -4 4.3 L -3.4 3.7 C -2.6 3.3 -2.3 2.8 -2.4 2 C -2.6 1.1 -3.4 .4 -4.6 .1 C -6 -.2 -7.4 -.7 -8.4 -1.4 Z" fill="${ink}"/>
<path d="M 1.6 -9 L 2.2 -5.6 L 5 -6.6 L 2.6 -4.6 L 4.6 -2.6 L 1.6 -3.8 L .4 -1.2 L .4 -4.4 L -2.6 -4.2 L -.4 -5.8 L -2 -8 L .9 -6.2 Z" fill="${accent}"/></g>`
}
