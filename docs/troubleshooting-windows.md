# 🔧 Troubleshooting Guide - Windows Setup Issues

## ❌ Common Windows Setup Problems & Solutions

### 1. **Virtual Environment Corruption (setuptools.build_meta error)**

**Symptoms:**
- `Cannot import 'setuptools.build_meta'`
- pip install failures
- Package resolution errors

**Solution:**
```powershell
# 🗑️ Delete corrupted venv and start fresh
cd backend
Remove-Item -Recurse -Force venv

# 📦 Create new venv with proper setup
python -m venv venv
venv\Scripts\Activate.ps1
python -m pip install --upgrade pip setuptools wheel

# 📚 Install basic packages first
pip install fastapi uvicorn pydantic pydantic-settings python-multipart python-dotenv
```

### 2. **Permission Issues**

**Symptoms:**
- "Access denied" errors
- PowerShell execution policy errors

**Solution:**
```powershell
# 🔐 Set execution policy for current user
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# 🏃‍♂️ Run as Administrator if needed
# Right-click PowerShell → "Run as Administrator"
```

### 3. **Python Command Not Found**

**Symptoms:**
- `python: command not found`
- Script fails at Python check

**Solutions:**
```powershell
# Option 1: Check if Python is installed
python --version
# or
py --version

# Option 2: Add Python to PATH
# Windows Settings → Apps → App execution aliases → Turn off Python aliases

# Option 3: Use Python Launcher
py -m venv venv
```

### 4. **Node.js Issues**

**Symptoms:**
- `npm install` fails
- Node.js not found

**Solutions:**
```powershell
# Check Node.js version
node --version
npm --version

# Clear npm cache if issues
npm cache clean --force

# Use yarn instead if npm fails
yarn install
```

### 4b. **Next.js EPERM on `.next*/trace`**

**Symptoms:**
- `EPERM: operation not permitted, open '...\\.next\\trace'`
- `next dev` / `next build` fails only on Windows

**What’s happening:**
Next.js writes a build/dev trace file named exactly `trace` under the Next build output directory. Some Windows security/AV configurations block creating a file with that exact name inside certain project folders.

**Solution (already built-in for this repo):**
- On Windows, the frontend is configured to write its Next.js build output *outside* the repo checkout using a relative `distDir`.
- A small pre-script ensures the target folder exists before `next dev/build/start`.

Run the frontend like normal:
```powershell
cd CulinaryCrafts\frontend
npm run dev
```

### 5. **Docker Issues**

**Symptoms:**
- `docker: command not found`
- Docker daemon not running

**Solutions:**
```powershell
# Check Docker status
docker --version

# Start Docker Desktop
# Windows: Start Docker Desktop application

# Skip Docker for now (optional services only)
# Comment out Docker-related parts in scripts
```

---

## 🚀 **Manual Setup Steps (Failsafe)**

If automated scripts fail, follow these manual steps:

### Step 1: Basic Backend Setup
```powershell
cd CulinaryCrafts\backend

# Create venv
python -m venv venv
venv\Scripts\Activate.ps1

# Upgrade core tools
python -m pip install --upgrade pip setuptools wheel

# Install only essential packages
pip install fastapi==0.104.1 uvicorn[standard]==0.24.0 pydantic==2.5.0 pydantic-settings==2.1.0 python-multipart==0.0.6 python-dotenv==1.0.0
```

### Step 2: Test Backend
```powershell
# Still in backend directory with venv activated
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Open: http://localhost:8000
# Should show: Welcome message
```

### Step 3: Frontend Setup (Separate Terminal)
```powershell
cd CulinaryCrafts\frontend
npm install
npm run dev

# Open: http://localhost:3000  
```

### Step 4: Install AI Packages Later
```powershell
# After basic setup works, install AI packages
cd backend
venv\Scripts\Activate.ps1
pip install -r requirements-ai.txt
```

---

## 🛠️ **Alternative Setup Options**

### Option A: Use Python Poetry (Advanced)
```powershell
# Install Poetry first: https://python-poetry.org/
cd backend
poetry init
poetry add fastapi uvicorn pydantic
poetry shell
poetry run uvicorn app.main:app --reload
```

### Option B: Use Conda (If installed)
```powershell
cd backend
conda create -n culinary-crafts python=3.11
conda activate culinary-crafts
pip install fastapi uvicorn pydantic pydantic-settings
```

### Option C: Use Docker Development
```powershell
# If you prefer containerized development
docker-compose -f docker-compose.dev.yml up --build
```

---

## 🔍 **Diagnosis Commands**

### Check Environment
```powershell
# Python version
python --version

# Pip version  
pip --version

# Virtual environment status
echo $env:VIRTUAL_ENV

# Installed packages
pip list

# System PATH
echo $env:PATH
```

### Check Services
```powershell
# Test backend API
curl http://localhost:8000

# Test frontend
curl http://localhost:3000

# Check processes
Get-Process | Where-Object {$_.ProcessName -like "*python*" -or $_.ProcessName -like "*node*"}
```

---

## 🆘 **Getting Help**

1. **Check Error Messages**: Most errors contain hints about what's wrong
2. **Google the Error**: Copy the exact error message
3. **Check Python/Node Versions**: Ensure compatibility  
4. **Try Clean Install**: Delete node_modules and venv, reinstall
5. **Use Basic Setup**: Start with minimal requirements first

### Useful Resources:
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Python Virtual Environments](https://docs.python.org/3/library/venv.html)
- [Node.js Installation](https://nodejs.org/)
- [PowerShell Execution Policies](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies)

---

## ✅ **Success Indicators**

Your setup is working when:
- ✅ Backend API responds at http://localhost:8000
- ✅ API docs accessible at http://localhost:8000/docs  
- ✅ Frontend loads at http://localhost:3000
- ✅ No error messages in terminals
- ✅ Virtual environment is activated (shows in prompt)