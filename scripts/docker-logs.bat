@echo off
REM =================================
REM 📋 Docker Logs Viewer
REM =================================

echo 🍳 Culinary Crafts - Docker Logs
echo.
echo Select service to view logs:
echo 1) All services
echo 2) Backend only
echo 3) Frontend only
echo 4) Redis only
echo 5) PostgreSQL only
echo.

set /p choice="Choose (1-5): "

if "%choice%"=="1" (
    echo 📋 Viewing all logs (Ctrl+C to exit)...
    docker-compose -f docker-compose.dev.yml logs -f
) else if "%choice%"=="2" (
    echo 📋 Viewing backend logs (Ctrl+C to exit)...
    docker-compose -f docker-compose.dev.yml logs -f backend
) else if "%choice%"=="3" (
    echo 📋 Viewing frontend logs (Ctrl+C to exit)...
    docker-compose -f docker-compose.dev.yml logs -f frontend
) else if "%choice%"=="4" (
    echo 📋 Viewing Redis logs (Ctrl+C to exit)...
    docker-compose -f docker-compose.dev.yml logs -f redis
) else if "%choice%"=="5" (
    echo 📋 Viewing PostgreSQL logs (Ctrl+C to exit)...
    docker-compose -f docker-compose.dev.yml logs -f postgres
) else (
    echo ❌ Invalid choice
    pause
    exit /b 1
)