import urllib.request
import json
from datetime import datetime, timedelta
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
import bcrypt
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.user import User

bearer = HTTPBearer()

def hash_password(password):
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password, hashed):
    return bcrypt.checkpw(password.encode(), hashed.encode())

# -- local jwt (kept, used in /auth/login) --
def create_token(user):
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
        "exp": datetime.utcnow() + timedelta(minutes=60)
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)

# -- supabase es256 jwt --
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

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer), db: Session = Depends(get_db)):
    token = credentials.credentials
    try:
        if settings.supabase_jwks_url:
            payload = _decode_supabase_token(token)
            uid = payload.get("sub")
            email = payload.get("email")

            # look up by supabase_uid first (stable), fall back to email for existing rows
            user = db.query(User).filter(User.supabase_uid == uid).first()
            if not user:
                user = db.query(User).filter(User.email == email).first()
                if user and uid and not user.supabase_uid:
                    # bind the uid on first login so future lookups use it
                    user.supabase_uid = uid
                    db.commit()
        else:
            # local jwt fallback
            payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
            user = db.query(User).filter(User.id == int(payload["sub"])).first()

        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def require_roles(roles: list):
    def check(user: User = Depends(get_current_user)):
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="Access denied")
        return user
    return check
