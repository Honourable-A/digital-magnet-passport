from fastapi import APIRouter

# passport CRUD, composition, provenance, audit — moved to Supabase + Next.js
# per supervisor direction: FastAPI reserved for ZKP, blockchain, HE only
# all commented endpoints below are kept for reference

# from fastapi import Depends, HTTPException
# from sqlalchemy.orm import Session
# from app.database import get_db
# from app.models.passport import Passport
# from app.models.company import Company
# from app.models.supply_chain_edge import SupplyChainEdge
# from app.models.audit_log import AuditLog
# from app.schemas.passport import PassportCreate, PassportUpdate, PassportOut
# from app.schemas.user import CurrentUser
# from app.auth import get_current_user, require_roles
# from app.utils import log_action, composition_presence, composition_ranges, composition_exact, composition_full

router = APIRouter()

# ALL_ROLES = ["PUBLIC", "PARTNER", "MANUFACTURER", "RECYCLER", "AUDITOR", "REGULATOR", "ADMIN"]
# RECYCLER_AND_ABOVE = ["MANUFACTURER", "RECYCLER", "AUDITOR", "REGULATOR", "ADMIN"]
# AUDITOR_AND_ABOVE = ["AUDITOR", "REGULATOR", "ADMIN"]

@router.get("/health")
def health_check():
    return {"status": "ok"}

# -- auth --
# @router.post("/auth/logout")
# def logout(user: CurrentUser = Depends(get_current_user)):
#     return {"message": "Logged out successfully"}

# -- passport CRUD (now handled by Next.js → Supabase directly) --

# @router.post("/passport", response_model=PassportOut)
# def create_passport(data: PassportCreate, db: Session = Depends(get_db), user: CurrentUser = Depends(require_roles(ALL_ROLES))):
#     passport = Passport(**data.model_dump())
#     db.add(passport)
#     db.commit()
#     db.refresh(passport)
#     log_action(db, user.supabase_uid, "CREATE_PASSPORT", "passport", passport.id)
#     return passport

# @router.get("/passport/all", response_model=list[PassportOut])
# def list_passports(db: Session = Depends(get_db), user: CurrentUser = Depends(require_roles(ALL_ROLES))):
#     return db.query(Passport).all()

# @router.get("/passport/{id}", response_model=PassportOut)
# def get_passport(id: int, db: Session = Depends(get_db), user: CurrentUser = Depends(require_roles(ALL_ROLES))):
#     passport = db.query(Passport).filter(Passport.id == id).first()
#     if not passport:
#         raise HTTPException(status_code=404, detail="Passport not found")
#     log_action(db, user.supabase_uid, "VIEW_PASSPORT", "passport", id)
#     return passport

# @router.put("/passport/{id}", response_model=PassportOut)
# def update_passport(id: int, data: PassportUpdate, db: Session = Depends(get_db), user: CurrentUser = Depends(require_roles(RECYCLER_AND_ABOVE))):
#     passport = db.query(Passport).filter(Passport.id == id).first()
#     if not passport:
#         raise HTTPException(status_code=404, detail="Passport not found")
#     for key, value in data.model_dump(exclude_unset=True).items():
#         setattr(passport, key, value)
#     db.commit()
#     db.refresh(passport)
#     log_action(db, user.supabase_uid, "UPDATE_PASSPORT", "passport", id)
#     return passport

# -- provenance (now handled by Next.js → Supabase directly) --

# @router.get("/passport/{id}/provenance")
# def get_provenance(id: int, db: Session = Depends(get_db), user: CurrentUser = Depends(require_roles(ALL_ROLES))):
#     edges = db.query(SupplyChainEdge).all()
#     path = []
#     current = id
#     visited = set()
#     while current and current not in visited:
#         visited.add(current)
#         company = db.query(Company).filter(Company.id == current).first()
#         if company:
#             path.append(company.name)
#         next_edge = next((e for e in edges if e.source_company == current), None)
#         current = next_edge.target_company if next_edge else None
#     log_action(db, user.supabase_uid, "VIEW_PROVENANCE", "passport", id)
#     return {"path": path}

# -- composition selective disclosure (deferred per supervisor) --

# @router.get("/passport/{id}/composition")
# def get_composition(id: int, db: Session = Depends(get_db), user: CurrentUser = Depends(get_current_user)):
#     from app.models.passport_material import PassportMaterial
#     result = db.query(PassportMaterial).filter(PassportMaterial.passport_id == id).first()
#     if not result:
#         raise HTTPException(status_code=404, detail="Composition not found")
#     log_action(db, user.supabase_uid, "VIEW_COMPOSITION", "passport", id)
#     role = user.role
#     if role in ["RECYCLER", "AUDITOR"]:
#         return composition_exact(result)
#     else:
#         return composition_full(result)

# -- audit (now handled by Next.js → Supabase directly) --

# @router.get("/passport/{id}/audit")
# def get_audit(id: int, db: Session = Depends(get_db), user: CurrentUser = Depends(require_roles(AUDITOR_AND_ABOVE))):
#     from app.models.passport_compliance import PassportCompliance
#     log_action(db, user.supabase_uid, "VIEW_AUDIT", "passport", id)
#     return db.query(PassportCompliance).filter(PassportCompliance.passport_id == id).first()

# @router.get("/audit/passport/{id}")
# def get_audit_log(id: int, db: Session = Depends(get_db), user: CurrentUser = Depends(require_roles(AUDITOR_AND_ABOVE))):
#     logs = db.query(AuditLog).filter(AuditLog.entity_type == "passport", AuditLog.entity_id == id).order_by(AuditLog.timestamp).all()
#     return [{"id": l.id, "supabase_uid": l.supabase_uid, "action": l.action, "entity_type": l.entity_type, "entity_id": l.entity_id, "timestamp": l.timestamp} for l in logs]
