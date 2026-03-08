# 🛠️ Culinary Crafts - Scripts Usage Guide

**Complete guide to all 21+ scripts in your project!** 🚀

---

## 🎯 **Quick Start Scripts (Choose One)**

### 🐳 **Docker Method (Recommended)**
```batch
.\scripts\docker-start.bat
```
**✅ Best for:** Complete environment with monitoring, databases, everything!  
**⏰ Time:** ~30 seconds  
**📋 Includes:** Frontend + Backend + Redis + PostgreSQL + Grafana + Prometheus

### 💻 **Local Development (Your Working Setup)**
```batch
.\scripts\ultra-start.bat
```
**✅ Best for:** Quick local development, familiar environment  
**⏰ Time:** ~10 seconds  
**📋 Includes:** Frontend + Backend (no databases)

---

## 📂 **Script Categories & Usage**

### 🚀 **1. Main Startup Scripts**

#### `docker-start.bat` 🐳
**Purpose:** Start full Docker environment with all services
```batch
.\scripts\docker-start.bat
```
**What happens:**
- 🏗️ Builds all Docker images
- 🚀 Starts 8+ services (frontend, backend, databases, monitoring)
- 🌐 Opens http://localhost:3000 automatically
- 📊 Provides monitoring at http://localhost:3001

**When to use:** 
- ✅ First time setup
- ✅ Want complete environment
- ✅ Testing with databases
- ✅ Need monitoring

#### `ultra-start.bat` 💻
**Purpose:** Quick local development startup (no Docker)
```batch
.\scripts\ultra-start.bat
```
**What happens:**
- ✅ Checks if packages installed
- 🚀 Starts Backend (Python FastAPI)
- 🌐 Starts Frontend (Next.js)
- 📱 Opens both in browser

**When to use:**
- ✅ Daily development work
- ✅ Quick testing
- ✅ No Docker needed
- ✅ Faster startup

---

### 🔧 **2. Setup & Installation Scripts**

#### `ultra-simple.bat` 📦
**Purpose:** Install packages without virtual environment (Python 3.14 fix)
```batch
.\scripts\ultra-simple.bat
```
**When to use:**
- ❌ Python 3.14 venv errors
- ❌ Virtual environment broken
- ❌ `ensurepip` failures
- ✅ Quick package installation

#### `complete-setup.bat` 🎯
**Purpose:** Full environment setup with virtual environment
```batch
.\scripts\complete-setup.bat
```
**When to use:**
- 🆕 First time setup
- 🔄 Reset environment
- 🔧 Want proper virtual environment

#### `quick-setup.ps1` ⚡
**Purpose:** PowerShell quick setup
```powershell
.\scripts\quick-setup.ps1
```
**When to use:**
- 🐧 Prefer PowerShell
- 🔒 Execution policy issues
- 🔧 Cross-platform compatibility

---

### 🩹 **3. Problem-Solving Scripts**

#### `fix-uvicorn-now.bat` 🔧
**Purpose:** Fix `'uvicorn' is not recognized` error immediately
```batch
.\scripts\fix-uvicorn-now.bat
```
**When to use:**
- ❌ `'uvicorn' is not recognized`
- ❌ Python module not found
- ❌ Package installation issues

#### `simple-fix.bat` 🛠️
**Purpose:** Manual package installation when automated scripts fail
```batch
.\scripts\simple-fix.bat
```
**When to use:**
- ❌ Other scripts not working
- ❌ Need manual control
- ❌ Troubleshooting

---

### 🐳 **4. Docker Management Scripts**

#### `docker-start.bat` 🐳
**Purpose:** Start full Docker environment with all services
```batch
.\scripts\docker-start.bat
```
**Enhanced features:**
- ✅ Better error detection and reporting
- 🔧 Suggests fixes if build fails
- ⏱️ Longer wait time for services to start

#### `docker-fix.bat` 🔧
**Purpose:** Smart Docker build recovery with minimal fallback
```batch
.\scripts\docker-fix.bat
```
**What it does:**
- 🧹 Cleans up failed builds and images
- 🎯 Tries minimal requirements first for stability  
- 📦 Creates backups of full requirements
- 🏗️ Rebuilds with intelligent package strategy
- ✅ Tests services after successful build

#### `docker-debug.bat` 🔍
**Purpose:** Advanced step-by-step Docker build diagnostics
```batch
.\scripts\docker-debug.bat
```
**Features:**
- 📊 Analyzes requirements.txt for problematic packages
- 🧪 Tests packages in groups to isolate issues
- 🔄 Provides multiple fallback strategies
- 📝 Creates test files for gradual package addition
- 🆘 Comprehensive troubleshooting guide

#### `docker-stop.bat` 🛑
**Purpose:** Stop all Docker services
```batch
.\scripts\docker-stop.bat
```
**Options:**
- **Normal stop:** Keeps data and images
- **Full cleanup:** Removes everything (asks permission)

#### `immediate-docker-fix.bat` 🚨
**Purpose:** Quick-start guide when Docker builds fail
```batch
.\scripts\immediate-docker-fix.bat
```
**Interactive menu for:**
- Smart Docker fix
- Local development fallback
- Advanced debugging
- Guided menu access

