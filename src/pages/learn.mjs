import { brokenGear, icon, mark } from '../art/index.mjs'
import { COMPARE, FAQ, GLOSSARY, NOT_BUILT, ROADMAP } from '../content.mjs'
import { answer, cards, checklist, ctaForge, faqList, note, pageHead, section, statusNote, table } from '../parts.mjs'

const UPDATED = '2026-10-23'
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
${section({ id: 'table', title: 'By category', body: `${table({ caption: 'Categories, typical focus, and where Ogun sits (October 2026)', head: ['Category', 'Examples', 'Their focus', 'Ogun'], rows: COMPARE })}${note('<p>Categories, not verdicts: every project named here is good at what it does, and several are planned integration targets. Orchestration is also consolidating (Prefect announced its acquisition of Dagster Labs on 13 July 2026, with Dagster continuing as open source). Spot an error? info@vernesystems.com.</p>', 'book')}` })}
${section({ id: 'together', cls: 'section--band', title: 'Using Ogun with other tools', body: cards([
  { icon: 'gear', title: 'Under an orchestrator', text: 'Call ogun run or the local API from a Prefect task, a Dagster resource, an Airflow operator, a Kestra plugin, a Temporal activity or a GitHub Action.' },
  { icon: 'database', title: 'Before a warehouse', text: 'Ogun acquires and verifies; DuckDB or dbt operators shape; Parquet and lineage events go wherever your warehouse loads from.' },
  { icon: 'agent', title: 'Beside your agents', text: 'Your coding agent writes an extractor; Ogun runs it over 100 000 files; a QA agent reviews failures; Ogun retries only the failed partitions.' },
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
  title: 'Get started with Ogun: early access and the design documents',
  description: 'Ogun is pre-alpha with no release yet. How to get early access, what to read first, what you will need, and how to give feedback on the specifications.',
  crumbs: [{ name: 'Get started', path: '/get-started/' }],
  body: (ctx) => `
${pageHead({ crumbs: [{ name: 'Get started', path: '/get-started/' }], title: 'Get started', lede: 'There is nothing to install yet: the runtime runs in development and has no release. You can read the design and send feedback while the specifications are a first draft.' })}
<div class="wrap wrap--narrow">${statusNote(ctx.cfg)}</div>
${section({ id: 'access', title: 'Early access', body: `<div class="split"><div data-reveal><p class="lede">Tell us what you build, which sources you fight with and which benchmarks you run. We will write when a build can run your first workflow.</p><div class="btn-row"><a class="btn btn--ember" href="mailto:${ctx.cfg.contacts.general}?subject=Ogun%20early%20access&amp;body=I%20build%3A%0AMy%20sources%3A%0ABenchmarks%20I%20care%20about%3A%0A">${icon('mail')} Email for early access</a><a class="btn btn--ghost" href="${ctx.cfg.org.social.linkedin}" rel="me">Follow Verne</a></div></div><div class="center" data-reveal data-delay="120"><span class="lost-gear">${mark('gs')}</span></div></div>` })}
${section({ id: 'read', cls: 'section--band', title: 'What to read first', body: cards([
  { icon: 'book', title: 'Architecture', text: 'The parts, the trust boundaries and the decision records.', link: ['Read', '/architecture/'] },
  { icon: 'ledger', title: 'Workflows', text: 'The IR, authoring, the run state machine, triggers and backfills.', link: ['Read', '/workflows/'] },
  { icon: 'cube', title: 'Lineage', text: 'Artifacts, the content-addressed store and exports.', link: ['Read', '/lineage/'] },
  { icon: 'matrix', title: 'Benchmarks', text: 'The profile, isolation, trajectories and metrics.', link: ['Read', '/benchmarks/'] },
]) })}
${section({ id: 'need', title: 'Requirements for the first release', body: `<div class="wrap--narrow" data-reveal>${checklist(['Windows, macOS or Linux', 'The tools your operators wrap (DuckDB, dbt, Python and so on), or an environment image that provides them', 'Docker or WSL 2 for the benchmark profile', 'Optionally, the Zeus app, for sources behind a browser login', 'Optionally, a model provider of your choice, for LLM operators'])}</div>` })}
${ctaForge(ctx.cfg, { title: 'Send feedback on the design', primary: ['Read the architecture', '/architecture/'], secondary: ['See the roadmap', '/roadmap/'] })}`,
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
${section({ id: 'why', title: 'Why Ogun exists', body: `<div class="wrap--narrow" data-reveal><p class="lede">Most data trouble starts at acquisition: the login, the expiring link, the half-downloaded archive, the PDF nobody can trace back. Then models and agents arrive and multiply the output, and the question “where did this come from?” gets harder to answer.</p><p>Ogun records each step: what was fetched, from where, by which operator and model, in which run. People approve the steps that cost money, run code or publish data. The imagery on this site comes from Renaissance metallurgy treatises, which wrote down their processes so others could repeat them.</p></div>` })}
${section({ id: 'name', cls: 'section--band', title: 'Ògún', body: `<div class="wrap--narrow" data-reveal><p class="lede">Ògún is the Yoruba orisha associated with iron, metalwork and the making of tools. We chose the name to honour that craft. Out of respect we do not depict the orisha or use sacred symbols; the art on this site comes from European Renaissance engravings of mines, forges and machines.</p></div>` })}
${section({ id: 'contact', title: 'Contact', body: `<div class="split split--top"><dl class="kv" data-reveal><dt>General</dt><dd><a href="mailto:${o.email}">${o.email}</a></dd><dt>Phone</dt><dd><a href="tel:${o.phone.replace(/\s/g, '')}">${o.phone}</a></dd><dt>Post</dt><dd>${o.legalName}, ${o.address.street}, ${o.address.neighborhood}, ${o.address.city}-${o.address.postalCode}, ${o.address.countryName}</dd></dl><dl class="kv" data-reveal data-delay="120"><dt>LinkedIn</dt><dd><a href="${o.social.linkedin}" rel="me">Verne</a></dd><dt>X</dt><dd><a href="${o.social.x}" rel="me">@VerneOf</a></dd><dt>GitHub</dt><dd><a href="${o.social.github}" rel="me">vernesystems</a></dd><dt>Registration</dt><dd><a href="/legal/company/">Company details</a></dd></dl></div>` })}
${ctaForge(ctx.cfg)}`
  },
}

const SWATCHES = [['Forge', '#13110F', 'Dark background'], ['Soot', '#1C1916', 'Surfaces'], ['Vellum', '#F1E9D8', 'Plates, light theme'], ['Iron-gall ink', '#1E1A16', 'Text on vellum'], ['Ember', '#E8662E', 'Accent, running'], ['Brass', '#B89157', 'Instruments, labels'], ['Verdigris', '#5FAE9C', 'Succeeded'], ['Quench', '#7AA6CF', 'Info, sessions'], ['Cinnabar', '#E0604A', 'Failed']]
const ASSETS = [['lockup-light', 'Logo (lockup)', true], ['lockup', 'Logo on vellum'], ['mark-light', 'Mark', true], ['mark', 'Mark on vellum'], ['wordmark-light', 'Wordmark', true], ['plate-forge', 'Fig. I, the forge'], ['plate-windlass', 'Fig. II, the windlass']]

const brand = {
  path: '/brand/',
  order: 31,
  group: 'Company',
  nav: 'Brand & press',
  priority: 0.4,
  updated: UPDATED,
  title: 'Ogun brand and press kit: logos, colours, plates',
  description: 'Download the Ogun logo, mark and engraved plates, see the colours and typefaces, and read the boilerplate for writing about Ogun.',
  crumbs: [{ name: 'Brand & press', path: '/brand/' }],
  body: (ctx) => `
${pageHead({ crumbs: [{ name: 'Brand & press', path: '/brand/' }], title: 'Brand and press kit', lede: 'Logos, engraved plates, colours, typefaces and boilerplate for writing about Ogun.' })}
${section({ id: 'assets', title: 'Logos and plates', lede: 'SVG, free to use when referring to Ogun. Please do not alter the logo or use it for another product.', body: `<div class="asset-grid">${ASSETS.map(([f, label, dark]) => `<a class="asset${dark ? ' asset--dark' : ''}" href="/art/${f}.svg" download data-reveal><img src="/art/${f}.svg" alt="${label}" loading="lazy" width="200" height="120"><span>${label} · svg</span></a>`).join('')}</div>` })}
${section({ id: 'colour', cls: 'section--band', title: 'Colour', lede: 'Dark by default, light on request; plates are always vellum. Every text pair meets WCAG AA.', body: `<div class="swatches">${SWATCHES.map(([n, hex, use]) => `<div class="swatch" data-reveal><i class="sw-${hex.slice(1).toLowerCase()}"></i><div><strong>${n}</strong><code>${hex}</code><br><span class="muted">${use}</span></div></div>`).join('')}</div>` })}
${section({ id: 'type', title: 'Typography', body: `<div class="type-specimen" data-reveal><p class="disp">EB Garamond, <em>a Renaissance roman</em></p><p class="body">IBM Plex Sans for reading and interface text, built for engineering documents.</p><p class="code">IBM Plex Mono for code, data, labels and figure keys.</p><p class="small muted">All three are open fonts under the SIL Open Font License, self-hosted. The wordmark is outlined from EB Garamond capitals.</p></div>` })}
${section({ id: 'boilerplate', cls: 'section--band', title: 'Boilerplate', body: `<div class="code-block" data-reveal><button class="copy-btn" type="button" data-copy="boiler">${icon('copy')}<span class="copy-label">copy</span></button><p id="boiler">Ogun is a local-first developer platform for data acquisition, data engineering and AI-agent benchmarks, made by Verne Ltd. Built on the Zeus download engine, it treats workflows as hashed data, keeps runs durable across crashes, records lineage for every artifact, and runs benchmark tasks such as Spider 2.0-DBT and ADE-bench in isolation. Ogun is open source under Apache-2.0 and sends no telemetry. Learn more at ogun.vernesystems.com.</p></div><p data-reveal>Press: <a href="mailto:${ctx.cfg.contacts.press}">${ctx.cfg.contacts.press}</a> · Usage rules: <a href="/legal/trademark/">trademark policy</a></p>` })}
${ctaForge(ctx.cfg)}`,
}

const notFound = {
  path: '/404/',
  order: 99,
  noindex: true,
  product: false,
  title: 'Not found: Ogun',
  description: 'This page could not be found. The link may be mistyped or the page has moved. Try the Ogun home page, the architecture or the glossary.',
  body: () => `<section class="lost wrap" aria-labelledby="lost-title">${brokenGear()}<h1 id="lost-title">Page not found</h1><p class="lede center">The page may have moved, or the link may be mistyped.</p><div class="btn-row"><a class="btn btn--ember" href="/">Home</a><a class="btn btn--ghost" href="/architecture/">Architecture</a><a class="btn btn--ghost" href="/glossary/">Glossary</a></div></section>`,
}

export default [faq, glossary, compare, roadmap, getStarted, about, brand, notFound]
