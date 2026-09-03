# Changelog | 更新说明

## Unreleased — Core Prompt Extensions

- Added `extensions/lingxi-core-prompts`, a bilingual modular prompt package for strategy, creative, growth, operations, knowledge and engineering employees.
- Added a manifest with optional capability mappings and explicit permission boundaries.
- Added no-integration fallbacks for every module so Lingxi users can start from local files, CSV/JSON fixtures and manual approval.
- Added a frontier design module covering hybrid retrieval, evidence ledgers, stateful agent graphs, handoff contracts, tracing and evaluation gates.
- Added a bilingual product-positioning module for packaging Lingxi's advanced capabilities with explicit evidence boundaries.

## v0.3.0 — 2026-09-03

### 中文

本版本新增 **Knowledge Setup Wizard（知识库搭建向导）**，让下载者在没有第三方服务的情况下，也能按统一工作流在本地建立知识库。

新增命令：

```bash
node scripts/gamecrew-ai.mjs knowledge init ./knowledge
node scripts/gamecrew-ai.mjs knowledge import ./docs --dir ./knowledge
node scripts/gamecrew-ai.mjs knowledge index --dir ./knowledge
node scripts/gamecrew-ai.mjs knowledge query "海外素材测试" --dir ./knowledge
node scripts/gamecrew-ai.mjs knowledge doctor --dir ./knowledge
```

主要变化：

- 自动生成 `sources/`、`manifests/`、`index/`、`prompts/` 和 `config.json`。
- 支持 Markdown、JSON、CSV、TXT 导入。
- 生成带 `knowledge_id`、来源文件和片段定位信息的规范化 JSONL。
- 建立可复现的离线词法索引，支持中文关键词查询和结果排序。
- 提供知识库健康检查，能识别配置、片段、清单和索引是否就绪。
- 非法路径、缺失文件和解析失败均安全返回，不写入半成品状态。
- 明确区分“离线词法 fallback”和“语义向量检索”；后续可接本地 embedding 模型或用户已有向量库。
- 7/7 自动测试通过。

### 能力边界

本版本不调用外部 API，不读取登录态，不上传知识文件，也不内置任何组织私有知识。向量模型、远程数据库和内部 MCP 仍需下载者自行配置，并必须保留授权、健康探针和回退方案。

### English

This release adds the **Knowledge Setup Wizard**, allowing users to build a local knowledge workspace without third-party services.

New commands:

```bash
node scripts/gamecrew-ai.mjs knowledge init ./knowledge
node scripts/gamecrew-ai.mjs knowledge import ./docs --dir ./knowledge
node scripts/gamecrew-ai.mjs knowledge index --dir ./knowledge
node scripts/gamecrew-ai.mjs knowledge query "creative testing" --dir ./knowledge
node scripts/gamecrew-ai.mjs knowledge doctor --dir ./knowledge
```

Highlights:

- Creates `sources/`, `manifests/`, `index/`, `prompts/` and `config.json`.
- Imports Markdown, JSON, CSV and TXT files.
- Produces normalized JSONL chunks with stable knowledge IDs and source metadata.
- Builds a deterministic offline lexical index with ranked Chinese and English keyword search.
- Adds readiness diagnostics for configuration, chunks, manifest and index files.
- Fails safely on invalid paths, missing files and parse errors.
- Clearly labels lexical fallback as distinct from semantic vector retrieval; local embedding models and user-owned vector stores can be added later.
- All 7 automated tests pass.

### Scope

The release does not call external APIs, read browser sessions, upload knowledge files or bundle private organizational knowledge. Embedding models, hosted databases and internal MCP integrations remain optional user-configured adapters with explicit authorization, health probes and fallbacks.

## v0.2.0 — 2026-09-01

- Added local task ledger, role handoff and quality-gate artifacts.
- Added deterministic `run <brief.json> --out <dir>` workflow.
- Added local capability map and fallback guidance.

## v0.1.1 — 2026-09-01

- Added MIT license and first public release metadata.
