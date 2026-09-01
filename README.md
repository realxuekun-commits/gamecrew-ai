# GameCrew AI｜游戏发行 AI 员工全流程闭环系统

> 一支由向量知识库驱动的游戏发行 AI 战队，负责复杂任务的多 Agent 协调、高质量交付与持续成长。
>
> A vector-memory-powered multi-agent orchestration system for end-to-end game publishing workflows, high-quality delivery and continuously improving AI agents.

![GameCrew AI product key visual](assets/gamecrew-ai-kv-v2.png)

## 中文介绍

GameCrew AI 是一个本地优先、面向游戏发行的 AI Team OS。它将 AI 员工、专业 Skills、MCP tools、vector knowledge memory、multi-agent orchestration、quality gates 和团队经验整合到一个完整的工作闭环中。

**关键词 / Keywords**：GameCrew AI、game publishing AI、AI employees、multi-agent orchestration、AI agent team、vector knowledge base、MCP、AI workflow、game launch、live operations。

系统关注的不是一次回答得多快，而是复杂游戏发行工作能否持续、稳定、可追踪地完成：

```text
任务目标 → 需求判断 → 知识检索 → 能力预检 → 员工协作
→ 工具调用 → 结构化交付 → 质量验收 → 复盘沉淀
```

### 核心卖点

- **游戏发行专用**：覆盖市场、数据、创意、投放、运营、知识和工程等发行环节。
- **向量知识库驱动**：让历史项目、复盘经验和方法规范可检索、可引用、可持续更新。
- **复杂任务多 Agent 协调**：根据交付目标进行角色路由、并行协作和上下游流水线编排。
- **高质量闭环交付**：从需求判断、能力预检到证据验收和结构化交付，全程可追踪。
- **可持续成长智能体**：将有效方法、失败原因和适用边界沉淀为下一次任务可复用的团队记忆。
- **AI 员工化**：按市场、数据、创意、投放、运营、知识和工程等岗位组织专业能力。
- **任务编排化**：支持单员工执行、多员工并行和上下游流水线协作。
- **能力模块化**：统一管理 Skill、MCP、API 和本地工具，并按员工授权。
- **证据化交付**：任务拥有交付契约、执行状态、来源证据和质量检查。
- **失败可恢复**：区分职责、连接、授权、数据和质量问题，提供重试、重路由和保底路径。
- **团队记忆化**：将有效方法、失败原因和适用边界沉淀为可复用知识。
- **本地优先**：使用本地客户端和 SQLite 管理状态，明确数据、权限和外部工具边界。

### 系统由什么组成

```text
AI 员工系统  —— 谁来做
能力系统     —— 用什么做
任务运行时   —— 怎么做、做到哪一步
知识系统     —— 如何越做越好
```

四个系统形成闭环：

```text
岗位 → 能力 → 任务 → 交付 → 复盘 → 新能力
```

## English Introduction

GameCrew AI is a local-first AI Team OS built for game publishing. It combines role-based AI employees, reusable Skills, MCP tools, vector knowledge memory, multi-agent orchestration, quality gates and organizational learning into one closed loop.

Lingxi is designed for reliable knowledge work, not one-off chat answers:

```text
Task goal → Intent → Knowledge → Capability preflight → Agent collaboration
→ Tool execution → Structured delivery → Quality review → Retrospective memory
```

### Core value propositions

- **Built for game publishing** across market strategy, data, creative, growth, operations, knowledge and engineering.
- **Vector knowledge memory** that makes project history, lessons and playbooks searchable, citable and continuously maintainable.
- **Multi-agent coordination for complex work** with role routing, parallel execution and sequential pipelines.
- **High-quality closed-loop delivery** from intent and capability checks to evidence-backed review and structured outputs.
- **Continuously improving agents** that learn from validated methods, failures and applicability boundaries.
- **Role-based AI employees** for strategy, data, creative, growth, operations, knowledge and engineering work.
- **Task orchestration** across direct execution, parallel fan-out and sequential pipelines.
- **Composable capabilities** through governed Skills, MCP servers, APIs and local tools.
- **Evidence-backed delivery** with explicit contracts, execution state, sources and review checks.
- **Bounded recovery** for routing, connection, authorization, data and quality failures.
- **Organizational memory** that turns useful methods and lessons into reusable knowledge.
- **Local-first control** with local runtime state, SQLite persistence and explicit security boundaries.

## Quick start

This repository currently focuses on the product model, runtime design and safe extension contracts. See [Architecture & Runtime Design](docs/architecture.md) for the bilingual technical overview.

## Repository scope and security

This public repository contains generalized architecture, documentation and sanitized examples only. Never commit API keys, tokens, cookies, passwords, internal databases, real user data, private network addresses, production logs or confidential business rules.

## Roadmap

- [ ] Public demo data and sample workflow
- [ ] Skill and MCP extension examples
- [ ] Local runtime bootstrap
- [ ] Task state and evidence schemas
- [ ] Knowledge loop reference implementation
- [ ] Community contribution guide

## License

License terms will be added before the first code release.
