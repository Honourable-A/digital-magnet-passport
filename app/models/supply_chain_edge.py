from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from app.database import Base

class SupplyChainEdge(Base):
    __tablename__ = "supply_chain_edge"

    id = Column(Integer, primary_key=True, autoincrement=True)
    source_company = Column(Integer, ForeignKey("company.id"), nullable=False)
    target_company = Column(Integer, ForeignKey("company.id"), nullable=False)
    relationship_type = Column(String(100), nullable=False)
    confidence_score = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
