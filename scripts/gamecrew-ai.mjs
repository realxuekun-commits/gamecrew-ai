#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile, stat, readdir } from 'node:fs/promises';
import { extname, basename, resolve, relative, join } from 'node:path';
import process from 'node:process';

const VERSION = '0.3.0';
function help() { console.log(`GameCrew AI ${VERSION}\n\nUsage:\n  node scripts/gamecrew-ai.mjs --help\n  node scripts/gamecrew-ai.mjs validate <brief.json>\n  node scripts/gamecrew-ai.mjs run <brief.json> [--out <dir>]\n  node scripts/gamecrew-ai.mjs demo\n  node scripts/gamecrew-ai.mjs knowledge <init|import|index|query|doctor> [args]\n\nCommands:\n  validate  Check a game brief and report actionable errors as JSON.\n  run       Build deterministic local task, handoff, and quality artifacts.\n  demo      Print a valid example brief and delivery plan.\n  knowledge Manage a dependency-free local lexical knowledge workspace (not semantic embeddings).`); }

export function validateBrief(brief) {
  const errors = [];
  if (!brief || typeof brief !== 'object' || Array.isArray(brief)) return { valid: false, errors: ['Brief must be a JSON object.'] };
  for (const field of ['title', 'audience', 'goal']) if (typeof brief[field] !== 'string' || !brief[field].trim()) errors.push(`${field} must be a non-empty string.`);
  if (brief.channels !== undefined && (!Array.isArray(brief.channels) || brief.channels.some((v) => typeof v !== 'string' || !v.trim()))) errors.push('channels must be an array of strings when provided.');
  if (brief.constraints !== undefined && typeof brief.constraints !== 'string' && (!Array.isArray(brief.constraints) || brief.constraints.some((v) => typeof v !== 'string'))) errors.push('constraints must be a string or an array of strings when provided.');
  for (const field of ['facts', 'assumptions', 'unknowns', 'deliverables']) if (brief[field] !== undefined && (!Array.isArray(brief[field]) || brief[field].some((v) => typeof v !== 'string' && (typeof v !== 'object' || v === null)))) errors.push(`${field} must be an array of strings or objects when provided.`);
  return { valid: errors.length === 0, errors };
}
const demoBrief = { title: 'Cozy island builder launch', audience: 'Mobile strategy players aged 25–40', goal: 'Produce a testable launch creative brief in one day', channels: ['TikTok', 'Meta'], constraints: ['Use approved characters only', 'No unsupported performance claims'] };
const asList = (value) => value === undefined ? [] : (Array.isArray(value) ? value : [value]);
const text = (value) => typeof value === 'string' ? value : JSON.stringify(value);
const idFor = (brief) => createHash('sha256').update(JSON.stringify(brief)).digest('hex').slice(0, 12);

export function buildRun(brief) {
  const validation = validateBrief(brief); if (!validation.valid) return { validation };
  const taskId = `gc-${idFor(brief)}`, channels = asList(brief.channels), deliverables = asList(brief.deliverables);
  const facts = [{ key: 'title', value: brief.title }, { key: 'audience', value: brief.audience }, { key: 'goal', value: brief.goal }, ...(channels.length ? [{ key: 'channels', value: channels }] : []), ...(brief.constraints !== undefined ? [{ key: 'constraints', value: brief.constraints }] : []), ...asList(brief.facts).map((value, i) => ({ key: `fact_${i + 1}`, value: text(value) }))];
  const assumptions = asList(brief.assumptions).map(text), unknowns = [...asList(brief.unknowns).map(text)];
  if (!brief.launchDate) unknowns.push('Launch date is not specified.'); if (!brief.budget) unknowns.push('Budget is not specified.');
  const topology = channels.length > 1 || deliverables.length > 1 || brief.parallel === true ? 'parallel' : 'direct';
  const roles = ['creative-strategist', 'copywriter', 'quality-gate'];
  const tasks = roles.map((role, i) => ({ id: `${taskId}-t${i + 1}`, role, status: 'ready', dependsOn: i === 0 ? [] : [i === 1 && topology === 'parallel' ? `${taskId}-t1` : `${taskId}-t${i}`] }));
  return { validation, taskLedger: { schemaVersion: '1.0', taskId, topology, status: 'ready', source: 'local', facts, assumptions, unknowns, tasks }, roleHandoff: { schemaVersion: '1.0', taskId, topology, handoffs: tasks.map((task, i) => ({ from: i === 0 ? 'orchestrator' : tasks[i - 1].role, to: task.role, taskId: task.id, status: 'accepted', context: { factKeys: facts.map((f) => f.key), assumptionCount: assumptions.length, unknownCount: unknowns.length } })) }, qualityGateReport: { schemaVersion: '1.0', taskId, status: unknowns.length ? 'review_required' : 'pass', checks: [{ name: 'brief-validation', status: 'pass' }, { name: 'facts-traceable', status: facts.length ? 'pass' : 'fail' }, { name: 'unknowns-declared', status: 'pass' }, { name: 'local-only-execution', status: 'pass' }], blockingUnknowns: unknowns } };
}

