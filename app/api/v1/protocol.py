import json
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from phe import paillier

from app.database import get_db
from app.models.mr_relationship import MRRelationship
from app.models.ledger_entry import LedgerEntry
from app.models.peer_session import PeerSession
from app.schemas.user import CurrentUser
from app.auth import get_current_user, require_roles

router = APIRouter()

# -- hardcoded Paillier keys (demo) --
_HE_N = int("df51777debcee2635df412f6185ed6e5e01cf30f84b5307f79bb124b9785aa120849175349138e4dca489b6fbc5dae4dfe665b695c50011f3e009c6c7dc0625c6b1a777a61786efd07cb8a64975ca4e85b6647459424accc08ce0f78a33cc29d44fdd2e7aa074ea78d7fb825de411026ad2598788bc3337a5fdfa684139537bd", 16)
_HE_P = int("eabe3a0aad985a37085ece2d7974da1469216800190b0b2805391a49524aaa5ec18d9202e4003a4cb69df2ac86907b30ef0b3c8fa9c51c5fb968eb26b1d599e7", 16)
_HE_Q = int("f38a642bd4460e1d20d621086f1b7a056a117a0486a9fbf2d4bd2103fff3b3f25a5f74ef2a68ce058de20d3e83ae61abde2f5c79a14ff3a85ffb664043c254bb", 16)
_HE_PK = paillier.PaillierPublicKey(_HE_N)
_HE_SK = paillier.PaillierPrivateKey(_HE_PK, _HE_P, _HE_Q)
_MIN_CONTRIBUTORS = 2  # suppress aggregation below this count (set low for demo)


# ── schemas ──────────────────────────────────────────────────────────────────

class RelationshipCreate(BaseModel):
    manufacturer_uid: str
    recycler_uid: str

class LedgerSubmit(BaseModel):
    passport_id: str
    recycler_uid: str   # resolved to peer_session.id server-side
    element: str
    operator: str
    threshold: float
    commitment: str
    salt: str           # allows server to verify Poseidon(value_scaled, salt) === commitment
    payload_2: str      # Paillier(value_scaled)
    zk_proof: str       # JSON string
    public_signals: str # JSON array string


# ── HE public key ────────────────────────────────────────────────────────────

@router.get("/he/public-key")
def get_he_public_key(user: CurrentUser = Depends(get_current_user)):
    return {"n": hex(_HE_N)[2:]}


# ── Admin: peer listing + relationship management ─────────────────────────────

@router.get("/admin/peers")
def admin_all_peers(db: Session = Depends(get_db), user: CurrentUser = Depends(require_roles(["ADMIN"]))):
    peers = db.query(PeerSession).all()
    return [{"id": p.id, "supabase_uid": p.supabase_uid, "name": p.name, "role": p.role, "status": p.status} for p in peers]

@router.post("/admin/relationships", status_code=201)
def create_relationship(data: RelationshipCreate, db: Session = Depends(get_db), user: CurrentUser = Depends(require_roles(["ADMIN"]))):
    existing = db.query(MRRelationship).filter_by(
        manufacturer_uid=data.manufacturer_uid, recycler_uid=data.recycler_uid
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail="Relationship already exists")
    rel = MRRelationship(
        manufacturer_uid=data.manufacturer_uid,
        recycler_uid=data.recycler_uid,
        authorized_by=user.supabase_uid
    )
    db.add(rel)
    db.commit()
    db.refresh(rel)
    return {"id": rel.id, "manufacturer_uid": rel.manufacturer_uid, "recycler_uid": rel.recycler_uid}

@router.delete("/admin/relationships/{rel_id}", status_code=204)
def delete_relationship(rel_id: int, db: Session = Depends(get_db), user: CurrentUser = Depends(require_roles(["ADMIN"]))):
    rel = db.query(MRRelationship).filter_by(id=rel_id).first()
    if not rel:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(rel)
    db.commit()

