#!/usr/bin/env node
// Zero-dependency static site build. Usage:
//   node build.mjs            build into dist/ and run the checks (fails on errors)
//   node build.mjs --brand    also write the standalone brand assets into brand/assets/
// Pages are ES modules in src/pages/ that export a page object (or an array of them).
import { createHash } from 'node:crypto'
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { abs, headTags } from './lib/seo.mjs'
import { htmlToText } from './lib/text.mjs'

const ROOT = dirname(fileURLToPath(import.meta.url))
const DIST = join(ROOT, 'dist')
const argv = new Set(process.argv.slice(2))
const imp = (p) => import(pathToFileURL(join(ROOT, p)).href)

const cfg = (await imp('site.config.mjs')).default
const { layout } = await imp('src/layout.mjs')
const art = await imp('src/art/index.mjs')

const walk = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n)
    return statSync(p).isDirectory() ? walk(p) : [p]
  })

// ---- assets (content-hashed for immutable caching) ----
const hash = (s) => createHash('sha256').update(s).digest('hex').slice(0, 10)
rmSync(DIST, { recursive: true, force: true })
mkdirSync(join(DIST, 'assets'), { recursive: true })
const css = readFileSync(join(ROOT, 'src/css/site.css'), 'utf8')
const js = readFileSync(join(ROOT, 'src/js/site.js'), 'utf8')
const assets = { css: `/assets/site.${hash(css)}.css`, js: `/assets/site.${hash(js)}.js` }
writeFileSync(join(DIST, assets.css), css)
writeFileSync(join(DIST, assets.js), js)
cpSync(join(ROOT, 'public'), DIST, { recursive: true })

// ---- pages ----
const pageFiles = walk(join(ROOT, 'src/pages')).filter((f) => f.endsWith('.mjs')).sort()
const pages = []
for (const f of pageFiles) {
  const mod = await import(pathToFileURL(f).href)
  for (const p of [].concat(mod.default)) pages.push({ ...p, source: relative(ROOT, f) })
}
pages.sort((a, b) => (a.order ?? 50) - (b.order ?? 50) || a.path.localeCompare(b.path))

const ctx = { cfg, art, assets, pages, abs: (p) => abs(cfg, p) }
const rendered = []
for (const page of pages) {
  const body = typeof page.body === 'function' ? page.body(ctx) : page.body
  const html = layout(page, body, { ...ctx, head: headTags(page, cfg, assets) })
  const out = page.path === '/404/' ? join(DIST, '404.html') : join(DIST, ...page.path.split('/').filter(Boolean), 'index.html')
  mkdirSync(dirname(out), { recursive: true })
  writeFileSync(out, html)
  rendered.push({ page, html, body, out })
}

// ---- standalone art, favicon ----
const standalone = art.standalone(cfg)
mkdirSync(join(DIST, 'art'), { recursive: true })
for (const [name, svg] of Object.entries(standalone)) writeFileSync(join(DIST, 'art', name + '.svg'), svg)
writeFileSync(join(DIST, 'favicon.svg'), standalone.favicon)
if (argv.has('--brand')) {
  const dir = join(ROOT, 'brand', 'assets')
  mkdirSync(dir, { recursive: true })
  for (const [name, svg] of Object.entries(standalone)) writeFileSync(join(dir, name + '.svg'), svg)
}

// ---- render pages for PNG export (og image, icons): see tools/render-pngs.sh ----
for (const [name, r] of Object.entries(art.renders ? art.renders(cfg, assets) : {})) {
  mkdirSync(join(DIST, '_render', name), { recursive: true })
  writeFileSync(join(DIST, '_render', name, 'index.html'), r)
}

// ---- machine-readable files ----
const indexed = rendered.filter((r) => !r.page.noindex)
writeFileSync(
  join(DIST, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    indexed
      .map((r) => `  <url><loc>${abs(cfg, r.page.path)}</loc><lastmod>${r.page.updated || cfg.updated}</lastmod><changefreq>${r.page.changefreq || 'monthly'}</changefreq><priority>${(r.page.priority ?? 0.6).toFixed(1)}</priority></url>`)
      .join('\n') +
    '\n</urlset>\n',
)

const AI_AGENTS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Bingbot', 'DuckAssistBot', 'MistralAI-User', 'cohere-ai']
writeFileSync(
  join(DIST, 'robots.txt'),
  `# ${cfg.name} by ${cfg.org.legalName}. Everything here is public; search and answer engines are welcome.\n` +
    `User-agent: *\nAllow: /\nDisallow: /_render/\n\n` +
    AI_AGENTS.map((a) => `User-agent: ${a}\nAllow: /\nDisallow: /_render/`).join('\n\n') +
    `\n\nSitemap: ${abs(cfg, '/sitemap.xml')}\n`,
)

const groups = {}
for (const r of indexed) (groups[r.page.group || 'Pages'] ||= []).push(r.page)
writeFileSync(
  join(DIST, 'llms.txt'),
  `# ${cfg.name}\n\n> ${cfg.llms.summary}\n\n${cfg.llms.facts.map((f) => `- ${f}`).join('\n')}\n\n` +
    cfg.llms.groups
      .filter((g) => groups[g])
      .map((g) => `## ${g}\n\n` + groups[g].map((p) => `- [${p.nav || p.title}](${abs(cfg, p.path)}): ${p.description}`).join('\n'))
      .join('\n\n') +
    `\n\n## Optional\n\n- [Full text of this site](${abs(cfg, '/llms-full.txt')}): every page above as plain text\n- [${cfg.org.name}](${cfg.org.url}): the company that makes ${cfg.name}\n`,
)
writeFileSync(
  join(DIST, 'llms-full.txt'),
  `# ${cfg.name}: full site text\n\n> ${cfg.llms.summary}\n\nSource: ${abs(cfg, '/')} · Publisher: ${cfg.org.legalName} (${cfg.org.url}) · Updated: ${cfg.updated}\n\n` +
    indexed
      .map((r) => {
        const main = (r.html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i) || [, r.body])[1]
        return `---\n\nURL: ${abs(cfg, r.page.path)}\n\n${htmlToText(main)}`
      })
      .join('\n\n') +
    '\n',
)

