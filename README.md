# 🍳 Culinary Crafts - AI Cooking Assistant

**Grounded Culinary Agent: Multimodal RAG-based Cooking Assistant**

## 🏗️ Project Architecture

Culinary Crafts เป็น **Agentic AI Cooking Assistant** ที่ใช้ LangGraph State Machine สำหรับการจัดการ workflow แบบ interactive และ memory-enabled

```
CulinaryCrafts/
├── 📱 frontend/                    # Next.js Web Application
│   ├── src/
│   │   ├── components/            # React Components
│   │   ├── pages/                 # Next.js Pages
│   │   ├── hooks/                 # Custom React Hooks
│   │   ├── services/              # API Integration Layer
│   │   ├── types/                 # TypeScript Type Definitions
│   │   └── utils/                 # Utility Functions
│   └── public/                    # Static Assets
│
├── 🐍 backend/                     # Python FastAPI Application
│   ├── app/
│   │   ├── 🎯 nodes/               # LangGraph State Machine Nodes
│   │   ├── 🔄 graphs/              # LangGraph Workflow Definitions
│   │   ├── 📋 schema/              # Pydantic Data Models & Schemas
│   │   ├── 🔌 services/            # External Service Integration
│   │   │   ├── vertex_ai/         # Vertex AI Search (RAG)
│   │   │   ├── firestore/         # Cloud Firestore (Memory Layer)
│   │   │   ├── gemini/            # Gemini 1.5 Pro Integration
│   │   │   ├── memory/            # Memory Management System
│   │   │   └── line/              # LINE Messaging API
│   │   ├── 🌐 api/                 # FastAPI Endpoints
│   │   ├── 📊 models/              # Database Models
│   │   ├── 🛡️ middleware/          # Security & Rate Limiting
│   │   ├── 🔐 auth/                # Authentication & Authorization
│   │   ├── ⚙️ config/              # Configuration Management
│   │   └── 🛠️ utils/               # Helper Functions
│   └── tests/                     # Unit & Integration Tests
│
├── 🏗️ infrastructure/              # Infrastructure as Code
│   ├── docker/                    # Docker Configurations
│   ├── terraform/                 # Cloud Resources (GCP)
│   └── kubernetes/                # K8s Deployment Manifests
│
├── 📊 monitoring/                  # Observability Stack
├── 📚 docs/                        # Documentation
├── 🤖 scripts/                     # Automation Scripts
└── ⚙️ .github/workflows/          # CI/CD Pipelines

## 🎯 Core Features

### 🧠 Agentic Intelligence
- **Interactive Decision Making**: Agent ถามกลับเมื่อข้อมูลไม่เพียงพอ
- **Memory-Enabled Conversations**: จดจำ preferences และ dietary restrictions
- **Multimodal Input Processing**: รองรับข้อความและรูปภาพ

### 🔍 Grounded RAG System  
- **Verified Recipe Sources**: ค้นหาจากแหล่งข้อมูลที่เชื่อถือได้
- **Semantic Search**: ใช้ Vertex AI Search สำหรับการค้นหาแบบ semantic
- **Source Attribution**: แสดงที่มาของสูตรอาหารทุกครั้ง

### 🧪 Personalization Engine
- **Long-term Memory**: จัดเก็บ user profile และ preferences ใน Firestore
- **Short-term Context**: จำสถานะการสนทนาปัจจุบัน  
- **Adaptive Recommendations**: ปรับเมนูตาม dietary restrictions และความชอบ

## 🛡️ Security & Scalability

### Security Features
- **JWT Authentication**: ระบบ authentication แบบ stateless
- **Rate Limiting**: ป้องกัน API abuse และ DDoS
- **Input Validation**: ตรวจสอบและล้างข้อมูลทุก input
- **CORS Protection**: กำหนด allowed origins อย่างเข้มงวด
- **Secrets Management**: ใช้ Google Secret Manager สำหรับ API keys

### Scalability Design
- **Microservices Architecture**: แยกส่วนงานตาม domain
- **Containerization**: Docker containers สำหรับ deployment consistency
- **Horizontal Scaling**: Auto-scaling บน Google Kubernetes Engine
- **Caching Strategy**: Redis caching สำหรับ frequently accessed data
- **Load Balancing**: Google Cloud Load Balancer

## 🚀 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js + TypeScript | Web UI & LINE LIFF |
| **Backend** | FastAPI + Python | REST API & Business Logic |
| **AI Orchestration** | LangGraph | Agentic State Machine |
| **AI Model** | Gemini 1.5 Pro | Multimodal AI Processing |
| **Knowledge Base** | Vertex AI Search | RAG Implementation |
| **Memory Store** | Cloud Firestore | User Profiles & Sessions |
| **Authentication** | JWT + LINE Login | Secure User Auth |
| **Deployment** | GKE + Docker | Container Orchestration |
| **Infrastructure** | Terraform | Infrastructure as Code |
| **Monitoring** | Google Cloud Monitoring | Observability Stack |

## 📋 Getting Started

### 🚀 **Quick Start (Choose One)**

**🐳 Docker (Recommended - Everything in one command):**
```batch
.\scripts\docker-start.bat
```
> Starts frontend, backend, database, Redis, monitoring - everything! 
> Visit http://localhost:3000 when ready.

**💻 Local Development (Your current working setup):**
```batch
.\scripts\ultra-start.bat
```

**📖 Complete Guide:** See [GITHUB-DOCKER-GUIDE.md](GITHUB-DOCKER-GUIDE.md) for GitHub setup & Docker instructions.

---

### Prerequisites
- Node.js 18+ and Python 3.11+
- Google Cloud Project with enabled APIs
- LINE Developer Account
- Docker & kubectl

### Quick Setup

### Quick Setup

#### 🪟 **Windows (Recommended - Fixed Version)**
```powershell
# Clone repository
git clone <repository-url>
cd CulinaryCrafts

