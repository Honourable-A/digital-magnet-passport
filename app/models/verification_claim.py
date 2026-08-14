from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from app.database import Base

class VerificationClaim(Base):
    __tablename__ = "verification_claim"

    claim_id = Column(Integer, primary_key=True, autoincrement=True)
    passport_id = Column(Integer, ForeignKey("passport.id"), nullable=False)
    claim_type = Column(String(100), nullable=False)
    result = Column(Boolean, nullable=False)
    verification_date = Column(DateTime, default=datetime.utcnow)
