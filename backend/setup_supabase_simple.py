#!/usr/bin/env python3
"""
Simple Supabase Setup Script for ZRA Blockchain Invoice Verification System
"""

import os
import sys
from pathlib import Path

def check_environment():
    """Check if required environment variables are set"""
    required_vars = [
        "DATABASE_URL",
        "SUPABASE_URL", 
        "SUPABASE_KEY"
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.getenv(var):
            missing_vars.append(var)
    
    if missing_vars:
        print("❌ Missing required environment variables:")
        for var in missing_vars:
            print(f"   - {var}")
        print("\n📝 Please set these variables in your environment or .env file")
        return False
    
    print("✅ All required environment variables are set")
    return True

def test_database_connection():
    """Test database connection"""
    try:
        # Add the current directory to Python path
        sys.path.insert(0, str(Path(__file__).parent))
        
        from app.database import engine
        with engine.connect() as conn:
            result = conn.execute("SELECT 1 as test")
            row = result.fetchone()
            if row and row[0] == 1:
                print("✅ Database connection successful")
                return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False
    
    return False

def main():
    """Main setup function"""
    print("🚀 Supabase Setup for ZRA Blockchain Invoice Verification System")
    print("=" * 70)
    
    # Check environment variables
    if not check_environment():
        print("\n📋 Required environment variables:")
        print("DATABASE_URL=postgresql://postgres:[PASSWORD]@[PROJECT-REF].supabase.co:5432/postgres")
        print("SUPABASE_URL=https://[PROJECT-REF].supabase.co")
        print("SUPABASE_KEY=[YOUR-ANON-KEY]")
        print("SUPABASE_SERVICE_ROLE_KEY=[YOUR-SERVICE-ROLE-KEY]")
        return False
    
    # Test database connection
    if not test_database_connection():
        print("\n🔧 Please check your DATABASE_URL and try again")
        return False
    
    print("\n🎉 Supabase connection verified!")
    print("\n📋 Next steps:")
    print("1. Run migrations: alembic upgrade head")
    print("2. Start the backend: uvicorn app.main:app --reload")
    print("3. Test health endpoints: http://localhost:8000/supabase/health")
    print("4. Start the frontend: npm run dev")
    
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
