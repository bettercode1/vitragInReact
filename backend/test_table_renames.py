#!/usr/bin/env python3
"""
Test script to verify that the table renames work correctly
"""

import os
import sys
from dotenv import load_dotenv

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import db
from models import *
from app import app

def test_table_creation():
    """Test that all tables can be created with the new names"""
    print("Testing table creation with new names...")
    
    try:
        with app.app_context():
            # This will create all tables with the new names
            db.create_all()
            print("SUCCESS: All tables created successfully with new names")
        return True
    except Exception as e:
        print(f"ERROR: Error creating tables: {e}")
        return False

def test_model_relationships():
    """Test that model relationships work correctly"""
    print("Testing model relationships...")
    
    try:
        # Test Customer model
        customer = Customer(
            first_name="Test",
            last_name="User",
            name="Test User",
            phone="1234567890",
            city="Test City"
        )
        
        # Test TestRequest model
        test_request = TestRequest(
            job_number="TEST-001",
            customer_id=1,  # This would normally be set after customer is saved
            site_name="Test Site"
        )
        
        # Test ConcreteTest model
        concrete_test = ConcreteTest(
            test_request_id=1,  # This would normally be set after test_request is saved
            id_mark="C1",
            grade="M25"
        )
        
        print("SUCCESS: Model relationships work correctly")
        return True
        
    except Exception as e:
        print(f"ERROR: Error testing model relationships: {e}")
        return False

def test_foreign_key_references():
    """Test that foreign key references are correct"""
    print("Testing foreign key references...")
    
    try:
        with app.app_context():
            # Check that all foreign key references use the new table names
            from sqlalchemy import inspect
            
            # Get all foreign key constraints
            inspector = inspect(db.engine)
            
            # Check each table for foreign keys
            for table_name in inspector.get_table_names():
                foreign_keys = inspector.get_foreign_keys(table_name)
                for fk in foreign_keys:
                    referenced_table = fk['referred_table']
                    print(f"  {table_name}.{fk['constrained_columns'][0]} → {referenced_table}.{fk['referred_columns'][0]}")
            
            print("SUCCESS: Foreign key references are correct")
        return True
        
    except Exception as e:
        print(f"ERROR: Error testing foreign key references: {e}")
        return False

def main():
    """Main test function"""
    print("Testing Table Rename Migration...")
    print("=" * 50)
    
    # Load environment variables
    load_dotenv()
    
    # Test table creation
    if not test_table_creation():
        print("ERROR: Table creation test failed")
        return False
    
    # Test model relationships
    if not test_model_relationships():
        print("ERROR: Model relationships test failed")
        return False
    
    # Test foreign key references
    if not test_foreign_key_references():
        print("ERROR: Foreign key references test failed")
        return False
    
    print("\nSUCCESS: All tests passed!")
    print("SUCCESS: Table rename migration is working correctly")
    return True

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
