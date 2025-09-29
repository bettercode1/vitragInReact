#!/usr/bin/env python3
"""
Database Migration Script: Rename Tables to Follow Proper Naming Convention

This script renames all existing tables to follow a consistent naming convention:
- All table names should be plural and use snake_case
- Foreign key references are updated accordingly

IMPORTANT: 
- Backup your database before running this migration
- This script will rename existing tables, so make sure you have a backup
- Run this script in a test environment first

Usage:
    python rename_tables_migration.py
"""

import os
import sys
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database configuration
database_url = "postgresql://neondb_owner:npg_eHZv0ncD8irC@ep-muddy-pond-a6nccqdf.us-west-2.aws.neon.tech/neondb?sslmode=require"

# Table rename mappings (old_name -> new_name)
TABLE_RENAMES = {
    'customer': 'customers',
    'test_request': 'test_requests', 
    'concrete_test': 'concrete_tests',
    'testing_material': 'testing_materials',
    'test_photo': 'test_photos',
    'sequence_counter': 'sequence_counters',
    'machine': 'machines',
    'liquid_admixture_test': 'liquid_admixture_tests',
    'liquid_admixture_reading': 'liquid_admixture_readings',
    'reviewer': 'reviewers',
    'test_review': 'test_reviews',
    'bulk_density_moisture_test': 'bulk_density_moisture_tests',
    'bulk_density_moisture_reading': 'bulk_density_moisture_readings',
    'aac_block_test': 'aac_block_tests'
}

