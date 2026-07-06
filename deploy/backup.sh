#!/bin/bash
# InfoOly Track - SQLite 数据库备份脚本
# 建议通过 crontab 定时执行：0 3 * * * /var/www/info-oly-track/deploy/backup.sh

set -euo pipefail

# ============================================
# 配置区
# ============================================
PROJECT_NAME="info-oly-track"
# 数据库所在目录（PM2 部署时为项目目录，Docker 部署时需调整）
DB_SOURCE_DIR="/var/www/${PROJECT_NAME}/prisma"
DB_FILE="dev.db"
BACKUP_DIR="/backup/${PROJECT_NAME}"
# 保留最近 30 天备份
RETENTION_DAYS=30

# ============================================
# 主逻辑
# ============================================
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_FILE="${BACKUP_DIR}/${DB_FILE}_${TIMESTAMP}.db"

# 确保备份目录存在
mkdir -p "${BACKUP_DIR}"

# 检查数据库文件是否存在
if [ ! -f "${DB_SOURCE_DIR}/${DB_FILE}" ]; then
    echo "[ERROR] $(date '+%Y-%m-%d %H:%M:%S') 数据库文件不存在: ${DB_SOURCE_DIR}/${DB_FILE}"
    exit 1
fi

# 数据库完整性检查（SQLite 内建命令）
if ! sqlite3 "${DB_SOURCE_DIR}/${DB_FILE}" "PRAGMA integrity_check;" | grep -q "ok"; then
    echo "[ERROR] $(date '+%Y-%m-%d %H:%M:%S') 数据库完整性检查失败，跳过本次备份"
    exit 1
fi

# 执行备份：复制后压缩
cp "${DB_SOURCE_DIR}/${DB_FILE}" "${BACKUP_FILE}"
gzip -f "${BACKUP_FILE}"
BACKUP_FILE_GZ="${BACKUP_FILE}.gz"
BACKUP_SIZE=$(du -h "${BACKUP_FILE_GZ}" | cut -f1)

# 删除超过保留期的旧备份
DELETED_COUNT=$(find "${BACKUP_DIR}" -type f -name "${DB_FILE}_*.gz" -mtime +${RETENTION_DAYS} | wc -l)
find "${BACKUP_DIR}" -type f -name "${DB_FILE}_*.gz" -mtime +${RETENTION_DAYS} -delete

# 统计现有备份数量
BACKUP_COUNT=$(ls -1 "${BACKUP_DIR}/${DB_FILE}_"*.gz 2>/dev/null | wc -l)

# 输出结果
echo "=========================================="
echo "[SUCCESS] $(date '+%Y-%m-%d %H:%M:%S') 备份完成"
echo "  - 备份文件: ${BACKUP_FILE_GZ}"
echo "  - 文件大小: ${BACKUP_SIZE}"
echo "  - 保留策略: ${RETENTION_DAYS} 天"
echo "  - 清理旧备份: ${DELETED_COUNT} 个"
echo "  - 现有备份数: ${BACKUP_COUNT} 个"
echo "=========================================="
