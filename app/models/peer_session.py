from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from app.database import Base

# tracks clients currently available for P2P ZKP connections
# status values: online, busy, offline
class PeerSession(Base):
    __tablename__ = "peer_session"

    id = Column(Integer, primary_key=True, autoincrement=True)
    supabase_uid = Column(String(36), nullable=True)
    name = Column(String(100), nullable=False)
    role = Column(String(50), nullable=False)
    ip_address = Column(String(45), nullable=True)   # varchar(45) covers ipv4 and ipv6
    status = Column(String(20), nullable=False, default="online")  # online / offline
    session_count = Column(Integer, nullable=False, default=0)      # active p2p sessions
    max_sessions = Column(Integer, nullable=False, default=3)       # cap per peer
    connected_at = Column(DateTime, default=datetime.utcnow)
    last_seen = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
