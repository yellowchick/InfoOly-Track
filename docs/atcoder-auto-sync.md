# AtCoder ABC 成绩自动同步说明

## 功能概述

系统每周日自动从 AtCoder 官网抓取 ABC（AtCoder Beginner Contest）比赛成绩：
- 自动检测绑定的学生是否参赛
- 自动录入：得分、排名、Rating、Rank 总排名
- 幂等设计：已存在的成绩不会重复录入，也可强制刷新

**数据源**：
| 数据 | 来源 | 说明 |
|------|------|------|
| 参赛检测 + 得分 | AtCoder Problems API (kenkoooo.com) | 提交记录，按比赛时间窗口过滤 |
| 排名 / Rating / Rank | AtCoder 官网成绩页 | 页面内嵌 JSON，含全部参赛者 |

**抓取策略**：
- 只统计比赛时间窗口内的 AC 提交（赛后练习/虚拟参赛不计入）
- 窗口内无 AC 且官网无记录 → 判定未参赛，跳过
- 新比赛自动创建 Contest 记录，月份按比赛结束时间归档

---

## 给新学生绑定 AtCoder 账号

### 前提
学生已存在于数据库（学生页面可见）。

### 绑定步骤

**方式一：运行绑定脚本（推荐）**

在服务器 `/root/InfoOly-Track` 目录执行：

```bash
export DATABASE_URL=file:/root/InfoOly-Track/prisma/dev.db
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const s = await prisma.student.findFirst({ where: { name: '学生姓名' } });
  await prisma.student.update({ where: { id: s.id }, data: { atcoderId: 'AtCoder账号' } });
  console.log('✅ 已绑定: 学生姓名 → AtCoder账号');
  await prisma.\$disconnect();
}
main();
"
```

**方式二：修改 `scripts/bind-atcoder-ids.js` 后执行**

在 `BINDINGS` 数组中追加 `{ name: '学生姓名', atcoderId: '账号' }`，然后：

```bash
node scripts/bind-atcoder-ids.js
```

### 验证绑定

```bash
node -e "
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.student.findMany({ select: { name: true, atcoderId: true } }).then(r => {
  console.log(r); return prisma.\$disconnect();
});
"
```

### 账号注意事项

- `atcoderId` 必须是 **AtCoder 的用户名（User ID）**，区分大小写
- 不是邮箱、不是显示名。查看方法：登录 atcoder.jp，个人页面 URL `atcoder.jp/users/xxx` 中的 `xxx`
- 一个学生绑定一个账号；不参赛的学生留空即可，不影响其他功能

---

## 手动触发抓取

```bash
cd /root/InfoOly-Track
export DATABASE_URL=file:/root/InfoOly-Track/prisma/dev.db

# 正常模式：补录窗口内缺失的成绩（已存在的跳过）
node scripts/fetch-atcoder.js

# 只预览不写数据库
node scripts/fetch-atcoder.js --dry-run

# 强制刷新所有成绩（含已存在的，AtCoderRank 会更新为当前实时值）
node scripts/fetch-atcoder.js --update

# 回扫更多历史场次（默认回扫8场）
node scripts/fetch-atcoder.js --back 20

# 只处理指定比赛
node scripts/fetch-atcoder.js --contest abc481
```

---

## 定时任务

- **cron 配置**：`0 3 * * 0`（每周日 03:00 UTC = 日本时间周日 12:00）
- 比赛通常周六 21:00~22:40（日本时间），周日抓取时数据已稳定
- **日志**：`/var/log/atcoder-fetch.log`

查看定时任务是否生效：
```bash
crontab -l | grep fetch-atcoder
tail -50 /var/log/atcoder-fetch.log
```

---

## 常见问题

### Q1: 学生打了比赛但成绩没录入？

排查顺序：
1. `atcoderId` 是否绑定正确（大小写敏感）
2. 学生是否**正式参赛**：赛后以"虚拟参赛/练习"模式做的题不计入（系统会显示 `⏭️ 仅赛后练习提交，未正式参赛`）
3. 手动运行 `node scripts/fetch-atcoder.js --back 20` 扩大回扫范围

### Q2: 分数为什么和 AtCoder 页面显示的不一样？

系统只统计**比赛时间窗口内**的 AC 提交。比赛结束后继续练习 AC 的题目不影响已录入成绩（这是正确行为）。如需验证某场原始提交，可查看 `scripts/verify-window.js`。

### Q3: 排名/Rating 和比赛当晚看到的不一样？

- **排名（Place）**：比赛最终排名，不会变
- **Rating**：比赛结束后的新 Rating，不会变
- **Rank 总排名（AtCoderRank）**：学生的**当前实时** AtCoder 总排名，会随后续参赛变化。`--update` 模式会刷新为最新值

### Q4: 学生是 unrated 参赛（没开 rated 模式）能抓到吗？

能。得分来自提交记录；排名来自官网成绩页（含全部参赛者）；Rating 字段会留空。建议学生开赛前 30 分钟报名并勾选 rated，以记录 Rating 变化。

### Q5: 可以抓取 ARC/AGC 等其他比赛吗？

当前脚本只处理 `abc` 前缀的比赛。如需扩展，修改 `fetch-atcoder.js` 中的正则 `^abc(\d+)$` 和基准编号检测逻辑。

---

## 技术细节

### 数据流

```
每周日 03:00 UTC (cron)
  │
  ├─ 1. 检测基准编号：数据库已有 ABC 编号 ∪ 学生提交记录中的最大编号
  ├─ 2. 候选窗口：[基准-8, 基准+2]
  ├─ 3. 逐学生查 kenkoooo submissions API → 发现参赛比赛 + 原始 AC 提交
  ├─ 4. 逐比赛爬官网 results 页（内嵌 JSON，~5MB/场）
  │      → EndTime（时间窗口判断 + 月份归档）
  │      → 按用户名索引排名表
  ├─ 5. 成绩计算：
  │      得分 = 窗口内 AC 提交按题目去重取最高分的累加
  │      未参赛判定 = 窗口内无AC 且 官网无记录
  └─ 6. 幂等写入：contest 存在复用，成绩存在跳过（--update 强制更新）
```

### 已绑定账号（2026-10-18）

| 学生 | AtCoder ID | 首次绑定 |
|------|-----------|----------|
| 马天成 | Tiancheng | 2026-10-18 |
| 党皓天 | solitaire | 2026-10-18 |
| 陆臻 | Remielle | 2026-10-18 |

新学生绑定后请追加到此表。

### 文件清单

| 文件 | 作用 |
|------|------|
| `scripts/fetch-atcoder.js` | 自动抓取主脚本 |
| `scripts/bind-atcoder-ids.js` | 批量绑定账号脚本 |
| `scripts/verify-window.js` | 提交时间窗口验证工具 |
| `prisma/schema.prisma` | `Student.atcoderId` 字段定义 |
