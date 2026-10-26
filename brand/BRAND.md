# Ogun brand guidelines

Version 1.2, 2026-10-26 (the forge: large pixel paintings without captions, a pixel wordmark, ember and sparks). Owner: Verne Ltd. Applies to the Ogun website, the Ogun runtime surfaces (CLI, MCP descriptions, Ogun Studio), documentation, social and press material.

Ogun is the developer product in a two-product family. Its sibling, Zeus, has its own guidelines in the `zeus-site` repository. Section 1 is shared by both documents.

---

## 1. Brand architecture (shared with Zeus)

| Level | Brand | Role | Visual world |
|---|---|---|---|
| Parent | **Verne** (Verne Ltd., Dhaka) | Maker, publisher, legal entity | Dark teal, aurora gradient, Kanit; see vernesystems.com |
| Product | **Zeus** | Agentic download and file manager for AI tinkerers and enthusiasts | Sky, marble, gold leaf, ultramarine: the Olympian temple |
| Product | **Ogun** | Developer platform for data mining, data engineering and agent benchmarks | The forge: iron black, ember and bone, painted by Wright of Derby, Turner, Menzel and others and translated into pixels; plates captioned in the manner of a workshop treatise |
| Engine | `zeus-core` | Shared library; not a consumer brand | Never marketed on its own; written in code style |

**Endorsement.** Each product is *endorsed* by Verne, not merged into it. The footer of every product surface ends with the credit **"DESIGNED AND BUILT BY"**, then Verne's mark (the loop V, in Verne's teal-to-blue gradient #00F5C8 → #005BFF), then **"Verne Ltd."**, all linking to https://vernesystems.com and set on the right of the footer's bottom row, with the copyright line on the left. The label uses the product's label style (small caps, wide tracking); "Verne Ltd." uses the product's display serif. The mark keeps its gradient on every background; it is the only place Verne's colours appear on a product surface. At footer size (about 22 px) the mark's stroke is drawn heavier than in Verne's master artwork so it stays visible.

**Shared DNA.** Classical craft: a serif display face with a sans for reading, Roman figure numbers, honest status labels. Zeus is luminous and reassuring; Ogun is exact, dark and documentary, and it is a forge: a place with fire in it.

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
- Binaries: `ogun` (CLI), `ogund` (daemon). Crates: `ogun-*`. Specs: O-00 to O-17. Phases: O0 to O4.
- "Ogun Studio" for the GUI. "Operator", "artifact", "asset", "run", "node", "partition", "workflow version", "plan diff".
- Run states are always written in code style and exactly: `pending`, `ready`, `running`, `waiting`, `waiting_for_user`, `waiting_for_session`, `retry_scheduled`, `succeeded`, `failed`, `cancelled`, `skipped`.
- Figures are numbered with Roman numerals: Fig. I (the forge), II (the windlass), III (the lifecycle), IV (lineage), V (architecture), VI (Ogun Studio).

### On the name

Ògún is the Yoruba orisha associated with iron, metalwork and the making of tools, venerated in West Africa and across the diaspora. We chose the name to honour that craft. Rules: never depict the orisha; never use sacred symbols or ritual objects associated with Ògún (for example palm-frond fringes); never make religious claims or jokes; explain the name factually where asked (the FAQ and About pages do). Our imagery deliberately comes from public-domain European paintings of forges and ironworks of the eighteenth and nineteenth centuries, our own machine diagrams, and the plate-and-caption manner of workshop treatises instead. Before public launch, review the name and its presentation with Yoruba cultural advisers, alongside the trademark clearance.

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
| Pixel labels and the wordmark | Departure Mono 400 (SIL OFL 1.1) | 11 px or 22 px only, so its 1-pixel grid stays crisp; status pill, table headings, strip labels, credits page |
| Captions (terminals and diagrams only) | EB Garamond italic | plain, no figure numbers |

Headings are plain sentences: no kicker labels above them, no italic punchline split off the end, no § or numeral ornaments. Italic display type is kept for the home-page headline. Garamond is a Renaissance roman (1540s), contemporary with Agricola; Plex comes from engineering documentation. Fonts are self-hosted under the SIL Open Font License; the four licences are on the art credits page.

---

## 8. Art direction

