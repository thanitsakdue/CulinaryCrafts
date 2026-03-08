@echo off
REM =================================
REM 🚀 Docker Production Deployment
REM =================================

echo 🍳 Culinary Crafts - Production Deployment
echo.

REM Check if .env exists
if not exist ".env" (
    echo ❌ .env file not found!
    echo 📋 Please copy .env.example to .env and configure production values:
    echo    copy .env.example .env
    echo.
    pause
    exit /b 1
)

echo ⚠️  WARNING: This will deploy to PRODUCTION mode
set /p confirm="Continue? (y/N): "
if not "%confirm%"=="y" (
    echo Cancelled.
    pause
    exit /b 0
)

echo.
echo 📦 Building production images...
docker-compose build --no-cache

echo.
echo 🚀 Starting production services...
docker-compose up -d

echo.
echo ⏳ Waiting for services...
timeout /t 15 /nobreak >nul

echo.
echo 🎉 Production deployment complete!
echo.
echo 📍 Services:
echo    🌐 Frontend:    http://localhost:3000
echo    ⚡ Backend API: http://localhost:8000
echo    📚 API Docs:    http://localhost:8000/docs
echo.

echo 💡 Monitor with:
echo    docker-compose logs -f
echo    docker-compose ps
echo.

pause