from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
# from app.models.user import User  # removed — user table dropped, managed by Supabase Auth
from app.schemas.user import CurrentUser, AdminCreateUserRequest, AdminUpdateRoleRequest
from app.auth import get_current_user, require_roles

router = APIRouter()

VALID_ROLES = ["MANUFACTURER", "RECYCLER", "AUDITOR", "REGULATOR", "ADMIN"]

# user creation and role management are now done via Supabase Auth Admin API
# roles are stored in raw_user_meta_data on auth.users

@router.post("/admin/users", status_code=201)
def create_user(data: AdminCreateUserRequest, user: CurrentUser = Depends(require_roles(["ADMIN"]))):
    # previously inserted into public.user table
    # now: create user in Supabase Auth via Admin API (service role key required)
    # this endpoint is kept as a placeholder — implement with supabase-py Admin client
    if data.role not in VALID_ROLES:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of {VALID_ROLES}")
    return {"message": "User creation must be done via Supabase Auth Admin API", "email": data.email, "role": data.role}

@router.post("/admin/users/{user_uid}/role")
def update_role(user_uid: str, data: AdminUpdateRoleRequest, user: CurrentUser = Depends(require_roles(["ADMIN"]))):
    # previously updated public.user.role by integer user_id
    # now: update raw_user_meta_data on Supabase auth.users via Admin API
    if data.role not in VALID_ROLES:
        raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of {VALID_ROLES}")
    return {"message": "Role update must be done via Supabase Auth Admin API", "supabase_uid": user_uid, "role": data.role}

@router.get("/admin/users")
def list_users(user: CurrentUser = Depends(require_roles(["ADMIN"]))):
    # previously queried public.user table
    # now: list users from Supabase Auth Admin API (service role key required)
    return {"message": "User listing must be done via Supabase Auth Admin API"}
