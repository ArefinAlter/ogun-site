#!/usr/bin/env node
// Re-captures every terminal transcript and data sample the site shows, by running the real `ogun` and `ogund`
// binaries against the examples in the product repository. The output goes to src/captures/ and is committed:
// the site build reads it and shows it unchanged, so nothing on the site is typed by hand.
//
//   node tools/capture.mjs --bin <dir with ogun and ogund> --repo <path to the ogun repository>
//
// The binaries come from the GitHub release (ogun-0.0.1a-windows-x64.zip or ogun-0.0.1a-linux-x64.tar.gz) or from
// `cargo build -p ogun-cli -p ogun-daemon`. Everything runs against a throw-away profile: nothing touches the
// network, no workflow names a real host, and the profile directory is deleted at the end.
import { spawn, spawnSync } from 'node:child_process'
import { mkdirSync, readFileSync, rmSync, writeFileSync, readdirSync, statSync, copyFileSync, existsSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import os from 'node:os'

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)))
const OUT = join(ROOT, 'src', 'captures')
const arg = (n) => { const i = process.argv.indexOf('--' + n); return i > 0 ? process.argv[i + 1] : undefined }
const BIN = resolve(arg('bin') || '')
const REPO = resolve(arg('repo') || '')
const exe = process.platform === 'win32' ? '.exe' : ''
const OGUN = join(BIN, 'ogun' + exe)
const OGUND = join(BIN, 'ogund' + exe)
for (const [n, p] of [['ogun', OGUN], ['ogund', OGUND], ['repo examples', join(REPO, 'examples')]]) if (!existsSync(p)) { console.error(`missing ${n}: ${p}`); process.exit(2) }

const profile = 'site-capture-' + Date.now().toString(36)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
mkdirSync(OUT, { recursive: true })

/** Runs ogun and returns {out, code}. `shown` is what the transcript prints after the prompt. */
function ogun(args, { cwd = REPO, profiled = false, input } = {}) {
  const full = profiled ? ['--profile', profile, ...args] : args
  const r = spawnSync(OGUN, full, { cwd, encoding: 'utf8', input, env: { ...process.env, NO_COLOR: '1' } })
  return { out: ((r.stdout || '') + (r.stderr || '')).replace(/\r\n/g, '\n').trimEnd(), code: r.status }
}
const transcript = []
const show = (cmd, res) => { transcript.push(`$ ${cmd}`); if (res.out) transcript.push(res.out); if (res.code) transcript.push(`[exit status ${res.code}]`) }
const flush = (name) => { writeFileSync(join(OUT, name), transcript.join('\n') + '\n'); transcript.length = 0 }
const ex = 'examples/bikeshare/'

// ---------------------------------------------------------------- offline commands (no daemon)
show('ogun --version', ogun(['--version']))
flush('version.txt')

show(`ogun validate ${ex}trips-backfill.workflow.json`, ogun(['validate', `${ex}trips-backfill.workflow.json`]))
show(`ogun validate ${ex}rebalance-plan.workflow.json`, ogun(['validate', `${ex}rebalance-plan.workflow.json`]))
show(`ogun hash ${ex}rebalance-plan.workflow.json`, ogun(['hash', `${ex}rebalance-plan.workflow.json`]))
flush('validate.txt')

show(`ogun diff ${ex}rebalance-plan.workflow.json ${ex}rebalance-plan.v2.workflow.json`, ogun(['diff', `${ex}rebalance-plan.workflow.json`, `${ex}rebalance-plan.v2.workflow.json`]))
flush('diff.txt')

show(`ogun partitions ${ex}trips-backfill.workflow.json --from 2019-01 --to 2026-09`, ogun(['partitions', `${ex}trips-backfill.workflow.json`, '--from', '2019-01', '--to', '2026-09']))
show(`ogun next ${ex}district-report.workflow.json`, ogun(['next', `${ex}district-report.workflow.json`]))
flush('partitions.txt')

// ---------------------------------------------------------------- MCP: the tools the server offers, with and without a daemon
const rpc = (msgs) => {
  const r = spawnSync(OGUN, ['--profile', profile, 'mcp'], { cwd: REPO, encoding: 'utf8', input: msgs.map((m) => JSON.stringify(m)).join('\n') + '\n', timeout: 30000 })
  return r.stdout.trim().split('\n').filter(Boolean).map((l) => JSON.parse(l))
}
const init = [
  { jsonrpc: '2.0', id: 1, method: 'initialize', params: { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'site-capture', version: '0' } } },
  { jsonrpc: '2.0', method: 'notifications/initialized' },
]
const toolNames = (resp) => resp.find((r) => r.id === 2).result.tools.map((t) => t.name)
const offlineTools = toolNames(rpc([...init, { jsonrpc: '2.0', id: 2, method: 'tools/list' }]))
const ops = JSON.parse(rpc([...init, { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'ogun_operators', arguments: {} } }]).find((r) => r.id === 3).result.content[0].text)
writeFileSync(join(OUT, 'operators.json'), JSON.stringify(ops, null, 2) + '\n')

