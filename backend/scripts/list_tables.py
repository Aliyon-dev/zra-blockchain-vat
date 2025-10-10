"""List tables from DATABASE_URL (reads .env if present)."""
from dotenv import load_dotenv
load_dotenv()
import os
from sqlalchemy import create_engine, inspect

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is required")

print('Using DATABASE_URL=', '***masked***' if DATABASE_URL.startswith('postgresql://') else DATABASE_URL)
engine = create_engine(DATABASE_URL)
inspector = inspect(engine)
print('Tables:', inspector.get_table_names())
