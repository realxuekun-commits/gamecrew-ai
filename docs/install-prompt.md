# Copy-Paste Install Prompt | 一键安装提示词

将下面整段复制给另一个 Codex：

```text
请从 GitHub 安装并验证 GameCrew AI：

仓库：https://github.com/realxuekun-commits/gamecrew-ai

目标：把公开版 GameCrew AI 工作站安装到当前本地环境，并让它可以运行游戏发行 Brief、任务账本和本地知识库向导。

请按以下顺序执行：

1. 克隆仓库到临时或用户指定目录，不覆盖现有项目文件。
2. 阅读 README.md、skills/gamecrew-ai/SKILL.md、docs/knowledge-setup.md、docs/local-capability-map.md 和 extensions/lingxi-core-prompts/README.md。
3. 检查 Node.js 是否可用；本项目无第三方运行时依赖。
4. 运行：
   - node scripts/gamecrew-ai.mjs --help
   - node scripts/gamecrew-ai.mjs demo
   - node scripts/gamecrew-ai.mjs validate examples/launch-brief.json
   - node --test tests/gamecrew-ai.test.mjs
5. 将 skills/gamecrew-ai 安装或复制到当前 Codex 的本地 Skill 目录；如果无法确定 Skill 目录，先报告路径，不要猜测或写入系统目录。
6. 在用户指定的工作区初始化本地知识库：
   node scripts/gamecrew-ai.mjs knowledge init ./knowledge
   如果没有用户指定目录，使用仓库外的 ./knowledge，并先说明路径。
7. 用一个脱敏 Markdown 示例执行 import、index、query、doctor，确认本地知识链路可用。
8. 最后运行一个 Brief：
   node scripts/gamecrew-ai.mjs run examples/launch-brief.json --out ./gamecrew-output
9. 汇报：安装路径、测试结果、生成的文件、知识库状态和任何失败原因。

安全与能力边界：

- 不读取、复制或输出 API Key、Token、Cookie、密码、私有知识和内部数据库。
- 不自动连接 Holmes、BI、AppGrowing、DART、广告平台或浏览器登录态。
- GitHub 仓库只提供公开 Prompt、Skill、CLI、文档和本地词法知识库 fallback；不会自动授予内部权限。
- 没有本地 embedding 模型时，使用 lexical fallback，并明确它不是语义向量检索。
- 不发布广告、不修改预算、不删除数据、不发送外部消息。
- 所有写入仅限用户明确指定的本地工作区；发现目标目录已有文件时先避免覆盖。
```

## English version

```text
Install and verify GameCrew AI from https://github.com/realxuekun-commits/gamecrew-ai.

Clone it without overwriting existing files. Read README.md, skills/gamecrew-ai/SKILL.md, docs/knowledge-setup.md, docs/local-capability-map.md and extensions/lingxi-core-prompts/README.md. Verify Node.js, then run the repository help, demo, validation and test commands. Install or copy skills/gamecrew-ai into the current Codex Skill directory only after identifying that directory. Initialize a user-approved local knowledge directory, import a sanitized Markdown example, build the lexical index, query it and run doctor. Finally run examples/launch-brief.json and report paths, tests, artifacts and failures.

Do not read or output secrets, cookies, private knowledge or internal databases. Do not assume access to Holmes, BI, AppGrowing, DART, browser sessions or advertising platforms. The repository provides public prompts, a Skill, a dependency-free CLI and a lexical fallback; it does not grant private permissions or semantic embedding models. Do not publish campaigns, edit budgets, delete data or send external messages. Write only to user-approved local paths and avoid overwriting existing files.
```
