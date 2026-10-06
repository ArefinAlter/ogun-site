// Converts rendered page HTML into readable Markdown-like text for llms-full.txt and for checks.

const NAMED = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', mdash: '—', ndash: '–', hellip: '…', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', middot: '·', times: '×', rarr: '→', larr: '←', sect: '§', copy: '©', reg: '®', trade: '™', deg: '°' }

export function decode(s) {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => NAMED[n.toLowerCase()] ?? m)
}

/** HTML of a page's main element to Markdown-like text. Drops SVG, scripts, and elements marked data-llm="skip". */
export function htmlToText(html) {
  let s = html
    .replace(/<(svg|script|style|template|noscript)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/<([a-z0-9]+)\b[^>]*data-llm="skip"[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
  s = s.replace(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (_, l, t) => `\n\n${'#'.repeat(Number(l))} ${strip(t)}\n\n`)
  s = s.replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (_, t) => `\n- ${strip(t)}`)
  s = s.replace(/<(dt)\b[^>]*>([\s\S]*?)<\/dt>/gi, (_, __, t) => `\n**${strip(t)}**`)
  s = s.replace(/<(dd)\b[^>]*>([\s\S]*?)<\/dd>/gi, (_, __, t) => `\n${strip(t)}`)
  s = s.replace(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi, (_, row) => {
    const cells = [...row.matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)].map((m) => strip(m[1]))
    return `\n| ${cells.join(' | ')} |`
  })
  s = s.replace(/<pre\b[^>]*>([\s\S]*?)<\/pre>/gi, (_, t) => `\n\n\`\`\`\n${decode(t.replace(/<[^>]+>/g, ''))}\n\`\`\`\n\n`)
  s = s.replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_, h, t) => {
    const label = strip(t)
    return h.startsWith('#') || !label ? label : `[${label}](${h})`
  })
  s = s.replace(/<\/(p|div|section|article|header|footer|figure|figcaption|blockquote|table|ul|ol|dl)>/gi, '\n\n')
  s = decode(s.replace(/<[^>]+>/g, ''))
  return s
    .split('\n')
    .map((l) => l.replace(/[ \t]+/g, ' ').trim())
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

function strip(t) {
  return decode(t.replace(/<(svg|script)\b[\s\S]*?<\/\1>/gi, '').replace(/<[^>]+>/g, ''))
    .replace(/\s+/g, ' ')
    .trim()
}
