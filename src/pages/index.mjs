import { esc } from '../../lib/html.mjs'
import { acquirePlate, heroPlate, icon, lineagePlate, pipelinePlate, STAGES } from '../art/index.mjs'
import { FAQ, METRICS, PRINCIPLES } from '../content.mjs'
import { answer, cards, codeTabs, ctaForge, faqList, figure, hl, section, table } from '../parts.mjs'

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
      <p class="eyebrow">For AI, LLM and data engineers</p>
      <h1 id="hero-title"><span class="line">Forge raw sources into</span><span class="line line--2"><em>reproducible datasets.</em></span></h1>
      <p class="lede">Ogun is a local-first runtime for data acquisition, transformation and agent benchmarks, built on the Zeus engine. Workflows are data. Runs survive crashes. Every artifact carries its lineage.</p>
      <div class="btn-row"><a class="btn btn--ember" href="/architecture/">Read the architecture ${icon('arrow', 'icon icon--arrow')}</a><a class="btn btn--ghost" href="/get-started/">Get early access</a></div>
      <div class="cmd" aria-label="Planned command"><span class="prompt" aria-hidden="true">$</span><code id="hero-cmd">ogun backfill noaa-daily --from 2020-01 --to 2026-10</code><button class="copy-btn" type="button" data-copy="hero-cmd">${icon('copy')}<span class="copy-label">copy</span></button></div>
      <p class="small muted">Planned CLI. Contracts phase: specs first, runtime next.</p>
    </div>
    <div class="hero-figure" data-spinup>
      <div class="plate-wrap">${heroPlate()}<canvas class="sparks" aria-hidden="true"></canvas><button class="hero-strike-btn" type="button" aria-label="Strike the anvil: plays a short animation"></button></div>
      <span class="plate-hint" aria-hidden="true">click to strike · hover to spin up</span>
    </div>
  </div>
</section>

<section class="section section--tight" aria-label="Summary"><div class="wrap wrap--narrow">${answer({
      title: 'What is Ogun?',
      text: 'Ogun is a developer platform that turns authenticated, messy web and filesystem sources into verified, reproducible datasets on a schedule, and runs benchmark tasks for data and terminal agents in isolation. Workflows are a hashed JSON IR; operators like DuckDB, dbt and OCR run sandboxed; every output is a content-addressed artifact with full lineage. Made by Verne, built on the Zeus engine, Apache-2.0.',
      facts: [
        ['Made by', `<a href="${cfg.org.url}">Verne Systems</a>, Dhaka`],
        ['Engine', 'zeus-core (Rust), embedded'],
        ['Interfaces', 'CLI, MCP, Studio (later), A2A (later)'],
        ['License', 'Apache-2.0, no telemetry'],
        ['Status', esc(cfg.status)],
      ],
    })}</div></section>

${section({
  id: 'lifecycle',
  eyebrow: 'The lifecycle',
  title: 'Acquire to publish, <em>durable at every step</em>',
  lede: 'Eight stages, one run, one lineage graph. Hover a station, or let the line run.',
  body: `<div class="pipeline" data-pipeline data-reveal>${pipelinePlate()}<div class="stage-panel" aria-live="polite"></div><script type="application/json">${JSON.stringify(STAGES)}</script></div>`,
})}

${section({
  id: 'ir',
  cls: 'section--band',
  eyebrow: 'Workflows are data',
  title: 'Write it four ways. <em>Run one IR.</em>',
  lede: 'YAML, a Python SDK, or a prompt drafted by your agent: everything compiles to the same JSON intermediate representation, which is validated, hashed, diffed and approved before it runs.',
  body: `<div class="split split--top"><div>${codeTabs('ir', SAMPLES)}<p class="small muted">Illustrative. The IR specification (O-02) is being written; syntax will change.</p></div><div data-reveal data-delay="120"><h3>Why data, not code</h3><ul class="checklist"><li>${icon('check')}<span>No floating-point numbers, so the JCS + BLAKE3 hash is stable and can bind an approval.</span></li><li>${icon('check')}<span>Expressions are a closed template and predicate set: no loops, calls or I/O in the IR.</span></li><li>${icon('check')}<span>Code lives in operators, pinned by content hash; adding or changing one needs your approval.</span></li><li>${icon('check')}<span>Prompt to IR to validator to plan diff to approval to runtime. Never prompt to shell.</span></li></ul><a class="btn btn--ghost" href="/workflows/">How workflows work ${icon('arrow', 'icon icon--arrow')}</a></div></div>`,
})}

