@echo off
REM =================================
REM 🧪 Test Enhanced API Documentation
REM =================================

echo 🍳 Testing Culinary Crafts API Documentation
echo.

echo 🔍 Checking if backend is running...
curl -s http://localhost:8000/health >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Backend not running. Starting it now...
    echo.
    
    echo 🚀 Starting backend server...
    cd backend
    start "🐍 Backend Server" cmd /k "python -m uvicorn app.main:app --reload --port 8000"
    cd ..
    
    echo ⏳ Waiting for server to start...
    timeout /t 10 /nobreak >nul
    
    curl -s http://localhost:8000/health >nul 2>&1
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to start backend. Try running .\scripts\ultra-start.bat first
        pause
        exit /b 1
    )
)

echo ✅ Backend is running!
echo.

echo 🌐 Opening API Documentation URLs...

echo 📚 Swagger UI (Interactive):
echo    http://localhost:8000/docs
start http://localhost:8000/docs

echo.
echo 📖 ReDoc (Alternative):  
echo    http://localhost:8000/redoc
start http://localhost:8000/redoc

echo.
echo 🔧 OpenAPI Schema (JSON):
echo    http://localhost:8000/openapi.json

echo.
echo 🧪 Testing API Endpoints...

echo.
echo ⚡ Health Check:
curl -s http://localhost:8000/health | python -m json.tool

echo.
echo 🏠 API Root:
curl -s http://localhost:8000/ | python -m json.tool

echo.
echo 🤖 Chat Test:
curl -s -X POST http://localhost:8000/api/v1/chat ^
  -H "Content-Type: application/json" ^
  -d "{\"message\":\"Hello AI chef!\",\"user_id\":\"test_user\"}" | python -m json.tool

echo.
echo 🔍 Recipe Search Test:
curl -s "http://localhost:8000/api/v1/recipes?query=thai+curry&difficulty=easy" | python -m json.tool

echo.
echo 🎉 API Documentation Test Complete!
echo.
echo 📋 What to Check:
echo    ✅ Swagger UI should show comprehensive API docs at /docs
echo    ✅ All endpoints should have detailed descriptions
echo    ✅ Request/Response models should be clearly defined
echo    ✅ Examples should be provided for each endpoint
echo    ✅ Tags should organize endpoints logically
echo.

pause