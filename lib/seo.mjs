// Head tags and structured data. Everything a search or answer engine reads comes from one place.
import { esc, jsonScript } from './html.mjs'

export const abs = (cfg, path = '/') => cfg.url.replace(/\/$/, '') + (path.startsWith('/') ? path : '/' + path)

/** The Verne organization node, shared by every page. */
export function orgNode(cfg) {
  const o = cfg.org
  return {
    '@type': 'Organization',
    '@id': o.url + '/#organization',
    name: o.name,
    legalName: o.legalName,
    url: o.url,
    email: o.email,
    telephone: o.phone,
    foundingDate: o.founded,
    address: {
      '@type': 'PostalAddress',
      streetAddress: o.address.street,
      addressLocality: o.address.city,
      postalCode: o.address.postalCode,
      addressCountry: o.address.country,
    },
    sameAs: Object.values(o.social),
  }
}

/** The product node. No ratings or reviews are ever emitted: there are none. */
export function productNode(cfg) {
  const p = cfg.product
  return {
    '@type': 'SoftwareApplication',
    '@id': abs(cfg, '/#software'),
    name: p.name,
    alternateName: p.alternateName,
    description: cfg.description,
    url: abs(cfg, '/'),
    applicationCategory: p.category,
    applicationSubCategory: p.subCategory,
    operatingSystem: p.os,
    softwareVersion: p.version,
    ...(cfg.release ? { downloadUrl: cfg.release.page, installUrl: cfg.release.page, releaseNotes: cfg.release.page } : { releaseNotes: abs(cfg, '/roadmap/') }),
    license: 'https://www.apache.org/licenses/LICENSE-2.0',
    isAccessibleForFree: true,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
    featureList: p.features,
    keywords: p.keywords.join(', '),
    image: abs(cfg, '/og.png'),
    publisher: { '@id': cfg.org.url + '/#organization' },
    creator: { '@id': cfg.org.url + '/#organization' },
  }
}

export function structuredData(page, cfg) {
  const url = abs(cfg, page.path)
  const graph = [
    orgNode(cfg),
    {
      '@type': 'WebSite',
      '@id': abs(cfg, '/#website'),
      url: abs(cfg, '/'),
      name: cfg.name,
      description: cfg.description,
      inLanguage: cfg.lang,
      publisher: { '@id': cfg.org.url + '/#organization' },
    },
    {
      '@type': page.pageType || 'WebPage',
      '@id': url + '#webpage',
      url,
      name: page.title,
      description: page.description,
      inLanguage: cfg.lang,
      isPartOf: { '@id': abs(cfg, '/#website') },
      about: { '@id': abs(cfg, '/#software') },
      dateModified: page.updated || cfg.updated,
      datePublished: page.published || cfg.published,
      publisher: { '@id': cfg.org.url + '/#organization' },
      primaryImageOfPage: { '@type': 'ImageObject', url: abs(cfg, page.image || '/og.png') },
      ...(page.speakable ? { speakable: { '@type': 'SpeakableSpecification', cssSelector: page.speakable } } : {}),
      ...(page.crumbs ? { breadcrumb: { '@id': url + '#breadcrumb' } } : {}),
    },
  ]
  if (page.product !== false) graph.push(productNode(cfg))
  if (page.crumbs) {
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': url + '#breadcrumb',
      itemListElement: [{ name: 'Home', path: '/' }, ...page.crumbs].map((c, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
        item: abs(cfg, c.path),
      })),
    })
  }
  if (page.faq && page.faq.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': url + '#faq',
      mainEntity: page.faq.map((q) => ({
        '@type': 'Question',
        name: q.q,
        acceptedAnswer: { '@type': 'Answer', text: q.text || q.a.replace(/<[^>]+>/g, '') },
      })),
    })
  }
  if (page.terms && page.terms.length) {
    graph.push({
      '@type': 'DefinedTermSet',
      '@id': url + '#terms',
      name: `${cfg.name} glossary`,
      hasDefinedTerm: page.terms.map((t) => ({
        '@type': 'DefinedTerm',
        name: t.term,
        description: t.text || t.def.replace(/<[^>]+>/g, ''),
        url: url + '#' + t.id,
        inDefinedTermSet: url + '#terms',
      })),
    })
  }
  if (page.article) {
    graph.push({
      '@type': page.article.type || 'TechArticle',
      '@id': url + '#article',
      headline: page.article.headline || page.title,
      description: page.description,
      author: { '@id': cfg.org.url + '/#organization' },
      publisher: { '@id': cfg.org.url + '/#organization' },
      dateModified: page.updated || cfg.updated,
      datePublished: page.published || cfg.published,
      mainEntityOfPage: url + '#webpage',
      proficiencyLevel: page.article.level,
      about: page.article.about,
    })
  }
  if (page.howTo) {
    graph.push({
      '@type': 'HowTo',
      '@id': url + '#howto',
      name: page.howTo.name,
      description: page.howTo.description,
      step: page.howTo.steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.name, text: s.text, url: url + '#' + s.id })),
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}

