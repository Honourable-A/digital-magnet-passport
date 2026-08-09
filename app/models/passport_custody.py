from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, CheckConstraint
from app.database import Base

# tracks who holds custody of a passport/magnet at any point in time
# to_date = null means current holder
# custody_type values: Manufacturer, Recycler, Logistics, End User, Regulator
class PassportCustody(Base):
    __tablename__ = "passport_custody"
    __table_args__ = (
        CheckConstraint(
            "custody_type IN ('Manufacturer', 'Recycler', 'Logistics', 'End User', 'Regulator')",
            name="chk_custody_type"
        ),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    passport_id = Column(Integer, ForeignKey("passport.id"), nullable=False)
    company_id = Column(Integer, ForeignKey("company.id"), nullable=True)
    held_by = Column(String(200), nullable=True)   # free text fallback if company not in system
    custody_type = Column(String(50), nullable=False)
    from_date = Column(DateTime, nullable=False, default=datetime.utcnow)
    to_date = Column(DateTime, nullable=True)      # null = currently held
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
