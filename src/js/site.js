/* Ogun site interactions. No dependencies, no network, no storage (the theme toggle lasts for the visit only).
   Progressive: the page is complete without this script; reduced motion turns every effect off. */
(() => {
  'use strict'
  const root = document.documentElement
  root.classList.add('js')
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const fine = window.matchMedia('(pointer: fine)').matches
  const $ = (s, el = document) => el.querySelector(s)
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s))
  const sleep = (ms) => new Promise((r) => setTimeout(r, reduce ? 0 : ms))
  const onView = (el, fn, threshold = 0.3) => {
    if (!el) return
    if (!('IntersectionObserver' in window)) return fn()
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) { io.disconnect(); fn() } }, { threshold })
    io.observe(el)
  }

  // ---------------------------------------------------------------- header, progress, navigation
  const header = $('.site-header')
  const bar = $('.scroll-progress')
  let ticking = false
  const onScroll = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      const y = window.scrollY
      header && header.classList.toggle('is-scrolled', y > 8)
      const h = document.documentElement.scrollHeight - window.innerHeight
      bar && bar.style.setProperty('--progress', h > 0 ? Math.min(1, y / h).toFixed(4) : '0')
      ticking = false
    })
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  const nav = $('.nav')
  const toggle = $('.nav-toggle')
  if (nav && toggle) {
    const set = (open) => { nav.classList.toggle('is-open', open); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu') }
    toggle.addEventListener('click', () => set(!nav.classList.contains('is-open')))
    document.addEventListener('keydown', (e) => e.key === 'Escape' && nav.classList.contains('is-open') && (set(false), toggle.focus()))
    document.addEventListener('click', (e) => nav.classList.contains('is-open') && !nav.contains(e.target) && set(false))
  }

  // ---------------------------------------------------------------- theme (forge or vellum), for this visit only
  const themeBtn = $('.theme-toggle')
  if (themeBtn) {
    const isLight = () => (root.dataset.theme ? root.dataset.theme === 'light' : window.matchMedia('(prefers-color-scheme: light)').matches)
    const label = () => themeBtn.setAttribute('aria-label', isLight() ? 'Switch to the dark forge theme' : 'Switch to the light vellum theme')
    themeBtn.addEventListener('click', () => { root.dataset.theme = isLight() ? 'dark' : 'light'; label() })
    label()
  }

  // ---------------------------------------------------------------- reveal
  const reveals = $$('[data-reveal]')
  reveals.forEach((el) => el.dataset.delay && el.style.setProperty('--delay', el.dataset.delay + 'ms'))
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => { for (const e of entries) if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) } }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 })
    reveals.forEach((el) => io.observe(el))
  } else reveals.forEach((el) => el.classList.add('is-in'))

  // ---------------------------------------------------------------- copy buttons
  for (const btn of $$('[data-copy]')) {
    btn.addEventListener('click', async () => {
      const target = document.getElementById(btn.dataset.copy)
      const text = target ? target.innerText.trim() : ''
      try {
        await navigator.clipboard.writeText(text)
        const label = $('.copy-label', btn)
        btn.classList.add('is-copied'); if (label) label.textContent = 'copied'
        setTimeout(() => { btn.classList.remove('is-copied'); if (label) label.textContent = 'copy' }, 1700)
      } catch (_) {}
    })
  }

  // ---------------------------------------------------------------- tabs (WAI-ARIA pattern) with a sliding ink bar
  for (const tabs of $$('[data-tabs]')) {
    const list = $('[role="tablist"]', tabs)
    const btns = $$('[role="tab"]', list)
    const ink = $('.tab-ink', list)
    const select = (b, focus) => {
      for (const x of btns) {
        const on = x === b
        x.setAttribute('aria-selected', String(on)); x.tabIndex = on ? 0 : -1
        document.getElementById(x.getAttribute('aria-controls')).hidden = !on
      }
      if (ink) { ink.style.width = b.offsetWidth + 'px'; ink.style.transform = `translateX(${b.offsetLeft}px)` }
      if (focus) b.focus()
    }
    btns.forEach((b, i) => {
      b.addEventListener('click', () => select(b))
      b.addEventListener('keydown', (e) => {
        const k = { ArrowRight: 1, ArrowLeft: -1 }[e.key]
        if (k) { e.preventDefault(); select(btns[(i + k + btns.length) % btns.length], true) }
        if (e.key === 'Home') { e.preventDefault(); select(btns[0], true) }
        if (e.key === 'End') { e.preventDefault(); select(btns[btns.length - 1], true) }
      })
    })
    requestAnimationFrame(() => select(btns.find((b) => b.getAttribute('aria-selected') === 'true') || btns[0]))
    window.addEventListener('resize', () => select(btns.find((b) => b.getAttribute('aria-selected') === 'true')))
  }

  // ---------------------------------------------------------------- the lifecycle (Fig. III): explore the stations
  const pipe = $('[data-pipeline]')
  if (pipe) {
    const data = JSON.parse($('script[type="application/json"]', pipe).textContent)
    const panel = $('.stage-panel', pipe)
    const stations = $$('.station', pipe)
    let auto = !reduce
    let idx = 0
    const show = (i) => {
      idx = i
      stations.forEach((s, j) => s.classList.toggle('is-active', j === i))
      const [, name, , text] = data[i]
      panel.innerHTML = `<div><h3>${name}</h3><p>${text}</p></div>`
    }
    stations.forEach((s, i) => {
      const pick = () => { auto = false; show(i) }
      s.addEventListener('click', pick); s.addEventListener('mouseenter', pick); s.addEventListener('focus', pick)
      s.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick() } })
    })
    show(0)
    pipe.addEventListener('stage', (e) => { if (auto) show(e.detail) })
  }

  // ---------------------------------------------------------------- lineage (Fig. IV): trace ancestors and descendants
  const lin = $('.lineage-svg')
  if (lin) {
    const edges = $$('.lin-edge', lin).map((e) => ({ el: e, from: e.dataset.from, to: e.dataset.to }))
    const nodes = new Map($$('.lin-node', lin).map((n) => [n.dataset.node, n]))
    const walk = (id, dir, seen) => { for (const e of edges) if ((dir > 0 ? e.from : e.to) === id) { e.el.classList.add('is-lit'); const nx = dir > 0 ? e.to : e.from; if (!seen.has(nx)) { seen.add(nx); walk(nx, dir, seen) } } return seen }
    const clear = () => { lin.classList.remove('has-focus'); $$('.is-lit', lin).forEach((x) => x.classList.remove('is-lit')) }
    const light = (id) => {
      clear(); lin.classList.add('has-focus')
      const set = new Set([id]); walk(id, 1, set); walk(id, -1, set)
      set.forEach((n) => nodes.get(n) && nodes.get(n).classList.add('is-lit'))
    }
    nodes.forEach((n, id) => { n.addEventListener('mouseenter', () => light(id)); n.addEventListener('focus', () => light(id)); n.addEventListener('mouseleave', clear); n.addEventListener('blur', clear) })
  }

  // ---------------------------------------------------------------- backfill with a kill -9 in the middle
  // An illustration of the O1 exit test (121 daily partitions, ogund killed, restarted): not a recording.
  const bf = $('[data-backfill]')
  if (bf) {
    const cells = $$('.grid-cells i', bf)
    const status = $('.backfill-status', bf)
    const startBtn = $('.bf-start', bf)
    const killBtn = $('.bf-kill', bf)
    let id = 0
    let killed = false
    const days = cells.map((_, i) => new Date(Date.UTC(2024, 0, 1 + i)).toISOString().slice(0, 10))
    cells.forEach((c, i) => { c.title = `${days[i]}: pending`; c.setAttribute('aria-label', `${days[i]} pending`) })
    const mark = (i, s, label) => { cells[i].dataset.s = s; cells[i].title = `${days[i]}: ${label}` }
    const go = async (resume) => {
      const my = ++id
      killed = false
      killBtn.disabled = false
      if (!resume) cells.forEach((c, i) => { delete c.dataset.s; c.title = `${days[i]}: pending` })
      const todo = cells.map((c, i) => i).filter((i) => cells[i].dataset.s !== 'ok')
      status.textContent = resume ? `ogund restarted · ${todo.length} partitions unfinished · ${cells.length - todo.length} done are skipped` : `ogun backfill exit-backfill --from ${days[0]} --to ${days[days.length - 1]} --yes · ${cells.length} partitions`
      const lanes = 4
      let next = 0
      const worker = async () => {
        while (next < todo.length && my === id && !killed) {
          const i = todo[next++]
          mark(i, 'run', 'running')
          await sleep(60 + Math.random() * 90)
          if (my !== id || killed) { if (cells[i].dataset.s === 'run') { delete cells[i].dataset.s; cells[i].title = `${days[i]}: interrupted, runs again` } return }
          mark(i, 'ok', 'succeeded')
        }
      }
      await Promise.all(Array.from({ length: lanes }, worker))
      if (my !== id || killed) return
      killBtn.disabled = true
      status.textContent = `${cells.length} of ${cells.length} partitions done · a second backfill over the range has 0 to run`
      startBtn.textContent = 'Run again'
    }
    startBtn.addEventListener('click', () => go(false))
    killBtn.addEventListener('click', async () => {
      if (killBtn.disabled) return
      killed = true; id++
      killBtn.disabled = true
      const done = cells.filter((c) => c.dataset.s === 'ok').length
      status.textContent = `kill -9 ogund · ${done} partitions committed · work in flight is discarded`
      await sleep(1200)
      go(true)
    })
    onView(bf, () => go(false), 0.4)
  }

  // ---------------------------------------------------------------- matrix: highlight the column under the pointer
  for (const t of $$('table.matrix')) {
    t.addEventListener('pointerover', (e) => {
      const td = e.target.closest('td, th'); if (!td) return
      const i = td.cellIndex
      $$('.is-col', t).forEach((c) => c.classList.remove('is-col'))
      if (i > 0) $$('tr', t).forEach((r) => r.cells[i] && r.cells[i].classList.add('is-col'))
    })
    t.addEventListener('pointerleave', () => $$('.is-col', t).forEach((c) => c.classList.remove('is-col')))
  }

  // ---------------------------------------------------------------- card glow follows the pointer
  if (fine && !reduce) for (const c of $$('[data-glow]')) c.addEventListener('pointermove', (e) => { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', e.clientX - r.left + 'px'); c.style.setProperty('--my', e.clientY - r.top + 'px') })

  // ---------------------------------------------------------------- ember button glow follows the pointer
  if (fine && !reduce) for (const b of $$('.btn--ember')) b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); b.style.setProperty('--hx', e.clientX - r.left + 'px'); b.style.setProperty('--hy', e.clientY - r.top + 'px') })

  // ---------------------------------------------------------------- table of contents and FAQ fragments
  const toc = $('.toc')
  if (toc && 'IntersectionObserver' in window) {
    const links = new Map($$('a[href^="#"]', toc).map((a) => [a.getAttribute('href').slice(1), a]))
    const io = new IntersectionObserver((entries) => { for (const e of entries) if (e.isIntersecting) { links.forEach((a) => a.classList.remove('is-active')); const a = links.get(e.target.id); a && a.classList.add('is-active') } }, { rootMargin: '-20% 0px -70% 0px' })
    links.forEach((_, id) => { const h = document.getElementById(id); h && io.observe(h) })
  }
  const openFromHash = () => { const el = location.hash && document.getElementById(decodeURIComponent(location.hash.slice(1))); if (el && el.tagName === 'DETAILS') el.open = true }
  window.addEventListener('hashchange', openFromHash)
  openFromHash()
  // ---------------------------------------------------------------- downloads: highlight the visitor's platform (read here, never stored or sent)
  const dlOS = (() => {
    const ua = navigator.userAgent || ''
    const uad = navigator.userAgentData
    const plat = (uad && uad.platform) || navigator.platform || ''
    if ((uad && uad.mobile) || /android|iphone|ipad|ipod/i.test(ua)) return ''
    if (/win/i.test(plat) || /windows nt/i.test(ua)) return 'windows'
    if (/mac/i.test(plat) || /macintosh|mac os x/i.test(ua)) return 'mac'
    if (/cros/i.test(ua)) return ''
    if (/linux/i.test(plat) || /linux|x11/i.test(ua)) return 'linux'
    return ''
  })()
  if (dlOS) {
    for (const card of $$('.dl-card[data-os="' + dlOS + '"]')) { card.classList.add('is-detected'); const b = $('.dl-badge', card); b && (b.hidden = false) }
    const names = { windows: 'Windows', linux: 'Linux' }
    for (const a of $$('[data-dl-hero]')) {
      const href = a.getAttribute('data-href-' + dlOS)
      const label = $('[data-dl-hero-label]', a)
      if (href && label && names[dlOS]) { a.href = href; label.textContent = 'Download for ' + names[dlOS] }
    }
  }
})()
