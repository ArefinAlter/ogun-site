import { esc } from '../../lib/html.mjs'
import { acquirePlate, heroPlate, icon, lineagePlate, pipelinePlate, STAGES } from '../art/index.mjs'
import { FAQ, METRICS, PRINCIPLES } from '../content.mjs'
import { answer, cards, codeTabs, ctaForge, faqList, figure, hl, section, term } from '../parts.mjs'
import { CAPTURED, text } from '../captures.mjs'

const WF_JSON = text('trips-backfill.workflow.json')

export const SAMPLES = [
  { label: 'workflow.json', icon: 'ledger', lang: 'json', code: WF_JSON },
  { label: 'validate', icon: 'terminal', html: term(text('validate.txt')) },
  { label: 'diff', icon: 'terminal', html: term(text('diff.txt')) },
  { label: 'partitions', icon: 'terminal', html: term(text('partitions.txt')) },
]

const PROV = text('artifact.json')

export default {
  path: '/',
  order: 0,
  group: 'Platform',
  nav: 'Home',
  priority: 1,
  changefreq: 'weekly',
  title: 'Ogun: reproducible data pipelines and agent benchmarks',
  description: 'Ogun is a local-first platform for data acquisition, data engineering and AI-agent benchmarks: workflows as data, durable runs, lineage for every artifact.',
  speakable: ['.answer-text', '.hero .lede'],
  faq: FAQ.filter((q) => ['what', 'status', 'airflow', 'reproducible', 'bench'].includes(q.id)),
  body: (ctx) => {
    const { cfg } = ctx
    return `
<section class="hero" aria-labelledby="hero-title">
  <div class="wrap hero-grid">
    <div>
      <h1 id="hero-title"><span class="line">Forge raw sources into</span><span class="line line--2"><em>reproducible datasets.</em></span></h1>
      <p class="lede">Ogun is a local-first runtime for acquiring and transforming data on a schedule, and for running agent benchmarks. It is built on the Zeus download engine. Workflows are versioned JSON documents, runs resume after a crash, and every output records where it came from.</p>
      <div class="btn-row"><a class="btn btn--ember" href="/get-started/">Try the pre-alpha ${icon('arrow', 'icon icon--arrow')}</a><a class="btn btn--ghost" href="/architecture/">Read the architecture</a></div>
      <div class="cmd" aria-label="Example command"><span class="prompt" aria-hidden="true">$</span><code id="hero-cmd">ogun validate examples/bikeshare/trips-backfill.workflow.json</code><button class="copy-btn" type="button" data-copy="hero-cmd">${icon('copy')}<span class="copy-label">copy</span></button></div>
      <p class="small muted">Runs with ogun 0.0.1a, a pre-alpha for Windows and Linux, on the sample workflows in the <a href="${cfg.repo}/tree/main/examples/bikeshare">ogun repository</a>. <a href="/get-started/">Download it or try the hosted hub</a>.</p>
    </div>
    <div class="hero-figure" data-spinup>
      <div class="plate-wrap">${heroPlate()}<canvas class="sparks" aria-hidden="true"></canvas><button class="hero-strike-btn" type="button" aria-label="Strike the anvil: plays a short animation"></button></div>
    </div>
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
  id: 'lifecycle',
  title: 'From acquisition to publication',
  lede: 'A workflow moves data through eight stages. Each stage is a node or a group of nodes in the run, and all of them write to the same lineage graph.',
  body: `<div class="pipeline" data-pipeline data-reveal>${pipelinePlate()}<div class="stage-panel" aria-live="polite"></div><script type="application/json">${JSON.stringify(STAGES)}</script></div>`,
})}

${section({
  id: 'ir',
  cls: 'section--band',
  title: 'Workflows are data, not code',
  lede: 'A workflow is a JSON document: validated, hashed, diffed and approved before it runs. YAML and a Python SDK are planned; they will compile to the same IR.',
  body: `<div class="split split--top"><div>${codeTabs('ir', SAMPLES)}<p class="small muted">The workflow is verbatim from <code>examples/bikeshare</code> in the ogun repository. The terminal tabs are real output, ${CAPTURED}. IR v0 is a draft (<a href="${cfg.repo}/blob/main/docs/spec/O-02-workflow-ir-v0.md">O-02</a>, Draft 2) and may change.</p></div><div data-reveal data-delay="120"><h3>Why data, not code</h3><ul class="checklist"><li>${icon('check')}<span>No floating-point numbers, so the JCS + BLAKE3 hash is stable and can bind an approval.</span></li><li>${icon('check')}<span>Expressions are a closed template and predicate set: no loops, calls or I/O in the IR.</span></li><li>${icon('check')}<span>Code lives in operators, pinned by content hash; adding or changing one needs your approval.</span></li><li>${icon('check')}<span>Prompt to IR to validator to plan diff to approval to runtime. Never prompt to shell.</span></li></ul><a class="btn btn--ghost" href="/workflows/">How workflows work ${icon('arrow', 'icon icon--arrow')}</a></div></div>`,
})}

${section({
  id: 'run',
  title: 'Ogun Studio on the real daemon',
  lede: 'The release includes Ogun Studio for Windows and Linux. The hosted hub runs it on the real daemon with sample workflows: runs, partitions, approvals, artifacts and lineage.',
  body: `${figure(`<img src="/img/studio-overview.png" width="1440" height="900" loading="lazy" decoding="async" alt="Ogun Studio, Overview page: six workflows, two approvals pending, and the latest run of each workflow, with the daemon version 0.0.1-alpha.">`, 'VI', 'Ogun Studio 0.0.1a, Overview, on the hosted hub’s sample data. The daemon is ogund 0.0.1-alpha; the two approvals wait for a person, as designed.', 'figure--wide')}`,
})}

${section({
  id: 'durable',
  cls: 'section--band',
  title: 'Runs resume after a crash',
  lede: 'Partitions commit independently to a journal. If the daemon is killed during a backfill, it resumes only the partitions that had not finished.',
  body: `<div class="split split--top"><div class="backfill" data-backfill data-reveal><div class="backfill-head"><code>exit-backfill</code><span>121 daily partitions · 2024-01-01 → 2024-04-30</span></div><div class="grid-cells" role="img" aria-label="Partition status grid">${'<i></i>'.repeat(121)}</div><div class="backfill-legend"><span class="l-ok">succeeded</span><span class="l-run">running</span><span>pending</span></div><p class="backfill-status" aria-live="polite"></p><div class="backfill-actions"><button class="btn btn--small btn--ghost bf-start" type="button">Run again</button><button class="btn btn--small btn--ember bf-kill" type="button">kill -9 ogund</button></div><p class="small muted">Drawn from the O1 exit test (<code>crates/ogun-daemon/tests/exit.rs</code>), not recorded: the grid shows the mechanism, the transcript below is the real thing.</p></div>
<div data-reveal data-delay="120"><h3>How resumption works</h3><ul class="checklist"><li>${icon('check')}<span>Transfers resume from the Zeus engine’s journal, byte-exact, after checking validators.</span></li><li>${icon('check')}<span>Node instances checkpoint; artifact edges are committed before a node is marked succeeded.</span></li><li>${icon('check')}<span>Each partition is its own unit of success, failure and retry.</span></li><li>${icon('check')}<span>The phase O1 exit test is this run: 121 partitions, <code>kill -9</code>, restart. It passes on Linux; the transcript was captured on Windows.</span></li></ul></div></div>
<div class="code-block code-block--tall" data-reveal><button class="copy-btn" type="button" data-copy="exit-log">${icon('copy')}<span class="copy-label">copy</span></button><pre id="exit-log">${term(text('exit-backfill.txt'))}</pre></div><p class="small muted" data-reveal>Real output, ${CAPTURED}. <code>ogund</code> was killed with TerminateProcess (SIGKILL on Linux) after 30 partitions; four node instances that were in flight ran a second attempt, and the other 238 were not touched.</p>`,
})}

${section({
  id: 'acquire',
  title: 'Acquisition runs on the Zeus engine',
  body: `<div class="split">${figure(acquirePlate(), 'II', 'The windlass raises ore from the shaft. Ogun embeds the zeus-core engine for the same job.')}<div data-reveal data-delay="120"><p class="lede">Ogun embeds zeus-core, the Rust engine behind the Zeus app: segmented transfers, a crash-safe journal, validator checks before every resume, SHA-256 and BLAKE3 verification, and polite defaults.</p><p class="muted">Sources behind your browser login are the one exception: Ogun never holds cookies. It asks the Zeus daemon, as a service client, to acquire them, and imports the result with its provenance. That bridge is built and tested against a fake <code>zeusd</code>, not yet against a real one.</p><a class="btn btn--ghost" href="/architecture/">See the architecture ${icon('arrow', 'icon icon--arrow')}</a></div></div>`,
})}

${section({
  id: 'lineage',
  cls: 'section--band',
  title: 'Lineage for every artifact',
  lede: 'Every artifact is content-addressed and recorded with the run, node and partition that produced it. Parents and operator versions are carried in the lineage events.',
  body: `${figure(lineagePlate(), 'IV', 'Two PDFs, one scanned, become one versioned corpus. Every edge names the operator that made it. The graph is schematic.', 'figure--wide')}
<div class="split split--top section-split"><div data-reveal><div class="code-block"><button class="copy-btn" type="button" data-copy="prov">${icon('copy')}<span class="copy-label">copy</span></button><pre id="prov">${hl('json', PROV)}</pre></div><p class="small muted">One artifact record from <code>ogun artifacts --json</code>, ${CAPTURED}. Its BLAKE3 digest is its address in the store.</p></div><div data-reveal data-delay="120"><h3>Questions it answers</h3><ul class="checklist"><li>${icon('check')}<span>Which run, node and partition produced this file?</span></li><li>${icon('check')}<span>Which operator version and code hash ran, and with which workflow hash?</span></li><li>${icon('check')}<span>Which input artifacts fed it?</span></li><li>${icon('check')}<span>Are two artifacts the same bytes?</span></li></ul><a class="btn btn--ghost" href="/lineage/">Artifacts and lineage ${icon('arrow', 'icon icon--arrow')}</a></div></div>`,
})}

${section({
  id: 'bench',
  title: 'Benchmark runs',
  lede: 'A benchmark is a controlled set of runs, each with a workflow, environment, agent, policy, inputs and evaluator. Ogun reads existing task formats and records cost, efficiency and recovery alongside the official score.',
  body: `<p class="wrap--narrow" data-reveal>Adapters for Spider 2.0-DBT, ADE-bench and Terminal-Bench 2.0 tasks in the Harbor format are written. Their task formats come from public descriptions and are not yet verified against the official releases, so there are no results. The benchmark binary is not part of release 0.0.1a.</p>
<div class="metrics" data-reveal>${METRICS.slice(0, 3)
    .concat(METRICS.slice(5, 6))
    .map(([n, f, d]) => `<div class="metric"><h3>${n}</h3><p class="formula">${f}</p><p>${d}</p></div>`)
    .join('')}</div><p class="center"><a class="btn btn--ghost" href="/benchmarks/">The benchmark profile ${icon('arrow', 'icon icon--arrow')}</a></p>`,
})}

${section({ id: 'principles', cls: 'section--band', title: 'Design principles', lede: 'Each traces to an architecture decision record. ADRs 0002 to 0005 are accepted.', body: cards(PRINCIPLES) })}

${section({
  id: 'integrations',
  title: 'Existing tools run as operators',
  body: `<div class="wrap--narrow" data-reveal><p class="lede">Ogun orchestrates tools you already trust as out-of-process operators with pinned versions, and has integrations for the orchestrators you already run.</p><ul class="chips">${['DuckDB', 'dbt', 'Polars', 'Python', 'SQL', 'ffmpeg', 'pandoc', 'Tesseract', 'PaddleOCR', 'yt-dlp', 'rclone', 'git', 'Hugging Face', 'OpenLineage', 'MCP', 'VS Code', 'Airflow', 'Dagster', 'Prefect', 'Kestra'].map((t) => `<li>${t}</li>`).join('')}</ul><p class="small muted">Names belong to their owners and indicate compatibility, not endorsement. The orchestrator integrations are in the repository, not yet on PyPI, and were tested against fakes rather than the real services.</p></div>`,
})}

${section({ id: 'faq', cls: 'section--band', title: 'Common questions', body: `<div class="wrap--narrow">${faqList(FAQ.filter((q) => ['what', 'status', 'airflow', 'reproducible', 'bench'].includes(q.id)))}<p class="center"><a class="btn btn--ghost" href="/faq/">All questions ${icon('arrow', 'icon icon--arrow')}</a></p></div>` })}

${ctaForge(cfg)}
`
  },
}
