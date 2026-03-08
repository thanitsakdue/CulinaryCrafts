@echo off
REM =================================
REM 🚀 Culinary Crafts Development Setup (Windows)
REM =================================

echo 🍳 Setting up Culinary Crafts development environment...

REM Check prerequisites
echo 📋 Checking prerequisites...

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python is not installed. Please install Python 3.11+ first.
    exit /b 1
)

where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Docker is not installed. Please install Docker first.
    exit /b 1
)

echo ✅ All prerequisites are met!

REM Setup environment variables
echo ⚙️ Setting up environment variables...

if not exist .env (
    copy .env.example .env
    echo 📝 Created .env file from .env.example
    echo 🚨 Please edit .env file with your actual API keys and configuration!
) else (
    echo 📁 .env file already exists
)

REM Setup backend Python environment
echo 🐍 Setting up Python backend...

cd backend

REM Create virtual environment
if not exist venv (
    python -m venv venv
    echo 📦 Created Python virtual environment
)

REM Activate virtual environment
call venv\Scripts\activate.bat

REM Upgrade pip
python -m pip install --upgrade pip

REM Install dependencies
pip install -r requirements.txt
echo 📚 Installed Python dependencies

cd ..

REM Setup frontend Node.js environment  
echo 📱 Setting up Next.js frontend...

cd frontend

REM Install dependencies
npm install
echo 📦 Installed Node.js dependencies

cd ..

REM Start development services
echo 🚀 Starting development services...

REM Start Redis and other supporting services with Docker Compose
if exist docker-compose.dev.yml (
    docker-compose -f docker-compose.dev.yml up -d
    echo 🐳 Started supporting services (Redis, etc.)
)

REM Start backend
echo 🔧 Starting Python backend...
start "Backend Server" cmd /k "cd backend && call venv\Scripts\activate.bat && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

REM Start frontend
echo 💻 Starting Next.js frontend...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo 🎉 Development servers are starting!
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8000  
echo 📚 API Docs: http://localhost:8000/docs
echo.
echo Press any key to stop all services and exit...
pause >nul

REM Cleanup
echo 🧹 Stopping services...
docker-compose -f docker-compose.dev.yml down
taskkill /F /IM "uvicorn.exe" 2>nul
taskkill /F /IM "node.exe" 2>nul
echo ✅ All services stopped.