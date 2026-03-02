#!/bin/bash
set -Eeuo pipefail

# 在启动服务前重新编译原生模块
rebuild_native_modules() {
    echo "🔨 检查是否需要重新编译原生模块..."
    cd "${COZE_WORKSPACE_PATH}/server"

    # 检查 better-sqlite3 是否需要重新编译
    # 在生产环境中直接重新编译，确保版本匹配
    if [ -d "node_modules/.pnpm/better-sqlite3" ]; then
        echo "📦 重新编译 better-sqlite3（确保 Node.js 版本匹配）..."
        pnpm rebuild better-sqlite3
        echo "✅ better-sqlite3 编译完成"
    else
        echo "⚠️  未找到 better-sqlite3"
    fi
}

start_service() {
    local port="${DEPLOY_RUN_PORT:-3000}"
    echo "Starting Static File Server on port ${port} for deploy..."

    node dist/main.js -p "${port}"
}

echo "Starting HTTP service for deploy..."
rebuild_native_modules
start_service
