#!/bin/bash
set -Eeuo pipefail

# 在启动服务前重新编译原生模块
rebuild_native_modules() {
    echo "🔨 检查是否需要重新编译原生模块..."
    cd "${COZE_WORKSPACE_PATH}"

    # 检查 better-sqlite3 是否需要重新编译
    if [ -d "server/node_modules/.pnpm/better-sqlite3" ]; then
        echo "📦 重新编译 better-sqlite3..."

        # 检查是否已经编译过（避免重复编译）
        if [ ! -f "server/node_modules/.pnpm/better-sqlite3/*/node_modules/better-sqlite3/build/Release/better_sqlite3.node" ]; then
            cd server
            pnpm rebuild better-sqlite3
            echo "✅ better-sqlite3 编译完成"
            cd ..
        else
            echo "✅ better-sqlite3 已编译，跳过"
        fi
    fi

    cd "${COZE_WORKSPACE_PATH}/server"
}

start_service() {
    local port="${DEPLOY_RUN_PORT:-3000}"
    echo "Starting Static File Server on port ${port} for deploy..."

    node dist/main.js -p "${port}"
}

echo "Starting HTTP service for deploy..."
rebuild_native_modules
start_service
