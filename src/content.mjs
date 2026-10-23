// Facts and copy shared by pages, llms.txt and structured data. Keep claims in line with the ogun repository
// (docs/VISION.md, docs/adr/0002-0005, ROADMAP.md) and zeus ADR 0011. Ogun is in its contracts phase: describe design, never usage.

export const PRINCIPLES = [
  { icon: 'ledger', title: 'Workflows are data', text: 'A workflow is a versioned JSON document: a DAG of operator calls with no floating-point numbers, hashed with JCS and BLAKE3. It can be diffed, approved, replayed and exported, because it is not code.' },
  { icon: 'hourglass', title: 'Runs are durable', text: 'Every node instance, checkpoint and artifact edge is journaled. If the daemon is killed or the machine restarts, the run resumes and completed partitions are not fetched again.' },
  { icon: 'cube', title: 'Every byte has a lineage', text: 'Outputs are content-addressed artifacts that know their parents, the operator and version that made them, the model and prompt hash if any, and the run that produced them.' },
  { icon: 'anvil', title: 'Built on the Zeus engine', text: 'Acquisition runs on zeus-core: segmented, resumable, verified transfers with a crash-safe journal, written in Rust and shared with the Zeus app.' },
  { icon: 'gear', title: 'Integrate, do not replace', text: 'DuckDB, dbt, Polars, ffmpeg, pandoc, OCR engines and Python run as sandboxed operators. Ogun is callable from Prefect, Dagster, Airflow, Kestra, Temporal and GitHub Actions.' },
  { icon: 'shield', title: 'People approve', text: 'Code operators, spend over budget and publishing outside the workspace need a human approval bound to the workflow hash. No agent channel can approve.' },
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
  ['Time', 'cron, interval', '“Every Sunday at 03:00”'],
  ['Event', 'new file, filesystem change, RSS change, webhook (through a bridge), Git commit, S3 object', '“When a new PDF lands in this bucket”'],
  ['Data', 'dataset version changed, new matching item discovered, row count over N', '“When the October release appears”'],
  ['Agent', 'A2A task received, MCP invocation, another agent’s task completed', '“When the extraction agent finishes”'],
  ['Condition', 'login restored, VPN up, on Wi-Fi, on mains power', '“Only acquire on Wi-Fi and mains power”'],
]

export const OPERATORS = {
  core: [
    ['acquire', 'Resumable, segmented download on the embedded Zeus engine; plan vocabulary shared with Zeus'],
    ['zeus.session_acquire', 'A source behind your browser login, acquired by zeusd through the session bridge'],
    ['crawl', 'Pagination, link extraction and selectors from a closed, validated set'],
    ['archive.extract', 'Zip, tar, 7z with path containment and size limits'],
    ['hash · dedupe', 'Content hashes and exact or keyed deduplication'],
    ['partition · filter · map', 'Fan-out over partitions, predicate filters, per-artifact mapping'],
    ['file.copy · file.move', 'Safe materialization into workspace paths'],
    ['manifest · join_metadata', 'Provenance manifests and metadata joins'],
  ],
  external: [
    ['duckdb', 'SQL over Parquet, CSV and JSON; writes to DuckDB or Parquet'],
    ['dbt', 'dbt Core projects as a node, with run results as artifacts'],
    ['python', 'Your code, pinned by content hash, in a sandboxed process'],
    ['polars', 'Through Python, for dataframe transforms'],
    ['ffmpeg · pandoc', 'Media and document conversion'],
    ['tesseract · paddleocr', 'OCR for scanned documents'],
    ['yt-dlp · rclone · git · hf', 'Specialised acquisition from media sites, cloud storage, repositories and Hugging Face'],
    ['shell', 'Last resort, approval required, sandboxed like the rest'],
  ],
  llm: [
    ['llm.extract', 'Structured extraction into a JSON Schema'],
    ['llm.classify', 'Labels from a closed label set'],
    ['llm.map · llm.filter', 'Per-item transforms and filters with natural-language rules'],
    ['llm.rename · llm.enrich', 'Names and metadata from content'],
    ['llm.schema', 'Infer a schema from samples, for a human to approve'],
    ['embedding.generate', 'Vectors for search and deduplication'],
  ],
}

