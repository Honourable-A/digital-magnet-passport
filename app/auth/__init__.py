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


bearer = HTTPBearer(auto_error=False)



def hash_password(password):

    return bcrypt.hashpw(
        password.encode(),
        bcrypt.gensalt()
    ).decode()



def verify_password(password, hashed):

    return bcrypt.checkpw(
        password.encode(),
        hashed.encode()
    )



# -- local jwt (kept, used in /auth/login) --

def create_token(payload):

    payload["exp"] = (
        datetime.utcnow()
        + timedelta(
            minutes=settings.jwt_expiry_minutes
        )
    )

    return jwt.encode(
        payload,
        settings.jwt_secret,
        algorithm=settings.jwt_algorithm
    )



# -- Supabase access token verification --
def _get_supabase_user(token: str):
    """Validate a Supabase access token using the project's Auth API.

    Supabase projects can use either the legacy shared-secret JWT or newer
    asymmetric signing keys. Calling /auth/v1/user delegates signature,
    issuer, expiry, and project validation to the issuing Supabase project.
    """
    if not settings.supabase_url or not settings.supabase_anon_key:
        raise HTTPException(
            status_code=500,
            detail="Supabase authentication is not configured",
        )

    request = urllib.request.Request(
        f"{settings.supabase_url.rstrip('/')}/auth/v1/user",
        headers={
            "apikey": settings.supabase_anon_key,
            "Authorization": f"Bearer {token}",
            "Accept": "application/json",
        },
    )

    try:
        with urllib.request.urlopen(request, timeout=5) as response:
            user_data = json.loads(response.read())
    except Exception as exc:
        raise HTTPException(status_code=401, detail="Invalid token") from exc

    user_id = user_data.get("id")
    email = user_data.get("email")
    if not user_id or not email:
        raise HTTPException(status_code=401, detail="Invalid token")

    metadata = user_data.get("app_metadata") or {}
    user_metadata = user_data.get("user_metadata") or {}
    role = metadata.get("role") or user_metadata.get("role") or "PUBLIC"

    return {
        "supabase_uid": user_id,
        "email": email,
        "role": str(role).upper(),
    }



def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db)
):

    if not credentials:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )


    token = credentials.credentials


    try:

        if settings.supabase_url:
            from app.schemas.user import CurrentUser

            return CurrentUser(**_get_supabase_user(token))


        else:

            payload = jwt.decode(
                token,
                settings.jwt_secret,
                algorithms=[
                    settings.jwt_algorithm
                ]
            )


            user = (
                db.query(User)
                .filter(
                    User.id == int(payload["sub"])
                )
                .first()
            )


        if not user:

            raise HTTPException(
                status_code=401,
                detail="User not found"
            )


        return user



    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )




def require_roles(roles: list):

    def check(
        user: User = Depends(get_current_user)
    ):

        if user.role not in roles:

            raise HTTPException(
                status_code=403,
                detail="Access denied"
            )


        return user


    return check
