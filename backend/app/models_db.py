from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from .database import Base
import datetime

class ChatLog(Base):
    __tablename__ = "chat_logs"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True) # เอาไว้แยกเครื่องหรือแยกคนคุย
    user_query = Column(Text)
    ai_response = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, unique=True, index=True) # เช่น "user_123" หรือ email
    spice_level = Column(String, nullable=True)
    
    # ใช้ JSON สำหรับเก็บ List ของข้อมูลที่เลือกได้หลายอย่าง
    dietary_types = Column(JSON, default=[]) # เก็บ ["Vegetarian", "Paleo"]
    allergies = Column(JSON, default=[])      # เก็บ ["Milk", "Eggs"]
    favorite_cuisines = Column(JSON, default=[])
    ingredients_to_avoid = Column(JSON, default=[])
    
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)