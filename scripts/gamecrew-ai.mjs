#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import process from 'node:process';

const VERSION = '0.1.0';

function help() {
  console.log(`GameCrew AI ${VERSION}\n\nUsage:\n  node scripts/gamecrew-ai.mjs --help\n  node scripts/gamecrew-ai.mjs validate <brief.json>\n  node scripts/gamecrew-ai.mjs demo\n\nCommands:\n  validate  Check a game brief and report actionable errors as JSON.\n  demo      Print a valid example brief and delivery plan.\n`);
}

function validateBrief(brief) {
  const errors = [];
  if (!brief || typeof brief !== 'object' || Array.isArray(brief)) {
    return { valid: false, errors: ['Brief must be a JSON object.'] };
  }
  for (const field of ['title', 'audience', 'goal']) {
    if (typeof brief[field] !== 'string' || !brief[field].trim()) {
      errors.push(`${field} must be a non-empty string.`);
    }
  }
  if (brief.channels !== undefined && (!Array.isArray(brief.channels) || brief.channels.some((v) => typeof v !== 'string'))) {
    errors.push('channels must be an array of strings when provided.');
  }
  if (brief.constraints !== undefined && typeof brief.constraints !== 'string' && !Array.isArray(brief.constraints)) {
    errors.push('constraints must be a string or an array when provided.');
  }
  return { valid: errors.length === 0, errors };
}

const demoBrief = {
  title: 'Cozy island builder launch',
  audience: 'Mobile strategy players aged 25–40',
  goal: 'Produce a testable launch creative brief in one day',
  channels: ['TikTok', 'Meta'],
  constraints: ['Use approved characters only', 'No unsupported performance claims']
};

async function main(argv) {
  const [command, arg] = argv;
  if (!command || command === '--help' || command === '-h') {
    help();
    return 0;
  }
  if (command === 'demo') {
    const result = validateBrief(demoBrief);
    console.log(JSON.stringify({ brief: demoBrief, validation: result, delivery: ['concept', 'script', 'production checklist', 'quality gates'] }, null, 2));
    return 0;
  }
  if (command === 'validate') {
    if (!arg) {
      console.error(JSON.stringify({ valid: false, errors: ['Usage: validate <brief.json>'] }));
      return 2;
    }
    try {
      const brief = JSON.parse(await readFile(arg, 'utf8'));
      const result = validateBrief(brief);
      console.log(JSON.stringify(result, null, 2));
      return result.valid ? 0 : 1;
    } catch (error) {
      console.error(JSON.stringify({ valid: false, errors: [`Unable to read or parse ${arg}: ${error.message}`] }));
      return 2;
    }
  }
  console.error(`Unknown command: ${command}`);
  help();
  return 2;
}

main(process.argv.slice(2)).then((code) => { process.exitCode = code; });