# Setup environment variables
copy .env.example .env
# Edit .env with your API keys

# 🚀 QUICK SETUP (Handles venv corruption issues)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\scripts\quick-setup.ps1

# Alternative: Original PowerShell Script
.\scripts\dev-start.ps1

# Alternative: Batch Script
.\scripts\dev-start.bat
```

#### 🐧 **Linux/macOS**
```bash
# Clone repository
git clone <repository-url>
cd CulinaryCrafts

# Setup environment variables
cp .env.example .env
# Edit .env with your API keys

# Start development servers
chmod +x scripts/dev-start.sh
./scripts/dev-start.sh
```

### ⚠️ **Having Setup Issues?**

**🚨 URGENT: If you have Python 3.14 (pre-release) and see ensurepip errors:**
1. **Quick Fix**: Run `.\scripts\ultra-simple.bat` (no virtual env method)
2. **Alternative**: Run `.\scripts\simple-fix.bat` (manual pip method)  
3. **See**: [PYTHON314-FIX.md](PYTHON314-FIX.md) for detailed Python 3.14 solutions

**🚨 URGENT: If you see `'uvicorn' is not recognized` error:**
1. **Quick Fix**: Run `.\scripts\complete-setup.bat` (fixes everything and starts servers)
2. **See**: [UVICORN-FIX.md](UVICORN-FIX.md) for immediate solutions

**🚨 If you see `localhost refused to connect` or `404 not found`:**

1. **Quick Fix (Recommended)**: Use the fixed startup scripts:
   ```batch
   .\scripts\simple-start.bat
   # or  
   .\scripts\ultra-start.bat
   ```

2. **Check Quick Start Guide**: [QUICKSTART.md](QUICKSTART.md) - Step-by-step troubleshooting

**Common Issues:**
- ❌ `Python 3.14 ensurepip error` → ✅ Run `.\scripts\ultra-simple.bat`
- ❌ `'uvicorn' is not recognized` → ✅ Run `.\scripts\fix-uvicorn.bat`
- ❌ `npm start` → ✅ `npm run dev`

### Manual Setup (Alternative)
If scripts don't work, you can setup manually:

```powershell
# 1. Setup Python Backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/macOS
pip install --upgrade pip
pip install -r requirements.txt

# 2. Setup Frontend
cd ../frontend
npm install

# 3. Start services (in separate terminals)
# Terminal 1: Backend
cd backend
venv\Scripts\activate && uvicorn app.main:app --reload

# Terminal 2: Frontend  
cd frontend
npm run dev

# Terminal 3: Supporting services
docker-compose -f docker-compose.dev.yml up
```