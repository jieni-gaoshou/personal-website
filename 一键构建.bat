@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo ==============================================
echo   🚀 ASTRO BLOG - 一键安装 & 构建脚本
echo ==============================================
echo.

:: Check if Node.js is already installed (global)
where node >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ 检测到 Node.js 已安装
    node --version
    goto :build
)

:: Check common Node.js install paths
set "NODE_PATHS=C:\Program Files\nodejs;C:\Program Files (x86)\nodejs;%APPDATA%\nvm;%USERPROFILE%\AppData\Roaming\nvm"
for %%p in ("C:\Program Files\nodejs" "C:\Program Files (x86)\nodejs") do (
    if exist %%p\node.exe (
        set "PATH=%%p;%PATH%"
        echo ✅ 找到 Node.js: %%p
        goto :build
    )
)

:: Try using winget to install Node.js
where winget >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo 📦 正在通过 winget 安装 Node.js...
    winget install -e --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Node.js 安装成功！请重新打开终端运行此脚本。
        echo    （安装后需刷新 PATH 环境变量）
        pause
        exit /b 0
    )
)

:: If no winget, try downloading
echo ⚠️  未找到 Node.js，正在下载...
set "NODE_URL=https://nodejs.org/dist/v20.19.0/node-v20.19.0-win-x64.zip"
set "NODE_ZIP=%TEMP%\node-v20.19.0-win-x64.zip"
set "NODE_DIR=%USERPROFILE%\.nodejs"

if not exist "%NODE_DIR%" mkdir "%NODE_DIR%"

powershell -Command "Invoke-WebRequest -Uri '%NODE_URL%' -OutFile '%NODE_ZIP%'" 2>nul
if %ERRORLEVEL% NEQ 0 (
    :: Try curl as fallback
    curl -L -o "%NODE_ZIP%" "%NODE_URL%" 2>nul
)

if exist "%NODE_ZIP%" (
    echo 📦 正在解压 Node.js...
    powershell -Command "Expand-Archive -Path '%NODE_ZIP%' -DestinationPath '%NODE_DIR%' -Force"
    del "%NODE_ZIP%"
    set "PATH=%NODE_DIR%\node-v20.19.0-win-x64;%PATH%"
    echo ✅ Node.js 已安装到 %NODE_DIR%
    goto :build
)

echo ❌ 无法安装 Node.js。请手动从 https://nodejs.org 安装后重试。
pause
exit /b 1

:build
echo.
echo [1/3] 安装项目依赖...
call npm install --legacy-peer-deps
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 依赖安装失败！请检查网络连接。
    pause
    exit /b 1
)
echo ✅ 依赖安装完成

echo.
echo [2/3] 构建项目...
call npx vite build
if %ERRORLEVEL% NEQ 0 (
    echo ⚠️  vite build 失败，尝试备用方案...
    call npm run build
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ 构建失败！
        pause
        exit /b 1
    )
)
echo ✅ 构建完成

echo.
echo [3/3] 构建产物位于 dist 目录
echo.

if exist "dist\index.html" (
    echo ==============================================
    echo   ✅ 构建成功！
    echo   请回到 CodeBuddy 告诉我，我来部署上线！
    echo ==============================================
) else (
    echo ⚠️  未找到 dist\index.html，构建可能不完整
)

pause
exit /b 0
