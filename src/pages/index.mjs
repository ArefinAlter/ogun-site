import { esc } from '../../lib/html.mjs'
import { acquirePlate, heroPlate, icon, lineagePlate, pipelinePlate, STAGES } from '../art/index.mjs'
import { FAQ, METRICS, PRINCIPLES } from '../content.mjs'
import { answer, cards, codeTabs, ctaForge, faqList, figure, hl, section } from '../parts.mjs'

export const SAMPLES = [
  {
    label: 'workflow.yaml',
    icon: 'yaml',
    lang: 'yaml',
    code: `workflow: climate-papers
version: 17
trigger:
  cron: "0 3 * * 0"            # Sundays, 03:00
budgets:
  bytes: "60 GB"
  llm_spend_usd: "2.50"
steps:
  - id: discover
    uses: crawl@1
    with:
      start: "https://journal.example.org/climate-health"
      pagination: { strategy: rel_next, max_pages: 40 }
      select: { css: "a.pdf-link", attr: href }
  - id: acquire
    uses: acquire@1              # the Zeus engine: parts, resume, verify
    from: discover.urls
  - id: extract
    uses: pdf.extract@2
    from: acquire.artifacts
    route:
      - when: { has_text: false }
        to: ocr
  - id: ocr
    uses: tesseract@5
  - id: classify
    uses: llm.extract@1
    from: [extract.text, ocr.text]
    with: { schema: "paper.schema.json" }
  - id: publish
    uses: duckdb@1
    from: classify.rows
    with: { write: "papers.parquet" }`,
  },
  {
    label: 'pipeline.py',
    icon: 'python',
    lang: 'python',
    code: `from ogun import workflow, acquire, ops

@workflow(schedule="0 3 * * 0", budgets={"bytes": "60 GB", "llm_spend_usd": "2.50"})
def climate_papers():
    urls = acquire.crawl("https://journal.example.org/climate-health",
                         pagination="rel_next", select="a.pdf-link@href")
    pdfs = acquire.fetch(urls)
    text = pdfs.map(ops.pdf_extract).route(no_text=ops.ocr("tesseract"))
    rows = text.map(ops.llm_extract(schema=Paper))
    return rows.write.parquet("papers.parquet")

# The SDK builds IR. Nothing above runs at definition time.`,
  },
  {
    label: 'ir.json',
    icon: 'ledger',
    lang: 'json',
    code: `{
  "ir_version": 0,
  "workflow": "climate-papers",
  "version": 17,
  "nodes": [
    { "id": "discover", "op": "crawl@1", "config": { "pagination": "rel_next" } },
    { "id": "acquire", "op": "acquire@1", "inputs": ["discover.urls"],
      "policy": { "retries": 5, "budget_bytes": 64424509440 } },
    { "id": "classify", "op": "llm.extract@1", "inputs": ["extract.text", "ocr.text"],
      "policy": { "budget_usd_micro": 2500000, "approval": "over_budget" } }
  ],
  "workflow_hash": "blake3:7c3e…41d0"
}`,
  },
  {
    label: 'terminal',
    icon: 'terminal',
    lang: 'sh',
    code: `$ ogun plan climate-papers.yaml
  v16 -> v17   +2 nodes   +1 code hash   hash blake3:7c3e…41d0
  + ocr        tesseract@5      sandbox: no network
  + classify   llm.extract@1    budget $2.50   needs approval
$ ogun run climate-papers
  run #184 started   waiting_for_user: approve in Studio or on this terminal
$ ogun backfill noaa-daily --from 2020-01 --to 2026-10
$ ogun status climate-papers#184`,
  },
]

const PROV = `{
  "artifact": "art_01JA7X…",
  "sha256": "9f2c…a71e",
  "blake3": "41d0…7c3e",
  "source": "https://journal.example.org/…/paper.pdf",
  "retrieved_at": "2026-10-04T03:12:44.381Z",
  "license": "unknown",
  "parents": ["art_01JA7W…"],
  "produced_by": { "op": "llm.extract@1", "model": "your-model", "prompt_hash": "b3:52ae…" },
  "run": "climate-papers#184",
  "workflow_hash": "blake3:7c3e…41d0",
  "session_origin": null
}`

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
      <div class="cmd" aria-label="Development build command"><span class="prompt" aria-hidden="true">$</span><code id="hero-cmd">ogun backfill noaa-daily --from 2020-01-01 --to 2026-10-22 --yes</code><button class="copy-btn" type="button" data-copy="hero-cmd">${icon('copy')}<span class="copy-label">copy</span></button></div>
      <p class="small muted">A command of ogun 0.0.1a, a pre-alpha for Windows and Linux. <a href="/get-started/">Download it or try the hosted hub</a>.</p>
    </div>
    <div class="hero-figure" data-spinup>
      <div class="plate-wrap">${heroPlate()}<canvas class="sparks" aria-hidden="true"></canvas><button class="hero-strike-btn" type="button" aria-label="Strike the anvil: plays a short animation"></button></div>
    </div>
  </div>
</section>

