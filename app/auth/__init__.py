from datetime import datetime, timedelta

from fastapi import Depends, HTTPException, Request
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


def create_token(user):
    payload = {
        "sub": str(user.id),
        "email": user.email,
        "role": user.role,
        "exp": datetime.utcnow()
        + timedelta(minutes=settings.jwt_expiry_minutes)
    }

    return jwt.encode(
        payload,
        settings.jwt_secret,
        algorithm=settings.jwt_algorithm
    )


def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(bearer),
    db: Session = Depends(get_db),
):

    token = None


    # 1. Try Authorization header first
    if credentials:
        token = credentials.credentials
        print("TOKEN FROM HEADER:", token)


    # 2. If no header, try cookie
    if not token:
        token = request.cookies.get("access_token")
        print("TOKEN FROM COOKIE:", token)


    if not token:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )


    try:

        payload = jwt.decode(
            token,
            settings.jwt_secret,
            algorithms=[
                settings.jwt_algorithm
            ],
        )

        print("PAYLOAD:", payload)


        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )


        user = (
            db.query(User)
            .filter(
                User.id == int(user_id)
            )
            .first()
        )


        if not user:
            raise HTTPException(
                status_code=401,
                detail="User not found"
            )


        return user


    except JWTError as e:

        print("JWT ERROR:", e)

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