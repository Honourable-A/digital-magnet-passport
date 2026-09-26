from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, UniqueConstraint
from app.database import Base

class MRRelationship(Base):
    __tablename__ = "mr_relationship"
    __table_args__ = (
        UniqueConstraint("manufacturer_uid", "recycler_uid", name="uq_mr_pair"),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    manufacturer_uid = Column(String(36), nullable=False)
    recycler_uid = Column(String(36), nullable=False)
    authorized_by = Column(String(36), nullable=False)  # admin supabase_uid
    created_at = Column(DateTime, default=datetime.utcnow)
