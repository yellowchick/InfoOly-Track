# InfoOly Track — 信息学奥林匹克竞赛生涯记录网站

## 架构设计文档 (v1.0)

### 一、项目概述
记录学生在学习信息学奥林匹克竞赛过程中的生涯历程，支持游客浏览、搜索学生、查看时间轴，以及管理员通过后台或文件导入进行数据维护。

### 二、技术栈
| 层级 | 技术 |
|------|------|
| 框架 | Next.js 14 (App Router) |
| 语言 | TypeScript |
| 样式 | Tailwind CSS + shadcn/ui |
| 数据库 | SQLite (Prisma ORM) |
| 认证 | 简单 Cookie-based 管理员认证（无需外部服务） |
| 部署 | 静态导出 (output: 'export') + 可选 Node 服务端 |

### 三、数据库 Schema (Prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Student {
  id          String   @id @default(cuid())
  name        String
  displayName String   // 展示用名字
  avatarUrl   String?
  bio         String?  // 简介
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  contestResults StudentContestResult[]
  knowledges     StudentKnowledge[]
  tasks          Task[]
}

model Contest {
  id          String   @id @default(cuid())
  name        String   // 比赛名称，如 CSP-J
  type        String   // 线下赛/线上赛
  platform    String?  // 平台，如 usaco, yacs, atcoder
  date        String   // YYYY-MM 格式
  description String?
  totalScore  Int?     // 总分
  timeLimit   String?  // 时间限制说明
  isTeam      Boolean  @default(false) // 是否团队讨论
  createdAt   DateTime @default(now())

  results StudentContestResult[]
}

model StudentContestResult {
  id       String @id @default(cuid())
  studentId String
  contestId String
  award    String? // 一等奖/二等奖/铜升银 等
  score    Int?    // 得分
  rank     Int?    // 排名
  atcoderRank   Int?    // AtCoder总排名变化
  atcoderRating Int?    // AtCoder积分变化
  notes    String?

  student Student @relation(fields: [studentId], references: [id])
  contest Contest @relation(fields: [contestId], references: [id])
}

model KnowledgePoint {
  id          String @id @default(cuid())
  name        String
  level       Int    // 难度等级 3-7
  levelAlias  String // CSP-J, GESP5级, CSP-S, USACO金, 省选
  category    String // 算法分类
  description String?
  prerequisites String? // 前置知识
  createdAt   DateTime @default(now())

  students StudentKnowledge[]
}

model StudentKnowledge {
  id              String @id @default(cuid())
  studentId       String
  knowledgePointId String
  certifiedAt     String // YYYYMM 格式
  status          String @default("certified") // certified / learning
  notes           String?

  student        Student        @relation(fields: [studentId], references: [id])
  knowledgePoint KnowledgePoint @relation(fields: [knowledgePointId], references: [id])
}

model Task {
  id          String  @id @default(cuid())
  studentId   String
  title       String
  category    String? // 分类，如 匈牙利算法、分块等
  problemIds  String? // 关联题号，如 TR01, 319
  status      String  @default("pending") // pending / completed
  priority    String  @default("normal") // high / normal / low
  dueDate     String? // 截止日期
  createdAt   DateTime @default(now())
  completedAt DateTime?

  student Student @relation(fields: [studentId], references: [id])
}

