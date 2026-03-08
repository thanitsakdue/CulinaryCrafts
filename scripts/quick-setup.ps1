# =================================
# 🚀 Culinary Crafts - Quick Setup (PowerShell)
# Fixed version that handles venv corruption
# =================================

Write-Host "🍳 Quick Setup - Culinary Crafts (Fixed for Windows)" -ForegroundColor Green

# Function to check prerequisites
function Test-Prerequisites {
    Write-Host "📋 Checking prerequisites..." -ForegroundColor Cyan
    
    $missing = @()
    
    if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
        $missing += "Python 3.11+"
    }
    
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        $missing += "Node.js 18+"
    }
    
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        $missing += "Docker"
    }
    
    if ($missing.Count -gt 0) {
        Write-Host "❌ Missing prerequisites: $($missing -join ', ')" -ForegroundColor Red
        Write-Host "Please install the missing software first." -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "✅ All prerequisites are met!" -ForegroundColor Green
}

# Function to setup environment
function Setup-Environment {
    Write-Host "⚙️ Setting up environment variables..." -ForegroundColor Cyan
    
    if (-not (Test-Path .env)) {
        Copy-Item .env.example .env
        Write-Host "📝 Created .env file from .env.example" -ForegroundColor Yellow
        Write-Host "🚨 Please edit .env file with your actual API keys!" -ForegroundColor Yellow
    } else {
        Write-Host "📁 .env file already exists" -ForegroundColor Green
    }
}

# Function to fix Python backend with staged installation
function Setup-Backend-Fixed {
    Write-Host "🐍 Setting up Python backend (Fixed version)..." -ForegroundColor Cyan
    
    Set-Location backend
    
    # Remove corrupted venv if exists
    if (Test-Path venv) {
        Write-Host "🗑️ Removing old virtual environment..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force venv
    }
    
    # Create fresh virtual environment
    Write-Host "📦 Creating fresh virtual environment..." -ForegroundColor Cyan
    python -m venv venv
    
    # Activate virtual environment
    & "venv\Scripts\Activate.ps1"
    
    # Upgrade core tools first
    Write-Host "⚡ Upgrading core Python tools..." -ForegroundColor Cyan
    python -m pip install --upgrade pip setuptools wheel
    
    # Install basic requirements first
    Write-Host "📚 Installing basic dependencies..." -ForegroundColor Cyan
    if (Test-Path requirements-basic.txt) {
        pip install -r requirements-basic.txt
        Write-Host "✅ Basic dependencies installed successfully!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Basic requirements not found, using main requirements..." -ForegroundColor Yellow
        # Install only essential packages manually
        pip install fastapi uvicorn pydantic pydantic-settings python-multipart python-dotenv
        Write-Host "✅ Essential packages installed!" -ForegroundColor Green
    }
    
    # Optionally install AI packages (comment out if causing issues)
    Write-Host "🤖 Installing AI packages (optional)..." -ForegroundColor Cyan
    Write-Host "Note: If this fails, you can skip AI packages for now and install them later." -ForegroundColor Yellow
    
    try {
        if (Test-Path requirements-ai.txt) {
            pip install -r requirements-ai.txt --no-deps --force-reinstall
            Write-Host "✅ AI packages installed!" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠️ AI packages failed to install - continuing with basic setup" -ForegroundColor Yellow
        Write-Host "You can install AI packages later with: pip install -r requirements-ai.txt" -ForegroundColor Cyan
    }
    
    Set-Location ..
}

# Function to setup frontend
function Setup-Frontend {
    Write-Host "📱 Setting up Next.js frontend..." -ForegroundColor Cyan
    
    Set-Location frontend
    
    try {
        npm install
        Write-Host "📦 Node.js dependencies installed!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Frontend setup failed. Please check your Node.js installation." -ForegroundColor Red
        Set-Location ..
        return $false
    }
    
    Set-Location ..
    return $true
}

# Function to start services
function Start-Services {
    Write-Host "🚀 Starting development servers..." -ForegroundColor Green
    
    # Start backend
    Write-Host "🔧 Starting Python backend..." -ForegroundColor Cyan
    $backendJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD\backend
        & "venv\Scripts\Activate.ps1"
        uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
    }
    
    # Start frontend  
    Write-Host "💻 Starting Next.js frontend..." -ForegroundColor Cyan
    $frontendJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD\frontend
        npm run dev
    }
    
    # Give services time to start
    Start-Sleep -Seconds 3
    
    Write-Host ""
    Write-Host "🎉 Development servers should be starting!" -ForegroundColor Green
    Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "🔧 Backend API: http://localhost:8000" -ForegroundColor Cyan  
    Write-Host "📚 API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "💡 Check the job outputs if services don't start:" -ForegroundColor Yellow
    Write-Host "   Get-Job | Receive-Job" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Press any key to stop services and exit..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    
    # Stop background jobs
    Write-Host "🛑 Stopping services..." -ForegroundColor Yellow
    Stop-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob, $frontendJob -ErrorAction SilentlyContinue
    
    Write-Host "✅ Setup complete!" -ForegroundColor Green
}

# Main execution
try {
    Test-Prerequisites
    Setup-Environment  
    Setup-Backend-Fixed
    
    $frontendSuccess = Setup-Frontend
    
    if ($frontendSuccess) {
        Start-Services
    } else {
        Write-Host "🔧 Backend is ready! You can start it manually:" -ForegroundColor Cyan
        Write-Host "   cd backend && venv\Scripts\Activate.ps1 && uvicorn app.main:app --reload" -ForegroundColor Gray
    }
    
} catch {
    Write-Host "❌ Setup failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Try running individual steps manually or check the error above." -ForegroundColor Yellow
}