<section class="section section--tight" aria-label="Summary"><div class="wrap wrap--narrow">${answer({
      title: 'What is Ogun?',
      text: 'Ogun is a developer platform that turns authenticated, messy web and filesystem sources into verified, reproducible datasets on a schedule, and runs benchmark tasks for data and terminal agents in isolation. Workflows are a hashed JSON IR; operators like DuckDB, dbt and OCR run sandboxed; every output is a content-addressed artifact with full lineage. Made by Verne, built on the Zeus engine, Apache-2.0.',
      facts: [
        ['Made by', `<a href="${cfg.org.url}">Verne Ltd.</a>, Dhaka`],
        ['Engine', 'zeus-core (Rust), embedded'],
        ['Interfaces', 'CLI, MCP, Studio (later), A2A (later)'],
        ['License', 'Apache-2.0, no telemetry'],
        ['Status', esc(cfg.status)],
      ],
    })}</div></section>

${section({
  id: 'lifecycle',
  title: 'From acquisition to publication',
  lede: 'A workflow moves data through eight stages. Each stage is journaled, and all of them write to the same lineage graph.',
  body: `<div class="pipeline" data-pipeline data-reveal>${pipelinePlate()}<div class="stage-panel" aria-live="polite"></div><script type="application/json">${JSON.stringify(STAGES)}</script></div>`,
})}

${section({
  id: 'ir',
  cls: 'section--band',
  title: 'Workflows are data, not code',
  lede: 'YAML, a Python SDK or a draft from your agent all compile to the same JSON intermediate representation, which is validated, hashed, diffed and approved before it runs.',
  body: `<div class="split split--top"><div>${codeTabs('ir', SAMPLES)}<p class="small muted">Illustrative. The IR specification (O-02) is being written; syntax will change.</p></div><div data-reveal data-delay="120"><h3>Why data, not code</h3><ul class="checklist"><li>${icon('check')}<span>No floating-point numbers, so the JCS + BLAKE3 hash is stable and can bind an approval.</span></li><li>${icon('check')}<span>Expressions are a closed template and predicate set: no loops, calls or I/O in the IR.</span></li><li>${icon('check')}<span>Code lives in operators, pinned by content hash; adding or changing one needs your approval.</span></li><li>${icon('check')}<span>Prompt to IR to validator to plan diff to approval to runtime. Never prompt to shell.</span></li></ul><a class="btn btn--ghost" href="/workflows/">How workflows work ${icon('arrow', 'icon icon--arrow')}</a></div></div>`,
})}

${section({
  id: 'run',
  title: 'What a run looks like',
  lede: 'A mock-up of Ogun Studio, which is built but not yet released. The run retries a mirror that returned 503, resumes a file part-way through, and stops at a budget gate until a person approves.',
  body: `<div class="studio" data-studio data-reveal>
  <div class="studio-bar"><strong>climate-papers</strong><span>run #184 · workflow v17</span><span class="run-state" data-state="running">running</span><button class="studio-replay" type="button">replay</button></div>
  <div class="dag">${[['crawl@1', 'Discover'], ['acquire@1', 'Acquire'], ['pdf.extract@2', 'Extract'], ['llm.extract@1', 'Classify'], ['duckdb@1', 'Publish']]
    .map(([op, name]) => `<div class="dag-node" data-state="pending"><span class="badge">pending</span><div class="op">${op}</div><div class="name">${name}</div><div class="count">·</div><div class="bar"><i></i></div></div>`)
    .join('')}</div>
  <div class="studio-foot"><div><h3>Events</h3><ul class="event-log" aria-live="polite"></ul></div><div><h3>Approvals</h3><div class="approval-mini" hidden><p class="q">Run <b>llm.extract</b> on 481 documents, estimated <b>$1.38</b> against a $2.50 budget?</p><div class="actions"><button type="button">Approve</button><button type="button" class="no">Deny</button></div><p class="appr-note">Bound to request hash 41d0…. Agents cannot answer this.</p></div></div></div>
</div>`,
})}

${section({
  id: 'durable',
  cls: 'section--band',
  title: 'Runs resume after a crash',
  lede: 'Partitions commit independently to a journal. If the daemon is killed during a backfill, it resumes only the partitions that had not finished.',
  body: `<div class="split split--top"><div class="backfill" data-backfill data-reveal><div class="backfill-head"><code>noaa-daily</code><span>monthly partitions · 2020-01 → 2026-10</span></div><div class="grid-cells" role="img" aria-label="Partition status grid">${'<i></i>'.repeat(82)}</div><div class="backfill-legend"><span class="l-ok">succeeded</span><span class="l-run">running</span><span class="l-retry">retrying</span><span class="l-fail">failed</span><span>pending</span></div><p class="backfill-status" aria-live="polite"></p><div class="backfill-actions"><button class="btn btn--small btn--ghost bf-start" type="button">Run again</button><button class="btn btn--small btn--ember bf-kill" type="button">kill -9 ogund</button></div></div>
<div data-reveal data-delay="120"><h3>How resumption works</h3><ul class="checklist"><li>${icon('check')}<span>Transfers resume from the Zeus engine’s journal, byte-exact, after checking validators.</span></li><li>${icon('check')}<span>Node instances checkpoint; artifact edges are committed before a node is marked succeeded.</span></li><li>${icon('check')}<span>Each partition is its own unit of success, failure and retry.</span></li><li>${icon('check')}<span>The phase O1 exit test is exactly this: a partitioned backfill surviving kill -9.</span></li></ul></div></div>`,
})}

