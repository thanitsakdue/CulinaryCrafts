@echo off
REM =================================
REM 🚀 Culinary Crafts - Quick Fix Setup (Windows)
REM Handles venv corruption and dependency issues  
REM =================================

echo 🍳 Quick Fix Setup - Culinary Crafts 
echo.

REM Check Python
python --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python not found. Please install Python 3.11+ first.
    pause
    exit /b 1
)

echo ✅ Python found
echo.

REM Setup environment
if not exist .env (
    copy .env.example .env
    echo 📝 Created .env file
)

echo ⚙️ Setting up backend...
cd backend

REM Remove old venv
if exist venv (
    echo 🗑️ Removing old virtual environment...
    rmdir /s /q venv
)

REM Create fresh venv
echo 📦 Creating fresh virtual environment...
python -m venv venv

REM Activate and upgrade core tools
echo ⚡ Upgrading core tools...
call venv\Scripts\activate.bat
python -m pip install --upgrade pip setuptools wheel

REM Install essential packages with explicit uvicorn
echo 📚 Installing essential packages (including uvicorn)...
pip install fastapi==0.104.1
pip install "uvicorn[standard]==0.24.0"
pip install pydantic==2.5.0 pydantic-settings==2.1.0 python-multipart==0.0.6 python-dotenv==1.0.0

REM Verify uvicorn installation
echo 🔍 Verifying uvicorn installation...
uvicorn --version
if %ERRORLEVEL% NEQ 0 (
    echo ❌ uvicorn installation failed. Trying alternative method...
    pip install uvicorn
    uvicorn --version
)

echo.
echo ✅ Basic backend setup complete!
echo 🔧 Starting backend server...
echo.

REM Start backend
start "Backend Server" cmd /k "call venv\Scripts\activate.bat && echo Backend starting at http://localhost:8000 && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"

cd ..

echo.
echo 🎉 Backend is starting!
echo 📱 Backend API: http://localhost:8000
echo 📚 API Docs: http://localhost:8000/docs
echo.
echo 💡 To install AI packages later:
echo    cd backend
echo    venv\Scripts\activate.bat
echo    pip install -r requirements-ai.txt
echo.
pause