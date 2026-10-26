// Facts and copy shared by pages, llms.txt and structured data. Keep claims in line with the ogun repository
// (docs/IMPLEMENTATION_STATUS.md first, then the specs O-00 to O-17, docs/adr, ROADMAP.md) and Zeus ADR 0011. Ogun is pre-alpha:
// release 0.0.1a (src/release.mjs) and the hosted hub are the only things to install or try; describe the rest as design and
// what tests prove. Operator names, MCP tools and every transcript come from src/captures (tools/capture.mjs).
import { OPERATORS as CATALOGUE } from './captures.mjs'


export const PRINCIPLES = [
  { icon: 'ledger', title: 'Workflows are data', text: 'A workflow is a versioned JSON document: a DAG of operator calls with no floating-point numbers, hashed with JCS and BLAKE3. It can be diffed, approved, replayed and exported, because it is not code.' },
  { icon: 'hourglass', title: 'Runs are durable', text: 'Every node instance, checkpoint and artifact edge is journaled. If the daemon is killed or the machine restarts, the run resumes and completed partitions are not fetched again.' },
  { icon: 'cube', title: 'Every byte has a lineage', text: 'Outputs are content-addressed artifacts that know their parents, the operator and version that made them, the model and prompt hash if any, and the run that produced them.' },
  { icon: 'anvil', title: 'Built on the Zeus engine', text: 'Acquisition runs on zeus-core: segmented, resumable, verified transfers with a crash-safe journal, written in Rust and shared with the Zeus app.' },
  { icon: 'gear', title: 'Integrate, do not replace', text: 'DuckDB, dbt, Polars, ffmpeg, pandoc, OCR engines and Python run as out-of-process operators. Integrations for Airflow, Dagster, Prefect and Kestra start and watch Ogun runs; they are in the repository and not yet released as packages.' },
  { icon: 'shield', title: 'People approve', text: 'A new or changed code hash, a larger budget, a first model operator and any node whose policy asks every time need a human approval bound to the request hash. No agent channel can approve.' },
]

export const RUN_STATES = [
  ['pending', 'Declared, inputs not yet available', ''],
  ['ready', 'Inputs available, waiting for a worker or a budget', 'st-brass'],
  ['running', 'An operator is executing', 'st-running'],
  ['waiting', 'Blocked on an external condition or trigger', ''],
  ['waiting_for_user', 'Needs a human approval (maps to the engine’s awaiting_approval)', 'st-brass'],
  ['waiting_for_session', 'Needs a browser session through the Zeus bridge (awaiting_session)', 'st-info'],
  ['retry_scheduled', 'Failed transiently; backing off before the next attempt', 'st-bad'],
  ['succeeded', 'Outputs materialized and verified', 'st-ok'],
  ['failed', 'Failed permanently, with a typed error', 'st-bad'],
  ['cancelled', 'Stopped by a person or a policy', ''],
  ['skipped', 'Not needed: routing, a denied approval or an up-to-date partition', ''],
]

export const TRIGGERS = [
  ['<code>manual</code>', 'Starts only when a person or an agent asks for a run.', 'Built'],
  ['<code>cron</code>', 'Five-field cron, evaluated in UTC. After downtime the scheduler starts one run, and its partitions make up for what was missed.', 'Built'],
  ['<code>interval</code>', 'Fires <code>interval_ms</code> after the previous run started; one minute at least.', 'Built'],
  ['<code>stream</code>', 'Fires when a window of a sensor stream is sealed (MQTT, HTTP push, LoRaWAN, Modbus, file tail).', 'Built; the ingest bridge has not run against real brokers or devices'],
  ['Event, data, agent, condition', 'File, webhook, Git or S3 events; a dataset version or row count; another agent’s task; Wi-Fi or mains power.', 'Planned (VISION section 5); not in IR v0'],
]

