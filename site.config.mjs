// Single source of truth for site-wide facts. Company facts mirror vernesystems.com (src/lib/site.ts in vernesystems-web).
// Change the domain here once: canonical URLs, sitemap, robots, llms.txt, security.txt and structured data follow.

const verne = {
  name: 'Verne',
  legalName: 'Verne Ltd.',
  url: 'https://vernesystems.com',
  email: 'info@vernesystems.com',
  phone: '+880 1870 034384',
  founded: '2024',
  twitterHandle: '@VerneOf',
  address: { street: '8/A, Sher-e-Bangla Road', neighborhood: 'Zighatola', city: 'Dhaka', postalCode: '1209', country: 'BD', countryName: 'Bangladesh' },
  social: {
    linkedin: 'https://www.linkedin.com/company/verneoff',
    x: 'https://x.com/VerneOf',
    github: 'https://github.com/vernesystems',
    instagram: 'https://www.instagram.com/vernehq/',
    facebook: 'https://www.facebook.com/vernehq/',
  },
  registration: { duns: '73-196-3992', tin: '875405965141', tradeLicense: 'TRAD/DSCC/035498/2024', companyRegistration: 'C-201411-1' },
}

export default {
  id: 'ogun',
  name: 'Ogun',
  url: 'https://ogun.vernesystems.com',
  lang: 'en',
  locale: 'en_US',
  updated: '2026-10-25',
  published: '2026-10-06',
  themeColor: '#13110F',
  backgroundColor: '#13110F',
  colorScheme: 'dark light',
  tagline: 'The forge for reproducible data.',
  description:
    'Ogun is a local-first developer platform for data acquisition, data engineering and AI-agent benchmarks, built on the Zeus engine. Workflows are data; every artifact has a lineage.',
  ogAlt: 'Ogun: an engraved plate of an anvil, a hammer and meshing gears, titled "The forge for reproducible data".',
  status: 'Pre-alpha release',
  statusNote: 'Release 0.0.1a is a pre-alpha: Ogun Studio for Windows and Linux, the ogun command line and the ogund daemon, and a hosted hub on sample data that anyone can try. The runtime passed its first exit test on Linux in October 2026 (a partitioned backfill and a stream window survive kill -9 of the daemon and resume only the unfinished work). Code operators, remote approvals, mobile builds and most connectors are not ready yet.',
  sourcePublic: false,
  repo: 'https://github.com/ArefinAlter/ogun',
  sibling: { name: 'Zeus', url: 'https://zeus.vernesystems.com', line: 'Need everyday downloads for your AI assistant, not pipelines? Zeus is the consumer app built on the same engine.' },
  org: verne,
  contacts: { general: verne.email, privacy: verne.email, security: verne.email, legal: verne.email, press: verne.email },
  // The host named in the privacy policy and cookie notice. Change both if the site moves.
  hosting: { name: 'Vercel Inc.', privacy: 'https://vercel.com/legal/privacy-policy' },
  product: {
    name: 'Ogun',
    alternateName: 'Ogun by Verne',
    category: 'DeveloperApplication',
    subCategory: 'Data pipeline and agent benchmark runtime',
    os: 'Windows, macOS, Linux',
    version: 'pre-alpha (runtime in development, no release)',
    features: [
      'Durable workflows defined as data: a JSON intermediate representation hashed with JCS and BLAKE3',
      'Authoring in YAML, a Python SDK or natural language, always compiled to the same validated IR',
      'Resumable, verified acquisition on the embedded Zeus engine (zeus-core)',
      'Partitions, backfills and schedules with time, event, data and condition triggers',
      'Operators for DuckDB, dbt, Polars, ffmpeg, pandoc, OCR, Python and LLM extraction, sandboxed out of process',
      'Content-addressed artifact store with full lineage and OpenLineage export',
      'Benchmark profile for data and terminal agents: Spider 2.0-DBT, ADE-bench and Harbor-format tasks',
      'Human-only approvals, no telemetry, local-first, Apache-2.0',
    ],
    keywords: ['data pipeline', 'data engineering', 'data mining', 'LLM dataset', 'agent benchmark', 'Spider 2.0-DBT', 'ADE-bench', 'workflow orchestration', 'lineage', 'local-first', 'Rust'],
  },
  fonts: {
    names: ['EB Garamond', 'IBM Plex Sans', 'IBM Plex Mono'],
    preload: ['/fonts/eb-garamond-vf.woff2', '/fonts/ibm-plex-sans-vf.woff2'],
  },
  nav: [
    { label: 'Architecture', path: '/architecture/' },
    { label: 'Workflows', path: '/workflows/' },
    { label: 'Operators', path: '/operators/' },
    { label: 'Lineage', path: '/lineage/' },
    { label: 'Benchmarks', path: '/benchmarks/' },
  ],
  footer: [
    { title: 'Platform', links: [['Architecture', '/architecture/'], ['Workflows', '/workflows/'], ['Operators', '/operators/'], ['Lineage', '/lineage/'], ['Benchmarks', '/benchmarks/'], ['Security model', '/security-model/']] },
    { title: 'Learn', links: [['FAQ', '/faq/'], ['Glossary', '/glossary/'], ['Compare', '/compare/'], ['Roadmap', '/roadmap/'], ['Get started', '/get-started/']] },
    { title: 'Company', links: [['About', '/about/'], ['Brand & press', '/brand/'], ['Security', '/legal/security/'], ['Contact', 'mailto:info@vernesystems.com']] },
    { title: 'Legal', links: [['Privacy', '/legal/privacy/'], ['Terms', '/legal/terms/'], ['Acceptable use', '/legal/acceptable-use/'], ['Cookies', '/legal/cookies/'], ['Trademarks', '/legal/trademark/'], ['Licenses', '/legal/licenses/'], ['Accessibility', '/legal/accessibility/'], ['Company details', '/legal/company/']] },
  ],
  llms: {
    summary:
      'Ogun is a local-first developer platform for data acquisition, data engineering and AI-agent benchmarks, made by Verne Ltd. (Dhaka, Bangladesh) and built on the Zeus download engine (zeus-core, Rust). Workflows are data (a hashed JSON IR authored in YAML, Python or natural language), runs are durable and resumable, operators such as DuckDB, dbt and OCR run sandboxed, every artifact is content-addressed with lineage, and a benchmark profile runs Spider 2.0-DBT, ADE-bench and Harbor-format tasks in isolation. Apache-2.0, no telemetry. Status: pre-alpha, runtime in development, no release (October 2026).',
    facts: [
      'Maker: Verne Ltd., https://vernesystems.com',
      'License: Apache-2.0; no telemetry; local-first',
      'Engine: embeds zeus-core (Rust) for resumable, verified transfers; browser-session sources only through the Zeus daemon as a service client',
      'Workflow IR: JSON, no floating point, JCS + BLAKE3 workflow hash, closed template and predicate sets; never prompt-to-shell',
      'Run states: pending, ready, running, waiting, waiting_for_user, waiting_for_session, retry_scheduled, succeeded, failed, cancelled, skipped',
      'Benchmarks: Spider 2.0-DBT (68 tasks), ADE-bench (dbt Labs), Terminal-Bench 2.0 via the Harbor task format; official evaluators unmodified',
      'Status: pre-alpha, no release. Specs O-00 to O-15 are Draft 1. The runtime passed its phase O1 exit test on Linux in October 2026 (a partitioned backfill and a stream window survive kill -9 and resume only unfinished work).',
      'Sibling product: Zeus, the session-aware download and file layer for AI agents (https://zeus.vernesystems.com)',
    ],
    groups: ['Platform', 'Learn', 'Company', 'Legal'],
  },
}
