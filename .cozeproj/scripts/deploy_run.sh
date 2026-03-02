#!/bin/bash
set -Eeuo pipefail

start_service() {
    local port="${DEPLOY_RUN_PORT:-3000}"
    echo "Starting HTTP service for deploy..."

    # 使用 NODE_PATH 环境变量启动服务（如果设置了）
    if [ -n "${NODE_PATH:-}" ]; then
        echo "📌 使用自定义 NODE_PATH: ${NODE_PATH}"
        NODE_PATH="${NODE_PATH}" node dist/main.js -p "${port}"
    else
        node dist/main.js -p "${port}"
    fi
}

echo "Starting HTTP service for deploy..."

# 直接启动服务（不再需要重新编译原生模块）
start_service
