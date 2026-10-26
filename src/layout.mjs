// The page shell: skip link, header with navigation and theme toggle, main, footer with the Verne endorsement.
import { esc } from '../lib/html.mjs'
import { icon, lockup, verneLogo } from './art/index.mjs'
import { pixelWordmark } from './art/pixel.mjs'

export function layout(page, body, ctx) {
  const { cfg } = ctx
  const nav = cfg.nav.map((n) => `<li><a href="${n.path}"${page.path.startsWith(n.path) ? ' aria-current="page"' : ''}>${esc(n.label)}</a></li>`).join('')
  const year = cfg.updated.slice(0, 4)
  const cols = cfg.footer
    .map((c) => `<div class="footer-col"><h2>${esc(c.title)}</h2><ul>${c.links.map(([label, href]) => `<li><a href="${href}">${esc(label)}</a></li>`).join('')}</ul></div>`)
    .join('')
  return `<!doctype html>
<html lang="${cfg.lang}" dir="ltr">
<head>
${ctx.head}
</head>
<body class="${page.bodyClass || ''}">
<a class="skip-link" href="#main">Skip to content</a>
<div class="scroll-progress" aria-hidden="true"></div>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="/" aria-label="${esc(cfg.name)} home">${lockup()}</a>
    <span class="status-pill" title="${esc(cfg.statusNote)}">${esc(cfg.status)}</span>
    <nav class="nav" aria-label="Main">
      <ul class="nav-menu" id="nav-menu">${nav}</ul>
      <button class="icon-btn theme-toggle" type="button" aria-label="Switch theme">${icon('moon', 'icon icon--moon')}${icon('sun', 'icon icon--sun')}</button>
      <button class="icon-btn nav-toggle" type="button" aria-expanded="false" aria-controls="nav-menu" aria-label="Open menu">${icon('menu')}</button>
      <a class="btn btn--ember btn--small btn--header" href="/get-started/">Try the pre-alpha</a>
    </nav>
  </div>
</header>
<main id="main" tabindex="-1">
${body}
</main>
<footer class="site-footer">
  <div class="wrap">
    <div class="sibling"><p>${esc(cfg.sibling.line)}</p><a href="${cfg.sibling.url}">Visit ${esc(cfg.sibling.name)} ${icon('arrow')}</a></div>
    <div class="footer-top">
      <div class="footer-brand">
        <a class="brand" href="/" aria-label="${esc(cfg.name)} home">${lockup('ft')}</a>
        <p>${esc(cfg.tagline)} Apache-2.0, local-first. No cookies, no analytics, no telemetry: not in the runtime, not on this site.</p>
      </div>
      ${cols}
    </div>
    <div class="endorse">
      <p class="legal-line">© ${year} ${esc(cfg.org.legalName)}, ${esc(cfg.org.address.city)}, ${esc(cfg.org.address.countryName)}. ${esc(cfg.name)} and the ${esc(cfg.name)} logo are trademarks of ${esc(cfg.org.legalName)} Software licensed under Apache-2.0.</p>
      <a class="made-by" href="${cfg.org.url}" aria-label="Designed and built by Verne Ltd. (vernesystems.com)"><span class="made-by-label">Designed and built by</span>${verneLogo('vl')}<span class="made-by-name">Verne Ltd.</span></a>
    </div>
  </div>
  <div class="foot-forge" aria-hidden="true"><div class="foot-glow"></div><div class="wrap">${pixelWordmark('foot-wordmark')}</div></div>
</footer>
</body>
</html>
`
}
