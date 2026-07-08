# InfoOly Track

记录学生在信息学奥林匹克竞赛（OI）学习过程中的生涯历程、战绩、知识点与成长轨迹。

线上地址：https://infooly.com

## 功能特性

### 前台（游客访问）
- **首页**：总览统计、最新资讯、训练安排日历、关联网站快速入口
- **学生列表**：卡片展示所有学生，支持实时搜索过滤
- **学生个人页**：时间轴视图（比赛生涯）、战绩统计、知识点认证、任务板
- **比赛记录**：按时间倒序展示所有比赛，支持年份/平台筛选
- **知识点库**：按难度等级（CSP-J → 省选）分组展示
- **任务板**：按学生或按分类分组查看任务完成状态
- **赛制介绍**：OI / IOI / ACM-ICPC 三种赛制详解
- **最新资讯**：卡片展示最新一条，点击进入详情页，支持历史列表

### 管理后台
- Cookie-based 密码认证
- 数据仪表盘：统计概览、最近活动、数据分布
- 学生 / 比赛 / 知识点 / 任务 / 公告 / 训练安排 / 关联网站 的只读展示
- 支持搜索和筛选

## 技术栈

| 层级 | 技术 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS 3 + shadcn/ui |
| 数据库 | SQLite + Prisma ORM |
| 图标 | Lucide React |

## 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/yellowchick/InfoOly-Track.git
cd InfoOly-Track
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
cp .env.example .env.local
```

编辑 `.env.local`，设置以下变量：

```env
# 数据库路径（相对项目根目录）
DATABASE_URL="file:./prisma/dev.db"

# 后台管理密码
ADMIN_PASSWORD=your-admin-password
```

### 4. 初始化数据库

```bash
# 推送 Prisma schema 到数据库
npx prisma db push

# 运行种子脚本填充初始数据（学生、示例知识点等）
npm run db:seed
```

### 5. 启动开发服务器

```bash
npm run dev
```

浏览器打开 http://localhost:3000

管理后台：http://localhost:3000/admin/（密码为 `ADMIN_PASSWORD` 设置的值）

### 6. 生产构建

```bash
npm run build
npm start
```

## 项目结构

```
InfoOly-Track/
├── app/                    # Next.js App Router 页面
│   ├── page.tsx            # 首页
│   ├── students/           # 学生列表 + 详情
│   ├── contests/           # 比赛记录
│   ├── knowledge/          # 知识点库
│   ├── tasks/              # 任务板
│   ├── announcements/      # 最新资讯（列表 + 详情）
│   └── admin/              # 管理后台
├── components/             # React 组件
│   ├── layout/             # 布局组件（Header、Footer）
│   ├── home/               # 首页组件（日历、统计卡片）
│   ├── student/            # 学生相关组件
│   ├── contest/            # 比赛相关组件
│   └── admin/              # 后台组件
├── lib/                    # 工具函数
│   ├── prisma.ts           # Prisma 客户端
│   ├── student-data.ts     # 学生数据工具
│   └── fallback-data.ts    # 降级数据
├── prisma/
│   ├── schema.prisma       # 数据库模型定义
│   └── seed.ts             # 种子数据
├── scripts/                # 脚本工具
│   ├── update-data.js      # 从 Markdown 更新数据到数据库
│   └── update-schedule.js  # 更新训练安排
└── public/                 # 静态资源
```

## 数据更新

### 更新训练安排

编辑 `scripts/update-schedule.js`，修改日期后执行：

```bash
node scripts/update-schedule.js
```

### 更新最新资讯

```bash
node scripts/update-announcement-structured.js
```

### 批量更新比赛成绩和任务

准备 Markdown 文件，按格式描述后执行：

```bash
node scripts/update-data.js your-file.md
```

## 部署

### 服务器部署（PM2 + Nginx）

1. 服务器上克隆项目并安装依赖
2. 配置 `.env.local`
3. 初始化数据库：`npx prisma db push && npm run db:seed`
4. 构建：`npm run build`
5. 配置 `deploy/nginx.conf` 到 `/etc/nginx/sites-available/`
6. 配置 SSL：`certbot --nginx -d your-domain.com`
7. PM2 启动：`pm2 start deploy/pm2.config.js`

### Docker 部署（可选）

```bash
docker build -t info-oly-track .
docker run -p 3000:3000 info-oly-track
```

## 数据库模型

| 模型 | 说明 |
|------|------|
| Student | 学生信息 |
| Contest | 比赛信息 |
| StudentContestResult | 学生比赛成绩 |
| KnowledgePoint | 知识点 |
| StudentKnowledge | 学生知识点认证 |
| Task | 任务 |
| Schedule | 训练安排 |
| Announcement | 最新资讯 |
| ExternalLink | 关联网站 |

## 常见问题

**Q: 构建时出现 "Prisma Client 未找到"？**
A: 运行 `npx prisma generate` 生成 Prisma Client。

**Q: 数据库修改后页面没有更新？**
A: 所有页面已配置 `force-dynamic`，如果仍不更新，检查是否使用了缓存代理（如 Cloudflare），清除缓存即可。

**Q: 如何修改学生信息？**
A: 由于后台已改为只读展示，请直接修改数据库或使用 `scripts/update-data.js` 脚本导入。

## 许可证

MIT
