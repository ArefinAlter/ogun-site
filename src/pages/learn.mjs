import { icon, mark } from '../art/index.mjs'
import { altOf, PAGE_ART } from '../art/library.mjs'
import { artImg } from '../art/pixel.mjs'
import { COMPARE, FAQ, GLOSSARY, NOT_BUILT, ROADMAP } from '../content.mjs'
import { answer, cards, checklist, ctaForge, faqList, note, pageHead, section, statusNote, table } from '../parts.mjs'
import { RELEASE } from '../release.mjs'
import { downloadCards, heroDownload, uiIcon } from '../download.mjs'

const UPDATED = '2026-10-25'
const groups = [...new Set(FAQ.map((q) => q.group))]
const gid = (g) => 'g-' + g.toLowerCase().replace(/\W+/g, '-')

const faq = {
  path: '/faq/',
  order: 20,
  group: 'Learn',
  nav: 'FAQ',
  priority: 0.8,
  updated: UPDATED,
  title: 'Ogun FAQ: data pipelines, reproducibility and benchmarks',
  description: 'Straight answers about Ogun: status, relation to Zeus, orchestrators, the workflow IR, durability, browser sessions, LLM costs, benchmarks and licensing.',
  crumbs: [{ name: 'FAQ', path: '/faq/' }],
  faq: FAQ,
  body: (ctx) => `
${pageHead({ crumbs: [{ name: 'FAQ', path: '/faq/' }], title: 'Frequently asked questions', lede: `If your question is not here, write to ${ctx.cfg.contacts.general}.` })}
<div class="wrap wrap--narrow section--tight">${groups.map((g) => `<section class="faq-group" aria-labelledby="${gid(g)}"><h2 id="${gid(g)}">${g}</h2>${faqList(FAQ.filter((q) => q.group === g))}</section>`).join('')}</div>
${ctaForge(ctx.cfg)}`,
}

const letters = [...new Set(GLOSSARY.map((t) => t.term[0].toUpperCase()))].sort()
const sorted = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term))
const glossary = {
  path: '/glossary/',
  order: 21,
  group: 'Learn',
  nav: 'Glossary',
  priority: 0.6,
  updated: UPDATED,
  title: 'Glossary: data engineering and agent benchmark terms',
  description: 'Definitions for Ogun and its field: artifacts, lineage, CAS, the workflow IR, operators, partitions, backfills, harness gain, Spider 2.0-DBT, ADE-bench.',
  crumbs: [{ name: 'Glossary', path: '/glossary/' }],
  terms: GLOSSARY,
  pageType: 'CollectionPage',
  body: (ctx) => `
${pageHead({ crumbs: [{ name: 'Glossary', path: '/glossary/' }], title: 'Glossary', lede: 'Terms used on this site and in the Ogun specifications.' })}
<div class="wrap wrap--narrow section--tight"><nav class="alpha" aria-label="Jump to letter">${letters.map((l) => `<a href="#letter-${l.toLowerCase()}">${l}</a>`).join('')}</nav>
${letters.map((l) => `<h2 class="visually-hidden" id="letter-${l.toLowerCase()}">${l}</h2><dl class="terms">${sorted.filter((t) => t.term[0].toUpperCase() === l).map((t) => `<div class="term" id="${t.id}"><dt>${t.term}${t.aka ? `<span class="aka">also: ${t.aka}</span>` : ''}</dt><dd>${t.def}</dd></div>`).join('')}</dl>`).join('')}</div>
${ctaForge(ctx.cfg)}`,
}

