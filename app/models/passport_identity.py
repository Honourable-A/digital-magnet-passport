from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, Date, DateTime, ForeignKey
from app.database import Base

class PassportIdentity(Base):
    __tablename__ = "passport_identity"

    id = Column(Integer, primary_key=True, autoincrement=True)
    passport_id = Column(Integer, ForeignKey("passport.id"), nullable=False)
    magnet_type = Column(String(100), nullable=True)
    application_sector = Column(String(200), nullable=True)
    manufacturer = Column(String(200), nullable=True)
    country_of_origin = Column(String(100), nullable=True)
    manufacturing_date = Column(Date, nullable=True)
    current_stage = Column(String(100), nullable=True)
    status = Column(Boolean, nullable=True, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
