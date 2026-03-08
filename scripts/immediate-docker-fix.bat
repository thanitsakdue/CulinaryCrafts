@echo off
REM =================================
REM 🚨 IMMEDIATE Docker Build Fix
REM =================================

cls  
echo.
echo ====================================================
echo 🚨 DOCKER BUILD FAILED - QUICK SOLUTIONS
echo ====================================================
echo.

echo ❌ Your Docker build failed with pip install error
echo ✅ I've created smart solutions for you!
echo.

echo 🎯 FASTEST SOLUTIONS (try these NOW):
echo.

echo 1️⃣ SMART DOCKER FIX (Try this first):
echo    .\scripts\docker-fix.bat
echo    → Uses minimal packages first, then gradually adds more
echo.

echo 2️⃣ LOCAL DEVELOPMENT (Works immediately):
echo    .\scripts\ultra-start.bat  
echo    → Bypasses Docker entirely, runs locally
echo.

echo 3️⃣ ADVANCED DEBUGGING (If #1 fails):
echo    .\scripts\docker-debug.bat
echo    → Step-by-step package testing and diagnosis
echo.

echo 4️⃣ INTERACTIVE MENU:
echo    .\scripts\menu.bat
echo    → Choose from all options with guided help
echo.

echo.
echo 🔍 ROOT CAUSE ANALYSIS:
echo    Your requirements.txt likely has packages that are:
echo    - Too heavy for quick Docker builds (Google Cloud, ML libs)
echo    - Have version conflicts or dependencies issues
echo    - Need compilation or special setup
echo.

echo 💡 THE SMART FIX:
echo    - First tries with minimal working packages
echo    - If that works, gradually adds back features
echo    - Identifies exactly which package causes issues
echo.

echo.
echo ⚡ RECOMMENDED ACTION:
set /p choice="Choose: [1] Smart Docker Fix [2] Local Dev [3] Debug [4] Menu: "

if "%choice%"=="1" goto SMART_FIX
if "%choice%"=="2" goto LOCAL_DEV  
if "%choice%"=="3" goto DEBUG_MODE
if "%choice%"=="4" goto MENU_MODE

echo Invalid choice, defaulting to Smart Fix...

:SMART_FIX
echo.
echo 🔧 Running Smart Docker Fix...
call docker-fix.bat
goto END

:LOCAL_DEV
echo.
echo 🏠 Starting Local Development...
call ultra-start.bat
goto END

:DEBUG_MODE
echo.
echo 🔍 Starting Advanced Debugging...
call docker-debug.bat
goto END

:MENU_MODE
echo.
echo 📋 Opening Interactive Menu...
call menu.bat
goto END

:END
echo.
echo 📝 What just happened?
echo    You ran one of the enhanced fix scripts I created
echo    These scripts intelligently handle Docker build issues
echo    by trying minimal setups first, then adding complexity
echo.

echo 💡 If you need help later:
echo    - All scripts are documented in SCRIPTS-GUIDE.md
echo    - Use menu.bat for guided assistance  
echo    - Docker issues are now much easier to fix!
echo.

pause