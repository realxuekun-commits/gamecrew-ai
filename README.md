# 灵犀 AI Team OS

> 让 AI 从一个会聊天的助手，变成一个能分工、会执行、有证据、可复盘的工作团队。
>
> Turn AI from a single chat assistant into a team that can coordinate, execute, verify and learn.

## 中文介绍

灵犀 AI Team OS 是一个本地优先的 AI 团队操作系统。它将 AI 员工、专业 Skill、MCP 工具、任务编排、质量验收和团队知识整合到一个可运行的工作系统中。

灵犀关注的不是一次回答得多快，而是复杂工作能否持续、稳定、可追踪地完成：

```text
任务目标 → 需求判断 → 知识检索 → 能力预检 → 员工协作
→ 工具调用 → 结构化交付 → 质量验收 → 复盘沉淀
```

### 核心卖点

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

Lingxi AI Team OS is a local-first operating system for AI teams. It brings together role-based AI employees, reusable Skills, MCP tools, task orchestration, quality gates and organizational memory.

Lingxi is designed for reliable knowledge work, not one-off chat answers:

```text
Task goal → Intent → Knowledge → Capability preflight → Agent collaboration
→ Tool execution → Structured delivery → Quality review → Retrospective memory
```

### Core value propositions

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

