from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from app.database import Base

# event_type values: AUDIT, COMPLIANCE_CHECK, VERIFICATION, RECYCLING
class PassportEvent(Base):
    __tablename__ = "passport_event"

    id = Column(Integer, primary_key=True, autoincrement=True)
    passport_id = Column(Integer, ForeignKey("passport.id"), nullable=False)
    event_type = Column(String(50), nullable=False)
    performed_by = Column(Integer, ForeignKey("user.id"), nullable=True)
    event_date = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, nullable=True)
