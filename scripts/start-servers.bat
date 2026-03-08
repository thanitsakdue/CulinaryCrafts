@echo off
REM =================================
REM 🚀 Culinary Crafts - Start Servers (Fixed)
REM =================================

echo 🍳 Starting Culinary Crafts Development Servers...
echo.

REM Check if we're in the right directory
if not exist "backend" (
    echo ❌ Please run this from the CulinaryCrafts root directory
    pause
    exit /b 1
)

if not exist "frontend" (
    echo ❌ Frontend directory not found
    pause  
    exit /b 1
)

echo ✅ Project structure verified!
echo.

REM Start backend server
echo 🔧 Starting Python Backend (Port 8000)...
cd backend

if not exist "venv\Scripts\activate.bat" (
    echo ❌ Virtual environment not found. Please run setup first.
    echo 💡 Run: .\scripts\quick-fix.bat
    cd ..
    pause
    exit /b 1
)

start "🐍 Backend Server" cmd /k "call venv\Scripts\activate.bat && echo Backend starting at http://localhost:8000 && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

cd ..

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend server  
echo 📱 Starting Next.js Frontend (Port 3000)...
cd frontend

REM Check if node_modules exists
if not exist "node_modules" (
    echo 📦 Installing frontend dependencies...
    npm install
)

start "⚛️ Frontend Server" cmd /k "echo Frontend starting at http://localhost:3000 && npm run dev"

cd ..

echo.
echo 🎉 Servers are starting!
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8000  
echo 📚 API Docs: http://localhost:8000/docs
echo.
echo ⏰ Wait 10-15 seconds for servers to fully start
echo.
echo 🌐 Opening frontend in browser...
timeout /t 5 /nobreak >nul
start http://localhost:3000

echo.
echo ✅ Both servers should be running now!
echo 💡 Check the opened terminal windows for any error messages
echo.
pause