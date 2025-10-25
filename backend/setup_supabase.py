#!/usr/bin/env python3
"""
Supabase Setup Script for ZRA Blockchain Invoice Verification System

This script helps set up the Supabase database with the required tables and migrations.
"""

import os
import sys
import subprocess
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import text

def load_environment():
    """Load environment variables from .env file"""
    env_path = Path(".env")
    if env_path.exists():
        load_dotenv(env_path)
        print("✅ Loaded environment variables from .env")
    else:
        print("⚠️  No .env file found. Please create one with your Supabase credentials.")
        return False
    return True

def check_supabase_connection():
    """Check if Supabase connection is working"""
    try:
        from app.database import engine
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✅ Supabase database connection successful")
            return True
    except Exception as e:
        print(f"❌ Supabase connection failed: {e}")
        return False

def run_migrations():
    """Run Alembic migrations to set up database schema"""
    try:
        print("🔄 Running database migrations...")
        result = subprocess.run(
            ["alembic", "upgrade", "head"],
            capture_output=True,
            text=True,
            cwd=Path(__file__).parent
        )
        
        if result.returncode == 0:
            print("✅ Database migrations completed successfully")
            return True
        else:
            print(f"❌ Migration failed: {result.stderr}")
            return False
    except FileNotFoundError:
        print("❌ Alembic not found. Please install it: pip install alembic")
        return False
    except Exception as e:
        print(f"❌ Migration error: {e}")
        return False

def create_initial_data():
    """Create any initial data if needed"""
    try:
        from app.database import SessionLocal
        from app.models.models import InvoiceStatus
        
        db = SessionLocal()
        try:
            # Check if we have any invoices
            from app.models.models import Invoice
            invoice_count = db.query(Invoice).count()
            print(f"📊 Database contains {invoice_count} invoices")
            
            # You can add initial data creation here if needed
            print("✅ Initial data check completed")
            return True
        finally:
            db.close()
    except Exception as e:
        print(f"❌ Error checking initial data: {e}")
        return False

def main():
    """Main setup function"""
    print("🚀 Setting up Supabase for ZRA Blockchain Invoice Verification System")
    print("=" * 70)
    
    # Step 1: Load environment
    if not load_environment():
        print("\n📝 Please create a .env file with the following variables:")
        print("DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres")
        print("SUPABASE_URL=https://[PROJECT-REF].supabase.co")
        print("SUPABASE_KEY=[YOUR-ANON-KEY]")
        print("SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]")
        return False
    
    # Step 2: Check connection
    if not check_supabase_connection():
        print("\n🔧 Please check your DATABASE_URL in the .env file")
        return False
    
    # Step 3: Run migrations
    if not run_migrations():
        print("\n🔧 Please check your database permissions and try again")
        return False
    
    # Step 4: Check initial data
    if not create_initial_data():
        print("\n⚠️  Database setup completed but initial data check failed")
        return False
    
    print("\n🎉 Supabase setup completed successfully!")
    print("\n📋 Next steps:")
    print("1. Start the backend: uvicorn app.main:app --reload")
    print("2. Test the health endpoints: http://localhost:8000/supabase/health")
    print("3. Test the database health: http://localhost:8000/db/health")
    print("4. Start the frontend: npm run dev")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
