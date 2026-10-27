import { esc } from '../../lib/html.mjs'
import { icon, pipelinePlate, STAGES } from '../art/index.mjs'
import { altOf, HOME_ART } from '../art/library.mjs'
import { artImg, pixelWordmark, preloadHero } from '../art/pixel.mjs'
import { CROPS } from '../art/library.mjs'
import { FAQ, METRICS, PRINCIPLES } from '../content.mjs'
import { answer, cards, codeTabs, ctaForge, faqList, hl, plate, section, term } from '../parts.mjs'
import { CAPTURED, text } from '../captures.mjs'

const WF_JSON = text('trips-backfill.workflow.json')

export const SAMPLES = [
  { label: 'workflow.json', icon: 'ledger', lang: 'json', code: WF_JSON },
  { label: 'validate', icon: 'terminal', html: term(text('validate.txt')) },
  { label: 'diff', icon: 'terminal', html: term(text('diff.txt')) },
  { label: 'partitions', icon: 'terminal', html: term(text('partitions.txt')) },
]

const PROV = text('artifact.json')

// The strip: 121 daily partitions, four months, one cell per day (2024 is a leap year: 31 + 29 + 31 + 30). Drawn finished, so that it reads without script.
const MONTHS = [['JAN', '2024-01', 31], ['FEB', '2024-02', 29], ['MAR', '2024-03', 31], ['APR', '2024-04', 30]]
const stripGrid = () =>
  MONTHS.map(([label, ym, n]) => `<div class="strip-month"><span class="strip-label">${label}</span><div class="strip-cells">${Array.from({ length: n }, (_, d) => `<i data-s="ok" data-day="${ym}-${String(d + 1).padStart(2, '0')}"></i>`).join('')}</div></div>`).join('')

const studioImg = (name, alt, w = 1440, h = 900) =>
  `<img class="art-ember" src="/img/${name}-dark.png" width="${w}" height="${h}" alt="${alt}" decoding="async" loading="lazy"><img class="art-sepia" src="/img/${name}-light.png" width="${w}" height="${h}" alt="${alt}" decoding="async" loading="lazy">`

