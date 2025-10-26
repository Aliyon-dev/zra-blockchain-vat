#!/usr/bin/env python3
"""
Test Supabase Connection for ZRA Blockchain Invoice Verification System
"""

import os
import sys
from pathlib import Path

def test_environment_variables():
    """Test if all required environment variables are set"""
    print("🔍 Testing environment variables...")
    
    required_vars = {
        "DATABASE_URL": "PostgreSQL connection string",
        "SUPABASE_URL": "Supabase project URL", 
        "SUPABASE_KEY": "Supabase anon key"
    }
    
    missing_vars = []
    for var, description in required_vars.items():
        value = os.getenv(var)
        if not value:
            missing_vars.append(f"  - {var}: {description}")
        else:
            # Mask sensitive values
            if "PASSWORD" in var or "KEY" in var:
                masked_value = value[:8] + "..." + value[-4:] if len(value) > 12 else "***"
                print(f"  ✅ {var}: {masked_value}")
            else:
                print(f"  ✅ {var}: {value}")
    
    if missing_vars:
        print("\n❌ Missing environment variables:")
        for var in missing_vars:
            print(var)
        return False
    
    print("✅ All environment variables are set")
    return True

def test_database_connection():
    """Test database connection"""
    print("\n🔍 Testing database connection...")
    
    try:
        # Add the current directory to Python path
        sys.path.insert(0, str(Path(__file__).parent))
        
        from app.database import engine
        with engine.connect() as conn:
            result = conn.execute("SELECT 1 as test, current_database() as db_name, current_user as user_name")
            row = result.fetchone()
            if row and row[0] == 1:
                print(f"  ✅ Database connection successful")
                print(f"  📊 Database: {row[1]}")
                print(f"  👤 User: {row[2]}")
                return True
    except Exception as e:
        print(f"  ❌ Database connection failed: {e}")
        return False
    
    return False

def test_supabase_api():
    """Test Supabase API connection"""
    print("\n🔍 Testing Supabase API connection...")
    
    try:
        sys.path.insert(0, str(Path(__file__).parent))
        from app.supabase_client import ping_supabase
        
        status_code = ping_supabase()
        if status_code:
            print(f"  ✅ Supabase API connection successful (HTTP {status_code})")
            return True
        else:
            print("  ❌ Supabase API connection failed")
            return False
    except Exception as e:
        print(f"  ❌ Supabase API test failed: {e}")
        return False

def test_database_tables():
    """Test if database tables exist"""
    print("\n🔍 Testing database tables...")
    
    try:
        sys.path.insert(0, str(Path(__file__).parent))
        from app.database import engine
        
        with engine.connect() as conn:
            # Check if invoices table exists
            result = conn.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'invoices'
            """)
            
            if result.fetchone():
                print("  ✅ Invoices table exists")
                
                # Check table structure
                result = conn.execute("""
                    SELECT column_name, data_type 
                    FROM information_schema.columns 
                    WHERE table_name = 'invoices' 
                    ORDER BY ordinal_position
                """)
                
                columns = result.fetchall()
                print(f"  📊 Table has {len(columns)} columns:")
                for col_name, col_type in columns:
                    print(f"    - {col_name}: {col_type}")
                
                return True
            else:
                print("  ❌ Invoices table not found")
                print("  💡 Run 'alembic upgrade head' to create tables")
                return False
                
    except Exception as e:
        print(f"  ❌ Table check failed: {e}")
        return False

def main():
    """Main test function"""
    print("🧪 Supabase Connection Test for ZRA Blockchain Invoice Verification System")
    print("=" * 80)
    
    tests = [
        ("Environment Variables", test_environment_variables),
        ("Database Connection", test_database_connection),
        ("Supabase API", test_supabase_api),
        ("Database Tables", test_database_tables),
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n📋 {test_name}")
        print("-" * 40)
        try:
            result = test_func()
            results.append((test_name, result))
        except Exception as e:
            print(f"  ❌ Test failed with error: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 80)
    print("📊 Test Summary")
    print("=" * 80)
    
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
        if result:
            passed += 1
    
    print(f"\n🎯 Results: {passed}/{len(results)} tests passed")
    
    if passed == len(results):
        print("\n🎉 All tests passed! Supabase is ready to use.")
        print("\n📋 Next steps:")
        print("1. Start backend: uvicorn app.main:app --reload")
        print("2. Test health endpoints: http://localhost:8000/supabase/health")
        print("3. Start frontend: npm run dev")
        return True
    else:
        print(f"\n⚠️  {len(results) - passed} test(s) failed. Please check the issues above.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