const DESCRIPTIONS = {
  acquire: 'Resumable, segmented download on the embedded Zeus engine; plan vocabulary shared with Zeus',
  'zeus.session_acquire': 'A source behind your browser login, acquired by zeusd through the session bridge (tested against a fake zeusd)',
  crawl: 'Pagination, link extraction and selectors from a closed, validated set; honours robots.txt and stays on one origin',
  'file.copy': 'Safe materialization into workspace paths',
  'file.move': 'Safe materialization into workspace paths',
  'archive.extract': 'Zip, tar, tar.gz and gzip, with path containment and size limits',
  hash: 'BLAKE3 and SHA-256 digests of artifacts',
  dedupe: 'Exact or keyed deduplication',
  manifest: 'A provenance manifest of its inputs',
  partition: 'Fan-out over partitions',
  filter: 'Predicate filter with a rejected output',
  map: 'Per-artifact mapping',
  join_metadata: 'Metadata joins',
  'window.rollup': 'Rolls sealed stream windows up, for example minutes into hours',
  duckdb: 'SQL over Parquet, CSV and JSON; writes tables or Parquet',
  'pdf.extract': 'Text and tables from PDFs, through pdftotext',
  ffmpeg: 'Media conversion',
  pandoc: 'Document conversion',
  tesseract: 'OCR for scanned documents',
  paddleocr: 'OCR for scanned documents',
  yt_dlp: 'Acquisition from media sites, through yt-dlp',
  rclone: 'Acquisition from cloud storage, through rclone',
  git: 'Acquisition from repositories',
  hf: 'Acquisition from Hugging Face',
  python: 'Your code, pinned by BLAKE3 hash, run in a sandboxed process; needs a person’s approval when it is new or changed',
  polars: 'Dataframe code, pinned and approved like python',
  sql: 'A SQL script, pinned and approved like python',
  dbt: 'A dbt Core project as a node, with run results as artifacts',
  shell: 'Last resort; always needs approval',
  'stream.mqtt': 'Sensor readings from an MQTT broker, sealed into event-time windows',
  'stream.http': 'Sensor readings pushed over HTTP',
  'stream.lorawan': 'Uplinks from ChirpStack or The Things Stack',
  'stream.modbus': 'Registers from Modbus TCP or RTU-over-TCP devices',
  'stream.file_tail': 'Lines appended to a file',
  'llm.extract': 'Structured extraction into a JSON Schema',
  'llm.classify': 'Labels from a closed label set',
  'llm.map': 'Per-item transforms with natural-language rules',
  'llm.filter': 'Per-item filters with natural-language rules',
  'llm.rename': 'Names from content',
  'llm.enrich': 'Metadata from content',
  'llm.schema': 'Infer a schema from samples, for a human to approve',
  'embedding.generate': 'Vectors for search and deduplication',
}
const unknown = CATALOGUE.filter((o) => !(o.name in DESCRIPTIONS)).map((o) => o.name)
if (unknown.length) throw new Error('operators without a description: ' + unknown.join(', '))
const group = (...kinds) => CATALOGUE.filter((o) => kinds.includes(o.kind)).map((o) => [o.name, o.outputs.join(', '), DESCRIPTIONS[o.name]])
export const OPERATORS = { core: group('core'), adapter: group('adapter'), code: group('code'), source: group('source'), llm: group('model'), count: CATALOGUE.length }

export const METRICS = [
  ['Cost per success', 'C<sub>s</sub> = Σ<sub>i</sub> cost<sub>i</sub> / successful tasks', 'Compares agents at the same pass rate by what each success costs.'],
  ['Intervention rate', 'interventions / run', 'How often a person or an outside recovery had to step in.'],
  ['Tool efficiency', 'useful tool calls / all tool calls', 'Proxies: duplicate, failed and repeated commands; files re-read.'],
  ['Edit efficiency', 'necessary changed lines / all changed lines', 'Catches agents that thrash a repository (needs task-aware heuristics).'],
  ['Recovery', 'detection rate · steps to recovery · recovery success', 'Does the agent notice a failure, and how fast does it get back on track?'],
  ['Harness gain', 'HGE(H) = (1/N) Σ<sub>m</sub> [ Score(m, H) − Score(m, H<sub>base</sub>) ]', 'How much capability a harness unlocks across N models.'],
  ['Tool ablation', 'Δ<sub>i</sub> = Score<sub>full</sub> − Score<sub>full − tool i</sub>', 'Which affordance actually helps, one removal at a time.'],
]

