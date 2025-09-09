#!/usr/bin/env python3
"""
Python PDF Generator Integration
This file integrates with the existing new_pdf_format.py to generate PDFs from the React frontend
"""

import sys
import os
import json
import tempfile
from datetime import datetime

# Add the reference directory to the path to import the PDF generation module
sys.path.append(os.path.join(os.path.dirname(__file__), 'refrence'))

try:
    from new_pdf_format import generate_exact_format_pdf
except ImportError:
    print("Error: Could not import new_pdf_format.py")
    sys.exit(1)

class MockTestRequest:
    """Mock TestRequest object to match the expected structure"""
    def __init__(self, data):
        self.id = data.get('id', 1)
        self.job_number = data.get('job_number', 'N/A')
        self.customer_name = data.get('customer_name', 'N/A')
        self.site_name = data.get('site_name', 'N/A')
        self.receipt_date = datetime.strptime(data.get('receipt_date', '01/01/2024'), '%d/%m/%Y')
        self.ulr_number = data.get('ulr_number', 'N/A')
        self.test_type = data.get('test_type', 'CC')

class MockCustomer:
    """Mock Customer object to match the expected structure"""
    def __init__(self, data):
        self.name = data.get('name', 'N/A')
        self.address = data.get('address', 'N/A')

class MockConcreteTest:
    """Mock ConcreteTest object to match the expected structure"""
    def __init__(self, data):
        self.sample_code_number = data.get('sample_code_number', 'N/A')
        self.location_nature = data.get('location_nature', 'N/A')
        self.age_in_days = data.get('age_in_days', 28)
        self.casting_date = datetime.strptime(data.get('casting_date', '01/01/2024'), '%d/%m/%Y')
        self.testing_date = datetime.strptime(data.get('testing_date', '01/01/2024'), '%d/%m/%Y')
        self.grade = data.get('grade', 'M25')
        self.cube_condition = data.get('cube_condition', 'Acceptable')
        self.curing_condition = data.get('curing_condition', 'Water Curing')
        self.machine_used = data.get('machine_used', 'CTM (2000KN)')
        self.test_method = data.get('test_method', 'IS 516 (Part 1/Sec 1):2021')
        self.num_of_cubes = data.get('num_of_cubes', 3)
        self.id_mark = data.get('id_mark', 'C1')
        self.dimension_length = data.get('dimension_length', 150)
        self.dimension_width = data.get('dimension_width', 150)
        self.dimension_height = data.get('dimension_height', 150)
        self.weight = data.get('weight', 8.5)
        self.crushing_load = data.get('crushing_load', 562.5)
        self.compressive_strength = data.get('compressive_strength', 25.0)
        self.average_strength = data.get('average_strength', 25.0)
        self.failure_type = data.get('failure_type', 'Conical')
        self.test_results_json = data.get('test_results_json', '[]')

def generate_pdf_from_react_data(react_data):
    """
    Generate PDF from React frontend data using the existing PDF generation code
    
    Args:
        react_data: Dictionary containing test_request, customer, main_test, and reviewer_info
        
    Returns:
        str: Path to the generated PDF file
    """
    try:
        # Create mock objects from React data
        test_request = MockTestRequest(react_data['test_request'])
        customer = MockCustomer(react_data['customer'])
        main_test = MockConcreteTest(react_data['main_test'])
        reviewer_info = react_data.get('reviewer_info', {})
        
        # Create temporary file for PDF
        temp_dir = tempfile.gettempdir()
        pdf_filename = f"Test_Report_{test_request.job_number}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        pdf_path = os.path.join(temp_dir, pdf_filename)
        
        # Generate PDF using the existing function
        success = generate_exact_format_pdf(
            pdf_path=pdf_path,
            test_request=test_request,
            customer=customer,
            main_test=main_test,
            test_results=None,  # Will be parsed from test_results_json
            reviewer_info=reviewer_info
        )
        
        if success:
            return pdf_path
        else:
            raise Exception("PDF generation failed")
            
    except Exception as e:
        print(f"Error generating PDF: {e}")
        raise e

def main():
    """Main function to handle command line usage"""
    if len(sys.argv) != 2:
        print("Usage: python pdf_generator.py <json_data>")
        sys.exit(1)
    
    try:
        # Parse JSON data from command line
        json_data = sys.argv[1]
        react_data = json.loads(json_data)
        
        # Generate PDF
        pdf_path = generate_pdf_from_react_data(react_data)
        
        # Return the PDF path
        print(pdf_path)
        
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