export const METRICS = [
  ['Cost per success', 'C<sub>s</sub> = Σ<sub>i</sub> cost<sub>i</sub> / successful tasks', 'Two agents at the same pass rate can differ fivefold in cost.'],
  ['Intervention rate', 'interventions / run', 'How often a person or an outside recovery had to step in.'],
  ['Tool efficiency', 'useful tool calls / all tool calls', 'Proxies: duplicate, failed and repeated commands; files re-read.'],
  ['Edit efficiency', 'necessary changed lines / all changed lines', 'Catches agents that thrash a repository (needs task-aware heuristics).'],
  ['Recovery', 'detection rate · steps to recovery · recovery success', 'Does the agent notice a failure, and how fast does it get back on track?'],
  ['Harness gain', 'HGE(H) = (1/N) Σ<sub>m</sub> [ Score(m, H) − Score(m, H<sub>base</sub>) ]', 'How much capability a harness unlocks across N models.'],
  ['Tool ablation', 'Δ<sub>i</sub> = Score<sub>full</sub> − Score<sub>full − tool i</sub>', 'Which affordance actually helps, one removal at a time.'],
]

export const FAQ = [
  { group: 'Basics', id: 'what', q: 'What is Ogun?', a: 'Ogun is a local-first developer platform for data acquisition, data engineering and AI-agent benchmarks, made by Verne. It turns authenticated, messy web and filesystem sources into verified, reproducible datasets on a schedule, and it can run benchmark tasks for data and terminal agents in isolation. It is built on the Zeus download engine.' },
  { group: 'Basics', id: 'who', q: 'Who is it for?', a: 'AI, LLM and data engineers who build datasets and pipelines, ML researchers who need provenance, and people who evaluate coding and data agents. If you want everyday downloads for your AI assistant instead, use <a href="https://zeus.vernesystems.com">Zeus</a>.' },
  { group: 'Basics', id: 'status', q: 'Can I use Ogun today?', a: 'Not yet. Ogun is in its contracts phase: the architecture decisions are made and the normative specifications are being written. The runtime starts once the Zeus engine’s crash-and-resume testing is complete: a first kill-and-restart test passed in October 2026, and fault injection at every crash point is still in progress. See the <a href="/roadmap/">roadmap</a>.' },
  { group: 'Basics', id: 'zeus', q: 'How is Ogun related to Zeus?', a: 'Both are Verne products built on the same engine library, zeus-core. Zeus is the session-aware download and file layer for AI agents; Ogun is the developer platform. Ogun embeds the engine directly and reaches browser-session sources only through the Zeus daemon, as a service client.' },
  { group: 'Basics', id: 'license', q: 'What does it cost, and what is the license?', a: 'Ogun is free and open source under Apache-2.0. An optional hub for teams (shared workflows, remote workers, central provenance) may come later as a separate component; it will never sit in the credential path.' },
  { group: 'Design', id: 'airflow', q: 'Is Ogun a replacement for Airflow, Dagster or Prefect?', a: 'No. Ogun contains enough durable orchestration to run acquisition and data workflows by itself, but its job is materializing trustworthy artifacts. It is designed to be called from orchestrators as a task, resource or operator, not to replace them.' },
  { group: 'Design', id: 'ir', q: 'How are workflows defined?', a: 'As a JSON intermediate representation: a DAG of operator nodes with inputs, configuration and policy. You can write YAML that maps one to one, build it with a Python SDK, or describe it in natural language and let an LLM draft it. Every route ends at the same validator, a plan diff and, for anything sensitive, a human approval.' },
  { group: 'Design', id: 'llm', q: 'Do I need an LLM?', a: 'No. A workflow such as download, unzip, CSV to Parquet runs with no model access at all. LLM operators are optional and run through a provider ladder you configure, with a spend ledger and budgets.' },
  { group: 'Design', id: 'python', q: 'Can I run my own Python?', a: 'Yes, as a python operator. Your code is referenced by content hash, runs in a sandboxed process with declared inputs and outputs, and adding or changing it in a workflow needs your approval bound to the new workflow hash.' },
  { group: 'Design', id: 'reproducible', q: 'What makes runs reproducible?', a: 'The workflow is hashed; operators are pinned by version and content hash; inputs are content-addressed artifacts; model calls record the model and a prompt hash; and every output records its parents. Re-running a version with the same inputs is a lookup, not a guess.' },
  { group: 'Design', id: 'durable', q: 'What happens if the machine crashes mid-run?', a: 'Completed work is kept. Transfers resume from the engine’s journal, node instances resume from checkpoints, and completed partitions are skipped. The phase O1 exit test is a partitioned backfill that survives kill -9 and resumes only incomplete partitions.' },
  { group: 'Design', id: 'session', q: 'Can Ogun use my browser login?', a: 'Only through Zeus. Ogun never holds browser cookies. A workflow node that needs a logged-in source asks the Zeus daemon, as a service client, to run that acquisition; you approve the site once on a Zeus trust surface, and Ogun imports the result with its provenance.' },
  { group: 'Design', id: 'storage', q: 'Where does my data live?', a: 'On your machine, in Ogun’s content-addressed store and in the workspaces you choose. Nothing is uploaded to Verne. Credentials for data sources stay on your machine, zeroized in memory and never logged.' },
  { group: 'Design', id: 'web', q: 'Does Ogun respect websites?', a: 'Yes. robots.txt is honoured by default, requests are spaced per host, concurrency is limited, and there is no captcha solving, fingerprint spoofing or DRM removal. If a source needs a person, the run waits for one.' },
  { group: 'Benchmarks', id: 'bench', q: 'Which benchmarks will Ogun run?', a: 'The first adapters are planned for Spider 2.0-DBT, ADE-bench and Terminal-Bench 2.0 tasks in the Harbor format. Official evaluators run unmodified and their versions are recorded. Ogun does not invent a competing task format.' },
  { group: 'Benchmarks', id: 'isolation', q: 'How are benchmark runs isolated?', a: 'Each run gets an immutable environment in a container: network denied by default, the workspace read-write, the benchmark read-only, model credentials only, fresh memory and an explicit cache mode. Benchmark runs never see your artifact stores, the Zeus daemon or browser sessions.' },
  { group: 'Benchmarks', id: 'why-bench', q: 'Why does a data platform run agent benchmarks?', a: 'Because a run is already workflow plus environment plus agent plus policy plus inputs. Add an evaluator and a benchmark is a controlled set of runs. The same lineage, trajectories and cost ledger then make results reproducible and comparable across agents, models and harness configurations.' },
  { group: 'Agents', id: 'mcp', q: 'Can my coding agent drive Ogun?', a: 'Yes, through a small MCP tool set (create, validate, plan, run, backfill, inspect artifacts and lineage) and, later, as an A2A peer. Agents can propose and run approved workflows; they can never approve anything themselves.' },
  { group: 'Agents', id: 'cost', q: 'How are model costs controlled?', a: 'Every LLM operator draws on a budget. Spend is counted in integer micro-dollars in a ledger; going over a budget needs a human approval; and the run view shows cost per node, per model and per artifact.' },
  { group: 'Project', id: 'verne', q: 'Who makes Ogun?', a: 'Verne Systems, a forward-deployed AI engineering firm in Dhaka, Bangladesh. Ogun is developed in the open under Apache-2.0. See <a href="/about/">About</a>.' },
  { group: 'Project', id: 'name', q: 'Why the name Ogun?', a: 'Ògún is the Yoruba orisha associated with iron, metalwork and the making of tools. The name honours that craft: a forge where raw material becomes something reliable. We do not depict the orisha or use sacred symbols; our imagery comes from Renaissance metallurgy treatises.' },
  { group: 'Project', id: 'contribute', q: 'How can I follow or contribute?', a: 'Read the architecture and decision records, write to info@vernesystems.com with feedback or to ask for early access, and follow Verne on LinkedIn or X. Repositories open publicly with the first runnable release. Security reports: see the <a href="/legal/security/">security policy</a>.' },
]