export const FAQ = [
  { group: 'Basics', id: 'what', q: 'What is Ogun?', a: 'Ogun is a local-first developer platform for data acquisition, data engineering and AI-agent benchmarks, made by Verne. It turns authenticated, messy web and filesystem sources into verified, reproducible datasets on a schedule, and it can run benchmark tasks for data and terminal agents in isolation. It is built on the Zeus download engine.' },
  { group: 'Basics', id: 'who', q: 'Who is it for?', a: 'AI, LLM and data engineers who build datasets and pipelines, ML researchers who need provenance, and people who evaluate coding and data agents. If you want everyday downloads for your AI assistant instead, use <a href="https://zeus-site-bay.vercel.app">Zeus</a>.' },
  { group: 'Basics', id: 'status', q: 'Can I use Ogun today?', a: 'As a pre-alpha. Release 0.0.1a has Ogun Studio for Windows and Linux and the ogun and ogund binaries, and a hosted hub runs Studio on the real daemon with sample data (see <a href="/get-started/">Get started</a>). The runtime passed its phase O1 exit test on Linux in October 2026: a partitioned backfill and a stream window survive kill -9 of the daemon and resume only the unfinished work. Code operators, remote approvals and most connectors are not ready; expect breaking changes. See the <a href="/roadmap/">roadmap</a>.' },
  { group: 'Basics', id: 'zeus', q: 'How is Ogun related to Zeus?', a: 'Both are Verne products built on the same engine library, zeus-core. Zeus is the session-aware download and file layer for AI agents; Ogun is the developer platform. Ogun embeds the engine directly and reaches browser-session sources only through the Zeus daemon, as a service client. That bridge is built and tested against a fake daemon.' },
  { group: 'Basics', id: 'license', q: 'What does it cost, and what is the license?', a: 'Ogun is free and open source under Apache-2.0. A hub for teams (ogun-server: OIDC sign-in, workspaces, roles, edge sync) is built and runs the hosted pre-alpha hub; it is a separate component and never sits in the credential path.' },
  { group: 'Design', id: 'airflow', q: 'Is Ogun a replacement for Airflow, Dagster or Prefect?', a: 'No. Ogun contains enough durable orchestration to run acquisition and data workflows by itself, but its job is materializing trustworthy artifacts. It is designed to be called from orchestrators as a task, resource or operator, not to replace them.' },
  { group: 'Design', id: 'ir', q: 'How are workflows defined?', a: 'As a JSON intermediate representation: a DAG of operator nodes with inputs, configuration and policy. In this release you write the JSON (the VS Code extension and the language server help), or your agent drafts it over MCP. YAML and a Python SDK are planned and will compile to the same IR. Every route ends at the same validator, a plan diff and, for anything sensitive, a human approval.' },
  { group: 'Design', id: 'llm', q: 'Do I need an LLM?', a: 'No. A workflow such as download, unzip, CSV to Parquet runs with no model access at all. LLM operators are optional and run through a provider ladder you configure, with a spend ledger and budgets.' },
  { group: 'Design', id: 'python', q: 'Can I run my own Python?', a: 'Yes, as a python operator. Your code is referenced by content hash, runs in a sandboxed process with declared inputs and outputs, and adding or changing it in a workflow needs your approval. The sandbox is bubblewrap on Linux; Windows has none yet, so code operators run there only with the explicit allow_unsandboxed override, and the hosted hub cannot run them.' },
  { group: 'Design', id: 'reproducible', q: 'What makes runs reproducible?', a: 'The workflow is hashed; operators are pinned by version and content hash; inputs are content-addressed artifacts; model calls record the model and a prompt hash; and every output records its parents. Re-running a version with the same inputs is a lookup, not a guess.' },
  { group: 'Design', id: 'durable', q: 'What happens if the machine crashes mid-run?', a: 'Completed work is kept. Transfers resume from the engine’s journal, node instances resume from checkpoints, and completed partitions are skipped. That is the phase O1 exit test, which the runtime passes on Linux: a partitioned backfill killed with kill -9 resumes only its incomplete partitions.' },
  { group: 'Design', id: 'session', q: 'Can Ogun use my browser login?', a: 'Only through Zeus. Ogun never holds browser cookies. A workflow node that needs a logged-in source asks the Zeus daemon, as a service client, to run that acquisition; you approve the site once on a Zeus trust surface, and Ogun imports the result with its provenance.' },
  { group: 'Design', id: 'storage', q: 'Where does my data live?', a: 'On your machine, in Ogun’s content-addressed store and in the workspaces you choose. Nothing is uploaded to Verne. Credentials for data sources stay on your machine, zeroized in memory and never logged.' },
  { group: 'Design', id: 'web', q: 'Does Ogun respect websites?', a: 'Yes. robots.txt is honoured by default, requests are spaced per host, concurrency is limited, and there is no captcha solving, fingerprint spoofing or DRM removal. If a source needs a person, the run waits for one.' },
  { group: 'Benchmarks', id: 'bench', q: 'Which benchmarks will Ogun run?', a: 'Adapters for Spider 2.0-DBT, ADE-bench and Terminal-Bench 2.0 tasks in the Harbor format are written; their task formats are still being checked against the official releases. Official evaluators run unmodified and their versions are recorded. Ogun does not invent a competing task format.' },
  { group: 'Benchmarks', id: 'isolation', q: 'How are benchmark runs isolated?', a: 'Each run gets an immutable environment in a container: network denied by default, the workspace read-write, the benchmark read-only, model credentials only, fresh memory and an explicit cache mode. Benchmark runs never see your artifact stores, the Zeus daemon or browser sessions.' },
  { group: 'Benchmarks', id: 'why-bench', q: 'Why does a data platform run agent benchmarks?', a: 'Because a run is already workflow plus environment plus agent plus policy plus inputs. Add an evaluator and a benchmark is a controlled set of runs. The same lineage, trajectories and cost ledger then make results reproducible and comparable across agents, models and harness configurations.' },
  { group: 'Agents', id: 'mcp', q: 'Can my coding agent drive Ogun?', a: 'Yes, through ogun mcp, which speaks MCP over stdio and offers sixteen tools: validate, diff, partitions and operators without a daemon, and with one, storing workflows, starting runs and reading run, partition, backfill, approval and stream status. An A2A bridge is planned. Agents can propose and run approved workflows; they can never approve anything themselves.' },
  { group: 'Agents', id: 'cost', q: 'How are model costs controlled?', a: 'Every LLM operator needs a budget in the workflow. Spend is counted in integer micro-dollars in a hash-chained ledger and enforced per run; raising a budget in a new version needs a human approval.' },
  { group: 'Project', id: 'verne', q: 'Who makes Ogun?', a: 'Verne Ltd., a forward-deployed AI engineering firm in Dhaka, Bangladesh. Ogun is developed in the open under Apache-2.0. See <a href="/about/">About</a>.' },
  { group: 'Project', id: 'name', q: 'Why the name Ogun?', a: 'Ògún is the Yoruba orisha associated with iron, metalwork and the making of tools. The name honours that craft: a forge where raw material becomes something reliable. We do not depict the orisha or use sacred symbols; our imagery is public-domain paintings of forges and ironworks, translated into pixels, credited on the art credits page.' },
  { group: 'Project', id: 'contribute', q: 'How can I follow or contribute?', a: 'Read the architecture and decision records, try the pre-alpha and write to info@vernesystems.com with feedback, and follow Verne on LinkedIn or X. The source is public at <a href="https://github.com/ArefinAlter/ogun">github.com/ArefinAlter/ogun</a>. Security reports: see the <a href="/legal/security/">security policy</a>.' },
]

