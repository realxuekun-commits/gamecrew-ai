# Lingxi Core Prompt Extensions | 灵犀核心提示词扩展包

这是一套“能力模块提示词”，不是内部 Skill、MCP 或凭据包。接入灵犀的同学可以选择一个模块，把对应 Prompt 交给自己的 AI 员工，再按 `manifest.json` 配置实际可用的 Skill/MCP。

## 使用方式

1. 复制目标模块的 `prompt.md`。
2. 将其中的 `{{变量}}` 替换为项目事实、数据范围和交付时间。
3. 在执行前完成角色适配与能力预检。
4. 只启用自己真实拥有的工具；没有三方连接时使用模块中列出的 fallback。
5. 将输出保存为 Markdown/JSON，并把事实、推断、未知项和证据分开。

## 模块目录

| 模块 | 适合任务 | 典型工具 | 无工具替代 |
|---|---|---|---|
| `01-strategy` | 市场、竞品、国家优先级、发行策略 | web research / market data | 用户资料 + 手工证据表 |
| `02-creative` | 素材拆解、创意 Brief、分镜、生产检查 | `zk-creative-process`, AppGrowing | 脱敏素材包 + 人工标签 |
| `03-growth` | 投放、归因、ROI、渠道优化 | `ad-material-query`, DART/BI | 导入 CSV + 离线计算 |
| `04-operations` | 版本活动、CRM、商店口碑、舆情 | browser/social tools | 用户导出的评论/报表 |
| `05-knowledge` | 知识入库、检索、复盘沉淀 | local knowledge wizard | Markdown + lexical index |
| `06-engineering` | Skill/MCP 接入、客户端和运行时 | local runtime / MCP | CLI、JSON fixture、人工验收 |

这些 Prompt 只定义工作方法，不授予任何数据、账号或外部写入权限。

## English

These are capability prompts, not internal Skills, MCP servers or credentials. Copy one prompt into a Lingxi employee, replace `{{variables}}`, run capability preflight, and keep facts, inferences, unknowns and evidence separate. Use only tools that are genuinely available; each module includes a no-integration fallback.
