from datetime import datetime
from sqlalchemy import Column, Integer, Boolean, String, DateTime, Date, Text, ForeignKey
from app.database import Base

class PassportCompliance(Base):
    __tablename__ = "passport_compliance"

    id = Column(Integer, primary_key=True, autoincrement=True)
    passport_id = Column(Integer, ForeignKey("passport.id"), nullable=False)

    # EU regulations
    crma = Column(Boolean, nullable=True)   # Critical Raw Materials Act
    espr = Column(Boolean, nullable=True)   # Ecodesign for Sustainable Products Regulation
    reach = Column(Boolean, nullable=True)  # REACH
    rohs = Column(Boolean, nullable=True)   # RoHS
    weee = Column(Boolean, nullable=True)   # WEEE
    cbam = Column(Boolean, nullable=True)   # Carbon Border Adjustment Mechanism
    esg = Column(Boolean, nullable=True)    # ESG reporting

    # UK regulations
    uk_reach = Column(Boolean, nullable=True)
    uk_rohs = Column(Boolean, nullable=True)
    uk_weee = Column(Boolean, nullable=True)

    audit_date = Column(Date, nullable=True)
    supporting_evidence = Column(Text, nullable=True)
    audit_status = Column(String(100), nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
