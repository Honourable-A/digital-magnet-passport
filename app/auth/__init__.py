import urllib.request
import json
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from app.config import settings
from app.schemas.user import CurrentUser

bearer = HTTPBearer()

_jwks_cache = None

def _fetch_jwks():
    global _jwks_cache
    if _jwks_cache is None:
        with urllib.request.urlopen(settings.supabase_jwks_url, timeout=5) as resp:
            _jwks_cache = json.loads(resp.read())
    return _jwks_cache

def _decode_supabase_token(token: str) -> dict:
    header = jwt.get_unverified_header(token)
    kid = header.get("kid")
    jwks = _fetch_jwks()
    key = next((k for k in jwks["keys"] if k.get("kid") == kid), None)
    if key is None and jwks["keys"]:
        key = jwks["keys"][0]
    if key is None:
        raise HTTPException(status_code=401, detail="No matching JWK found")
    return jwt.decode(token, key, algorithms=["ES256"], options={"verify_aud": False})

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer)) -> CurrentUser:
    token = credentials.credentials
    try:
        payload = _decode_supabase_token(token)
        meta = payload.get("user_metadata") or {}
        role = meta.get("role", "MANUFACTURER").upper()
        return CurrentUser(
            supabase_uid=payload.get("sub", ""),
            email=payload.get("email", ""),
            role=role
        )
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def require_roles(roles: list):
    def check(user: CurrentUser = Depends(get_current_user)):
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="Access denied")
        return user
    return check
