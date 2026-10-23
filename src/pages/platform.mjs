import { architecturePlate, lineagePlate } from '../art/index.mjs'
import { METRICS, OPERATORS, RUN_STATES, TRIGGERS } from '../content.mjs'
import { SAMPLES } from './index.mjs'
import { answer, cards, checklist, codeTabs, ctaForge, figure, hl, note, pageHead, section, table } from '../parts.mjs'

const UPDATED = '2026-10-23'
const head = (path, name, title, lede) => pageHead({ crumbs: [{ name, path }], title, lede })

// ---------------------------------------------------------------- architecture
const architecture = {
  path: '/architecture/',
  order: 10,
  group: 'Platform',
  nav: 'Architecture',
  priority: 0.9,
  updated: UPDATED,
  title: 'Ogun architecture: runtime, engine, artifacts and trust',
  description: 'How Ogun is built: the ogund runtime, the embedded zeus-core engine, sandboxed operators, the content-addressed artifact store, and the Zeus session bridge.',
  crumbs: [{ name: 'Architecture', path: '/architecture/' }],
  article: { type: 'TechArticle', level: 'Expert', about: 'Software architecture of the Ogun data platform' },
  speakable: ['.answer-text'],
  body: (ctx) => `
${head('/architecture/', 'Architecture', 'How Ogun is built', 'Ogun is a separate process with its own state, built directly on the zeus-core engine. Browser sessions stay with Zeus; code runs out of process; everything is journaled.')}
<div class="wrap wrap--narrow">${answer({ title: 'The shape, in one paragraph', text: 'ogund is a local daemon that validates and runs workflow IR, schedules runs, executes operators in sandboxed child processes, and records artifacts and lineage in a content-addressed store. It embeds the zeus-core engine for transfers, with a session provider that always answers no. Clients (the ogun CLI, MCP, Studio, an A2A bridge) talk to ogund over one local endpoint. Sources behind a browser login are acquired by the Zeus daemon on Ogun’s behalf, over a service-client bridge.' })}</div>
${section({ id: 'diagram', title: 'Components', body: figure(architecturePlate(), 'V', 'Ogun on your machine, and the optional Zeus app beside it. Only zeusd ever holds browser sessions.') })}
${section({
  id: 'components',
  cls: 'section--band',
  title: 'What each component is responsible for',
  body: table({
    head: ['Component', 'Owns', 'Never does'],
    rows: [
      ['<code>ogund</code>', 'Workflow IR validation, run state machine, scheduler and triggers, approvals for its domain, the artifact store, lineage, the cost ledger', 'Hold browser cookies; run user code in-process; open a network listener'],
      ['zeus-core (embedded)', 'Segmented, resumable transfers; the journal and commit protocol; verification; filesystem safety; the artifact store format', 'Product policy, UI or configuration'],
      ['Operators', 'One unit of work each, in a sandboxed child process with declared inputs, outputs and network policy', 'See Ogun’s state directory or credentials they were not given'],
      ['<code>ogun</code> CLI and TUI', 'Plan, run, status, backfill; approvals on your terminal', 'Approve from a pipe or on an agent’s behalf'],
      ['MCP server', 'A small, hierarchical tool set for agents: create, validate, plan, run, inspect', 'Decide approvals, extend permissions, return credentials'],
      ['Ogun Studio (O4)', 'Runs, workflows, artifacts, lineage, datasets, agents, schedules, benchmarks, approval inbox', 'Hide the agent’s words inside approval facts'],
      ['A2A bridge (O4)', 'A workflow agent other agents can delegate to; off by default; localhost and token', 'Run inside the daemon'],
      ['Zeus session bridge', 'Session-gated acquisition through <code>zeusd</code> as a <code>service</code> client', 'Carry cookies to Ogun: files and provenance come back, secrets do not'],
    ],
  }),
})}
${section({
  id: 'boundaries',
  title: 'Trust boundaries',
  body: cards([
    { icon: 'lock', title: 'Sessions stay in Zeus', text: 'Ogun’s engine is built with a session provider and proxy-fetch port that always answer no. Browser-session sources go through zeusd, the only process that ever holds them.' },
    { icon: 'shield', title: 'Approvals are human-only', text: 'Approvals are bound to request hashes and decided only on trust surfaces (terminal, Studio). MCP, A2A and the scheduler can raise them, never answer them.' },
    { icon: 'crucible', title: 'Code runs outside', text: 'Python, shell, dbt and every external tool run in sandboxed child processes with declared filesystem and network access, never in ogund.' },
    { icon: 'gear', title: 'One local endpoint', text: 'ogund listens only on a local IPC endpoint. HTTP surfaces (MCP over HTTP, A2A) are separate bridge processes, off by default.' },
  ]),
})}
${section({
  id: 'decisions',
  cls: 'section--band',
  title: 'Decision records',
  body: table({
    head: ['Record', 'Decision', 'Status'],
    rows: [
      ['ADR 0002', 'Ogun is a separate product built on zeus-core; sessions only through zeusd as a service client; two GUIs; each product owns its LLM ladder, A2A and approvals', 'Accepted'],
      ['ADR 0003', 'The workflow IR is data, not code; every authoring layer compiles to it', 'Proposed'],
      ['ADR 0004', 'Integrate, do not replace: tools are operators; Ogun is embeddable in orchestrators', 'Proposed'],
      ['ADR 0005', 'Benchmark runs are a run profile with environments and evaluators', 'Proposed'],
      ['Zeus ADR 0011', 'zeus-core is shared with Ogun; Zeus keeps its consumer scope; the service client kind', 'Accepted'],
    ],
  }),
})}
${section({
  id: 'stack',
  title: 'Technology',
  body: `<div class="split split--top"><div data-reveal>${checklist(['Rust, edition 2024; unsafe code only in isolated, reviewed platform modules', 'tokio and rustls; HTTP/1.1 and HTTP/2', 'redb for the transfer journal', 'BLAKE3 and SHA-256; JCS (RFC 8785) for canonical hashing', 'JSON-RPC 2.0 over a local socket or named pipe as the single daemon contract', 'MCP via rmcp, targeting the stateless 2026-07-28 revision'])}</div><div data-reveal data-delay="120">${note('<p>Specifications come before code. Ogun’s contracts (O-00 to O-08) build on the Zeus specifications for conventions, the daemon API, approvals and the artifact store, so both products share one vocabulary.</p>', 'book')}</div></div>`,
})}
${ctaForge(ctx.cfg, { title: 'Disagree with a decision?', text: 'Write to info@vernesystems.com. The proposed records can still change, and the specifications that depend on them are not written yet.', primary: ['Ask for early access', '/get-started/'] })}`,
}

