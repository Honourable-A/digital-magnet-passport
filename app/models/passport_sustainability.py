from datetime import datetime
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from app.database import Base

class PassportSustainability(Base):
    __tablename__ = "passport_sustainability"

    id = Column(Integer, primary_key=True, autoincrement=True)
    passport_id = Column(Integer, ForeignKey("passport.id"), nullable=False)
    recycled_content = Column(Float, nullable=True)
    carbon_footprint = Column(Float, nullable=True)
    radioactivity = Column(Float, nullable=True)
    conflict_mineral_status = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