${section({
  id: 'run',
  eyebrow: 'A run, live',
  title: 'Every node has a state. <em>Every state is honest.</em>',
  lede: 'A preview of Ogun Studio. The run retries a flaky mirror, resumes mid-file, and stops at a budget gate until a person decides.',
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
  eyebrow: 'Durability',
  title: 'kill -9 is <em>a pause</em>, not a restart',
  lede: 'Partitions commit independently to a journal. Kill the daemon mid-backfill and it resumes only what was unfinished: nothing is fetched twice.',
  body: `<div class="split split--top"><div class="backfill" data-backfill data-reveal><div class="backfill-head"><code>noaa-daily</code><span>monthly partitions · 2020-01 → 2026-10</span></div><div class="grid-cells" role="img" aria-label="Partition status grid">${'<i></i>'.repeat(82)}</div><div class="backfill-legend"><span class="l-ok">succeeded</span><span class="l-run">running</span><span class="l-retry">retrying</span><span class="l-fail">failed</span><span>pending</span></div><p class="backfill-status" aria-live="polite"></p><div class="backfill-actions"><button class="btn btn--small btn--ghost bf-start" type="button">Run again</button><button class="btn btn--small btn--ember bf-kill" type="button">kill -9 ogund</button></div></div>
<div data-reveal data-delay="120"><h3>What makes it hold</h3><ul class="checklist"><li>${icon('check')}<span>Transfers resume from the Zeus engine’s journal, byte-exact, after checking validators.</span></li><li>${icon('check')}<span>Node instances checkpoint; artifact edges are committed before a node is marked succeeded.</span></li><li>${icon('check')}<span>Each partition is its own unit of success, failure and retry.</span></li><li>${icon('check')}<span>The phase O1 exit test is exactly this: a partitioned backfill surviving kill -9.</span></li></ul></div></div>`,
})}

${section({
  id: 'acquire',
  eyebrow: 'Acquisition',
  title: 'The engine underneath is <em>Zeus</em>',
  body: `<div class="split">${figure(acquirePlate(), 'II', 'The windlass raises ore from the shaft. Ogun embeds the zeus-core engine for the same job.')}<div data-reveal data-delay="120"><p class="lede">Ogun embeds zeus-core, the Rust engine behind the Zeus app: segmented transfers, a crash-safe journal, validator checks before every resume, SHA-256 and BLAKE3 verification, and polite defaults.</p><p class="muted">Sources behind your browser login are the one exception: Ogun never holds cookies. It asks the Zeus daemon, as a service client, to acquire them, and imports the result with its provenance.</p><a class="btn btn--ghost" href="/architecture/">See the architecture ${icon('arrow', 'icon icon--arrow')}</a></div></div>`,
})}