// ---------------------------------------------------------------- workflows
const workflows = {
  path: '/workflows/',
  order: 11,
  group: 'Platform',
  nav: 'Workflows',
  priority: 0.9,
  updated: UPDATED,
  title: 'Ogun workflows: a hashed IR, triggers, partitions, backfills',
  description: 'How Ogun workflows work: one JSON IR from YAML, Python or prompts; validation, plan diffs and approvals; the run state machine; triggers, partitions and backfills.',
  crumbs: [{ name: 'Workflows', path: '/workflows/' }],
  article: { type: 'TechArticle', level: 'Expert', about: 'Workflow intermediate representation and durable runs' },
  body: (ctx) => `
${head('/workflows/', 'Workflows', 'Workflows', 'A workflow is a versioned JSON document, not a program. Because it is data, it can be hashed, diffed, approved and exported.')}
${section({
  id: 'ir',
  title: 'The intermediate representation',
  lede: 'A DAG of nodes. Each node names an operator and version, its configuration, its inputs from upstream outputs, and its policy: retries, budgets, partitioning, triggers.',
  body: `<div class="split split--top"><div>${codeTabs('wf', SAMPLES)}</div><div data-reveal data-delay="120"><h3>Rules of the IR</h3>${checklist(['JSON, versioned, no floating-point numbers (rates are intervals in milliseconds; money is integer micro-dollars)', 'Workflow hash: BLAKE3 over the JCS form; approvals and runs bind to it', 'Expressions: Zeus’s template language (closed filter set) and a closed predicate set for routing', 'Code operators referenced by content hash; adding or changing one needs a human approval', 'Acquisition nodes reuse the Zeus plan vocabulary: sources, pagination, selectors, politeness, budgets'])}</div></div>`,
})}
${section({
  id: 'authoring',
  cls: 'section--band',
  title: 'Authoring',
  body: `${cards([
    { icon: 'yaml', title: 'YAML', text: 'Maps one to one onto the IR. Review it in a pull request like any other config.' },
    { icon: 'python', title: 'Python SDK', text: 'A builder: arbitrary Python at definition time, emitting IR. Nothing in the SDK runs at run time.' },
    { icon: 'agent', title: 'Natural language', text: 'Your agent drafts IR over MCP. The validator checks it, Ogun shows a plan diff, and you approve. Never prompt to shell.' },
  ])}${note('<p>Dynamic discovery is allowed, silent self-modification is not: if an agent finds new work mid-run, it proposes a plan amendment, which is a new workflow version and a new approval.</p>', 'compass')}`,
})}
${section({
  id: 'states',
  title: 'Run states',
  lede: 'Table-driven, like Zeus’s job state machine. Engine job states map onto node states, so a node waiting for a browser session says exactly that.',
  body: table({ head: ['State', 'Meaning'], rows: RUN_STATES.map(([s, m, c]) => [`<span class="state-dot ${c}"></span><code>${s}</code>`, m]) }),
})}
${section({
  id: 'triggers',
  cls: 'section--band',
  title: 'Triggers',
  body: table({ head: ['Kind', 'Examples', 'In words'], rows: TRIGGERS }),
})}
${section({
  id: 'partitions',
  title: 'Partitions and backfills',
  body: `<div class="split split--top"><div data-reveal><p class="lede">Declare a partition key, such as a date. Each partition succeeds, fails and retries on its own, and its status is part of the run record.</p><div class="code-block"><pre>${hl('sh', '$ ogun backfill noaa-daily --from 2020-01-01 --to 2026-10-05\n  2 470 partitions · 4 lanes · polite: 2 req/s/host\n  2020-01-03  failed  503 → retry_scheduled\n$ ogun status noaa-daily --partitions failed')}</pre></div></div><div data-reveal data-delay="120">${checklist(['“Acquire only what was not present in the last successful run”: built in, by content hash', '“Keep checking until the October release appears”: a data trigger with a deadline', 'Budgets per partition and per run: bytes, pages, files, time, model spend', 'Concurrency limits per host and per operator'])}</div></div>`,
})}
${ctaForge(ctx.cfg)}`,
}

