# GameCrew AI Maintainer Guide

## Release promise

GameCrew AI is an experimental, local-first reference implementation for an agentic game-publishing delivery workflow. It does not publish campaigns, alter advertising budgets, access private business data, or make performance claims without verified evidence.

## Maintain the project

Before merging a change:

1. Run `node --test tests/gamecrew-ai.test.mjs`.
2. Run `node scripts/gamecrew-ai.mjs validate examples/launch-brief.json`.
3. Record behavior changes in the release notes.
4. Keep facts, assumptions and recommendations distinct.
5. Do not add credentials, private player data, partner assets or internal endpoints.

## Contribution workflow

Open an issue with a reproducible example before proposing a behavior change. Pull requests should include the affected brief contract, validation result and any new test coverage. Maintainers review safety boundaries, factual claims and release impact before merging.

## Roadmap

- Stabilize the brief schema and validation errors.
- Add sample role handoffs and quality-gate reports.
- Add a local task ledger with redacted fixtures.
- Publish extension examples for Skills and MCP-compatible tools.
