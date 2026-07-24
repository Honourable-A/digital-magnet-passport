from datetime import datetime
from sqlalchemy import Column, Integer, String, Date, DateTime, ForeignKey
from app.database import Base

class PassportCertificate(Base):
    __tablename__ = "passport_certificate"

    id = Column(Integer, primary_key=True, autoincrement=True)
    passport_id = Column(Integer, ForeignKey("passport.id"), nullable=False)
    certificate_id = Column(String(100), unique=True, nullable=False)
    certificate_type = Column(String(100), nullable=False)
    issuing_body = Column(String(200), nullable=False)
    valid_until = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