// ---------------------------------------------------------------- operators
const opTable = (list) => table({ head: ['Operator', 'What it does'], rows: list.map(([o, d]) => [`<code>${o}</code>`, d]) })
const operators = {
  path: '/operators/',
  order: 12,
  group: 'Platform',
  nav: 'Operators',
  priority: 0.8,
  updated: UPDATED,
  title: 'Ogun operators: DuckDB, dbt, Python, OCR and LLM steps',
  description: 'The Ogun operator catalogue and ABI: core Rust operators, adapters for DuckDB, dbt, Python, ffmpeg and OCR, LLM operators, sandboxing and version pinning.',
  crumbs: [{ name: 'Operators', path: '/operators/' }],
  article: { type: 'TechArticle', level: 'Expert', about: 'Operator catalogue and operator ABI' },
  body: (ctx) => `
${head('/operators/', 'Operators', 'Operators', 'Operators are how Ogun does work. A few are native Rust; most are adapters around tools you already trust; the LLM ones are optional.')}
${section({ id: 'core', title: 'Core operators', lede: 'Written in Rust and built into the runtime, because they are small, called often and relevant to safety.', body: opTable(OPERATORS.core) })}
${section({ id: 'external', cls: 'section--band', title: 'Adapters for external tools', lede: 'Invoked as sandboxed processes with declared inputs and outputs. Versions are pinned and recorded in the lineage.', body: opTable(OPERATORS.external) })}
${section({ id: 'llm', title: 'LLM operators', lede: 'Bound to schemas and label sets, metered by a spend ledger, gated by budgets and approvals. A workflow without them never touches a model.', body: opTable(OPERATORS.llm) })}
${section({
  id: 'abi',
  cls: 'section--band',
  title: 'The operator ABI',
  lede: 'Specified in O-03. Every operator ships a manifest; Ogun refuses anything the manifest does not declare.',
  body: `<div class="split split--top"><div class="code-block" data-reveal><pre>${hl('json', `{
  "name": "pdf.extract",
  "version": "2.1.0",
  "inputs":  [{ "name": "pdf",  "media_type": "application/pdf" }],
  "outputs": [{ "name": "text", "media_type": "text/markdown" }],
  "determinism": "pure",
  "sandbox": { "network": "none", "fs": ["inputs:ro", "scratch:rw"], "memory_mb": 1024 },
  "invocation": { "protocol": "jsonl-stdio/0", "command": ["ogun-op-pdf"] },
  "code_hash": "blake3:…"
}`)}</pre></div><div data-reveal data-delay="120">${checklist(['Invocation: a process speaking JSON lines over stdio first; WASI components are being evaluated', 'Determinism class: pure, seeded or non-deterministic; it decides caching and replay', 'Sandbox profile: network, filesystem, CPU and memory; enforced, not advisory', 'Errors map onto typed classes, so retries and approvals behave predictably', 'Shell exists as a last resort and always needs approval'])}</div></div>`,
})}
${ctaForge(ctx.cfg)}`,
}

