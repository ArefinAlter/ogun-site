import { artImg } from '../art/pixel.mjs'
import { ctaForge, note, pageHead, section, table } from '../parts.mjs'

const c = (url, text) => `<a href="${url}" rel="noopener">${text}</a>`

// One entry per painting. The treated crops are in public/art; the originals are not redistributed.
const WORKS = [
  {
    art: 'forge-hero',
    title: 'An Iron Forge',
    dl: [
      ['Artist', 'Joseph Wright of Derby (1734 to 1797)'],
      ['Date', '1772'],
      ['Owner', 'Tate (T06670)'],
      ['Licence', 'Public domain: the artist died in 1797, and a photograph of a flat work adds no new right (Commons: PD-Art, PD-old-100)'],
      ['Source', c('https://commons.wikimedia.org/wiki/File:Joseph_Wright_-_An_Iron_Forge_-_Google_Art_Project.jpg', 'Wikimedia Commons, from Google Arts &amp; Culture 8QFaV4btMWcjBA')],
      ['Used for', 'The home page backdrop (480 by 300 art pixels, wide crop of the lower two thirds)'],
    ],
  },
  {
    art: 'forge-smithy',
    title: 'The Blacksmith’s Shop',
    dl: [
      ['Artist', 'Joseph Wright of Derby (1734 to 1797)'],
      ['Date', '1771'],
      ['Owner', 'Yale Center for British Art, Paul Mellon Collection'],
      ['Licence', 'Public domain (Commons: PD-Art, PD-old-100)'],
      ['Source', c('https://commons.wikimedia.org/wiki/File:Joseph_Wright_of_Derby_-_The_Blacksmith%27s_Shop_-_Google_Art_Project.jpg', 'Wikimedia Commons, from Google Arts &amp; Culture YQG7cp1C1rHxag')],
      ['Used for', 'The acquisition plate (a detail of the smith and the anvil)'],
    ],
  },
  {
    art: 'forge-mill-wide',
    title: 'The Iron Rolling Mill (Modern Cyclops)',
    dl: [
      ['Artist', 'Adolph Menzel (1815 to 1905)'],
      ['Date', '1872 to 1875'],
      ['Owner', 'Alte Nationalgalerie, Staatliche Museen zu Berlin'],
      ['Licence', 'Public domain: the artist died in 1905 (Commons: PD-art-two-auto)'],
      ['Source', c('https://commons.wikimedia.org/wiki/File:Adolph_Menzel_-_Eisenwalzwerk_-_Google_Art_Project.jpg', 'Wikimedia Commons, from Google Arts &amp; Culture pgFVPI1J1YGXZA')],
      ['Used for', 'The panorama behind every closing call to action, and a detail of the slab at the edge of some sections'],
    ],
  },
  {
    art: 'forge-night',
    title: 'An Iron Forge Viewed from Without',
    dl: [
      ['Artist', 'Joseph Wright of Derby (1734 to 1797)'],
      ['Date', '1773'],
      ['Owner', 'Hermitage Museum, Saint Petersburg'],
      ['Licence', 'Public domain (Commons: PD-Art, PD-old-auto-expired)'],
      ['Source', c('https://commons.wikimedia.org/wiki/File:The_Iron_Forge_Viewed_from_Without.jpg', 'Wikimedia Commons, from the Web Gallery of Art')],
      ['Used for', 'The banner behind page titles, and the page-not-found page'],
    ],
  },
]

const FONTS = [
  ['EB Garamond', 'Copyright 2017 The EB Garamond Project Authors', 'SIL OFL 1.1', '/fonts/LICENSE-eb-garamond.txt'],
  ['IBM Plex Sans', 'Copyright 2019 IBM Corp.', 'SIL OFL 1.1', '/fonts/LICENSE-ibm-plex-sans.txt'],
  ['IBM Plex Mono', 'Copyright 2017 IBM Corp.', 'SIL OFL 1.1', '/fonts/LICENSE-ibm-plex-mono.txt'],
  ['Departure Mono', 'Copyright 2022 to 2024 Helena Zhang', 'SIL OFL 1.1', '/fonts/LICENSE-departure-mono.txt'],
]

export default {
  path: '/credits/',
  order: 32,
  group: 'Company',
  nav: 'Art credits',
  priority: 0.4,
  updated: '2026-10-26',
  title: 'Art credits: forge paintings, fonts and tools',
  description: 'The paintings on the Ogun site are public-domain works from museum collections, translated to pixels by a script in the repository. Sources, licences and fonts.',
  crumbs: [{ name: 'Art credits', path: '/credits/' }],
  body: () => `
${pageHead({ crumbs: [{ name: 'Art credits', path: '/credits/' }], title: 'Art credits', lede: 'The paintings on this site are public-domain works from museum collections, translated into pixels by a script in the site’s repository. No image was generated, and none was taken from another website’s artwork.', art: 'forge-smithy' })}
${section({
  id: 'paintings',
  title: 'Paintings',
  lede: 'Each is shown here as the site uses it: a crop, reduced to a fixed grid of art pixels and dithered into ten ember colours. The originals are not redistributed; follow the source links for them.',
  body: `<div class="credit-grid">${WORKS.map((w) => `<article class="credit-card" data-reveal><div class="pixel-frame">${artImg(w.art, { alt: `A pixel translation of ${w.title}.` })}</div><div class="credit-body"><h3>${w.title}</h3><dl>${w.dl.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl></div></article>`).join('')}</div>`,
})}
${section({
  id: 'treatment',
  cls: 'section--band',
  title: 'How a painting becomes pixels',
  body: `<div class="wrap--narrow" data-reveal><p class="lede">The treatment is a script, <code>art/build.py</code> in the <a href="https://github.com/ArefinAlter/ogun-site" rel="noopener">ogun-site repository</a>, and it gives the same output every time.</p><ol class="steps-list"><li>Crop the original to a chosen box and reduce it to a fixed grid: 480 by 300 art pixels for the hero, 560 by 200 for the panorama.</li><li>Stretch the tones: a black point and a white point from the image’s own quantiles, half-strength local contrast, a gamma that keeps the dark parts dark.</li><li>Map the luminance onto a ten-colour ramp from iron black through rust, ember and amber to bone, using an 8 by 8 Bayer ordered dither. A second ramp, sepia, keeps the same tones on bone paper for the light theme.</li><li>Store the result as an indexed PNG at the grid size (30 to 40 kilobytes for the hero) and draw it at 2 to 4 CSS pixels per art pixel with <code>image-rendering: pixelated</code>.</li></ol>${note('<p>Ògún is the Yoruba orisha of iron. The site shows European and Russian forges from the eighteenth and nineteenth centuries, painted by their own contemporaries, and nothing that depicts the orisha or any sacred object. See <a href="/about/#name">About</a>.</p>', 'compass')}</div>`,
})}
${section({
  id: 'fonts',
  title: 'Typefaces and icons',
  body: `${table({
    head: ['Typeface', 'Copyright', 'Licence', 'Licence text'],
    rows: FONTS.map(([n, cp, l, f]) => [n, cp, l, `<a href="${f}">${f.split('/').pop()}</a>`]),
  })}<p class="small muted" data-reveal>All four are self-hosted under the <a href="https://openfontlicense.org" rel="noopener">SIL Open Font License 1.1</a>. Departure Mono draws the wordmark and the small labels; the wordmark’s pixels are read from its glyph outlines by <code>art/wordmark.py</code>. The operating-system logos on the download cards are from Simple Icons (CC0).</p>`,
})}
${ctaForge(undefined)}`,
}
