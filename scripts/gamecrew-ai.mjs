#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import process from 'node:process';

const VERSION = '0.2.0';
function help() { console.log(`GameCrew AI ${VERSION}\n\nUsage:\n  node scripts/gamecrew-ai.mjs --help\n  node scripts/gamecrew-ai.mjs validate <brief.json>\n  node scripts/gamecrew-ai.mjs run <brief.json> [--out <dir>]\n  node scripts/gamecrew-ai.mjs demo\n\nCommands:\n  validate  Check a game brief and report actionable errors as JSON.\n  run       Build deterministic local task, handoff, and quality artifacts.\n  demo      Print a valid example brief and delivery plan.`); }

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

async function main(argv) {
  const [command, arg, ...flags] = argv;
  if (!command || command === '--help' || command === '-h') { help(); return 0; }
  if (command === 'demo') { console.log(JSON.stringify({ brief: demoBrief, validation: validateBrief(demoBrief), delivery: ['concept', 'script', 'production checklist', 'quality gates'] }, null, 2)); return 0; }
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
