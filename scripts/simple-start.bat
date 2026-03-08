@echo off
REM =================================
REM 🚀 Simple Start - Manual Server Launch
REM =================================

echo 🍳 Simple Start - Culinary Crafts
echo.

REM Check if setup is done
if not exist "backend\venv\Scripts\activate.bat" (
    echo ❌ Backend not set up. Run this first:
    echo    .\scripts\simple-fix.bat
    pause
    exit /b 1
)

if not exist "frontend\node_modules" (
    echo ❌ Frontend not set up. Installing...
    cd frontend
    npm install
    cd ..
)

echo ✅ Setup verified!
echo.

echo 🚀 Starting servers...
echo.

REM Start backend in new window
echo 🐍 Starting Backend Server...
start "🐍 Backend - Port 8000" cmd /k "cd backend && call venv\Scripts\activate.bat && echo. && echo =============================================== && echo 🍳 Culinary Crafts Backend API && echo =============================================== && echo. && echo 📡 API Server: http://localhost:8000 && echo 📚 API Docs: http://localhost:8000/docs && echo 🔍 Health Check: http://localhost:8000/health && echo. && echo ⚡ Starting uvicorn... && echo. && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

echo ⏰ Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

REM Start frontend in new window  
echo ⚛️ Starting Frontend Server...
start "⚛️ Frontend - Port 3000" cmd /k "cd frontend && echo. && echo =============================================== && echo 🍳 Culinary Crafts Frontend && echo =============================================== && echo. && echo 🌐 Website: http://localhost:3000 && echo 🧪 API Test: http://localhost:3000/api-test && echo. && echo ⚡ Starting Next.js... && echo. && npm run dev"

echo ⏰ Waiting for frontend to initialize...  
timeout /t 8 /nobreak >nul

echo.
echo 🎉 Both servers should be starting!
echo.
echo 📍 URLs to check:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:8000  
echo    API Docs: http://localhost:8000/docs
echo    API Test: http://localhost:3000/api-test
echo.

echo 🌐 Opening website...
start http://localhost:3000 >nul 2>&1

echo.
echo ✅ Done! Check the opened terminal windows
echo 💡 If any server fails, check error messages in their windows
echo.
pause