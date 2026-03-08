@echo off
REM =================================
REM 🐳 Docker Development Start
REM =================================

echo 🍳 Starting Culinary Crafts with Docker (Development)
echo.

echo 📦 Building and starting all services...
docker-compose -f docker-compose.dev.yml up --build -d

echo.
echo ⏳ Waiting for services to be ready...
timeout /t 10 /nobreak >nul

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