**The signature device: forge paintings turned into pixels.** The site is one place, not a set of diagrams. Its art is a library of 17 public-domain paintings of forges, ironworks, furnaces and fire, translated into ember pixel art (`art/library.json`): six by Joseph Wright of Derby (*An Iron Forge*, *The Blacksmith's Shop*, *An Iron Forge Viewed from Without*, *Vesuvius in Eruption*, *The Alchemist Discovering Phosphorus*, *An Experiment on a Bird in the Air Pump*), Adolph Menzel's *The Iron Rolling Mill*, Loutherbourg's *Coalbrookdale by Night*, Turner's *Burning of the Houses of Lords and Commons* and *Rain, Steam and Speed*, Monet's *Gare Saint-Lazare*, Luce's *Factories near Charleroi*, Meunier's *Mining Region*, Courbet's *The Stonebreakers*, Velázquez's *The Forge of Vulcan*, Louis Le Nain's *The Forge* and Jan Brueghel's *Fire*. The chiaroscuro of Wright of Derby is the product's glow: the iron is the light, and everything else is the dark it works in.

**Paintings are large, and never captioned.** The art is shown big: full-width bands, not thumbnails. `src/art/library.mjs` maps every main page to one wide band (480 by 96 art pixels, three CSS pixels to an art pixel on a laptop, so 1440 by 288 px), laid out above the breadcrumbs (`banner`) or under the lede (`strip`) in turn, so that the site does not repeat one rhythm; no two pages share a band; the legal pages have bands too, cut from the same paintings more closely. The home page puts a band between its sections, alternately tall and slim, and the closing call to action has one of eight panoramas (shared by two to four related pages). The 404 page is a full-width banner of Vesuvius. **No caption, credit line or FIG. number is set on any painting, banner, panorama or screenshot.** Each picture has alt text that says what it is and what it shows (generated from `art/library.json`); the credit for every painting (artist, title, date, owner, licence, a link to the museum or catalogue page for the work and the Wikimedia Commons file) is on `/credits/`, with a thumbnail of each, and the footer carries a plain "Art credits" link. Add a painting by adding it to `art/library.json`, a crop to `PLATES` in `art/build.py` and a place to `src/art/library.mjs`; `node tools/sources-md.mjs` rewrites `art/SOURCES.md`.

**Treatment** (`art/build.py`, reproducible): crop; reduce to a fixed grid of art pixels; stretch tones with the image's own black and white points, half-strength local contrast and a gamma that keeps the dark parts dark; map luminance onto a ten-colour ramp with an 8 by 8 Bayer ordered dither. One art pixel is 2 CSS pixels on a phone, 3 on a laptop, 4 on a large screen, always an integer, drawn with `image-rendering: pixelated`. Paintings of pale, misty scenes (Turner's locomotive, Monet's station) are inverted first, so that the engine and the rails become the hot iron. The hero is mirrored, so that the glow of the forge sits under the Studio slab. The same tones get a second ramp, **sepia**, for the light theme.

| Ramp (ember) | Hex |
|---|---|
| iron black | `#0B0908` |
| soot | `#1A1210` |
| deep brown | `#2E1A12` |
| rust | `#4F2615` |
| ember red | `#7E2F15` |
| burnt orange | `#B8441B` |
| ember (the accent) | `#E8662E` |
| amber | `#F59A3B` |
| hot | `#FFD08A` |
| bone | `#F3E7CF` |

**The pixel wordmark.** OGUN set in Departure Mono at its native grid (5 by 8 pixels a letter), read from the font's glyph outlines by `art/wordmark.py` and drawn as SVG rectangles: a heat gradient from hot at the top row to ember at the bottom, a glow that flickers on value noise, and an occasional bright pixel. It is the hero and the footer mark. The printer's device (gear ring and anvil) stays the logo.

**Plates.** Terminal captures and drawings sit in a double-ruled frame with corner ticks and a short plain caption in italic Garamond that says what the reader is looking at ("Real output of ogun validate"; a drawing says that it is drawn). Paintings and Studio screenshots have no plate and no caption. Engraved vellum plates remain only as diagrams (architecture, lineage, lifecycle).

**Products shown as products.** Ogun Studio's own screenshots (from the hosted hub's sample data) float on the forge as a glowing slab, and terminals show only output captured from the released binaries (`tools/capture.mjs`). Nothing is invented: if a figure is drawn rather than recorded, its caption says so.

