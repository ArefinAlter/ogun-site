/* The forge: embers, the hammer strike, the partition strip and the glow of the footer.
   Dependency-free and local. Every effect pauses when it is off screen or the tab is hidden, caps its frame rate on phones,
   and under prefers-reduced-motion draws one still frame instead (static embers, a finished strip). */
(() => {
  'use strict'
  const doc = document.documentElement
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  const coarse = matchMedia('(pointer: coarse)').matches || innerWidth < 700
  const $ = (s, el = document) => el.querySelector(s)
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s))
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
  const lerp = (a, b, t) => a + (b - a) * t
  const isLight = () => (doc.dataset.theme ? doc.dataset.theme === 'light' : matchMedia('(prefers-color-scheme: light)').matches)

  // ---------------------------------------------------------------- noise and random numbers
  const hash = (n) => { n = Math.imul(n ^ (n >>> 15), 0x2c1b3c6d); n = Math.imul(n ^ (n >>> 12), 0x297a2d39); return ((n ^ (n >>> 15)) >>> 0) / 4294967296 }
  const vnoise = (x) => { const i = Math.floor(x); const f = x - i; const u = f * f * (3 - 2 * f); return hash(i | 0) * (1 - u) + hash((i + 1) | 0) * u }
  const seeded = (seed) => () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }

  // the ember ramp of the paintings, hot to cold
  const RAMP = ['#F3E7CF', '#FFD08A', '#F59A3B', '#E8662E', '#B8441B', '#7E2F15', '#4F2615']
  const RAMP_LIGHT = ['#FFF3D6', '#F5B35E', '#E8802E', '#C9531C', '#9C4419', '#6E3016', '#4A2312']

  /** Runs `fn(visible)` whenever the element enters or leaves the viewport, and when the tab is hidden or shown. */
  const watch = (el, fn, margin = '120px') => {
    let inView = true
    let shown = !document.hidden
    const emit = () => fn(inView && shown)
    if ('IntersectionObserver' in window) new IntersectionObserver((e) => { inView = e[0].isIntersecting; emit() }, { rootMargin: margin }).observe(el)
    document.addEventListener('visibilitychange', () => { shown = !document.hidden; emit() })
    emit()
  }

  // ---------------------------------------------------------------- the hero: embers, strike, parallax
  const hero = $('[data-forge-hero]')
  if (hero) {
    const canvas = $('.fh-sparks', hero)
    const ctx = canvas.getContext('2d')
    const artBox = $('.fh-art', hero)
    const slabWrap = $('.fh-slab', hero)
    const slab = $('.slab', hero)
    const glowArt = (artBox.dataset.glow || '200,217').split(',').map(Number)
    let px = 3
    let W = 0
    let H = 0
    let originX = 0
    let heroRect = hero.getBoundingClientRect()
    let heroTop = 0

    const measure = () => {
      px = parseFloat(getComputedStyle(hero).getPropertyValue('--px')) || 3
      heroRect = hero.getBoundingClientRect()
      heroTop = heroRect.top + scrollY
      W = Math.ceil(heroRect.width / px)
      H = Math.ceil(heroRect.height / px)
      canvas.width = W
      canvas.height = H
      canvas.style.width = W * px + 'px'
      canvas.style.height = H * px + 'px'
      originX = heroRect.right - W * px
    }
    // client pixels -> canvas pixels (the canvas is right-aligned, like the painting, so both share one pixel grid)
    const toLogical = (cx, cy) => [(cx - originX) / px, (cy - heroRect.top) / px]
    const rectOf = (el) => { const r = el.getBoundingClientRect(); return { l: r.left, t: r.top, w: r.width, h: r.height } }

    // particles in structure-of-arrays form
    const MAX = 420
    const P = { x: new Float32Array(MAX), y: new Float32Array(MAX), vx: new Float32Array(MAX), vy: new Float32Array(MAX), life: new Float32Array(MAX), max: new Float32Array(MAX), seed: new Float32Array(MAX), kind: new Uint8Array(MAX), size: new Uint8Array(MAX) }
    let count = 0
    const spawn = (x, y, vx, vy, life, kind, size = 1) => {
      if (count >= MAX) return
      const i = count++
      P.x[i] = x; P.y[i] = y; P.vx[i] = vx; P.vy[i] = vy; P.life[i] = life; P.max[i] = life; P.seed[i] = Math.random() * 1000; P.kind[i] = kind; P.size[i] = size
    }
    const kill = (i) => { count--; for (const k in P) P[k][i] = P[k][count] }

    const burst = (lx, ly, n, power = 1) => {
      for (let i = 0; i < n; i++) {
        const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.15
        const s = (28 + Math.random() * 96 * (0.4 + Math.random())) * power
        spawn(lx, ly, Math.cos(a) * s, Math.sin(a) * s, 0.45 + Math.random() * 0.9, 1, Math.random() < 0.18 ? 2 : 1)
      }
    }

    // ---- state
    let heat = 0.42
    let base = 0.42
    let flick = 1
    let strike = null
    let rings = []
    let t0 = performance.now()
    let last = t0
    let acc = 0
    let running = false
    let pointer = { x: 0, y: 0 }
    let par = { x: 0, y: 0 }
    let nextFlick = 0
    let carry = 0

    const L = 27 // hammer arm, in art pixels
    const impactPoint = () => { const r = rectOf(slab); return toLogical(r.l + r.w * 0.7, r.t + 8) }

    const hammerPose = (t) => {
      // seconds since the swing began: lift-off, fall (accelerating), impact at 0.42, rebound, retreat
      if (t < 0.42) { const u = t / 0.42; return { th: lerp(1.25, 0, u * u), a: clamp(t / 0.12, 0, 1) } }
      if (t < 0.56) { const u = (t - 0.42) / 0.14; return { th: lerp(0, -0.22, 1 - (1 - u) * (1 - u)), a: 1 } }
      if (t < 0.7) return { th: -0.22, a: 1 }
      const u = clamp((t - 0.7) / 0.4, 0, 1)
      return { th: lerp(-0.22, 1.0, 1 - Math.pow(1 - u, 3)), a: 1 - u }
    }

    const drawHammer = (st, now) => {
      const t = (now - st.t0) / 1000
      if (t > 1.15) return false
      const { th, a } = hammerPose(t)
      const [ix, iy] = st.at
      const Px = ix + 3
      const Py = iy - L
      const hx = Px + L * Math.sin(th)
      const hy = Py + L * Math.cos(th)
      const ux = Math.sin(th)
      const uy = Math.cos(th) // along the handle, pivot to head
      const vx = Math.cos(th)
      const vy = -Math.sin(th) // across it
      ctx.globalAlpha = a
      const x0 = Math.floor(Math.min(Px, hx) - 12)
      const x1 = Math.ceil(Math.max(Px, hx) + 12)
      const y0 = Math.floor(Math.min(Py, hy) - 12)
      const y1 = Math.ceil(Math.max(Py, hy) + 12)
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const dx = x + 0.5 - Px
          const dy = y + 0.5 - Py
          const u = dx * ux + dy * uy
          const v = dx * vx + dy * vy
          let c = ''
          if (u >= L - 5 && u <= L + 4.5 && Math.abs(v) <= 9) {
            const top = u < L - 1.5 ? 1 : 0
            c = Math.abs(v) > 7.4 || u > L + 3 ? '#17120F' : top ? '#9A8A78' : u > L + 1.5 ? '#2B2420' : '#625548'
          } else if (u >= 0 && u < L - 4 && Math.abs(v) <= 1.9) c = v < 0 ? '#B98550' : '#7A4C26'
          if (c) { ctx.fillStyle = c; ctx.fillRect(x, y, 1, 1) }
        }
      }
      ctx.globalAlpha = 1
      if (!st.hit && t >= 0.42) {
        st.hit = true
        burst(ix, iy, st.big ? 70 : 24, st.big ? 1 : 0.7)
        rings.push({ x: ix, y: iy, t: 0 })
        heat = 1
        if (slab.animate && !reduce) slab.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(4px)', offset: 0.16 }, { transform: 'translateY(-2px)', offset: 0.42 }, { transform: 'translateY(1px)', offset: 0.7 }, { transform: 'translateY(0)' }], { duration: 640, easing: 'cubic-bezier(.2,.7,.25,1)' })
      }
      return true
    }

    const doStrike = (big = true) => {
      if (strike || reduce) return
      strike = { t0: performance.now(), at: impactPoint(), big, hit: false }
      if (!running) start()
    }

    // ---- frame
    const ramp = () => (isLight() ? RAMP_LIGHT : RAMP)
    const frame = (now) => {
      if (!running) return
      const dt = Math.min(0.05, (now - last) / 1000)
      acc += dt
      last = now
      if (coarse && acc < 0.032) { requestAnimationFrame(frame); return }
      const step = acc
      acc = 0
      const t = (now - t0) / 1000
      // ambient embers: from the glow in the painting and from the slab's lower edge
      carry += step * (coarse ? 7 : 15)
      while (carry >= 1) {
        carry -= 1
        const g = Math.random() < 0.8
        if (g) {
          const rect = rectOf(artBox)
          const gx = (rect.l + glowArt[0] * px - originX) / px
          const gy = (rect.t + glowArt[1] * px - heroRect.top) / px
          spawn(gx + (Math.random() - 0.5) * 26, gy + (Math.random() - 0.6) * 12, (Math.random() - 0.5) * 8, -(10 + Math.random() * 22), 2.2 + Math.random() * 3.4, 0, Math.random() < 0.12 ? 2 : 1)
        } else {
          const r = rectOf(slab)
          const [sx, sy] = toLogical(r.l + Math.random() * r.w, r.t + r.h)
          spawn(sx, sy, (Math.random() - 0.5) * 6, -(8 + Math.random() * 14), 1.6 + Math.random() * 2.4, 0, 1)
        }
      }
      // physics
      for (let i = count - 1; i >= 0; i--) {
        P.life[i] -= step
        if (P.life[i] <= 0) { kill(i); continue }
        if (P.kind[i] === 1) {
          P.vy[i] += 270 * step
          const d = Math.exp(-0.9 * step)
          P.vx[i] *= d
          P.vy[i] *= Math.exp(-0.35 * step)
        } else {
          P.vx[i] += (vnoise(P.seed[i] * 3 + t * 0.8) - 0.5) * 120 * step
          P.vx[i] *= Math.exp(-0.7 * step)
          P.vy[i] -= 6 * step
        }
        P.x[i] += P.vx[i] * step
        P.y[i] += P.vy[i] * step
      }
      // flicker: value noise, not a timer
      flick = 0.82 + 0.18 * vnoise(t * 9) + 0.06 * vnoise(t * 23 + 40)
      heat = Math.max(base, heat * Math.exp(-step * 1.9))
      const lightTheme = isLight()
      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = lightTheme ? 'source-over' : 'lighter'
      const cols = ramp()
      for (let i = 0; i < count; i++) {
        const age = 1 - P.life[i] / P.max[i]
        const k = Math.min(cols.length - 1, Math.floor(age * (P.kind[i] === 1 ? cols.length : cols.length - 1.5)))
        const a = clamp((1 - age) * 1.6, 0, 1) * (0.62 + 0.38 * vnoise(P.seed[i] * 5 + t * 16))
        const x = Math.floor(P.x[i])
        const y = Math.floor(P.y[i])
        ctx.globalAlpha = a
        ctx.fillStyle = cols[k]
        const s = P.size[i]
        ctx.fillRect(x, y, s, s)
        if (P.kind[i] === 1) ctx.fillRect(x - Math.sign(P.vx[i]) | 0, y - Math.sign(P.vy[i]) | 0, 1, 1)
        if (!lightTheme && i < 140 && P.kind[i] === 0) { ctx.globalAlpha = a * 0.16 * flick; ctx.fillStyle = cols[3]; ctx.fillRect(x - 1, y - 1, s + 2, s + 2) }
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
      // shock rings from the strike: a square that grows and thins, quantised
      rings = rings.filter((r) => (r.t += step) < 0.42)
      for (const r of rings) {
        const rad = Math.floor(r.t * 70)
        ctx.globalAlpha = (1 - r.t / 0.42) * 0.8
        ctx.fillStyle = cols[1]
        for (let a = 0; a < 360; a += 360 / (rad * 3 + 8)) ctx.fillRect(Math.floor(r.x + Math.cos((a * Math.PI) / 180) * rad), Math.floor(r.y + Math.sin((a * Math.PI) / 180) * rad * 0.55), 1, 1)
      }
      ctx.globalAlpha = 1
      if (strike && !drawHammer(strike, now)) strike = null
      // CSS: glow, flicker, heat of the slab (rounded, so style recalculation stays cheap), pixel-snapped parallax
      if (now >= nextFlick) {
        nextFlick = now + 66
        hero.style.setProperty('--flicker', flick.toFixed(2))
        hero.style.setProperty('--heat', heat.toFixed(2))
      }
      par.x = lerp(par.x, pointer.x, 1 - Math.exp(-step * 4))
      par.y = lerp(par.y, pointer.y, 1 - Math.exp(-step * 4))
      const sy = clamp(scrollY - heroTop, 0, 900) * 0.14
      const snap = (v) => Math.round(v / px) * px
      artBox.style.transform = `translate3d(${snap(par.x * -12)}px, ${snap(par.y * -8 + sy)}px, 0)`
      const drift = slabWrap
      drift.style.transform = `translate3d(0, ${((vnoise(t * 0.33) - 0.5) * 9 + par.y * 5).toFixed(2)}px, 0) rotate(${((vnoise(t * 0.21 + 9) - 0.5) * 0.7).toFixed(3)}deg)`
      requestAnimationFrame(frame)
    }

    const start = () => { if (running) return; running = true; last = performance.now(); acc = 0; requestAnimationFrame(frame) }
    const stop = () => { running = false }

    measure()
    addEventListener('resize', () => { measure(); if (reduce) still() })
    addEventListener('pointermove', (e) => { pointer.x = (e.clientX / innerWidth - 0.5) * 2; pointer.y = (e.clientY / innerHeight - 0.5) * 2 }, { passive: true })

    // a still frame: the embers frozen where a seeded random walk puts them
    const still = () => {
      measure()
      ctx.clearRect(0, 0, W, H)
      const rnd = seeded(7)
      const cols = ramp()
      const rect = rectOf(artBox)
      const gx = (rect.l + glowArt[0] * px - originX) / px
      const gy = (rect.t + glowArt[1] * px - heroRect.top) / px
      for (let i = 0; i < 64; i++) {
        const age = rnd()
        const x = Math.floor(gx + (rnd() - 0.5) * 70 + age * 18)
        const y = Math.floor(gy - age * (30 + rnd() * 90))
        ctx.globalAlpha = (1 - age) * 0.9
        ctx.fillStyle = cols[Math.min(cols.length - 1, Math.floor(age * (cols.length - 1)))]
        ctx.fillRect(x, y, rnd() < 0.15 ? 2 : 1, rnd() < 0.15 ? 2 : 1)
      }
      ctx.globalAlpha = 1
      hero.style.setProperty('--flicker', '0.95')
      hero.style.setProperty('--heat', '0.55')
    }

    if (reduce) still()
    else {
      watch(hero, (v) => { if (v) start(); else stop() })
      // the first strike, once the slab has appeared
      setTimeout(() => doStrike(true), 900)
      // a press on any ember button throws a burst from the button; in the hero it also lands the hammer
      document.addEventListener('pointerdown', (e) => {
        const b = e.target.closest && e.target.closest('.btn--ember')
        if (!b || reduce) return
        const r = b.getBoundingClientRect()
        const inHero = r.top < heroRect.bottom - scrollY + 4 && r.bottom > -4 && hero.contains(b)
        if (inHero) { measure(); doStrike(false) }
        else if (running) { const [lx, ly] = toLogical(r.left + r.width / 2, r.top + r.height / 2); burst(lx, ly, 18, 0.7) }
      })
      // the wordmark catches a glint now and then, at irregular intervals
      const wm = $$('.fh-wordmark rect', hero)
      const glint = () => {
        if (wm.length && running) { const r = wm[Math.floor(Math.random() * wm.length)]; r.classList.add('is-glint'); setTimeout(() => r.classList.remove('is-glint'), 140 + Math.random() * 200) }
        setTimeout(glint, 350 + Math.random() * Math.random() * 2600)
      }
      setTimeout(glint, 1600)
    }
  }

  // ---------------------------------------------------------------- the partition strip (the O1 exit test, drawn)
  const strip = $('[data-strip]')
  if (strip) {
    const cells = $$('.strip-grid i', strip)
    const status = $('.strip-state', strip)
    const meter = $('.strip-meter', strip)
    const replay = $('.strip-replay', strip)
    const N = cells.length
    const state = new Array(N).fill('cold')
    const names = (i) => cells[i].dataset.day
    let token = 0
    let visible = false
    let waiters = []
    const gate = () => (visible ? Promise.resolve() : new Promise((r) => waiters.push(r)))
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms)).then(gate)
    const rnd = (a, b) => a + Math.random() * (b - a)
    const set = (i, s) => { state[i] = s; cells[i].dataset.s = s }
    const tally = () => {
      const ok = state.filter((s) => s === 'ok').length
      const live = state.filter((s) => s === 'warm' || s === 'run' || s === 'hot').length
      meter.textContent = `${ok} done · ${live} running · ${N - ok - live} to run`
      strip.style.setProperty('--done', (ok / N).toFixed(3))
    }
    const reset = () => { for (let i = 0; i < N; i++) set(i, 'cold'); tally() }
    const finish = () => { for (let i = 0; i < N; i++) set(i, 'ok'); status.textContent = `${N} of ${N} partitions done. A second backfill over the range has 0 to run.`; tally() }

    /** One partition, struck: warm, glowing, white-hot for an instant, then quenched. The durations are drawn, not fixed.
     *  `ctl.dead` is set when the daemon is killed: a partition in flight stops where it is, as it would in a crashed process. */
    const strikeOne = async (i, me, ctl, fail) => {
      const dead = () => me !== token || ctl.dead
      set(i, 'warm'); tally()
      await sleep(rnd(70, 190)); if (dead()) return false
      set(i, 'run'); tally()
      await sleep(rnd(150, 420)); if (dead()) return false
      if (fail) {
        set(i, 'fail'); tally()
        await sleep(rnd(520, 800)); if (dead()) return false
        set(i, 'retry'); tally()
        await sleep(rnd(420, 700)); if (dead()) return false
        set(i, 'run'); tally()
        await sleep(rnd(200, 360)); if (dead()) return false
      }
      set(i, 'hot'); tally()
      await sleep(rnd(90, 160)); if (dead()) return false
      set(i, 'ok'); tally()
      return true
    }

    /** Four lanes take the unfinished partitions in order. `stopAt` ends the pass, abruptly, once that many are done (the kill). */
    const pass = async (me, { stopAt = Infinity, failAt = -1 } = {}) => {
      const todo = []
      for (let i = 0; i < N; i++) if (state[i] !== 'ok') todo.push(i)
      const ctl = { dead: false }
      let next = 0
      const lane = async () => {
        while (next < todo.length && !ctl.dead && me === token) {
          const i = todo[next++]
          const done = await strikeOne(i, me, ctl, i === failAt)
          if (done && state.filter((s) => s === 'ok').length >= stopAt) ctl.dead = true
        }
      }
      await Promise.all([lane(), lane(), lane(), lane()])
      return ctl.dead
    }

    const play = async () => {
      const me = ++token
      reset()
      status.textContent = 'ogun backfill exit-backfill --from 2024-01-01 --to 2024-04-30 --yes'
      await sleep(500); if (me !== token) return
      const killAt = Math.round(rnd(52, 78))
      const halted = await pass(me, { stopAt: killAt, failAt: 22 })
      if (me !== token) return
      if (halted) {
        // kill -9: whatever was warm, glowing or white-hot goes cold again; finished partitions stay
        await sleep(120)
        const inflight = []
        for (let i = 0; i < N; i++) if (['warm', 'run', 'hot', 'fail', 'retry'].includes(state[i])) inflight.push(i)
        inflight.forEach((i) => set(i, 'killed'))
        const done = state.filter((s) => s === 'ok').length
        status.textContent = `kill -9 ogund. ${done} partitions are committed; ${inflight.length} were in flight.`
        strip.classList.add('is-killed'); tally()
        await sleep(1500); if (me !== token) return
        inflight.forEach((i) => set(i, 'cold'))
        strip.classList.remove('is-killed')
        status.textContent = `ogund restarted, journal replayed: ${done} done, ${N - done} unfinished.`
        tally()
        await sleep(1100); if (me !== token) return
        await pass(me)
        if (me !== token) return
      }
      finish()
    }

    replay.addEventListener('click', play)
    // without script the strip is drawn finished; with script and motion it starts cold and is struck as it scrolls into view
    if (reduce) { finish(); replay.hidden = true }
    else {
      reset()
      status.textContent = ''
      replay.hidden = false
      let started = false
      watch(strip, (v) => {
        visible = v
        if (v) { waiters.splice(0).forEach((r) => r()); if (!started) { started = true; play() } }
      }, '-12% 0px -12% 0px')
    }
  }

  // ---------------------------------------------------------------- the lifecycle pipe: an ember runs its length, lingering at the stations
  const pipe = $('[data-pipeline]')
  if (pipe && !reduce) {
    const svg = $('svg', pipe)
    const path = $('.pipe-outer', pipe) || $('.pipe-inner', pipe)
    if (svg && path && path.getTotalLength) {
      const len = path.getTotalLength()
      const NS = 'http://www.w3.org/2000/svg'
      const ember = document.createElementNS(NS, 'rect')
      ember.setAttribute('class', 'pipe-ember')
      ember.setAttribute('width', '9'); ember.setAttribute('height', '9')
      svg.appendChild(ember)
      const stations = $$('.station', pipe).map((s) => {
        const m = (s.getAttribute('transform') || '').match(/translate\(\s*([-\d.]+)[ ,]+([-\d.]+)/)
        const x = m ? +m[1] : 0
        let best = 0
        let bestD = 1e9
        for (let d = 0; d <= len; d += 6) { const p = path.getPointAtLength(d); const dd = Math.abs(p.x - x); if (dd < bestD) { bestD = dd; best = d } }
        return best
      })
      let dist = 0
      let dir = 1
      let hold = 0
      let lastStage = -1
      let go = false
      let prev = performance.now()
      const tick = (now) => {
        if (!go) return
        const dt = Math.min(0.05, (now - prev) / 1000)
        prev = now
        if (hold > 0) hold -= dt
        else {
          let v = 110 * (0.55 + 0.9 * vnoise(now / 1000 * 0.6))
          for (const s of stations) { const d = Math.abs(dist - s); if (d < 36) v *= 0.25 + 0.75 * (d / 36) }
          dist += dir * v * dt
          if (dist >= len) { dist = len; dir = -1; hold = 1.4 }
          else if (dist <= 0) { dist = 0; dir = 1; hold = 1.4 }
        }
        const p = path.getPointAtLength(dist)
        ember.setAttribute('x', (p.x - 4.5).toFixed(1)); ember.setAttribute('y', (p.y - 4.5).toFixed(1))
        let near = -1
        stations.forEach((s, i) => { if (Math.abs(dist - s) < 12) near = i })
        if (near >= 0 && near !== lastStage) { lastStage = near; pipe.dispatchEvent(new CustomEvent('stage', { detail: near })); hold = Math.max(hold, 0.5 + Math.random() * 0.5) }
        requestAnimationFrame(tick)
      }
      watch(pipe, (v) => { go = v; if (v) { prev = performance.now(); requestAnimationFrame(tick) } })
    }
  }

  // ---------------------------------------------------------------- the footer: the forge glow under the wordmark flickers on value noise
  const foot = $('.foot-forge')
  if (foot && !reduce) {
    let on = false
    let t = 0
    const tick = (now) => {
      if (!on) return
      t = now / 1000
      const f = 0.8 + 0.2 * vnoise(t * 5.5) + 0.08 * vnoise(t * 17 + 3)
      foot.style.setProperty('--flicker', f.toFixed(2))
      setTimeout(() => requestAnimationFrame(tick), 70)
    }
    watch(foot, (v) => { on = v; if (v) requestAnimationFrame(tick) })
  }
})()
