# GameCrew AI：游戏发行 AI 员工全流程闭环系统

## 中文

本系统围绕“向量知识库 + 多 Agent 协调 + 质量验收 + 持续成长”构建游戏发行 AI 工作闭环。知识库负责提供可检索的上下文，多 Agent 负责复杂任务分工，运行时负责阶段控制，验收层负责交付质量，复盘层负责让系统持续成长。

### 1. 总体架构

```text
用户任务入口（Codex / 客户端）
            ↓
任务运行时（状态、阶段门、路由、重试）
            ↓
AI 员工协作层（Atlas / Nova / Echo / Pixel / Sage …）
            ↓
能力层（Skill / MCP / API / 本地工具）
            ↓
事实状态层（SQLite / 日志 / 证据 / 交付物）
            ↓
知识沉淀层（复盘 / 原子知识 / 可复用经验）
```

### 2. 一次任务的运行链

1. **接收任务**：提取目标、范围、交付物、数据要求和风险。
2. **检索知识**：优先查询团队知识、历史经验和本地资料；不足时再研究外部信息。
3. **生成交付契约**：定义必交章节、证据要求、质量检查和完成条件。
4. **分析能力缺口**：比较任务需求与现有员工、Skill、MCP、数据权限。
5. **员工路由**：按岗位职责分配工作，而不是按关键词机械调用。
6. **能力预检**：验证 Skill 可读、工具可连、权限真实、输出路径可用。
7. **正式执行**：员工按照交付契约产出结构化结果。
8. **质量验收**：检查证据、事实/推断边界、职责边界和交付物完整性。
9. **复盘沉淀**：提炼方法、失败原因、适用条件和下一次检查项。

执行顺序必须满足：

```text
职责适配 < 能力预检 < 正式执行
```

### 3. 任务状态机

```text
intake → decompose → preflight → assign → execute
→ review → report → retrospective → memory
```

每个阶段都有进入条件、输出和完成条件，避免用固定进度条伪装真实执行状态。

### 3.1 公开参考运行时（已实现）

公开版提供一个无第三方依赖的本地运行骨架：

```text
brief.json → validate → topology selection → run
→ task-ledger.json + role-handoff.json + quality-gate-report.json
```

`run` 会把 brief 中可追溯的信息标为事实，把工作安排标为假设，并把缺失的上线时间、预算等决策信息列为未知项。质量门在未知项未解决时返回 `review_required`，不会伪装任务已完成。此模式不会调用外部 API、读取登录态、发布广告或修改预算。

公开版现在提供本地知识搭建向导和可复现的词法索引；真正的语义向量模型、完整多 Agent 实例和外部适配器仍属于扩展层，必须在真实权限、健康探针和回退路径存在时接入。可选本地能力及保底方案见 [本地能力与替代方案](local-capability-map.md)，向导见 [知识库搭建向导](knowledge-setup.md)。

### 4. 协作拓扑

- **Direct**：单领域、低风险任务直接交给一个员工。
- **Parallel fan-out**：市场、数据、创意等互不依赖的工作并行执行。
- **Sequential pipeline**：上游洞察通过验收后，才能进入下游 Brief、制作或发布准备。

### 5. 员工与能力

员工拥有岗位职责、Skill 授权、MCP 权限、输入要求、输出标准和禁止事项。Skill 描述“如何完成工作”；MCP 描述“可以调用什么外部能力”。两者分离，便于授权、检测和替换。

### 6. 交接与证据

员工之间传递结构化交接，而不是完整聊天记录。交接至少包括：已完成工作、关键发现、来源证据、质量检查和下一步动作。每个结论都应区分事实、推断、未知和适用边界。

### 7. 失败恢复

系统区分职责不匹配、工具未安装、连接失败、授权失效、业务权限不足、数据为空、超时和质量不通过等根因，并分别采用重路由、重新预检、保底路径、定向返工或熔断。失败记录不会被成功状态覆盖。

### 8. 数据与安全

SQLite 保存员工、Skill、MCP、任务、执行、证据、评审和复盘状态。公开版本只使用脱敏示例；密钥、Token、Cookie、内部数据库、真实用户数据、内网地址和生产日志不得进入公开仓库。

### 9. 完成验收

任务只有在请求状态、业务事实、客户端展示、执行记录和真实交付物五类证据一致时，才可标记为完成。

## English

This product is built around a closed loop of vector knowledge memory, multi-agent coordination, quality gates and continuous agent improvement for game publishing. The knowledge layer provides retrievable context, agents divide complex work, the runtime controls execution stages, review gates protect delivery quality, and retrospectives improve future performance.

### 1. Architecture

Lingxi is organized into six layers: user entry, task runtime, role-based agents, capability layer, factual state and organizational memory. The runtime coordinates these layers without exposing private business data.

### 2. Runtime lifecycle

```text
intake → decompose → preflight → assign → execute
→ review → report → retrospective → memory
```

The runtime first defines the delivery contract, then checks knowledge and capability availability, routes work to the right role, executes through approved tools, validates the result and stores reusable lessons.

### 3. Role fit and capability preflight

Role fit answers “should this employee own the work?” Capability preflight answers “can this specific runtime instance actually perform it?” Formal execution starts only after both checks pass.

### 3.1 Implemented public reference runtime

The public reference ships a dependency-free local path:

```text
brief.json → validate → topology selection → run
→ task-ledger.json + role-handoff.json + quality-gate-report.json
```

`run` records traceable brief fields as facts, work allocation as assumptions, and missing decision inputs such as launch date or budget as unknowns. A quality gate remains `review_required` while those unknowns are unresolved. This mode does not call external APIs, read login state, publish campaigns or edit budgets.

The public reference now includes a local setup wizard and deterministic lexical index. Semantic embedding models, real multi-agent instances and external adapters remain extensions. Attach them only with real authorization, a health probe and a fallback; see the [Local Capability Map](local-capability-map.md) and [Knowledge Setup Wizard](knowledge-setup.md).

### 4. Skills and MCPs

Skills encode methods, inputs, outputs and failure boundaries. MCPs and APIs expose external capabilities, connections and permissions. Keeping them separate makes capabilities composable, auditable and replaceable.

### 5. Evidence-backed delivery

Every meaningful task has a delivery contract, execution state, evidence references, review checks and an explicit boundary between facts, inferences and unknowns.

### 6. Recovery and memory

Failures are diagnosed by root cause. The runtime can reroute work, rerun a capability preflight, use an approved fallback, request targeted rework or stop with a bounded failure report. Successful methods and failure lessons are distilled into reusable organizational memory.
