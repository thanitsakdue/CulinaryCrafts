@echo off
REM =================================
REM 🎬 Culinary Crafts Demo Script
REM =================================

echo 🍳 Welcome to Culinary Crafts - AI Cooking Assistant!
echo.
echo This demo will show you the most important scripts and features.
echo.
pause

echo ========================================
echo 📋 SCRIPTS OVERVIEW
echo ========================================
echo.
echo You have 21+ scripts available! Here are the key ones:
echo.
echo 🎯 BEGINNERS - Start here:
echo    menu.bat           - Interactive menu for all scripts
echo    ultra-start.bat    - Quick local development
echo    docker-start.bat   - Complete Docker environment
echo.
echo 🔧 PROBLEM SOLVING:
echo    ultra-simple.bat   - Fix Python 3.14 issues
echo    fix-uvicorn-now.bat - Fix uvicorn command errors
echo    debug-services.bat - Check if everything works
echo.
echo 📚 DOCUMENTATION & TESTING:
echo    test-api-docs.bat  - Enhanced Swagger API docs
echo.
pause

echo ========================================
echo 🎯 DEMO 1: Interactive Menu
echo ========================================
echo.
echo Let's try the interactive menu first...
echo.
pause

call menu.bat

echo.
echo ========================================  
echo 📚 DEMO 2: API Documentation
echo ========================================
echo.
echo Now let's check the enhanced API documentation...
echo.
echo This will:
echo   ✅ Check if backend is running
echo   🚀 Start it if needed
echo   🌐 Open comprehensive Swagger docs
echo   🧪 Test API endpoints
echo.
set /p api_demo="Demo API documentation? (y/n): "
if /i "%api_demo%"=="y" (
    call test-api-docs.bat
)

echo.
echo ========================================
echo 🐳 DEMO 3: Docker Environment
echo ========================================
echo.
echo Docker provides a complete environment with:
echo   🌐 Frontend (Next.js)
echo   ⚡ Backend (FastAPI)
echo   🔴 Redis caching
echo   🐘 PostgreSQL database
echo   📊 Prometheus metrics
echo   📈 Grafana dashboards
echo   📧 MailHog email testing
echo.
set /p docker_demo="Demo Docker environment? (y/n): "
if /i "%docker_demo%"=="y" (
    echo.
    echo 🚀 Starting Docker environment...
    echo This will take ~30 seconds...
    call docker-start.bat
    
    echo.
    echo Docker demo complete! Services available at:
    echo   🌐 Frontend: http://localhost:3000
    echo   📚 API Docs: http://localhost:8000/docs
    echo   📈 Grafana: http://localhost:3001
)

echo.
echo ========================================
echo 🎓 WHAT YOU LEARNED
echo ========================================
echo.
echo You now know about:
echo.
echo 📋 Script Organization:
echo    ✅ 21+ scripts for different purposes
echo    ✅ Interactive menu (menu.bat)
echo    ✅ Problem-specific solutions
echo.
echo 🚀 Development Options:
echo    ✅ Local development (ultra-start.bat)
echo    ✅ Docker environment (docker-start.bat)
echo    ✅ Troubleshooting scripts
echo.
echo 📚 Documentation:
echo    ✅ Enhanced Swagger API docs
echo    ✅ Comprehensive script guides
echo    ✅ Step-by-step troubleshooting
echo.
echo ========================================
echo 📖 REFERENCE DOCUMENTS
echo ========================================
echo.
echo 📄 SCRIPTS-GUIDE.md     - Complete script documentation
echo 📄 scripts/cheat-sheet.md - Quick reference
echo 📄 GITHUB-DOCKER-GUIDE.md - Git & Docker setup
echo 📄 docs/API-DOCUMENTATION.md - API reference
echo.
echo ========================================
echo 🎉 YOU'RE ALL SET!
echo ========================================
echo.
echo Daily workflow recommendations:
echo.
echo 🌅 MORNING:
echo    1. Run: menu.bat (choose your preferred setup)
echo    2. Or: ultra-start.bat (quick local dev)
echo.
echo 🔧 WHEN ISSUES ARISE:
echo    1. Run: debug-services.bat
echo    2. Check: SCRIPTS-GUIDE.md
echo    3. Try: ultra-simple.bat (for Python issues)
echo.
echo 🧪 WHEN TESTING:
echo    1. Run: test-api-docs.bat
echo    2. Visit: http://localhost:8000/docs
echo.
echo 🏢 FOR PRODUCTION:
echo    1. Follow: GITHUB-DOCKER-GUIDE.md
echo    2. Run: docker-prod.bat
echo.
echo Happy coding with your AI Cooking Assistant! 🍳🤖
echo.
pause