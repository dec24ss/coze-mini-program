#!/bin/bash
set -Eeuo pipefail

# 在启动服务前重新编译原生模块
rebuild_native_modules() {
    echo "🔨 检查是否需要重新编译原生模块..."
    
    # 切换到项目根目录
    cd "${COZE_WORKSPACE_PATH}"
    echo "📍 当前工作目录: $(pwd)"
    echo "📍 COZE_WORKSPACE_PATH: ${COZE_WORKSPACE_PATH}"
    
    # 先尝试在根目录重新编译
    if [ -f "pnpm-lock.yaml" ] || [ -f "package.json" ]; then
        echo "📦 在项目根目录重新编译 better-sqlite3..."
        if pnpm rebuild better-sqlite3; then
            echo "✅ better-sqlite3 编译完成（根目录）"
            return 0
        fi
    fi
    
    # 如果失败，尝试在 server 目录重新编译
    if [ -d "server" ] && ([ -f "server/pnpm-lock.yaml" ] || [ -f "server/package.json" ]); then
        echo "📦 在 server 目录重新编译 better-sqlite3..."
        cd server
        if pnpm rebuild better-sqlite3; then
            echo "✅ better-sqlite3 编译完成（server 目录）"
            return 0
        fi
    fi
    
    # 如果都失败，输出错误信息
    echo "⚠️  重新编译失败"
    echo "📂 列出 node_modules 内容（前 30 行）:"
    ls -la "${COZE_WORKSPACE_PATH}/node_modules" 2>/dev/null | head -30 || echo "node_modules 不存在"
    
    if [ -d "${COZE_WORKSPACE_PATH}/server/node_modules" ]; then
        echo "📂 列出 server/node_modules 内容（前 30 行）:"
        ls -la "${COZE_WORKSPACE_PATH}/server/node_modules" 2>/dev/null | head -30 || echo "server/node_modules 不存在"
    fi
    
    return 1
}

start_service() {
    local port="${DEPLOY_RUN_PORT:-3000}"
    echo "Starting Static File Server on port ${port} for deploy..."

    node dist/main.js -p "${port}"
}

echo "Starting HTTP service for deploy..."
rebuild_native_modules

# 切换回 server 目录以启动服务
cd "${COZE_WORKSPACE_PATH}/server"
start_service
