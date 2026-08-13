from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text
from app.database import Base

# append-only — no update or delete endpoints exposed
class LedgerEntry(Base):
    __tablename__ = "ledger_entry"

    id = Column(Integer, primary_key=True, autoincrement=True)
    passport_id = Column(String(100), nullable=False)
    manufacturer_uid = Column(String(36), nullable=False)
    recycler_uid = Column(String(36), nullable=False)
    element = Column(String(10), nullable=False)
    operator = Column(String(5), nullable=False)    # gt / lt
    threshold = Column(Float, nullable=False)
    commitment = Column(String(100), nullable=False) # Poseidon hash as decimal string
    payload_1 = Column(Text, nullable=False)         # AES-GCM ciphertext JSON {iv, ct}
    payload_2 = Column(Text, nullable=False)         # Paillier ciphertext decimal string
    zk_proof = Column(Text, nullable=False)          # JSON
    public_signals = Column(Text, nullable=False)    # JSON array
    tampered = Column(Boolean, nullable=False, default=False)
    submitted_at = Column(DateTime, default=datetime.utcnow)
