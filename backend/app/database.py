from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
import logging

load_dotenv()
logger = logging.getLogger(__name__)

# Try to get DATABASE_URL directly, otherwise build from environment variables
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# Railway / Heroku style urls can come as postgres://...
if SQLALCHEMY_DATABASE_URL and SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

if not SQLALCHEMY_DATABASE_URL:
    # Build from individual environment variables (Docker Compose setup)
    postgres_host = os.getenv("POSTGRES_HOST")
    postgres_user = os.getenv("POSTGRES_USER")
    postgres_password = os.getenv("POSTGRES_PASSWORD")
    postgres_db = os.getenv("POSTGRES_DB")
    postgres_port = os.getenv("POSTGRES_PORT", "5432")

    if postgres_host and postgres_user and postgres_password and postgres_db:
        SQLALCHEMY_DATABASE_URL = f"postgresql://{postgres_user}:{postgres_password}@{postgres_host}:{postgres_port}/{postgres_db}"
    else:
        # Safe fallback so app can boot even without external DB
        SQLALCHEMY_DATABASE_URL = "sqlite:///./app.db"
        logger.warning("DATABASE_URL not configured; using SQLite fallback at ./app.db")

# สร้าง Engine สำหรับคุยกับ Postgres
connect_args = {"check_same_thread": False} if SQLALCHEMY_DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=connect_args) # type: ignore

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
