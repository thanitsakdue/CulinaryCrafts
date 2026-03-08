# =================================
# 🔧 Fix uvicorn Installation Issue (PowerShell)  
# =================================

Write-Host "🛠️ Fixing uvicorn installation issue..." -ForegroundColor Yellow
Write-Host ""

# Check directory
if (!(Test-Path "backend")) {
    Write-Host "❌ Please run this from the CulinaryCrafts root directory" -ForegroundColor Red
    Read-Host "Press Enter to exit..."
    exit 1
}

Set-Location backend

# Check/create virtual environment
if (!(Test-Path "venv\Scripts\Activate.ps1")) {
    Write-Host "❌ Virtual environment not found. Creating new one..." -ForegroundColor Red
    python -m venv venv
}

# Activate virtual environment
Write-Host "⚡ Activating virtual environment..." -ForegroundColor Cyan
& "venv\Scripts\Activate.ps1"

# Check current environment
Write-Host "🐍 Checking Python in virtual environment..." -ForegroundColor Cyan
Get-Command python | Select-Object Source
Get-Command pip | Select-Object Source

# Upgrade pip
Write-Host "📦 Upgrading pip..." -ForegroundColor Cyan
python -m pip install --upgrade pip setuptools wheel

# Uninstall and reinstall uvicorn
Write-Host "🚀 Fixing uvicorn installation..." -ForegroundColor Cyan
pip uninstall -y uvicorn 2>$null
pip install "uvicorn[standard]==0.24.0"

# Verify installation
Write-Host "🔍 Verifying uvicorn installation..." -ForegroundColor Cyan
try {
    uvicorn --version
    Write-Host "✅ uvicorn installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ uvicorn still not working. Trying alternative method..." -ForegroundColor Red
    pip install uvicorn --force-reinstall
    uvicorn --version
}

# Install other essential packages
Write-Host "📚 Installing other essential packages..." -ForegroundColor Cyan
pip install fastapi==0.104.1 pydantic==2.5.0 pydantic-settings==2.1.0 python-multipart==0.0.6 python-dotenv==1.0.0

# Test the app
Write-Host "🧪 Testing uvicorn with the app..." -ForegroundColor Cyan
Write-Host "This will start the server for a few seconds to test..." -ForegroundColor Yellow

$testJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD
    & "venv\Scripts\Activate.ps1"
    uvicorn app.main:app --host 0.0.0.0 --port 8001 --timeout-keep-alive 5
}

Start-Sleep -Seconds 3
Stop-Job $testJob -ErrorAction SilentlyContinue
Remove-Job $testJob -ErrorAction SilentlyContinue

Set-Location ..

Write-Host ""
Write-Host "✅ uvicorn fix completed!" -ForegroundColor Green
Write-Host ""
Write-Host "🛠️ Now you can start the backend with:" -ForegroundColor Cyan
Write-Host "   cd backend" -ForegroundColor Gray
Write-Host "   venv\Scripts\Activate.ps1" -ForegroundColor Gray
Write-Host "   uvicorn app.main:app --reload" -ForegroundColor Gray  
Write-Host ""
Read-Host "Press Enter to continue..."