model Announcement {
  id        String   @id @default(cuid())
  title     String
  content   String
  category  String   @default("general") // general / home-school / schedule
  date      String?  // YYYY-MM
  isPublic  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Schedule {
  id        String @id @default(cuid())
  day       String // 周三/周五/周日
  startTime String
  endTime   String
  note      String?
  isActive  Boolean @default(true)
}

model ExternalLink {
  id        String @id @default(cuid())
  name      String
  url       String
  category  String @default("platform") // platform / resource / tool
  icon      String? // emoji 或 icon 名
  sortOrder Int    @default(0)
}

model Rule {
  id          String @id @default(cuid())
  name        String // OI赛制 / IOI赛制 / ACM-ICPC
  description String
  features    String? // JSON数组特征
  examples    String? // 典型赛事
  sortOrder   Int    @default(0)
}
```

### 四、页面路由设计

```
/                          # 首页 — 总览、公告、时间安排、关联网站
/students                  # 学生列表 — 卡片展示，支持搜索
/students/[id]             # 学生个人页 — 时间轴、战绩、知识点、任务板
/contests                  # 比赛记录 — 时间轴/列表
/knowledge                 # 知识点库 — 难度分级展示
/tasks                     # 任务板总览（管理员/公共视图）
/admin                     # 管理后台登录
/admin/dashboard           # 管理后台首页
/admin/students            # 学生管理
/admin/contests            # 比赛管理
/admin/knowledge           # 知识点管理
/admin/tasks               # 任务管理
/admin/announcements       # 公告管理
/admin/import              # 文件导入
```

### 五、模块划分

| 模块 | 内容 | 负责人 |
|------|------|--------|
| A | 项目初始化 + 数据库 + Prisma + Seed数据 | Agent 1 |
| B | 首页公共页面（赛制、公告、时间安排、链接） | Agent 2 |
| C | 学生列表 + 搜索 + 个人时间轴页面 | Agent 3 |
| D | 战绩/比赛记录 + 统计可视化 | Agent 4 |
| E | 知识点库 + 难度分级 + 个人认证 | Agent 5 |
| F | 任务板 + 完成进度可视化 | Agent 6 |
| G | 管理员后台 + 文件导入 + 增删改查 | Agent 7 |
| H | 移动端适配 + 主题 + 全局样式 + 最终集成 | Agent 8 |

### 六、数据导入规范（文件录入）

支持 Markdown 文件批量导入，格式：

```markdown
## 赛制介绍
...内容

# 战绩
- 2024/10
  - 线下赛csp-j
    - 马天成 二等奖

## 知识点认证
- 张-赫-桐
  - 匈牙利算法 202603

### 任务板
- 张-赫-桐
  - [x] 匈牙利算法 TR01
  - [ ] 贪心练习 NOIP01
```

导入脚本解析器需识别：
- 标题层级（# ## ###）
- 列表项（- [x] / - [ ]）
- 缩进层级（表示父子关系）
- 日期格式（YYYY/MM 或 YYYYMM）
- 人名（中文姓名）
- 比赛名称和成绩格式

### 七、移动端适配要点

1. 使用 viewport meta tag: width=device-width, initial-scale=1
2. 微信内置浏览器适配：ios 底部安全区、android 键盘弹起
3. 底部固定导航栏（iPhone 安全区兼容）
4. 触摸友好的按钮尺寸（最小 44x44px）
5. 横向滑动时间轴（学生个人页）
6. 折叠面板（Accordion）用于长内容
7. 搜索框在顶部固定
8. 使用 CSS safe-area-inset-* 处理刘海屏

### 八、颜色主题

```css
--primary: #1e40af;        /* 深蓝 — 信任、专业 */
--primary-light: #3b82f6;
--accent: #f59e0b;         /* 琥珀 — 竞赛活力 */
--success: #10b981;        /* 翡翠绿 — 通过/完成 */
--warning: #f97316;        /* 橙色 — 进行中 */
--danger: #ef4444;         /* 红色 — 失败/高优先级 */
--bg: #f8fafc;             /*  slate-50 */
--card: #ffffff;
--text: #1e293b;
--text-muted: #64748b;
```

### 九、共享约定

1. 所有组件使用 `'use client'` 或默认 Server Component
2. 数据获取通过 `lib/prisma.ts` 中的单例 PrismaClient
3. API 路由统一前缀 `/api/*`
4. 表单使用 shadcn/ui 的 Form + react-hook-form
5. 图标使用 lucide-react
6. 时间格式统一使用 `YYYY-MM-DD` 或 `YYYY-MM`
7. 所有页面导出 metadata（SEO）

### 十、文件目录结构

```
info-oly-track/
├── app/
│   ├── page.tsx              # 首页
│   ├── layout.tsx            # 根布局
│   ├── globals.css           # 全局样式
│   ├── api/                  # API 路由
│   ├── students/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── contests/
│   │   └── page.tsx
│   ├── knowledge/
│   │   └── page.tsx
│   ├── tasks/
│   │   └── page.tsx
│   └── admin/
│       ├── page.tsx          # 登录页
│       ├── dashboard/
│       ├── students/
│       ├── contests/
│       ├── knowledge/
│       ├── tasks/
│       ├── announcements/
│       └── import/
├── components/
│   ├── ui/                   # shadcn/ui 组件
│   ├── layout/               # 布局组件
│   ├── student/              # 学生相关
│   ├── contest/              # 比赛相关
│   ├── knowledge/            # 知识点相关
│   ├── task/                 # 任务相关
│   └── admin/                # 后台组件
├── lib/
│   ├── prisma.ts             # Prisma 客户端
│   ├── utils.ts              # 工具函数
│   ├── auth.ts               # 认证逻辑
│   └── parser.ts             # Markdown 文件解析器
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── data/                 # 初始数据文件
├── scripts/
│   └── import-md.ts          # 导入脚本
├── types/
│   └── index.ts              # 共享类型
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```
