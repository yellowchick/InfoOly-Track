#!/bin/bash
# InfoOly Track - 部署验证脚本
# 在每次 git pull / 代码同步后执行，检查配置文件完整性并验证应用健康状态
# 用法: bash deploy/verify.sh

set -uo pipefail

# ============================================
# 颜色定义
# ============================================
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS=0
FAIL=0
WARN=0

# ============================================
# 辅助函数
# ============================================
log_pass() {
    echo -e "${GREEN}[PASS]${NC} $1"
    ((PASS++))
}

log_fail() {
    echo -e "${RED}[FAIL]${NC} $1"
    ((FAIL++))
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
    ((WARN++))
}

log_info() {
    echo -e "[INFO] $1"
}

# ============================================
# 检查 1: 关键配置文件完整性
# ============================================
check_config_files() {
    echo ""
    echo "=========================================="
    echo "  检查 1: 关键配置文件完整性"
    echo "=========================================="

    local files=(
        "deploy/pm2.config.js"
        "deploy/nginx.conf"
        ".env.local"
    )

    for file in "${files[@]}"; do
        if [ ! -f "$file" ]; then
            log_fail "文件不存在: $file"
            continue
        fi

        local size
        size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null || echo 0)

        if [ "$size" -eq 0 ]; then
            log_fail "文件为空 (0 bytes): $file"
        else
            log_pass "$file 存在且非空 ($size bytes)"
        fi
    done

    # 额外检查: pm2.config.js 中的 cwd 路径是否指向存在的目录
    if [ -f "deploy/pm2.config.js" ] && [ "$(stat -c%s deploy/pm2.config.js 2>/dev/null || stat -f%z deploy/pm2.config.js 2>/dev/null || echo 0)" -gt 0 ]; then
        local cwd_path
        cwd_path=$(grep -oP "cwd\s*:\s*['\"]\K[^'\"]+" deploy/pm2.config.js 2>/dev/null || true)
        if [ -n "$cwd_path" ]; then
            if [ -d "$cwd_path" ]; then
                log_pass "PM2 cwd 路径有效: $cwd_path"
            else
                log_fail "PM2 cwd 路径不存在: $cwd_path"
                log_info "  请修改 deploy/pm2.config.js 中的 cwd 为实际项目路径"
            fi
        else
            log_warn "无法解析 PM2 配置中的 cwd 路径"
        fi
    fi
}

# ============================================
# 检查 2: 数据库文件完整性
# ============================================
check_database() {
    echo ""
    echo "=========================================="
    echo "  检查 2: 数据库文件完整性"
    echo "=========================================="

    local db_file="prisma/dev.db"

    if [ ! -f "$db_file" ]; then
        log_fail "数据库文件不存在: $db_file"
        return
    fi

    local size
    size=$(stat -c%s "$db_file" 2>/dev/null || stat -f%z "$db_file" 2>/dev/null || echo 0)
    log_pass "数据库文件存在 ($size bytes)"

    # SQLite 完整性检查
    if command -v sqlite3 &> /dev/null; then
        if sqlite3 "$db_file" "PRAGMA integrity_check;" 2>/dev/null | grep -q "ok"; then
            log_pass "SQLite 完整性检查通过"
        else
            log_fail "SQLite 完整性检查失败"
        fi
    else
        log_warn "sqlite3 命令未安装，跳过数据库完整性检查"
    fi
}

# ============================================
# 检查 3: Node.js 依赖完整性
# ============================================
check_dependencies() {
    echo ""
    echo "=========================================="
    echo "  检查 3: Node.js 依赖完整性"
    echo "=========================================="

    if [ ! -d "node_modules" ]; then
        log_fail "node_modules 目录不存在，请运行 npm install"
        return
    fi

    log_pass "node_modules 目录存在"

    # 检查关键依赖是否存在
    local critical_deps=("next" "prisma" "@prisma/client" "react" "react-dom")
    for dep in "${critical_deps[@]}"; do
        if [ -d "node_modules/$dep" ]; then
            log_pass "依赖已安装: $dep"
        else
            log_fail "依赖缺失: $dep，请运行 npm install"
        fi
    done

    # 检查 Prisma Client 是否已生成
    if [ -f "node_modules/.prisma/client/index.js" ] || [ -f "node_modules/@prisma/client/index.js" ]; then
        log_pass "Prisma Client 已生成"
    else
        log_warn "Prisma Client 未生成，建议运行: npx prisma generate"
    fi
}

# ============================================
# 检查 4: 构建产物完整性
# ============================================
check_build_output() {
    echo ""
    echo "=========================================="
    echo "  检查 4: 构建产物完整性"
    echo "=========================================="

    if [ ! -d ".next" ]; then
        log_fail ".next 构建目录不存在，请运行 npm run build"
        return
    fi

    log_pass ".next 构建目录存在"

    # 检查关键文件
    local build_files=(".next/standalone/server.js" ".next/static")
    for file in "${build_files[@]}"; do
        if [ -e "$file" ]; then
            log_pass "构建产物存在: $file"
        else
            log_warn "构建产物缺失: $file（如果使用 standalone 输出则正常）"
        fi
    done
}

