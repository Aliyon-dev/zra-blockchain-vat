import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database configuration
DEV_CREATE_DB = os.getenv("DEV_CREATE_DB", "false").lower() == "true"
DATABASE_URL = os.getenv("DATABASE_URL")

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Validate required Supabase configuration
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL environment variable is required and must point to your Supabase Postgres instance")

if not SUPABASE_URL:
    raise RuntimeError("SUPABASE_URL environment variable is required")

if not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_KEY environment variable is required")

# Blockchain configuration
LEDGER_PATH = os.getenv("LEDGER_PATH", "ledger.json")

# CORS configuration
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]

# Add production origins if needed
if os.getenv("NODE_ENV") == "production":
    ALLOWED_ORIGINS.extend([
        os.getenv("FRONTEND_URL", "https://your-domain.com"),
    ])
