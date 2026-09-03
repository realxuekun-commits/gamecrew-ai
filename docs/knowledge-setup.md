# Knowledge Setup Wizard | 知识库搭建向导

## 中文

公开版提供一个不依赖第三方 API 的本地知识库向导。它把 Markdown、JSON 和 CSV 转成带来源信息的规范化知识片段，并建立可复现的词法索引。词法索引是离线保底方案，不等同于语义向量；下载者可以在不改变知识格式的前提下，后续接入本地 embedding 模型或外部向量服务。

### 快速开始

```bash
node scripts/gamecrew-ai.mjs knowledge init ./knowledge
node scripts/gamecrew-ai.mjs knowledge import ./docs --dir ./knowledge
node scripts/gamecrew-ai.mjs knowledge index --dir ./knowledge
node scripts/gamecrew-ai.mjs knowledge query "海外素材测试" --dir ./knowledge
node scripts/gamecrew-ai.mjs knowledge doctor --dir ./knowledge
```

`init` 生成 `sources/`、`manifests/`、`index/`、`prompts/` 和 `config.json`。`import` 只读取指定路径下的公开文件，并写入 `sources/normalized.jsonl`；不会联网、读取凭据或把文件上传到 GitHub。`index` 生成确定性的 `index/lexical-index.json`。`query` 返回排名、知识 ID、来源文件和片段预览。`doctor` 检查目录、配置、片段和索引是否就绪。

### 三种接入模式

1. **离线词法模式**：零第三方依赖，适合快速开始和敏感资料；缺少 embedding 时自动使用。
2. **本地向量模式**：保留同一份规范化片段，增加本地 embedding adapter；模型和向量文件留在用户设备。
3. **外部向量模式**：通过用户自行配置的 adapter 接入向量服务；必须单独验证权限、数据范围和失败回退。

知识条目应区分 `facts`、`assumptions`、`unknowns`、`applicability` 和 `limitations`。只有经过人工确认的复盘，才能标记为 `approved` 并进入长期记忆。

## English

The public reference includes a no-API local knowledge setup wizard. It normalizes Markdown, JSON and CSV into source-traceable knowledge chunks and builds a deterministic lexical index. Lexical search is an offline fallback, not semantic embeddings; local embedding models or external vector services can be attached later without changing the normalized format.

```bash
node scripts/gamecrew-ai.mjs knowledge init ./knowledge
node scripts/gamecrew-ai.mjs knowledge import ./docs --dir ./knowledge
node scripts/gamecrew-ai.mjs knowledge index --dir ./knowledge
node scripts/gamecrew-ai.mjs knowledge query "creative testing" --dir ./knowledge
node scripts/gamecrew-ai.mjs knowledge doctor --dir ./knowledge
```

The wizard never uploads files, reads credentials or treats a successful index as proof of semantic retrieval. Every entry should preserve facts, assumptions, unknowns, applicability and limitations; only human-approved retrospectives enter long-term memory.
