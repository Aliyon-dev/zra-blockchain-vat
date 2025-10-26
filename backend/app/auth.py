"""
Authentication module for Supabase JWT verification
"""

import jwt
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
# We now need SUPABASE_URL, not the secret
from app.config import SUPABASE_URL
from typing import Optional
import logging
import jwt

security = HTTPBearer()
print(f"SUPABASE_URL: {SUPABASE_URL}")

# --- NEW: JWKS Client ---
# This client will fetch the public key from Supabase to verify the token
# This is the standard URL for all Supabase projects
try:
    jwks_url = f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json"
    jwks_client = jwt.PyJWKClient(jwks_url)
except Exception as e:
    logging.error(f"Could not initialize JWKS client: {e}")
    jwks_client = None

def verify_jwt_token(token: str) -> dict:
    decoded_header = jwt.get_unverified_header(token)
    print(decoded_header)
    """
    Verify Supabase JWT token and extract user information
    
    Args:
        token: JWT token string
        
    Returns:
        dict: Decoded JWT payload with user information
        
    Raises:
        HTTPException: If token is invalid or expired
    """
    if jwks_client is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Auth system not initialized. Check SUPABASE_URL."
        )

    try:
        # --- FIX: Get the signing key from the JWKS client ---
        signing_key = jwks_client.get_signing_key_from_jwt(token).key

        # --- FIX: Decode using the key and the RS256 algorithm ---
        payload = jwt.decode(
            token,
            signing_key,
            algorithms=["ES256"], # <-- The new, correct algorithm
            audience="authenticated", # <-- Check the audience
            options={"verify_exp": True}
        )
        
        logging.info(f"JWT payload: {payload}")
        print(f"JWT payload: {payload}")
        
        # Extract user ID from Supabase JWT structure
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing user ID"
            )
            
        return payload
        
    except jwt.ExpiredSignatureError as e:
        print(f"TOKEN ERROR: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired"
        )
    except jwt.InvalidAudienceError as e:
        print(f"TOKEN ERROR: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token audience"
        )
    except jwt.InvalidTokenError as e:
        print(f"TOKEN ERROR: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    except Exception as e:
        print(f"TOKEN ERROR: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token verification failed: {str(e)}"
        )

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    FastAPI dependency to get current authenticated user
    """
    token = credentials.credentials
    payload = verify_jwt_token(token)
    
    return {
        "user_id": payload.get("sub"),
        "email": payload.get("email"),
        "role": payload.get("role", "authenticated"),
        "aud": payload.get("aud"),
        "exp": payload.get("exp")
    }

def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """
    FastAPI dependency to get current user ID only
    """
    user = get_current_user(credentials)
    return user["user_id"]