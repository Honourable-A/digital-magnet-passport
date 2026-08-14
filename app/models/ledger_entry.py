from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text
from app.database import Base

# append-only — no update or delete endpoints exposed
class LedgerEntry(Base):
    __tablename__ = "ledger_entry"

    id = Column(Integer, primary_key=True, autoincrement=True)
    passport_id = Column(String(100), nullable=False)
    manufacturer_id = Column(Integer, nullable=False)   # peer_session.id
    recycler_id = Column(Integer, nullable=False)        # peer_session.id
    element = Column(String(10), nullable=False)
    operator = Column(String(5), nullable=False)    # gt / lt
    threshold = Column(Float, nullable=False)
    commitment = Column(String(100), nullable=False) # Poseidon(value_scaled, salt)
    salt = Column(Text, nullable=False)              # random 248-bit — allows server to verify commitment against payload_2
    payload_2 = Column(Text, nullable=False)         # Paillier(value_scaled)
    zk_proof = Column(Text, nullable=False)          # JSON
    public_signals = Column(Text, nullable=False)    # JSON array
    zk_valid = Column(Boolean, nullable=True)     # None = pending, True = valid, False = invalid
    tampered = Column(Boolean, nullable=False, default=False)
    submitted_at = Column(DateTime, default=datetime.utcnow)
