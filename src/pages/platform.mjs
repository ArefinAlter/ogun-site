import { architecturePlate, lineagePlate } from '../art/index.mjs'
import { METRICS, OPERATORS, RUN_STATES, TRIGGERS } from '../content.mjs'
import { SAMPLES } from './index.mjs'
import { between, CAPTURED, MCP_TOOLS, OPERATORS as OPS, text } from '../captures.mjs'
import { answer, cards, checklist, codeTabs, ctaForge, figure, hl, note, pageHead, section, table, term } from '../parts.mjs'

const UPDATED = '2026-10-26'
const ART_OF = { '/workflows/': 'forge-smithy', '/operators/': 'forge-slab', '/benchmarks/': 'forge-mill-wide', '/security-model/': 'forge-slab' }
const head = (path, name, title, lede) => pageHead({ crumbs: [{ name, path }], title, lede, art: ART_OF[path] || 'forge-night' })

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
<div class="wrap wrap--narrow">${answer({ title: 'The shape, in one paragraph', text: 'ogund is a local daemon that validates and runs workflow IR, schedules runs, executes operators in sandboxed child processes, and records artifacts and lineage in a content-addressed store. It embeds the zeus-core engine for transfers, with a session provider that always answers no. Clients (the ogun CLI, the MCP server, Studio) talk to ogund over one local endpoint; an A2A bridge is planned. Sources behind a browser login are acquired by the Zeus daemon on Ogun’s behalf, over a service-client bridge.' })}</div>
${section({ id: 'diagram', title: 'Components', body: figure(architecturePlate(), 'Ogun on your machine, and the optional Zeus app beside it. Only zeusd ever holds browser sessions.') })}
${section({
  id: 'components',
  cls: 'section--band',
  title: 'What each component is responsible for',
  body: table({
    head: ['Component', 'Owns', 'Never does'],
    rows: [
      ['<code>ogund</code>', 'Workflow IR validation, run state machine, scheduler and triggers, approvals for its domain, the artifact store, lineage, the cost ledger', 'Hold browser cookies; run user code in-process; open a network listener (ogun-server, a separate process, is the hub’s listener)'],
      ['zeus-core (embedded)', 'Segmented, resumable transfers; the journal and commit protocol; verification; filesystem safety; the artifact store format', 'Product policy, UI or configuration'],
      ['Operators', 'One unit of work each. Core operators run inside ogund; adapters, code and model operators run in a child process with declared inputs, outputs and network policy, sandboxed with bubblewrap on Linux (none yet on Windows)', 'See Ogun’s state directory or credentials they were not given'],
      ['<code>ogun</code> CLI', 'validate, hash, diff, put, run, backfill, partition-status, show; approvals on your terminal', 'Approve from a pipe or on an agent’s behalf'],
      ['MCP server (<code>ogun mcp</code>)', 'Sixteen tools over stdio: validate, diff, plan a backfill and list operators without a daemon; store workflows, start runs and read status, partitions, approvals and streams with one', 'Decide approvals, extend permissions, return credentials'],
      ['Ogun Studio', 'Overview, workflows, runs, partitions, approvals, artifacts and lineage, streams, edges, connectors and an agent screen; desktop for Windows and Linux, and Studio-web served by ogun-server', 'Hide the agent’s words inside approval facts'],
      ['A2A bridge (planned)', 'A workflow agent other agents can delegate to; off by default; localhost and token', 'Run inside the daemon'],
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
    { icon: 'crucible', title: 'Code runs outside', text: 'Python, shell, dbt and every external tool run in child processes with declared filesystem and network access, never in ogund. The sandbox is bubblewrap on Linux and sandbox-exec on macOS; Windows has none yet.' },
    { icon: 'gear', title: 'One local endpoint', text: 'ogund listens only on a local IPC endpoint: a Unix socket or a named pipe. HTTP surfaces (ogun-server for a hub, MCP over HTTP, A2A) are separate bridge processes.' },
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
      ['ADR 0003', 'The workflow IR is data, not code; every authoring layer compiles to it', 'Accepted'],
      ['ADR 0004', 'Integrate, do not replace: tools are operators; Ogun is embeddable in orchestrators', 'Accepted'],
      ['ADR 0005', 'Benchmark runs are a run profile with environments and evaluators', 'Accepted'],
      ['ADR 0007', 'Continuous streams are windowed partitions', 'Accepted'],
      ['ADR 0009 and 0010', 'The platform support matrix (O-12); a self-hosted server mode with OIDC and roles', 'Accepted'],
      ['ADR 0013 and 0014', 'Connectors are manifests that hold names, never secrets; agent threads over a closed tool set', 'Proposed'],
      ['Zeus ADR 0011', 'zeus-core is shared with Ogun; Zeus keeps its consumer scope; the service client kind', 'Accepted'],
    ],
  }),
})}
${section({
  id: 'stack',
  title: 'Technology',
  body: `<div class="split split--top"><div data-reveal>${checklist(['Rust, edition 2024; unsafe code only in isolated, reviewed platform modules', 'tokio and rustls; HTTP/1.1 and HTTP/2', 'redb for the run store and the engine’s transfer journal', 'BLAKE3 and SHA-256; JCS (RFC 8785) for canonical hashing', 'JSON-RPC 2.0 over a Unix socket or named pipe as the single daemon contract (O-15)', 'MCP over stdio, written in the ogun CLI (protocol revision 2025-06-18)'])}</div><div data-reveal data-delay="120">${note('<p>Specifications come before code. Ogun’s contracts (O-00 to O-17, all drafts) build on the Zeus specifications for conventions, the daemon API, approvals and the artifact store, so both products share one vocabulary.</p>', 'book')}</div></div>`,
})}
${ctaForge(ctx.cfg, { title: 'Disagree with a decision?', text: 'Write to info@vernesystems.com. The records are accepted, and the specifications are drafts that feedback can still change.', primary: ['Try the pre-alpha', '/get-started/'] })}`,
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
  description: 'How Ogun workflows work: one JSON IR, validated, hashed and diffed; approvals; the run state machine; triggers, partitions and backfills, with real output.',
  crumbs: [{ name: 'Workflows', path: '/workflows/' }],
  article: { type: 'TechArticle', level: 'Expert', about: 'Workflow intermediate representation and durable runs' },
  body: (ctx) => `
