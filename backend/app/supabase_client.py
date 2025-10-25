import os
from typing import Optional

import httpx
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

print(SUPABASE_URL)
print(SUPABASE_KEY)


def supabase_headers() -> dict:
    headers = {}
    if SUPABASE_KEY:
        headers['apikey'] = SUPABASE_KEY
        headers['Authorization'] = f'Bearer {SUPABASE_KEY}'
    return headers


def ping_supabase(timeout: float = 3.0) -> Optional[int]:
    """Perform a minimal GET request to Supabase REST root to verify connectivity.

    Returns HTTP status code on success or None on error.
    """
    if not SUPABASE_URL:
        return None

    try:
        with httpx.Client(timeout=timeout) as client:
            resp = client.get(SUPABASE_URL, headers=supabase_headers())
            return resp.status_code
    except Exception:
        return None

