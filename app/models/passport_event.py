from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, CheckConstraint
from app.database import Base

# event_type values: End of Life, Recovery, Recycling, Re-manufacturing
VALID_EVENT_TYPES = [
    "Manufactured", "Deployed", "Testing", "Verified",
    "End of Life", "Recovery", "Recycling", "Re-manufacturing",
    "Demagnetisation", "Hydrogen Decrepitation",
    "Powder/Alloy Processing", "Oxide Production", "Sintering"
]

class PassportEvent(Base):
    __tablename__ = "passport_event"
    __table_args__ = (
        CheckConstraint(
            "event_type IN ("
            "'Manufactured','Deployed','Testing','Verified',"
            "'End of Life','Recovery','Recycling','Re-manufacturing',"
            "'Demagnetisation','Hydrogen Decrepitation',"
            "'Powder/Alloy Processing','Oxide Production','Sintering'"
            ")",
            name="chk_passport_event_type"
        ),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    passport_id = Column(Integer, ForeignKey("passport.id"), nullable=False)
    event_type = Column(String(50), nullable=False)
    performed_by = Column(String(36), nullable=True)  # supabase_uid
    event_date = Column(DateTime, default=datetime.utcnow)
    notes = Column(Text, nullable=True)
