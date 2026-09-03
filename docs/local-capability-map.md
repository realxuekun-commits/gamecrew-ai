# Local Capability Map | 本地能力与替代方案

## 中文

GameCrew AI 的公开版优先在本地工作区处理脱敏 brief，并把结果写成可审阅的 JSON 产物。下面区分“开箱即用”“需要本机已授权能力”和“不能由公开版替代”的边界；本表不代表对外平台有写入权限。

| 能力 | 公开版状态 | 本地优势 | 缺失时的替代方案 |
|---|---|---|---|
| Brief 校验与任务产物 | 开箱即用 | 无第三方依赖、可离线复现、输入不会上传 | 用 JSON Schema、表单校验或人工 checklist；保留同一交付契约 |
| 任务账本、角色交接、质量门报告 | 开箱即用 | 在工作区留下可审计 JSON，而非只保留聊天文本 | 用 Markdown 模板或 Issue 表单；需人工维护状态与链接 |
| 本地文件/素材处理 | 取决于安装的 Skill 和文件权限 | 可直接读取用户明确提供的 brief、素材清单和输出目录 | 导出为脱敏 ZIP/CSV 后在其他环境处理；不要上传私有素材或凭据 |
| 已登录浏览器的只读研究 | 可选，需本机登录态和显式授权 | 可复用用户已登录的公开/业务页面，不复制 Cookie | 使用公开网页、平台导出的 CSV，或由用户手动提供截图/表格 |
| 内部 MCP、BI、广告平台 | 可选，需组织连接、业务权限和任务级预检 | 可按真实权限读取数据并留下证据 | 使用脱敏数据样例、离线 CSV，或停在“待确认”状态；不伪造数据 |
| 知识库检索 | 参考接口，部署依赖本机知识库 | 可将团队认可的资料留在受控本地存储 | 使用版本化 Markdown/Obsidian 文件夹和人工引用；明确未检索到的未知项 |
| Prompt 与上下文工程 | Prompt 扩展包和交付契约已公开 | 按任务阶段控制上下文，减少噪声与敏感信息暴露 | 使用版本化 Markdown Prompt、手工摘要和来源编号 |
| 本地中文检索模型 | 可通过 adapter 接入，默认 lexical fallback | 中文 Embedding/分词/重排序模型可留在本机 | 不安装模型时使用词法索引；或导入脱敏检索结果 |
| 多 Agent 并行 | 参考流程，取决于当前运行时 | 角色边界、交接和质量门可在本地执行并审阅 | 单 Agent 顺序执行，或将工作拆成独立 JSON/Markdown 交接；不把并行当作质量保证 |
| 广告发布、预算修改、外部消息 | 不提供 | 默认避免不可逆业务写入 | 生成待审批的发布包，由具备权限的人在目标平台确认执行 |

### 补齐原则

1. 先以离线 brief 和脱敏 fixture 跑通 `validate` 与 `run`，再接入外部能力。
2. 每增加一个本地连接器，都记录：能力 ID、数据源、健康探针、最小权限、失败影响、回退方式和验收证据。
3. 没有真实登录态、数据权限或用户授权时，输出待确认项，不以模拟结果替代事实。
4. 用 CSV/JSON 导入是接入 BI 或广告数据的优先保底方案；外部写入必须在目标平台再次确认。

## English

The public reference runs on sanitized briefs in a local workspace and writes reviewable JSON artifacts. This map separates built-in capabilities from locally authorized integrations and from actions the public reference deliberately does not perform.

| Capability | Public status | Local advantage | Fallback |
|---|---|---|---|
| Brief validation and task artifacts | Built in | Offline, reproducible, no upload required | JSON Schema, a form validator, or a manual checklist using the same delivery contract |
| Ledger, handoff and quality-gate report | Built in | Auditable JSON instead of chat-only state | Markdown templates or issue forms with manually maintained links |
| Local files and assets | Optional Skill plus file permission | Works from explicitly supplied files | Use a sanitized ZIP/CSV; never upload private assets or credentials |
| Read-only browser research | Optional login state plus authorization | Reuses the user's local session without copying cookies | Public sources, exported CSV, or user-provided screenshots/tables |
| Internal MCP, BI and ad platforms | Optional connection and task-level preflight | Uses real, bounded permissions with evidence | Sanitized fixtures, offline CSV, or an explicit unknown state |
| Knowledge retrieval | Reference interface; deployment-dependent | Controlled local storage for approved knowledge | Versioned Markdown/Obsidian plus manual citations |
| Prompt and context engineering | Prompt modules and delivery contracts are public | Stage-aware context selection reduces noise and exposure | Versioned Markdown prompts, manual summaries and source IDs |
| Local Chinese retrieval models | Adapter-ready; lexical fallback is default | Chinese embedding/tokenization/reranking can stay on-device | Keep lexical search or import sanitized retrieval results |
| Multi-agent execution | Reference workflow; runtime-dependent | Reviewable role boundaries, handoffs and gates | A single-agent sequential workflow with explicit handoff files |
| Campaign publishing, budget edits and outbound messages | Not provided | Avoids irreversible business writes | Produce an approval package for an authorized human to execute |

Start offline, attach one integration at a time with a health probe and a fallback, and record unknowns instead of fabricating facts.
