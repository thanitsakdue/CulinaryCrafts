@echo off
REM ===============================================
REM 🔧 Quick Fix - Uvicorn Not Recognized Error  
REM ===============================================

echo 🔧 Quick Fix for 'uvicorn' is not recognized
echo.

echo 📦 Reinstalling packages correctly...
pip install --upgrade fastapi uvicorn pydantic pydantic-settings python-multipart python-dotenv

echo.
echo 🧪 Testing with Python module method...
python -m uvicorn --version

echo.
echo 🚀 Starting backend with proper command...
cd backend
echo Starting: python -m uvicorn app.main:app --reload

python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000