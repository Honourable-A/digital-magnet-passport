from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base

class Company(Base):
    __tablename__ = "company"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    country = Column(String(100), nullable=False)
    stage = Column(String(100), nullable=False)
    company_type = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