const KNOWLEDGE_FILES = ['sources', 'manifests', 'index', 'prompts'];
const knowledgeDir = (dir = 'knowledge') => resolve(dir);
const inside = (root, target) => { const rel = relative(root, target); return rel === '' || (!rel.startsWith('..') && !rel.includes(`..${requireSep()}`) && !/^[A-Za-z]:/.test(rel)); };
const requireSep = () => '\\';
const sourceId = (name, content) => `src-${createHash('sha256').update(`${name}\0${content}`).digest('hex').slice(0, 12)}`;
const tokens = (value) => { const text = String(value).toLowerCase(); const words = text.match(/[a-z\d]+/g) || []; const cjk = [...text].filter((c) => /[\p{Script=Han}]/u.test(c)); return [...words, ...cjk]; };
function csvRows(input) {
  const rows = []; let row = []; let cell = ''; let quoted = false;
  for (let i = 0; i < input.length; i++) { const c = input[i]; if (c === '"' && input[i + 1] === '"' && quoted) { cell += '"'; i++; } else if (c === '"') quoted = !quoted; else if (c === ',' && !quoted) { row.push(cell); cell = ''; } else if ((c === '\n' || c === '\r') && !quoted) { if (c === '\r' && input[i + 1] === '\n') i++; row.push(cell); if (row.some((x) => x.trim())) rows.push(row); row = []; cell = ''; } else cell += c; }
  if (cell || row.length) { row.push(cell); if (row.some((x) => x.trim())) rows.push(row); } return rows;
}
async function filesUnder(input) { const s = await stat(input); if (s.isFile()) return [input]; const entries = await readdir(input, { withFileTypes: true }); const out = []; for (const e of entries.sort((a, b) => a.name.localeCompare(b.name))) { const p = join(input, e.name); if (e.isDirectory()) out.push(...await filesUnder(p)); else out.push(p); } return out; }
function chunksFrom(file, raw) {
  const ext = extname(file).toLowerCase(); const chunks = [];
  if (ext === '.md' || ext === '.markdown' || ext === '.txt') { raw.split(/\n\s*\n/).map((x) => x.trim()).filter(Boolean).forEach((content, i) => chunks.push({ content, section: i + 1 })); }
  else if (ext === '.json') { const value = JSON.parse(raw); const arr = Array.isArray(value) ? value : [value]; arr.forEach((v, i) => chunks.push({ content: typeof v === 'string' ? v : JSON.stringify(v), row: i + 1, data: v })); }
  else if (ext === '.csv') { const rows = csvRows(raw); const headers = rows.shift() || []; rows.forEach((r, i) => { const obj = Object.fromEntries(headers.map((h, j) => [h.trim(), r[j] ?? ''])); chunks.push({ content: JSON.stringify(obj), row: i + 2, data: obj }); }); }
  return chunks;
}
async function knowledgeInit(dir = 'knowledge') { const root = knowledgeDir(dir); await mkdir(root, { recursive: true }); for (const d of KNOWLEDGE_FILES) await mkdir(join(root, d), { recursive: true }); await writeFile(join(root, 'config.json'), JSON.stringify({ schemaVersion: '1.0', mode: 'lexical-fallback', semanticEmbeddings: false, note: 'Optional embedding adapters may be added by the user.' }, null, 2) + '\n'); await writeFile(join(root, 'prompts', 'knowledge-ingest.md'), '# Knowledge ingest\nNormalize facts, assumptions, unknowns, applicability, and limitations. Preserve source IDs.\n'); await writeFile(join(root, 'manifests', 'knowledge-manifest.json'), JSON.stringify({ schemaVersion: '1.0', chunks: 0, sources: [] }, null, 2) + '\n'); return { ok: true, dir: root, mode: 'lexical-fallback', created: KNOWLEDGE_FILES.concat(['config.json']) }; }
async function knowledgeImport(input, dir = 'knowledge') { const root = knowledgeDir(dir); const target = join(root, 'sources', 'chunks.jsonl'); if (!inside(root, target)) throw new Error('Unsafe knowledge directory path.'); const paths = await filesUnder(resolve(input)); const all = []; for (const file of paths) { if (!['.md', '.markdown', '.txt', '.json', '.csv'].includes(extname(file).toLowerCase())) continue; const raw = await readFile(file, 'utf8'); for (const c of chunksFrom(file, raw)) all.push({ knowledge_id: sourceId(file, c.content), source: file, source_name: basename(file), ...c }); } await mkdir(join(root, 'sources'), { recursive: true }); const existing = await readFile(target, 'utf8').catch(() => ''); const map = new Map(existing.split('\n').filter(Boolean).map((x) => [JSON.parse(x).knowledge_id, x])); for (const c of all) map.set(c.knowledge_id, JSON.stringify(c)); await writeFile(target, [...map.keys()].sort().map((k) => map.get(k)).join('\n') + (map.size ? '\n' : '')); await writeFile(join(root, 'manifests', 'knowledge-manifest.json'), JSON.stringify({ schemaVersion: '1.0', mode: 'lexical-fallback', chunks: map.size, sources: [...new Set([...map.values()].map((x) => JSON.parse(x).source))].sort() }, null, 2) + '\n'); return { ok: true, imported: all.length, total: map.size, file: target, mode: 'lexical-fallback' }; }
async function knowledgeIndex(dir = 'knowledge') { const root = knowledgeDir(dir); const raw = await readFile(join(root, 'sources', 'chunks.jsonl'), 'utf8').catch(() => ''); const chunks = raw.split('\n').filter(Boolean).map(JSON.parse); const postings = {}; for (const c of chunks) for (const token of tokens(c.content)) { postings[token] ??= {}; postings[token][c.knowledge_id] = (postings[token][c.knowledge_id] || 0) + 1; } const index = { schemaVersion: '1.0', mode: 'lexical-fallback', chunks: chunks.map(({ knowledge_id, source, source_name, content }) => ({ knowledge_id, source, source_name, preview: content.slice(0, 240) })).sort((a, b) => a.knowledge_id.localeCompare(b.knowledge_id)), postings }; await mkdir(join(root, 'index'), { recursive: true }); await writeFile(join(root, 'index', 'lexical-index.json'), JSON.stringify(index, null, 2) + '\n'); return { ok: true, mode: index.mode, chunks: chunks.length, terms: Object.keys(postings).length, file: join(root, 'index', 'lexical-index.json') }; }
async function knowledgeQuery(query, dir = 'knowledge') { const index = JSON.parse(await readFile(join(knowledgeDir(dir), 'index', 'lexical-index.json'), 'utf8')); const scores = {}; for (const t of tokens(query)) for (const [id, n] of Object.entries(index.postings[t] || {})) scores[id] = (scores[id] || 0) + n; const results = index.chunks.filter((c) => scores[c.knowledge_id]).map((c) => ({ ...c, score: scores[c.knowledge_id] })).sort((a, b) => b.score - a.score || a.knowledge_id.localeCompare(b.knowledge_id)); return { ok: true, mode: 'lexical-fallback', query, results }; }
async function knowledgeDoctor(dir = 'knowledge') { const root = knowledgeDir(dir); const checks = {}; for (const p of ['config.json', 'sources/chunks.jsonl', 'index/lexical-index.json', 'manifests/knowledge-manifest.json']) { try { checks[p] = (await stat(join(root, p))).isFile(); } catch { checks[p] = false; } } let chunks = 0; try { chunks = (await readFile(join(root, 'sources/chunks.jsonl'), 'utf8')).split('\n').filter(Boolean).length; } catch {} return { ok: checks['config.json'] && checks['index/lexical-index.json'], mode: 'lexical-fallback', ready: checks['config.json'] && checks['index/lexical-index.json'], chunks, checks }; }