writeFileSync(
  join(DIST, 'manifest.webmanifest'),
  JSON.stringify(
    {
      name: `${cfg.name}, by ${cfg.org.name}`,
      short_name: cfg.name,
      description: cfg.description,
      start_url: '/',
      scope: '/',
      display: 'browser',
      background_color: cfg.backgroundColor,
      theme_color: cfg.themeColor,
      lang: cfg.lang,
      icons: [
        { src: '/favicon.svg', type: 'image/svg+xml', sizes: 'any' },
        { src: '/icon-192.png', type: 'image/png', sizes: '192x192' },
        { src: '/icon-512.png', type: 'image/png', sizes: '512x512' },
      ],
    },
    null,
    2,
  ),
)

const expires = new Date(Date.parse(cfg.updated) + 330 * 864e5).toISOString().replace(/\.\d+Z$/, '.000Z')
mkdirSync(join(DIST, '.well-known'), { recursive: true })
const securityTxt =
  `Contact: mailto:${cfg.contacts.security}\nExpires: ${expires}\nPreferred-Languages: en, bn\n` +
  `Canonical: ${abs(cfg, '/.well-known/security.txt')}\nPolicy: ${abs(cfg, '/legal/security/')}\n`
writeFileSync(join(DIST, '.well-known', 'security.txt'), securityTxt)
writeFileSync(
  join(DIST, 'humans.txt'),
  `/* TEAM */\nMade by: ${cfg.org.legalName}\nSite: ${cfg.org.url}\nContact: ${cfg.org.email}\nFrom: ${cfg.org.address.city}, ${cfg.org.address.countryName}\n\n/* SITE */\nLast update: ${cfg.updated}\nStandards: HTML, CSS, SVG, JavaScript (no frameworks, no trackers)\nFonts: ${cfg.fonts.names.join(', ')} (SIL Open Font License 1.1)\n`,
)

// ---- checks ----
const errors = []
const warnings = []
const titles = new Map()
const exists = (p) => {
  const clean = decodeURI(p.split(/[?#]/)[0])
  if (clean === '/') return existsSync(join(DIST, 'index.html'))
  const f = join(DIST, ...clean.split('/').filter(Boolean))
  return clean.endsWith('/') ? existsSync(join(f, 'index.html')) : existsSync(f)
}
for (const { page, html } of rendered) {
  const where = page.path
  const h1 = (html.match(/<h1\b/gi) || []).length
  if (h1 !== 1) errors.push(`${where}: ${h1} h1 elements (expected 1)`)
  if (titles.has(page.title)) errors.push(`${where}: duplicate title with ${titles.get(page.title)}`)
  titles.set(page.title, where)
  if (page.title.length > 65) warnings.push(`${where}: title ${page.title.length} chars`)
  if (!page.description || page.description.length < 70 || page.description.length > 165) warnings.push(`${where}: description ${page.description?.length ?? 0} chars`)
  for (const m of html.matchAll(/<img\b(?![^>]*\balt=)[^>]*>/gi)) errors.push(`${where}: img without alt: ${m[0].slice(0, 80)}`)
  for (const m of html.matchAll(/\s(?:href|src)="(\/[^"]*)"/g)) {
    if (m[1].startsWith('//')) continue
    if (!exists(m[1])) errors.push(`${where}: broken internal link ${m[1]}`)
  }
  for (const m of html.matchAll(/\sid="([^"]+)"/g)) {
    if ((html.match(new RegExp(`\\sid="${m[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g')) || []).length > 1) {
      errors.push(`${where}: duplicate id ${m[1]}`)
      break
    }
  }
  for (const m of html.matchAll(/href="#([^"]+)"/g)) if (!html.includes(`id="${m[1]}"`)) errors.push(`${where}: missing fragment #${m[1]}`)
  for (const m of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/gi)) if (!/rel="[^"]*noopener/.test(m[0])) errors.push(`${where}: target=_blank without noopener`)
  if (/\bTODO\b|\{\{|undefined|\[object Object\]|NaN/.test(html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')))
    errors.push(`${where}: placeholder or rendering artifact (TODO, {{, undefined, [object Object] or NaN)`)
}
const kb = (f) => (statSync(f).size / 1024).toFixed(1)
console.log(`${cfg.name}: ${rendered.length} pages, css ${kb(join(DIST, assets.css))} kB, js ${kb(join(DIST, assets.js))} kB, largest page ${Math.max(...rendered.map((r) => statSync(r.out).size / 1024)).toFixed(0)} kB`)
for (const w of warnings) console.log('warn  ' + w)
for (const e of errors) console.log('ERROR ' + e)
if (errors.length) {
  console.log(`${errors.length} error(s)`)
  process.exit(1)
}
console.log('OK')
