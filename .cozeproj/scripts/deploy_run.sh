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
    
    # 尝试重新编译
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
        
        # 输出调试信息
        echo "📂 列出 node_modules 内容（前 30 行）:"
        ls -la "${COZE_WORKSPACE_PATH}/server/node_modules" 2>/dev/null | head -30 || echo "server/node_modules 不存在"
        
        echo "🔍 查找 better-sqlite3 相关目录:"
        find "${COZE_WORKSPACE_PATH}/server/node_modules" -maxdepth 2 -name "*better-sqlite3*" -type d 2>/dev/null || echo "未找到 better-sqlite3 目录"
        
        # 尝试在根目录查找
        echo "📂 列出根目录 node_modules 内容（前 30 行）:"
        ls -la "${COZE_WORKSPACE_PATH}/node_modules" 2>/dev/null | head -30 || echo "根目录 node_modules 不存在"
        
        echo "🔍 查找根目录 better-sqlite3 相关目录:"
        find "${COZE_WORKSPACE_PATH}/node_modules" -maxdepth 2 -name "*better-sqlite3*" -type d 2>/dev/null || echo "未找到 better-sqlite3 目录"
        
        # 输出 Node.js 版本信息
        echo "📌 当前 Node.js 版本:"
        node --version
        
        return 1
    fi
}

start_service() {
    local port="${DEPLOY_RUN_PORT:-3000}"
    echo "Starting Static File Server on port ${port} for deploy..."

    node dist/main.js -p "${port}"
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