#### `docker-logs.bat` 📋
**Purpose:** View logs from Docker services
```batch
.\scripts\docker-logs.bat
```
**Interactive menu:**
- 1️⃣ All services
- 2️⃣ Backend only
- 3️⃣ Frontend only
- 4️⃣ Redis only
- 5️⃣ PostgreSQL only

#### `docker-prod.bat` 🚀
**Purpose:** Production deployment
```batch
.\scripts\docker-prod.bat
```
**⚠️ Warning:** Production mode - requires `.env` file setup

---

### 🧪 **5. Testing & Debugging Scripts**

#### `test-api-docs.bat` 📚
**Purpose:** Test and show enhanced API documentation
```batch
.\scripts\test-api-docs.bat
```
**What it does:**
- ✅ Checks backend health
- 🚀 Starts backend if needed
- 🌐 Opens Swagger docs (http://localhost:8000/docs)
- 🧪 Tests API endpoints
- 📖 Shows ReDoc documentation

#### `debug-services.bat` 🔍
**Purpose:** Check health of all services
```batch
.\scripts\debug-services.bat
```
**What it checks:**
- 🏥 Backend API health
- 🌐 Frontend availability
- 🔴 Redis connectivity
- 🐘 PostgreSQL status
- 📊 Prometheus metrics
- 📈 Grafana dashboard access

---

## 🎯 **Common Usage Scenarios**

### **Scenario 1: First Time Setup**
```batch
# Option A: Docker (recommended)
.\scripts\docker-start.bat

# Option B: Local development
.\scripts\ultra-simple.bat
.\scripts\ultra-start.bat
```

### **Scenario 2: Daily Development**
```batch
# Quick start
.\scripts\ultra-start.bat

# If issues, try
.\scripts\fix-uvicorn-now.bat
```

### **Scenario 3: Python 3.14 Issues**
```batch
# No virtual environment method
.\scripts\ultra-simple.bat
.\scripts\ultra-start.bat
```

### **Scenario 4: Complete Docker Environment**
```batch
# Start everything
.\scripts\docker-start.bat

# Check if working
.\scripts\debug-services.bat

# View logs if issues
.\scripts\docker-logs.bat

# Stop when done
.\scripts\docker-stop.bat
```

### **Scenario 5: API Documentation**
```batch
# Test enhanced docs
.\scripts\test-api-docs.bat

# Then visit: http://localhost:8000/docs
```

---

## 🚨 **Troubleshooting Guide**

### **Problem: Docker Build Failed (pip install errors)**
```batch
# 🎯 BEST: Smart fix with minimal fallback
.\scripts\docker-fix.bat

# 🔍 Advanced: Step-by-step debugging  
.\scripts\docker-debug.bat

# ⚡ Quick: Immediate interactive guide
.\scripts\immediate-docker-fix.bat

# 🏠 Bypass: Use local development instead
.\scripts\ultra-start.bat
```

### **Problem: Won't start at all**
```batch
# Try these in order:
1. .\scripts\ultra-simple.bat
2. .\scripts\fix-uvicorn-now.bat
3. .\scripts\ultra-start.bat
```

### **Problem: Docker issues**
```batch
# Check services
.\scripts\debug-services.bat

# Smart fix with cleanup
.\scripts\docker-fix.bat

# Advanced diagnosis
.\scripts\docker-debug.bat 

# View logs
.\scripts\docker-logs.bat

# Restart specific service
docker-compose -f docker-compose.dev.yml restart [service-name]
```

### **Problem: Grafana not loading (port 3001)**
```batch
# Fix monitoring
.\scripts\debug-services.bat

# Or restart Grafana
docker-compose -f docker-compose.dev.yml restart grafana
```

### **Problem: API documentation not working**
```batch
# Test and fix
.\scripts\test-api-docs.bat

# This will start backend if needed
```

---

## 💡 **Pro Tips**

### **🔥 Daily Workflow:**
```batch
# Morning: Quick start
.\scripts\ultra-start.bat

# Afternoon: Test API changes  
.\scripts\test-api-docs.bat

# Evening: Full Docker testing
.\scripts\docker-start.bat
```

### **🐛 Debugging Workflow:**
```batch
# 1. Check what's running
.\scripts\debug-services.bat

# 2. View specific logs
.\scripts\docker-logs.bat

# 3. Test API endpoints
.\scripts\test-api-docs.bat
```

### **🧹 Cleanup Workflow:**
```batch
# Stop Docker services
.\scripts\docker-stop.bat

# Choose cleanup option when prompted
```

---

## 📊 **Script Comparison**

| Script | Speed | Completeness | Best For |
|--------|-------|--------------|----------|
| `ultra-start.bat` | ⚡⚡⚡ | ⭐⭐ | Daily dev |
| `docker-start.bat` | ⚡⭐ | ⭐⭐⭐ | Complete testing |
| `ultra-simple.bat` | ⚡⚡ | ⭐ | Python 3.14 fix |
| `test-api-docs.bat` | ⚡⚡ | ⭐⭐ | API testing |
| `debug-services.bat` | ⚡⚡⚡ | ⭐⭐ | Troubleshooting |

---

## 🎉 **Next Steps**

1. **Try Docker setup:** `.\scripts\docker-start.bat`
2. **Test API docs:** `.\scripts\test-api-docs.bat` 
3. **Daily development:** `.\scripts\ultra-start.bat`

**🍳 You now have a complete toolkit for managing your AI cooking assistant!** 

Choose the right script for your needs and happy coding! 🚀