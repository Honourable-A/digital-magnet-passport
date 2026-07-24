from datetime import datetime
from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from app.database import Base

# element composition by weight % (Nd, Pr, Dy, Tb, Ce, La, Sm, Fe, B)
class PassportMaterial(Base):
    __tablename__ = "passport_material"

    id = Column(Integer, primary_key=True, autoincrement=True)
    passport_id = Column(Integer, ForeignKey("passport.id"), nullable=False)
    nd = Column(Float, nullable=True)
    pr = Column(Float, nullable=True)
    dy = Column(Float, nullable=True)
    tb = Column(Float, nullable=True)
    ce = Column(Float, nullable=True)
    la = Column(Float, nullable=True)
    sm = Column(Float, nullable=True)
    fe = Column(Float, nullable=True)
    b = Column(Float, nullable=True)
    magnet_grade = Column(String(50), nullable=True)
    coercivity = Column(Float, nullable=True)
    remanence = Column(Float, nullable=True)
    temperature_class = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