export const GLOSSARY = [
  { id: 'a2a', term: 'A2A (Agent2Agent)', def: 'An open protocol for agents to delegate tasks to other agents. Ogun plans to expose a workflow agent over A2A through a bridge process, off by default. It is not built.' },
  { id: 'ade-bench', term: 'ADE-bench', def: 'A benchmark by dbt Labs for AI agents doing analytics and data engineering work: tasks in dbt projects with a DuckDB or Snowflake database, modelled on Terminal-Bench. Ogun has an adapter; its task format is not yet verified.' },
  { id: 'approval', term: 'Approval', def: 'A decision only a person can make, bound to a hash of the exact request. In Ogun: a new or changed code hash, a larger budget, a first model operator, or a node whose policy asks every time. Egress and publish approvals are reserved.' },
  { id: 'artifact', term: 'Artifact', def: 'An immutable materialization with an art_ id and a content hash, plus its source, parents, producing operation, run and verification state.' },
  { id: 'asset', term: 'Asset', def: 'A logical object with versions over time, such as a weekly dataset. Each version points at artifacts.' },
  { id: 'backfill', term: 'Backfill', def: 'Running a partitioned workflow over a range of past partitions, for example every day since 2020, with per-partition status and resumption.' },
  { id: 'benchmark-profile', term: 'Benchmark profile', def: 'A run profile that switches off helpful behaviour (auto-repair, extra retries, caches, memory) and enforces isolation, so the measurement is of the agent, not of Ogun.' },
  { id: 'blake3', term: 'BLAKE3', def: 'A fast cryptographic hash. Ogun uses it for workflow hashes (over JCS) and alongside SHA-256 for artifacts.' },
  { id: 'cas', term: 'Content-addressed store (CAS)', def: 'Storage where an object’s address is its hash, so identical content is stored once and any change is detectable. In Ogun it is the zeus-artifact store format of zeus-core, shared with Zeus: objects/blake3/ab/cd/&lt;digest&gt;.' },
  { id: 'cost-per-success', term: 'Cost per success', def: 'Total cost of a set of runs divided by the number of successful tasks; a fairer comparison than pass rate alone.' },
  { id: 'croissant', term: 'Croissant', def: 'A metadata format for machine-learning datasets (MLCommons). The Zeus manifest exports can produce Croissant shape; Ogun does not export it yet.' },
  { id: 'dag', term: 'DAG', def: 'Directed acyclic graph: nodes with dependencies and no cycles. A workflow is a DAG of operator nodes.' },
  { id: 'determinism', term: 'Determinism class', def: 'What an operator declares about repeatability: pure (same inputs, same outputs), seeded, or non-deterministic (network, models). It decides what can be cached and replayed.' },
  { id: 'environment', term: 'Environment', def: 'The isolated place a run executes: base image, fixtures, workspace, tool policy. A first-class object, which is what makes benchmarks just runs.' },
  { id: 'evaluator', term: 'Evaluator', def: 'Something that scores a run’s outputs, such as an official benchmark grader. Ogun records its version with the score.' },
  { id: 'harbor', term: 'Harbor', def: 'The harness and task format in which Terminal-Bench 2.0 is distributed. Ogun plans to read Harbor-format tasks through an adapter.' },
  { id: 'harness-gain', term: 'Harness gain', def: 'The average improvement a harness gives across models compared with a baseline harness: how much capability poor tooling was hiding.' },
  { id: 'ir', term: 'Intermediate representation (IR)', def: 'The single JSON form every workflow compiles to, whether written in YAML, Python or natural language. It is what Ogun validates, hashes, diffs and runs.' },
  { id: 'jcs', term: 'JCS (RFC 8785)', def: 'The JSON Canonicalization Scheme: one byte-exact serialization of a JSON value, so hashing a workflow is stable. It is why the IR has no floating-point numbers.' },
  { id: 'lineage', term: 'Lineage', def: 'The graph of which artifacts and operations produced which outputs. Ogun records it for every artifact and can export it as OpenLineage events.' },
  { id: 'mcp', term: 'MCP (Model Context Protocol)', def: 'An open standard for giving AI applications tools and data. Ogun offers a small, hierarchical tool set so agents can create, run and inspect workflows.' },
  { id: 'openlineage', term: 'OpenLineage', def: 'An open standard for lineage events (runs, jobs, datasets). Ogun can emit them so existing lineage tools understand its runs.' },
  { id: 'operator', term: 'Operator', def: 'A unit of work in a workflow: acquire, extract, DuckDB, dbt, Python, OCR, an LLM call. Operators declare inputs, outputs, version, determinism and a sandbox profile.' },
  { id: 'operator-abi', term: 'Operator ABI', def: 'The contract between Ogun and an operator: a manifest plus an invocation protocol (a process speaking JSON over stdio first; WASI components are being considered).' },
  { id: 'partition', term: 'Partition', def: 'A slice of a workflow’s work, by date or key. Partitions succeed, fail and retry independently, which makes large backfills practical.' },
  { id: 'plan-diff', term: 'Plan diff', def: 'What changes between two workflow versions: nodes, operators, sources, budgets and code hashes added or removed. It is what a person reviews before approving.' },
  { id: 'provenance', term: 'Provenance', def: 'Where data came from and how it was made: source (with secrets redacted), time, tools and versions, models and prompts, parents.' },
  { id: 'run', term: 'Run', def: 'One durable execution of a workflow: node instances, artifact edges, checkpoints, retries, events and provenance. A run survives crashes.' },
  { id: 'sandbox', term: 'Sandbox', def: 'The restricted process an operator runs in: declared filesystem access, network policy and resource limits. Code never runs inside the daemon.' },
  { id: 'session-bridge', term: 'Session bridge', def: 'How Ogun reaches sources behind a browser login without holding cookies: it asks the Zeus daemon, as a service client, to acquire them.' },
  { id: 'spider2-dbt', term: 'Spider 2.0-DBT', def: 'The dbt subset of the Spider 2.0 benchmark: 68 tasks in which agents work on dbt projects backed by DuckDB.' },
  { id: 'terminal-bench', term: 'Terminal-Bench', def: 'A benchmark of hard, realistic command-line tasks for agents; version 2.0 is distributed in the Harbor format.' },
  { id: 'tool-ablation', term: 'Tool ablation', def: 'Removing one tool from a harness at a time and measuring the score drop, to learn which affordances actually help.' },
  { id: 'trajectory', term: 'Trajectory', def: 'The replayable event stream of an agent run: model requests and responses, tool calls, commands, file reads and patches, database state hashes.' },
  { id: 'trigger', term: 'Trigger', def: 'What starts a run: time, an event, a data change, another agent, or a condition such as being on mains power.' },
  { id: 'w3c-prov', term: 'W3C PROV', def: 'The W3C standard model for provenance (entities, activities, agents). Ogun’s records map onto it.' },
  { id: 'workflow-hash', term: 'Workflow hash', def: 'BLAKE3 over the JCS form of a workflow. Approvals and runs are bound to it, so a changed workflow needs a new approval.' },
  { id: 'zeus-core', term: 'zeus-core', def: 'The Rust engine library shared by Zeus and Ogun: transfers, resume, journal, verification, filesystem safety and the artifact store format.' },
]

