// Reusable page parts for Ogun. Same structure as zeus-site (so SEO and accessibility stay consistent), Ogun styling.
import { esc, join, slug } from '../lib/html.mjs'
import { icon } from './art/index.mjs'
import { artImg } from './art/pixel.mjs'
import { altOf, HOME_ART, PAGE_ART } from './art/library.mjs'

// build.mjs calls begin() before each page's body is made, so that the parts know which page they are on and the bands between sections can alternate.
let pagePath = '/'
let bandN = 0
export const begin = (page) => { pagePath = page.path; bandN = 0 }

/**
 * The head of a page: breadcrumbs, title, lede, and a painting from the library (src/art/library.mjs, PAGE_ART) laid out one of four ways:
 * banner (a full-width band above the breadcrumbs), strip (a full-width band under the lede), edge (fading in from the right behind the head)
 * or bleed (behind the whole head). The art carries no caption: it has alt text, and its credit is on /credits/.
 */
export function pageHead({ crumbs = [], title, lede, meta, actions, art }) {
  const trail = [{ name: 'Home', path: '/' }, ...crumbs]
  const a = art === false ? null : PAGE_ART[(crumbs[crumbs.length - 1] || {}).path || pagePath]
  const text = `<nav class="crumbs" aria-label="Breadcrumb"><ol>${trail.map((c, i) => `<li>${i === trail.length - 1 ? `<span aria-current="page">${esc(c.name)}</span>` : `<a href="${c.path}">${esc(c.name)}</a>`}</li>`).join('')}</ol></nav>
<h1>${title}</h1>
${lede ? `<p class="lede">${lede}</p>` : ''}
${meta ? `<div class="doc-meta">${meta}</div>` : ''}
${actions ? `<div class="dl-hero-row">${actions}</div>` : ''}`
  if (!a) return `<header class="page-head"><div class="wrap">${text}</div></header>`
  const img = artImg(a.banner, { alt: altOf(a.banner) })
  if (a.layout === 'banner') return `<header class="page-head page-head--banner"><figure class="band-art page-banner">${img}</figure><div class="wrap">${text}</div></header>`
  if (a.layout === 'strip') return `<header class="page-head page-head--strip"><div class="wrap">${text}</div><figure class="band-art page-strip">${img}</figure></header>`
  return `<header class="page-head page-head--${a.layout}"><div class="page-art page-art--${a.layout}" aria-hidden="true">${artImg(a.banner)}</div><div class="wrap">${text}</div></header>`
}

/**
 * A section of a page. `art` is a crop from the library: it is shown as a full-width band of painting directly above the section (no caption),
 * alternately tall and slim so that the bands do not repeat one rhythm.
 */
export function section({ id, title, lede, body, cls = '', center = false, art = '' }) {
  const head = title
    ? `<div class="section-head${center ? ' center' : ''}" data-reveal><h2${id ? ` id="${id}-title"` : ''}>${title}</h2>${lede ? `<p class="lede">${lede}</p>` : ''}</div>`
    : ''
  const band = art ? `<figure class="band-art art-band${bandN++ % 2 ? ' art-band--slim' : ''}">${artImg(art, { alt: altOf(art) })}</figure>` : ''
  return `${band}<section class="section ${cls}"${id ? ` id="${id}"` : ''}${id && title ? ` aria-labelledby="${id}-title"` : ''}><div class="wrap">${head}${body}</div></section>`
}

