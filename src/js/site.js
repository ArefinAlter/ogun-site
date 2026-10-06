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

  // ---------------------------------------------------------------- gears: per-gear speed from the tooth ratio; spin up on hover
  for (const g of $$('.gear-spin')) if (g.dataset.dur) g.style.setProperty('--gear-dur', g.dataset.dur + 's')
  const setRate = (scope, rate) => { if (reduce || !scope.getAnimations) return; for (const g of $$('.gear-spin', scope)) for (const a of g.getAnimations()) a.updatePlaybackRate ? a.updatePlaybackRate(rate) : (a.playbackRate = rate) }
  for (const fig of $$('[data-spinup]')) {
    fig.addEventListener('pointerenter', () => setRate(fig, 4))
    fig.addEventListener('pointerleave', () => setRate(fig, 1))
    fig.addEventListener('focusin', () => setRate(fig, 4))
    fig.addEventListener('focusout', () => setRate(fig, 1))
  }

  // ---------------------------------------------------------------- the hammer: strike and sparks
  const plate = $('.hero-plate')
  const strikeBtn = $('.hero-strike-btn')
  const canvas = $('.sparks')
  if (plate && strikeBtn && canvas) {
    const ctx = canvas.getContext('2d')
    let parts = []
    let raf = 0
    let last = 0
    const size = () => { const r = canvas.getBoundingClientRect(); canvas.width = r.width * devicePixelRatio; canvas.height = r.height * devicePixelRatio }
    size()
    window.addEventListener('resize', size)
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      parts = parts.filter((p) => p.life > 0)
      for (const p of parts) {
        p.vy += 0.32 * devicePixelRatio
        p.x += p.vx; p.y += p.vy; p.life -= 1
        const a = Math.max(0, p.life / p.max)
        ctx.strokeStyle = `rgba(${p.hot ? '255,214,140' : '232,102,46'},${a})`
        ctx.lineWidth = p.w
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 1.6, p.y - p.vy * 1.6); ctx.stroke()
      }
      raf = parts.length ? requestAnimationFrame(tick) : 0
    }
    const burst = () => {
      const [ix, iy] = plate.dataset.impact.split(' ').map(Number)
      const pt = plate.createSVGPoint(); pt.x = ix; pt.y = iy
      const m = plate.getScreenCTM()
      const cr = canvas.getBoundingClientRect()
      const s = pt.matrixTransform(m)
      const x = (s.x - cr.left) * devicePixelRatio
      const y = (s.y - cr.top) * devicePixelRatio
      for (let i = 0; i < 46; i++) {
        const ang = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.25
        const sp = (3 + Math.random() * 7) * devicePixelRatio
        const max = 26 + Math.random() * 30
        parts.push({ x, y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: max, max, w: (0.8 + Math.random() * 1.4) * devicePixelRatio, hot: Math.random() > 0.6 })
      }
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const strike = () => {
      const now = performance.now()
      if (now - last < 650) return
      last = now
      plate.classList.remove('is-striking'); void plate.getBoundingClientRect(); plate.classList.add('is-striking')
      if (!reduce) setTimeout(burst, 300)
      setTimeout(() => plate.classList.remove('is-striking'), 760)
    }
    strikeBtn.addEventListener('click', strike)
    if (!reduce) setTimeout(strike, 1400)
  }

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
      panel.innerHTML = `<span class="stage-num" aria-hidden="true">${['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'][i]}</span><div><h3>${name}</h3><p>${text}</p></div>`
    }
    stations.forEach((s, i) => {
      const pick = () => { auto = false; show(i) }
      s.addEventListener('click', pick); s.addEventListener('mouseenter', pick); s.addEventListener('focus', pick)
      s.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick() } })
    })
    show(0)
    onView(pipe, () => { const loop = () => { if (!auto) return; show((idx + 1) % stations.length); setTimeout(loop, 3200) }; setTimeout(loop, 3200) })
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

  // ---------------------------------------------------------------- run simulation (Studio preview)
  const studio = $('[data-studio]')
  if (studio) {
    const nodes = $$('.dag-node', studio)
    const log = $('.event-log', studio)
    const state = $('.run-state', studio)
    const appr = $('.approval-mini', studio)
    let run = 0
    let t0 = 0
    const ts = () => { const s = Math.round((performance.now() - t0) / 100) / 10; return `+${s.toFixed(1)}s` }
    const say = (k, msg) => { const li = document.createElement('li'); li.innerHTML = `<span class="t">${ts()}</span><span class="k">${k}</span> ${msg}`; log.appendChild(li); while (log.children.length > 7) log.removeChild(log.firstChild) }
    const setNode = (i, st, count) => { const n = nodes[i]; n.dataset.state = st; $('.badge', n).textContent = st.replace(/_/g, ' '); if (count != null) $('.count', n).textContent = count }
    const fill = async (i, total, unit, id, from = 0, rate = 1) => {
      for (let v = from; v <= total && id === run; v += Math.max(1, Math.round(total / 26)) * rate) {
        nodes[i].querySelector('.bar i').style.setProperty('--p', Math.min(100, (v / total) * 100) + '%')
        $('.count', nodes[i]).textContent = `${Math.min(v, total)}/${total} ${unit}`
        await sleep(70)
      }
      nodes[i].querySelector('.bar i').style.setProperty('--p', '100%'); $('.count', nodes[i]).textContent = `${total}/${total} ${unit}`
    }
    const play = async () => {
      const id = ++run
      t0 = performance.now()
      log.innerHTML = ''; appr.hidden = true; state.dataset.state = 'running'; state.textContent = 'running'
      nodes.forEach((n, i) => { setNode(i, 'pending', '·'); n.querySelector('.bar i').style.setProperty('--p', '0%') })
      say('run.started', 'climate-papers #184 (workflow v17, 7c3e…)')
      setNode(0, 'running'); await fill(0, 481, 'urls', id); if (id !== run) return; setNode(0, 'succeeded'); say('node.succeeded', 'discover: 481 candidate urls')
      setNode(1, 'running'); say('node.running', 'acquire: 6 parts per file, polite 2 req/s/host')
      await fill(1, 212, 'files', id, 0); if (id !== run) return
      setNode(1, 'retry_scheduled'); say('retry', 'acquire: 503 from a mirror, backing off 4s'); await sleep(900); if (id !== run) return
      setNode(1, 'running'); say('resume', 'acquire: resumed at byte 1 873 920 of file 213'); await fill(1, 481, 'files', id, 213); if (id !== run) return
      setNode(1, 'succeeded'); say('node.succeeded', 'acquire: 481 artifacts, 43.7 GB, all hashes verified')
      setNode(2, 'running'); await fill(2, 481, 'docs', id); if (id !== run) return; setNode(2, 'succeeded'); say('node.succeeded', 'extract: 467 text, 14 routed to ocr')
      setNode(3, 'waiting_for_user'); say('approval', 'classify: llm.extract over 481 docs, est. $1.38, needs a person')
      appr.hidden = false; appr.classList.add('is-armed')
      const ok = await new Promise((resolve) => {
        const [y, n] = $$('button', appr)
        y.onclick = () => resolve(true); n.onclick = () => resolve(false)
        setTimeout(() => resolve(true), reduce ? 0 : 8000)
      })
      if (id !== run) return
      appr.classList.remove('is-armed'); appr.hidden = true
      if (!ok) { setNode(3, 'skipped'); setNode(4, 'skipped'); say('approval', 'denied by you: classify and publish skipped'); state.dataset.state = 'succeeded'; state.textContent = 'stopped by you'; return }
      say('approval', 'approved by you on Studio (bound to request hash 41d0…)')
      setNode(3, 'running'); await fill(3, 481, 'docs', id); if (id !== run) return; setNode(3, 'succeeded'); say('node.succeeded', 'classify: 182 flagged remote sensing, $1.31 spent')
      setNode(4, 'running'); await fill(4, 481, 'rows', id); if (id !== run) return; setNode(4, 'succeeded'); say('run.succeeded', 'published papers.parquet + OpenLineage events')
      state.dataset.state = 'succeeded'; state.textContent = 'succeeded'
    }
    $('.studio-replay', studio).addEventListener('click', play)
    onView(studio, play, 0.35)
  }

  // ---------------------------------------------------------------- backfill with a kill -9 in the middle
  const bf = $('[data-backfill]')
  if (bf) {
    const cells = $$('.grid-cells i', bf)
    const status = $('.backfill-status', bf)
    const startBtn = $('.bf-start', bf)
    const killBtn = $('.bf-kill', bf)
    let id = 0
    let killed = false
    const months = cells.map((_, i) => { const d = new Date(Date.UTC(2020, i, 1)); return d.toISOString().slice(0, 7) })
    cells.forEach((c, i) => { c.title = `${months[i]}: pending`; c.setAttribute('aria-label', `${months[i]} pending`) })
    const mark = (i, s, label) => { cells[i].dataset.s = s; cells[i].title = `${months[i]}: ${label}` }
    const failAt = new Set([9, 37, 58])
    const go = async (resume) => {
      const my = ++id
      killed = false
      killBtn.disabled = false
      if (!resume) cells.forEach((c, i) => { delete c.dataset.s; c.title = `${months[i]}: pending` })
      const todo = cells.map((c, i) => i).filter((i) => cells[i].dataset.s !== 'ok')
      status.textContent = resume ? `ogund restarted · journal replayed · resuming ${todo.length} incomplete partitions, skipping ${cells.length - todo.length} done` : `ogun backfill noaa-daily --from 2020-01 --to ${months[months.length - 1]} · ${cells.length} partitions`
      const lanes = 4
      let next = 0
      const worker = async () => {
        while (next < todo.length && my === id && !killed) {
          const i = todo[next++]
          mark(i, 'run', 'running')
          await sleep(140 + Math.random() * 160)
          if (my !== id || killed) { if (cells[i].dataset.s === 'run') { delete cells[i].dataset.s; cells[i].title = `${months[i]}: interrupted` } return }
          if (!resume && failAt.has(i)) { mark(i, 'fail', 'failed: 503, retry scheduled'); await sleep(500); if (my !== id || killed) return; mark(i, 'retry', 'retrying'); await sleep(300); if (my !== id || killed) return }
          mark(i, 'ok', 'succeeded, verified')
        }
      }
      await Promise.all(Array.from({ length: lanes }, worker))
      if (my !== id || killed) return
      killBtn.disabled = true
      status.textContent = `done · ${cells.length}/${cells.length} partitions succeeded · 3 transient failures retried · nothing fetched twice`
      startBtn.textContent = 'Run again'
    }
    startBtn.addEventListener('click', () => go(false))
    killBtn.addEventListener('click', async () => {
      if (killBtn.disabled) return
      killed = true; id++
      killBtn.disabled = true
      const done = cells.filter((c) => c.dataset.s === 'ok').length
      status.textContent = `kill -9 ogund · ${done} partitions committed · in-flight work discarded`
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
})()