export const COMPARE = [
  ['Workflow orchestrators', 'Airflow, Dagster, Prefect, Kestra, Temporal', 'Scheduling and running arbitrary tasks at scale, with mature UIs and operator ecosystems.', 'Ogun focuses on acquisition and artifacts and keeps workflows as hashed data. Integrations for Airflow, Dagster, Prefect and Kestra start and watch its runs; they are not on PyPI yet.'],
  ['Data loading (ELT)', 'dlt, Airbyte', 'Connectors from APIs and databases into warehouses.', 'Ogun adds authenticated web and file acquisition, content-addressed artifacts and lineage down to the byte.'],
  ['Crawling and extraction', 'Scrapy, Crawl4AI, Firecrawl', 'Crawling pages and turning them into structured or LLM-ready text.', 'Ogun treats crawling as one operator among many, with durable, resumable file acquisition and provenance.'],
  ['Agent evaluation harnesses', 'Harbor, Inspect, benchmark-specific runners', 'Running tasks and scoring agents.', 'Ogun reads their formats and adds cross-benchmark matrices, lineage and a cost ledger; harness ablations are planned.'],
  ['Scripts and notebooks', 'Python, shell, cron', 'Anything, quickly.', 'Ogun gives the same work durability, approvals, sandboxing and a record of what produced what.'],
]

