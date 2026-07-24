from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base

# roles: PUBLIC, PARTNER, MANUFACTURER, RECYCLER, AUDITOR, REGULATOR, ADMIN
class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(200), unique=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), nullable=False, default="PUBLIC")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