def check_table_exists(engine, table_name):
    """Check if a table exists in the database"""
    try:
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_name = :table_name
                );
            """), {"table_name": table_name})
            return result.scalar()
    except Exception as e:
        print(f"Error checking if table {table_name} exists: {e}")
        return False

def rename_table(engine, old_name, new_name):
    """Rename a table from old_name to new_name"""
    try:
        with engine.connect() as conn:
            # Check if old table exists
            if not check_table_exists(engine, old_name):
                print(f"⚠️  Table '{old_name}' does not exist, skipping...")
                return True
                
            # Check if new table already exists
            if check_table_exists(engine, new_name):
                print(f"⚠️  Table '{new_name}' already exists, skipping rename of '{old_name}'...")
                return True
            
            # Rename the table
            conn.execute(text(f'ALTER TABLE "{old_name}" RENAME TO "{new_name}"'))
            conn.commit()
            print(f"✅ Renamed table '{old_name}' to '{new_name}'")
            return True
            
    except Exception as e:
        print(f"❌ Error renaming table '{old_name}' to '{new_name}': {e}")
        return False

def update_foreign_key_constraints(engine):
    """Update foreign key constraints to reference new table names"""
    try:
        with engine.connect() as conn:
            # Get all foreign key constraints that need updating
            fk_queries = [
                # Update foreign keys in test_requests table
                "ALTER TABLE test_requests DROP CONSTRAINT IF EXISTS test_request_customer_id_fkey;",
                "ALTER TABLE test_requests ADD CONSTRAINT test_request_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id);",
                
                # Update foreign keys in testing_materials table
                "ALTER TABLE testing_materials DROP CONSTRAINT IF EXISTS testing_material_test_request_id_fkey;",
                "ALTER TABLE testing_materials ADD CONSTRAINT testing_material_test_request_id_fkey FOREIGN KEY (test_request_id) REFERENCES test_requests(id);",
                
                # Update foreign keys in concrete_tests table
                "ALTER TABLE concrete_tests DROP CONSTRAINT IF EXISTS concrete_test_test_request_id_fkey;",
                "ALTER TABLE concrete_tests ADD CONSTRAINT concrete_test_test_request_id_fkey FOREIGN KEY (test_request_id) REFERENCES test_requests(id);",
                
                # Update foreign keys in test_photos table
                "ALTER TABLE test_photos DROP CONSTRAINT IF EXISTS test_photo_concrete_test_id_fkey;",
                "ALTER TABLE test_photos ADD CONSTRAINT test_photo_concrete_test_id_fkey FOREIGN KEY (concrete_test_id) REFERENCES concrete_tests(id) ON DELETE CASCADE;",
                
                # Update foreign keys in liquid_admixture_tests table
                "ALTER TABLE liquid_admixture_tests DROP CONSTRAINT IF EXISTS liquid_admixture_test_customer_id_fkey;",
                "ALTER TABLE liquid_admixture_tests ADD CONSTRAINT liquid_admixture_test_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id);",
                
                # Update foreign keys in liquid_admixture_readings table
                "ALTER TABLE liquid_admixture_readings DROP CONSTRAINT IF EXISTS liquid_admixture_reading_test_id_fkey;",
                "ALTER TABLE liquid_admixture_readings ADD CONSTRAINT liquid_admixture_reading_test_id_fkey FOREIGN KEY (test_id) REFERENCES liquid_admixture_tests(id);",
                
                # Update foreign keys in test_reviews table
                "ALTER TABLE test_reviews DROP CONSTRAINT IF EXISTS test_review_test_request_id_fkey;",
                "ALTER TABLE test_reviews ADD CONSTRAINT test_review_test_request_id_fkey FOREIGN KEY (test_request_id) REFERENCES test_requests(id);",
                
                "ALTER TABLE test_reviews DROP CONSTRAINT IF EXISTS test_review_reviewer_id_fkey;",
                "ALTER TABLE test_reviews ADD CONSTRAINT test_review_reviewer_id_fkey FOREIGN KEY (reviewer_id) REFERENCES reviewers(id);",
                
                # Update foreign keys in bulk_density_moisture_tests table
                "ALTER TABLE bulk_density_moisture_tests DROP CONSTRAINT IF EXISTS bulk_density_moisture_test_customer_id_fkey;",
                "ALTER TABLE bulk_density_moisture_tests ADD CONSTRAINT bulk_density_moisture_test_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id);",
                
                # Update foreign keys in bulk_density_moisture_readings table
                "ALTER TABLE bulk_density_moisture_readings DROP CONSTRAINT IF EXISTS bulk_density_moisture_reading_test_id_fkey;",
                "ALTER TABLE bulk_density_moisture_readings ADD CONSTRAINT bulk_density_moisture_reading_test_id_fkey FOREIGN KEY (test_id) REFERENCES bulk_density_moisture_tests(id);",
                
                # Update foreign keys in aac_block_tests table
                "ALTER TABLE aac_block_tests DROP CONSTRAINT IF EXISTS aac_block_test_customer_id_fkey;",
                "ALTER TABLE aac_block_tests ADD CONSTRAINT aac_block_test_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id);",
            ]
            
            for query in fk_queries:
                try:
                    conn.execute(text(query))
                    print(f"✅ Executed: {query[:50]}...")
                except Exception as e:
                    print(f"⚠️  Warning executing query: {query[:50]}... - {e}")
            
            conn.commit()
            print("✅ Foreign key constraints updated successfully")
            return True
            
    except Exception as e:
        print(f"❌ Error updating foreign key constraints: {e}")
        return False

def main():
    """Main migration function"""
    print("🚀 Starting Database Table Rename Migration...")
    print("=" * 60)
    
    # Create database engine
    try:
        engine = create_engine(database_url)
        print("✅ Database connection established")
    except Exception as e:
        print(f"❌ Failed to connect to database: {e}")
        sys.exit(1)
    
    # Test connection
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("✅ Database connection test successful")
    except Exception as e:
        print(f"❌ Database connection test failed: {e}")
        sys.exit(1)
    
    print("\n📋 Tables to be renamed:")
    for old_name, new_name in TABLE_RENAMES.items():
        print(f"  {old_name} → {new_name}")
    
    # Confirm before proceeding
    print("\n⚠️  WARNING: This will rename existing tables!")
    print("⚠️  Make sure you have a database backup before proceeding!")
    
    response = input("\nDo you want to continue? (yes/no): ").lower().strip()
    if response not in ['yes', 'y']:
        print("❌ Migration cancelled by user")
        sys.exit(0)
    
    print("\n🔄 Starting table renames...")
    
    # Rename tables
    success_count = 0
    total_count = len(TABLE_RENAMES)
    
    for old_name, new_name in TABLE_RENAMES.items():
        if rename_table(engine, old_name, new_name):
            success_count += 1
    
    print(f"\n📊 Table rename results: {success_count}/{total_count} successful")
    
    if success_count == total_count:
        print("\n🔄 Updating foreign key constraints...")
        if update_foreign_key_constraints(engine):
            print("\n✅ Migration completed successfully!")
            print("🎉 All tables have been renamed to follow proper naming conventions")
        else:
            print("\n⚠️  Migration completed with warnings - some foreign key updates failed")
    else:
        print(f"\n⚠️  Migration completed with errors - {total_count - success_count} tables failed to rename")
        print("Please check the error messages above and fix any issues")
    
    print("\n" + "=" * 60)
    print("Migration completed!")

if __name__ == "__main__":
    main()