const compare = {
  path: '/compare/',
  order: 22,
  group: 'Learn',
  nav: 'Compare',
  priority: 0.7,
  updated: UPDATED,
  title: 'Ogun vs Airflow, Dagster, dlt, Firecrawl and eval harnesses',
  description: 'Where Ogun fits next to workflow orchestrators, ELT tools, crawlers and agent evaluation harnesses, and why it integrates with them instead of replacing them.',
  crumbs: [{ name: 'Compare', path: '/compare/' }],
  speakable: ['.answer-text'],
  body: (ctx) => `
${pageHead({ crumbs: [{ name: 'Compare', path: '/compare/' }], title: 'How Ogun compares', lede: 'Ogun overlaps with several mature categories of tools. It is meant to work alongside them, not to replace them.' })}
<div class="wrap wrap--narrow">${answer({ title: 'How is Ogun different?', text: 'Orchestrators schedule arbitrary tasks; ELT tools load APIs and databases into warehouses; crawlers turn pages into text; evaluation harnesses score agents. Ogun is the local-first runtime that turns authenticated, messy sources into verified, reproducible data artifacts, with lineage for every byte, and it plugs into the others rather than replacing them.' })}</div>
${section({ id: 'table', title: 'By category', body: `${table({ caption: 'Categories, typical focus, and where Ogun sits (October 2026)', head: ['Category', 'Examples', 'Their focus', 'Ogun'], rows: COMPARE })}${note('<p>Categories, not verdicts: every project named here is good at what it does, and several are planned integration targets. Orchestration is also consolidating (Prefect announced on 13 July 2026 that it had agreed to acquire Dagster Labs, with Dagster continuing as open source). Spot an error? info@vernesystems.com.</p>', 'book')}` })}
${section({ id: 'together', cls: 'section--band', title: 'Using Ogun with other tools', body: cards([
  { icon: 'gear', title: 'Under an orchestrator', text: 'The repository has integrations that start and watch Ogun runs from an Airflow DAG, a Dagster asset, a Prefect flow and a Kestra flow, and a Python client of the local API. They are not on PyPI yet and were tested against fakes.' },
  { icon: 'database', title: 'Before a warehouse', text: 'Ogun acquires and verifies; DuckDB or dbt operators shape; Parquet and lineage events go wherever your warehouse loads from.' },
  { icon: 'agent', title: 'Beside your agents', text: 'Your coding agent drafts a workflow over MCP; Ogun validates it and shows a plan diff; a person approves any new code; Ogun runs the partitions and retries only the ones that failed.' },
]) })}
${section({ id: 'zeus', title: 'Ogun and Zeus', body: `<div class="split"><div data-reveal><p class="lede">Zeus is Verne’s session-aware download and file layer for AI agents: your agent asks, Zeus fetches, you decide. Ogun is for engineers building datasets, pipelines and benchmarks. Both run on zeus-core.</p><a class="btn btn--ghost" href="${ctx.cfg.sibling.url}">Visit Zeus ${icon('arrow', 'icon icon--arrow')}</a></div><div data-reveal data-delay="120">${checklist(['Need your AI assistant to download a file? Zeus.', 'Need a scheduled, partitioned, verified dataset? Ogun.', 'Need a source behind your browser login in a pipeline? Ogun, through Zeus.'])}</div></div>` })}
${ctaForge(ctx.cfg)}`,
}

const roadmap = {
  path: '/roadmap/',
  order: 23,
  group: 'Learn',
  nav: 'Roadmap',
  priority: 0.7,
  changefreq: 'weekly',
  updated: UPDATED,
  title: 'Ogun roadmap: contracts, runtime, operators, benchmarks, Studio',
  description: 'Ogun’s phases from the contracts (done) and the runtime MVP (now) to data and model operators, the benchmark profile and Studio, with each phase’s exit test.',
  crumbs: [{ name: 'Roadmap', path: '/roadmap/' }],
  body: (ctx) => `
${pageHead({ crumbs: [{ name: 'Roadmap', path: '/roadmap/' }], title: 'Roadmap', lede: 'Targets, not promises. Each phase ends with an exit test; built is not the same as released.' })}
${section({ id: 'phases', body: `<div class="wrap--narrow"><ol class="timeline">${ROADMAP.map((r) => `<li class="${r.state}" data-reveal><span class="when">${r.when}</span><h3>${r.title}</h3><p>${r.text}</p></li>`).join('')}</ol></div>` })}
${section({ id: 'not', cls: 'section--band', title: 'Out of scope', body: `<div class="wrap--narrow" data-reveal>${checklist(NOT_BUILT, true)}</div>` })}
${ctaForge(ctx.cfg)}`,
}

