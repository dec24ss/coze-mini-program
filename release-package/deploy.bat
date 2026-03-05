@echo off
chcp 65001 >nul
echo 🧩 拼图小游戏云开发部署脚本
echo ==============================

REM 检查 pnpm
echo.
echo 📦 步骤 1/5: 检查依赖...
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未找到 pnpm，请先安装: npm install -g pnpm
    exit /b 1
)
echo ✅ pnpm 已安装

REM 启用云开发
echo.
echo 🔧 步骤 2/5: 启用云开发...
if exist "src\cloudbase\index.ts" (
    powershell -Command "(Get-Content 'src\cloudbase\index.ts') -replace 'export const USE_CLOUDBASE = false', 'export const USE_CLOUDBASE = true' | Set-Content 'src\cloudbase\index.ts'"
    echo ✅ 云开发已启用
) else (
    echo ⚠️ 未找到 src\cloudbase\index.ts，跳过此步骤
)

REM 安装依赖
echo.
echo 📥 步骤 3/5: 安装依赖...
call pnpm install
if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败
    exit /b 1
)
echo ✅ 依赖安装完成

REM 构建项目
echo.
echo 🔨 步骤 4/5: 构建项目...
call pnpm build:weapp
if %errorlevel% neq 0 (
    echo ❌ 构建失败
    exit /b 1
)
echo ✅ 构建完成

echo.
echo ==============================
echo ✨ 部署准备完成！
echo.
echo 📋 下一步操作：
echo 1. 打开微信开发者工具
echo 2. 导入项目目录: %cd%\release-package
echo 3. 在 project.config.json 中修改 appid
echo 4. 开通云开发并部署云函数
echo 5. 点击"上传"提交代码
echo ==============================
pause
