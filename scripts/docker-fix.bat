@echo off
REM =================================
REM 🔧 Docker Build Fix & Recovery
REM =================================

echo 🚨 Docker Build Recovery Tool
echo.
echo This script will fix common Docker build issues:
echo   ✅ Clean up failed builds
echo   ✅ Remove problematic images  
echo   ✅ Try minimal requirements first
echo   ✅ Clear Docker cache
echo   ✅ Rebuild from scratch
echo.

set /p confirm="Continue with Docker cleanup and rebuild? (y/n): "
if not "%confirm%"=="y" (
    echo Cancelled.
    pause
    exit /b 0
)

echo.
echo 🧹 Step 1: Stopping and removing existing containers...
docker-compose -f docker-compose.dev.yml down --volumes --remove-orphans

echo.
echo 🗑️ Step 2: Removing old images...
docker image prune -f
docker system prune -f

echo.
echo 🏗️ Step 3: Removing specific images if they exist...
docker rmi culinary-crafts-backend culinary-crafts-frontend 2>nul || echo "Images already removed or don't exist"

echo.
echo 📦 Step 4: Smart Requirements Check...
if exist "backend\requirements.txt" (
    echo ✅ Backend requirements.txt found
    echo 🔍 Checking for problematic packages...
    
    REM Create backup
    if not exist "backend\requirements-full.txt" (
        copy backend\requirements.txt backend\requirements-full.txt >nul
        echo ✅ Created backup of full requirements
    )
    
    REM Check for heavy packages that might cause issues
    findstr /i "google-cloud\|tensorflow\|torch\|scipy" backend\requirements.txt >nul && (
        echo ⚠️  Heavy packages detected - trying minimal build first
        set use_minimal=1
    ) || (
        echo ✅ No obviously problematic packages found
        set use_minimal=0
    )
) else (
    echo ❌ Backend requirements.txt not found!
    set use_minimal=1
)

if "%use_minimal%"=="1" (
    echo.
    echo 🎯 Step 5: Trying MINIMAL requirements first...
    if exist "backend\requirements-minimal.txt" (
        copy backend\requirements-minimal.txt backend\requirements.txt >nul
        echo ✅ Using minimal requirements for initial test
    )
)

echo.
echo 🛠️ Step 6: Building Backend with Smart Strategy...
echo This may take 2-5 minutes...
docker-compose -f docker-compose.dev.yml build --no-cache backend

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ Backend build successful!
    
    echo 🛠️ Step 7: Building Frontend...
    docker-compose -f docker-compose.dev.yml build --no-cache frontend
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo 🎉 All builds successful! Starting services...
        docker-compose -f docker-compose.dev.yml up -d
        
        echo.
        echo ⏳ Waiting for services to be ready...
        timeout /t 15 /nobreak >nul
        
        echo.
        echo 🎉 Recovery complete! Services should be running:
        echo    🌐 Frontend: http://localhost:3000
        echo    ⚡ Backend:  http://localhost:8000
        echo    📚 Docs:     http://localhost:8000/docs
        
        if "%use_minimal%"=="1" (
            echo.
            echo ⚠️  NOTE: Using MINIMAL package setup for stability
            echo 💡 To restore full features:
            echo    1. Test basic functionality first
            echo    2. Copy backend\requirements-full.txt to requirements.txt  
            echo    3. Gradually add packages and rebuild to identify issues
        )
        
        echo.
        echo 🧪 Testing services...
        curl -s http://localhost:8000/health >nul 2>&1 && echo "✅ Backend: HEALTHY" || echo "❌ Backend: NOT RESPONDING"
        curl -s -I http://localhost:3000 >nul 2>&1 && echo "✅ Frontend: HEALTHY" || echo "❌ Frontend: NOT RESPONDING"
        
        echo.
        echo 🚀 Opening frontend...
        start http://localhost:3000 >nul 2>&1
        
    ) else (
        echo ❌ Frontend build failed - but backend works!
        echo 💡 Try: .\scripts\ultra-start.bat for backend + manual frontend
    )
    
) else (
    echo.
    echo ❌ Backend build still failed. Running advanced diagnostics...
    echo.
    .\scripts\docker-debug.bat
)

echo.
pause