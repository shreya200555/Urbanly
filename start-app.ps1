#!/usr/bin/env powershell
# Urbanly Full-Stack Launcher
# Starts both frontend and backend servers

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "    Starting Urbanly Full-Stack App       " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Get the script's directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Host "[1/2] Starting Backend Server..." -ForegroundColor Yellow
Write-Host "      API will be at: http://localhost:8000" -ForegroundColor Gray

# Start backend in new window
$BackendPath = Join-Path $ScriptDir "backend\run_server.py"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$ScriptDir'; python '$BackendPath'" -WindowStyle Normal

Write-Host ""
Write-Host "[2/2] Starting Frontend Server..." -ForegroundColor Yellow
Write-Host "      App will be at: http://localhost:5174" -ForegroundColor Gray
Write-Host ""

# Give backend time to start
Start-Sleep -Seconds 3

# Start frontend
npm run dev -- --host --port 5174

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "    Both servers are running!             " -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
