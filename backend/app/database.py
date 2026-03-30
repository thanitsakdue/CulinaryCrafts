from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

# Try to get DATABASE_URL directly, otherwise build from environment variables
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

if not SQLALCHEMY_DATABASE_URL:
    # Build from individual environment variables (Docker Compose setup)
    postgres_host = os.getenv("POSTGRES_HOST", "localhost")
    postgres_user = os.getenv("POSTGRES_USER", "culinary_user")
    postgres_password = os.getenv("POSTGRES_PASSWORD", "dev_password_123")
    postgres_db = os.getenv("POSTGRES_DB", "culinary_crafts")
    postgres_port = os.getenv("POSTGRES_PORT", "5432")
    
    SQLALCHEMY_DATABASE_URL = f"postgresql://{postgres_user}:{postgres_password}@{postgres_host}:{postgres_port}/{postgres_db}"

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