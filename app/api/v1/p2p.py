from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.models.peer_session import PeerSession
from app.schemas.user import CurrentUser
from app.auth import get_current_user
# from app.models.user import User  # removed — using CurrentUser from JWT

router = APIRouter()

class RegisterRequest(BaseModel):
    name: str = ""

class PeerOut(BaseModel):
    id: int
    supabase_uid: str | None
    name: str
    role: str
    ip_address: str | None
    session_count: int
    max_sessions: int
    connected_at: datetime

    class Config:
        from_attributes = True

@router.post("/p2p/register", status_code=201)
def register_peer(data: RegisterRequest, request: Request, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    ip = request.client.host
    name = user.email  # use email as identifier

    existing = db.query(PeerSession).filter(PeerSession.supabase_uid == user.supabase_uid).first()
    if existing:
        existing.status = "online"
        existing.name = name
        existing.ip_address = ip
        existing.last_seen = datetime.utcnow()
        db.commit()
        return {"message": "peer re-registered", "ip": ip, "peer_id": existing.id}

    peer = PeerSession(
        supabase_uid=user.supabase_uid,
        name=name,
        role=user.role,
        ip_address=ip,
        status="online",
        session_count=0
    )
    db.add(peer)
    db.commit()
    db.refresh(peer)
    return {"message": "peer registered", "ip": ip, "peer_id": peer.id}

@router.get("/p2p/peers", response_model=list[PeerOut])
def list_peers(db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    return db.query(PeerSession).filter(
        PeerSession.status == "online",
        PeerSession.session_count < PeerSession.max_sessions,
        PeerSession.supabase_uid != user.supabase_uid
    ).all()

@router.post("/p2p/connect/{peer_id}")
def connect_to_peer(peer_id: int, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    target = db.query(PeerSession).filter(PeerSession.id == peer_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Peer not found")
    if target.status != "online":
        raise HTTPException(status_code=400, detail="Peer is offline")
    if target.session_count >= target.max_sessions:
        raise HTTPException(status_code=400, detail="Peer has reached max sessions")

    target.session_count += 1
    me = db.query(PeerSession).filter(PeerSession.supabase_uid == user.supabase_uid).first()
    if me:
        me.session_count += 1
    db.commit()
    return {"message": "connected", "target_ip": target.ip_address}

@router.post("/p2p/disconnect/{peer_id}")
def disconnect_from_peer(peer_id: int, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    target = db.query(PeerSession).filter(PeerSession.id == peer_id).first()
    if target and target.session_count > 0:
        target.session_count -= 1
    me = db.query(PeerSession).filter(PeerSession.supabase_uid == user.supabase_uid).first()
    if me and me.session_count > 0:
        me.session_count -= 1
    db.commit()
    return {"message": "disconnected"}

@router.post("/p2p/heartbeat")
def heartbeat(db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    peer = db.query(PeerSession).filter(PeerSession.supabase_uid == user.supabase_uid).first()
    if peer:
        peer.last_seen = datetime.utcnow()
        db.commit()
    return {"ok": True}

@router.post("/p2p/leave")
def leave(db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    peer = db.query(PeerSession).filter(PeerSession.supabase_uid == user.supabase_uid).first()
    if peer:
        peer.status = "offline"
        peer.session_count = 0
        db.commit()
    return {"message": "offline"}
