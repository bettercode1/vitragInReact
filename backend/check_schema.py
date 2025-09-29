#!/usr/bin/env python3
"""
Check database schema for liquid_admixture_test table
"""

import psycopg2
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def check_schema():
    """Check the current schema of liquid_admixture_test table"""
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        print("❌ DATABASE_URL not found in environment variables")
        return
    
    try:
        # Connect to PostgreSQL
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        
        print("🔗 Connected to PostgreSQL database")
        print(f"📊 Database URL: {database_url}")
        
        # Check if table exists
        cursor.execute("""
            SELECT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_name = 'liquid_admixture_test'
            )
        """)
        
        table_exists = cursor.fetchone()[0]
        if not table_exists:
            print("❌ Table 'liquid_admixture_test' does not exist!")
            return
        
        print("✅ Table 'liquid_admixture_test' exists")
        
        # Get all columns
        cursor.execute("""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'liquid_admixture_test' 
            ORDER BY ordinal_position
        """)
        
        columns = cursor.fetchall()
        print(f"\n📋 Current columns in liquid_admixture_test table ({len(columns)} total):")
        print("-" * 80)
        print(f"{'Column Name':<20} {'Data Type':<15} {'Nullable':<10} {'Default'}")
        print("-" * 80)
        
        for col_name, data_type, is_nullable, column_default in columns:
            default = column_default if column_default else 'NULL'
            print(f"{col_name:<20} {data_type:<15} {is_nullable:<10} {default}")
        
        # Check specifically for our target columns
        target_columns = ['url_number', 'job_code_number', 'reference_number', 'reviewed_by', 'authorized_by']
        print(f"\n🎯 Checking target columns:")
        for col in target_columns:
            exists = any(col_name == col for col_name, _, _, _ in columns)
            status = "✅ EXISTS" if exists else "❌ MISSING"
            print(f"  {col:<20} {status}")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_schema() 