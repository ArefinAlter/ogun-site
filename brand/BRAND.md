# Ogun brand guidelines

Version 1.0, 2026-10-06. Owner: Verne Ltd. Applies to the Ogun website, the Ogun runtime surfaces (CLI and TUI, MCP descriptions, Ogun Studio), documentation, social and press material.

Ogun is the developer product in a two-product family. Its sibling, Zeus, has its own guidelines in the `zeus-site` repository. Section 1 is shared by both documents.

---

## 1. Brand architecture (shared with Zeus)

| Level | Brand | Role | Visual world |
|---|---|---|---|
| Parent | **Verne** (Verne Ltd., Dhaka) | Maker, publisher, legal entity | Dark teal, aurora gradient, Kanit; see vernesystems.com |
| Product | **Zeus** | Agentic download and file manager for AI tinkerers and enthusiasts | Sky, marble, gold leaf, ultramarine: the Olympian temple |
| Product | **Ogun** | Developer platform for data mining, data engineering and agent benchmarks | Forge, iron, vellum, ink: the Renaissance workshop treatise |
| Engine | `zeus-core` | Shared library; not a consumer brand | Never marketed on its own; written in code style |

**Endorsement.** Each product is *endorsed* by Verne, not merged into it. The footer of every product surface ends with the credit **"DESIGNED AND BUILT BY"**, then Verne's mark (the loop V, in Verne's teal-to-blue gradient #00F5C8 → #005BFF), then **"Verne Ltd."**, all linking to https://vernesystems.com and set on the right of the footer's bottom row, with the copyright line on the left. The label uses the product's label style (small caps, wide tracking); "Verne Ltd." uses the product's display serif. The mark keeps its gradient on every background; it is the only place Verne's colours appear on a product surface. At footer size (about 22 px) the mark's stroke is drawn heavier than in Verne's master artwork so it stays visible.

**Shared DNA.** Classical craft: engraved line art, a serif display face with a sans for reading, Roman numerals, honest status labels, art generated from code. Zeus is luminous and reassuring; Ogun is exact, dark and documentary.

**Cross-linking.** Each site names the other once in the footer and once in context. Ogun: the architecture page, the compare page and the FAQ.

---

## 2. Positioning

**Audience.** AI and LLM engineers, data engineers, ML researchers who need provenance, platform engineers, and people who build or evaluate coding and data agents. They read specs, distrust adjectives and check claims.

**Problem.** Data work breaks at acquisition (logins, expiring links, half-finished archives) and then loses its memory (which model wrote this row, which file did it come from). Agents multiply both problems.

**Promise.** *Every byte has a lineage. Every run can be repeated.*