const getStarted = {
  path: '/get-started/',
  order: 24,
  group: 'Learn',
  nav: 'Get started',
  priority: 0.8,
  changefreq: 'weekly',
  updated: UPDATED,
  title: 'Get started with Ogun: try the pre-alpha',
  description: 'Try Ogun 0.0.1c, a pre-alpha: download Ogun Studio, a standalone desktop app with its own engine, for Windows and Linux, or open the hosted hub with sample data.',
  crumbs: [{ name: 'Get started', path: '/get-started/' }],
  body: (ctx) => `
${pageHead({ crumbs: [{ name: 'Get started', path: '/get-started/' }], title: 'Try the pre-alpha', lede: `Ogun ${RELEASE.version} is a pre-alpha: the runtime works end to end, much of the product is still being built, and things will change. Try it in the browser on sample data, or download it for Windows or Linux.`, actions: `${heroDownload(RELEASE, { cls: 'btn btn--ember' })}<a class="btn btn--ghost" href="${RELEASE.hosted}/" rel="noopener">${uiIcon('globe')}Open the hosted hub</a>` })}
<div class="wrap wrap--narrow">${statusNote(ctx.cfg)}</div>
${section({ id: 'try', title: 'Try it in the browser', body: `<div class="split"><div data-reveal><p class="lede">The hosted hub runs Ogun Studio on the real daemon with sample workflows: runs, partitions, backfills, approvals, artifacts and lineage, and an agent that reads the daemon for you. Its sign-in page shows a shared sample account.</p><div class="btn-row"><a class="btn btn--ember" href="${RELEASE.hosted}/" rel="noopener">Open the hosted hub ${icon('arrow', 'icon icon--arrow')}</a></div><p class="small muted">The hosted hub runs 0.0.1c and accepts desktop browser sign-in. Shared by every visitor and reset every night at 03:00 UTC, so do not enter anything private. The agent's replies are prepared (no model is called) while its tool calls read the real daemon. Code operators do not run there, and approvals are decided only at the host's terminal.</p></div><div class="center" data-reveal data-delay="120"><span class="lost-gear">${mark('gs')}</span></div></div>` })}
${section({ id: 'download', cls: 'section--band', title: 'Download', lede: `${RELEASE.title}, released ${RELEASE.date}. The desktop Studio runs its own engine on your machine and needs no account or network; a hub is optional (Settings, Environments).`, body: `${downloadCards(RELEASE)}<div class="wrap--narrow dl-after" data-reveal>${checklist([
  'Windows: run the installer, or unzip the portable build and start ogun-studio.exe.',
  'Linux: make the AppImage executable (<code>chmod +x</code>) and run it, or install the .deb with <code>sudo apt install ./ogun-studio-0.0.1c-linux-x64.deb</code>.',
  'ogun, ogund and ogun-server: the command line, the daemon and the team hub, for use without Studio. Start ogund, then <code>ogun daemon status</code>. Studio does not need them: it carries its own.',
])}</div>` })}
${section({ id: 'read', cls: 'section--band', title: 'What to read first', body: cards([
  { icon: 'book', title: 'Architecture', text: 'The parts, the trust boundaries and the decision records.', link: ['Read', '/architecture/'] },
  { icon: 'ledger', title: 'Workflows', text: 'The IR, authoring, the run state machine, triggers and backfills.', link: ['Read', '/workflows/'] },
  { icon: 'cube', title: 'Lineage', text: 'Artifacts, the content-addressed store and exports.', link: ['Read', '/lineage/'] },
  { icon: 'matrix', title: 'Benchmarks', text: 'The profile, isolation, trajectories and metrics.', link: ['Read', '/benchmarks/'] },
]) })}
${section({ id: 'need', title: 'What you need', body: `<div class="wrap--narrow" data-reveal>${checklist(['Windows 10 or 11 x64, or Linux x64 with glibc 2.35 or later, for release 0.0.1c. macOS builds are planned (O-12)', 'The tools your operators wrap (DuckDB, pdftotext, Tesseract, dbt, Python and so on) installed where ogund runs, or in an image that provides them: the release does not bundle them', 'On Linux, bubblewrap for code operators (Windows uses its own AppContainer, which ships in the installer, with the Python it carries)', 'Docker or podman for the benchmark profile (on Windows, Docker or WSL 2)', 'Optionally, the Zeus app, for sources behind a browser login', 'Optionally, a model provider of your choice, for LLM operators'])}</div>` })}
${ctaForge(ctx.cfg, { title: 'Tell us what broke', text: 'This is a pre-alpha: feedback now changes what gets built next. Write to info@vernesystems.com, or open an issue on GitHub.', primary: ['Open the hosted hub', RELEASE.hosted + '/'], secondary: ['See the roadmap', '/roadmap/'] })}`,
}

