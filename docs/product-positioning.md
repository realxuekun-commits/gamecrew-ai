# Lingxi Frontier Agent Design & Capability Specification | 灵犀 AI 智能体前沿设计规范与能力说明

## 一句话定位

**灵犀不是“会聊天的 AI”，而是一套让专业 AI 员工持续完成复杂工作的本地优先运行系统。**

**Lingxi is not just a chatbot. It is a local-first operating system for evolving AI employees that can complete complex work with evidence, coordination and controlled improvement.**

## 五个领先能力支柱

### 1. 可进化智能体员工｜Evolving AI Employees

灵犀把 AI 按岗位组织，而不是把所有任务交给一个通用 Agent。每个员工拥有职责、输入输出、工具边界、质量标准和复盘入口。

**用户得到的不是一次回答，而是一支可以复用、评审和持续成长的专业员工队伍。**

### 2. 证据驱动交付｜Evidence-Grounded Delivery

每项工作都区分事实、推断、未知和建议，并绑定来源、版本、交接和质量门。没有可靠证据时，系统应该停在待确认，而不是生成看似完整的结论。

**这让交付结果可解释、可复核、可追责。**

### 3. 混合知识引擎｜Hybrid Knowledge Engine

灵犀不把向量当作唯一答案：精确名称和指标用全文检索，语义问题用 embedding，复杂关系再按需引入图谱。原始文档和来源哈希始终是事实源，索引只是可重建的派生层。

**小团队可从本地 FTS5 开始，成熟后平滑升级到混合检索和团队级向量基础设施。**

### 4. 状态化多员工协作｜Stateful Multi-Agent Coordination

多员工协作不是自由聊天，而是带状态、依赖和完成条件的任务图：

```text
INTAKE → PLAN → EXECUTE → REVIEW → APPROVED → MEMORY
```

根据任务选择顺序交接、并行分支、协调者—执行者或评审—优化循环。每次交接只传递必要上下文，降低噪声、成本和泄露面。

### 5. 本地优先与安全可控｜Local-First, Human-Controlled

公开版无需第三方服务即可运行基础工作流和知识库。浏览器、BI、MCP、广告平台和向量服务都是可选适配器，必须通过真实权限预检；发布、预算、删除和外部沟通永远保留人工审批。

**灵犀的先进性不是“自动做一切”，而是“知道什么能做、什么不能做，以及如何安全地继续”。**

## 产品证明层级

| 能力 | 当前公开版证据 | 产品表述边界 |
|---|---|---|
| 本地知识搭建 | `knowledge init/import/index/query/doctor`，7/7 测试通过 | 可说“本地知识库向导与词法检索已可运行” |
| 任务闭环骨架 | task ledger、role handoff、quality gate JSON | 可说“交付闭环骨架已实现” |
| 多 Agent 协作 | Prompt 扩展包、状态与交接设计 | 应说“支持接入/编排”，不说“公开版已自动调度所有员工” |
| 语义向量检索 | 可选 adapter 设计 | 应说“可扩展”，不说“默认内置向量模型” |
| 内部数据能力 | 本地灵犀环境可选连接 | 不对外承诺 Holmes、BI、AppGrowing 权限或数据 |

## 对外宣传版

### 中文

> 灵犀，把 AI 从“回答问题”推进到“完成工作”。
>
> 以可进化智能体员工为核心，以混合知识和证据账本为基础，以状态化多员工协作为运行方式，以质量门和人工审批守住边界，让复杂游戏发行工作在本地可控地执行、验证和沉淀。

### English

> Lingxi moves AI from answering questions to completing work.
>
> Evolving AI employees work on top of hybrid knowledge and evidence ledgers, coordinate through stateful task graphs, and improve through quality gates and human approval—so complex game-publishing workflows remain local, traceable and controlled.

## 不应使用的夸张表述

- 不说“完全自主替代团队”；说“角色化协作与人工可控”。
- 不说“内置所有行业数据”；说“支持接入用户已有知识和授权数据”。
- 不说“向量库保证准确”；说“混合检索 + 来源证据 + 低置信度停机”。
- 不说“自动发布广告”；说“生成可审批的发布包”。
- 不说“已经领先所有 Agent 平台”；说“采用当前主流前沿的混合检索、结构化交接、状态化编排和评审优化模式”。
