import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const cli = 'scripts/gamecrew-ai.mjs';

test('--help prints usage', () => {
  const out = execFileSync(process.execPath, [cli, '--help'], { encoding: 'utf8' });
  assert.match(out, /Usage:/);
});

test('demo is valid and machine-readable', () => {
  const out = execFileSync(process.execPath, [cli, 'demo'], { encoding: 'utf8' });
  const result = JSON.parse(out);
  assert.equal(result.validation.valid, true);
});

test('validate returns non-zero for missing fields', () => {
  const result = spawnSync(process.execPath, [cli, 'validate', 'missing-file.json'], { encoding: 'utf8' });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /Unable to read/);
});

test('run creates deterministic local artifacts and parallel topology', () => {
  const out = mkdtempSync(join(tmpdir(), 'gamecrew-'));
  try {
    const first = execFileSync(process.execPath, [cli, 'run', 'examples/launch-brief.json', '--out', out], { encoding: 'utf8' });
    const summary = JSON.parse(first);
    assert.equal(summary.ok, true);
    assert.equal(summary.topology, 'parallel');
    const ledger = JSON.parse(readFileSync(join(out, 'task-ledger.json'), 'utf8'));
    const handoff = JSON.parse(readFileSync(join(out, 'role-handoff.json'), 'utf8'));
    const gate = JSON.parse(readFileSync(join(out, 'quality-gate-report.json'), 'utf8'));
    assert.equal(ledger.source, 'local');
    assert.equal(ledger.facts.find((f) => f.key === 'title').value, 'Cozy island builder launch');
    assert.ok(ledger.unknowns.length > 0);
    assert.equal(handoff.handoffs.length, 3);
    assert.equal(gate.status, 'review_required');
    const again = execFileSync(process.execPath, [cli, 'run', 'examples/launch-brief.json', '--out', out], { encoding: 'utf8' });
    assert.equal(JSON.parse(again).taskId, ledger.taskId);
    assert.deepEqual(JSON.parse(readFileSync(join(out, 'task-ledger.json'), 'utf8')), ledger);
  } finally { rmSync(out, { recursive: true, force: true }); }
});

test('run rejects invalid brief without producing artifacts', () => {
  const out = mkdtempSync(join(tmpdir(), 'gamecrew-'));
  const result = spawnSync(process.execPath, [cli, 'run', 'missing-file.json', '--out', out], { encoding: 'utf8' });
  assert.equal(result.status, 2);
  assert.match(result.stderr, /Unable to read/);
  rmSync(out, { recursive: true, force: true });
});
