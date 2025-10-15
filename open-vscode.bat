@echo off
REM 批处理脚本：使用 VS Code 打开 grb_web 和 grb_api 项目
REM 用法: open-vscode.bat
REM 自动打开 grb_web 和 grb_api 两个项目

REM 设置代码页为UTF-8，解决中文乱码问题
chcp 65001 >nul

setlocal enabledelayedexpansion

REM 定义项目路径
set "GRB_WEB_PATH=E:\grb\grb_web"
set "GRB_API_PATH=E:\grb\grb_api"

echo Checking project paths...

REM 检查 grb_web 项目路径是否存在
if not exist "!GRB_WEB_PATH!" (
    echo Error: grb_web path '!GRB_WEB_PATH!' does not exist!
    pause
    exit /b 1
)

REM 检查 grb_api 项目路径是否存在
if not exist "!GRB_API_PATH!" (
    echo Error: grb_api path '!GRB_API_PATH!' does not exist!
    pause
    exit /b 1
)

REM 检查 VS Code 是否安装
where code >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: VS Code is not installed or not added to PATH!
    echo Please make sure VS Code is installed and 'code' command is accessible
    pause
    exit /b 1
)

echo Opening projects with VS Code...
echo.

REM 使用异步方式打开 grb_web 项目，避免阻塞
echo [1/2] Opening grb_web project: !GRB_WEB_PATH!
start /b "" code "!GRB_WEB_PATH!" >nul 2>&1

REM 使用异步方式打开 grb_api 项目（新窗口）
echo [2/2] Opening grb_api project: !GRB_API_PATH!
start /b "" code -n "!GRB_API_PATH!" >nul 2>&1

echo.
echo Successfully opened both projects:
echo   - grb_web: !GRB_WEB_PATH!
echo   - grb_api: !GRB_API_PATH!
echo.
echo Both projects are now open in VS Code!
echo Window will close in 2 seconds...

REM 等待2秒然后自动关闭
timeout /t 2 /nobreak >nul

REM 强制关闭当前窗口
start /b "" cmd /c exit