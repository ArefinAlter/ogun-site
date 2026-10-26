// Measures the background behind every run of text, art included: for each page, theme and size it records each text run (colour, size, rectangle, clipped to its
// scrolling ancestors), then takes a full-page screenshot with all text made transparent; tools/textbg.py then reports the runs whose contrast against the pixels
// behind them is below WCAG AA (4.5:1, or 3:1 for large text). Needs Playwright: set PLAYWRIGHT_MODULES to a node_modules folder that has `playwright` or `@playwright/test`.
//   node tools/textbg.cjs <baseUrl> <outDir> [--pages=/,/faq/] [--vp=1440x900,390x844] [--themes=dark,light]
//   python -I tools/textbg.py <outDir>
const { createRequire } = require('module')
const req = createRequire((process.env.PLAYWRIGHT_MODULES || process.cwd() + '/node_modules').replace(/\/?$/, '/'))
let pw
try { pw = req('playwright') } catch { pw = req('@playwright/test') }
const { chromium } = pw
const fs = require('fs')
const base = process.argv[2].replace(/\/$/, ''); const out = process.argv[3]
const arg = (n, d) => (process.argv.find((a) => a.startsWith('--' + n + '=')) || '').split('=').slice(1).join('=') || d
const pages = arg('pages', '/,/architecture/,/workflows/,/operators/,/lineage/,/benchmarks/,/security-model/,/faq/,/glossary/,/compare/,/roadmap/,/get-started/,/about/,/brand/,/credits/,/legal/,/legal/acceptable-use/,/legal/accessibility/,/legal/company/,/legal/cookies/,/legal/licenses/,/legal/privacy/,/legal/security/,/legal/terms/,/legal/trademark/,/nope/').split(',')
const vps = arg('vp', '1440x900,1280x720,390x844').split(',').map((x) => x.split('x').map(Number))
const themes = arg('themes', 'dark,light').split(',')
fs.mkdirSync(out, { recursive: true })
;(async () => {
  const b = await chromium.launch()
  for (const theme of themes) for (const [w, h] of vps) {
    const c = await b.newContext({ viewport: { width: w, height: h }, colorScheme: theme, reducedMotion: 'reduce' })
    for (const p of pages) {
      const page = await c.newPage()
      await page.goto(base + p, { waitUntil: 'load' }); await page.waitForTimeout(500)
      const H = await page.evaluate(() => document.documentElement.scrollHeight)
      for (let y = 0; y < H; y += Math.round(h * 0.7)) { await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: 'instant' }), y); await page.waitForTimeout(80) }
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
      await page.waitForTimeout(300)
      const runs = await page.evaluate(() => {
        document.querySelectorAll('[data-reveal]').forEach((e) => e.classList.add('is-in'))
        const res = []
        const where = (e) => { const k = e.closest('.page-credit,.section-credit,.cta-credit,.page-head,.cta,.forge-hero,.section,footer,header'); return k ? (k.className || k.tagName).toString().split(' ')[0] : '' }
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
        let n
        while ((n = walker.nextNode())) {
          const t = n.textContent.trim(); if (!t) continue
          const el = n.parentElement
          if (!el || el.closest('script,style,noscript,[hidden],.sr-only,.skip-link,svg')) continue
          const cs = getComputedStyle(el)
          if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity === 0) continue
          // text inside a control, a card or a code box has its own opaque surface; still measured, the surface is in the screenshot
          const r = document.createRange(); r.selectNodeContents(n)
          for (const q0 of r.getClientRects()) {
            // text scrolled out of a clipping box (a code panel, a table wrapper) is not on screen: clip the run to its clipping ancestors
            let l = q0.left, rt = q0.right, tp = q0.top, bt = q0.bottom
            for (let a = el; a && a !== document.documentElement; a = a.parentElement) { const s = getComputedStyle(a); if (s.overflowX !== 'visible' || s.overflowY !== 'visible' || s.overflow === 'clip') { const ar = a.getBoundingClientRect(); if (s.overflowX !== 'visible') { l = Math.max(l, ar.left); rt = Math.min(rt, ar.right) } if (s.overflowY !== 'visible') { tp = Math.max(tp, ar.top); bt = Math.min(bt, ar.bottom) } } }
            const q = { left: l, top: tp, width: rt - l, height: bt - tp }
            if (q.width > 2 && q.height > 2) res.push({ t: t.slice(0, 40), x: q.left + scrollX, y: q.top + scrollY, w: q.width, h: q.height, wh: where(el), c: cs.color, fs: parseFloat(cs.fontSize), fw: +cs.fontWeight, op: +cs.opacity }) }
        }
        document.querySelectorAll('*').forEach((e) => { e.style.setProperty('color', 'transparent', 'important'); e.style.setProperty('text-shadow', 'none', 'important'); e.style.setProperty('-webkit-text-fill-color', 'transparent', 'important'); e.style.setProperty('caret-color', 'transparent', 'important') })
        return res
      })
      await page.waitForTimeout(150)
      const name = (p === '/' ? 'home' : p.replace(/^\/|\/$/g, '').replace(/\//g, '-')) + `.${theme}.${w}`
      await page.screenshot({ path: `${out}/${name}.png`, fullPage: true })
      fs.writeFileSync(`${out}/${name}.json`, JSON.stringify(runs))
      await page.close()
    }
    await c.close()
  }
  await b.close(); console.log('done')
})()
