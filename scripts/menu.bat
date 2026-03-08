@echo off
REM =================================
REM 📋 Scripts Quick Reference Menu
REM =================================

:MENU
cls
echo.
echo ========================================
echo 🍳 CULINARY CRAFTS - SCRIPTS MENU
echo ========================================
echo.
echo 🚀 QUICK START OPTIONS:
echo   1) Docker Start     - Complete environment (recommended)
echo   2) Ultra Start      - Local development (your setup)
echo   3) Ultra Simple     - Fix Python 3.14 issues
echo.
echo 🔧 SETUP & INSTALLATION:
echo   4) Complete Setup   - Full environment with venv
echo   5) Fix Uvicorn      - Fix 'uvicorn not recognized'
echo   6) Simple Fix       - Manual troubleshooting
echo.
echo 🐳 DOCKER MANAGEMENT:
echo   7) Docker Start     - Start all services
echo   8) Docker Stop      - Stop all services
echo   9) Docker Logs      - View service logs
echo  10) Docker Debug     - Check service health
echo  11) Docker Fix       - Fix build issues & rebuild
echo  12) Docker Diagnose  - Advanced build debugging
echo  13) Docker Prod      - Production deployment
echo.
echo 🧪 TESTING & DOCS:
echo  14) Test API Docs    - Open enhanced Swagger docs
echo  15) Debug Services   - Check all service health
echo.
echo  16) Show Full Guide  - Complete documentation
echo   0) Exit
echo.
set /p choice="Choose option (0-16): "

if "%choice%"=="1" goto DOCKER_START
if "%choice%"=="2" goto ULTRA_START
if "%choice%"=="3" goto ULTRA_SIMPLE
if "%choice%"=="4" goto COMPLETE_SETUP
if "%choice%"=="5" goto FIX_UVICORN
if "%choice%"=="6" goto SIMPLE_FIX
if "%choice%"=="7" goto DOCKER_START_MAIN
if "%choice%"=="8" goto DOCKER_STOP
if "%choice%"=="9" goto DOCKER_LOGS
if "%choice%"=="10" goto DOCKER_DEBUG
if "%choice%"=="11" goto DOCKER_FIX
if "%choice%"=="12" goto DOCKER_DIAGNOSE
if "%choice%"=="13" goto DOCKER_PROD
if "%choice%"=="14" goto TEST_DOCS
if "%choice%"=="15" goto DEBUG_SERVICES
if "%choice%"=="16" goto SHOW_GUIDE
if "%choice%"=="0" goto EXIT

echo Invalid choice. Please try again.
timeout /t 2 /nobreak >nul
goto MENU

:DOCKER_START
echo.
echo 🐳 Starting Docker environment...
call docker-start.bat
pause
goto MENU

:ULTRA_START
echo.
echo ⚡ Starting local development...
call ultra-start.bat
pause
goto MENU

:ULTRA_SIMPLE
echo.
echo 🔧 Running Python 3.14 fix...
call ultra-simple.bat
pause
goto MENU

:COMPLETE_SETUP
echo.
echo 🎯 Running complete setup...
call complete-setup.bat
pause
goto MENU

:FIX_UVICORN
echo.
echo 🚨 Fixing uvicorn issues...
call fix-uvicorn-now.bat
pause
goto MENU

:SIMPLE_FIX
echo.
echo 🛠️ Running manual fix...
call simple-fix.bat
pause
goto MENU

:DOCKER_START_MAIN
echo.
echo 🐳 Starting Docker environment...
call docker-start.bat
pause
goto MENU

:DOCKER_STOP
echo.
echo 🛑 Stopping Docker services...
call docker-stop.bat
pause
goto MENU

:DOCKER_LOGS
echo.
echo 📋 Opening Docker logs...
call docker-logs.bat
pause
goto MENU

:DOCKER_DEBUG
echo.
echo 🔍 Checking Docker services...
call debug-services.bat
pause
goto MENU

:DOCKER_FIX
echo.
echo 🔧 Fixing Docker build issues...
call docker-fix.bat
pause
goto MENU

:DOCKER_DIAGNOSE
echo.
echo 🔍 Advanced Docker diagnostics...
call docker-debug.bat
pause
goto MENU

:DOCKER_PROD
echo.
echo 🚀 Production deployment...
call docker-prod.bat
pause
goto MENU

:TEST_DOCS
echo.
echo 📚 Testing API documentation...
call test-api-docs.bat
pause
goto MENU

:DEBUG_SERVICES
echo.
echo 🔍 Debugging all services...
call debug-services.bat
pause
goto MENU

:SHOW_GUIDE
echo.
echo 📖 Opening complete scripts guide...
echo.
echo Full documentation available at:
echo    SCRIPTS-GUIDE.md
echo.
start notepad SCRIPTS-GUIDE.md
echo.
echo Guide opened in notepad!
pause
goto MENU

:EXIT
echo.
echo 👋 Happy coding with Culinary Crafts!
echo.
pause
exit