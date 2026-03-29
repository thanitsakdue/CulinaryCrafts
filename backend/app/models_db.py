from sqlalchemy import Column, Integer, String, Text, DateTime
from .database import Base
import datetime

class ChatLog(Base):
    __tablename__ = "chat_logs"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True) # เอาไว้แยกเครื่องหรือแยกคนคุย
    user_query = Column(Text)
    ai_response = Column(Text)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