**Colour in art.** Ember for heat, bone for the brightest iron, verdigris for finished work, cinnabar for failure, brass for instruments and frames.

**Light theme.** Bone paper with the sepia grade. The painting bleeds in from the right under a paper gradient; the wordmark takes the deep-ember rows.

**Never draw.** The orisha Ògún or any sacred or ritual imagery; weapons; fire played for drama; any person we draw or generate ourselves. People appear only as they are in the public-domain paintings credited on `/credits/`, and no image is produced by a generator. Reference websites' artwork is never used.

**Roads.** Ògún is also the namesake of roads: the bike-share sample project (stations, routes, monthly and daily partitions) supplies the road and rail motif for lineage and partitions, kept to plain geometry.

---

## 9. Iconography

24 px grid, 1.5 px stroke, round caps, drawn from the workshop: anvil, gear, bucket, ingot, balance, crucible, drawers, press, sieve, seal, ledger, compass, DAG, cube, matrix. Icons sit in square, hairline-bordered wells (40 px, radius 4) and turn ember on hover.

---

## 10. Motion and microinteractions

**Principle: alive, not looped.** Motion comes from physics and noise, never from a timer: particles with gravity, drag and wobble; flicker from value noise; springs and ease-out curves; durations drawn at random within a range. Everything pauses off screen and when the tab is hidden, caps its frame rate on phones (about 30 fps) and honours `prefers-reduced-motion`.

**Catalogue (website, `src/js/forge.js`).**

1. **The strike.** On load, a pixel hammer falls on the Studio slab: it accelerates, hits, rebounds and lifts away. At impact the slab shudders on a spring, its glow jumps to full and decays, a square shock ring expands, and about 70 sparks fly. A press on any ember button throws a smaller burst from the button (the hero button also lands the hammer).
2. **Embers.** Ember pixels rise from the glow in the painting and from the slab's lower edge, wander on noise, fade through the ramp from hot to cold and are drawn additively on the dark theme. Positions are snapped to the art grid, so they are the same pixels as the painting.
3. **Glow and glints.** The glow around the wordmark and the footer flickers on value noise; single wordmark pixels flash at irregular intervals.
4. **Parallax.** The painting follows the pointer and the scroll with smoothing, snapped to the pixel grid so it moves like pixel art.
5. **The partition strip.** 121 daily partitions of the O1 exit test: cells heat from cold iron through ember to white-hot and settle to verdigris, four lanes in order, one fails and retries, `ogund` is killed (the in-flight cells go black), restarts, and only the unfinished cells are struck again. It starts as it scrolls into view. The caption says it is drawn; the transcript beside it is real.
6. **The lifecycle.** An ember travels the pipe at a speed that follows noise, slows at each station and selects its stage.
7. **Tabs and copy buttons.** An ember ink bar slides under the active tab; copy buttons confirm with "copied". Keyboard support throughout.
8. **Cards and buttons.** An ember glow follows the pointer.
9. **Reading progress.** An ember hairline.

**Reduced motion.** The hero is a still: the painting, the slab at half heat, and a fixed scatter of embers drawn once. The strip is drawn finished. No hammer, no parallax, no flicker.

**Without JavaScript.** The painting, the wordmark, the slab and a finished strip are all static HTML and CSS.

---

## 11. Layout

A 1200 px container inside one fluid gutter, `--gutter: clamp(24px, 7vw, 128px)`, shared by the header, hero, sections, cards and footer: about 90 px each side at 1280 px, 96 at 1366, 120 at 1440, growing to the cap; 24 px on a phone. Full-bleed paintings may reach the edge; text, buttons, cards, navigation and footer may not. Generous vertical rhythm (8 rem sections), alternating forge and band backgrounds separated by hairlines. Grids of cards share hairline borders, like a ledger. A faint 64 px rule grid fades from the top of the page, like ruled paper. Radius: 4–10 px; shadows only on plates.

---

## 12. Accessibility