export default {
  path: '/',
  order: 0,
  group: 'Platform',
  nav: 'Home',
  priority: 1,
  changefreq: 'weekly',
  title: 'Ogun: reproducible data pipelines and agent benchmarks',
  description: 'Ogun is a local-first platform for data acquisition, data engineering and AI-agent benchmarks: workflows as data, durable runs, lineage for every artifact.',
  speakable: ['.answer-text', '.fh-copy .lede'],
  faq: FAQ.filter((q) => ['what', 'status', 'airflow', 'reproducible', 'bench'].includes(q.id)),
  preload: preloadHero(),
  bodyClass: 'is-home',
  body: (ctx) => {
    const { cfg } = ctx
    const glow = CROPS[HOME_ART.hero].glow.join(',')
    return `
<section class="forge-hero" aria-labelledby="hero-title" data-forge-hero>
  <div class="fh-art" aria-hidden="true" data-glow="${glow}">${artImg(HOME_ART.hero, { cls: 'fh-img', loading: 'lazy', priority: true })}</div>
  <div class="fh-shade" aria-hidden="true"></div>
  <canvas class="fh-sparks" aria-hidden="true"></canvas>
  <div class="wrap fh-grid">
    <div class="fh-copy">
      ${pixelWordmark('fh-wordmark')}
      <h1 id="hero-title"><span class="line">Forge raw sources into</span> <span class="line line--2"><em>reproducible datasets.</em></span></h1>
      <p class="lede">Ogun is a local-first runtime for acquiring and transforming data on a schedule, built on the Zeus download engine. Workflows are versioned JSON documents. A run that crashes resumes with only the unfinished partitions.</p>
      <div class="btn-row"><a class="btn btn--ember" href="/get-started/">Try the pre-alpha ${icon('arrow', 'icon icon--arrow')}</a><a class="btn btn--ghost" href="/architecture/">Read the architecture</a></div>
      <div class="cmd" aria-label="Example command"><span class="prompt" aria-hidden="true">$</span><code id="hero-cmd">ogun validate examples/bikeshare/trips-backfill.workflow.json</code><button class="copy-btn" type="button" data-copy="hero-cmd">${icon('copy')}<span class="copy-label">copy</span></button></div>
      <p class="small muted">Runs with ogun 0.0.1c, a pre-alpha for Windows and Linux, on the sample workflows in the <a href="${cfg.repo}/tree/main/examples/bikeshare">ogun repository</a>. <a href="/get-started/">Download it or try the hosted hub</a>.</p>
    </div>
    <figure class="fh-slab">
      <div class="slab">${studioImg('studio-overview', 'Ogun Studio, Overview page: six workflows, two approvals pending, and the latest run of each workflow, with the daemon version 0.0.1-alpha.')}</div>
    </figure>
  </div>
</section>

<section class="section section--tight" aria-label="Summary"><div class="wrap wrap--narrow">${answer({
      title: 'What is Ogun?',
      text: 'Ogun is a developer platform that turns authenticated, messy web and filesystem sources into verified, reproducible datasets on a schedule, and runs benchmark tasks for data and terminal agents in isolation. Workflows are a hashed JSON IR; operators like DuckDB, dbt and OCR run out of process; every output is a content-addressed artifact with lineage. Made by Verne, built on the Zeus engine, Apache-2.0.',
      facts: [
        ['Made by', `<a href="${cfg.org.url}">Verne Ltd.</a>, Dhaka`],
        ['Engine', 'zeus-core (Rust), embedded'],
        ['Interfaces', 'CLI, MCP server, language server, Ogun Studio; an A2A bridge is planned'],
        ['License', 'Apache-2.0, no telemetry'],
        ['Status', esc(cfg.status)],
      ],
    })}</div></section>

${section({
  id: 'durable',
  cls: 'section--strip',
  title: 'Runs resume where they stopped',
  lede: 'A backfill commits one partition at a time to a journal. Kill the daemon halfway and start it again: only the partitions that had not finished run.',
  art: HOME_ART.bands.durable,
  body: `${plate({
    cls: 'plate--strip',
    caption: 'The O1 exit test, drawn. One cell per day of a 121-partition backfill: cold iron is waiting, ember is running, verdigris is done. ogund is killed with SIGKILL and restarted, and only the cold cells are struck again.',
    credit: 'Illustration of ROADMAP phase O1 and <code>crates/ogun-daemon/tests/exit.rs</code> (a partition is done under O-01 section 5.3 and skipped as up to date under O-04 section 4). Drawn, not recorded: the transcript below is.',
    body: `<div class="strip" data-strip><div class="strip-bar"><span class="strip-name">exit-backfill · 2024-01-01 to 2024-04-30</span><span class="strip-meter" aria-live="off">121 done · 0 running · 0 to run</span><button class="strip-replay" type="button" hidden>Replay</button></div><div class="strip-grid" role="img" aria-label="121 daily partitions from 2024-01-01 to 2024-04-30, struck in order. ogund is killed after about 60 are done and restarted; the unfinished ones are struck again until all 121 are done.">${stripGrid()}</div><p class="strip-state" aria-live="polite">121 of 121 partitions done. A second backfill over the range has 0 to run.</p></div>`,
  })}
<div class="split split--top section-split"><div>${plate({
    cls: 'plate--term',
    caption: `The same run on the real daemon, ${CAPTURED}. ogund was killed after 30 partitions; four node instances that were in flight ran a second attempt, and the other 238 were not touched.`,
    body: `<div class="code-block code-block--tall"><button class="copy-btn" type="button" data-copy="exit-log">${icon('copy')}<span class="copy-label">copy</span></button><pre id="exit-log">${term(text('exit-backfill.txt'))}</pre></div>`,
  })}</div><div data-reveal data-delay="120"><h3>How resumption works</h3><ul class="checklist"><li>${icon('check')}<span>Transfers resume from the Zeus engine’s journal, byte-exact, after checking validators.</span></li><li>${icon('check')}<span>Node instances checkpoint; artifact edges are committed before a node is marked succeeded.</span></li><li>${icon('check')}<span>Each partition is its own unit of success, failure and retry.</span></li><li>${icon('check')}<span>The phase O1 exit test is this run. It passes on Linux; the transcript was captured on Windows.</span></li></ul></div></div>`,
})}

${section({
  id: 'lifecycle',
  cls: 'section--band',
  title: 'From acquisition to publication',
  lede: 'A workflow moves data through eight stages. Each stage is a node or a group of nodes in the run, and all of them write to the same lineage graph.',
  art: HOME_ART.bands.lifecycle,
  body: `<div class="pipeline" data-pipeline data-reveal>${pipelinePlate()}<div class="stage-panel" aria-live="polite"></div><script type="application/json">${JSON.stringify(STAGES)}</script></div>`,
})}

${section({
  id: 'ir',
  title: 'Workflows are data, not code',
  lede: 'A workflow is a JSON document: validated, hashed, diffed and approved before it runs. YAML and a Python SDK are planned; they will compile to the same IR.',
  body: `<div class="split split--top"><div>${plate({
    cls: 'plate--term',
    caption: `The workflow is verbatim from <code>examples/bikeshare</code> in the ogun repository; the terminal tabs are real output, ${CAPTURED}. IR v0 is a draft (<a href="${cfg.repo}/blob/main/docs/spec/O-02-workflow-ir-v0.md">O-02</a>, Draft 2) and may change.`,
    body: codeTabs('ir', SAMPLES),
  })}</div><div data-reveal data-delay="120"><h3>Why data, not code</h3><ul class="checklist"><li>${icon('check')}<span>No floating-point numbers, so the JCS + BLAKE3 hash is stable and can bind an approval.</span></li><li>${icon('check')}<span>Expressions are a closed template and predicate set: no loops, calls or I/O in the IR.</span></li><li>${icon('check')}<span>Code lives in operators, pinned by content hash; adding or changing one needs your approval.</span></li><li>${icon('check')}<span>Prompt to IR to validator to plan diff to approval to runtime. Never prompt to shell.</span></li></ul><a class="btn btn--ghost" href="/workflows/">How workflows work ${icon('arrow', 'icon icon--arrow')}</a></div></div>`,
})}

${section({
  id: 'run',
  cls: 'section--band',
  title: 'Studio reads the real daemon',
  lede: 'Ogun Studio ships in the release for Windows and Linux. On the hosted hub it runs on the real daemon with sample workflows: runs, partitions, approvals, artifacts and lineage.',
  art: HOME_ART.bands.run,
  body: plate({
    cls: 'plate--shot',
    caption: 'The Partitions page of Ogun Studio 0.0.1a on the hosted hub: the sample <code>trips-backfill</code> workflow, 36 monthly partitions done and 9 missing. Studio draws one cell per key, as the strip above does.',
    body: `<div class="shot">${studioImg('studio-partitions', 'Ogun Studio, Partitions page for the workflow trips-backfill: 45 keys in two ranges, 36 done from 2023-01 to 2025-12 and 9 missing from 2026-01 to 2026-09, with a row of green cells for the done keys.')}</div>`,
  }),
})}

${section({
  id: 'acquire',
  title: 'Acquisition runs on the Zeus engine',
  body: `<div class="split">${plate({
    cls: 'plate--pixel',
    body: `<div class="pixel-frame">${artImg(HOME_ART.acquire, { alt: altOf(HOME_ART.acquire) })}</div>`,
  })}<div data-reveal data-delay="120"><p class="lede">Ogun embeds zeus-core, the Rust engine behind the Zeus app: segmented transfers, a crash-safe journal, validator checks before every resume, SHA-256 and BLAKE3 verification, and polite defaults.</p><p class="muted">Sources behind your browser login are the one exception: Ogun never holds cookies. It asks the Zeus daemon, as a service client, to acquire them, and imports the result with its provenance. That bridge is built and tested against a fake <code>zeusd</code>, not yet against a real one.</p><a class="btn btn--ghost" href="/architecture/">See the architecture ${icon('arrow', 'icon icon--arrow')}</a></div></div>`,
})}

${section({
  id: 'lineage',
  cls: 'section--band',
  title: 'Lineage for every artifact',
  lede: 'Every artifact is content-addressed and recorded with the run, node and partition that produced it. Parents and operator versions are carried in the lineage events.',
  art: HOME_ART.bands.lineage,
  body: `<div class="split split--top section-split"><div>${plate({
    cls: 'plate--term',
    caption: `One artifact record from <code>ogun artifacts --json</code>, ${CAPTURED}. Its BLAKE3 digest is its address in the store.`,
    body: `<div class="code-block"><button class="copy-btn" type="button" data-copy="prov">${icon('copy')}<span class="copy-label">copy</span></button><pre id="prov">${hl('json', PROV)}</pre></div>`,
  })}${plate({
    cls: 'plate--term',
    caption: 'The store ogund creates on first start: one object per distinct content, fanned out by the first four hex digits of its digest.',
    body: `<div class="code-block"><pre>${hl('sh', text('cas.txt'))}</pre></div>`,
  })}</div><div data-reveal data-delay="120"><h3>Questions it answers</h3><ul class="checklist"><li>${icon('check')}<span>Which run, node and partition produced this file?</span></li><li>${icon('check')}<span>Which operator version and code hash ran, and with which workflow hash?</span></li><li>${icon('check')}<span>Which input artifacts fed it?</span></li><li>${icon('check')}<span>Are two artifacts the same bytes?</span></li></ul><a class="btn btn--ghost" href="/lineage/">Artifacts and lineage ${icon('arrow', 'icon icon--arrow')}</a></div></div>`,
})}

${section({
  id: 'bench',
  title: 'Benchmark runs',
  art: HOME_ART.bands.bench,
  lede: 'A benchmark is a controlled set of runs, each with a workflow, environment, agent, policy, inputs and evaluator. Ogun reads existing task formats and records cost, efficiency and recovery alongside the official score.',
  body: `<p class="wrap--narrow" data-reveal>Adapters for Spider 2.0-DBT, ADE-bench and Terminal-Bench 2.0 tasks in the Harbor format are written. Their task formats come from public descriptions and are not yet verified against the official releases, so there are no results. The <code>ogun-bench</code> binary ships in the 0.0.1c archives, and Studio runs a built-in sample suite with it (scripted agents, not models).</p>
<div class="metrics" data-reveal>${METRICS.slice(0, 3)
    .concat(METRICS.slice(5, 6))
    .map(([n, f, d]) => `<div class="metric"><h3>${n}</h3><p class="formula">${f}</p><p>${d}</p></div>`)
    .join('')}</div><p class="center"><a class="btn btn--ghost" href="/benchmarks/">The benchmark profile ${icon('arrow', 'icon icon--arrow')}</a></p>`,
})}

${section({ id: 'principles', cls: 'section--band', title: 'Design principles', lede: 'Each traces to an architecture decision record. ADRs 0002 to 0005 are accepted.', art: HOME_ART.bands.principles, body: cards(PRINCIPLES) })}

${section({
  id: 'integrations',
  title: 'Existing tools run as operators',
  art: HOME_ART.bands.integrations,
  body: `<div class="wrap--narrow" data-reveal><p class="lede">Ogun orchestrates tools you already trust as out-of-process operators with pinned versions, and has integrations for the orchestrators you already run.</p><ul class="chips">${['DuckDB', 'dbt', 'Polars', 'Python', 'SQL', 'ffmpeg', 'pandoc', 'Tesseract', 'PaddleOCR', 'yt-dlp', 'rclone', 'git', 'Hugging Face', 'OpenLineage', 'MCP', 'VS Code', 'Airflow', 'Dagster', 'Prefect', 'Kestra'].map((t) => `<li>${t}</li>`).join('')}</ul><p class="small muted">Names belong to their owners and indicate compatibility, not endorsement. The orchestrator integrations are in the repository, not yet on PyPI, and were tested against fakes rather than the real services.</p></div>`,
})}

${section({ id: 'faq', cls: 'section--band', title: 'Common questions', art: HOME_ART.bands.faq, body: `<div class="wrap--narrow">${faqList(FAQ.filter((q) => ['what', 'status', 'airflow', 'reproducible', 'bench'].includes(q.id)))}<p class="center"><a class="btn btn--ghost" href="/faq/">All questions ${icon('arrow', 'icon icon--arrow')}</a></p></div>` })}

${ctaForge(cfg)}
`
  },
}
