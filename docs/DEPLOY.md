# InfoOly Track 部署文档

> 本文档面向 DevOps 工程师及系统管理员，指导如何在 Linux 服务器上完成 InfoOly Track 的完整部署。

---

## 1. 部署架构

```
                    ┌─────────────────────────────────┐
                    │           用户浏览器             │
                    └──────────────┬──────────────────┘
                                   │ HTTPS :443
                                   ▼
                    ┌─────────────────────────────────┐
                    │   Nginx 反向代理 + SSL 终止     │
                    │   (端口 80 / 443)              │
                    └──────────────┬──────────────────┘
                                   │ HTTP :3000
                                   ▼
                    ┌─────────────────────────────────┐
                    │   Next.js 14 App               │
                    │   (端口 3000)                  │
                    │   ┌──────────────┐             │
                    │   │  SQLite DB   │             │
                    │   │  /app/data/  │  ← 卷挂载   │
                    │   └──────────────┘             │
                    └─────────────────────────────────┘
                                   │
                                   ▼
                    ┌─────────────────────────────────┐
                    │   /backup/                     │
                    │   每日自动备份 (保留30天)      │
                    └─────────────────────────────────┘
```

- **前端/后端**：Next.js 14 (App Router)
- **数据库**：SQLite（文件型，无需独立数据库服务器）
- **进程管理**：Docker Compose 或 PM2（二选一）
- **反向代理**：Nginx
- **SSL**：Let's Encrypt (certbot)
- **备份**：crontab 定时执行 Shell 脚本

---

## 2. 服务器最低配置要求

| 资源 | 最低配置 | 推荐配置 |
|------|----------|----------|
| CPU | 1 核 | 2 核 |
| 内存 | 512 MB | 1 GB |
| 磁盘 | 10 GB | 20 GB+ |
| 操作系统 | Ubuntu 22.04/24.04 LTS | — |
| 网络 | 公网 IP，开放 80/443 | — |

> 本项目使用 SQLite 文件数据库，数据量较小时（< 1GB）单机部署即可满足需求。若数据增长至数 GB 或并发写入需求增加，建议迁移至 PostgreSQL/MySQL。

---

## 3. 部署步骤

### 步骤 1：服务器初始化（在服务器上运行）

将项目代码中的 `deploy/setup-server.sh` 上传到服务器，然后以 root 执行：

```bash
# 方式 A：直接上传后执行
sudo bash /path/to/setup-server.sh

# 方式 B：先克隆代码再执行
sudo apt-get update && sudo apt-get install -y git
git clone https://github.com/your-org/info-oly-track.git /var/www/info-oly-track
cd /var/www/info-oly-track
sudo bash deploy/setup-server.sh
```

该脚本会自动完成：
- 系统更新与基础工具安装
- Node.js 20 安装（通过 `n`）
- PM2 全局安装
- Nginx 安装与基础配置
- 创建 `/var/www/`、`/backup/`、`/var/log/` 目录
- UFW 防火墙配置（开放 22/80/443）
- crontab 定时备份任务设置

---

### 步骤 2：克隆代码并配置环境变量

```bash
cd /var/www/info-oly-track

# 复制环境变量模板
cp .env.example .env

# 编辑 .env（必须使用安全的密码）
nano .env
```

`.env` 示例内容：

```env
# 数据库路径
# Docker 部署：file:/app/data/dev.db
# PM2 部署：file:./prisma/dev.db
DATABASE_URL="file:/app/data/dev.db"

# 管理员密码（必须修改！）
ADMIN_PASSWORD="your-secure-password-here"
```

> **重要**：Docker 部署时 `DATABASE_URL` 应使用绝对路径 `file:/app/data/dev.db`，因为容器内的数据卷挂载在 `/app/data`。PM2 部署时保持 `file:./prisma/dev.db` 即可。

---

### 步骤 3：构建并启动（二选一）

#### 方案 A：Docker Compose（推荐，环境隔离）

```bash
# 构建镜像并启动
docker-compose up -d --build

# 查看日志
docker-compose logs -f app

# 停止
docker-compose down

# 重启
docker-compose restart
```

Docker Compose 会自动：
- 构建多阶段 Docker 镜像
- 启动容器，映射 3000 端口
- 挂载 `./data` 目录持久化 SQLite 数据库
- 设置容器健康检查

#### 方案 B：PM2（轻量，无 Docker 依赖）

```bash
# 1. 安装依赖
npm ci

# 2. 生成 Prisma Client
npx prisma generate

# 3. 构建 Next.js
npm run build

# 4. 启动（使用 PM2 配置）
pm2 start deploy/pm2.config.js

# 5. 保存进程列表，设置开机自启
pm2 save
pm2 startup

# 常用命令
pm2 status              # 查看状态
pm2 logs info-oly-track # 查看日志
pm2 restart info-oly-track # 重启
pm2 stop info-oly-track    # 停止
```

---

### 步骤 4：配置 Nginx 反向代理

`setup-server.sh` 已自动将 `deploy/nginx.conf` 复制到 `/etc/nginx/sites-available/` 并启用。若需手动配置：

```bash
# 复制配置
sudo cp deploy/nginx.conf /etc/nginx/sites-available/info-oly-track
sudo ln -sf /etc/nginx/sites-available/info-oly-track /etc/nginx/sites-enabled/

# 修改 server_name 为你的域名
sudo nano /etc/nginx/sites-available/info-oly-track

# 测试并重载
sudo nginx -t
sudo systemctl reload nginx
```

> 配置文件中默认 `server_name _;` 表示匹配任意域名，**生产环境务必替换为实际域名**。