**Proof points** (each traceable to Ogun's decision records):

1. Workflows are data: a JSON IR, no floats, JCS + BLAKE3 workflow hash (ADR 0003).
2. Durable runs on the Zeus engine; the O1 exit test is a backfill that survives `kill -9`.
3. Content-addressed artifacts with full lineage; OpenLineage export.
4. Operators wrap existing tools in sandboxes; Ogun integrates instead of replacing (ADR 0004).
5. Benchmark profile with isolation, unmodified evaluators and trajectories (ADR 0005).
6. Human-only approvals; never holds browser sessions (ADR 0002).

**Essence.** *Mensura et memoria*: measure, and memory.

**What Ogun is not.** Not "a better Airflow", not a scraper that evades bot checks, not a cloud service, not a model.

---

## 3. Voice

| Ogun is | Ogun is not |
|---|---|
| Exact: nouns, numbers, named standards | Vague or superlative |
| Sober: states limits and status first | Hype, "revolutionary", "magic" |
| Documentary: footnotes, figure numbers, decision records | Chatty |
| Respectful of prior art: names it, credits it | Dismissive of other tools |

**Rules.** Lead with the answer (the summary box). Every claim maps to a decision record or a spec; planned work says "planned" and names its phase (O0–O4). Use the real vocabulary: IR, DAG, partition, backfill, lineage, CAS, JCS, determinism class. Define terms in the glossary rather than softening them. Cite standards and benchmarks by their proper names (Spider 2.0-DBT, ADE-bench, Terminal-Bench 2.0, Harbor, OpenLineage, W3C PROV, Croissant). No emoji, no exclamation marks. Avoid slogan constructions ("X is a pause, not a restart", "Every state is honest"), stacked three-beat sentences and copy that tells the visitor to hover or click.

**Tone by context.**

| Context | Example |
|---|---|
| Headline | "Forge raw sources into reproducible datasets." |
| Explanation | "Partitions commit independently to a journal. Kill the daemon mid-backfill and it resumes only what was unfinished." |
| Error (product) | "acquire: 503 from mirror (throttled), retry 2/5 in 4 s [throttled]" |
| Approval (product) | "Run llm.extract on 481 documents · estimated $1.38 of $2.50 budget · workflow v17 (7c3e…41d0)" |
| Legal | Plain, complete, specific to what the software does |

---

## 4. Naming

- **Ogun** in running text; **OGUN** only in the wordmark. Pronounced *OH-goon*; the Yoruba spelling is Ògún.
- Binaries: `ogun` (CLI), `ogund` (daemon). Crates: `ogun-*`. Specs: O-00 to O-08. Phases: O0 to O4.
- "Ogun Studio" for the GUI. "Operator", "artifact", "asset", "run", "node", "partition", "workflow version", "plan diff".
- Run states are always written in code style and exactly: `pending`, `ready`, `running`, `waiting`, `waiting_for_user`, `waiting_for_session`, `retry_scheduled`, `succeeded`, `failed`, `cancelled`, `skipped`.
- Figures are numbered with Roman numerals: Fig. I (the forge), II (the windlass), III (the lifecycle), IV (lineage), V (architecture).

### On the name

Ògún is the Yoruba orisha associated with iron, metalwork and the making of tools, venerated in West Africa and across the diaspora. We chose the name to honour that craft. Rules: never depict the orisha; never use sacred symbols or ritual objects associated with Ògún (for example palm-frond fringes); never make religious claims or jokes; explain the name factually where asked (the FAQ and About pages do). Our imagery deliberately comes from European Renaissance metallurgy and engineering treatises instead. Before public launch, review the name and its presentation with Yoruba cultural advisers, alongside the trademark clearance.

---

## 5. Logo system

| Asset | File | Use |
|---|---|---|
| Mark | `assets/mark-light.svg` (on dark), `assets/mark.svg` (on vellum) | A printer's device: a 14-tooth gear ring around an anvil, with one ember spark |
| Wordmark | `assets/wordmark-light.svg`, `assets/wordmark.svg` | EB Garamond capitals, outlined, widely tracked |
| Lockup | `assets/lockup-light.svg`, `assets/lockup.svg` | Default logo |
| Favicon | `favicon.svg` | Bone mark on forge black, ember spark |

**Clear space**: one tooth depth plus the spark height on all sides. **Minimum size**: mark 20 px (favicon variant at 16 px), lockup 96 px wide. The spark is the only colour in the logo; it is ember on dark and the darker ember text colour on vellum.

**Do not** recolour the gear, add teeth, rotate the lockup, animate the logo except the sanctioned slow spin on hover of the header mark, or place it on busy imagery.

---

## 6. Colour

Two themes from one token set; plates (figures) are always vellum. Ratios verified against WCAG 2.2.

### Forge (dark, default)

| Token | Name | Hex | Role | Contrast |
|---|---|---|---|---|
| `--bg` | Forge | `#13110F` | Background | – |
| `--surface` | Soot | `#1C1916` | Panels | – |
| `--raised` | Slag | `#2A2520` | Raised, hover | – |
| `--text` | Bone | `#E9E1D0` | Text | 14.48:1 on forge |
| `--text-2` | Bone, muted | `#A99F8C` | Secondary text | 7.20:1 on forge |
| `--accent` | Ember | `#E8662E` | Accent, `running`, primary buttons (forge text 5.72:1) | 5.72:1 on forge |
| `--brass` | Brass | `#B89157` | Labels, instruments, `ready`, `waiting_for_user` | 6.48:1 on forge |
| `--ok` | Verdigris | `#5FAE9C` | `succeeded` | 7.20:1 on forge |
| `--info` | Quench | `#7AA6CF` | Info, `waiting_for_session` | 7.34:1 on forge |
| `--bad` | Cinnabar | `#E0604A` | `failed`, `retry_scheduled` | 5.33:1 on forge |

### Vellum (light)

| Token | Hex | Role | Contrast |
|---|---|---|---|
| `--bg` Vellum | `#F1E9D8` | Background, plates | – |
| `--text` Iron-gall ink | `#1E1A16` | Text | 14.32:1 |
| `--text-2` | `#57503F` | Secondary text | 6.63:1 |
| `--accent-text` | `#9C4419` | Accent text | 5.34:1 |
| `--accent` | `#B5521E` | Button fill (vellum text), decorative | 4.15:1, not for text |
| `--brass-text` | `#7A5A22` | Labels | 5.25:1 |
| `--ok` | `#2F6E61` | Succeeded | 4.93:1 |
| `--info` | `#2C5D86` | Info | 5.76:1 |
| `--bad` | `#A63A24` | Failed | 5.35:1 |

**Proportion.** Dark ground, bone text, ember used like heat: sparingly and where something is happening. One ember button per view.

**Theme behaviour.** Follow `prefers-color-scheme`; the toggle overrides it for the current visit only (no storage, to keep the "no cookies, no local storage" promise).

---

## 7. Typography

| Role | Family | Settings |
|---|---|---|
| Display | EB Garamond 500, italic for emphasis | Leading 0.98–1.15, tracking −0.01em |
| Body and UI | IBM Plex Sans (variable) | 16–17 px, leading 1.6 |
| Code, data, labels, keys | IBM Plex Mono 400/500 | Labels uppercase with 0.12–0.14em tracking |
| Figure captions | EB Garamond italic | "FIG. II" key in Plex Mono |

Headings are plain sentences: no kicker labels above them, no italic punchline split off the end, no § or numeral ornaments. Italic display type is kept for the home-page headline. Garamond is a Renaissance roman (1540s), contemporary with Agricola; Plex comes from engineering documentation. Fonts are self-hosted under the SIL Open Font License.

---

## 8. Art direction

**The look.** Plates from a Renaissance technical treatise: Agricola's *De re metallica* (1556) and da Vinci's machine drawings. Iron-gall ink on vellum, engraved hatching, construction lines (compass arcs, centre marks, dimension lines), lettered leaders with a key ("a. the anvil…"), double-ruled frames with corner fleurons and a title cartouche.

**Motifs and meaning.**

| Motif | Meaning |
|---|---|
| Anvil | Acquisition: where raw material arrives |
| Hammer | Transformation; strikes on click, with sparks |
| Gear train | The schedule; gears really mesh, speeds follow tooth ratios |
| Windlass over a shaft | Acquisition after Agricola |
| Aqueduct of stations | The eight-stage lifecycle |
| Lineage graph | Memory: artifacts and the operators between them |
| Printer's device | The logo: a gear ring around an anvil |

**Construction.** Art is generated in code (`src/art/`): gears from tooth counts and a module with correct meshing phase; hatching via patterns; paper grain via a light turbulence filter. No raster images except the rendered social card and icons.

**Colour in art.** Ink and vellum only, plus ember for heat (sparks, ore, the active station) and brass for instruments.

**Never draw.** The orisha Ògún or any sacred imagery; people (Agricola had miners; we draw only machines); weapons; fire hazards played for drama.

---

## 9. Iconography

24 px grid, 1.5 px stroke, round caps, drawn from the workshop: anvil, gear, bucket, ingot, balance, crucible, drawers, press, sieve, seal, ledger, compass, DAG, cube, matrix. Icons sit in square, hairline-bordered wells (40 px, radius 4) and turn ember on hover.

---

## 10. Motion and microinteractions

**Principle: mechanical and exact.** Things turn at constant speed, follow ratios, ease like machinery (`cubic-bezier(.45, 0, .55, 1)`), and settle without bounce. Nothing wobbles.

**Catalogue (website).**

1. Fig. I draws itself: construction lines stroke in on load.
2. Gears turn continuously at speeds set by their tooth ratios; hovering the figure spins them up to four times speed through the Web Animations API (no jump).
3. Clicking the plate swings the hammer onto the anvil; an ember glow blooms at the impact and canvas sparks fly with gravity. Rate-limited.
4. The lifecycle pipe carries a flowing ember dash; stations highlight on hover or focus and auto-advance every 3.2 s until the visitor takes over; a panel explains each stage.
5. Code tabs slide an ember ink bar under the active tab; full keyboard support (arrows, Home, End); copy buttons confirm with "copied".
6. The run simulation (Studio preview): node states change honestly, a mirror returns 503 and retries, a transfer resumes mid-file, and the run stops at a budget approval that waits for a real click (auto-continues after 8 s).
7. The backfill grid: 82 monthly partitions fill on four lanes; three fail and retry; the "kill -9 ogund" button interrupts the run, which then resumes only incomplete partitions.
8. Lineage: hovering or focusing an artifact lights its ancestors and descendants and dims the rest.
9. The windlass drum turns and the bucket rises and falls.
10. The session-bridge edge in the architecture figure flows.
11. Benchmark matrix: the column under the pointer is highlighted.
12. Cards: an ember glow follows the pointer; icons tilt.
13. Reading-progress hairline in ember.

**Reduced motion.** All loops stop, construction lines appear drawn, sparks never fire, demos jump to their end states.

---

## 11. Layout

1200 px container, generous vertical rhythm (8 rem sections), alternating forge and band backgrounds separated by hairlines. Grids of cards share hairline borders, like a ledger. A faint 64 px rule grid fades from the top of the page, like ruled paper. Radius: 4–10 px; shadows only on plates.

---

## 12. Accessibility

WCAG 2.2 AA: contrast as tabled, visible 2 px ember focus outlines, skip link, one h1 per page, labelled landmarks, keyboard-operable demos and tabs, decorative SVG hidden from assistive technology, text equivalents for every figure, wide diagrams scroll horizontally on phones rather than shrinking past legibility.

---

## 13. Product design (Ogun runtime surfaces)

**CLI.** Plain, columnar, honest. Data on stdout, progress on stderr, `--json` everywhere. Run states printed exactly as in section 4, coloured (ember running, verdigris succeeded, cinnabar failed, brass waiting) and always paired with the word. Errors: `node: message [error_class]`, then the next step. Plans print as diffs (`+`, `-`, `~`) with the workflow hash. Honour `NO_COLOR`.

**Studio (phase O4).** Forge theme by default, vellum available. Main navigation: Runs, Workflows, Artifacts, Sources, Datasets, Agents, Schedules, Benchmarks, Connections. A run page shows the DAG with live node states, an artifact panel, an agent panel, and tabs for events, logs, lineage, costs and network. Lineage views use the engraved-plate style sparingly (hairlines, italic Garamond edge labels), never decoration that slows reading. Tables are dense, monospaced for data and right-aligned for numbers.

**The trust-surface rule.** The approval inbox and approval prompts carry **no ornament**: no plates, no ember glow, no animation except the deliberate arming delay on the approve button. Facts first, in a fixed order (what, cost or scope, workflow version and hash, who asked); the agent's words in a separate, labelled block; approve and deny at equal size. An approval must look the same every time so that a spoofed one looks wrong.

**MCP descriptions.** Short, factual, no marketing; remote-derived strings in `untrusted_*` fields.

---

## 14. Website system

**Information architecture.** Home; Architecture; Workflows; Operators; Lineage; Benchmarks; Security model; FAQ; Glossary; Compare; Roadmap; Get started; About; Brand and press; Legal (privacy, terms, acceptable use, cookies, trademark, licenses, security, accessibility, company details); 404.

**Search and answer engines.** Same system as Zeus: titles up to 65 characters, descriptions of 70–165, canonical URLs, Open Graph; a JSON-LD graph per page (Organization, WebSite, WebPage, SoftwareApplication with no ratings, BreadcrumbList, FAQPage, DefinedTermSet, TechArticle, Speakable); TL;DR boxes; question-shaped FAQ; a glossary with stable fragment ids; category comparisons with dates; `robots.txt` welcoming AI crawlers; `sitemap.xml`; `llms.txt` and `llms-full.txt`; `humans.txt`; `/.well-known/security.txt`.

**Privacy and security.** No cookies, no storage, no analytics, no third-party requests; strict CSP; the footer says so.

**Performance budget.** CSS under 60 kB, JavaScript under 25 kB, no framework, fonts preloaded.

---

## 15. Claims hygiene

Status first ("Contracts phase"). No results before methods: the benchmark matrix says "planned" until runs exist. Prior art is named and credited. Competitor descriptions are by category and dated, with a correction address.

---

## 16. Files

| Path | What |
|---|---|
| `brand/assets/` | Generated SVG logos and plates (`node build.mjs --brand`) |
| `src/art/` | Generators: `kit.mjs` (shared with Zeus), `motifs.mjs`, `index.mjs` |
| `src/css/site.css` | Tokens and components, both themes |
| `public/og.png`, icons | Rendered by `tools/render-pngs.sh` |