${head('/workflows/', 'Workflows', 'Workflows', 'A workflow is a versioned JSON document, not a program. Because it is data, it can be hashed, diffed, approved and exported.')}
${section({
  id: 'ir',
  title: 'The intermediate representation',
  lede: 'A DAG of nodes. Each node names an operator and version, its configuration, its inputs from upstream outputs, and its policy. Triggers, partitions and budgets belong to the workflow.',
  body: `<div class="split split--top"><div>${codeTabs('wf', SAMPLES)}</div><div data-reveal data-delay="120"><h3>Rules of the IR</h3>${checklist(['JSON, versioned, no floating-point numbers (rates are intervals in milliseconds; money is integer micro-dollars)', 'Workflow hash: BLAKE3 over the JCS form; approvals and runs bind to it', 'Expressions: a closed template set and a closed predicate set for routing', 'Code operators referenced by content hash; adding or changing one needs a human approval', 'The workflow hash is 64 lowercase hex characters, printed by ogun validate and ogun hash', 'Acquisition nodes name their sources and allowed domains in config; budgets are bytes, files, wall_ms and llm_usd_micro'])}</div></div>`,
})}
${section({
  id: 'authoring',
  cls: 'section--band',
  title: 'Authoring',
  body: `${cards([
    { icon: 'ledger', title: 'JSON, today', text: 'The IR is the authoring format in this release. The VS Code extension and the language server (ogun lsp) give diagnostics, hover, completion and the workflow hash as you type.' },
    { icon: 'agent', title: 'Your agent, over MCP', text: 'An agent drafts IR and calls ogun_validate and ogun_diff; the plan diff names what needs a person. Never prompt to shell.' },
    { icon: 'python', title: 'YAML and a Python SDK, planned', text: 'Both are meant to compile to the same IR, so they add no new way to reach the runtime. Neither is built yet.' },
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
  lede: 'IR v0 has four trigger kinds. The rest are in the design and not built.',
  body: table({ head: ['Kind', 'What it does', 'Status'], rows: TRIGGERS }),
})}
${section({
  id: 'partitions',
  title: 'Partitions and backfills',
  body: `<div class="split split--top"><div data-reveal><p class="lede">Declare a partition key: a day or a month, a static list of keys, or a stream window. Each partition succeeds, fails and retries on its own, and its status is part of the run record. A backfill plans first and starts only with <code>--yes</code>.</p><div class="code-block"><pre>${term(between(text('exit-backfill.txt'), '$ ogun backfill', '# ogund killed'))}</pre></div><p class="small muted">Real output, ${CAPTURED}. The full transcript is on the <a href="/#durable">home page</a>.</p></div><div data-reveal data-delay="120">${checklist(['Partitions already complete for the same workflow hash are up to date and are skipped; <code>--force</code> runs them again', 'Range-compressed status: <code>ogun partition-status</code> prints done, running and missing ranges, not one line per key', 'Budgets on the workflow: bytes, files, wall_ms and llm_usd_micro. Only model spend is enforced today', 'Concurrency and retries per node in <code>policy</code>'])}</div></div>`,
})}
${ctaForge(ctx.cfg)}`,
}

// ---------------------------------------------------------------- operators
const MANIFEST = JSON.stringify(
  {
    name: 'tesseract',
    version: '1.0.0',
    kind: 'adapter',
    inputs: [{ name: 'inputs' }],
    outputs: [{ name: 'text', media_type: 'text/plain' }],
    determinism: 'pure',
    sandbox: { network: 'none', fs: ['inputs:ro', 'scratch:rw'], memory_bytes: 4294967296, cpu_ms: 14400000 },
    invocation: { protocol: 'jsonl-stdio/0', command: ['ogun-op-shim', 'tesseract'] },
    config_schema: {
      type: 'object',
      properties: {
        lang: { type: 'string', pattern: '^[A-Za-z_]+(\\+[A-Za-z_]+)*$', maxLength: 128 },
        psm: { type: 'integer', minimum: 0, maximum: 13 },
        dpi: { type: 'integer', minimum: 72, maximum: 1200 },
      },
      additionalProperties: false,
    },
    tools: [{ any_of: ['tesseract'], optional: false }, { any_of: ['pdftoppm'], optional: true }],
  },
  null,
  2,
)
const opTable = (list) => table({ head: ['Operator', 'Outputs', 'What it does'], rows: list.map(([o, out, d]) => [`<code>${o}</code>`, `<code>${out}</code>`, d]) })
const operators = {
  path: '/operators/',
  order: 12,
  group: 'Platform',
  nav: 'Operators',
  priority: 0.8,
  updated: UPDATED,
  title: 'Ogun operators: DuckDB, dbt, Python, OCR and LLM steps',
  description: 'The Ogun operator catalogue and ABI: 42 operators, from core Rust operators and adapters for DuckDB and OCR to code, stream and LLM operators, run out of process.',
  crumbs: [{ name: 'Operators', path: '/operators/' }],
  article: { type: 'TechArticle', level: 'Expert', about: 'Operator catalogue and operator ABI' },
  body: (ctx) => `
${head('/operators/', 'Operators', 'Operators', 'Operators are how Ogun does work. Fourteen are native Rust; most of the rest wrap tools you already trust; the LLM ones are optional. The list below is the catalogue that ogun validate checks against, read from the ogun 0.0.1-alpha binary.')}
${section({ id: 'core', title: 'Core operators', lede: 'Written in Rust and built into ogund, because they are small, called often and relevant to safety.', body: opTable(OPERATORS.core) })}
${section({ id: 'external', cls: 'section--band', title: 'Adapters for external tools', lede: 'Child processes with declared inputs and outputs; versions are pinned and recorded in the lineage. The tools themselves (DuckDB, pdftotext, Tesseract and so on) must be installed where ogund runs: the release does not bundle them.', body: opTable(OPERATORS.adapter) })}
${section({ id: 'code', title: 'Code operators', lede: 'Your code or script, referenced by BLAKE3 hash. A new or changed hash is a plan diff that needs a person. They run in a bubblewrap sandbox on Linux; Windows has none yet, so they are refused there unless allow_unsandboxed is set.', body: opTable(OPERATORS.code) })}
${section({ id: 'source', cls: 'section--band', title: 'Stream sources', lede: 'Sensor readings sealed into event-time windows, which are partitions (ADR 0007). Fed by the ingest bridge, unit-tested and not yet run against real brokers or devices.', body: opTable(OPERATORS.source) })}
${section({ id: 'llm', title: 'LLM operators', lede: 'Bound to schemas and label sets, metered by a spend ledger, gated by budgets and approvals. A workflow without them never touches a model.', body: opTable(OPERATORS.llm) })}
${section({
  id: 'abi',
  cls: 'section--band',
  title: 'The operator ABI',
  lede: 'Specified in O-03. Every operator ships a manifest; Ogun refuses anything the manifest does not declare.',
  body: `<div class="split split--top"><div data-reveal><div class="code-block"><pre>${hl('json', MANIFEST)}</pre></div><p class="small muted">The <code>tesseract</code> manifest as compiled into ogund 0.0.1-alpha (<code>crates/ogun-ops/src/builtin.rs</code>). A manifest installed as <code>tesseract.manifest.json</code> replaces it, but may not change its kind or drop an output.</p></div><div data-reveal data-delay="120">${checklist(['Invocation: JSON lines over stdio (<code>jsonl-stdio/0</code>); WASI components are being evaluated', 'Determinism class: pure, seeded or non-deterministic, recorded with the operator', 'Sandbox profile: network, filesystem, CPU and memory, enforced where a sandbox exists. A manifest that asks for a network allowlist is refused, not run with more network than it declares', 'Errors map onto typed codes (<code>op.integrity</code>, <code>op.sandbox_violation</code> and so on), so retries and approvals behave predictably', 'The manifest’s BLAKE3 is recorded in the lineage of every artifact the operator produces', 'Shell exists as a last resort and always needs approval'])}</div></div>`,
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
${section({ id: 'graph', title: 'The artifact graph', body: figure(lineagePlate(), 'A schematic of artifacts and the operators between them. Each artifact is a node; each edge names the operator that made it.') })}
${section({
  id: 'model',
  cls: 'section--band',
  title: 'Artifacts, assets and runs',
  body: cards([
    { icon: 'cube', title: 'Artifact', text: 'Immutable. An art_ id, a BLAKE3 digest, size and media type, and the run, node, partition and output port that committed it. Its digest is its identity across stores.' },
    { icon: 'drawers', title: 'Asset', text: 'A logical object with versions, each pointing at artifacts. Defined in O-01 and not implemented yet.' },
    { icon: 'dag', title: 'Run', text: 'One execution: node instances, artifact edges, checkpoints, retries and events. The run is what makes an artifact explainable.' },
  ]),
})}
${section({
  id: 'cas',
  title: 'Content-addressed storage',
  body: `<div class="split split--top"><div data-reveal><div class="code-block"><pre>${hl('sh', text('cas.txt'))}</pre></div><p class="small muted">The store ogund creates on first start, ${CAPTURED}.</p></div><div data-reveal data-delay="120">${checklist(['The same bytes are stored once, however many runs produce them', 'Ingestion is temp file, fsync, atomic rename: crash-safe and idempotent', 'The format is the zeus-artifact library of zeus-core (Zeus spec 13), so a file Zeus acquired can be imported with its hash and provenance', 'Not built: chunk-level storage and content-defined chunking'])}</div></div>`,
})}
${section({
  id: 'export',
  cls: 'section--band',
  title: 'Export formats',
  body: table({
    head: ['Export', 'What you get'],
    rows: [
      ['OpenLineage', 'Run, job and dataset events from the daemon (<code>lineage.get</code>, O-05) as JSON Lines, or posted to an endpoint you configure over plain HTTP; <code>ogun-export</code> can forward them'],
      ['W3C PROV, Croissant', 'Planned, through the Zeus manifest exports; not built in Ogun'],
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
<div class="wrap wrap--narrow">${answer({ title: 'In short', text: 'Ogun runs benchmark tasks for data and terminal agents (Spider 2.0-DBT, ADE-bench, Terminal-Bench 2.0 in the Harbor format) as ordinary runs with an environment and an evaluator. A benchmark profile switches off Ogun’s helpful behaviour, isolates every run, records a hash-chained trajectory, and reports cost and efficiency counts alongside the official score. The adapters are written and their task formats are not yet verified; there are no results.' })}</div>
${section({
  id: 'model',
  title: 'A benchmark is a set of runs',
  body: `<p class="formula" data-reveal>Run = Workflow + Environment + Agent + Policy + Inputs + Evaluator</p>${cards([
    { icon: 'matrix', title: 'Benchmarks', text: 'Spider 2.0-DBT (68 DuckDB and dbt tasks), ADE-bench (dbt Labs), Terminal-Bench 2.0 via Harbor, and your private tasks. Adapters read the existing formats; the layouts come from public descriptions and are unverified.' },
    { icon: 'agent', title: 'Agents', text: 'An agent is a command a person configures in the matrix: name, version, model, command and the model credentials to pass by name. It never comes from a prompt or a task.' },
    { icon: 'balance', title: 'Evaluators', text: 'Official graders, run unmodified, with their version recorded next to the score.' },
  ])}`,
})}
${section({
  id: 'isolation',
  cls: 'section--band',
  title: 'Isolation',
  body: `<div class="split split--top"><div data-reveal>${table({ head: ['Setting', 'Default in the benchmark profile'], rows: [['Runtime', 'One docker or podman container per run, with every capability dropped; a local runtime for trusted tasks only. MicroVMs are later'], ['Network', 'Denied unless a person allows it in the matrix, separately for the agent and the evaluator phase; a run that cannot enforce the denial is refused'], ['Filesystem', '/workspace read-write · /benchmark read-only · the evaluator’s /tests appear only after the agent has finished'], ['Secrets', 'Only the model credentials a person lists, passed by name'], ['Environment variables', 'Cleared; no OGUN_* or ZEUS_* variable reaches the agent'], ['Cache mode', 'disabled (default) · benchmark_provided · cold · warm'], ['Off limits', 'Ogun and Zeus stores and state, ogund, zeusd, browser sessions: ogun-bench never connects to them']] })}</div><div data-reveal data-delay="120"><h3>Trajectories</h3><p>A trajectory is an append-only JSON Lines file. Every line carries <code>seq</code>, <code>at</code>, <code>elapsed_ms</code>, <code>agent_run</code>, <code>type</code> and the BLAKE3 of the previous line, so a reader stops at the first break. Text from an agent, a model or a tool lives only in members named <code>untrusted_*</code>, with secrets replaced.</p><div class="code-block"><pre>${hl('sh', 'task.started  workspace.snapshot  agent.started  message\nmodel.request  model.response  tool.call  tool.shell  tool.result\nfile.read  file.created  file.patch  file.deleted  agent.output\nusage  agent.exited  db.state  evaluator.started  evaluator.finished  task.finished')}</pre></div><p class="muted">The event types of O-05 section 7. <code>ogun-bench replay</code> verifies a trajectory and prints it. The <code>ogun-bench</code> binary is not in release 0.0.1a; build it from source.</p></div></div>`,
})}
${section({
  id: 'metrics',
  title: 'Metrics',
  body: `<div class="metrics" data-reveal>${METRICS.map(([n, f, d]) => `<div class="metric"><h3>${n}</h3><p class="formula">${f}</p><p>${d}</p></div>`).join('')}</div>${note('<p>Built: token and cost totals, tool-call counts and the proxies for tool efficiency of O-05 section 7 (failed calls, repeated commands, files read again). Harness gain and tool ablation are next on the roadmap.</p>', 'balance')}`,
})}
${section({
  id: 'research',
  cls: 'section--band',
  title: 'Research questions',
  body: `<div class="wrap--narrow" data-reveal><p class="lede">Hold the model fixed and vary the harness: shell only, shell plus structured database tools, MCP data tools, Ogun’s workflow and artifact tools. Harness gain averages the difference across models. Tool ablation removes one affordance at a time. Both need exactly what Ogun records anyway: controlled environments, trajectories and costs.</p>${note('<p>No results yet. The benchmark profile is built and its adapters are being checked against the official task formats. We will publish methods before numbers.</p>', 'hourglass')}</div>`,
})}
${section({
  id: 'prior',
  title: 'Prior art',
  body: table({ head: ['Project', 'What it is', 'How Ogun relates'], rows: [['Harbor', 'The task format and harness Terminal-Bench 2.0 ships in', 'Read Harbor tasks through an adapter'], ['ADE-bench harness', 'dbt Labs’ runner for analytics and data-engineering tasks', 'Run its tasks; use its graders unmodified'], ['Spider 2.0 framework', 'The agent framework published with Spider 2.0', 'Run Spider2-DBT tasks with the official evaluation'], ['Inspect', 'A general framework for evaluating language models', 'Complementary; export trajectories and scores']] }),
})}
${ctaForge(ctx.cfg, { title: 'Tell us what to support', text: 'If you build or evaluate coding and data agents, tell us which benchmarks and agents you use. That decides which adapters are built first.', primary: ['Try the pre-alpha', '/get-started/'] })}`,
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
  lede: 'Statements the implementation must keep true. docs/IMPLEMENTATION_STATUS.md in the repository says which have a test and which are only built.',
  body: table({ head: ['Invariant', 'How it holds'], rows: [
    ['Ogun never holds browser session material', 'Its engine is built with a null session provider; logged-in sources go through zeusd as a service client'],
    ['No agent-reachable path can approve', 'Approvals are decided only on trust surfaces; MCP and A2A can raise, never answer'],
    ['Approvals bind to exact facts', 'Request hash over the JCS facts; a changed workflow or budget needs a new approval'],
    ['Code never runs in the daemon', 'Adapter, code and model operators are child processes with a declared profile. The sandbox is bubblewrap on Linux; Windows has none yet and refuses code operators unless allow_unsandboxed is set'],
    ['Secrets never reach logs, events, lineage, errors or prompts', 'Zeroizing types, no serialization of secret types, URL redaction, canary-based leak tests'],
    ['Benchmark runs are sealed', 'Network denied by default; no access to stores, zeusd or sessions'],
    ['The daemon has one local endpoint', 'No network listener in ogund; ogun-server is a separate process and the hub’s listener'],
  ] }),
})}
${section({
  id: 'threats',
  cls: 'section--band',
  title: 'Threats considered',
  body: cards([
    { icon: 'agent', title: 'Prompt injection', text: 'Text from pages and files is data, labelled untrusted. It cannot approve, widen budgets, change allowed domains or reach a secret.' },
    { icon: 'crucible', title: 'Malicious operators', text: 'Pinned by content hash, reviewed on change, sandboxed at run time. A new or changed code hash is a plan diff a person must approve.' },
    { icon: 'database', title: 'Data poisoning', text: 'Lineage records which run, node and operator produced an artifact, so contaminated outputs can be traced to their source.' },
    { icon: 'lock', title: 'Credential theft', text: 'Data-source credentials stay local and zeroized; browser sessions never enter Ogun at all.' },
    { icon: 'balance', title: 'Runaway spend', text: 'Model spend is counted in a hash-chained ledger and enforced per run; a larger budget in a new version needs a person. Budgets for bytes, files and time are declared but not yet enforced by the executor.' },
    { icon: 'shield', title: 'Supply chain', text: 'Operators are pinned by version and code hash. The 0.0.1a binaries are unsigned; their SHA-256 checksums are published with the release.' },
  ]),
})}
${section({ id: 'report', title: 'Reporting a vulnerability', body: `<div class="wrap--narrow" data-reveal><p class="lede">Please tell us privately first. Our <a href="/legal/security/">security policy</a> explains scope, response times and safe harbour; <a href="/.well-known/security.txt">security.txt</a> has the contact.</p></div>` })}
${ctaForge(ctx.cfg)}`,
}

export default [architecture, workflows, operators, lineage, benchmarks, security]