export const GLOSSARY = [
  { id: 'a2a', term: 'A2A (Agent2Agent)', def: 'An open protocol for agents to delegate tasks to other agents. Ogun will expose a workflow agent over A2A through a bridge process, off by default.' },
  { id: 'ade-bench', term: 'ADE-bench', def: 'A benchmark by dbt Labs for AI agents doing analytics and data engineering work: tasks in dbt projects with a DuckDB or Snowflake database, modelled on Terminal-Bench.' },
  { id: 'approval', term: 'Approval', def: 'A decision only a person can make, bound to a hash of the exact request. In Ogun: enabling a code operator, exceeding a budget, publishing outside the workspace.' },
  { id: 'artifact', term: 'Artifact', def: 'An immutable materialization with an art_ id and a content hash, plus its source, parents, producing operation, run and verification state.' },
  { id: 'asset', term: 'Asset', def: 'A logical object with versions over time, such as a weekly dataset. Each version points at artifacts.' },
  { id: 'backfill', term: 'Backfill', def: 'Running a partitioned workflow over a range of past partitions, for example every day since 2020, with per-partition status and resumption.' },
  { id: 'benchmark-profile', term: 'Benchmark profile', def: 'A run profile that switches off helpful behaviour (auto-repair, extra retries, caches, memory) and enforces isolation, so the measurement is of the agent, not of Ogun.' },
  { id: 'blake3', term: 'BLAKE3', def: 'A fast cryptographic hash. Ogun uses it for workflow hashes (over JCS) and alongside SHA-256 for artifacts.' },
  { id: 'cas', term: 'Content-addressed store (CAS)', def: 'Storage where an object’s address is its hash, so identical content is stored once and any change is detectable. The format is a zeus-core library shared with Zeus.' },
  { id: 'cost-per-success', term: 'Cost per success', def: 'Total cost of a set of runs divided by the number of successful tasks; a fairer comparison than pass rate alone.' },
  { id: 'croissant', term: 'Croissant', def: 'A metadata format for machine-learning datasets (MLCommons). Ogun’s provenance can be exported in Croissant shape through the Zeus manifest exports.' },
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
  ['Workflow orchestrators', 'Airflow, Dagster, Prefect, Kestra, Temporal', 'Scheduling and running arbitrary tasks at scale, with mature UIs and operator ecosystems.', 'Ogun focuses on acquisition and artifacts, keeps workflows as hashed data and is callable from these as a task.'],
  ['Data loading (ELT)', 'dlt, Airbyte', 'Connectors from APIs and databases into warehouses.', 'Ogun adds authenticated web and file acquisition, content-addressed artifacts and lineage down to the byte.'],
  ['Crawling and extraction', 'Scrapy, Crawl4AI, Firecrawl', 'Crawling pages and turning them into structured or LLM-ready text.', 'Ogun treats crawling as one operator among many, with durable, resumable file acquisition and provenance.'],
  ['Agent evaluation harnesses', 'Harbor, Inspect, benchmark-specific runners', 'Running tasks and scoring agents.', 'Ogun reads their formats and adds cross-benchmark matrices, harness ablations, lineage and cost accounting.'],
  ['Scripts and notebooks', 'Python, shell, cron', 'Anything, quickly.', 'Ogun gives the same work durability, approvals, sandboxing and a record of what produced what.'],
]

