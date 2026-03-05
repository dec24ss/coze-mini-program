#!/bin/bash

# 拼图小游戏 - 云开发部署脚本
# 用法: ./deploy.sh

echo "🧩 拼图小游戏云开发部署脚本"
echo "=============================="

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查 pnpm
echo ""
echo "📦 步骤 1/5: 检查依赖..."
if ! command -v pnpm &> /dev/null; then
    echo "${RED}❌ 未找到 pnpm，请先安装: npm install -g pnpm${NC}"
    exit 1
fi
echo "${GREEN}✅ pnpm 已安装${NC}"

# 启用云开发
echo ""
echo "🔧 步骤 2/5: 启用云开发..."
if [ -f "src/cloudbase/index.ts" ]; then
    sed -i 's/export const USE_CLOUDBASE = false/export const USE_CLOUDBASE = true/' src/cloudbase/index.ts
    echo "${GREEN}✅ 云开发已启用${NC}"
else
    echo "${YELLOW}⚠️  未找到 src/cloudbase/index.ts，跳过此步骤${NC}"
fi

# 安装依赖
echo ""
echo "📥 步骤 3/5: 安装依赖..."
pnpm install
if [ $? -ne 0 ]; then
    echo "${RED}❌ 依赖安装失败${NC}"
    exit 1
fi
echo "${GREEN}✅ 依赖安装完成${NC}"

# 构建项目
echo ""
echo "🔨 步骤 4/5: 构建项目..."
pnpm build:weapp
if [ $? -ne 0 ]; then
    echo "${RED}❌ 构建失败${NC}"
    exit 1
fi
echo "${GREEN}✅ 构建完成${NC}"

# 复制构建结果到 dist
echo ""
echo "📋 步骤 5/5: 整理文件..."
if [ -d "dist" ]; then
    cp -r dist/* release-package/dist/ 2>/dev/null || true
    echo "${GREEN}✅ 文件整理完成${NC}"
fi

echo ""
echo "=============================="
echo "${GREEN}✨ 部署准备完成！${NC}"
echo ""
echo "📋 下一步操作："
echo "1. 打开微信开发者工具"
echo "2. 导入项目目录: $(pwd)/release-package"
echo "3. 在 project.config.json 中修改 appid"
echo "4. 开通云开发并部署云函数"
echo "5. 点击'上传'提交代码"
echo "=============================="
