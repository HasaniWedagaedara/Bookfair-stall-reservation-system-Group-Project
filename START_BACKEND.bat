@echo off
REM Start Backend - Complete Setup Script
REM This script regenerates Prisma and starts the backend

cd /d "C:\Users\PC\Bookfair-stall-reservation-system-Group-Project\backend"

echo ============================================
echo Bookfair Backend Startup Script
echo ============================================
echo.

REM Check if node_modules exists
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: npm install failed
        pause
        exit /b 1
    )
)

echo.
echo Checking Prisma client...
REM Ensure Prisma client is generated
call npx prisma generate
if errorlevel 1 (
    echo WARNING: Prisma generate had issues, but continuing...
)

echo.
echo ============================================
echo Starting Backend Server...
echo ============================================
echo Backend will run on: http://localhost:5000
echo Press Ctrl+C to stop
echo.

REM Start the dev server
call npm run start:dev

REM If we get here, something went wrong
echo.
echo ERROR: Backend failed to start
pause
exit /b 1
