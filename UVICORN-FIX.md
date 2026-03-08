# 🔧 URGENT FIX: uvicorn not recognized

## ❌ **หากเห็นข้อความ: 'uvicorn' is not recognized**

### 🆘 **แก้ไขทันที (เลือก 1 วิธี):**

#### **🚀 Option 1: ใช้ Complete Setup (แนะนำ)**
```batch
.\scripts\complete-setup.bat
```
*Script นี้จะลบ venv เก่า สร้างใหม่ ติดตั้ง uvicorn และเริ่มทั้ง 2 servers*

#### **🔧 Option 2: แก้เฉพาะ uvicorn**
```batch
.\scripts\fix-uvicorn.bat
```
*แก้เฉพาะปัญหา uvicorn โดยไม่เริ่ม server*

#### **⚡ Option 3: แก้ด่วนแบบ Manual**
```batch
cd backend
rmdir /s /q venv
python -m venv venv  
venv\Scripts\activate.bat
pip install --upgrade pip
pip install "uvicorn[standard]==0.24.0"
pip install fastapi pydantic pydantic-settings python-multipart python-dotenv
uvicorn app.main:app --reload
```

---

## 🧪 **ตรวจสอบว่าแก้แล้วหรือยัง:**

```batch
cd backend
venv\Scripts\activate.bat
uvicorn --version
```
*ควรแสดงเวอร์ชันของ uvicorn*

---

## 🎯 **หลังแก้ไขแล้ว:**

1. **Backend**: http://localhost:8000
2. **Frontend**: http://localhost:3000  
3. **API Test**: http://localhost:3000/api-test

---

## 📞 **ยังไม่หายไง?**

ลองขั้นตอนนี้เพิ่ม:
```batch
cd backend
venv\Scripts\activate.bat
where python
where pip
which uvicorn
```

หรือดูใน [QUICKSTART.md](QUICKSTART.md) สำหรับวิธีแก้ไขเพิ่มเติม