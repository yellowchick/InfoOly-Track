# InfoOly Track — Kimi Work 传递文档

> 将本文档发送给 Kimi Work，它将协助你完成项目配置、部署和日常维护。

---

## 一、项目简介

**InfoOly Track** 是一个信息学奥林匹克竞赛（OI）学生生涯记录平台。

- **前台**：展示学生信息、比赛成绩、知识点、任务板、训练安排日历、最新资讯
- **后台**：数据仪表盘 + 只读数据展示（学生/比赛/知识点/任务/公告/训练安排/关联网站）
- **技术栈**：Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui + Prisma + SQLite
- **线上地址**：https://infooly.com

---

## 二、环境要求

- **Node.js**：18.x 或更高
- **npm**：9.x 或更高
- **操作系统**：Linux（推荐 Ubuntu 22.04）/ macOS / Windows（WSL）
- **反向代理**：Nginx（生产环境）
- **进程管理**：PM2（生产环境）

---

## 三、首次配置步骤（请 Kimi Work 协助完成）

### 步骤 1：克隆仓库

```bash
git clone https://github.com/yellowchick/InfoOly-Track.git
cd InfoOly-Track
```

### 步骤 2：安装依赖

```bash
npm install
```

### 步骤 3：配置环境变量

```bash
cp .env.example .env.local
```

编辑 `.env.local`：

```env
DATABASE_URL="file:./prisma/dev.db"
ADMIN_PASSWORD=你的后台密码
```

### 步骤 4：初始化数据库

```bash
npx prisma db push
npm run db:seed
```

### 步骤 5：验证构建

```bash
npm run build
```

### 步骤 6：启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 验证页面正常。

---

## 四、生产部署（服务器）

### 4.1 服务器环境准备

```bash
# 安装 Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2 和 Nginx
sudo npm install -g pm2
sudo apt-get install -y nginx
```

### 4.2 项目部署

```bash
cd /root/InfoOly-Track
npm install
npm run build
```

### 4.3 PM2 配置

使用项目自带的 `deploy/pm2.config.js`：

```bash
pm2 start deploy/pm2.config.js
pm2 save
pm2 startup
```

### 4.4 Nginx 配置

```bash
cp deploy/nginx.conf /etc/nginx/sites-available/info-oly-track
ln -s /etc/nginx/sites-available/info-oly-track /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

### 4.5 SSL 证书

```bash
apt-get install -y certbot python3-certbot-nginx
certbot --nginx -d your-domain.com
```

---

## 五、日常数据维护

### 5.1 更新训练安排

1. 编辑 `scripts/update-schedule.js` 中的训练日期
2. 执行：`node scripts/update-schedule.js`

### 5.2 更新最新资讯

1. 编辑 `scripts/update-announcement-structured.js` 中的内容
2. 执行：`node scripts/update-announcement-structured.js`

### 5.3 批量更新比赛成绩和任务

准备 Markdown 文件，格式示例：

```markdown
- 线下赛gesp2606四级
  - 马天成 90分，下次可报名6级
  - 张赫桐 92分，下次可报名6级
- 线上赛AtCoder ABC465（2026-07）
  - 党皓天
    - 账号：solitaire
    - 得分：1000/2600，排名：3086
- 任务更新
  - 张赫桐
    - [x] CSPSTR06
    - [ ] CSPSTR18
```

执行：`node scripts/update-data.js your-file.md`

---

## 六、项目关键文件说明

| 文件 | 说明 |
|------|------|
| `prisma/schema.prisma` | 数据库模型定义 |
| `.env.local` | 环境变量（密码、数据库路径） |
| `deploy/nginx.conf` | Nginx 配置模板 |
| `deploy/pm2.config.js` | PM2 进程配置 |
| `scripts/update-data.js` | 从 Markdown 批量导入数据 |
| `scripts/update-schedule.js` | 更新训练安排 |
| `scripts/update-announcement-structured.js` | 更新最新资讯 |

---

## 七、常见问题

### 问题 1：构建失败，Prisma Client 报错

**解决**：
```bash
npx prisma generate
npm run build
```

### 问题 2：数据库修改后页面未更新

**原因**：Next.js 页面已配置 `force-dynamic`，但可能遇到缓存。

**解决**：
- 检查数据库数据是否已写入
- 重启 PM2：`pm2 restart info-oly-track`
- 如果使用 Cloudflare，清除缓存

### 问题 3：页面显示 fallback 数据而非数据库数据

**原因**：数据库查询失败，回退到静态数据。

**解决**：
```bash
# 检查数据库连接
npx prisma studio

# 确认环境变量正确
cat .env.local
```

### 问题 4：服务器构建超时

**解决**：
```bash
# 增加 Node.js 内存限制
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### 问题 5：HTTPS 证书过期

**解决**：
```bash
certbot renew
systemctl restart nginx
```

---

## 八、数据库操作速查

### 查看数据
```bash
npx prisma studio
# 或
node -e "const {PrismaClient} = require('@prisma/client'); const p = new PrismaClient(); p.student.findMany().then(d => { console.log(d); p.\$disconnect(); })"
```

### 重置数据库（谨慎！）
```bash
npx prisma db push --force-reset
npm run db:seed
```

### 数据库备份
```bash
cp prisma/dev.db prisma/dev.db.backup.$(date +%Y%m%d)
```

---

## 九、给 Kimi Work 的指令模板

当你需要 Kimi Work 协助时，可以发送以下指令：

### 指令 1：帮我部署项目到服务器
> "请将 InfoOly Track 项目部署到我的服务器 [IP]，域名是 [domain]。帮我配置 Nginx、PM2 和 SSL 证书。"

### 指令 2：更新数据库数据
> "请将附件中的 Markdown 数据导入到 InfoOly Track 数据库中，确保比赛成绩、任务状态都正确更新。"

### 指令 3：修改训练安排
> "请将下个月的训练安排更新为以下日期：[日期列表]，时间是 13:00-20:00。"

### 指令 4：添加最新资讯
> "请帮我添加一条最新资讯，标题是 [标题]，内容是 [内容]，涉及学生：[学生列表]。"

### 指令 5：排查页面问题
> "我的 [页面名] 页面显示异常，请帮我检查数据库和代码，修复问题。"

---

## 十、项目 GitHub 地址

https://github.com/yellowchick/InfoOly-Track

---

*本文档最后更新：2025年7月*
