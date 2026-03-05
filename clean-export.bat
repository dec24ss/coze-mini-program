@echo off
REM 干净导出脚本 - Windows 版本

echo 🧹 开始创建干净的导出包...

REM 创建临时目录
set EXPORT_DIR=puzzle-game-clean-export
if exist %EXPORT_DIR% rmdir /s /q %EXPORT_DIR%
mkdir %EXPORT_DIR%

REM 复制必要的源文件
echo 📦 复制源文件...

REM 配置文件
copy package.json %EXPORT_DIR%\
copy pnpm-lock.yaml %EXPORT_DIR%\
copy pnpm-workspace.yaml %EXPORT_DIR%\
copy project.config.json %EXPORT_DIR%\
copy tsconfig.json %EXPORT_DIR%\
copy babel.config.js %EXPORT_DIR%\
copy eslint.config.mjs %EXPORT_DIR%\
copy stylelint.config.mjs %EXPORT_DIR%\
copy .npmrc %EXPORT_DIR%\
copy .env.example %EXPORT_DIR%\

REM 文档文件
copy README.md %EXPORT_DIR%\
copy design_guidelines.md %EXPORT_DIR%\
copy CLOUDBASE_MIGRATION.md %EXPORT_DIR%\
copy DEPLOY_CLOUDFUNCTIONS.md %EXPORT_DIR%\
copy QUICK_DEPLOY.md %EXPORT_DIR%\
copy IMPORT_GUIDE.md %EXPORT_DIR%\
copy LOCAL_DATABASE_SETUP.md %EXPORT_DIR%\
copy SUPABASE_5MIN_SETUP.md %EXPORT_DIR%\

REM 源代码目录
xcopy /e /i /y src %EXPORT_DIR%\src
xcopy /e /i /y cloudfunctions %EXPORT_DIR%\cloudfunctions
xcopy /e /i /y public %EXPORT_DIR%\public
xcopy /e /i /y assets %EXPORT_DIR%\assets
xcopy /e /i /y server %EXPORT_DIR%\server
xcopy /e /i /y types %EXPORT_DIR%\types

REM .gitignore
copy .gitignore %EXPORT_DIR%\

echo ✅ 文件复制完成！
echo 📦 导出目录: %EXPORT_DIR%
echo.
echo 请使用压缩工具将 %EXPORT_DIR% 文件夹打包为 zip 或 tar.gz
echo.
pause
