"""Small script to test DB connectivity from the backend virtualenv.

It reads DATABASE_URL from env (or .env via python-dotenv) and attempts a simple SELECT 1.
Run:
    .\.venv\Scripts\python.exe db_health.py
"""
import os
from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import create_engine, text

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is required")
print('Using DATABASE_URL=', DATABASE_URL)

engine = create_engine(DATABASE_URL)

try:
    with engine.connect() as conn:
        r = conn.execute(text('SELECT 1'))
        val = r.scalar()
        print('DB responded:', val)
except Exception as e:
    print('DB connection failed:', e)
    raise
