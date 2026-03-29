from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# สร้าง Engine สำหรับคุยกับ Postgres
engine = create_engine(SQLALCHEMY_DATABASE_URL) # type: ignore

# สร้าง Session สำหรับดึงข้อมูล
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# คลาสแม่สำหรับสร้าง Table (Models)
Base = declarative_base()

# Dependency สำหรับใช้ใน API (FastAPI)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()