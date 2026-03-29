# 🚀 Quick Start Guide - Fixed Version

## ❌ มีปัญหากับ localhost?

### ปัญหาที่พบบ่อยและการแก้ไข:

#### 1. **localhost:8000 refused to connect** = Backend ไม่ทำงาน

#### 2. **localhost:3000 shows 404** = Frontend ไม่มีหน้าแรก

---

## ✅ การแก้ไขแบบด่วน (เลือก 1 วิธี):

### 🎯 **Option 1: ใช้ Script อัตโนมัติ (แนะนำ)**

```batch
# แนวทางที่ 1: Simple Fix (Python 3.14 compatible)
.\scripts\simple-fix.bat

# แนวทางที่ 2: Ultra Simple (No venv - for Python issues)
.\scripts\ultra-simple.bat

# แนวทางที่ 3: Original (may have Python 3.14 issues)
.\scripts\start-servers.bat
```

### 🎯 **Option 2: รันทีละขั้นตอน**

```powershell
# ขั้นตอน 1: Setup Backend (เลือก 1 วิธี)
.\scripts\simple-fix.bat        # สำหรับ Python 3.14
# หรือ
.\scripts\ultra-simple.bat      # ไม่ใช้ venv เลย

# ขั้นตอน 2: Start Servers
.\scripts\simple-start.bat      # หรือ .\scripts\ultra-start.bat
```

---

## 🧑‍💻 Manual Dev Run (ไม่ใช้ Script / ไม่ใช้ venv)

### 1) Backend (FastAPI)

```powershell
cd backend

# ติดตั้ง dependency แบบเบา (ถ้ายังไม่ได้ติดตั้ง)
pip install -r requirements-basic.txt

# รัน API (ต้องอยู่ในโฟลเดอร์ backend)
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

ถ้าคุณอยากรันจากโฟลเดอร์ root (D:\GenAIPJ\CulinaryCrafts) ให้ใช้:

```powershell
python -m uvicorn app.main:app --reload --app-dir backend --host 0.0.0.0 --port 8000
```

### 2) Frontend (Next.js)

```powershell
cd frontend
npm install
npm run dev
```

หมายเหตุ: Host dev จะ proxy `/api/*` ไปที่ `http://localhost:8000` โดยอัตโนมัติ

---

## ⚙️ .env (สำคัญ)

ถ้าเจอ error แนวนี้:

- `error parsing value for field "CORS_ORIGINS"`

ให้ตั้งค่าฟิลด์ที่เป็น list ใน `.env` เป็น JSON array เช่น:

```env
CORS_ORIGINS=["http://localhost:3000","https://your-domain.com"]
ALLOWED_HOSTS=["localhost","your-domain.com"]
TRUSTED_PROXIES=["127.0.0.1"]
```

---

## 🔍 **ตรวจสอบว่าทำงานแล้วหรือยัง:**

1. **Backend**: http://localhost:8000 - ควรแสดง welcome message
2. **API Docs**: http://localhost:8000/docs - ควรแสดง FastAPI documentation
3. **Frontend**: http://localhost:3000 - ควรแสดงหน้า Culinary Crafts
4. **API Test**: http://localhost:3000/api-test - ทดสอบการเชื่อมต่อ

---

## ⚠️ **คำสั่งที่ใช้ผิด:**

- ❌ `npm start` → ✅ `npm run dev`
- ❌ `node run` → ✅ `npm run dev`
- ❌ `python app.main:app` → ✅ `uvicorn app.main:app --reload`

---

## 🛠️ **หากยังไม่ทำงาน:**

### ตรวจสอบ Prerequisites:

```powershell
python --version    # ควรเป็น 3.11+
node --version      # ควรเป็น 18+
npm --version       # ควรมี
```

### ตรวจสอบ Virtual Environment:

```powershell
cd backend
ls venv\Scripts\     # ควรมีไฟล์ activate.bat
```

### ตรวจสอบ Dependencies:

```powershell
cd frontend
ls node_modules\     # ควรมี packages
```

---

## 🆘 **ปัญหาเฉพาะ:**

### ปัญหา: Python 3.14 ensurepip error (ใหม่)

```batch
# แก้ด้วย Ultra Simple (ไม่ใช้ venv)
.\scripts\ultra-simple.bat
.\scripts\ultra-start.bat

# หรือ Simple Fix (venv แบบ manual pip)
.\scripts\simple-fix.bat
.\scripts\simple-start.bat
```

### ปัญหา: uvicorn not recognized (หลัก)

```batch
# วิธีแก้ไขเฉพาะ uvicorn issue
.\scripts\fix-uvicorn.bat
# หรือ
.\scripts\fix-uvicorn.ps1
```

### ปัญหา: Virtual Environment เสีย

```batch
cd backend
rmdir /s venv
python -m venv venv --without-pip
call venv\Scripts\activate.bat
python -m ensurepip --default-pip
pip install "uvicorn[standard]==0.24.0" fastapi pydantic pydantic-settings
```

### ปัญหา: Frontend ไม่มี dependencies

```powershell
cd frontend
rm -r node_modules
npm install
```

### ปัญหา: Port ถูกใช้งานอยู่

```powershell
# ค้นหา process ที่ใช้ port
netstat -ano | findstr :8000
netstat -ano | findstr :3000

# Kill process (ทำระวัง)
taskkill /PID <PID_NUMBER> /F
```

---

## 🎉 **Success Indicators:**

เมื่อทุกอย่างทำงานแล้ว คุณควรเห็น:

- ✅ Backend API: {"service": "Culinary Crafts API", "status": "healthy"}
- ✅ Frontend: หน้า "🍳 Culinary Crafts" พร้อม chat interface
- ✅ API Test Page: แสดง connection status เป็นสีเขียว

---

## 📞 **ต้องการความช่วยเหลือ:**

1. ดูไฟล์ [docs/troubleshooting-windows.md](docs/troubleshooting-windows.md)
2. ตรวจสอบ error messages ใน terminal
3. ลอง restart terminals และรันใหม่
