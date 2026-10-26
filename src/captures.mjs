// Real output, captured by tools/capture.mjs from the released binaries and the product repository's examples.
// Pages show these files unchanged; nothing in them is typed by hand. Re-capture with `node tools/capture.mjs`.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const DIR = join(fileURLToPath(new URL('.', import.meta.url)), 'captures')
const read = (n) => readFileSync(join(DIR, n), 'utf8')

export const META = JSON.parse(read('meta.json'))
export const OPERATORS = JSON.parse(read('operators.json')).operators
export const MCP_TOOLS = JSON.parse(read('mcp-tools.json'))
export const text = (n) => read(n).replace(/\n+$/, '')
export const json = (n) => JSON.parse(read(n))

/** "captured 2026-10-26 with ogun 0.0.1-alpha on Windows" for figure captions. */
export const CAPTURED = `captured ${META.captured_at.slice(0, 10)} with ${META.ogun_version} on ${META.platform.startsWith('Windows') ? 'Windows 11' : META.platform.split(' ')[0]}`

/** The lines of a transcript from the first line that starts with `from` up to, not including, the first that starts with `to`. */
export const between = (t, from, to) => {
  const lines = t.split('\n')
  const a = lines.findIndex((l) => l.startsWith(from))
  const b = lines.findIndex((l, i) => i > a && l.startsWith(to))
  return lines.slice(a, b < 0 ? undefined : b).join('\n')
}
