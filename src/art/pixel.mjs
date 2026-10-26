// Pixel art helpers: the OGUN wordmark as SVG rectangles, and the processed forge paintings as <img> pairs (ember and sepia grade).
// The paintings are produced by art/build.py and listed in public/art/manifest.json; the wordmark's pixels come from art/wordmark.py.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { WORDMARK_PIXELS } from './pixel-wordmark.mjs'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..')
export const ART = JSON.parse(readFileSync(join(ROOT, 'public', 'art', 'manifest.json'), 'utf8'))

/**
 * The wordmark as one SVG: a <rect> per run of pixels, grouped by row so that CSS can give every row its own heat
 * (--wm-0 at the top, the hottest, to --wm-7 at the bottom). `label` makes it an image with a name; without it the mark is decoration.
 */
export function pixelWordmark(cls = '', label = '') {
  const rows = WORDMARK_PIXELS
  const w = rows[0].length
  const h = rows.length
  const g = rows
    .map((row, y) => {
      const runs = [...row.matchAll(/#+/g)].map((m) => `<rect x="${m.index}" y="${y}" width="${m[0].length}" height="1"/>`).join('')
      return `<g class="wm-row wm-row--${y}">${runs}</g>`
    })
    .join('')
  const a11y = label ? `role="img" aria-label="${label}"` : 'aria-hidden="true" focusable="false"'
  return `<svg class="pixel-wordmark ${cls}" viewBox="0 0 ${w} ${h}" width="${w * 8}" height="${h * 8}" ${a11y} shape-rendering="crispEdges">${g}</svg>`
}

/**
 * A forge painting in both grades. The ember grade shows on the dark theme, the sepia grade on the light theme; the one that
 * is hidden is never fetched (lazy images that are not displayed stay unloaded). `loading` is "lazy" for everything below the fold.
 */
export function artImg(name, { cls = '', alt = '', loading = 'lazy', priority = false } = {}) {
  const m = ART[name]
  if (!m) throw new Error(`unknown art ${name}`)
  const [w, h] = m.size
  const img = (src, c) => `<img class="${c} ${cls}" src="/art/${src}.png" width="${w}" height="${h}" alt="${alt}" decoding="async" loading="${loading}"${priority ? ' fetchpriority="high"' : ''}>`
  return `${img(name, 'art-ember')}${img(name + '-sepia', 'art-sepia')}`
}

/** Preload links for the hero painting: the grade that matches the system theme. */
export const preloadHero = () => [
  { href: '/art/forge-hero.png', as: 'image', type: 'image/png', media: '(prefers-color-scheme: dark)', priority: 'high' },
  { href: '/art/forge-hero-sepia.png', as: 'image', type: 'image/png', media: '(prefers-color-scheme: light)', priority: 'high' },
  { href: '/fonts/departure-mono.woff2', as: 'font', type: 'font/woff2' },
]

/** The wordmark as a standalone SVG file with fixed row colours (top row first), for the brand kit. */
export function pixelWordmarkDoc(rowColors, title) {
  const body = WORDMARK_PIXELS.map((row, y) => [...row.matchAll(/#+/g)].map((m) => `<rect x="${m.index}" y="${y}" width="${m[0].length}" height="1" fill="${rowColors[y]}"/>`).join('')).join('')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WORDMARK_PIXELS[0].length} ${WORDMARK_PIXELS.length}" shape-rendering="crispEdges" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`
}