const about = {
  path: '/about/',
  order: 30,
  group: 'Company',
  nav: 'About',
  priority: 0.6,
  updated: UPDATED,
  title: 'About Ogun and Verne Ltd.',
  description: 'Ogun is made by Verne Ltd., a forward-deployed AI engineering firm in Dhaka. Why Ogun exists, how it relates to Zeus, our principles, and how to reach us.',
  crumbs: [{ name: 'About', path: '/about/' }],
  pageType: 'AboutPage',
  speakable: ['.answer-text'],
  body: (ctx) => {
    const o = ctx.cfg.org
    return `
${pageHead({ crumbs: [{ name: 'About', path: '/about/' }], title: 'About Ogun', lede: 'Ogun is made by Verne Ltd., which builds AI systems for organisations. In that work we kept needing a reliable record of where data came from, and acquisitions that kept going when sources failed. Ogun is the tool for that.' })}
<div class="wrap wrap--narrow">${answer({ title: 'Who makes Ogun?', text: `Ogun is made by ${o.legalName}, a forward-deployed AI engineering firm founded in ${o.founded} in Dhaka, Bangladesh. Verne designs and builds AI agents, operational software, data systems and integrations, and publishes Ogun and Zeus as open-source products.`, facts: [['Company', `${o.legalName} (<a href="${o.url}">vernesystems.com</a>)`], ['Founded', o.founded], ['Based in', `${o.address.city}, ${o.address.countryName}`], ['Products', `Ogun and <a href="${ctx.cfg.sibling.url}">Zeus</a>`], ['Contact', `<a href="mailto:${o.email}">${o.email}</a>`]] })}</div>
${section({ id: 'why', title: 'Why Ogun exists', body: `<div class="wrap--narrow" data-reveal><p class="lede">Most data trouble starts at acquisition: the login, the expiring link, the half-downloaded archive, the PDF nobody can trace back. Then models and agents arrive and multiply the output, and the question “where did this come from?” gets harder to answer.</p><p>Ogun records each step: what was fetched, from where, by which operator and model, in which run. People approve the steps that cost money, run code or publish data. The imagery on this site is forge paintings of the eighteenth and nineteenth centuries, translated into pixels, and the plate captions follow the metallurgy treatises that wrote down their processes so others could repeat them.</p></div>` })}
${section({ id: 'name', cls: 'section--band', title: 'Ògún', body: `<div class="wrap--narrow" data-reveal><p class="lede">Ògún is the Yoruba orisha associated with iron, metalwork and the making of tools. We chose the name to honour that craft. Out of respect we do not depict the orisha or use sacred symbols; the art on this site is public-domain European paintings of forges and ironworks, translated into pixels, and our own diagrams of machines. The <a href="/credits/">art credits</a> name every painting.</p></div>` })}
${section({ id: 'contact', title: 'Contact', body: `<div class="split split--top"><dl class="kv" data-reveal><dt>General</dt><dd><a href="mailto:${o.email}">${o.email}</a></dd><dt>Phone</dt><dd><a href="tel:${o.phone.replace(/\s/g, '')}">${o.phone}</a></dd><dt>Post</dt><dd>${o.legalName}, ${o.address.street}, ${o.address.neighborhood}, ${o.address.city}-${o.address.postalCode}, ${o.address.countryName}</dd></dl><dl class="kv" data-reveal data-delay="120"><dt>LinkedIn</dt><dd><a href="${o.social.linkedin}" rel="me">Verne</a></dd><dt>X</dt><dd><a href="${o.social.x}" rel="me">@VerneOf</a></dd><dt>GitHub</dt><dd><a href="${o.social.github}" rel="me">vernesystems</a></dd><dt>Registration</dt><dd><a href="/legal/company/">Company details</a></dd></dl></div>` })}
${ctaForge(ctx.cfg)}`
  },
}

const SWATCHES = [['Forge', '#13110F', 'Dark background'], ['Soot', '#1C1916', 'Surfaces'], ['Vellum', '#F1E9D8', 'Plates, light theme'], ['Iron-gall ink', '#1E1A16', 'Text on vellum'], ['Ember', '#E8662E', 'Accent, running'], ['Brass', '#B89157', 'Instruments, labels'], ['Verdigris', '#5FAE9C', 'Succeeded'], ['Quench', '#7AA6CF', 'Info, sessions'], ['Cinnabar', '#E0604A', 'Failed']]
const ASSETS = [['lockup-light', 'Logo (lockup)', true], ['lockup', 'Logo on vellum'], ['mark-light', 'Mark', true], ['mark', 'Mark on vellum'], ['wordmark-light', 'Wordmark', true], ['pixel-wordmark', 'Pixel wordmark', true], ['pixel-wordmark-light', 'Pixel wordmark on vellum'], ['plate-forge', 'Engraved plate, the forge'], ['plate-windlass', 'Engraved plate, the windlass']]

