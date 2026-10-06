// Small helpers for authoring pages as template strings. No dependencies.

const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }

/** Escapes text for HTML content and attribute values. */
export const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ENTITIES[c])

/** Joins a list of HTML fragments. */
export const join = (items, sep = '') => (items || []).filter((x) => x !== false && x != null).join(sep)

/** Builds an attribute string from an object; `true` renders a bare attribute, false/null are dropped. */
export function attrs(map) {
  return Object.entries(map || {})
    .filter(([, v]) => v !== false && v != null)
    .map(([k, v]) => (v === true ? ` ${k}` : ` ${k}="${esc(v)}"`))
    .join('')
}

/** Converts a heading text into a stable fragment id. */
export const slug = (text) =>
  String(text)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&[a-z]+;/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** Serializes JSON-LD safely inside a script element. */
export const jsonScript = (data) =>
  `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`
