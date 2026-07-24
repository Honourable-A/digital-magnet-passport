from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Boolean, ForeignKey
from app.database import Base

class Passport(Base):
    __tablename__ = "passport"

    id = Column(Integer, primary_key=True, autoincrement=True)
    passport_id = Column(String(100), unique=True, nullable=False)
    magnet_type = Column(String(100), nullable=False)
    application_sector = Column(String(200), nullable=False)
    current_stage = Column(String(100), nullable=False)
    manufacturing_date = Column(Date, nullable=False)
    country_of_origin = Column(String(100), nullable=False)
    recycled_content = Column(Float, nullable=True)
    carbon_footprint = Column(Float, nullable=True)
    status = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
