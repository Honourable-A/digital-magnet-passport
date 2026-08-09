from fastapi import APIRouter

# admin user management — handled entirely via Supabase Auth Admin API
# roles stored in raw_user_meta_data on auth.users; no local user table
# router not mounted in main.py

router = APIRouter()

# VALID_ROLES = ["MANUFACTURER", "RECYCLER", "AUDITOR", "REGULATOR", "ADMIN"]

# @router.post("/admin/users", status_code=201)
# def create_user(data: AdminCreateUserRequest, user: CurrentUser = Depends(require_roles(["ADMIN"]))):
#     if data.role not in VALID_ROLES:
#         raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of {VALID_ROLES}")
#     return {"message": "User creation must be done via Supabase Auth Admin API", "email": data.email, "role": data.role}

# @router.post("/admin/users/{user_uid}/role")
# def update_role(user_uid: str, data: AdminUpdateRoleRequest, user: CurrentUser = Depends(require_roles(["ADMIN"]))):
#     if data.role not in VALID_ROLES:
#         raise HTTPException(status_code=400, detail=f"Invalid role. Must be one of {VALID_ROLES}")
#     return {"message": "Role update must be done via Supabase Auth Admin API", "supabase_uid": user_uid, "role": data.role}

# @router.get("/admin/users")
# def list_users(user: CurrentUser = Depends(require_roles(["ADMIN"]))):
#     return {"message": "User listing must be done via Supabase Auth Admin API"}
