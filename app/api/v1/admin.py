from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.schemas.user import AdminCreateUserRequest, AdminUpdateRoleRequest
from app.auth import get_current_user, require_roles

router = APIRouter()

VALID_ROLES = ["MANUFACTURER", "RECYCLER", "AUDITOR", "REGULATOR", "ADMIN"]

@router.post("/admin/users", status_code=201)
def create_user(data: AdminCreateUserRequest, db: Session = Depends(get_db), user: User = Depends(require_roles(["ADMIN"]))):
    existing = db.query(User).filter(User.email == data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")
    if data.role not in VALID_ROLES:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of {VALID_ROLES}")
    new_user = User(email=data.email, password_hash="supabase-managed", role=data.role)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"id": new_user.id, "email": new_user.email, "role": new_user.role}

@router.post("/admin/users/{user_id}/role")
def update_role(user_id: int, data: AdminUpdateRoleRequest, db: Session = Depends(get_db), user: User = Depends(require_roles(["ADMIN"]))):
    if data.role not in VALID_ROLES:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of {VALID_ROLES}")
    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    target.role = data.role
    db.commit()
    return {"id": target.id, "email": target.email, "role": target.role}

@router.get("/admin/users")
def list_users(db: Session = Depends(get_db), user: User = Depends(require_roles(["ADMIN"]))):
    users = db.query(User).all()
    return [{"id": u.id, "email": u.email, "role": u.role, "created_at": u.created_at} for u in users]
