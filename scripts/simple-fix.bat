@echo off
REM =================================
REM 🚀 Culinary Crafts - Simple Fix (No pip upgrade issues)
REM Compatible with Python 3.14 and other versions
REM =================================

echo 🍳 Simple Fix - Culinary Crafts (Python 3.14 Compatible)
echo.

REM Check Python
python --version
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python not found
    pause
    exit /b 1
)

REM Check Node
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found  
    pause
    exit /b 1
)

echo ✅ Prerequisites OK
echo.

REM Setup environment file
if not exist .env (
    copy .env.example .env >nul 2>&1
    if exist .env (
        echo 📝 Created .env file
    )
)

echo 🔧 Setting up Backend (Simple method)...
cd backend

REM Remove old venv if exists
if exist venv (
    echo 🗑️ Removing old virtual environment...
    rmdir /s /q venv >nul 2>&1
)

REM Create venv WITHOUT pip (avoids ensurepip issues)
echo 📦 Creating virtual environment (no-pip method)...
python -m venv venv --without-pip

REM Manual activation and pip installation
echo ⚡ Activating environment...
call venv\Scripts\activate.bat

REM Get pip manually to avoid ensurepip issues
echo 📥 Installing pip manually...
python -m ensurepip --default-pip >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo 💡 Alternative pip installation...
    curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py >nul 2>&1
    if exist get-pip.py (
        python get-pip.py
        del get-pip.py
    )
)

REM Verify pip works
pip --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Pip installation failed. Trying alternative...
    python -c "import subprocess; subprocess.call(['python', '-m', 'ensurepip', '--upgrade'])"
)

echo 📚 Installing essential packages...
pip install fastapi
pip install uvicorn
pip install pydantic
pip install pydantic-settings
pip install python-multipart
pip install python-dotenv

echo 🧪 Testing uvicorn...
uvicorn --version
if %ERRORLEVEL% NEQ 0 (
    echo ❌ uvicorn not working. Manual installation...
    python -m pip install uvicorn --no-cache-dir
)

echo ✅ Backend setup complete!
cd ..

echo 📱 Setting up Frontend...
cd frontend

if not exist node_modules (
    echo 📦 Installing frontend packages...
    npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ npm install failed, trying with --legacy-peer-deps
        npm install --legacy-peer-deps
    )
)

echo ✅ Frontend setup complete!
cd ..

echo.
echo 🚀 Starting servers manually...
echo.

echo 🛠️ To start Backend (run in separate terminal):
echo    cd backend
echo    venv\Scripts\activate.bat
echo    uvicorn app.main:app --reload
echo.
echo 🛠️ To start Frontend (run in separate terminal):
echo    cd frontend  
echo    npm run dev
echo.

echo 💡 Or try the auto-start version:
echo    .\scripts\simple-start.bat
echo.

pause