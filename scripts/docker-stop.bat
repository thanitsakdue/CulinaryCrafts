@echo off
REM =================================
REM 🐳 Docker Development Stop
REM =================================

echo 🍳 Stopping Culinary Crafts Docker services...
echo.

docker-compose -f docker-compose.dev.yml down

echo.
echo ✅ All services stopped!
echo.

echo 🧹 Clean up? (removes containers, networks, images)
set /p cleanup="Remove everything? (y/N): "
if /i "%cleanup%"=="y" (
    echo 🧹 Cleaning up...
    docker-compose -f docker-compose.dev.yml down --volumes --rmi all
    echo ✅ Cleanup complete!
) else (
    echo 💾 Keeping data and images
)

echo.
pause