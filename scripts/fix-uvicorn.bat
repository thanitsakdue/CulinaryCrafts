@echo off
REM =================================
REM 🔧 Culinary Crafts - Fix uvicorn Issue
REM =================================

echo 🛠️ Fixing uvicorn installation issue...
echo.

REM Check if we're in the right directory
if not exist "backend" (
    echo ❌ Please run this from the CulinaryCrafts root directory
    pause
    exit /b 1
)

cd backend

REM Check virtual environment
if not exist "venv\Scripts\activate.bat" (
    echo ❌ Virtual environment not found. Creating new one...
    python -m venv venv
)

REM Activate virtual environment
echo ⚡ Activating virtual environment...
call venv\Scripts\activate.bat

REM Check current Python and pip in venv
echo 🐍 Checking Python in virtual environment...
where python
where pip

REM Upgrade pip first
echo 📦 Upgrading pip...
python -m pip install --upgrade pip setuptools wheel

REM Install uvicorn explicitly
echo 🚀 Installing uvicorn...
pip uninstall -y uvicorn
pip install "uvicorn[standard]==0.24.0"

REM Verify uvicorn installation
echo 🔍 Verifying uvicorn...
uvicorn --version

if %ERRORLEVEL% NEQ 0 (
    echo ❌ uvicorn still not working. Trying alternative...
    pip install uvicorn --force-reinstall
    uvicorn --version
)

REM Install other essential packages
echo 📚 Installing other essential packages...
pip install fastapi==0.104.1 pydantic==2.5.0 pydantic-settings==2.1.0 python-multipart==0.0.6 python-dotenv==1.0.0

REM Test uvicorn with our app
echo 🧪 Testing uvicorn with app...
echo Starting server test (will auto-stop after a few seconds)...
timeout /t 5 /nobreak >nul & taskkill /F /IM "uvicorn.exe" >nul 2>&1 &
uvicorn app.main:app --host 0.0.0.0 --port 8000 --timeout-keep-alive 0

cd ..

echo.
echo ✅ uvicorn fix completed!
echo 🛠️ Now you can start the backend with:
echo    cd backend
echo    venv\Scripts\activate.bat  
echo    uvicorn app.main:app --reload
echo.
pause