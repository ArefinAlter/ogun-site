import { altOf, CROPS, PAINTINGS, usesOf } from '../art/library.mjs'
import { artImg } from '../art/pixel.mjs'
import { ctaForge, note, pageHead, section, table } from '../parts.mjs'

const link = (url, text) => `<a href="${url}" rel="noopener">${text}</a>`
const commonsUrl = (title) => 'https://commons.wikimedia.org/wiki/' + encodeURI(title.replace(/ /g, '_'))

// A representative crop for each painting's card: of the crops cut from it, the one whose shape is closest to the card's.
const thumb = (id) => Object.entries(CROPS).filter(([k, m]) => m.painting === id && !k.endsWith('-sepia')).sort((x, y) => Math.abs(x[1].size[0] / x[1].size[1] - 1.6) - Math.abs(y[1].size[0] / y[1].size[1] - 1.6))[0][0]

const card = ([id, p]) => {
  const places = usesOf(id)
  const where = places.length ? `<ul class="credit-uses">${[...new Set(places.map(([, w]) => w))].map((w) => `<li>${w}</li>`).join('')}</ul>` : 'Not used yet'
  return `<article class="credit-card" data-reveal><div class="pixel-frame">${artImg(thumb(id), { alt: altOf(thumb(id)) })}</div><div class="credit-body"><h3>${p.title}</h3><dl>
<dt>Artist</dt><dd>${p.artist} (${p.years})</dd>
<dt>Date</dt><dd>${p.date}</dd>
<dt>Owner</dt><dd>${p.owner}</dd>
<dt>Licence</dt><dd>Public domain (${p.licence})</dd>
<dt>Object</dt><dd>${link(p.object.url, p.object.label)}</dd>
<dt>Source</dt><dd>${link(commonsUrl(p.commons), `Wikimedia Commons file`)}${p.origin ? `; ${p.origin}` : ''}</dd>
<dt>Used for</dt><dd>${where}</dd></dl></div></article>`
}

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
  description: 'Seventeen public-domain paintings of forges, fire and iron, translated to pixels by a script: owners, licences, sources, where each is used, and the fonts.',
  crumbs: [{ name: 'Art credits', path: '/credits/' }],
  body: () => {
    const entries = Object.entries(PAINTINGS)
    return `
${pageHead({ crumbs: [{ name: 'Art credits', path: '/credits/' }], title: 'Art credits', lede: `The paintings on this site are ${entries.length} public-domain works from museum collections, translated into pixels by a script in the site’s repository. They carry no captions on the pages; this is where each is credited. No image was generated, and none was taken from another website’s artwork.` })}
${section({
  id: 'paintings',
  title: 'Paintings',
  lede: `Each is shown here by one of its crops, the way the site uses it: reduced to a fixed grid of art pixels and dithered into the same ten ember colours, so that works from 1568 to 1897 read as one family. The originals are not redistributed; follow the source links for them. ${Object.keys(CROPS).filter((k) => !k.endsWith('-sepia')).length} crops are in use, each in an ember and a sepia grade.`,
  body: `<div class="credit-grid">${entries.map(card).join('')}</div>`,
})}
${section({
  id: 'treatment',
  cls: 'section--band',
  title: 'How a painting becomes pixels',
  body: `<div class="wrap--narrow" data-reveal><p class="lede">The treatment is a script, <code>art/build.py</code> in the <a href="https://github.com/ArefinAlter/ogun-site" rel="noopener">ogun-site repository</a>, and it gives the same output every time.</p><ol class="steps-list"><li>Crop the original to a chosen box with the target aspect and reduce it to a fixed grid: 480 by 300 art pixels for the hero, 480 by 96 for the wide bands on pages and between sections, 560 by 200 for a panorama behind a closing call to action.</li><li>Stretch the tones: a black point and a white point from the image’s own quantiles, half-strength local contrast, and a gamma chosen per painting so that the dark parts stay dark. Pale, misty paintings (Turner’s locomotive, Monet’s station) are inverted first, so that the engine and the rails become the hot iron.</li><li>Map the luminance onto a ten-colour ramp from iron black through rust, ember and amber to bone, using an 8 by 8 Bayer ordered dither. A second ramp, sepia, keeps the same tones on bone paper for the light theme.</li><li>Store the result as an indexed PNG at the grid size (8 to 33 kilobytes) and draw it at 2 to 4 CSS pixels per art pixel with <code>image-rendering: pixelated</code>.</li></ol>${note('<p>Ògún is the Yoruba orisha of iron. The site shows European forges, foundries and fires from the sixteenth to the nineteenth century, painted by their own contemporaries, and nothing that depicts the orisha or any sacred object. See <a href="/about/#name">About</a>.</p>', 'compass')}</div>`,
})}
${section({
  id: 'fonts',
  title: 'Typefaces and icons',
  body: `${table({
    head: ['Typeface', 'Copyright', 'Licence', 'Licence text'],
    rows: FONTS.map(([n, cp, l, f]) => [n, cp, l, `<a href="${f}">${f.split('/').pop()}</a>`]),
  })}<p class="small muted" data-reveal>All four are self-hosted under the <a href="https://openfontlicense.org" rel="noopener">SIL Open Font License 1.1</a>. Departure Mono draws the wordmark and the small labels; the wordmark’s pixels are read from its glyph outlines by <code>art/wordmark.py</code>. The operating-system logos on the download cards are from Simple Icons (CC0).</p>`,
})}
${ctaForge(undefined)}`
  },
}
