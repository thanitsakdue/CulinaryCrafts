@echo off
REM =================================
REM 🚀 Ultra Start - No venv version
REM =================================

echo 🍳 Ultra Start - Culinary Crafts (No venv)
echo.

REM Test if packages are installed
python -c "import fastapi, uvicorn" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Packages not installed. Run this first:
    echo    .\scripts\ultra-simple.bat
    pause
    exit /b 1
)

echo ✅ Packages verified!
echo.

REM Check frontend
if not exist "frontend\node_modules" (
    echo 📦 Installing frontend packages...
    cd frontend
    npm install
    cd ..
)

echo 🚀 Starting servers...
echo.

REM Start backend (no venv)
start "🐍 Backend (No venv)" cmd /k "cd backend && echo. && echo =============================================== && echo 🍳 Backend API (No Virtual Environment) && echo =============================================== && echo. && echo 📡 Server: http://localhost:8000 && echo 📚 Docs: http://localhost:8000/docs && echo. && python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

timeout /t 5 /nobreak >nul

REM Start frontend
start "⚛️ Frontend" cmd /k "cd frontend && echo. && echo =============================================== && echo 🍳 Frontend Website && echo =============================================== && echo. && echo 🌐 Website: http://localhost:3000 && echo. && npm run dev"

timeout /t 5 /nobreak >nul

echo.  
echo 🎉 Both servers starting!
echo.
echo 📍 Check these URLs:
echo    http://localhost:3000 (Frontend)
echo    http://localhost:8000 (Backend API)
echo    http://localhost:8000/docs (API Documentation)
echo.

start http://localhost:3000 >nul 2>&1

echo ✅ Done! 
pause