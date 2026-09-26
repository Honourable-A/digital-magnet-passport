from pydantic import BaseModel


class RegisterRequest(BaseModel):
    email: str
    password: str
    role: str = "PUBLIC"


class LoginRequest(BaseModel):
    email: str
    password: str


class AdminCreateUserRequest(BaseModel):
    email: str
    role: str


class AdminUpdateRoleRequest(BaseModel):
    role: str


class CurrentUser(BaseModel):
    supabase_uid: str
    email: str
    role: str