export const ROADMAP = [
  { when: 'Phase O0 · now', state: 'is-now', title: 'Contracts', text: 'Specs O-00 to O-08: conventions, domain model and run state machine, workflow IR v0, operator ABI, scheduling, lineage, benchmark profile, approvals, session bridge. Research on durable execution, sandboxing, harnesses and lineage formats.' },
  { when: 'Phase O1', state: '', title: 'Runtime MVP', text: 'ogund and the ogun CLI; IR validator; durable run store; core operators and DuckDB; plan, run, status, backfill; a small MCP tool set. Exit test: a partitioned backfill survives kill -9 and resumes only incomplete partitions.' },
  { when: 'Phase O2', state: '', title: 'Data and model operators', text: 'Python, SQL and dbt adapters with sandbox profiles; Ogun’s own LLM provider ladder and LLM operators; assets, schedules and triggers; the Python SDK and YAML; the Zeus session bridge.' },
  { when: 'Phase O3', state: '', title: 'Benchmark profile', text: 'Container environments, Spider 2.0-DBT and ADE-bench adapters, trajectories and replay, matrix runs and the metrics above.' },
  { when: 'Phase O4', state: '', title: 'Studio and A2A', text: 'Ogun Studio: runs, workflows, artifacts, lineage, datasets, agents, schedules and benchmarks, with an approval inbox. An A2A agent card and bridge, off by default.' },
]

export const NOT_BUILT = ['A dataframe library or SQL engine', 'A browser, an OCR engine or a vector database', 'A foundation model', 'A full Airflow or dbt replacement', 'Captcha or anti-bot circumvention', 'A generic RPA platform', 'Telemetry of any kind']