const brand = {
  path: '/brand/',
  order: 31,
  group: 'Company',
  nav: 'Brand & press',
  priority: 0.4,
  updated: UPDATED,
  title: 'Ogun brand and press kit: logos, colours, plates',
  description: 'Download the Ogun logo, mark and pixel wordmark, see the colours and typefaces, read how the forge paintings are treated, and get boilerplate for writing about Ogun.',
  crumbs: [{ name: 'Brand & press', path: '/brand/' }],
  body: (ctx) => `
${pageHead({ crumbs: [{ name: 'Brand & press', path: '/brand/' }], title: 'Brand and press kit', lede: 'Logos, the pixel wordmark, colours, typefaces and boilerplate for writing about Ogun. The paintings are credited on the <a href="/credits/">art credits</a> page.' })}
${section({ id: 'assets', title: 'Logos and plates', lede: 'SVG, free to use when referring to Ogun. Please do not alter the logo or use it for another product.', body: `<div class="asset-grid">${ASSETS.map(([f, label, dark]) => `<a class="asset${dark ? ' asset--dark' : ''}" href="/art/${f}.svg" download data-reveal><img src="/art/${f}.svg" alt="${label}" loading="lazy" width="200" height="120"><span>${label} · svg</span></a>`).join('')}</div>` })}
${section({ id: 'colour', cls: 'section--band', title: 'Colour', lede: 'Dark by default, light on request; plates are always vellum. Every text pair meets WCAG AA.', body: `<div class="swatches">${SWATCHES.map(([n, hex, use]) => `<div class="swatch" data-reveal><i class="sw-${hex.slice(1).toLowerCase()}"></i><div><strong>${n}</strong><code>${hex}</code><br><span class="muted">${use}</span></div></div>`).join('')}</div>` })}
${section({ id: 'type', title: 'Typography', body: `<div class="type-specimen" data-reveal><p class="disp">EB Garamond, <em>a Renaissance roman</em></p><p class="body">IBM Plex Sans for reading and interface text, built for engineering documents.</p><p class="code">IBM Plex Mono for code, data and terminals.</p><p class="pix">DEPARTURE MONO FOR LABELS AND THE WORDMARK</p><p class="small muted">All four are open fonts under the SIL Open Font License, self-hosted. The lockup is outlined from EB Garamond capitals; the pixel wordmark is read from Departure Mono at its native 5 by 8 pixel grid.</p></div>` })}
${section({ id: 'boilerplate', cls: 'section--band', title: 'Boilerplate', body: `<div class="code-block" data-reveal><button class="copy-btn" type="button" data-copy="boiler">${icon('copy')}<span class="copy-label">copy</span></button><p id="boiler">Ogun is a local-first developer platform for data acquisition, data engineering and AI-agent benchmarks, made by Verne Ltd. Built on the Zeus download engine, it treats workflows as hashed data, keeps runs durable across crashes, records lineage for every artifact, and has adapters for benchmark tasks such as Spider 2.0-DBT and ADE-bench, run in isolation. Ogun is open source under Apache-2.0 and sends no telemetry. Learn more at ${new URL(ctx.cfg.url).host}.</p></div><p data-reveal>Press: <a href="mailto:${ctx.cfg.contacts.press}">${ctx.cfg.contacts.press}</a> · Usage rules: <a href="/legal/trademark/">trademark policy</a></p>` })}
${ctaForge(ctx.cfg)}`,
}

const notFound = {
  path: '/404/',
  order: 99,
  noindex: true,
  product: false,
  title: 'Not found: Ogun',
  description: 'This page could not be found. The link may be mistyped or the page has moved. Try the Ogun home page, the architecture or the glossary.',
  body: () => `<figure class="band-art page-banner page-banner--tall">${artImg(PAGE_ART['/404/'].banner, { alt: altOf(PAGE_ART['/404/'].banner) })}</figure><section class="lost wrap" aria-labelledby="lost-title"><h1 id="lost-title">Page not found</h1><p class="lede center">The page may have moved, or the link may be mistyped.</p><div class="btn-row"><a class="btn btn--ember" href="/">Home</a><a class="btn btn--ghost" href="/architecture/">Architecture</a><a class="btn btn--ghost" href="/glossary/">Glossary</a></div></section>`,
}

export default [faq, glossary, compare, roadmap, getStarted, about, brand, notFound]
