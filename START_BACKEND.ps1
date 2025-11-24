# Backend Startup Script for PowerShell
# This script safely starts the backend with Prisma setup

# Set location to backend folder
$backendPath = "C:\Users\PC\Bookfair-stall-reservation-system-Group-Project\backend"
Set-Location $backendPath

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Bookfair Backend Startup Script" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker status..." -ForegroundColor Yellow
$dockerCheck = docker ps --filter "name=bookfair-db" --format "{{.Status}}" 2>&1
if ($dockerCheck -like "*Up*") {
    Write-Host "✓ Docker database container is running" -ForegroundColor Green
} else {
    Write-Host "✗ Docker database container is not running!" -ForegroundColor Red
    Write-Host "  Run: docker compose up -d" -ForegroundColor Yellow
    Exit 1
}

# Check if node_modules exists
Write-Host ""
Write-Host "Checking dependencies..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ npm install failed" -ForegroundColor Red
        Exit 1
    }
}
Write-Host "✓ Dependencies OK" -ForegroundColor Green

# Clear Prisma cache
Write-Host ""
Write-Host "Refreshing Prisma client..." -ForegroundColor Yellow
if (Test-Path "node_modules\.prisma") {
    Remove-Item -Path "node_modules\.prisma" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "✓ Prisma cache cleared" -ForegroundColor Green
}

# Generate Prisma client
Write-Host "Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate 2>&1 | Out-Null
Write-Host "✓ Prisma client generated" -ForegroundColor Green

# Start backend
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Starting Backend Server..." -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Backend will run on: http://localhost:5000" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop" -ForegroundColor Yellow
Write-Host ""

npm run start:dev

# If we get here, something went wrong
Write-Host ""
Write-Host "ERROR: Backend failed to start" -ForegroundColor Red
Write-Host "Check the error messages above" -ForegroundColor Yellow
Exit 1
