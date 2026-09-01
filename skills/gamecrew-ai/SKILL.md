---
name: gamecrew-ai
description: Turn a game publishing brief into a traceable, testable delivery plan using a small multi-agent workflow.
---

# GameCrew AI

## 适用范围

用于游戏发行前的创意 brief 整理、广告脚本与素材任务拆解、渠道适配和质量检查。它不替代法务、品牌、投放平台审批，也不承诺未经验证的效果。

## 交付契约

每次任务输入一个结构化 brief，至少包含 `title`、`audience`、`goal` 三个非空字符串；可选 `channels`（字符串数组）和 `constraints`（字符串或数组）。输出应明确：目标、假设、交付物、负责人、验收标准和待确认项。`scripts/gamecrew-ai.mjs` 提供输入校验与可复现 demo。

## 工具权限边界

默认只读项目文件和用户提供的 brief。写入仅限用户明确授权的工作区产物；不得读取或输出密钥、Cookie、个人隐私，不得自动发布广告、修改预算、联系外部人员或上传素材。外部数据、浏览器和平台 API 必须单独获得授权并留下证据。

## 事实与推断

交付中将“事实”（来自 brief、批准资产、平台返回值或可追溯文件）与“推断/建议”（模型生成的假设、创意和优先级）分开标注。缺失事实不得用猜测填充；影响决策的未知项必须列入待确认项。

## 质量门

1. 输入通过 schema 校验，字段完整且无歧义。
2. 每个创意都有目标受众、核心卖点、渠道规格和成功指标。
3. 事实、推断、风险和依赖可追溯。
4. 版权、品牌、安全和平台政策检查通过或明确阻断。
5. 交付物可复核、可复现；失败时返回具体修复建议。

## 本地验证

```sh
node scripts/gamecrew-ai.mjs --help
node scripts/gamecrew-ai.mjs demo
node scripts/gamecrew-ai.mjs validate path/to/brief.json
```

