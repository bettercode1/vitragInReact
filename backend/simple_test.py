#!/usr/bin/env python3
"""
Simple test script to verify table names are working correctly
"""

import os
import sys
from dotenv import load_dotenv

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables
load_dotenv()

def test_models_import():
    """Test that models can be imported and have correct table names"""
    print("Testing models import and table names...")
    
    try:
        from models import (
            Customer, TestRequest, ConcreteTest, TestingMaterial,
            TestPhoto, SequenceCounter, Machine, LiquidAdmixtureTest,
            LiquidAdmixtureReading, Reviewer, TestReview,
            BulkDensityMoistureTest, BulkDensityMoistureReading, AACBlockTest
        )
        
        # Check table names
        expected_tables = {
            'Customer': 'customers',
            'TestRequest': 'test_requests',
            'ConcreteTest': 'concrete_tests',
            'TestingMaterial': 'testing_materials',
            'TestPhoto': 'test_photos',
            'SequenceCounter': 'sequence_counters',
            'Machine': 'machines',
            'LiquidAdmixtureTest': 'liquid_admixture_tests',
            'LiquidAdmixtureReading': 'liquid_admixture_readings',
            'Reviewer': 'reviewers',
            'TestReview': 'test_reviews',
            'BulkDensityMoistureTest': 'bulk_density_moisture_tests',
            'BulkDensityMoistureReading': 'bulk_density_moisture_readings',
            'AACBlockTest': 'aac_block_tests'
        }
        
        # Test each model individually
        models_to_test = [
            (Customer, 'customers'),
            (TestRequest, 'test_requests'),
            (ConcreteTest, 'concrete_tests'),
            (TestingMaterial, 'testing_materials'),
            (TestPhoto, 'test_photos'),
            (SequenceCounter, 'sequence_counters'),
            (Machine, 'machines'),
            (LiquidAdmixtureTest, 'liquid_admixture_tests'),
            (LiquidAdmixtureReading, 'liquid_admixture_readings'),
            (Reviewer, 'reviewers'),
            (TestReview, 'test_reviews'),
            (BulkDensityMoistureTest, 'bulk_density_moisture_tests'),
            (BulkDensityMoistureReading, 'bulk_density_moisture_readings'),
            (AACBlockTest, 'aac_block_tests')
        ]
        
        for model_class, expected_table in models_to_test:
            actual_table = model_class.__tablename__
            if actual_table == expected_table:
                print(f"SUCCESS: {model_class.__name__} -> {actual_table}")
            else:
                print(f"ERROR: {model_class.__name__} -> {actual_table} (expected {expected_table})")
                return False
        
        print("SUCCESS: All table names are correct!")
        return True
        
    except Exception as e:
        print(f"ERROR: Error importing models: {e}")
        return False

def test_foreign_key_references():
    """Test that foreign key references use correct table names"""
    print("Testing foreign key references...")
    
    try:
        from models import TestRequest, ConcreteTest, TestingMaterial, TestPhoto
        
        # Check TestRequest foreign key
        customer_fk = TestRequest.customer_id.property.columns[0].foreign_keys
        if customer_fk:
            fk_table = list(customer_fk)[0].column.table.name
            if fk_table == 'customers':
                print("SUCCESS: TestRequest.customer_id references customers table")
            else:
                print(f"ERROR: TestRequest.customer_id references {fk_table} (expected customers)")
                return False
        
        # Check ConcreteTest foreign key
        test_request_fk = ConcreteTest.test_request_id.property.columns[0].foreign_keys
        if test_request_fk:
            fk_table = list(test_request_fk)[0].column.table.name
            if fk_table == 'test_requests':
                print("SUCCESS: ConcreteTest.test_request_id references test_requests table")
            else:
                print(f"ERROR: ConcreteTest.test_request_id references {fk_table} (expected test_requests)")
                return False
        
        print("SUCCESS: Foreign key references are correct!")
        return True
        
    except Exception as e:
        print(f"ERROR: Error testing foreign key references: {e}")
        return False

def main():
    """Main test function"""
    print("Testing Table Rename Migration...")
    print("=" * 50)
    
    # Test models import and table names
    if not test_models_import():
        print("ERROR: Models import test failed")
        return False
    
    print()
    
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
