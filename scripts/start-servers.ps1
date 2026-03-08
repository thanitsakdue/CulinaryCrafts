# =================================
# 🚀 Culinary Crafts - Start Servers (PowerShell)  
# =================================

Write-Host "🍳 Starting Culinary Crafts Development Servers..." -ForegroundColor Green
Write-Host ""

# Check directories
if (!(Test-Path "backend") -or !(Test-Path "frontend")) {
    Write-Host "❌ Please run this from the CulinaryCrafts root directory" -ForegroundColor Red
    Read-Host "Press Enter to exit..."
    exit 1
}

Write-Host "✅ Project structure verified!" -ForegroundColor Green
Write-Host ""

# Start backend
Write-Host "🔧 Starting Python Backend (Port 8000)..." -ForegroundColor Cyan

if (!(Test-Path "backend\venv\Scripts\Activate.ps1")) {
    Write-Host "❌ Virtual environment not found. Please run setup first." -ForegroundColor Red
    Write-Host "💡 Run: .\scripts\quick-fix.bat" -ForegroundColor Yellow
    Read-Host "Press Enter to exit..."
    exit 1
}

$backendJob = Start-Job -ScriptBlock {
    Set-Location "$using:PWD\backend"
    & "venv\Scripts\Activate.ps1"
    Write-Host "🐍 Backend starting at http://localhost:8000" -ForegroundColor Cyan
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
}

# Wait for backend to initialize
Start-Sleep -Seconds 3

# Start frontend
Write-Host "📱 Starting Next.js Frontend (Port 3000)..." -ForegroundColor Cyan

Set-Location frontend

if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
}

$frontendJob = Start-Job -ScriptBlock {
    Set-Location "$using:PWD\frontend"  
    Write-Host "⚛️ Frontend starting at http://localhost:3000" -ForegroundColor Cyan
    npm run dev
}

Set-Location ..

Write-Host ""
Write-Host "🎉 Servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Cyan  
Write-Host "🔧 Backend API: http://localhost:8000" -ForegroundColor Cyan
Write-Host "📚 API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏰ Waiting for servers to fully start..." -ForegroundColor Yellow

# Wait and check status
Start-Sleep -Seconds 8

Write-Host "🌐 Opening frontend in browser..." -ForegroundColor Cyan
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "✅ Both servers should be running now!" -ForegroundColor Green
Write-Host "💡 Check for any error messages above" -ForegroundColor Yellow
Write-Host ""

# Monitor jobs
Write-Host "📊 Server Status:" -ForegroundColor Cyan
Write-Host "Backend Job: $($backendJob.State)" -ForegroundColor Gray
Write-Host "Frontend Job: $($frontendJob.State)" -ForegroundColor Gray
Write-Host ""

Write-Host "Press any key to stop servers and exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Cleanup
Write-Host "🛑 Stopping servers..." -ForegroundColor Yellow
Stop-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
Remove-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue

Write-Host "✅ Servers stopped!" -ForegroundColor Green