@router.get("/admin/relationships")
def list_all_relationships(db: Session = Depends(get_db), user: CurrentUser = Depends(require_roles(["ADMIN"]))):
    rels = db.query(MRRelationship).all()
    return [{"id": r.id, "manufacturer_uid": r.manufacturer_uid, "recycler_uid": r.recycler_uid, "created_at": r.created_at} for r in rels]


# ── Relationships: authenticated user's own pairs ─────────────────────────────

@router.get("/relationships")
def my_relationships(db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
    from sqlalchemy import or_
    rels = db.query(MRRelationship).filter(
        or_(MRRelationship.manufacturer_uid == user.supabase_uid,
            MRRelationship.recycler_uid == user.supabase_uid)
    ).all()
    return [{"id": r.id, "manufacturer_uid": r.manufacturer_uid, "recycler_uid": r.recycler_uid} for r in rels]

def _assert_authorized(manufacturer_uid: str, recycler_uid: str, db: Session):
    rel = db.query(MRRelationship).filter_by(
        manufacturer_uid=manufacturer_uid, recycler_uid=recycler_uid
    ).first()
    if not rel:
        raise HTTPException(status_code=403, detail="No authorized relationship between these peers")


# ── Ledger ───────────────────────────────────────────────────────────────────

def _resolve_peer_id(uid: str, db: Session) -> int:
    peer = db.query(PeerSession).filter_by(supabase_uid=uid).order_by(PeerSession.id.desc()).first()
    if not peer:
        raise HTTPException(status_code=404, detail=f"Peer not registered: {uid[:8]}")
    return peer.id

@router.post("/ledger", status_code=201)
def submit_to_ledger(data: LedgerSubmit, db: Session = Depends(get_db), user: CurrentUser = Depends(require_roles(["MANUFACTURER"]))):
    # _assert_authorized(user.supabase_uid, data.recycler_uid, db)
    mfr_id = _resolve_peer_id(user.supabase_uid, db)
    rec_id  = _resolve_peer_id(data.recycler_uid, db)

    # arithmetic consistency check: decrypt payload_2 and verify against public signals
    try:
        sigs = json.loads(data.public_signals)
        value_scaled_dec = _HE_SK.decrypt(paillier.EncryptedNumber(_HE_PK, int(data.payload_2), exponent=0))
        result_sig       = int(sigs[0])
        threshold_scaled = int(sigs[2])
        is_gt            = int(sigs[3])
        expected_result  = int(value_scaled_dec > threshold_scaled) if is_gt else int(value_scaled_dec < threshold_scaled)
        if expected_result != result_sig:
            raise HTTPException(status_code=400, detail="payload_2 is inconsistent with public signals")
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(status_code=400, detail="Could not verify payload_2 consistency")

    entry = LedgerEntry(
        passport_id=data.passport_id,
        manufacturer_id=mfr_id,
        recycler_id=rec_id,
        element=data.element,
        operator=data.operator,
        threshold=data.threshold,
        commitment=data.commitment,
        salt=data.salt,
        payload_2=data.payload_2,
        zk_proof=data.zk_proof,
        public_signals=data.public_signals,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return {"id": entry.id, "submitted_at": entry.submitted_at}

@router.get("/ledger/{passport_id}")
def get_ledger_entry(
    passport_id: str,
    manufacturer_uid: str | None = None,
    db: Session = Depends(get_db),
    user: CurrentUser = Depends(require_roles(["RECYCLER", "AUDITOR", "ADMIN"]))
):
    q = db.query(LedgerEntry).filter(LedgerEntry.passport_id == passport_id)
    if manufacturer_uid:
        peer = db.query(PeerSession).filter_by(supabase_uid=manufacturer_uid).order_by(PeerSession.id.desc()).first()
        if peer:
            q = q.filter(LedgerEntry.manufacturer_id == peer.id)
    entries = q.order_by(LedgerEntry.submitted_at.desc()).all()
    return [{
        "id": e.id, "passport_id": e.passport_id,
        "manufacturer_id": e.manufacturer_id, "recycler_id": e.recycler_id,
        "element": e.element, "operator": e.operator, "threshold": e.threshold,
        "commitment": e.commitment,
        "payload_2": e.payload_2,
        "zk_proof": json.loads(e.zk_proof),
        "public_signals": json.loads(e.public_signals),
        "tampered": e.tampered, "submitted_at": e.submitted_at
    } for e in entries]

@router.get("/ledger")
def list_ledger(db: Session = Depends(get_db), user: CurrentUser = Depends(require_roles(["AUDITOR", "ADMIN"]))):
    entries = db.query(LedgerEntry).order_by(LedgerEntry.submitted_at.desc()).limit(200).all()
    return [{
        "id": e.id, "passport_id": e.passport_id,
        "manufacturer_id": e.manufacturer_id, "recycler_id": e.recycler_id,
        "element": e.element, "operator": e.operator, "threshold": e.threshold,
        "commitment": e.commitment, "tampered": e.tampered, "submitted_at": e.submitted_at
    } for e in entries]

@router.post("/ledger/{entry_id}/flag")
def flag_tamper(entry_id: int, db: Session = Depends(get_db), user: CurrentUser = Depends(require_roles(["RECYCLER"]))):
    entry = db.query(LedgerEntry).filter_by(id=entry_id).first()
    if not entry:
        raise HTTPException(status_code=404, detail="Ledger entry not found")
    my_peer = db.query(PeerSession).filter_by(supabase_uid=user.supabase_uid).order_by(PeerSession.id.desc()).first()
    if not my_peer or entry.recycler_id != my_peer.id:
        raise HTTPException(status_code=403, detail="Not your ledger entry")
    entry.tampered = True
    db.commit()
    return {"flagged": True, "entry_id": entry_id}


# ── Auditor: HE aggregation ───────────────────────────────────────────────────

@router.get("/auditor/aggregate/{passport_id}")
def auditor_aggregate(passport_id: str, db: Session = Depends(get_db), user: CurrentUser = Depends(require_roles(["AUDITOR"]))):
    entries = db.query(LedgerEntry).filter(
        LedgerEntry.passport_id == passport_id,
        LedgerEntry.tampered == False
    ).all()
    count = len(entries)
    if count < _MIN_CONTRIBUTORS:
        return {"suppressed": True, "reason": f"fewer than {_MIN_CONTRIBUTORS} contributors", "count": count}

    ciphertexts = [int(e.payload_2) for e in entries]
    total_enc = paillier.EncryptedNumber(_HE_PK, ciphertexts[0], exponent=0)
    for ct in ciphertexts[1:]:
        total_enc = total_enc + paillier.EncryptedNumber(_HE_PK, ct, exponent=0)

    return {
        "suppressed": False,
        "count": count,
        "passport_id": passport_id,
        "encrypted_sum": str(total_enc.ciphertext()),
    }


# ── Regulator: decrypt aggregate ─────────────────────────────────────────────

@router.get("/regulator/decrypt/{passport_id}")
def regulator_decrypt(passport_id: str, db: Session = Depends(get_db), user: CurrentUser = Depends(require_roles(["REGULATOR"]))):
    entries = db.query(LedgerEntry).filter(
        LedgerEntry.passport_id == passport_id,
        LedgerEntry.tampered == False
    ).all()
    count = len(entries)
    if count < _MIN_CONTRIBUTORS:
        return {"suppressed": True, "reason": f"fewer than {_MIN_CONTRIBUTORS} contributors", "count": count}

    ciphertexts = [int(e.payload_2) for e in entries]
    total_enc = paillier.EncryptedNumber(_HE_PK, ciphertexts[0], exponent=0)
    for ct in ciphertexts[1:]:
        total_enc = total_enc + paillier.EncryptedNumber(_HE_PK, ct, exponent=0)

    total_scaled = _HE_SK.decrypt(total_enc)
    average_pct = (total_scaled / 10) / count

    return {
        "suppressed": False,
        "passport_id": passport_id,
        "count": count,
        "total_scaled": total_scaled,
        "average_pct": round(average_pct, 2),
        "element": entries[0].element if entries else None,
    }
