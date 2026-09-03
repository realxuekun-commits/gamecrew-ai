# Frontier Knowledge & Agent Runtime Patterns
# 前沿知识库与智能体协作运行模式

## 定位

GameCrew AI 不把“向量数据库”或“多 Agent”当作孤立功能，而是把它们放进一条可追踪的运行链：

```text
原始资料 → 规范化切片 → 混合检索 → 证据账本
→ 状态化任务图 → 结构化交接 → 质量门 → 人工确认 → 记忆更新
```

本模块将前沿实践转换成可在本地优先开源工作站落地的设计。它不是对任何单一数据库、模型或 Agent 框架的绑定。

## 1. 数据库与知识系统

### 1.1 混合检索是默认方向

精确产品名、国家、版本号和指标需要关键词命中；同义表达和自然语言问题需要语义相似度。因此建议把全文和向量作为两种互补的召回信号，再做融合与重排：

```text
SQLite FTS5（关键词 / 前缀 / BM25）
                 +
可选 Embedding（语义召回）
                 ↓
        融合排序 / 重排序
                 ↓
   knowledge_id + 来源 + 版本 + 片段
```

SQLite FTS5 提供内置全文检索、前缀、短语、NEAR 和布尔查询能力，适合作为离线基线（[SQLite FTS5](https://www.sqlite.org/fts5.html)）。OpenAI 的 Retrieval 文档也采用关键词与语义检索结合的思路（[Retrieval guide](https://platform.openai.com/docs/guides/retrieval)）。

### 1.2 按规模选择存储

| 场景 | 推荐 | 说明 |
|---|---|---|
| 个人 / 离线 / 敏感资料 | SQLite + FTS5 | 零服务依赖；当前 GameCrew 已有 lexical fallback |
| 有本地 embedding 模型 | SQLite FTS5 + 本地向量文件 | 保留原始文件和片段 ID，向量只是派生索引 |
| 团队共享 | PostgreSQL + pgvector + 全文检索 | 统一权限、备份和并发；pgvector 支持 HNSW / IVFFlat（[pgvector](https://github.com/pgvector/pgvector)） |
| 跨文档关系与全局总结 | 可选 GraphRAG | 成本和图谱维护复杂，不作为默认依赖（[Microsoft GraphRAG](https://github.com/microsoft/graphrag)） |

无论选哪种存储，都必须保留原始来源、版本、内容哈希和适用边界。向量不是事实源；低召回或低相似度时应返回“没有可靠证据”，而不是强行生成答案。

### 1.3 事件与证据账本

知识检索和 Agent 判断要可审计，推荐采用追加式事件记录：

```json
{
  "event_id": "evt_001",
  "task_id": "task_001",
  "event_type": "evidence_attached",
  "actor": "creative-agent",
  "source_refs": ["knowledge-001#chunk-03"],
  "timestamp": "2026-09-03T10:00:00Z",
  "approval": "pending"
}
```

可参考 W3C PROV 的实体—活动—责任主体模型（[W3C PROV](https://www.w3.org/TR/prov-overview/)）和 OpenTelemetry GenAI 语义约定（[GenAI conventions](https://opentelemetry.io/docs/specs/semconv/gen-ai/)）。

## 2. 智能体协作运行时

### 2.1 有状态任务图优于自由聊天

建议使用显式状态和完成条件：

```text
INTAKE → PLAN → EXECUTE → REVIEW
                         ↓
              APPROVED / NEEDS_REWORK
                         ↓
                   MEMORY_UPDATE
```

推荐四种可组合模式：

- **Sequential handoff**：策略完成后交给创意，创意完成后交给评审。
- **Parallel fan-out / join**：市场、数据和创意等互不依赖分支并行，再统一汇总。
- **Orchestrator-worker**：协调员工拆解任务，专业员工执行，协调员工合并结果。
- **Evaluator-optimizer**：执行员工产出，评审员工按质量门反馈，直到通过或熔断。

Anthropic 将这些模式总结为 workflow / orchestrator-workers / evaluator-optimizer（[Building Effective Agents](https://www.anthropic.com/research/building-effective-agents)）；OpenAI Agents SDK 将 handoff、structured outputs、guardrails、tracing 和 evals 作为可组合原语（[multi-agent orchestration](https://openai.github.io/openai-agents-python/multi_agent/)）。

### 2.2 标准交接协议

员工之间不传递完整聊天记录，而传递最小结构化上下文：

```json
{
  "task_id": "task_001",
  "sender": "strategy-agent",
  "receiver": "creative-agent",
  "objective": "生成海外素材测试方案",
  "evidence_refs": [],
  "facts": [],
  "assumptions": [],
  "unknowns": [],
  "acceptance_criteria": [],
  "allowed_tools": [],
  "status": "ready_for_handoff"
}
```

交接必须能回答：目标是什么、输入和证据是什么、哪些是事实/假设/未知、下一步验收什么、允许调用什么工具、失败如何恢复。

### 2.3 质量、追踪与安全

建议把以下指标纳入本地 `doctor/eval` 或 CI：

- Schema 通过率、引用有效率、Recall@K
- 事实/推断区分率、任务完成率、评审退回率
- 人工覆盖率、工具越权率、重试幂等性
- 每阶段耗时、token/成本和失败根因

输入/输出 guardrail 不应替代工具级权限检查；需要在每个高风险工具调用前后做校验（[OpenAI guardrails](https://openai.github.io/openai-agents-python/guardrails/)）。以下操作必须停在人工审批：发布广告、修改预算/出价、删除数据、发送外部消息和写入生产系统。

## 3. GameCrew 的落地分层

| 层级 | 当前公开版 | 后续可选升级 |
|---|---|---|
| 知识源 | Markdown / JSON / CSV / TXT | Obsidian、Notion 导出、企业文档适配器 |
| 索引 | 确定性 lexical fallback | 本地 embedding、混合召回、重排序 |
| 状态 | 本地 task ledger / handoff / quality gate JSON | SQLite 事件账本、OpenTelemetry trace |
| 协作 | 确定性 direct / parallel 骨架 | 真实 LLM handoff、orchestrator-worker、evaluator loop |
| 记忆 | 人工确认后再进入 approved | 版本化记忆、过期策略、权限过滤和回滚 |
| 规模 | 单机工作站 | PostgreSQL + pgvector、团队权限和备份 |

### 设计原则

1. 先让零依赖本地路径可运行，再接入向量模型或云服务。
2. 事实源、证据、推断和记忆分层保存，不用向量索引覆盖原文。
3. 用结构化交接替代长上下文广播，减少成本、泄露面和不可复现行为。
4. 用质量门和评估数据决定是否放大 Agent 自主权，而不是仅凭演示效果。
5. 所有外部写入和生产变更都保留人工确认点。