${section({
  id: 'lineage',
  cls: 'section--band',
  eyebrow: 'Lineage',
  title: 'Which model wrote <em>this row</em>?',
  lede: 'Every artifact is content-addressed and knows its parents. Hover a node to trace where it came from and what it became.',
  body: `${figure(lineagePlate(), 'IV', 'Two PDFs, one scanned, become one versioned corpus. Every edge names the operator that made it.', 'figure--wide')}
<div class="split split--top section-split"><div class="code-block" data-reveal><button class="copy-btn" type="button" data-copy="prov">${icon('copy')}<span class="copy-label">copy</span></button><pre id="prov">${hl('json', PROV)}</pre></div><div data-reveal data-delay="120"><h3>Questions it answers</h3><ul class="checklist"><li>${icon('check')}<span>Which raw file, site and run produced this record?</span></li><li>${icon('check')}<span>Which model and prompt hash generated this field?</span></li><li>${icon('check')}<span>What was fetched with authenticated access?</span></li><li>${icon('check')}<span>Has the upstream source changed since?</span></li><li>${icon('check')}<span>Can dataset version v18 be reproduced, exactly?</span></li></ul><a class="btn btn--ghost" href="/lineage/">Artifacts and lineage ${icon('arrow', 'icon icon--arrow')}</a></div></div>`,
})}

${section({
  id: 'bench',
  eyebrow: 'Benchmarks',
  title: 'Measure the agent, <em>not the harness</em>',
  lede: 'A benchmark is a controlled set of runs: workflow, environment, agent, policy, inputs, evaluator. Ogun reads existing task formats and adds what leaderboards leave out.',
  body: `${table({ caption: 'Planned first matrix (no results yet)', head: ['Benchmark', 'Claude Code', 'Codex', 'OpenCode', 'Your agent'], rows: [['Spider 2.0-DBT', 'planned', 'planned', 'planned', 'planned'], ['ADE-bench', 'planned', 'planned', 'planned', 'planned'], ['Terminal-Bench 2.0 (Harbor)', 'planned', 'planned', 'planned', 'planned'], ['Your private tasks', 'planned', 'planned', 'planned', 'planned']].map((r) => r.map((c, i) => (i ? `<span class="mono">${c}</span>` : c))), cls: 'matrix' })}
<div class="metrics" data-reveal>${METRICS.slice(0, 3)
    .concat(METRICS.slice(5, 6))
    .map(([n, f, d]) => `<div class="metric"><h3>${n}</h3><p class="formula">${f}</p><p>${d}</p></div>`)
    .join('')}</div><p class="center"><a class="btn btn--ghost" href="/benchmarks/">The benchmark profile ${icon('arrow', 'icon icon--arrow')}</a></p>`,
})}

${section({ id: 'principles', cls: 'section--band', eyebrow: 'Principles', title: 'Six <em>decisions</em>, written down', lede: 'Each is an architecture decision record, so it can be read, challenged and held to.', body: cards(PRINCIPLES) })}

${section({
  id: 'integrations',
  eyebrow: 'Integrate, do not replace',
  title: 'Your tools, as <em>operators</em>',
  body: `<div class="wrap--narrow" data-reveal><p class="lede">Ogun orchestrates the tools you already trust, in sandboxed processes with pinned versions, and plugs into the orchestrators you already run.</p><ul class="chips">${['DuckDB', 'dbt', 'Polars', 'Python', 'SQL', 'ffmpeg', 'pandoc', 'Tesseract', 'PaddleOCR', 'yt-dlp', 'rclone', 'git', 'Hugging Face', 'S3', 'Parquet', 'OpenLineage', 'MCP', 'A2A', 'Prefect', 'Dagster', 'Airflow', 'Kestra', 'Temporal', 'GitHub Actions'].map((t) => `<li>${t}</li>`).join('')}</ul><p class="small muted">Names belong to their owners and indicate planned compatibility, not endorsement.</p></div>`,
})}

${section({ id: 'faq', cls: 'section--band', eyebrow: 'Questions', title: 'Asked <em>first</em>', body: `<div class="wrap--narrow">${faqList(FAQ.filter((q) => ['what', 'status', 'airflow', 'reproducible', 'bench'].includes(q.id)))}<p class="center"><a class="btn btn--ghost" href="/faq/">All questions ${icon('arrow', 'icon icon--arrow')}</a></p></div>` })}

${ctaForge(cfg)}
`
  },
}
