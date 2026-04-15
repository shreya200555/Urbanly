@echo off
chcp 65001 >nul
echo ==========================================
echo     Starting Urbanly Full-Stack App
echo ==========================================
echo.
echo [1/2] Starting Backend Server...
echo       API will be at: http://localhost:8000
echo.

REM Get current directory
set "SCRIPTDIR=%~dp0"

REM Start backend in new window
start "Urbanly Backend" cmd /k "cd /d "%SCRIPTDIR%backend" && python run_server.py"

echo [2/2] Starting Frontend Server (waiting 5s for backend)...
echo       App will be at: http://localhost:5174
echo.

REM Wait for backend to initialize
timeout /t 5 /nobreak >nul

REM Start frontend
cd /d "%SCRIPTDIR%" && npm run dev -- --port 5174