export function headTags(page, cfg, assets) {
  const url = abs(cfg, page.path)
  const title = page.title
  const img = abs(cfg, page.image || '/og.png')
  const robots = page.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
  return [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">',
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(page.description)}">`,
    `<link rel="canonical" href="${esc(url)}">`,
    `<meta name="robots" content="${robots}">`,
    `<meta name="author" content="${esc(cfg.org.legalName)}">`,
    `<meta name="publisher" content="${esc(cfg.org.legalName)}">`,
    `<meta name="generator" content="${esc(cfg.id)}-site build.mjs">`,
    `<meta name="referrer" content="strict-origin-when-cross-origin">`,
    `<meta name="theme-color" content="${cfg.themeColor}">`,
    `<meta name="color-scheme" content="${cfg.colorScheme || 'light'}">`,
    `<meta property="og:type" content="${page.ogType || 'website'}">`,
    `<meta property="og:site_name" content="${esc(cfg.name)}">`,
    `<meta property="og:title" content="${esc(page.ogTitle || title)}">`,
    `<meta property="og:description" content="${esc(page.description)}">`,
    `<meta property="og:url" content="${esc(url)}">`,
    `<meta property="og:locale" content="${cfg.locale}">`,
    `<meta property="og:image" content="${img}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    `<meta property="og:image:alt" content="${esc(cfg.ogAlt)}">`,
    page.ogType === 'article' ? `<meta property="article:modified_time" content="${page.updated || cfg.updated}">` : '',
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:site" content="${esc(cfg.org.twitterHandle)}">`,
    `<meta name="twitter:title" content="${esc(page.ogTitle || title)}">`,
    `<meta name="twitter:description" content="${esc(page.description)}">`,
    `<meta name="twitter:image" content="${img}">`,
    '<link rel="icon" href="/favicon.svg" type="image/svg+xml">',
    '<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">',
    '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
    '<link rel="manifest" href="/manifest.webmanifest">',
    '<link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-readable summary">',
    '<link rel="sitemap" type="application/xml" href="/sitemap.xml">',
    `<link rel="author" href="/humans.txt">`,
    ...cfg.fonts.preload.map((f) => `<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin>`),
    ...(page.preload || []).map((p) => `<link rel="preload" href="${p.href}" as="${p.as}"${p.type ? ` type="${p.type}"` : ''}${p.media ? ` media="${p.media}"` : ''}${p.as === 'font' ? ' crossorigin' : ''}${p.priority ? ` fetchpriority="${p.priority}"` : ''}>`),
    `<link rel="stylesheet" href="${assets.css}">`,
    `<link rel="stylesheet" href="${assets.css2}">`,
    `<script src="${assets.js}" defer></script>`,
    `<script src="${assets.js2}" defer></script>`,
    jsonScript(structuredData(page, cfg)),
  ]
    .filter(Boolean)
    .join('\n')
}
