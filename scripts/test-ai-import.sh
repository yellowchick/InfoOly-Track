#!/bin/bash
# AI导入功能测试脚本

# 1. 登录获取cookie
curl -s -X POST http://localhost:3000/api/admin/login/ \
  -H "Content-Type: application/json" \
  -d '{"password":"qwertyuiopwasd"}' \
  -D /tmp/login_headers.txt

echo "=== Login headers ==="
cat /tmp/login_headers.txt

COOKIE=$(grep -i "set-cookie" /tmp/login_headers.txt | head -1 | grep -o 'admin_token=[^;]*')
echo ""
echo "=== Cookie: $COOKIE ==="

# 2. 测试AI导入 - preview模式
echo ""
echo "=== AI Preview Test ==="
curl -s -X POST http://localhost:3000/api/admin/ai-import/ \
  -H "Content-Type: application/json" \
  -H "Cookie: $COOKIE" \
  -d '{"text":"马天成完成了莫队进阶题TR19和gesp五六七八级GESP01~05","mode":"preview"}' \
  | python3 -m json.tool 2>/dev/null || cat

# 3. 测试AI导入 - 带比赛成绩
echo ""
echo "=== AI Preview Test 2 (contest) ==="
curl -s -X POST http://localhost:3000/api/admin/ai-import/ \
  -H "Content-Type: application/json" \
  -H "Cookie: $COOKIE" \
  -d '{"text":"张赫桐在2026年6月的YACS乙组月赛中得了150分，获得了二等奖","mode":"preview"}' \
  | python3 -m json.tool 2>/dev/null || cat