---

### 步骤 5：配置 SSL（Let's Encrypt）

```bash
# 安装 certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 申请证书并自动配置 Nginx（替换为你的域名）
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 测试自动续期
sudo certbot renew --dry-run
```

certbot 会自动修改 Nginx 配置，添加 443 监听和 SSL 证书路径。无需手动修改。

---

## 4. 数据库说明

### 数据库方案

本项目采用 **SQLite** 文件型数据库，无需安装独立的数据库服务。

| 特性 | 说明 |
|------|------|
| 文件位置 | `prisma/dev.db`（PM2）或 `/app/data/dev.db`（Docker） |
| 并发写入 | 不支持（SQLite 文件锁），因此 PM2 和 Docker 均配置为单实例 |
| 数据迁移 | 修改 `prisma/schema.prisma` 后执行 `npx prisma db push` |
| 数据导入 | 使用 `npm run db:import` 或 `npm run db:seed` |

### 迁移到 PostgreSQL/MySQL（可选）

如需迁移到 PostgreSQL 或 MySQL，仅需修改以下内容：

1. **修改 `prisma/schema.prisma`**：
   ```prisma
   datasource db {
     provider = "postgresql"  // 或 "mysql"
     url      = env("DATABASE_URL")
   }
   ```

2. **修改 `.env` 中的 `DATABASE_URL`**：
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/info_oly_track"
   ```

3. **重新生成 Prisma Client**：
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Docker Compose 中移除 SQLite 数据卷挂载**，改为依赖外部数据库服务。

---

## 5. 数据库备份

备份脚本位于 `deploy/backup.sh`，功能包括：
- 复制 SQLite 数据库文件
- 进行数据库完整性检查（`PRAGMA integrity_check`）
- 按 `YYYY-MM-DD_HH-MM-SS` 命名备份文件
- 使用 gzip 压缩
- 自动清理超过 30 天的旧备份

### 手动执行备份

```bash
# PM2 部署
/var/www/info-oly-track/deploy/backup.sh

# Docker 部署（先进入容器复制出来）
docker cp info-oly-track:/app/data/dev.db /tmp/dev.db
# 然后手动备份 /tmp/dev.db
```

### 定时备份（已自动配置）

`setup-server.sh` 已添加 crontab 任务：
```cron
0 3 * * * /var/www/info-oly-track/deploy/backup.sh >> /var/log/cron-backup.log 2>&1
```

每天凌晨 3 点自动执行，备份文件保存在 `/backup/info-oly-track/`。

### 数据恢复

```bash
# 停止应用
pm2 stop info-oly-track  # 或 docker-compose down

# 恢复数据库（替换 BACKUP_FILE 为实际备份路径）
BACKUP_FILE="/backup/info-oly-track/dev.db_2024-01-15_03-00-00.db.gz"
gunzip -c "${BACKUP_FILE}" > /var/www/info-oly-track/prisma/dev.db

# 重新启动
pm2 start info-oly-track  # 或 docker-compose up -d
```

---

## 6. 更新与回滚

### 更新应用

```bash
cd /var/www/info-oly-track

# 拉取最新代码
git pull origin main

# 更新依赖
npm ci

# 重新生成 Prisma Client（如果 schema 有变更）
npx prisma generate

# 如果有数据库迁移（仅当使用 PostgreSQL/MySQL 时）
# npx prisma migrate deploy

# 构建
npm run build

# 重启（Docker）
docker-compose up -d --build

# 或重启（PM2）
pm2 reload info-oly-track
```

### 回滚

```bash
cd /var/www/info-oly-track

# 回滚到上一个版本
git log --oneline -5  # 查看提交历史
git checkout <commit-hash>

# 重新构建并启动
npm ci && npm run build
pm2 reload info-oly-track  # 或 docker-compose up -d --build
```

> 建议在更新前执行一次手动备份，以便快速回滚数据库：
> ```bash
> ./deploy/backup.sh
> ```

---

## 7. 故障排查

| 问题 | 排查方法 |
|------|----------|
| 应用无法启动 | 检查 `pm2 logs` 或 `docker-compose logs` |
| 数据库连接失败 | 确认 `.env` 中 `DATABASE_URL` 路径正确，文件存在且有读写权限 |
| Nginx 502 错误 | 检查 Next.js 是否在 3000 端口运行：`curl http://localhost:3000` |
| 备份失败 | 检查 `/var/log/cron-backup.log`，确认数据库文件存在且 sqlite3 已安装 |
| SSL 证书过期 | 运行 `sudo certbot renew --dry-run` 测试自动续期 |
| 静态资源 404 | 确认 `next.config.js` 中 `trailingSlash: true` 与 Nginx 配置匹配 |

---

## 8. 目录结构参考

部署后服务器上的关键目录：

```
/var/www/info-oly-track/    # 项目代码
├── .next/                   # Next.js 构建产物
├── prisma/                  # Prisma schema + dev.db（PM2 模式）
├── public/                  # 静态资源
├── deploy/                  # 部署脚本
│   ├── nginx.conf
│   ├── pm2.config.js
│   ├── backup.sh
│   └── setup-server.sh
├── docs/                    # 文档
├── docker-compose.yml
├── Dockerfile
└── .env                     # 环境变量（不纳入版本控制）

/backup/info-oly-track/      # 数据库备份
/var/log/info-oly-track/   # 应用日志（PM2 模式）
/etc/nginx/sites-available/  # Nginx 配置
```

---

*本文档最后更新于 2024 年。如有疑问，请查阅项目 `README.md` 或提交 Issue。*