async function main(argv) {
  const [command, arg, ...flags] = argv;
  if (!command || command === '--help' || command === '-h') { help(); return 0; }
  if (command === 'demo') { console.log(JSON.stringify({ brief: demoBrief, validation: validateBrief(demoBrief), delivery: ['concept', 'script', 'production checklist', 'quality gates'] }, null, 2)); return 0; }
  if (command === 'knowledge') {
    const sub = arg; const di = flags.indexOf('--dir'); const dir = di >= 0 && flags[di + 1] ? flags[di + 1] : 'knowledge'; const positional = flags.find((x, i) => x !== '--dir' && flags[i - 1] !== '--dir');
    try {
      let result;
      if (sub === 'init') result = await knowledgeInit(positional && !positional.startsWith('--') ? positional : 'knowledge');
      else if (sub === 'import') { if (!positional || positional.startsWith('--')) throw new Error('Usage: knowledge import <path> [--dir <knowledge-dir>]'); result = await knowledgeImport(positional, dir); }
      else if (sub === 'index') result = await knowledgeIndex(dir);
      else if (sub === 'query') { if (!positional || positional.startsWith('--')) throw new Error('Usage: knowledge query <text> [--dir <knowledge-dir>]'); result = await knowledgeQuery(positional, dir); }
      else if (sub === 'doctor') result = await knowledgeDoctor(dir);
      else throw new Error('Usage: knowledge <init|import|index|query|doctor>');
      console.log(JSON.stringify(result, null, 2)); return result.ok === false ? 1 : 0;
    } catch (error) { console.error(JSON.stringify({ ok: false, error: error.message })); return 2; }
  }
  if (command !== 'validate' && command !== 'run') { console.error(`Unknown command: ${command}`); help(); return 2; }
  if (!arg) { console.error(JSON.stringify({ valid: false, errors: [`Usage: ${command} <brief.json>${command === 'run' ? ' [--out <dir>]' : ''}`] })); return 2; }
  try {
    const brief = JSON.parse(await readFile(arg, 'utf8'));
    if (command === 'validate') { const result = validateBrief(brief); console.log(JSON.stringify(result, null, 2)); return result.valid ? 0 : 1; }
    const result = buildRun(brief); if (!result.validation.valid) { console.error(JSON.stringify(result.validation, null, 2)); return 1; }
    const oi = flags.indexOf('--out'), outDir = oi >= 0 && flags[oi + 1] ? flags[oi + 1] : 'outputs/gamecrew-run'; await mkdir(outDir, { recursive: true });
    await Promise.all([writeFile(`${outDir}/task-ledger.json`, `${JSON.stringify(result.taskLedger, null, 2)}\n`), writeFile(`${outDir}/role-handoff.json`, `${JSON.stringify(result.roleHandoff, null, 2)}\n`), writeFile(`${outDir}/quality-gate-report.json`, `${JSON.stringify(result.qualityGateReport, null, 2)}\n`)]);
    console.log(JSON.stringify({ ok: true, taskId: result.taskLedger.taskId, topology: result.taskLedger.topology, outDir, artifacts: ['task-ledger.json', 'role-handoff.json', 'quality-gate-report.json'] }, null, 2)); return 0;
  } catch (error) { console.error(JSON.stringify({ valid: false, errors: [`Unable to read or parse ${arg}: ${error.message}`] })); return 2; }
}
main(process.argv.slice(2)).then((code) => { process.exitCode = code; });
