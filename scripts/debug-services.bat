@echo off
REM =================================
REM 🐳 Docker Services Debug Helper
REM =================================

echo 🍳 Culinary Crafts - Docker Services Status
echo.

echo 📊 Checking Docker Compose services...
docker-compose -f docker-compose.dev.yml ps

echo.
echo 🔍 Checking individual service health...

echo.
echo 🏥 Backend API (http://localhost:8000):
curl -s http://localhost:8000/health 2>nul && echo "✅ HEALTHY" || echo "❌ NOT RESPONDING"

echo.
echo 🌐 Frontend (http://localhost:3000):
curl -s -I http://localhost:3000 2>nul | find "200" >nul && echo "✅ HEALTHY" || echo "❌ NOT RESPONDING"

echo.
echo 🔴 Redis (localhost:6379):
docker exec -it culinary-redis redis-cli ping 2>nul && echo "✅ HEALTHY" || echo "❌ NOT RESPONDING"

echo.
echo 🐘 PostgreSQL (localhost:5432):
docker exec -it culinary-postgres pg_isready -U culinary_user 2>nul && echo "✅ HEALTHY" || echo "❌ NOT RESPONDING"

echo.
echo 📊 Prometheus (http://localhost:9090):
curl -s http://localhost:9090/-/healthy 2>nul && echo "✅ HEALTHY" || echo "❌ NOT RESPONDING"

echo.
echo 📈 Grafana (http://localhost:3001):
curl -s -I http://localhost:3001 2>nul | find "200" >nul && echo "✅ HEALTHY - Login: admin/admin123" || echo "❌ NOT RESPONDING"

echo.
echo 🔧 Common Issues & Fixes:
echo.
echo ❌ Grafana not working?
echo    Try: docker-compose -f docker-compose.dev.yml restart grafana
echo    Or:  docker-compose -f docker-compose.dev.yml up -d grafana
echo.
echo ❌ Backend not responding?
echo    Try: .\scripts\ultra-start.bat (local mode)
echo    Or:  docker-compose -f docker-compose.dev.yml restart backend
echo.
echo ❌ Permission denied on volumes?
echo    Try: docker-compose -f docker-compose.dev.yml down --volumes
echo    Then: .\scripts\docker-start.bat
echo.

echo 💡 Useful Commands:
echo    docker-compose -f docker-compose.dev.yml logs grafana
echo    docker-compose -f docker-compose.dev.yml restart [service]
echo    docker-compose -f docker-compose.dev.yml down --volumes
echo.

pause