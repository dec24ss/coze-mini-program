#!/bin/bash
set -Eeuo pipefail

# 在启动服务前重新编译原生模块
rebuild_native_modules() {
    echo "🔨 检查是否需要重新编译原生模块..."
    
    # 切换到项目根目录
    cd "${COZE_WORKSPACE_PATH}"
    
    # 检查 better-sqlite3 是否存在（在根目录或 server 目录）
    BETTER_SQLITE3_PATH=""
    
    if [ -d "node_modules/.pnpm/better-sqlite3" ]; then
        BETTER_SQLITE3_PATH="${COZE_WORKSPACE_PATH}"
        echo "📦 在根目录找到 better-sqlite3"
    elif [ -d "server/node_modules/.pnpm/better-sqlite3" ]; then
        BETTER_SQLITE3_PATH="${COZE_WORKSPACE_PATH}/server"
        echo "📦 在 server 目录找到 better-sqlite3"
    else
        echo "⚠️  未找到 better-sqlite3 目录"
        ls -la "${COZE_WORKSPACE_PATH}/node_modules/.pnpm" 2>/dev/null | head -20 || echo "node_modules/.pnpm 不存在"
        ls -la "${COZE_WORKSPACE_PATH}/server/node_modules/.pnpm" 2>/dev/null | head -20 || echo "server/node_modules/.pnpm 不存在"
        return 1
    fi
    
    # 在找到的目录中重新编译
    cd "${BETTER_SQLITE3_PATH}"
    echo "📦 重新编译 better-sqlite3（确保 Node.js 版本匹配）..."
    echo "当前目录: $(pwd)"
    pnpm rebuild better-sqlite3
    echo "✅ better-sqlite3 编译完成"
    
    # 切换回 server 目录以启动服务
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
