#!/usr/bin/env node
// Preview server for dist/ with clean URLs, the same 404 page as production, and the production security headers.
// Usage: node serve.mjs [port] [--frames]   (run `node build.mjs` first)
import { createServer } from 'node:http'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIST = join(fileURLToPath(new URL('.', import.meta.url)), 'dist')
const port = Number(process.argv.find((a) => /^\d+$/.test(a)) || 4321)
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.webmanifest': 'application/manifest+json', '.json': 'application/json' }
const vercel = JSON.parse(readFileSync(new URL('vercel.json', import.meta.url), 'utf8'))
const globalHeaders = Object.fromEntries((vercel.headers.find((h) => h.source === '/(.*)')?.headers || []).map((h) => [h.key, h.value]))
// --frames: allow framing for local responsive previews (never in production).
if (process.argv.includes('--frames')) {
  delete globalHeaders['X-Frame-Options']
  globalHeaders['Content-Security-Policy'] = globalHeaders['Content-Security-Policy'].replace("frame-ancestors 'none'", 'frame-ancestors *')
}

createServer((req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/\\/g, '/')
  let file = join(DIST, path)
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html')
  const ok = existsSync(file) && file.startsWith(DIST)
  if (!ok) file = join(DIST, '404.html')
  res.writeHead(ok ? 200 : 404, { ...globalHeaders, 'Content-Type': TYPES[extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' })
  res.end(readFileSync(file))
}).listen(port, '127.0.0.1', () => console.log(`http://127.0.0.1:${port}/`))