// ---------------------------------------------------------------- lineage
const lineage = {
  path: '/lineage/',
  order: 13,
  group: 'Platform',
  nav: 'Lineage',
  priority: 0.8,
  updated: UPDATED,
  title: 'Ogun lineage: content-addressed artifacts and provenance',
  description: 'How Ogun records lineage: content-addressed artifacts, assets and versions, provenance for every record, OpenLineage export and import from Zeus.',
  crumbs: [{ name: 'Lineage', path: '/lineage/' }],
  article: { type: 'TechArticle', level: 'Expert', about: 'Artifacts, content-addressed storage and lineage' },
  body: (ctx) => `
${head('/lineage/', 'Lineage', 'Artifacts and lineage', 'The primary object in Ogun is neither the URL nor the file. It is the run and the artifact graph.')}
${section({ id: 'graph', title: 'The artifact graph', body: figure(lineagePlate(), 'IV', 'Hover a node to trace its ancestry and descendants.') })}
${section({
  id: 'model',
  cls: 'section--band',
  title: 'Artifacts, assets and runs',
  body: cards([
    { icon: 'cube', title: 'Artifact', text: 'Immutable. An art_ id, SHA-256 and BLAKE3, size, media type, time, source, licence (unknown allowed), parents, producing operation, run and verification state.' },
    { icon: 'drawers', title: 'Asset', text: 'A logical object with versions: “WHO surveillance dataset” at 2026-09-01, 09-08, 09-15. Each version points at artifacts.' },
    { icon: 'dag', title: 'Run', text: 'One execution: node instances, artifact edges, checkpoints, retries, events, costs. The run is what makes an artifact explainable.' },
  ]),
})}
${section({
  id: 'cas',
  title: 'Content-addressed storage',
  body: `<div class="split split--top"><div class="code-block" data-reveal><pre>${hl('sh', 'objects/\n  blake3/\n    41/\n      d0/\n        41d0…7c3e      # one copy, however many projects use it\nworkspaces/\n  climate/papers.parquet -> objects/blake3/…')}</pre></div><div data-reveal data-delay="120">${checklist(['Download the same 20 GB model twice: stored once', 'Transformed datasets share their unchanged parts', 'Ingestion is temp file, fsync, atomic rename: crash-safe and idempotent', 'The format is a zeus-core library (Zeus spec 13), so a file Zeus acquired can be imported with its hash and provenance intact', 'Later: chunk-level storage and content-defined chunking'])}</div></div>`,
})}
${section({
  id: 'export',
  cls: 'section--band',
  title: 'Export formats',
  body: table({
    head: ['Export', 'What you get'],
    rows: [
      ['OpenLineage', 'Run, job and dataset events your existing lineage tools understand'],
      ['W3C PROV', 'Entities, activities and agents, through the provenance manifest'],
      ['Croissant', 'Dataset metadata for ML, through the manifest export'],
      ['Parquet and JSONL', 'The artifact ledger itself, for your own analysis'],
    ],
  }),
})}
${ctaForge(ctx.cfg)}`,
}

