// Ogun compositions: engraved plates, diagrams, icons, logos, standalone files and PNG render pages.
import { pixelWordmark, pixelWordmarkDoc } from './pixel.mjs'
import { WORDMARK } from './wordmark-data.mjs'
import { anvil, C, centerMark, compassArc, dimension, gear, gearTrain, hammer, leader, markInner, plateFrame, windlass } from './motifs.mjs'
import { n, smoothOpen } from './kit.mjs'

export { C }

const svg = (vb, inner, a = '') => `<svg viewBox="${vb}"${a} aria-hidden="true" focusable="false">${inner}</svg>`
const doc = (vb, inner, title) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" role="img" aria-label="${title}"><title>${title}</title>${inner}</svg>\n`

// ---------------------------------------------------------------- logos
export const mark = (id = 'mk', cls = 'logo-mark') => svg('0 0 32 32', markInner(id, { ink: 'currentColor' }), ` class="${cls}"`)
export const wordmark = (cls = 'logo-word') => svg(`${WORDMARK.x} ${WORDMARK.y} ${WORDMARK.w} ${WORDMARK.h}`, `<path d="${WORDMARK.d}" fill="currentColor"/>`, ` class="${cls}"`)
export const lockup = (id = 'hd') => `<span class="lockup">${mark(id)}${wordmark()}</span>`
export const verneMark = (cls = 'verne-mark') => svg('0 0 34 40', '<path d="M2 3 L17 37 L32 3" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/>', ` class="${cls}"`)

/** The Verne mark (the loop "V"), in its teal-to-blue gradient. Traced from Verne's logo; stroke widened for small sizes. */
const VERNE_PATH = 'M 62 517 C 34 470 20 418 20 360 C 20 175 165 20 350 20 C 478 20 562 78 622 152 C 676 220 700 268 742 296 C 790 328 852 340 920 340 C 990 340 1056 320 1104 286 C 1146 256 1170 214 1212 166 C 1290 70 1370 20 1492 20 C 1676 20 1830 172 1830 356 C 1830 548 1680 690 1492 690 C 1384 690 1288 640 1228 556 C 1176 484 1114 442 1035 442 C 938 442 886 510 886 580 C 886 606 893 630 905 652 C 1010 846 1118 1030 1222 1222 C 1248 1270 1260 1324 1260 1378 C 1260 1566 1104 1710 890 1710 C 784 1710 690 1632 632 1530 C 444 1192 254 856 62 517 Z'
export const verneLogo = (id = 'vl', cls = 'verne-logo', sw = 96) =>
  svg('-60 -60 1972 1852', `<defs><linearGradient id="${id}-g" x1="0" y1="0" x2="1852" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#00F5C8"/><stop offset=".5" stop-color="#00B4DC"/><stop offset="1" stop-color="#005BFF"/></linearGradient></defs><path d="${VERNE_PATH}" fill="none" stroke="url(#${id}-g)" stroke-width="${sw}" stroke-linejoin="round"/>`, ` class="${cls}"`)