${section({
  id: 'acquire',
  title: 'Acquisition runs on the Zeus engine',
  body: `<div class="split">${figure(acquirePlate(), 'II', 'The windlass raises ore from the shaft. Ogun embeds the zeus-core engine for the same job.')}<div data-reveal data-delay="120"><p class="lede">Ogun embeds zeus-core, the Rust engine behind the Zeus app: segmented transfers, a crash-safe journal, validator checks before every resume, SHA-256 and BLAKE3 verification, and polite defaults.</p><p class="muted">Sources behind your browser login are the one exception: Ogun never holds cookies. It asks the Zeus daemon, as a service client, to acquire them, and imports the result with its provenance.</p><a class="btn btn--ghost" href="/architecture/">See the architecture ${icon('arrow', 'icon icon--arrow')}</a></div></div>`,
})}

${section({
  id: 'lineage',
  cls: 'section--band',
  title: 'Lineage for every artifact',
  lede: 'Every artifact is content-addressed and records its parents, the operator that produced it and the run it belongs to.',
  body: `${figure(lineagePlate(), 'IV', 'Two PDFs, one scanned, become one versioned corpus. Every edge names the operator that made it.', 'figure--wide')}
<div class="split split--top section-split"><div class="code-block" data-reveal><button class="copy-btn" type="button" data-copy="prov">${icon('copy')}<span class="copy-label">copy</span></button><pre id="prov">${hl('json', PROV)}</pre></div><div data-reveal data-delay="120"><h3>Questions it answers</h3><ul class="checklist"><li>${icon('check')}<span>Which raw file, site and run produced this record?</span></li><li>${icon('check')}<span>Which model and prompt hash generated this field?</span></li><li>${icon('check')}<span>What was fetched with authenticated access?</span></li><li>${icon('check')}<span>Has the upstream source changed since?</span></li><li>${icon('check')}<span>Can dataset version v18 be reproduced, exactly?</span></li></ul><a class="btn btn--ghost" href="/lineage/">Artifacts and lineage ${icon('arrow', 'icon icon--arrow')}</a></div></div>`,
})}

${section({
  id: 'bench',
  title: 'Benchmark runs',
  lede: 'A benchmark is a controlled set of runs, each with a workflow, environment, agent, policy, inputs and evaluator. Ogun reads existing task formats and records cost, efficiency and recovery alongside the official score.',
  body: `<p class="wrap--narrow" data-reveal>Adapters for Spider 2.0-DBT, ADE-bench and Terminal-Bench 2.0 tasks in the Harbor format are written, with agents such as Claude Code, Codex and OpenCode behind one adapter interface. Their task formats are still being checked against the official releases, so there are no results yet.</p>
<div class="metrics" data-reveal>${METRICS.slice(0, 3)
    .concat(METRICS.slice(5, 6))
    .map(([n, f, d]) => `<div class="metric"><h3>${n}</h3><p class="formula">${f}</p><p>${d}</p></div>`)
    .join('')}</div><p class="center"><a class="btn btn--ghost" href="/benchmarks/">The benchmark profile ${icon('arrow', 'icon icon--arrow')}</a></p>`,
})}

${section({ id: 'principles', cls: 'section--band', title: 'Design principles', lede: 'Each traces to an architecture decision record. ADR 0002 is accepted; ADRs 0003 to 0005 are proposed and may change.', body: cards(PRINCIPLES) })}

${section({
  id: 'integrations',
  title: 'Existing tools run as operators',
  body: `<div class="wrap--narrow" data-reveal><p class="lede">Ogun orchestrates the tools you already trust, in sandboxed processes with pinned versions, and plugs into the orchestrators you already run.</p><ul class="chips">${['DuckDB', 'dbt', 'Polars', 'Python', 'SQL', 'ffmpeg', 'pandoc', 'Tesseract', 'PaddleOCR', 'yt-dlp', 'rclone', 'git', 'Hugging Face', 'S3', 'Parquet', 'OpenLineage', 'MCP', 'A2A', 'Prefect', 'Dagster', 'Airflow', 'Kestra', 'Temporal', 'GitHub Actions'].map((t) => `<li>${t}</li>`).join('')}</ul><p class="small muted">Names belong to their owners and indicate planned compatibility, not endorsement.</p></div>`,
})}

${section({ id: 'faq', cls: 'section--band', title: 'Common questions', body: `<div class="wrap--narrow">${faqList(FAQ.filter((q) => ['what', 'status', 'airflow', 'reproducible', 'bench'].includes(q.id)))}<p class="center"><a class="btn btn--ghost" href="/faq/">All questions ${icon('arrow', 'icon icon--arrow')}</a></p></div>` })}

${ctaForge(cfg)}
`
  },
}
