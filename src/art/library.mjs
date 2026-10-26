// The art library: the paintings (art/library.json), the pixel crops made from them (public/art/manifest.json), and which page or
// section shows which crop. The pages (alt text) and the /credits/ page read from here, so a credit cannot drift from a picture.
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..', '..')
export const PAINTINGS = JSON.parse(readFileSync(join(ROOT, 'art', 'library.json'), 'utf8')).paintings
export const CROPS = JSON.parse(readFileSync(join(ROOT, 'public', 'art', 'manifest.json'), 'utf8'))

/** The painting a crop was made from. */
export const paintingOf = (crop) => {
  const m = CROPS[crop]
  if (!m) throw new Error(`unknown crop ${crop}`)
  return PAINTINGS[m.painting]
}

/** Alt text for a crop: what the picture is (a pixel translation of which painting) and what it shows. The credits themselves live on /credits/. */
export function altOf(crop) {
  const p = paintingOf(crop)
  return `Pixel-art translation of ${p.artist}, ${p.title} (${p.date}): ${p.scene}.`
}

// ---------------------------------------------------------------- where each crop is used
// There are no captions on the art: every painting is credited once, on /credits/ (this file feeds its "Used for" lists).
// layout: how the banner sits in the page head. banner: a full-width band above the breadcrumbs. strip: a full-width band under the lede.
// edge: a painting fading in from the right behind the head. bleed: behind the whole head. `cta`: the panorama behind the closing call to action.
export const PAGE_ART = {
  '/architecture/': { banner: 's-architecture', layout: 'banner', cta: 'c-station' },
  '/workflows/': { banner: 's-workflows', layout: 'strip', cta: 'c-coal' },
  '/operators/': { banner: 's-operators', layout: 'banner', cta: 'c-factory' },
  '/lineage/': { banner: 's-lineage', layout: 'strip', cta: 'c-fire' },
  '/benchmarks/': { banner: 's-benchmarks', layout: 'banner', cta: 'c-vesuvius' },
  '/security-model/': { banner: 's-security', layout: 'strip', cta: 'c-hills' },
  '/faq/': { banner: 's-faq', layout: 'banner', cta: 'c-rails' },
  '/glossary/': { banner: 's-glossary', layout: 'strip', cta: 'c-mill' },
  '/compare/': { banner: 's-compare', layout: 'banner', cta: 'c-coal' },
  '/roadmap/': { banner: 's-roadmap', layout: 'strip', cta: 'c-factory' },
  '/get-started/': { banner: 's-get-started', layout: 'banner', cta: 'c-fire' },
  '/about/': { banner: 's-about', layout: 'strip', cta: 'c-station' },
  '/brand/': { banner: 's-brand', layout: 'banner', cta: 'c-rails' },
  '/credits/': { banner: 's-credits', layout: 'strip', cta: 'c-hills' },
  '/legal/': { banner: 's-legal', layout: 'banner', cta: 'c-vesuvius' },
  '/legal/privacy/': { banner: 'l-privacy', layout: 'edge', cta: 'c-coal' },
  '/legal/terms/': { banner: 'l-terms', layout: 'edge', cta: 'c-hills' },
  '/legal/acceptable-use/': { banner: 'l-aup', layout: 'edge', cta: 'c-mill' },
  '/legal/cookies/': { banner: 'l-cookies', layout: 'edge', cta: 'c-rails' },
  '/legal/trademark/': { banner: 'l-trademark', layout: 'edge', cta: 'c-station' },
  '/legal/licenses/': { banner: 'l-licenses', layout: 'edge', cta: 'c-vesuvius' },
  '/legal/security/': { banner: 'l-security', layout: 'edge', cta: 'c-fire' },
  '/legal/accessibility/': { banner: 'l-accessibility', layout: 'edge', cta: 'c-factory' },
  '/legal/company/': { banner: 'l-company', layout: 'edge', cta: 'c-coal' },
  '/404/': { banner: 's-404', layout: 'banner', cta: 'c-mill' },
}

// the home page: the hero, the picture beside the acquisition text, and a band of painting between the sections
export const HOME_ART = {
  hero: 'forge-hero',
  acquire: 'forge-smithy',
  bands: { durable: 'w-durable', lifecycle: 'w-lifecycle', run: 'w-run', lineage: 'w-lineage', bench: 'w-bench', principles: 'w-principles', integrations: 'w-integrations', faq: 'w-faq' },
  cta: 'c-mill',
}

const PAGE_NAMES = {
  '/': 'home', '/architecture/': 'Architecture', '/workflows/': 'Workflows', '/operators/': 'Operators', '/lineage/': 'Lineage', '/benchmarks/': 'Benchmarks',
  '/security-model/': 'Security model', '/faq/': 'FAQ', '/glossary/': 'Glossary', '/compare/': 'Compare', '/roadmap/': 'Roadmap', '/get-started/': 'Get started',
  '/about/': 'About', '/brand/': 'Brand and press', '/credits/': 'Art credits', '/404/': 'the page-not-found page', '/legal/': 'Legal',
  '/legal/privacy/': 'Privacy', '/legal/terms/': 'Terms', '/legal/acceptable-use/': 'Acceptable use', '/legal/cookies/': 'Cookies', '/legal/trademark/': 'Trademarks',
  '/legal/licenses/': 'Licenses', '/legal/security/': 'Security policy', '/legal/accessibility/': 'Accessibility', '/legal/company/': 'Company details',
}

/** Every use of every crop, as [crop, where, kind], in reading order. */
export function uses() {
  const out = [['forge-hero', 'Home page, hero backdrop (mirrored)', 'hero'], ['forge-smithy', 'Home page, beside the acquisition text', 'plate']]
  for (const [sec, crop] of Object.entries(HOME_ART.bands)) out.push([crop, `Home page, band above the ${sec} section`, 'band'])
  out.push([HOME_ART.cta, 'Home page, closing call to action', 'panorama'])
  const where = { banner: 'banner above the title', strip: 'strip under the title', edge: 'backdrop at the edge of the title', bleed: 'backdrop behind the title' }
  for (const [path, a] of Object.entries(PAGE_ART)) {
    out.push([a.banner, `${PAGE_NAMES[path]}, ${where[a.layout]}`, 'banner'])
    out.push([a.cta, `${PAGE_NAMES[path]}, closing call to action`, 'panorama'])
  }
  return out
}

/** Where a painting is used: unique place names grouped by crop. */
export function usesOf(painting) {
  return uses().filter(([crop]) => CROPS[crop].painting === painting)
}