// ---------------------------------------------------------------- icons (24 px, 1.5 stroke, technical caps)
const ICONS = {
  anvil: '<path d="M2.5 7.5h4.2l1.3-1h13.5v2.6l-2.8.6c-1.6.4-2.4 1.6-2.4 2.8 0 1 .6 1.8 1.6 2.2l.6.8H8.2l.6-.8c1-.4 1.6-1.2 1.6-2.2 0-1.4-1.1-2.6-2.8-3.1-2-.6-3.8-1.4-5.1-1.9z"/><path d="M6 19.5h12"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.8v2.4M12 18.8v2.4M2.8 12h2.4M18.8 12h2.4M5.5 5.5l1.7 1.7M16.8 16.8l1.7 1.7M5.5 18.5l1.7-1.7M16.8 7.2l1.7-1.7"/><circle cx="12" cy="12" r="6.6"/>',
  bucket: '<path d="M5 8h14l-1.6 12H6.6z"/><path d="M5 8c0-3.6 14-3.6 14 0M12 3v2"/>',
  ingot: '<path d="M3 16l3-6h12l3 6z"/><path d="M6 10l1.4-3h9.2L18 10M3 16v2.4h18V16"/>',
  balance: '<path d="M12 3v17M6 20h12M4 7h16"/><path d="M4 7l-2.4 6h4.8zM20 7l-2.4 6h4.8z"/><path d="M1.6 13a2.4 2.4 0 0 0 4.8 0M17.6 13a2.4 2.4 0 0 0 4.8 0"/>',
  crucible: '<path d="M5 6h14l-2 11a3 3 0 0 1-3 2.6h-4A3 3 0 0 1 7 17z"/><path d="M9 3.4c.6 1 .6 1.8 0 2.6M13 2.6c.8 1.2.8 2.2 0 3.4M7.4 11h9.2"/>',
  drawers: '<rect x="3.5" y="3.5" width="17" height="17" rx="1.5"/><path d="M3.5 9.2h17M3.5 14.8h17M10.4 6.4h3.2M10.4 12h3.2M10.4 17.6h3.2"/>',
  press: '<path d="M4 4h16M12 4v6M7 10h10l-1.4 4H8.4z"/><path d="M6 20h12M8.4 14 7 20M15.6 14 17 20"/>',
  sieve: '<path d="M3 8h18l-2.4 7a4 4 0 0 1-3.8 2.8H9.2A4 4 0 0 1 5.4 15z"/><path d="M8 11.4h.01M12 11.4h.01M16 11.4h.01M10 14.4h.01M14 14.4h.01M12 18v3"/>',
  seal: '<circle cx="12" cy="10" r="6.2"/><path d="M9.4 15.4 8 21.6l4-2 4 2-1.4-6.2"/><path d="M9.6 10l1.6 1.6 3.2-3.2"/>',
  ledger: '<path d="M5 3.5h12.5a1.5 1.5 0 0 1 1.5 1.5v15.5H6.5A1.5 1.5 0 0 1 5 19z"/><path d="M5 17.2h14M8.6 7.4h7M8.6 10.6h7M8.6 13.8h4"/>',
  compass: '<path d="M12 3v3M12 6l-6 15M12 6l6 15M8.4 15h7.2"/><circle cx="12" cy="6" r="1.4"/>',
  hourglass: '<path d="M6.4 3h11.2M6.4 21h11.2M7.6 3c0 4.4 4.4 5.6 4.4 9s-4.4 4.6-4.4 9M16.4 3c0 4.4-4.4 5.6-4.4 9s4.4 4.6 4.4 9"/>',
  dag: '<circle cx="5" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/><path d="M6.6 7.2 10.4 10.8M6.6 16.8l3.8-3.6M14 12h3"/>',
  cube: '<path d="M12 2.8 20 7.2v9.6L12 21.2 4 16.8V7.2z"/><path d="M4 7.2l8 4.4 8-4.4M12 11.6v9.6"/>',
  shield: '<path d="M12 3l7.6 2.8v5.6c0 4.8-3.2 8.2-7.6 9.6-4.4-1.4-7.6-4.8-7.6-9.6V5.8z"/><path d="M9 12l2.2 2.2 4-4.2"/>',
  lock: '<rect x="4.5" y="10.5" width="15" height="10" rx="1.6"/><path d="M8 10.5V7.6a4 4 0 0 1 8 0v2.9M12 14.6v2.2"/>',
  terminal: '<rect x="3" y="4.4" width="18" height="15.2" rx="1.6"/><path d="M7 9.4l3 2.6-3 2.6M12.4 15h4.6"/>',
  matrix: '<rect x="3.5" y="3.5" width="17" height="17" rx="1.2"/><path d="M3.5 9.2h17M3.5 14.8h17M9.2 3.5v17M14.8 3.5v17"/>',
  database: '<ellipse cx="12" cy="5.6" rx="7.4" ry="2.6"/><path d="M4.6 5.6v12.8c0 1.4 3.3 2.6 7.4 2.6s7.4-1.2 7.4-2.6V5.6M4.6 12c0 1.4 3.3 2.6 7.4 2.6s7.4-1.2 7.4-2.6"/>',
  agent: '<rect x="5" y="7.4" width="14" height="11" rx="2"/><path d="M12 7.4V4.6M9.6 12.4h.01M14.4 12.4h.01M9.6 15.4h4.8"/><circle cx="12" cy="3.6" r="1"/>',
  python: '<path d="M11.6 2.8c-3.8 0-3.6 1.6-3.6 1.6v1.8h3.7v.6H6.6S4 6.6 4 10.4s2.3 3.7 2.3 3.7h1.4v-1.8s-.1-2.3 2.2-2.3h3.7s2.2 0 2.2-2.1V4.9s.3-2.1-4.2-2.1z"/><path d="M12.4 21.2c3.8 0 3.6-1.6 3.6-1.6v-1.8h-3.7v-.6h5.1S20 17.4 20 13.6s-2.3-3.7-2.3-3.7h-1.4v1.8s.1 2.3-2.2 2.3h-3.7s-2.2 0-2.2 2.1v3.9s-.3 2.1 4.2 2.1z"/>',
  yaml: '<path d="M4 4.5l3.6 6 3.6-6M7.6 10.5V16M13 16l2.2-11.5L17.4 16M13.7 12.4h3M20 4.5V16"/><path d="M4 19.5h16"/>',
  spark: '<path d="M12 2.5l1.6 6.2 6.2 1.6-6.2 1.6L12 18.1l-1.6-6.2-6.2-1.6 6.2-1.6z"/><path d="M19 17l.6 2.4 2.4.6-2.4.6L19 23l-.6-2.4-2.4-.6 2.4-.6z"/>',
  arrow: '<path d="M5 12h14M13.4 6.4L19 12l-5.6 5.6"/>',
  check: '<path d="M4.6 12.6l4.6 4.6L19.4 7"/>',
  x: '<path d="M6 6l12 12M18 6L6 18"/>',
  minus: '<path d="M6 12h12"/>',
  copy: '<rect x="8.4" y="8.4" width="11.6" height="11.6" rx="1.6"/><path d="M15.6 8.4V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7.6a2 2 0 0 0 2 2h2.4"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  sun: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.6v2.2M12 19.2v2.2M2.6 12h2.2M19.2 12h2.2M5.4 5.4l1.6 1.6M17 17l1.6 1.6M5.4 18.6 7 17M17 7l1.6-1.6"/>',
  moon: '<path d="M19.6 14.4A8 8 0 1 1 9.6 4.4a6.4 6.4 0 0 0 10 10z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="1.6"/><path d="M3.6 6.4l8.4 6.4 8.4-6.4"/>',
  book: '<path d="M4 5.4A2.4 2.4 0 0 1 6.4 3H20v15.2H6.4A2.4 2.4 0 0 0 4 20.6z"/><path d="M4 20.6A2.4 2.4 0 0 0 6.4 23H20v-4.8M8.4 7.4h7.2M8.4 10.6h5"/>',
  scroll: '<path d="M5 3.5h12.5a1.5 1.5 0 0 1 1.5 1.5v15.5H6.5A1.5 1.5 0 0 1 5 19z"/><path d="M5 17.2h14M8.6 7.4h7M8.6 10.6h7M8.6 13.8h4"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.6 0l3-3a4 4 0 0 0-5.6-5.6l-1 1M14 10a4 4 0 0 0-5.6 0l-3 3a4 4 0 0 0 5.6 5.6l1-1"/>',
}
export const icon = (name, cls = 'icon') => {
  if (!ICONS[name]) throw new Error(`unknown icon: ${name}`)
  return (
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`
  )
}

// ---------------------------------------------------------------- Fig. I: the forge (hero)
const HERO_GEARS = [
  { N: 28, x: 150, y: 150 },
  { N: 16, at: 18 },
  { N: 20, at: -48 },
]
export function heroPlate() {
  const { svg: gears, placed } = gearTrain('hg', HERO_GEARS, { m: 6, period: 40 })
  const g0 = placed[0]
  return svg(
    '0 0 640 560',
    `${plateFrame('hp', { w: 640, h: 560, title: 'FIG. I' })}
<g class="construct-layer">${compassArc(g0.x, g0.y, 108, 95, 205)}${placed.map((p) => centerMark(p.x, p.y, 12)).join('')}${dimension(g0.x - 84, 262, g0.x + 84, 262, 'Ø 168')}<path class="construct" d="M 60 464 H 590" stroke="${C.ink}" stroke-width=".6" stroke-dasharray="2 5"/></g>
<g class="gears">${gears}</g>
<g transform="translate(330 500)">${anvil('ha')}</g>
<circle class="impact-glow" cx="372" cy="344" r="40" fill="url(#hp-glow)"/>
<defs><radialGradient id="hp-glow"><stop offset="0" stop-color="${C.ember}" stop-opacity=".9"/><stop offset=".5" stop-color="${C.ember}" stop-opacity=".25"/><stop offset="1" stop-color="${C.ember}" stop-opacity="0"/></radialGradient></defs>
${hammer({ px: 520, py: 300 })}
${leader(214, 404, 112, 430, 'a')}${leader(g0.x - 60, g0.y - 50, 52, 64, 'b')}${leader(470, 296, 566, 236, 'c')}
<text x="320" y="520" class="plate-caption" text-anchor="middle">a. the anvil, where sources are acquired · b. the gears, the schedule · c. the hammer, the transform</text>`,
    ' class="plate-svg hero-plate" data-impact="372 344"',
  )
}

/** Fig. II: the windlass, for acquisition. */
export const acquirePlate = () =>
  svg('0 0 560 470', `${plateFrame('ap', { w: 560, h: 470, title: 'FIG. II' })}<g transform="translate(0 6)">${windlass('aw')}</g><text x="280" y="448" class="plate-caption" text-anchor="middle">The windlass raises ore from the shaft: acquisition, after Agricola (1556)</text>`, ' class="plate-svg"')

// ---------------------------------------------------------------- Fig. III: the lifecycle
export const STAGES = [
  ['acquire', 'Acquire', 'bucket', 'Fetch over HTTP and from S3 listings with the embedded Zeus engine, or with the rclone, git, yt-dlp and Hugging Face adapters; a browser session only through Zeus. Transfers are segmented and resumable.'],
  ['materialize', 'Materialize', 'ingot', 'Land bytes as immutable, content-addressed artifacts with an id, a hash and a source.'],
  ['verify', 'Verify', 'balance', 'Digests are checked on arrival (BLAKE3 and SHA-256, and a publisher checksum where one is given). Bytes that do not match fail the node with op.integrity.'],
  ['transform', 'Transform', 'crucible', 'Unzip, convert, parse, OCR, SQL, Python: operators run out of process, pinned by version and content hash, in a sandbox on Linux.'],
  ['organize', 'Organize', 'drawers', 'Partition by date or key, deduplicate by content hash, copy and move into workspace paths.'],
  ['extract', 'Extract', 'press', 'Extract text and tables from PDFs and OCR, optionally with LLM operators bound to a JSON Schema.'],
  ['curate', 'Curate', 'sieve', 'Filter and classify, with predicates or with LLM operators over a closed label set. A person approves new code, larger budgets and the first model operator.'],
  ['publish', 'Publish', 'seal', 'Write Parquet or DuckDB tables and files, with a manifest; run and artifact events can be exported as OpenLineage.'],
]
export function pipelinePlate() {
  const W = 1160
  const xs = STAGES.map((_, i) => 80 + (i * (W - 160)) / 7)
  const ys = STAGES.map((_, i) => (i % 2 ? 150 : 108))
  const path = smoothOpen(xs.map((x, i) => [x, ys[i]]), 0.9)
  const stations = STAGES.map(
    ([id, name, ic], i) =>
      `<g class="station" transform="translate(${n(xs[i])} ${ys[i]})" data-stage="${id}" tabindex="0" role="button" aria-label="${name}"><circle class="station-ring" r="40"/><circle class="station-face" r="33"/><g transform="translate(-14 -14) scale(1.17)" class="station-icon" fill="none" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${ICONS[ic]}</g><text y="68" class="station-name" text-anchor="middle">${name}</text></g>`,
  ).join('')
  return svg(
    `0 0 ${W} 250`,
    `<path class="pipe-outer" d="${path}"/><path class="pipe-inner" d="${path}"/><path class="pipe-flow" d="${path}"/>${stations}`,
    ' class="pipeline-svg"',
  )
}

// ---------------------------------------------------------------- Fig. IV: lineage
export function lineagePlate() {
  const nodes = [
    ['n1', 66, 125, 'index.html', '9f2c'],
    ['n2', 248, 60, 'paper.pdf', '3b1f'],
    ['n3', 248, 190, 'scan.pdf', 'c07e'],
    ['n4', 440, 60, 'text.md', 'a71e'],
    ['n5', 440, 190, 'text.md', '52ae'],
    ['n6', 632, 125, 'rows.parquet', 'e48d'],
    ['n7', 816, 125, 'corpus v18', '0d93'],
  ]
  const edges = [
    ['n1', 'n2', 'crawl'],
    ['n1', 'n3', 'crawl'],
    ['n2', 'n4', 'pdf.extract'],
    ['n3', 'n5', 'ocr'],
    ['n4', 'n6', 'llm.extract'],
    ['n5', 'n6', 'llm.extract'],
    ['n6', 'n7', 'publish'],
  ]
  const at = Object.fromEntries(nodes.map(([id, x, y]) => [id, [x, y]]))
  const e = edges
    .map(([a, b, op]) => {
      const [x1, y1] = at[a]
      const [x2, y2] = at[b]
      const mx = (x1 + x2) / 2
      return `<g class="lin-edge" data-from="${a}" data-to="${b}"><path d="M ${x1 + 54} ${y1} C ${mx} ${y1} ${mx} ${y2} ${x2 - 54} ${y2}"/><text x="${mx}" y="${(y1 + y2) / 2 - 8}" text-anchor="middle" class="lin-op">${op}</text></g>`
    })
    .join('')
  const v = nodes
    .map(([id, x, y, label, h]) => `<g class="lin-node" data-node="${id}" transform="translate(${x} ${y})" tabindex="0"><rect x="-52" y="-23" width="104" height="46" rx="23"/><text y="-3" text-anchor="middle" class="lin-label">${label}</text><text y="13" text-anchor="middle" class="lin-hash">art_…${h}</text></g>`)
    .join('')
  return svg('0 0 880 250', `${e}${v}`, ' class="lineage-svg"')
}

// ---------------------------------------------------------------- Fig. V: architecture
export function architecturePlate() {
  const box = (x, y, w, h, title, sub, cls = '') =>
    `<g class="arch-node ${cls}" transform="translate(${x} ${y})"><rect width="${w}" height="${h}" rx="6"/><text x="${w / 2}" y="${sub ? h / 2 - 4 : h / 2 + 6}" text-anchor="middle" class="arch-title">${title}</text>${sub ? `<text x="${w / 2}" y="${h / 2 + 16}" text-anchor="middle" class="arch-sub">${sub}</text>` : ''}</g>`
  const line = (d, label, lx, ly, cls = '') => `<path class="arch-edge ${cls}" d="${d}" marker-end="url(#ar-arrow)"/>${label ? `<text x="${lx}" y="${ly}" class="arch-label">${label}</text>` : ''}`
  return svg(
    '0 0 1000 520',
    `<defs><marker id="ar-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" class="arch-arrow"/></marker></defs>
<g class="arch-group"><rect x="20" y="20" width="560" height="480" rx="10" class="arch-zone"/><text x="40" y="48" class="arch-zone-title">ogund · your machine</text></g>
${box(40, 70, 120, 56, 'Ogun Studio', 'GUI')}${box(170, 70, 120, 56, 'ogun', 'CLI')}${box(300, 70, 120, 56, 'MCP', 'agents')}${box(430, 70, 120, 56, 'A2A', 'planned')}
${line('M 295 126 L 295 164', '', 0, 0)}
${box(60, 168, 470, 76, 'Workflow runtime', 'IR validator · scheduler · run state machine · approvals', 'arch-node--core')}
${box(60, 266, 225, 76, 'Operators', 'child processes')}${box(305, 266, 225, 76, 'Artifact store', 'CAS · lineage · ledger')}
${box(60, 364, 470, 76, 'zeus-core engine (embedded)', 'transfer · resume · journal · verify · no sessions', 'arch-node--engine')}
${line('M 172 244 L 172 262', '', 0, 0)}${line('M 418 244 L 418 262', '', 0, 0)}${line('M 295 244 L 295 360', '', 0, 0)}
<g class="arch-group"><rect x="620" y="20" width="360" height="300" rx="10" class="arch-zone arch-zone--zeus"/><text x="640" y="48" class="arch-zone-title">Zeus app (optional)</text></g>
${box(650, 80, 300, 70, 'zeusd', 'the only process holding sessions', 'arch-node--zeus')}${box(650, 220, 300, 70, 'Browser + Zeus extension', 'per-site consent, human-only')}
${line('M 800 216 L 800 154', 'native messaging', 812, 190)}
${line('M 530 202 C 590 202 600 120 646 116', 'session bridge', 538, 228, 'arch-edge--bridge')}<text x="538" y="244" class="arch-label">(service client)</text>
${box(650, 380, 300, 80, 'Sources', 'HTTP · APIs · S3 · HF · Git · browser-only sites')}
${line('M 530 402 L 646 420', 'acquire', 560, 400)}${line('M 800 154 C 860 220 870 330 830 376', '', 0, 0, 'arch-edge--faint')}`,
    ' class="arch-svg"',
  )
}

/** Small gear train for the closing call to action. */
export function ctaGears() {
  const { svg: g } = gearTrain('cg', [{ N: 24, x: 150, y: 110 }, { N: 12, at: -10 }, { N: 18, at: 40 }], { m: 6, period: 30, ink: C.brass, paper: '#181512' })
  return svg('40 0 420 230', g, ' class="cta-gears"')
}

/** A gear with broken teeth, for the 404 page. */
export const brokenGear = () => svg('-80 -80 160 160', `<g transform="rotate(-12)">${gear('bg', { N: 18, m: 7, ink: C.bone, paper: '#1C1916', missing: [2, 3, 7, 12] })}</g><path d="M 8 -20 L 2 -6 L 12 4 L 4 22" fill="none" stroke="${C.ember}" stroke-width="2.4" stroke-linejoin="round"/>`, ' class="lost-gear"')

// ---------------------------------------------------------------- standalone files and PNG renders
export function standalone(cfg) {
  const s = 0.3
  const lockupDoc = (ink, accent) =>
    doc(`0 0 ${n(46 + WORDMARK.w * s)} 40`, `<g transform="translate(0 4)">${markInner('lk', { ink, accent })}</g><g transform="translate(${n(44 - WORDMARK.x * s)} ${n(20 - (WORDMARK.h * s) / 2 - WORDMARK.y * s)}) scale(${s})"><path d="${WORDMARK.d}" fill="${ink}"/></g>`, `${cfg.name} logo`)
  return {
    favicon: doc('0 0 32 32', markInner('fv', { ink: C.bone, accent: C.ember, bg: C.forge }), cfg.name),
    mark: doc('0 0 32 32', markInner('mk', { ink: C.ink, accent: C.emberText }), `${cfg.name} mark`),
    'mark-light': doc('0 0 32 32', markInner('ml', { ink: C.bone, accent: C.ember }), `${cfg.name} mark, light`),
    wordmark: doc(`${WORDMARK.x} ${WORDMARK.y} ${WORDMARK.w} ${WORDMARK.h}`, `<path d="${WORDMARK.d}" fill="${C.ink}"/>`, `${cfg.name} wordmark`),
    'wordmark-light': doc(`${WORDMARK.x} ${WORDMARK.y} ${WORDMARK.w} ${WORDMARK.h}`, `<path d="${WORDMARK.d}" fill="${C.bone}"/>`, `${cfg.name} wordmark, light`),
    lockup: lockupDoc(C.ink, C.emberText),
    'lockup-light': lockupDoc(C.bone, C.ember),
    'pixel-wordmark': pixelWordmarkDoc(['#FFE7B8', '#FFD08A', '#F9B25A', '#F59A3B', '#EE7F34', '#E8662E', '#CF5222', '#B8441B'], `${cfg.name} wordmark in pixels`),
    'pixel-wordmark-light': pixelWordmarkDoc(['#E88A33', '#DE7C2D', '#D26E28', '#C56123', '#B8551F', '#A94A1B', '#963F17', '#823513'], `${cfg.name} wordmark in pixels, for vellum`),
    'plate-forge': doc('0 0 640 560', heroPlate().replace(/^<svg[^>]*>|<\/svg>$/g, ''), 'Fig. I: the forge'),
    'plate-windlass': doc('0 0 560 470', acquirePlate().replace(/^<svg[^>]*>|<\/svg>$/g, ''), 'Fig. II: the windlass'),
  }
}

export function renders(cfg) {
  const fonts = `@font-face{font-family:EBG;src:url(../../fonts/eb-garamond-vf.woff2) format("woff2");font-weight:400 800}@font-face{font-family:EBG;font-style:italic;src:url(../../fonts/eb-garamond-vf-italic.woff2) format("woff2");font-weight:400 800}@font-face{font-family:Plex;src:url(../../fonts/ibm-plex-sans-vf.woff2) format("woff2");font-weight:100 700}@font-face{font-family:PlexMono;src:url(../../fonts/ibm-plex-mono-500.woff2) format("woff2")}`
  const page = (w, h, body, extra = '') =>
    `<!doctype html><html><head><meta charset="utf-8"><meta name="robots" content="noindex"><style>${fonts}html,body{margin:0;width:${w}px;height:${h}px;overflow:hidden}body{background:#13110F;color:#E9E1D0;font-family:Plex,sans-serif}.plate-title{font:600 10px EBG;letter-spacing:.3em;fill:#1E1A16}.plate-caption{font:italic 13px EBG;fill:#57503F}.plate-label,.plate-key{font:italic 13px EBG;fill:#1E1A16}.gear-spin{}.hammer{transform-origin:520px 300px;transform:rotate(28deg)}.impact-glow{opacity:0}${extra}</style></head><body>${body}</body></html>`
  const icon = (s, bg) => page(s, s, `<svg viewBox="0 0 32 32" width="${s}" height="${s}">${markInner('ic', { ink: C.bone, accent: C.ember, bg })}</svg>`, 'body{background:transparent}')
  // The social card: the pixel forge behind the pixel wordmark. Rendered by tools/render-pngs.sh from dist/_render/og/.
  const og = page(
    1200,
    630,
    `<img class="bg" src="../../art/forge-hero.png" alt=""><div class="shade"></div><div class="t">${pixelWordmark('pw')}<h1>Forge raw sources into<br><em>reproducible datasets.</em></h1><p>Durable data pipelines and agent benchmarks, built on the Zeus engine. Local-first, open source.</p><div class="v">PRE-ALPHA RELEASE 0.0.1A &nbsp;·&nbsp; A VERNE PRODUCT</div></div>`,
    `.bg{position:absolute;right:-60px;top:-45px;width:1200px;height:750px;image-rendering:pixelated}.shade{position:absolute;inset:0;background:linear-gradient(90deg,#0B0908 0,rgba(11,9,8,.94) 34%,rgba(11,9,8,.55) 56%,rgba(11,9,8,.12) 78%,transparent),linear-gradient(0deg,rgba(11,9,8,.8),transparent 30%)}.t{position:absolute;left:64px;top:62px;width:640px}.pw{width:320px;height:auto;display:block;margin-bottom:34px}.pw .wm-row--0 rect{fill:#FFE7B8}.pw .wm-row--1 rect{fill:#FFD08A}.pw .wm-row--2 rect{fill:#F9B25A}.pw .wm-row--3 rect{fill:#F59A3B}.pw .wm-row--4 rect{fill:#EE7F34}.pw .wm-row--5 rect{fill:#E8662E}.pw .wm-row--6 rect{fill:#CF5222}.pw .wm-row--7 rect{fill:#B8441B}h1{font:500 56px/1.04 EBG;margin:0;letter-spacing:-.01em}h1 em{color:#E8662E}p{font:400 22px/1.45 Plex;color:#A99F8C;margin:24px 0 0;max-width:560px}.v{margin-top:30px;font:400 15px/1 PlexMono;letter-spacing:.12em;color:#B89157}`,
  )
  return { og, 'icon-512': icon(512, C.forge), 'icon-192': icon(192, C.forge), 'apple-touch-icon': icon(180, C.forge), 'favicon-32': icon(32, C.forge) }
}
