// Drawing primitives shared by the Zeus artworks. Everything is deterministic: same seed, same SVG.

/** Rounds to 2 decimals so the markup stays small and stable. */
export const n = (v) => Math.round(v * 100) / 100

/** mulberry32: small, fast, seeded pseudo-random generator. */
export function prng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const pts = (list) => list.map(([x, y]) => `${n(x)} ${n(y)}`).join(' L ')

/** Closed polygon path from points. */
export const poly = (list) => `M ${pts(list)} Z`

/**
 * A tapering ribbon along a polyline: the body of a lightning prong, a feather, a flame.
 * Widths interpolate from w0 at the first point to w1 at the last.
 */
export function ribbon(points, w0, w1) {
  const left = []
  const right = []
  const last = points.length - 1
  points.forEach(([x, y], i) => {
    const [px, py] = points[Math.max(0, i - 1)]
    const [nx, ny] = points[Math.min(last, i + 1)]
    let dx = nx - px
    let dy = ny - py
    const len = Math.hypot(dx, dy) || 1
    dx /= len
    dy /= len
    const w = (w0 + (w1 - w0) * (i / last)) / 2
    left.push([x - dy * w, y + dx * w])
    right.push([x + dy * w, y - dx * w])
  })
  return poly([...left, ...right.reverse()])
}

/** Mirrors a list of points horizontally around x = 0. */
export const mirrorX = (list) => list.map(([x, y]) => [-x, y])
export const mirrorY = (list) => list.map(([x, y]) => [x, -y])

/** A slightly irregular circle, like a hand-struck coin or a carved roundel. */
export function wobblyCircle(r, wobble, seed, steps = 90) {
  const rnd = prng(seed)
  const phase = [rnd() * 6.28, rnd() * 6.28, rnd() * 6.28]
  const p = []
  for (let i = 0; i < steps; i++) {
    const a = (i / steps) * Math.PI * 2
    const k = 1 + wobble * (Math.sin(a * 3 + phase[0]) * 0.5 + Math.sin(a * 5 + phase[1]) * 0.3 + Math.sin(a * 11 + phase[2]) * 0.2)
    p.push([Math.cos(a) * r * k, Math.sin(a) * r * k])
  }
  return smoothClosed(p)
}

/** Catmull-Rom spline through closed points, as cubic Bezier path data. */
export function smoothClosed(p, tension = 1) {
  const m = p.length
  let d = `M ${n(p[0][0])} ${n(p[0][1])}`
  for (let i = 0; i < m; i++) {
    const p0 = p[(i - 1 + m) % m]
    const p1 = p[i]
    const p2 = p[(i + 1) % m]
    const p3 = p[(i + 2) % m]
    const c1 = [p1[0] + ((p2[0] - p0[0]) / 6) * tension, p1[1] + ((p2[1] - p0[1]) / 6) * tension]
    const c2 = [p2[0] - ((p3[0] - p1[0]) / 6) * tension, p2[1] - ((p3[1] - p1[1]) / 6) * tension]
    d += ` C ${n(c1[0])} ${n(c1[1])} ${n(c2[0])} ${n(c2[1])} ${n(p2[0])} ${n(p2[1])}`
  }
  return d + ' Z'
}

/** Catmull-Rom spline through open points. */
export function smoothOpen(p, tension = 1) {
  let d = `M ${n(p[0][0])} ${n(p[0][1])}`
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[Math.max(0, i - 1)]
    const p1 = p[i]
    const p2 = p[i + 1]
    const p3 = p[Math.min(p.length - 1, i + 2)]
    const c1 = [p1[0] + ((p2[0] - p0[0]) / 6) * tension, p1[1] + ((p2[1] - p0[1]) / 6) * tension]
    const c2 = [p2[0] - ((p3[0] - p1[0]) / 6) * tension, p2[1] - ((p3[1] - p1[1]) / 6) * tension]
    d += ` C ${n(c1[0])} ${n(c1[1])} ${n(c2[0])} ${n(c2[1])} ${n(p2[0])} ${n(p2[1])}`
  }
  return d
}

/** Engraving hatch pattern: parallel lines at an angle. */
export const hatch = (id, { gap = 4, width = 0.7, angle = 45, color = 'currentColor', opacity = 1 } = {}) =>
  `<pattern id="${id}" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse" patternTransform="rotate(${angle})"><line x1="0" y1="0" x2="0" y2="${gap}" stroke="${color}" stroke-width="${width}" stroke-opacity="${opacity}"/></pattern>`

/** Greek capital letters drawn as strokes in a 20 x 28 box (no font needed). */
export const GREEK = {
  Ζ: 'M0 0 H20 L0 28 H20',
  Ε: 'M20 0 H0 V28 H20 M0 14 H15',
  Υ: 'M0 0 L10 14 L20 0 M10 14 V28',
  Σ: 'M20 0 H0 L10 14 L0 28 H20',
  Ο: 'M10 0 C24 0 24 28 10 28 C-4 28 -4 0 10 0 Z',
}
