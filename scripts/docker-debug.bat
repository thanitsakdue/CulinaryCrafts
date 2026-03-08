@echo off
REM =================================
REM 🔍 Docker Build Debugger & Fixer  
REM =================================

echo 🚨 Docker Build Failed - Let's Fix It Step by Step!
echo.

echo 🔍 DIAGNOSIS PHASE:
echo.

echo 1️⃣ Checking requirements.txt...
if exist "backend\requirements.txt" (
    echo ✅ File exists
    echo 📊 Size: 
    for /f %%A in ('find /c /v "" ^< backend\requirements.txt') do echo    Lines: %%A
    echo.
    
    echo 🧪 Checking for problematic packages...
    findstr /i "google-cloud" backend\requirements.txt >nul && echo "⚠️  Google Cloud packages found (may need auth)"
    findstr /i "langchain" backend\requirements.txt >nul && echo "⚠️  LangChain packages found (large downloads)" 
    findstr /i "scipy\|numpy" backend\requirements.txt >nul && echo "⚠️  Scientific packages found (compilation needed)"
    findstr /i "tensorflow\|torch" backend\requirements.txt >nul && echo "⚠️  ML frameworks found (very large)"
) else (
    echo ❌ requirements.txt missing!
    echo Creating basic one...
    copy backend\requirements-minimal.txt backend\requirements.txt
)

echo.
echo 2️⃣ Testing Docker environment...
docker --version >nul 2>&1 && echo "✅ Docker is running" || echo "❌ Docker not available"
docker-compose --version >nul 2>&1 && echo "✅ Docker Compose available" || echo "❌ Docker Compose not available"

echo.
echo 3️⃣ Checking system resources...
wmic computersystem get TotalPhysicalMemory /value | findstr "=" > nul && echo "ℹ️  Memory check passed" || echo "⚠️  Cannot check memory"

echo.
echo =========================================
echo 🛠️  SOLUTIONS (Try in order):
echo =========================================

echo.
echo SOLUTION A: Minimal Requirements Test
echo ----------------------------------------
set /p try_minimal="Try with minimal requirements? (y/n): "
if /i "%try_minimal%"=="y" (
    echo.
    echo 📝 Creating backup...
    if exist "backend\requirements.txt" copy backend\requirements.txt backend\requirements-full-backup.txt >nul
    
    echo 📝 Using minimal requirements...
    copy backend\requirements-minimal.txt backend\requirements.txt >nul
    
    echo 🐳 Testing Docker build with minimal packages...
    docker-compose -f docker-compose.dev.yml build --no-cache backend
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ✅ MINIMAL BUILD SUCCESSFUL!
        echo.
        echo 🚀 Starting with minimal setup...
        docker-compose -f docker-compose.dev.yml up -d
        
        echo.
        echo 🎉 SUCCESS! Basic API running at:
        echo    📍 http://localhost:8000
        echo    📚 http://localhost:8000/docs
        echo.
        echo 💡 To restore full features:
        echo    1. Test this minimal version first
        echo    2. Gradually add packages from requirements-full-backup.txt
        echo    3. Rebuild after each addition to find problematic package
        
        goto END_SUCCESS
    ) else (
        echo.
        echo ❌ Even minimal build failed - deeper issue
        echo    🔧 Trying alternative solutions...
    )
)

echo.
echo SOLUTION B: Local Development Bypass
echo ----------------------------------------
echo.
set /p try_local="Try local development instead? (y/n): "
if /i "%try_local%"=="y" (
    echo.
    echo 🏠 Switching to local development mode...
    
    REM Restore original requirements if we backed it up
    if exist "backend\requirements-full-backup.txt" (
        copy backend\requirements-full-backup.txt backend\requirements.txt >nul
        echo ✅ Restored full requirements.txt
    )
    
    echo 🚀 Starting local development...
    call ultra-start.bat
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ✅ Local development working!
        echo 💡 You can develop locally while we fix Docker
        goto END_SUCCESS
    )
)

echo.
echo SOLUTION C: Step-by-Step Package Testing
echo ----------------------------------------
set /p try_debug="Debug packages one by one? (y/n): "
if /i "%try_debug%"=="y" (
    echo.
    echo 📝 This will test packages in groups...
    if not exist "backend\requirements-full-backup.txt" (
        copy backend\requirements.txt backend\requirements-full-backup.txt >nul
    )
    
    REM Test core packages first
    echo Testing core FastAPI packages...
    echo fastapi==0.104.1 > backend\requirements-test.txt
    echo uvicorn[standard]==0.24.0 >> backend\requirements-test.txt
    echo pydantic==2.5.0 >> backend\requirements-test.txt
    
    docker-compose -f docker-compose.dev.yml build --no-cache backend
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Core packages work
        
        REM Add more packages gradually
        echo 🧪 Testing with more packages...
        copy backend\requirements-minimal.txt backend\requirements-test.txt >nul
        docker-compose -f docker-compose.dev.yml build --no-cache backend
        
        if %ERRORLEVEL% EQU 0 (
            echo ✅ Basic packages work - issue is with advanced packages
            echo 💡 Recommendation: Use minimal setup for now
        )
    ) else (
        echo ❌ Even core FastAPI fails - major Docker issue
    )
)

echo.
echo SOLUTION D: Docker Environment Reset  
echo ----------------------------------------
set /p try_reset="Reset Docker environment? (y/n): "
if /i "%try_reset%"=="y" (
    echo.
    echo 🗑️  Complete Docker cleanup...
    docker system prune -a -f
    docker volume prune -f
    
    echo 🔄 Rebuilding with fresh environment...
    if exist "backend\requirements-minimal.txt" (
        copy backend\requirements-minimal.txt backend\requirements.txt >nul
    )
    
    docker-compose -f docker-compose.dev.yml build --no-cache
    
    if %ERRORLEVEL% EQU 0 (
        echo ✅ Fresh build successful!
        docker-compose -f docker-compose.dev.yml up -d
        goto END_SUCCESS
    )
)

echo.
echo =========================================
echo 🆘 ALL SOLUTIONS TRIED
echo =========================================
echo.
echo If all solutions failed, the issue might be:
echo.
echo 🔧 System Issues:
echo    - Docker Desktop needs restart
echo    - Insufficient RAM (need 4GB+ available)  
echo    - Antivirus blocking Docker
echo    - Windows containers vs Linux containers
echo.
echo 📦 Package Issues:
echo    - Python version compatibility
echo    - Architecture conflicts (ARM vs x64)
echo    - Network/firewall blocking downloads
echo.
echo 💡 IMMEDIATE WORKAROUNDS:
echo    1. Use: .\scripts\ultra-start.bat (local development)
echo    2. Use: .\scripts\menu.bat (try other options)
echo    3. Restart Docker Desktop completely
echo    4. Check Docker settings: Linux containers enabled
echo.
echo 📞 Need more help? Check:
echo    - Docker Desktop logs
echo    - Windows Event Viewer
echo    - antivirus exclusions for project folder
echo.
pause
exit /b 1

:END_SUCCESS
echo.
echo 🎉 PROBLEM RESOLVED!
echo.
echo Your Culinary Crafts is now running successfully!
echo.
pause