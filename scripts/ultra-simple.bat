@echo off
REM =================================
REM 🚀 Ultra Simple - No Virtual Environment
REM For when Python 3.14 venv has issues
REM =================================

echo 🍳 Ultra Simple Setup - No venv (for Python 3.14 issues)
echo.

python --version
echo.

echo 📦 Installing packages globally (temporary fix)...
echo This installs to your system Python - not ideal but works

pip install fastapi uvicorn pydantic pydantic-settings python-multipart python-dotenv

echo.
echo 🧪 Testing uvicorn...
python -m uvicorn --version

echo.
echo 📱 Setting up frontend...
cd frontend

if not exist node_modules (
    npm install
)

cd ..

echo.
echo 🚀 To start servers:
echo.
echo Terminal 1 (Backend):
echo    cd backend  
echo    python -m uvicorn app.main:app --reload
echo.
echo Terminal 2 (Frontend):
echo    cd frontend
echo    npm run dev
echo.

echo 💡 Or run: .\scripts\ultra-start.bat
echo.
pause