from datetime import datetime
from sqlalchemy import Column, Integer, Boolean, String, DateTime, ForeignKey
from app.database import Base

class PassportCompliance(Base):
    __tablename__ = "passport_compliance"

    id = Column(Integer, primary_key=True, autoincrement=True)
    passport_id = Column(Integer, ForeignKey("passport.id"), nullable=False)
    crma = Column(Boolean, nullable=True)
    cbam = Column(Boolean, nullable=True)
    esg = Column(Boolean, nullable=True)
    audit_status = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