// ---------------------------------------------------------------- benchmarks
const benchmarks = {
  path: '/benchmarks/',
  order: 14,
  group: 'Platform',
  nav: 'Benchmarks',
  priority: 0.9,
  updated: UPDATED,
  title: 'Ogun benchmarks: Spider 2.0-DBT, ADE-bench, Harbor tasks',
  description: 'Ogun’s benchmark profile for data and terminal agents: isolated environments, unmodified evaluators, trajectories, cost per success, harness gain and tool ablation.',
  crumbs: [{ name: 'Benchmarks', path: '/benchmarks/' }],
  article: { type: 'TechArticle', level: 'Expert', about: 'Benchmarking AI agents on data and terminal tasks' },
  speakable: ['.answer-text'],
  body: (ctx) => `
${head('/benchmarks/', 'Benchmarks', 'Benchmark profile', 'In normal use, Ogun tries to finish the task. In a benchmark run it switches that help off, so the score measures the agent under test.')}
<div class="wrap wrap--narrow">${answer({ title: 'In short', text: 'Ogun runs benchmark tasks for data and terminal agents (Spider 2.0-DBT, ADE-bench, Terminal-Bench 2.0 in the Harbor format) as ordinary runs with an environment and an evaluator. A benchmark profile switches off Ogun’s helpful behaviour, isolates every run, records a replayable trajectory, and reports cost, efficiency and recovery alongside the official score.' })}</div>
${section({
  id: 'model',
  title: 'A benchmark is a set of runs',
  body: `<p class="formula" data-reveal>Run = Workflow + Environment + Agent + Policy + Inputs + Evaluator</p>${cards([
    { icon: 'matrix', title: 'Benchmarks', text: 'Spider 2.0-DBT (68 DuckDB and dbt tasks), ADE-bench (dbt Labs), Terminal-Bench 2.0 via Harbor, and your private tasks. Adapters read the existing formats.' },
    { icon: 'agent', title: 'Agents', text: 'Claude Code, Codex, OpenCode, Gemini CLI, a custom MCP agent, or a raw model with a tool loop, behind one adapter interface.' },
    { icon: 'balance', title: 'Evaluators', text: 'Official graders, run unmodified, with their version recorded next to the score.' },
  ])}`,
})}
${section({
  id: 'isolation',
  cls: 'section--band',
  title: 'Isolation',
  body: `<div class="split split--top"><div data-reveal>${table({ head: ['Setting', 'Default in the benchmark profile'], rows: [['Environment', 'Immutable image, fixture, task repository, agent binary, tool policy; containers first, microVMs later'], ['Network', 'Denied unless the benchmark allows it'], ['Filesystem', '/workspace read-write · /benchmark read-only · everything else hidden'], ['Secrets', 'Model credentials only'], ['Memory and session', 'Fresh for every run'], ['Cache mode', 'disabled · benchmark_provided · cold · warm (explicit)'], ['Ogun help', 'No auto-repair, no extra retries, no other agents'], ['Off limits', 'Your artifact stores, zeusd, browser sessions']] })}</div><div data-reveal data-delay="120"><h3>Trajectories</h3><div class="code-block"><pre>${hl('json', '{"t":0.0,"type":"task.started"}\n{"t":1.2,"type":"model.request","tokens_in":5312}\n{"t":3.8,"type":"tool.shell","cmd":"dbt test"}\n{"t":7.2,"type":"tool.result","exit":1}\n{"t":8.1,"type":"file.read","path":"models/orders.sql"}\n{"t":10.4,"type":"file.patch","path":"models/orders.sql"}')}</pre></div><p class="muted">Replay any run step by step: prompt, tool call, output, diff and database state.</p></div></div>`,
})}
${section({
  id: 'metrics',
  title: 'Metrics',
  body: `<div class="metrics" data-reveal>${METRICS.map(([n, f, d]) => `<div class="metric"><h3>${n}</h3><p class="formula">${f}</p><p>${d}</p></div>`).join('')}</div>`,
})}
${section({
  id: 'research',
  cls: 'section--band',
  title: 'Research questions',
  body: `<div class="wrap--narrow" data-reveal><p class="lede">Hold the model fixed and vary the harness: shell only, shell plus structured database tools, MCP data tools, Ogun’s workflow and artifact tools. Harness gain averages the difference across models. Tool ablation removes one affordance at a time. Both need exactly what Ogun records anyway: controlled environments, trajectories and costs.</p>${note('<p>No results yet. Ogun is in its contracts phase; the benchmark profile is phase O3. We will publish methods before numbers.</p>', 'hourglass')}</div>`,
})}
${section({
  id: 'prior',
  title: 'Prior art',
  body: table({ head: ['Project', 'What it is', 'How Ogun relates'], rows: [['Harbor', 'The task format and harness Terminal-Bench 2.0 ships in', 'Read Harbor tasks through an adapter'], ['ADE-bench harness', 'dbt Labs’ runner for analytics and data-engineering tasks', 'Run its tasks; use its graders unmodified'], ['Spider 2.0 framework', 'The agent framework published with Spider 2.0', 'Run Spider2-DBT tasks with the official evaluation'], ['Inspect', 'A general framework for evaluating language models', 'Complementary; export trajectories and scores']] }),
})}
${ctaForge(ctx.cfg, { title: 'Tell us what to support', text: 'If you build or evaluate coding and data agents, tell us which benchmarks and agents you use. That decides which adapters are built first.', primary: ['Ask for early access', '/get-started/'] })}`,
}