# ============================================
# 检查 5: PM2 进程状态
# ============================================
check_pm2_status() {
    echo ""
    echo "=========================================="
    echo "  检查 5: PM2 进程状态"
    echo "=========================================="

    if ! command -v pm2 &> /dev/null; then
        log_warn "PM2 未安装"
        return
    fi

    local pm2_status
    pm2_status=$(pm2 status info-oly-track 2>/dev/null || true)

    if echo "$pm2_status" | grep -q "info-oly-track"; then
        if echo "$pm2_status" | grep "info-oly-track" | grep -q "online"; then
            local pid mem uptime
            pid=$(echo "$pm2_status" | grep "info-oly-track" | awk '{print $8}')
            mem=$(echo "$pm2_status" | grep "info-oly-track" | awk '{print $10}')
            uptime=$(echo "$pm2_status" | grep "info-oly-track" | awk '{print $9}')

            if [ "$pid" = "N/A" ] || [ "$mem" = "0b" ]; then
                log_fail "PM2 进程状态异常 (PID: $pid, 内存: $mem)"
                log_info "  进程可能已崩溃或未正确启动，请检查日志: pm2 logs info-oly-track"
            else
                log_pass "PM2 进程运行正常 (PID: $pid, 内存: $mem, 运行: $uptime)"
            fi
        else
            local status
            status=$(echo "$pm2_status" | grep "info-oly-track" | awk '{print $10}')
            log_fail "PM2 进程状态: $status（非 online）"
        fi
    else
        log_fail "PM2 中没有 info-oly-track 进程"
        log_info "  请启动: pm2 start deploy/pm2.config.js"
    fi
}

# ============================================
# 检查 6: 应用健康检查（HTTP 请求）
# ============================================
check_app_health() {
    echo ""
    echo "=========================================="
    echo "  检查 6: 应用健康检查"
    echo "=========================================="

    local max_retries=3
    local retry_delay=2
    local success=false

    for i in $(seq 1 $max_retries); do
        local http_code
        http_code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ 2>/dev/null || echo "000")

        if [ "$http_code" = "200" ]; then
            log_pass "HTTP 健康检查通过 (状态码: 200)"
            success=true
            break
        elif [ "$http_code" = "000" ]; then
            if [ $i -lt $max_retries ]; then
                log_info "  第 $i 次尝试失败，等待 ${retry_delay}s 后重试..."
                sleep $retry_delay
            else
                log_fail "HTTP 健康检查失败: 无法连接到 localhost:3000"
                log_info "  可能原因:"
                log_info "    1. 应用未启动: pm2 start deploy/pm2.config.js"
                log_info "    2. 端口被占用: lsof -i :3000"
                log_info "    3. 应用启动失败: pm2 logs info-oly-track"
            fi
        else
            log_warn "HTTP 返回非 200 状态码: $http_code"
            success=true
            break
        fi
    done
}

# ============================================
# 检查 7: Nginx 状态（如果安装）
# ============================================
check_nginx() {
    echo ""
    echo "=========================================="
    echo "  检查 7: Nginx 状态"
    echo "=========================================="

    if ! command -v nginx &> /dev/null; then
        log_warn "Nginx 未安装"
        return
    fi

    if systemctl is-active nginx &> /dev/null; then
        log_pass "Nginx 服务运行中"
    else
        log_warn "Nginx 服务未运行: systemctl start nginx"
    fi

    # 检查 Nginx 配置语法
    if nginx -t &> /dev/null; then
        log_pass "Nginx 配置语法正确"
    else
        log_fail "Nginx 配置语法错误"
    fi
}

# ============================================
# 检查 8: 磁盘和内存空间
# ============================================
check_resources() {
    echo ""
    echo "=========================================="
    echo "  检查 8: 系统资源"
    echo "=========================================="

    # 磁盘使用率
    local disk_usage
    disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    if [ "$disk_usage" -lt 80 ]; then
        log_pass "磁盘使用率: ${disk_usage}%"
    elif [ "$disk_usage" -lt 95 ]; then
        log_warn "磁盘使用率较高: ${disk_usage}%"
    else
        log_fail "磁盘使用率过高: ${disk_usage}%"
    fi

    # 内存可用量（粗略检查）
    if command -v free &> /dev/null; then
        local mem_available
        mem_available=$(free -m | awk '/Mem:/ {print $7}')
        if [ "$mem_available" -gt 200 ]; then
            log_pass "可用内存: ${mem_available}MB"
        else
            log_warn "可用内存不足: ${mem_available}MB"
        fi
    fi
}

# ============================================
# 主程序
# ============================================
main() {
    echo "=========================================="
    echo "  InfoOly Track - 部署验证脚本"
    echo "  $(date '+%Y-%m-%d %H:%M:%S')"
    echo "=========================================="

    # 检查是否在项目根目录
    if [ ! -f "package.json" ]; then
        echo ""
        log_fail "请在项目根目录运行此脚本"
        echo "  cd /path/to/InfoOly-Track"
        echo "  bash deploy/verify.sh"
        exit 1
    fi

    check_config_files
    check_database
    check_dependencies
    check_build_output
    check_pm2_status
    check_app_health
    check_nginx
    check_resources

    # 汇总
    echo ""
    echo "=========================================="
    echo "  验证结果汇总"
    echo "=========================================="
    echo -e "  ${GREEN}通过: $PASS${NC}"
    echo -e "  ${YELLOW}警告: $WARN${NC}"
    echo -e "  ${RED}失败: $FAIL${NC}"
    echo "=========================================="

    if [ $FAIL -gt 0 ]; then
        echo ""
        echo -e "${RED}存在 $FAIL 个失败项，请修复后再继续。${NC}"
        echo ""
        echo "常用修复命令:"
        echo "  npm install              # 安装依赖"
        echo "  npx prisma generate      # 生成 Prisma Client"
        echo "  npm run build            # 构建项目"
        echo "  pm2 start deploy/pm2.config.js  # 启动应用"
        echo "  pm2 logs info-oly-track  # 查看日志"
        exit 1
    elif [ $WARN -gt 0 ]; then
        echo ""
        echo -e "${YELLOW}存在 $WARN 个警告，建议关注但不影响运行。${NC}"
        exit 0
    else
        echo ""
        echo -e "${GREEN}所有检查通过！部署状态正常。${NC}"
        exit 0
    fi
}

main "$@"
