import cfg from '../../site.config.mjs'
import { legalPages } from '../legal.mjs'

export default legalPages(cfg, {
  hasExtension: false,
  hostedTitle: 'The hosted pre-alpha hub',
  hostedPrivacy: `<p>Verne runs a pre-alpha hub at ${'https://ogun.103.191.50.32.sslip.io'} on its own server so you can try Ogun Studio without installing anything. It is a shared sample: one sample account whose password is shown on its sign-in page, sample data, and a reset every night.</p>
<ul><li><strong>What it keeps:</strong> what you store there (workflows, runs and their outputs) until the nightly reset, visible to every other visitor; agent threads and settings you change, per browser, for 24 hours. Do not enter anything private or personal.</li><li><strong>Cookies:</strong> a sign-in session cookie and an anonymous visitor cookie, both needed for the service to work, no tracking.</li><li><strong>Logs:</strong> the web server keeps ordinary request logs (IP address, time, address, user agent), rotated, to keep the service working and secure.</li><li><strong>No model:</strong> the agent on the hub calls no AI model; nothing you type is sent to a third party.</li></ul>`,
  softwarePrivacy: `<p>Ogun runs on your machine. It sends nothing to Verne: no telemetry, no analytics, no crash reports, no account. The one exception is your choice of hub: the 0.0.1a desktop Studio opens on the hosted pre-alpha hub described below, and switches to your own daemon in Settings, Environments.</p>
<h3>What Ogun keeps on your machine</h3>
<ul><li>Workflows, their versions and hashes; run records, events, checkpoints and the cost ledger.</li><li>The content-addressed artifact store and lineage records, including source addresses (with secret parameters redacted in logs and exports).</li><li>An audit log of approvals and policy changes.</li><li>Secrets you give ogund for data sources and model providers (<code>ogun secrets</code>), kept in a secrets folder in its state directory that only your user can read, zeroized in memory, and never logged or written to run records.</li></ul>
<p>Datasets you collect may contain personal data published by others. You are responsible for handling it lawfully; Ogun’s lineage and deletion tools are there to help.</p>
<h3>Network connections</h3>
<p>Ogun connects only to the sources your workflows name, to model providers you configure for LLM operators (sending only what the operator and your privacy setting allow), and, if you link it, to the Zeus app on the same computer. Benchmark runs have network access only if the benchmark requires it.</p>
<h3>Browser sessions</h3>
<p>Ogun never handles browser cookies. Sources behind a browser login are acquired by the Zeus app on your behalf, after you approve the site in Zeus; Ogun receives the files and their provenance, not the session.</p>`,
  aupOk: '<li>Building datasets from sources you are allowed to collect, and evaluating agents on benchmarks under their licences.</li>',
  aupNot: '<li>Train or evaluate on data in breach of its licence or of the rights of the people it describes.</li><li>Use the benchmark profile to misrepresent results, for example by hiding cache or network settings that differ between agents.</li>',
  aupDesign: 'When it collects from websites, it follows robots.txt by default, spaces out requests per host and limits concurrency. Code-executing operators run sandboxed and need a person’s approval.',
  otherMarks: 'the gear-and-anvil device',
  artNames: 'engraved plates of the forge, the windlass, the lifecycle and the gear trains',
  nameNote: 'Ògún is the name of a Yoruba orisha. Our use covers software and services for data acquisition, data engineering and agent evaluation only. We do not claim any right in the name beyond that field, and we do not use sacred imagery.',
  softwareList: 'Ogun (ogund, the ogun command line, its MCP server and bridges) and the zeus-core engine library it embeds',
  fonts: [
    ['EB Garamond', 'Copyright 2017 The EB Garamond Project Authors', 'LICENSE-eb-garamond.txt'],
    ['IBM Plex Sans', 'Copyright 2019 IBM Corp.', 'LICENSE-ibm-plex-sans.txt'],
    ['IBM Plex Mono', 'Copyright 2017 IBM Corp.', 'LICENSE-ibm-plex-mono.txt'],
  ],
  securityScope: ['ogund, the ogun command line and its MCP server and bridges.', 'Operator sandboxing and the operator ABI.', 'The artifact store and lineage records.', 'The zeus-core engine library as embedded by Ogun, and the session bridge to Zeus.'],
  securityPriorities: [
    'Any way for an agent, a web page, an operator or a dataset to approve a request, widen a budget or obtain credentials.',
    'Escaping an operator sandbox, or an operator reading files or network it did not declare.',
    'Secrets reaching logs, events, lineage records, error messages or model prompts.',
    'Benchmark runs reaching the user’s artifact stores, the Zeus daemon or the network when they should not.',
    'Corrupting the run journal or the artifact store so that Ogun reports work it did not do.',
  ],
  securityDesign: 'Ogun never holds browser session material; code runs only in sandboxed child processes; approvals are bound to request hashes and decided only on human trust surfaces; the daemon has a single local endpoint; secrets are zeroized and never serialized; benchmark runs are sealed by default.',
  a11yLimits: 'The engraved figures and the partition grid are visual; the same information is in the text around them and on the <a href="/architecture/">architecture</a> and <a href="/workflows/">workflows</a> pages. Terminal transcripts are text.',
  a11ySoftware: 'The ogun command line prints plain text or, with --json, JSON; it prints no colour or animation. Ogun Studio uses system fonts, keyboard navigation and light and dark themes and aims at WCAG 2.2 AA; it has not been audited yet.',
})