WCAG 2.2 AA: contrast as tabled, visible 2 px ember focus outlines, skip link, one h1 per page, labelled landmarks, keyboard-operable demos and tabs, decorative SVG hidden from assistive technology, text equivalents for every figure, wide diagrams scroll horizontally on phones rather than shrinking past legibility.

---

## 13. Product design (Ogun runtime surfaces)

**CLI.** Plain, columnar, honest. Data on stdout, progress on stderr, `--json` everywhere. Run states printed exactly as in section 4, coloured (ember running, verdigris succeeded, cinnabar failed, brass waiting) and always paired with the word. Errors: `node: message [error_class]`, then the next step. Plans print as diffs (`+`, `-`, `~`) with the workflow hash. Honour `NO_COLOR`.

**Studio.** Forge theme by default, vellum available. Main navigation: Runs, Workflows, Artifacts, Sources, Datasets, Agents, Schedules, Benchmarks, Connections. A run page shows the DAG with live node states, an artifact panel, an agent panel, and tabs for events, logs, lineage, costs and network. Lineage views use the engraved-plate style sparingly (hairlines, italic Garamond edge labels), never decoration that slows reading. Tables are dense, monospaced for data and right-aligned for numbers.

**The trust-surface rule.** The approval inbox and approval prompts carry **no ornament**: no plates, no ember glow, no animation except the deliberate arming delay on the approve button. Facts first, in a fixed order (what, cost or scope, workflow version and hash, who asked); the agent's words in a separate, labelled block; approve and deny at equal size. An approval must look the same every time so that a spoofed one looks wrong.

**MCP descriptions.** Short, factual, no marketing; remote-derived strings in `untrusted_*` fields.

---

## 14. Website system

**Information architecture.** Home; Architecture; Workflows; Operators; Lineage; Benchmarks; Security model; FAQ; Glossary; Compare; Roadmap; Get started; About; Brand and press; Legal (privacy, terms, acceptable use, cookies, trademark, licenses, security, accessibility, company details); 404.

**Search and answer engines.** Same system as Zeus: titles up to 65 characters, descriptions of 70–165, canonical URLs, Open Graph; a JSON-LD graph per page (Organization, WebSite, WebPage, SoftwareApplication with no ratings, BreadcrumbList, FAQPage, DefinedTermSet, TechArticle, Speakable); TL;DR boxes; question-shaped FAQ; a glossary with stable fragment ids; category comparisons with dates; `robots.txt` welcoming AI crawlers; `sitemap.xml`; `llms.txt` and `llms-full.txt`; `humans.txt`; `/.well-known/security.txt`.

**Privacy and security.** No cookies, no storage, no analytics, no third-party requests; strict CSP; the footer says so.

**Performance budget.** CSS under 75 kB and JavaScript under 40 kB (both uncompressed, in two files each), no framework; the hero painting at most 300 kB (it is about 35 kB) and no crop above 35 kB (43 crops, about 1.3 MB in all, of which a page loads two to four); first load of the home page about 0.5 MB; every image carries `width` and `height`; paintings below the fold are lazy; the hidden grade of a painting is never fetched.

---

## 15. Claims hygiene

Status first ("Contracts phase"). No results before methods: the benchmark matrix says "planned" until runs exist. Prior art is named and credited. Competitor descriptions are by category and dated, with a correction address.

---

## 16. Files

| Path | What |
|---|---|
| `brand/assets/` | Generated SVG logos and plates (`node build.mjs --brand`) |
| `src/art/` | Generators: `kit.mjs` (shared with Zeus), `motifs.mjs`, `index.mjs` (diagrams, icons, logos), `pixel.mjs` and `pixel-wordmark.mjs` (the wordmark, the painting helpers), `library.mjs` (the painting library and the page map) |
| `art/` | `library.json` (the 17 paintings and their facts), `build.py` (paintings to pixels, 43 crops), `wordmark.py` (wordmark pixels from Departure Mono), `SOURCES.md` (generated: originals, licences, credits, where each crop is used) |
| `public/art/` | The processed paintings, ember and sepia, as indexed PNGs, and `manifest.json` |
| `src/js/forge.js`, `src/css/forge.css` | The forge: hero, strike, strip, plates |
| `src/css/site.css` | Tokens and components, both themes |
| `public/og.png`, icons | Rendered by `tools/render-pngs.sh` |
