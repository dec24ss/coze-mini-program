#!/bin/bash
set -Eeuo pipefail

# 在启动服务前重新编译原生模块
rebuild_native_modules() {
    echo "🔨 检查是否需要重新编译原生模块..."

    # 切换到 server 目录（better-sqlite3 是 server 的依赖）
    cd "${COZE_WORKSPACE_PATH}/server"
    echo "📍 当前工作目录: $(pwd)"
    echo "📍 COZE_WORKSPACE_PATH: ${COZE_WORKSPACE_PATH}"

    # 验证 better-sqlite3 是否真正可用（需要实际加载 .node 文件）
    echo "🔍 验证 better-sqlite3 是否可用..."
    if node -e "const Database = require('better-sqlite3'); const db = new Database(':memory:'); db.close(); console.log('✅ better-sqlite3 可用')" 2>/dev/null; then
        echo "✅ better-sqlite3 已经可用，无需重新编译"
        return 0
    fi

    echo "⚠️  better-sqlite3 不可用或版本不匹配，尝试重新编译..."
    echo "💡 可能原因：Node.js 版本不匹配（编译环境 vs 运行环境）"

    # 检测文件系统是否为只读
    if [ ! -w "${COZE_WORKSPACE_PATH}" ]; then
        echo "⚠️  检测到文件系统为只读，使用 /tmp 目录进行编译..."

        # 在 /tmp 中创建工作目录
        local tmp_dir="/tmp/better-sqlite3-rebuild-$$"
        mkdir -p "${tmp_dir}"

        echo "📦 复制 better-sqlite3 包到临时目录..."
        # 尝试复制 better-sqlite3 包到临时目录（不使用 || true，因为我们在下面检查了结果）
        if cp -r "${COZE_WORKSPACE_PATH}/node_modules/.pnpm/better-sqlite3@11.10.0/node_modules/better-sqlite3" "${tmp_dir}/"; then
            echo "✅ 从根目录 node_modules 复制成功"
        elif cp -r "${COZE_WORKSPACE_PATH}/server/node_modules/.pnpm/better-sqlite3@11.10.0/node_modules/better-sqlite3" "${tmp_dir}/"; then
            echo "✅ 从 server node_modules 复制成功"
        else
            echo "❌ 无法复制 better-sqlite3 包"
            rm -rf "${tmp_dir}"
            return 1
        fi

        echo "📦 在临时目录中编译 better-sqlite3..."
        cd "${tmp_dir}/better-sqlite3"

        echo "🔍 检查 package.json..."
        if [ -f "package.json" ]; then
            echo "✅ package.json 存在"
        else
            echo "❌ package.json 不存在"
            rm -rf "${tmp_dir}"
            return 1
        fi

        # 直接使用 node-gyp 重新编译（避免 npm 的额外检查）
        echo "🔨 使用 node-gyp 重新编译..."
        if node-gyp rebuild --release; then
            echo "✅ better-sqlite3 在临时目录中编译完成"

            # 设置环境变量，让 Node.js 优先从临时目录加载 better-sqlite3
            export NODE_PATH="${tmp_dir}:${NODE_PATH:-}"
            echo "📌 设置 NODE_PATH: ${NODE_PATH}"

            # 验证是否可用
            if node -e "const Database = require('better-sqlite3'); const db = new Database(':memory:'); db.close(); console.log('✅ better-sqlite3 验证成功')" 2>/dev/null; then
                echo "✅ better-sqlite3 现在可用（从临时目录加载）"

                # 返回到原目录
                cd "${COZE_WORKSPACE_PATH}/server"
                return 0
            else
                echo "❌ better-sqlite3 重新编译后仍然不可用"
                rm -rf "${tmp_dir}"
                return 1
            fi
        else
            echo "❌ better-sqlite3 重新编译失败"
            rm -rf "${tmp_dir}"
            return 1
        fi
    else
        # 文件系统可写，直接重新编译
        echo "📦 尝试重新编译 better-sqlite3..."
        if pnpm rebuild better-sqlite3; then
            echo "✅ better-sqlite3 重新编译完成"

            # 再次验证是否可用
            if node -e "const Database = require('better-sqlite3'); const db = new Database(':memory:'); db.close(); console.log('✅ better-sqlite3 验证成功')" 2>/dev/null; then
                echo "✅ better-sqlite3 现在可用"
                return 0
            else
                echo "❌ better-sqlite3 重新编译后仍然不可用"
                return 1
            fi
        else
            echo "❌ better-sqlite3 重新编译失败"
            return 1
        fi
    fi
}

start_service() {
    local port="${DEPLOY_RUN_PORT:-3000}"
    echo "Starting Static File Server on port ${port} for deploy..."

    # 使用 NODE_PATH 环境变量启动服务（如果设置了）
    if [ -n "${NODE_PATH:-}" ]; then
        echo "📌 使用自定义 NODE_PATH: ${NODE_PATH}"
        NODE_PATH="${NODE_PATH}" node dist/main.js -p "${port}"
    else
        node dist/main.js -p "${port}"
    fi
}

echo "Starting HTTP service for deploy..."

# 重新编译原生模块（如果需要）
if rebuild_native_modules; then
    echo "✅ 原生模块检查完成，启动服务..."
    start_service
else
    echo "❌ 原生模块检查失败，无法启动服务"
    exit 1
fi
