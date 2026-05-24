@echo off
chcp 65001 >nul
echo ========================================
echo   ASTRO BLOG - 构建部署脚本
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 安装依赖...
call npm install --legacy-peer-deps
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 依赖安装失败！
    pause
    exit /b 1
)
echo ✅ 依赖安装完成
echo.

echo [2/3] 构建项目...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 构建失败！
    pause
    exit /b 1
)
echo ✅ 构建完成
echo.

echo [3/3] 部署到 CloudBase...
echo 请回到 CodeBuddy 告诉我构建完成，我来帮你上传部署！
echo.

echo ========================================
echo   构建成功！dist 目录已生成
echo ========================================
pause