// ---------------------------------------------------------------- security model
const security = {
  path: '/security-model/',
  order: 15,
  group: 'Platform',
  nav: 'Security model',
  priority: 0.7,
  updated: UPDATED,
  title: 'Ogun security model: sessions, sandboxes, approvals, secrets',
  description: 'Ogun’s security model: no browser cookies in Ogun, sandboxed operators, human-only approvals bound to hashes, secrets kept out of logs and prompts.',
  crumbs: [{ name: 'Security model', path: '/security-model/' }],
  article: { type: 'TechArticle', level: 'Expert', about: 'Threat model and security invariants of Ogun' },
  body: (ctx) => `
${head('/security-model/', 'Security model', 'Security model', 'Ogun runs code, calls models and can reach logged-in sources. The design assumes any agent, page or operator might be wrong or hostile, and limits what each can do.')}
${section({
  id: 'invariants',
  title: 'Invariants',
  lede: 'Statements the implementation must keep true, each with a test.',
  body: table({ head: ['Invariant', 'How it holds'], rows: [
    ['Ogun never holds browser session material', 'Its engine is built with a null session provider; logged-in sources go through zeusd as a service client'],
    ['No agent-reachable path can approve', 'Approvals are decided only on trust surfaces; MCP and A2A can raise, never answer'],
    ['Approvals bind to exact facts', 'Request hash over the JCS facts; a changed workflow or budget needs a new approval'],
    ['Code never runs in the daemon', 'Every operator is a sandboxed child process with a declared profile'],
    ['Secrets never reach logs, events, lineage, errors or prompts', 'Zeroizing types, no serialization of secret types, URL redaction, canary-based leak tests'],
    ['Benchmark runs are sealed', 'Network denied by default; no access to stores, zeusd or sessions'],
    ['The daemon has one local endpoint', 'No network listener; HTTP surfaces are separate bridges, off by default'],
  ] }),
})}
${section({
  id: 'threats',
  cls: 'section--band',
  title: 'Threats considered',
  body: cards([
    { icon: 'agent', title: 'Prompt injection', text: 'Text from pages and files is data, labelled untrusted. It cannot approve, widen budgets, change allowed domains or reach a secret.' },
    { icon: 'crucible', title: 'Malicious operators', text: 'Pinned by content hash, reviewed on change, sandboxed at run time. A new or changed code hash is a plan diff a person must approve.' },
    { icon: 'database', title: 'Data poisoning', text: 'Lineage shows exactly which source and operator produced a record, so contaminated outputs can be traced and rolled back by version.' },
    { icon: 'lock', title: 'Credential theft', text: 'Data-source credentials stay local and zeroized; browser sessions never enter Ogun at all.' },
    { icon: 'balance', title: 'Runaway spend', text: 'Budgets for bytes, time and model spend; going over needs a person.' },
    { icon: 'shield', title: 'Supply chain', text: 'Dependency allow-lists, pinned operators, and signed releases planned for 1.0.' },
  ]),
})}
${section({ id: 'report', title: 'Reporting a vulnerability', body: `<div class="wrap--narrow" data-reveal><p class="lede">Please tell us privately first. Our <a href="/legal/security/">security policy</a> explains scope, response times and safe harbour; <a href="/.well-known/security.txt">security.txt</a> has the contact.</p></div>` })}
${ctaForge(ctx.cfg)}`,
}

export default [architecture, workflows, operators, lineage, benchmarks, security]
