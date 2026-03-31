# 🍳 Culinary Crafts - AI Cooking Assistant

**Grounded Culinary Agent: Multimodal RAG-based Cooking Assistant**

## 🏗️ Project Architecture

Culinary Crafts เป็น **Agentic AI Cooking Assistant** ที่ใช้ LangGraph State Machine สำหรับการจัดการ workflow แบบ interactive และ memory-enabled

````
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
│   │   │   ├── gemini/            # Google Gemini 1.5 Pro
│   │   │   ├── recipe_engine/     # Recipe Search & Filtering
│   │   │   ├── rag_service/       # RAG Implementation
│   │   │   ├── auth/              # OAuth & JWT Handling
│   │   │   └── memory/            # User Preference Storage
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
- **Verified Recipe Sources**: ค้นหาจากสูตรอาหารที่ได้รับการตรวจสอบ
- **Semantic Search**: วิเคราะห์ข้อความและรูปภาพ เพื่อการค้นหาที่แม่นยำ
- **Source Attribution**: แสดงที่มาของแนวทางสูตรอาหารทุกครั้ง

### 🧪 Personalization Engine
- **Long-term Memory**: จัดเก็บ user profile และ preferences ใน PostgreSQL
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
| **Frontend** | Next.js 14 + TypeScript + Tailwind | Web UI & Responsive Design |
| **Backend** | FastAPI + Python 3.11+ | REST API & Business Logic |
| **AI Orchestration** | LangGraph | Agentic State Machine |
| **AI Model** | Google Gemini 1.5 Pro | Multimodal AI Processing |
| **Database** | PostgreSQL 15 | User Data & Recipes |
| **Cache** | Redis | Session & Query Caching |
| **Authentication** | JWT + NextAuth.js | Secure User Auth with OAuth |
| **Containerization** | Docker + Docker Compose | Development & Production |
| **Infrastructure** | Azure/AWS | Cloud Deployment |
| **Monitoring** | Prometheus & Grafana | Observability Stack |

## 📋 Getting Started

### Prerequisites
- **Node.js** 18+ and **Python** 3.11+
- **Docker** & **Docker Compose** (for containerized setup)
- **Google Cloud API Key** for Gemini integration
- **PostgreSQL** 15+ (or use Docker)
- **Redis** (or use Docker)

### 📚 Documentation
- **[QUICKSTART.md](QUICKSTART.md)** - Step-by-step setup guide
- **[SCRIPTS-GUIDE.md](SCRIPTS-GUIDE.md)** - All available automation scripts (20+)
- **[docs/](docs/)** - Complete technical documentation

---

## 🚀 Quick Start (Choose One)

### Option 1: 🐳 Docker (Recommended - One Command)

```batch
.\scripts\docker-start.bat
````

✅ Starts everything automatically:

- Frontend (http://localhost:3000)
- Backend API (http://localhost:8000)
- PostgreSQL Database
- Redis Cache
- Monitoring (Prometheus & Grafana)

---

### Option 2: 💻 Local Development (Windows)

```powershell
# Clone repository
git clone <repository-url>
cd CulinaryCrafts

# Setup environment variables
copy .env.example .env
# Edit .env with your API keys (GEMINI_API_KEY, etc.)

# Setup with automatic venv creation
.\scripts\quick-setup.ps1

# Or use simple batch script
.\scripts\ultra-start.bat
```

✅ Starts:

- Backend API (http://localhost:8000)
- Frontend (http://localhost:3000)
- Supporting services (PostgreSQL, Redis if needed)

---

### Option 3: 🐧 Linux/macOS

```bash
# Clone repository
git clone <repository-url>
cd CulinaryCrafts

# Setup environment variables
cp .env.example .env
# Edit .env with your API keys

# Setup and start
chmod +x scripts/dev-start.sh
./scripts/dev-start.sh
```

---

### Option 4: 🛠️ Manual Setup

If scripts don't work, setup manually:

```powershell
# 1. Setup Python Backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
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

# Terminal 3: Supporting services (PostgreSQL, Redis, etc.)
docker-compose -f docker-compose.dev.yml up
```

---

## 🆘 Troubleshooting

For detailed troubleshooting:

- **Setup Issues?** → See [QUICKSTART.md](QUICKSTART.md)
- **Python 3.14 errors?** → See [PYTHON314-FIX.md](PYTHON314-FIX.md)
- **Uvicorn errors?** → See [UVICORN-FIX.md](UVICORN-FIX.md)
- **Windows specific?** → See [docs/troubleshooting-windows.md](docs/troubleshooting-windows.md)

---

## 📖 Documentation

| Document                                                   | Purpose                    |
| ---------------------------------------------------------- | -------------------------- |
| [QUICKSTART.md](QUICKSTART.md)                             | Step-by-step setup guide   |
| [SCRIPTS-GUIDE.md](SCRIPTS-GUIDE.md)                       | Complete scripts reference |
| [docs/SYSTEM-ARCHITECTURE.md](docs/SYSTEM-ARCHITECTURE.md) | System design & workflow   |
| [docs/API-DOCUMENTATION.md](docs/API-DOCUMENTATION.md)     | API endpoints reference    |
| [docs/USER-WORKFLOWS.md](docs/USER-WORKFLOWS.md)           | User interaction flows     |

---

## 🤝 Development Workflow

1. **Create feature branch**: `git checkout -b feature/your-feature`
2. **Make changes** and test locally
3. **Commit changes**: `git commit -m "description"`
4. **Push to GitHub**: `git push origin feature/your-feature`
5. **Create Pull Request** for code review

---

## 📞 Support

For questions or issues:

- Check [QUICKSTART.md](QUICKSTART.md) first
- Review [docs/](docs/) for technical details
- Open an GitHub Issue with details
