import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';

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