// ---------------------------------------------------------------- a daemon, a backfill, kill -9, restart
const start = () => spawn(OGUND, ['--profile', profile], { stdio: 'ignore' })
const waitUp = async () => { for (let i = 0; i < 100; i++) { if (ogun(['daemon', 'status'], { profiled: true }).out.startsWith('ogund')) return; await sleep(100) } throw new Error('ogund did not start') }
const wf = 'exit-backfill.workflow.json'
let d = start()
await waitUp()
// With an `agent` credential (which only a person on a terminal can create, and which Windows cannot yet do: O-15
// section 4.4) the server also offers the daemon-backed tools. They are read from the source, not from a run.
const srcTools = [...readFileSync(join(REPO, 'crates', 'ogun-cli', 'src', 'mcp.rs'), 'utf8').matchAll(/^\s+name: "(ogun_[a-z_]+)",/gm)].map((m) => m[1])
writeFileSync(join(OUT, 'mcp-tools.json'), JSON.stringify({ protocol: '2025-06-18', offered_without_a_daemon: offlineTools, daemon_backed_from_source: srcTools }, null, 2) + '\n')

const cap = { cwd: OUT, profiled: true }
transcript.push('$ ogund &')
show('ogun daemon status', ogun(['daemon', 'status'], cap))
show(`ogun put ${wf}`, ogun(['put', wf], cap))
show('ogun backfill exit-backfill --from 2024-01-01 --to 2024-04-30', ogun(['backfill', 'exit-backfill', '--from', '2024-01-01', '--to', '2024-04-30'], cap))
const started = ogun(['backfill', 'exit-backfill', '--from', '2024-01-01', '--to', '2024-04-30', '--yes'], cap)
show('ogun backfill exit-backfill --from 2024-01-01 --to 2024-04-30 --yes', started)
const run = started.out.match(/orun_[0-9A-Z]+/)[0]
let last = ''
for (;;) { last = ogun(['partition-status', 'exit-backfill'], cap).out; const m = last.match(/done\s+(\d+)/); if (m && +m[1] >= 30) break; await sleep(5) }
show('ogun partition-status exit-backfill', { out: last })
d.kill('SIGKILL')
transcript.push('# ogund killed here (SIGKILL; TerminateProcess on Windows)')
await sleep(500)
d = start()
transcript.push('$ ogund &')
await waitUp()
await sleep(1200)
show('ogun partition-status exit-backfill', ogun(['partition-status', 'exit-backfill'], cap))
for (let i = 0; i < 40; i++) { if (/done\s+121/.test(ogun(['partition-status', 'exit-backfill'], cap).out)) break; await sleep(500) }
show('ogun partition-status exit-backfill', ogun(['partition-status', 'exit-backfill'], cap))
const shown = ogun(['show', run], cap).out.split('\n')
const reran = shown.filter((l) => /attempt [2-9]/.test(l))
transcript.push(`$ ogun show ${run} | grep "attempt [2-9]"`)
transcript.push(...reran)
transcript.push(`# ${reran.length} of ${shown.length - 1} node instances ran again; the other ${shown.length - 1 - reran.length} were not touched`)
show('ogun backfill exit-backfill --from 2024-01-01 --to 2024-04-30', ogun(['backfill', 'exit-backfill', '--from', '2024-01-01', '--to', '2024-04-30'], cap))
flush('exit-backfill.txt')

// A real artifact record, and the real layout of the content-addressed store.
const arts = JSON.parse(ogun(['artifacts', run, '--json'], cap).out).artifacts
writeFileSync(join(OUT, 'artifact.json'), JSON.stringify(arts[0], null, 2) + '\n')
const stateDir = ogun(['daemon', 'paths'], cap).out.match(/^state\s+(.+)$/m)[1].trim()
const walk = (dir) => readdirSync(dir).flatMap((n) => { const p = join(dir, n); return statSync(p).isDirectory() ? walk(p) : [p] })
const rel = (p) => relative(join(stateDir, 'artifacts'), p).split(/[\\/]/).join('/')
const objects = walk(join(stateDir, 'artifacts', 'objects')).map(rel).sort()
const store = JSON.parse(readFileSync(join(stateDir, 'artifacts', 'store.json'), 'utf8'))
writeFileSync(join(OUT, 'cas.txt'), [`artifacts/store.json  ${JSON.stringify({ format: store.format, format_version: store.format_version, object_algorithm: store.object_algorithm, fanout: store.fanout, index: store.index })}`, ...objects.slice(0, 4), `... ${objects.length} objects in all, one per distinct content`].join('\n') + '\n')

d.kill('SIGKILL')
await sleep(500)
try { rmSync(stateDir, { recursive: true, force: true }) } catch {}

writeFileSync(join(OUT, 'meta.json'), JSON.stringify({
  captured_at: new Date().toISOString(),
  ogun_version: ogun(['--version']).out,
  platform: `${os.type()} ${os.release()} ${process.arch}`,
  repo_examples: 'examples/bikeshare, examples/noaa-daily.workflow.json',
  how: 'node tools/capture.mjs --bin <dir> --repo <ogun checkout>',
}, null, 2) + '\n')
console.log('captured into', OUT)
