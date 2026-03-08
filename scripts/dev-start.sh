#!/bin/bash
# =================================
# 🚀 Culinary Crafts Development Setup
# =================================

set -e  # Exit on any error

echo "🍳 Setting up Culinary Crafts development environment..."

# Check prerequisites
check_prerequisites() {
    echo "📋 Checking prerequisites..."
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    if ! command -v python3 &> /dev/null; then
        echo "❌ Python 3 is not installed. Please install Python 3.11+ first."
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    echo "✅ All prerequisites are met!"
}

# Setup environment variables
setup_env() {
    echo "⚙️ Setting up environment variables..."
    
    if [ ! -f .env ]; then
        cp .env.example .env
        echo "📝 Created .env file from .env.example"
        echo "🚨 Please edit .env file with your actual API keys and configuration!"
    else
        echo "📁 .env file already exists"
    fi
}

# Setup backend Python environment
setup_backend() {
    echo "🐍 Setting up Python backend..."
    
    cd backend
    
    # Create virtual environment
    if [ ! -d "venv" ]; then
        python3 -m venv venv
        echo "📦 Created Python virtual environment"
    fi
    
    # Activate virtual environment (Windows compatible)
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
        source venv/Scripts/activate
    else
        source venv/bin/activate
    fi
    
    # Upgrade pip
    pip install --upgrade pip
    
    # Install dependencies
    pip install -r requirements.txt
    echo "📚 Installed Python dependencies"
    
    cd ..
}

# Setup frontend Node.js environment  
setup_frontend() {
    echo "📱 Setting up Next.js frontend..."
    
    cd frontend
    
    # Install dependencies
    npm install
    echo "📦 Installed Node.js dependencies"
    
    cd ..
}

# Start development services
start_services() {
    echo "🚀 Starting development services..."
    
    # Start Redis and other supporting services with Docker Compose
    if [ -f "docker-compose.dev.yml" ]; then
        docker-compose -f docker-compose.dev.yml up -d
        echo "🐳 Started supporting services (Redis, etc.)"
    fi
    
    # Start backend in background
    echo "🔧 Starting Python backend..."
    cd backend
    if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" || "$OSTYPE" == "win32" ]]; then
        source venv/Scripts/activate
    else
        source venv/bin/activate
    fi
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    cd ..
    
    # Start frontend in background
    echo "💻 Starting Next.js frontend..."
    cd frontend  
    npm run dev &
    FRONTEND_PID=$!
    cd ..
    
    echo ""
    echo "🎉 Development servers are starting!"
    echo "📱 Frontend: http://localhost:3000"
    echo "🔧 Backend API: http://localhost:8000"  
    echo "📚 API Docs: http://localhost:8000/docs"
    echo ""
    echo "Press Ctrl+C to stop all services"
    
    # Wait for interrupt signal
    trap "kill $BACKEND_PID $FRONTEND_PID; docker-compose -f docker-compose.dev.yml down; exit" INT
    wait
}

# Main execution
main() {
    check_prerequisites
    setup_env
    setup_backend
    setup_frontend
    start_services
}

# Run main function
main "$@"