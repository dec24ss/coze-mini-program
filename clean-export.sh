#!/bin/bash

# 干净导出脚本 - 只导出源文件，排除构建产物和符号链接

echo "🧹 开始创建干净的导出包..."

# 创建临时目录
EXPORT_DIR="puzzle-game-clean-export"
mkdir -p "$EXPORT_DIR"

# 复制必要的源文件
echo "📦 复制源文件..."

# 配置文件
cp package.json "$EXPORT_DIR/"
cp pnpm-lock.yaml "$EXPORT_DIR/"
cp pnpm-workspace.yaml "$EXPORT_DIR/"
cp project.config.json "$EXPORT_DIR/"
cp tsconfig.json "$EXPORT_DIR/"
cp babel.config.js "$EXPORT_DIR/"
cp eslint.config.mjs "$EXPORT_DIR/"
cp stylelint.config.mjs "$EXPORT_DIR/"
cp .npmrc "$EXPORT_DIR/"
cp .env.example "$EXPORT_DIR/"

# 文档文件
cp README.md "$EXPORT_DIR/"
cp design_guidelines.md "$EXPORT_DIR/"
cp CLOUDBASE_MIGRATION.md "$EXPORT_DIR/"
cp DEPLOY_CLOUDFUNCTIONS.md "$EXPORT_DIR/"
cp QUICK_DEPLOY.md "$EXPORT_DIR/"
cp IMPORT_GUIDE.md "$EXPORT_DIR/"
cp LOCAL_DATABASE_SETUP.md "$EXPORT_DIR/"
cp SUPABASE_5MIN_SETUP.md "$EXPORT_DIR/"

# 源代码目录
cp -r src "$EXPORT_DIR/"
cp -r cloudfunctions "$EXPORT_DIR/"
cp -r public "$EXPORT_DIR/"
cp -r assets "$EXPORT_DIR/"
cp -r server "$EXPORT_DIR/"
cp -r types "$EXPORT_DIR/"

# .gitignore
cp .gitignore "$EXPORT_DIR/"

# 删除可能的符号链接（如果有的话）
echo "🔗 清理符号链接..."
find "$EXPORT_DIR" -type l -delete

# 创建压缩包
echo "📦 创建压缩包..."
tar -czf puzzle-game-clean-export.tar.gz "$EXPORT_DIR"

# 清理临时目录
rm -rf "$EXPORT_DIR"

echo ""
echo "✅ 干净导出完成！"
echo "📦 导出文件: puzzle-game-clean-export.tar.gz"
echo ""
echo "📋 包含的内容："
echo "   - src/ (源代码)"
echo "   - cloudfunctions/ (云函数)"
echo "   - server/ (后端服务)"
echo "   - public/ & assets/ (静态资源)"
echo "   - 配置文件 (package.json, tsconfig.json 等)"
echo "   - 文档文件"
echo ""
echo "❌ 已排除："
echo "   - node_modules/"
echo "   - dist/"
echo "   - dist-web/"
echo "   - 符号链接文件"
echo "   - 构建产物"