export function answer({ title = 'In short', text, facts }) {
  return `<aside class="answer" aria-label="${esc(title)}" data-reveal><h2>${title}</h2><p class="answer-text">${text}</p>${facts ? `<dl>${facts.map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>` : ''}</aside>`
}

export function cards(items, { cls = '' } = {}) {
  if (items.length === 4 && !cls) cls = 'cards--4'
  return `<div class="cards ${cls}" data-reveal>${items
    .map(
      (c) => `<article class="card" data-glow>${c.icon ? `<div class="card-icon">${icon(c.icon)}</div>` : ''}<h3${c.id ? ` id="${c.id}"` : ''}>${c.title}</h3><p>${c.text}</p>${c.link ? `<a class="card-link" href="${c.link[1]}">${c.link[0]} ${icon('arrow')}</a>` : ''}</article>`,
    )
    .join('')}</div>`
}

export function faqList(items, { idPrefix = 'q' } = {}) {
  return `<div class="faq">${items
    .map((q) => `<details id="${idPrefix}-${q.id || slug(q.q).slice(0, 60)}"><summary><span>${q.q}</span><span class="chev" aria-hidden="true">${icon('x')}</span></summary><div class="faq-body">${q.a.startsWith('<') ? q.a : `<p>${q.a}</p>`}</div></details>`)
    .join('')}</div>`
}

export function checklist(items, x = false) {
  return `<ul class="checklist${x ? ' checklist--x' : ''}">${items.map((t) => `<li>${icon(x ? 'x' : 'check')}<span>${t}</span></li>`).join('')}</ul>`
}

export function table({ caption, head, rows, highlight, cls = '' }) {
  return `<div class="table-wrap" data-reveal><table class="${cls}">${caption ? `<caption>${caption}</caption>` : ''}<thead><tr>${head.map((h, i) => `<th scope="col"${i === highlight ? ' class="col-zeus"' : ''}>${h}</th>`).join('')}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c, i) => (i === 0 ? `<th scope="row">${c}</th>` : `<td${i === highlight ? ' class="col-zeus"' : ''}>${c}</td>`)).join('')}</tr>`)
    .join('')}</tbody></table></div>`
}

export const yes = (t = 'Yes') => `<span class="yes">${icon('check')}${t}</span>`
export const no = (t = 'No') => `<span class="no">${icon('x')}${t}</span>`
export const part = (t) => `<span class="part">${icon('minus')}${t}</span>`

/** Closing call to action, set over a pixel panorama chosen for the page (PAGE_ART.cta; the home page has its own). */
export function ctaForge(cfg, { title = 'Read the design', text, primary = ['Read the architecture', '/architecture/'], secondary = ['See the roadmap', '/roadmap/'], art } = {}) {
  const crop = art || (pagePath === '/' ? HOME_ART.cta : (PAGE_ART[pagePath] || {}).cta) || 'c-mill'
  return `<section class="cta" aria-labelledby="cta-title"><div class="cta-art" aria-hidden="true">${artImg(crop)}</div><div class="wrap" data-reveal><h2 id="cta-title">${title}</h2><p class="lede">${text || 'The decisions and first-draft specifications are public, and the runtime is being tested. Feedback is most useful now, before the contracts are frozen.'}</p><div class="btn-row"><a class="btn btn--ember" href="${primary[1]}">${primary[0]} ${icon('arrow', 'icon icon--arrow')}</a><a class="btn btn--ghost" href="${secondary[1]}">${secondary[0]}</a></div></div></section>`
}

export function docPage({ sections, aside = '' }) {
  const toc = `<nav class="toc" aria-label="On this page"><h2>Contents</h2><ol>${sections.map((s) => `<li><a href="#${s.id}">${s.title}</a></li>`).join('')}</ol>${aside}</nav>`
  const body = sections.map((s) => `<section aria-labelledby="${s.id}"><h2 id="${s.id}">${s.title}</h2>${s.body}</section>`).join('')
  return `<div class="wrap doc-grid">${toc}<div class="prose">${body}</div></div>`
}

export const rule = (glyph = '❦') => `<div class="wrap rule" aria-hidden="true"><span>${glyph}</span></div>`
export const note = (html, ic = 'spark') => `<div class="note">${icon(ic)}<div>${html}</div></div>`
export const statusNote = (cfg) => note(`<p><strong>${esc(cfg.status)}.</strong> ${esc(cfg.statusNote)} <a href="/roadmap/">See the roadmap</a>.</p>`, 'hourglass')

/**
 * A plate: a framed terminal capture, screenshot or drawing with a plain caption underneath that says what the reader is looking at.
 * `credit` is an optional second line of provenance for something drawn rather than recorded. Paintings never get a plate caption.
 */
export const plate = ({ caption = '', credit = '', body, cls = '' }) =>
  `<figure class="plate ${cls}" data-reveal><div class="plate-frame"><div class="plate-body">${body}</div></div>${caption || credit ? `<figcaption>${caption}${credit ? `<span class="plate-credit">${credit}</span>` : ''}</figcaption>` : ''}</figure>`

export const figure = (art, caption, cls = '') => `<figure class="figure ${cls}" data-reveal><div class="plate-wrap${/arch-svg|lineage-svg/.test(art) ? ' arch-wrap' : ''}">${art}</div><figcaption>${caption}</figcaption></figure>`

export { join, esc, slug }

/** Minimal, dependency-free highlighter for the code samples (yaml, json, python, sh). Escapes first.
 *  Matches are parked behind private-use placeholder characters so later passes cannot touch them. */
export function hl(lang, code) {
  const keep = []
  const ph = (html) => { keep.push(html); return String.fromCharCode(0xe000 + keep.length - 1) }
  const wrap = (cls) => (m) => ph(`<span class="tok-${cls}">${m}</span>`)
  let s = esc(code)
  if (lang !== 'json') s = s.replace(/(^|\s)(#[^\n]*)/g, (m, sp, c) => sp + wrap('c')(c))
  if (lang === 'json') s = s.replace(/(&quot;[^\n]*?&quot;)(\s*:)/g, (m, k, c) => wrap('k')(k) + c)
  s = s.replace(/&quot;[^\n]*?&quot;/g, wrap('s'))
  if (lang === 'yaml') s = s.replace(/^(\s*-?\s*)([a-z_][\w.]*)(:)/gm, (m, a, k, c) => a + wrap('k')(k) + c)
  if (lang === 'python') s = s.replace(/\b(from|import|def|return|as|for|in|if)\b/g, wrap('k')).replace(/(@\w+)/g, wrap('p'))
  if (lang === 'sh') s = s.replace(/^(\$)/gm, wrap('p')).replace(/\b(ogun)\b/g, wrap('k'))
  s = s.replace(/(?<![#\w.&])(\d[\d.]*)\b/g, wrap('n'))
  let prev
  do { prev = s; s = s.replace(/[\ue000-\uf8ff]/g, (c) => keep[c.charCodeAt(0) - 0xe000]) } while (s !== prev)
  return s
}

/** Tabbed code samples (WAI-ARIA tabs). */
export function codeTabs(id, tabs) {
  return `<div class="tabs" data-tabs data-reveal><div class="tablist" role="tablist" aria-label="Code samples">${tabs
    .map((t, i) => `<button type="button" role="tab" id="${id}-t${i}" aria-controls="${id}-p${i}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${t.icon ? icon(t.icon) : ''}${t.label}</button>`)
    .join('')}<span class="tab-ink" aria-hidden="true"></span></div>${tabs
    .map((t, i) => `<div class="tabpanel" role="tabpanel" id="${id}-p${i}" aria-labelledby="${id}-t${i}"${i ? ' hidden' : ''} tabindex="0"><button class="copy-btn" type="button" data-copy="${id}-c${i}">${icon('copy')}<span class="copy-label">copy</span></button><pre id="${id}-c${i}">${t.html ?? hl(t.lang, t.code)}</pre></div>`)
    .join('')}</div>`
}

/** A terminal transcript captured from the real binaries (see tools/capture.mjs): prompts, commands and comments are marked, output is left alone. */
export function term(transcript) {
  const NL = String.fromCharCode(10)
  return transcript
    .split(NL)
    .map((l) => {
      const e = esc(l)
      if (l.startsWith('$ ')) return `<span class="tok-p">$</span> <span class="t-cmd">${e.slice(2)}</span>`
      if (l.startsWith('# ')) return `<span class="tok-c">${e}</span>`
      if (l.startsWith('[exit status')) return `<span class="t-exit">${e}</span>`
      return e
    })
    .join(NL)
}
