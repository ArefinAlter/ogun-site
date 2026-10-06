# ogun-site

The marketing website for **Ogun**, the developer platform for reproducible data pipelines and agent benchmarks. A Verne product.

Static, dependency-free and private by construction: no cookies, no analytics, no third-party requests, a strict Content Security Policy. All artwork (engraved plates of the forge and windlass, meshing gear trains, the lifecycle aqueduct, the lineage and architecture figures) is generated from code in `src/art/`. Dark "forge" theme by default, light "vellum" theme by system setting or toggle.

## Commands

```bash
node build.mjs            # build into dist/ and run the quality checks (fails on errors)
node build.mjs --brand    # also export the SVG brand assets into brand/assets/
node serve.mjs 4322       # preview dist/ with production headers (add --frames for responsive iframes)
bash tools/render-pngs.sh # re-render og.png and the PNG icons (needs Edge or Chrome); commit public/*.png
```

Requires Node 20 or newer. There is nothing to install.

## Layout

| Path | What |
|---|---|
| `site.config.mjs` | Domain, Verne company facts, navigation, llms.txt summary. Change the domain here once. |
| `src/pages/*.mjs` | Pages. Each exports a page object (or an array): path, title, description, structured-data hints, body. |
| `src/content.mjs` | Shared copy: principles, run states, triggers, operators, metrics, FAQ, glossary, comparisons, roadmap. Used by pages, llms.txt and JSON-LD. |
| `src/legal.mjs` | Legal page generator (shared design with `zeus-site`); product specifics in `src/pages/legal.mjs`. |
| `src/layout.mjs`, `src/parts.mjs` | Page shell and reusable sections. |
| `src/art/` | SVG art generators: `kit.mjs` (primitives, shared with zeus-site), `motifs.mjs` (gears, anvil, hammer, windlass, plate frames), `index.mjs` (plates, diagrams, icons, logos, PNG render pages). |
| `src/css/site.css`, `src/js/site.js` | Design system and interactions. Content-hashed into `/assets/`. |
| `lib/` | The builder's helpers: SEO head and JSON-LD, HTML-to-text for llms-full.txt. |
| `public/` | Fonts (OFL), PNG icons, social image. Copied verbatim. |
| `brand/BRAND.md` | Brand guidelines: positioning, voice, logo, colour, type, art, motion, product UI, website system. |

## What the build produces

Every page plus `sitemap.xml`, `robots.txt` (AI crawlers welcome), `llms.txt`, `llms-full.txt`, `manifest.webmanifest`, `humans.txt`, `/.well-known/security.txt`, `/art/*.svg`, and a JSON-LD graph per page (Organization, WebSite, WebPage, SoftwareApplication, BreadcrumbList, FAQPage, DefinedTermSet, HowTo, Article, Speakable).

Checks: exactly one h1 per page, unique titles and ids, no broken internal links or fragments, alt text on every image, `target=_blank` with `noopener`, no placeholder text; warnings for long titles and descriptions.

## Deploying

`vercel.json` sets the build command, the output directory and the security headers. Any static host works if it serves `dist/` with the same headers and uses `404.html` for missing pages.

## Facts to confirm before launch

- Domain: `https://ogun.vernesystems.com` (in `site.config.mjs`).
- Hosting provider named in the privacy policy: Vercel Inc. (`hosting` in `site.config.mjs`).
- Contact addresses: all set to info@vernesystems.com; split into privacy@, security@ and press@ when those mailboxes exist.
- Legal pages are written to match the software's design documents; have them reviewed by counsel before launch.

## License

Code: Apache-2.0 (`LICENSE`). Text, logos and artwork: © Verne Systems (see `/legal/trademark/`). Fonts: SIL OFL 1.1.
