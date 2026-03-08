@echo off
REM =================================
REM 🐳 Docker Development Start
REM =================================

echo 🍳 Starting Culinary Crafts with Docker (Development)
echo.

echo 📦 Building and starting all services...
echo This may take a few minutes on first run...
echo.
docker-compose -f docker-compose.dev.yml up --build -d

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Docker build failed!
    echo.
    echo 🔧 Quick fixes to try:
    echo    1. Run: .\scripts\docker-fix.bat (automatic fix)
    echo    2. Or:  .\scripts\ultra-start.bat (local development)
    echo    3. Check: docker-compose -f docker-compose.dev.yml logs
    echo.
    pause
    exit /b 1
)

echo.
echo ⏳ Waiting for services to be ready...
timeout /t 15 /nobreak >nul

echo.
echo 🎉 Services are starting up!
echo.
echo 📍 Available URLs:
echo    🌐 Frontend:    http://localhost:3000
echo    ⚡ Backend API: http://localhost:8000
echo    📚 API Docs:    http://localhost:8000/docs
echo    🔴 Redis:       localhost:6379
echo    🐘 PostgreSQL:  localhost:5432
echo    📊 Prometheus:  http://localhost:9090
echo    📈 Grafana:     http://localhost:3001 (admin/admin123)
echo    📧 MailHog:     http://localhost:8025
echo.

echo 🚀 Opening frontend in browser...
start http://localhost:3000 >nul 2>&1

echo.
echo 💡 Useful commands:
echo    docker-compose -f docker-compose.dev.yml logs -f     (view logs)
echo    docker-compose -f docker-compose.dev.yml down        (stop all)
echo    docker-compose -f docker-compose.dev.yml restart     (restart all)
echo.

pause