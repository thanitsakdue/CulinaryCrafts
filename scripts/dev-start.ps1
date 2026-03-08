# =================================
# 🚀 Culinary Crafts Development Setup (PowerShell)
# =================================

Write-Host "🍳 Setting up Culinary Crafts development environment..." -ForegroundColor Green

# Check prerequisites
function Test-Prerequisites {
    Write-Host "📋 Checking prerequisites..." -ForegroundColor Cyan
    
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
        exit 1
    }
    
    if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Python is not installed. Please install Python 3.11+ first." -ForegroundColor Red
        exit 1
    }
    
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Host "❌ Docker is not installed. Please install Docker first." -ForegroundColor Red
        exit 1
    }
    
    Write-Host "✅ All prerequisites are met!" -ForegroundColor Green
}

# Setup environment variables
function Setup-Environment {
    Write-Host "⚙️ Setting up environment variables..." -ForegroundColor Cyan
    
    if (-not (Test-Path .env)) {
        Copy-Item .env.example .env
        Write-Host "📝 Created .env file from .env.example" -ForegroundColor Yellow
        Write-Host "🚨 Please edit .env file with your actual API keys and configuration!" -ForegroundColor Yellow
    } else {
        Write-Host "📁 .env file already exists" -ForegroundColor Green
    }
}

# Setup backend Python environment
function Setup-Backend {
    Write-Host "🐍 Setting up Python backend..." -ForegroundColor Cyan
    
    Set-Location backend
    
    # Create virtual environment
    if (-not (Test-Path venv)) {
        python -m venv venv
        Write-Host "📦 Created Python virtual environment" -ForegroundColor Green
    }
    
    # Activate virtual environment
    & "venv\Scripts\Activate.ps1"
    
    # Upgrade pip
    python -m pip install --upgrade pip
    
    # Install dependencies
    pip install -r requirements.txt
    Write-Host "📚 Installed Python dependencies" -ForegroundColor Green
    
    Set-Location ..
}

# Setup frontend Node.js environment  
function Setup-Frontend {
    Write-Host "📱 Setting up Next.js frontend..." -ForegroundColor Cyan
    
    Set-Location frontend
    
    # Install dependencies
    npm install
    Write-Host "📦 Installed Node.js dependencies" -ForegroundColor Green
    
    Set-Location ..
}

# Start development services
function Start-Services {
    Write-Host "🚀 Starting development services..." -ForegroundColor Cyan
    
    # Start Redis and other supporting services with Docker Compose
    if (Test-Path docker-compose.dev.yml) {
        docker-compose -f docker-compose.dev.yml up -d
        Write-Host "🐳 Started supporting services (Redis, etc.)" -ForegroundColor Green
    }
    
    # Start backend in new terminal
    Write-Host "🔧 Starting Python backend..." -ForegroundColor Cyan
    $backendScript = {
        Set-Location backend
        & "venv\Scripts\Activate.ps1"
        uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
    }
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "& {$backendScript}"
    
    # Start frontend in new terminal
    Write-Host "💻 Starting Next.js frontend..." -ForegroundColor Cyan
    $frontendScript = {
        Set-Location frontend
        npm run dev
    }
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "& {$frontendScript}"
    
    Write-Host ""
    Write-Host "🎉 Development servers are starting!" -ForegroundColor Green
    Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Cyan
    Write-Host "🔧 Backend API: http://localhost:8000" -ForegroundColor Cyan
    Write-Host "📚 API Docs: http://localhost:8000/docs" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Press any key to stop all services..." -ForegroundColor Yellow
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    
    # Cleanup
    Write-Host "🧹 Stopping services..." -ForegroundColor Yellow
    docker-compose -f docker-compose.dev.yml down
    Get-Process | Where-Object {$_.ProcessName -like "*uvicorn*" -or $_.ProcessName -like "*node*"} | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "✅ All services stopped." -ForegroundColor Green
}

# Main execution
try {
    Test-Prerequisites
    Setup-Environment
    Setup-Backend
    Setup-Frontend
    Start-Services
} catch {
    Write-Host "❌ An error occurred: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}