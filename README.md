# InfoOly Track

记录学生在信息学奥林匹克竞赛（OI）学习过程中的生涯历程、战绩、知识点与成长轨迹。

## 功能特性

### 前台（游客访问）
- **首页**：总览统计、家校专栏公告、训练安排、关联网站快速入口
- **学生列表**：卡片展示所有学生，支持实时搜索过滤
- **学生个人页**：时间轴视图、战绩统计、知识点认证、任务板
- **比赛记录**：按时间倒序展示所有比赛，支持年份/平台筛选
- **知识点库**：按难度等级（CSP-J → 省选）分组展示
- **任务板**：按学生或按分类分组查看任务完成状态
- **赛制介绍**：OI / IOI / ACM-ICPC 三种赛制详解

### 管理后台
- Cookie-based 密码认证（默认密码见 `.env.example`）
- 学生 / 比赛 / 知识点 / 任务 / 公告 的增删改查
- Markdown 文件批量导入（自动解析 `难度分级.md` 格式）

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS 3 + shadcn/ui |
| 数据库 | SQLite + Prisma ORM |
| 图标 | Lucide React |

## 快速开始

```bash
# 克隆仓库
git clone <repo-url>
cd info-oly-track

# 安装依赖
npm install

# 创建环境变量（从模板复制）
cp .env.example .env.local

# 配置 Moonshot API Key（AI 智能导入功能需要）
# 1. 前往 https://platform.moonshot.cn/ 获取 API Key
# 2. 将 key 填入 .env.local 的 MOONSHOT_API_KEY

# 初始化数据库
npx prisma db push
npm run db:seed

# 开发模式
npm run dev
```

浏览器打开 http://localhost:3000

管理后台：http://localhost:3000/admin/（密码在 `.env.local` 中设置）

## 静态导出部署

```bash
npm run build
# 输出到 dist/ 目录，可部署到 GitHub Pages / Vercel / Netlify 等
```

## 数据导入

将 Markdown 文件放入 `public/data/难度分级.md`，运行：

```bash
npm run db:import
```

支持格式参考 `public/templates/导入模板.md`

## 许可证

MIT
