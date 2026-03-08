@echo off
REM =================================
REM 🚀 Culinary Crafts - Complete Setup & Start (Fixed)
REM Fixes all common issues and starts both servers
REM =================================

echo 🍳 Complete Setup & Start - Culinary Crafts
echo 🛠️ This will fix uvicorn and other common issues
echo.

REM Check Python
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python not found. Please install Python 3.11+ first.
    pause
    exit /b 1
)

REM Check Node
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Prerequisites OK
echo.

REM Setup environment file
if not exist .env (
    copy .env.example .env
    echo 📝 Created .env file
)

echo 🔧 Setting up Backend (with uvicorn fix)...
cd backend

REM Remove and recreate venv to fix any corruption
if exist venv (
    rmdir /s /q venv
)

REM Create fresh environment
python -m venv venv
call venv\Scripts\activate.bat

REM Upgrade tools
python -m pip install --upgrade pip setuptools wheel

REM Install packages individually to avoid conflicts
echo 📦 Installing FastAPI...
pip install fastapi==0.104.1

echo 📦 Installing uvicorn...
pip install "uvicorn[standard]==0.24.0"

echo 📦 Installing other dependencies...
pip install pydantic==2.5.0 pydantic-settings==2.1.0 python-multipart==0.0.6 python-dotenv==1.0.0

REM Test uvicorn
echo 🧪 Testing uvicorn...
uvicorn --version
if %ERRORLEVEL% NEQ 0 (
    echo ❌ uvicorn test failed, trying fix...
    pip uninstall -y uvicorn
    pip install uvicorn
)

echo ✅ Backend setup complete!
cd ..

REM Setup Frontend
echo 📱 Setting up Frontend...
cd frontend

if not exist node_modules (
    echo 📦 Installing frontend dependencies...
    npm install
)

echo ✅ Frontend setup complete!
cd ..

echo.
echo 🚀 Starting both servers...
echo.

REM Start backend in new window
echo 🐍 Starting Backend (Port 8000)...
start "🐍 Backend Server" cmd /k "cd backend && call venv\Scripts\activate.bat && echo Backend API: http://localhost:8000 && echo API Docs: http://localhost:8000/docs && echo. && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

REM Wait for backend to start
timeout /t 5 /nobreak >nul

REM Start frontend in new window  
echo ⚛️ Starting Frontend (Port 3000)...
start "⚛️ Frontend Server" cmd /k "cd frontend && echo Frontend: http://localhost:3000 && echo. && npm run dev"

REM Wait for frontend to start
timeout /t 3 /nobreak >nul

echo.
echo 🎉 Both servers are starting!
echo.
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
echo 🧪 API Test: http://localhost:3000/api-test
echo.
echo ⏰ Wait 10-15 seconds for servers to fully start
echo 🌐 Opening frontend...

timeout /t 8 /nobreak >nul
start http://localhost:3000

echo.
echo ✅ Setup complete! Both servers should be running
echo 💡 Check the opened terminal windows for any errors
echo.
pause