export const ROADMAP = [
  { when: 'Phase O0 · done', state: '', title: 'Contracts', text: 'ADRs 0001 to 0012 are accepted and the specs O-00 to O-17 are drafts: conventions, domain model and run state machine, workflow IR v0, operator ABI, scheduling, lineage, benchmark profile, approvals, session bridge, streams, edge ingestion and sync, platforms, server mode, extension surfaces, the daemon API, connectors and agent threads. O-16 and O-17 rest on ADRs 0013 and 0014, which are still proposed.' },
  { when: 'Phase O1 · exit test met, released as 0.0.1a', state: 'is-now', title: 'Runtime MVP', text: 'ogund and the ogun CLI: workflows, runs, backfills, range-compressed partition status, approvals on a terminal, streams and the MCP server. The exit test passes on Linux: a 121-partition backfill survives kill -9 and resumes only the incomplete partitions, and so does an open stream window. Release 0.0.1a of 25 October 2026 ships the binaries for Windows x64 and Linux x64. Next: the same test with real sources.' },
  { when: 'Phase O2 · in progress', state: '', title: 'Data and model operators', text: 'Built: the core operators, adapters for DuckDB, SQL, dbt and Python under a sandbox (Linux only), Ogun’s own LLM provider ladder with a spend ledger (only the Anthropic client was checked, against a mock), the ingest bridge for sensors and the Zeus session bridge (tested against a fake zeusd). Still to come: the Python SDK and YAML authoring, a Windows sandbox, and runs against the real services.' },
  { when: 'Phase O3 · built, unverified', state: '', title: 'Benchmark profile', text: 'Built: isolated environments, evaluators, trajectories and replay, a result cache and matrix runs, with Spider 2.0-DBT, ADE-bench and Harbor adapters whose task formats come from public descriptions and are not yet verified. The container path has not run in CI. There are no results.' },
  { when: 'Phase O4 · started', state: '', title: 'Studio, server mode and A2A', text: 'Studio ships in 0.0.1a as a desktop app for Windows and Linux and as Studio-web, served by ogun-server, which runs the hosted pre-alpha hub. Remote approvals stay off until an external security review. The Android and iOS companions are code without a build. The A2A bridge is planned.' },
]

export const NOT_BUILT = ['A dataframe library or SQL engine', 'A browser, an OCR engine or a vector database', 'A foundation model', 'A full Airflow or dbt replacement', 'Captcha or anti-bot circumvention', 'A generic RPA platform', 'Telemetry of any kind']
