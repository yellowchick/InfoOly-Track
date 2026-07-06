#!/bin/bash
# InfoOly Track - 服务器初始化脚本
# 适用于 Ubuntu 22.04 / 24.04 LTS
# 请以 root 用户运行：sudo bash deploy/setup-server.sh

set -euo pipefail

PROJECT_NAME="info-oly-track"
DEPLOY_DIR="/var/www/${PROJECT_NAME}"
BACKUP_DIR="/backup/${PROJECT_NAME}"
LOG_DIR="/var/log/${PROJECT_NAME}"

echo "=========================================="
echo "  InfoOly Track 服务器初始化"
echo "  适用系统: Ubuntu 22.04/24.04 LTS"
echo "=========================================="
echo ""

# 1. 系统更新
echo "[1/8] 更新系统包..."
apt-get update -y && apt-get upgrade -y

# 2. 安装基础工具
echo "[2/8] 安装基础工具（curl, wget, git, nginx, sqlite3, ufw）..."
apt-get install -y curl wget git nginx sqlite3 ufw

# 3. 安装 Node.js 20 (via n)
echo "[3/8] 安装 Node.js 20..."
if ! command -v n &> /dev/null; then
    npm install -g n
fi
n 20
# 刷新 shell 哈希表
hash -r

NODE_VERSION=$(node -v)
NPM_VERSION=$(npm -v)
echo "  Node.js: ${NODE_VERSION}"
echo "  npm: ${NPM_VERSION}"

# 4. 安装 PM2
echo "[4/8] 安装 PM2..."
npm install -g pm2
pm2 --version

# 5. 创建目录结构
echo "[5/8] 创建项目目录..."
mkdir -p "${DEPLOY_DIR}"
mkdir -p "${BACKUP_DIR}"
mkdir -p "${LOG_DIR}"
chown -R www-data:www-data "${DEPLOY_DIR}"
chown -R www-data:www-data "${BACKUP_DIR}"
chown -R www-data:www-data "${LOG_DIR}"

# 6. 配置防火墙
echo "[6/8] 配置 UFW 防火墙..."
ufw default deny incoming
ufw default allow outgoing
ufw allow 22/tcp   comment 'SSH'
ufw allow 80/tcp   comment 'HTTP'
ufw allow 443/tcp  comment 'HTTPS'
ufw --force enable
echo "  防火墙状态:"
ufw status

# 7. 设置定时备份任务
echo "[7/8] 设置定时备份任务..."
BACKUP_SCRIPT="${DEPLOY_DIR}/deploy/backup.sh"
if [ -f "${BACKUP_SCRIPT}" ]; then
    # 添加 crontab 任务（每天凌晨 3 点执行），避免重复添加
    (crontab -l 2>/dev/null || true; echo "0 3 * * * ${BACKUP_SCRIPT} >> /var/log/cron-backup.log 2>&1") | sort -u | crontab -
    echo "  已添加 crontab: 每天 03:00 执行备份"
else
    echo "  [WARN] 备份脚本不存在，跳过 crontab 设置。"
    echo "  部署代码后请手动执行:"
    echo "    crontab -e"
    echo "    0 3 * * * /var/www/${PROJECT_NAME}/deploy/backup.sh >> /var/log/cron-backup.log 2>&1"
fi

# 8. 配置 Nginx
echo "[8/8] 配置 Nginx..."
NGINX_CONF="${DEPLOY_DIR}/deploy/nginx.conf"
if [ -f "${NGINX_CONF}" ]; then
    cp "${NGINX_CONF}" /etc/nginx/sites-available/${PROJECT_NAME}
    ln -sf /etc/nginx/sites-available/${PROJECT_NAME} /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default
    nginx -t && systemctl restart nginx
    echo "  Nginx 配置已生效"
else
    echo "  [WARN] Nginx 配置文件不存在，请部署代码后手动配置"
fi

echo ""
echo "=========================================="
echo "  服务器初始化完成！"
echo "=========================================="
echo ""
echo "  项目目录: ${DEPLOY_DIR}"
echo "  备份目录: ${BACKUP_DIR}"
echo "  日志目录: ${LOG_DIR}"
echo "  Node.js:  $(node -v)"
echo "  PM2:      $(pm2 --version 2>/dev/null || echo '未知')"
echo "  Nginx:    $(nginx -v 2>&1 | head -1)"
echo ""
echo "  下一步操作:"
echo "  1. 将代码克隆到 ${DEPLOY_DIR}"
echo "  2. 复制 .env.example 为 .env 并修改配置（尤其是 ADMIN_PASSWORD）"
echo "  3. 运行部署（Docker 或 PM2 二选一）"
echo "  4. 配置 SSL: certbot --nginx -d your-domain.com"
echo ""
