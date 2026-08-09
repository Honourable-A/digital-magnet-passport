from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from app.database import Base

# relationship_type values: recovered_from, recycled_into
# recovery_method values: short_loop_recycling, long_loop_recycling, urban_mining, remanufacturing
class PassportLineage(Base):
    __tablename__ = "passport_lineage"

    id = Column(Integer, primary_key=True, autoincrement=True)
    source_passport_id = Column(Integer, ForeignKey("passport.id"), nullable=False)
    target_passport_id = Column(Integer, ForeignKey("passport.id"), nullable=False)
    relationship_type = Column(String(50), nullable=False)   # recovered_from / recycled_into
    recovery_method = Column(String(100), nullable=True)     # short_loop_recycling etc.
    generation_number = Column(Integer, nullable=True)       # how many times material has been cycled
    created_at = Column(DateTime, default=datetime.utcnow)
