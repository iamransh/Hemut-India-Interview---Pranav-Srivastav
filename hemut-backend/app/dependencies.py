from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from jose import JWTError
from .auth import decode_token

security = HTTPBearer()


def admin_required(token=Depends(security)):
    try:
        payload = decode_token(token.credentials)
        if not payload.get("is_admin"):
            raise HTTPException(status_code=403, detail="Admin only")
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
