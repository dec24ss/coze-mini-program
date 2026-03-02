#!/bin/bash
set -Eeuo pipefail

echo "🔨 重新编译原生模块..."

# 获取 Node.js 版本
NODE_VERSION=$(node -v)
echo "当前 Node.js 版本: ${NODE_VERSION}"

# 检查 better-sqlite3 是否存在
if [ -d "node_modules/.pnpm/better-sqlite3" ]; then
    echo "📦 找到 better-sqlite3，开始重新编译..."
    cd server
    pnpm rebuild better-sqlite3
    echo "✅ better-sqlite3 编译完成"
    cd ..
else
    echo "⚠️  未找到 better-sqlite3，跳过编译"
fi

echo "✅ 原生模块重新编译完成"
