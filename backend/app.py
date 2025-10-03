#!/usr/bin/env python3
"""
Simple test version of the Flask app to verify database connectivity
"""

import os
import logging
from dotenv import load_dotenv

from flask import Flask, request, flash, redirect, url_for, jsonify
from flask_cors import CORS
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.exc import IntegrityError, OperationalError
from sqlalchemy import or_
from werkzeug.middleware.proxy_fix import ProxyFix
from werkzeug.exceptions import RequestEntityTooLarge
from database import db

# Load environment variables from .env file
load_dotenv()

# Configure logging for better debugging
logging.basicConfig(level=logging.DEBUG)

# Create the app
app = Flask(__name__)

# Enable CORS for React frontend
CORS(app, 
     origins=[
         'http://localhost:3000',                    # Development
         'https://testinglab.vitragassollp.com',     # Production frontend
         'http://testinglab.vitragassollp.com'       # Production (HTTP fallback)
     ],
     methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
     allow_headers=['Content-Type', 'Authorization'],
     supports_credentials=True)

# Set a secret key for session encryption
app.secret_key = "vitrag_associates_secure_key_2025"

app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)  # needed for url_for to generate with https

# Database configuration with proper error handling
database_url = "postgresql://myapp:VitragLLP%402025@213.136.94.206:5432/vitragLLP"
#database_url = "postgresql://neondb_owner:npg_eHZv0ncD8irC@ep-muddy-pond-a6nccqdf.us-west-2.aws.neon.tech/neondb?sslmode=require"

if database_url and database_url.strip():
    app.config["SQLALCHEMY_DATABASE_URI"] = database_url.strip()
    print(f"Using database: {database_url}")
else:
    print("❌ DATABASE_URL not found in environment variables")
    exit(1)

app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "pool_recycle": 300,
    "pool_pre_ping": True,
}
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Configure max content length for file uploads (16MB)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# Initialize the app with the extension
db.init_app(app)

# Helper function to generate unique ULR numbers
def generate_unique_ulr_number():
    """Generate a unique ULR number that doesn't exist in the database"""
    import time
    import random
    from models import TestRequest
    
    max_attempts = 10
    for attempt in range(max_attempts):
        # Generate ULR number with timestamp and random component
        ulr_number = f"TC-{int(time.time())}{random.randint(1000, 9999)}F"
        
        # Check if this ULR number already exists
        existing_ulr = TestRequest.query.filter_by(ulr_number=ulr_number).first()
        if not existing_ulr:
            return ulr_number
        
        # Add a small delay to ensure timestamp changes
        time.sleep(0.001)
    
    # If we can't generate a unique ULR after max attempts, raise an error
    raise Exception("Unable to generate unique ULR number after multiple attempts")

# Database connection test and initialization
def test_database_connection():
    """Test database connection and provide helpful error messages"""
    try:
        with app.app_context():
            # Test the connection using new SQLAlchemy syntax
            with db.engine.connect() as connection:
                connection.execute(db.text("SELECT 1"))
            print("SUCCESS: Database connection successful!")
            return True
    except OperationalError as e:
        error_msg = str(e)
        print(f"ERROR: Database connection failed: {error_msg}")
        print("INFO: Check your database server is running")
        print("INFO: Verify host, port, username, and password")
        return False
    except Exception as e:
        print(f"ERROR: Unexpected database error: {str(e)}")
        return False

# Test database connection
if not test_database_connection():
    print("ERROR: Database connection failed. Please check your PostgreSQL server.")
    exit(1)

with app.app_context():
    # Import the models here so tables are created
    import models  # noqa: F401
    
    # Create all tables
    try:
        db.create_all()
        print("SUCCESS: Database tables created successfully!")
    except Exception as e:
        print(f"ERROR: Error creating database tables: {str(e)}")
        print("INFO: Check your database permissions and connection")

# Health check endpoint for monitoring
@app.route('/ping')
def health_check():
    """Simple health check endpoint that returns 200 OK"""
    return "OK", 200

# Simple test endpoint
@app.route('/')
def home():
    """Simple home endpoint"""
    return "SUCCESS: Vitrag Associates Testing Lab - Backend is running!", 200

# API endpoint to fetch all customers
@app.route('/api/customers', methods=['GET'])
def get_customers():
    """Fetch all customers from the database"""
    try:
        from models import Customer
        customers = Customer.query.all()
        
        # Format the response with all customer fields
        customers_data = []
        for customer in customers:
            customers_data.append({
                'id': customer.id,
                'first_name': customer.first_name,
                'last_name': customer.last_name,
                'name': customer.name,
                'contact_person': customer.contact_person,
                'phone': customer.phone,
                'email': customer.email,
                'address': customer.address,
                'city': customer.city,
                'site_name': customer.site_name
            })
        
        return jsonify(customers_data), 200
    except Exception as e:
        app.logger.error(f"Error fetching customers: {str(e)}")
        return jsonify({'error': 'Failed to fetch customers'}), 500

# API endpoint to add a new customer
@app.route('/api/customers/add', methods=['POST'])
def add_customer():
    """Add a new customer to the database"""
    try:
        from models import Customer
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['first_name', 'last_name', 'name', 'phone', 'city']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if phone number already exists
        existing_customer = Customer.query.filter_by(phone=data['phone']).first()
        if existing_customer:
            return jsonify({'error': 'Customer with this phone number already exists'}), 400
        
        # Create new customer
        new_customer = Customer(
            first_name=data['first_name'],
            last_name=data['last_name'],
            name=data['name'],
            contact_person=data.get('contact_person', ''),
            phone=data['phone'],
            email=data.get('email', ''),
            address=data.get('address', ''),
            city=data['city'],
            site_name=data.get('site_name', '')
        )
        
        db.session.add(new_customer)
        db.session.commit()
        
        return jsonify({
            'message': 'Customer added successfully',
            'customer': {
                'id': new_customer.id,
                'first_name': new_customer.first_name,
                'last_name': new_customer.last_name,
                'name': new_customer.name,
                'contact_person': new_customer.contact_person,
                'phone': new_customer.phone,
                'email': new_customer.email,
                'address': new_customer.address,
                'city': new_customer.city,
                'site_name': new_customer.site_name
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error adding customer: {str(e)}")
        return jsonify({'error': 'Failed to add customer'}), 500

# API endpoint to update an existing customer
@app.route('/api/customers/<int:customer_id>', methods=['PUT'])
def update_customer(customer_id):
    """Update an existing customer"""
    try:
        from models import Customer
        
        customer = Customer.query.get_or_404(customer_id)
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['first_name', 'last_name', 'name', 'phone', 'city']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if phone number already exists (excluding current customer)
        existing_customer = Customer.query.filter(
            Customer.phone == data['phone'],
            Customer.id != customer_id
        ).first()
        if existing_customer:
            return jsonify({'error': 'Customer with this phone number already exists'}), 400
        
        # Update customer fields
        customer.first_name = data['first_name']
        customer.last_name = data['last_name']
        customer.name = data['name']
        customer.contact_person = data.get('contact_person', '')
        customer.phone = data['phone']
        customer.email = data.get('email', '')
        customer.address = data.get('address', '')
        customer.city = data['city']
        customer.site_name = data.get('site_name', '')
        
        db.session.commit()
        
        return jsonify({
            'message': 'Customer updated successfully',
            'customer': {
                'id': customer.id,
                'first_name': customer.first_name,
                'last_name': customer.last_name,
                'name': customer.name,
                'contact_person': customer.contact_person,
                'phone': customer.phone,
                'email': customer.email,
                'address': customer.address,
                'city': customer.city,
                'site_name': customer.site_name
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error updating customer: {str(e)}")
        return jsonify({'error': 'Failed to update customer'}), 500

# API endpoint to delete a customer
@app.route('/api/customers/<int:customer_id>', methods=['DELETE'])
def delete_customer(customer_id):
    """Delete a customer"""
    try:
        # Check if customer exists using raw SQL to avoid ORM relationships
        check_query = db.text("SELECT COUNT(*) FROM customer WHERE id = :id")
        result = db.session.execute(check_query, {"id": customer_id})
        if result.scalar() == 0:
            return jsonify({'error': 'Customer not found'}), 404
        
        # Check if customer has associated test requests using raw SQL
        test_check = db.text("SELECT COUNT(*) FROM test_request WHERE customer_id = :id")
        test_result = db.session.execute(test_check, {"id": customer_id})
        test_count = test_result.scalar()
        
        if test_count > 0:
            return jsonify({'error': f'Cannot delete customer with {test_count} associated test requests'}), 400
        
        # Delete using raw SQL to avoid ORM relationship issues
        delete_query = db.text("DELETE FROM customer WHERE id = :id")
        db.session.execute(delete_query, {"id": customer_id})
        db.session.commit()
        
        return jsonify({'message': 'Customer deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        import traceback
        error_trace = traceback.format_exc()
        app.logger.error(f"Error deleting customer: {error_trace}")
        print(f"DELETE ERROR: {error_trace}")
        return jsonify({'error': f'Failed to delete customer: {str(e)}'}), 500

# API endpoint to create a new test request
@app.route('/api/test-requests', methods=['POST'])
def create_test_request():
    """Create a new test request with materials and concrete tests"""
    try:
        from models import TestRequest, Customer, ConcreteTest, TestingMaterial
        from datetime import datetime
        
        data = request.get_json()
        print(f"Received data: {data}")
        
        # Validate required fields
        required_fields = ['customer_name', 'test_type']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Get customer by ID (preferred) or by name (fallback)
        customer = None
        
        # First try to get by customer_id if provided
        if data.get('customer_id'):
            customer = Customer.query.get(data['customer_id'])
        
        # If not found by ID, try by name (fallback)
        if not customer and data.get('customer_name'):
            customer_name = data['customer_name']
            customer = Customer.query.filter_by(name=customer_name).first()
        
        if not customer:
            return jsonify({'error': 'Customer not found. Please select an existing customer.'}), 400
        
        # Generate unique job number if not provided or if it already exists
        job_number = data.get('job_number', '')
        if job_number:
            # Check if job number already exists
            existing_request = TestRequest.query.filter_by(job_number=job_number).first()
            if existing_request:
                # Generate new unique job number
                import time
                job_number = f"T-{int(time.time())}"
        
        # Generate unique ULR number if not provided or if it already exists
        ulr_number = data.get('ulr_number', '')
        if ulr_number:
            # Check if ULR number already exists
            existing_ulr = TestRequest.query.filter_by(ulr_number=ulr_number).first()
            if existing_ulr:
                # Generate new unique ULR number using helper function
                try:
                    ulr_number = generate_unique_ulr_number()
                except Exception as e:
                    return jsonify({'error': f'Unable to generate unique ULR number: {str(e)}'}), 500
        else:
            # Generate a new ULR number if none provided
            try:
                ulr_number = generate_unique_ulr_number()
            except Exception as e:
                return jsonify({'error': f'Unable to generate unique ULR number: {str(e)}'}), 500
        
        # Create test request with all fields
        test_request = TestRequest(
            job_number=job_number,
            customer_id=customer.id,
            site_name=data.get('site_name', ''),
            test_type=data['test_type'],
            ulr_number=ulr_number,
            receipt_date=datetime.strptime(data['receipt_date'], '%Y-%m-%d').date() if data.get('receipt_date') else None
        )
        db.session.add(test_request)
        db.session.flush()  # Get the test request ID
        
        # Save materials to testing_material table
        materials = data.get('materials', [])
        for material_data in materials:
            if material_data.get('material_name'):
                material = TestingMaterial(
                    test_request_id=test_request.id,
                    material_name=material_data['material_name']
                )
                db.session.add(material)
        
        # Save concrete tests to concrete_test table
        concrete_tests = data.get('concrete_tests', [])
        for test_data in concrete_tests:
            if test_data.get('id_mark'):
                # Parse dates
                casting_date = datetime.strptime(test_data['casting_date'], '%Y-%m-%d').date() if test_data.get('casting_date') else None
                testing_date = datetime.strptime(test_data['testing_date'], '%Y-%m-%d').date() if test_data.get('testing_date') else None
                
                # Calculate age in days
                age_in_days = None
                if casting_date and testing_date:
                    age_in_days = (testing_date - casting_date).days
                
                concrete_test = ConcreteTest(
                    test_request_id=test_request.id,
                    id_mark=test_data['id_mark'],
                    location_nature=test_data.get('location_nature', ''),
                    grade=test_data.get('grade', ''),
                    casting_date=casting_date,
                    testing_date=testing_date,
                    age_in_days=age_in_days,
                    num_of_cubes=test_data.get('quantity', 1),
                    test_method=test_data.get('test_method', 'IS 516 (Part1/Sec1):2021'),
                    sample_code_number=test_data.get('sample_code_number', '')  # Save reference number
                )
                db.session.add(concrete_test)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Test request created successfully',
            'test_request_id': test_request.id,
            'id': test_request.id
        }), 201
        
    except IntegrityError as e:
        db.session.rollback()
        error_msg = str(e)
        if 'ulr_number' in error_msg and 'unique constraint' in error_msg:
            return jsonify({'error': 'ULR number already exists. Please try again with a different ULR number.'}), 400
        elif 'job_number' in error_msg and 'unique constraint' in error_msg:
            return jsonify({'error': 'Job number already exists. Please try again with a different job number.'}), 400
        else:
            return jsonify({'error': f'Database constraint violation: {error_msg}'}), 400
    except Exception as e:
        db.session.rollback()
        print(f"Error creating test request: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Backend Error: {str(e)}'}), 500

# API endpoint to fetch all test requests (for samples page)
@app.route('/api/test-requests', methods=['GET'])
def get_test_requests():
    """Fetch all test requests with customer information for samples page"""
    try:
        from models import TestRequest, Customer, ConcreteTest, TestingMaterial
        
        # Get query parameters for filtering and pagination
        status_filter = request.args.get('status', '')
        search_query = request.args.get('search', '')
        type_filter = request.args.get('type', '')
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 50))
        
        # Build query with joins
        query = db.session.query(TestRequest, Customer.name, Customer.phone).\
            join(Customer, TestRequest.customer_id == Customer.id)
        
        # Apply filters
        if status_filter:
            query = query.filter(TestRequest.status == status_filter)
        
        if search_query:
            query = query.filter(
                or_(
                    TestRequest.job_number.ilike(f'%{search_query}%'),
                    Customer.name.ilike(f'%{search_query}%'),
                    TestRequest.site_name.ilike(f'%{search_query}%')
                )
            )
        
        # Get total count for pagination
        total_count = query.count()
        
        # Apply pagination
        offset = (page - 1) * per_page
        results = query.order_by(TestRequest.created_at.desc()).offset(offset).limit(per_page).all()
        
        # Format response with BASIC data only (FAST loading)
        test_requests = []
        for test_request, customer_name, customer_phone in results:
            test_requests.append({
                'id': test_request.id,
                'job_number': test_request.job_number,
                'customer_name': customer_name,
                'site_name': test_request.site_name,
                'receipt_date': test_request.receipt_date.isoformat() if test_request.receipt_date else None,
                'completion_date': test_request.completion_date.isoformat() if test_request.completion_date else None,
                'disposal_date': test_request.disposal_date.isoformat() if test_request.disposal_date else None,
                'status': test_request.status,
                'ulr_number': test_request.ulr_number,
                'created_at': test_request.created_at.isoformat() if test_request.created_at else None,
                # Material flags
                'river_sand': test_request.river_sand,
                'crushed_sand': test_request.crushed_sand,
                'm_sand': test_request.m_sand,
                'p_sand': test_request.p_sand,
                'cement': test_request.cement,
                'customer_phone': customer_phone,
                # Lazy loading - no heavy data
                'concrete_tests': [],  # Empty - will load when needed
                'materials': []        # Empty - will load when needed
            })
        
        return jsonify({
            'test_requests': test_requests,
            'total': total_count,
            'page': page,
            'per_page': per_page,
            'total_pages': (total_count + per_page - 1) // per_page
        }), 200
        
    except Exception as e:
        app.logger.error(f"Error fetching test requests: {str(e)}")
        return jsonify({'error': 'Failed to fetch test requests'}), 500

# API endpoint to fetch detailed test request data (lazy loading)
@app.route('/api/test-requests/<int:test_request_id>/details', methods=['GET'])
def get_test_request_details(test_request_id):
    """Fetch detailed data for a specific test request (concrete tests, materials, customer info)"""
    try:
        from models import TestRequest, ConcreteTest, TestingMaterial, Customer
        
        # Get the test request
        test_request = TestRequest.query.get(test_request_id)
        if not test_request:
            return jsonify({'error': 'Test request not found'}), 404
        
        # Get customer information
        customer = Customer.query.get(test_request.customer_id)
        customer_data = {
            'name': customer.name if customer else 'N/A',
            'first_name': customer.first_name if customer else 'N/A',
            'last_name': customer.last_name if customer else 'N/A',
            'contact_person': customer.contact_person if customer else 'N/A',
            'phone': customer.phone if customer else 'N/A',
            'email': customer.email if customer else 'N/A',
            'address': customer.address if customer else 'N/A',
            'city': customer.city if customer else 'N/A',
            'site_name': customer.site_name if customer else 'N/A'
        }
        
        # Get test request data
        test_request_data = {
            'id': test_request.id,
            'job_number': test_request.job_number,
            'ulr_number': test_request.ulr_number,
            'receipt_date': test_request.receipt_date.isoformat() if test_request.receipt_date else None,
            'site_name': test_request.site_name,
            'status': test_request.status,
            'test_type': test_request.test_type
        }
        
        # Get concrete tests for this test request
        concrete_tests = ConcreteTest.query.filter_by(test_request_id=test_request.id).all()
        concrete_tests_data = []
        for ct in concrete_tests:
            concrete_tests_data.append({
                'id': ct.id,
                'sr_no': ct.sr_no,
                'idMark': ct.id_mark,
                'locationNature': ct.location_nature,
                'grade': ct.grade,
                'castingDate': ct.casting_date.isoformat() if ct.casting_date else None,
                'testingDate': ct.testing_date.isoformat() if ct.testing_date else None,
                'casting_date': ct.casting_date.isoformat() if ct.casting_date else None,
                'testing_date': ct.testing_date.isoformat() if ct.testing_date else None,
                'age_in_days': ct.age_in_days,
                'quantity': ct.num_of_cubes,
                'num_of_cubes': ct.num_of_cubes,
                'testMethod': ct.test_method,
                'test_method': ct.test_method,
                'ulr_number': ct.ulr_number,
                'sample_code_number': ct.sample_code_number,
                'job_number': ct.job_number,
                'has_results': ct.has_results,
                'weight': ct.weight,
                'dimension_length': ct.dimension_length,
                'dimension_width': ct.dimension_width,
                'dimension_height': ct.dimension_height,
                'crushing_load': ct.crushing_load,
                'compressive_strength': ct.compressive_strength,
                'average_strength': ct.average_strength,
                'failure_type': ct.failure_type,
                'test_remarks': ct.test_remarks,
                'testRemarks': ct.test_remarks,
                'observations_json': ct.observations_json,
                'test_results_json': ct.test_results_json,
                'tested_by': ct.tested_by,
                'testedBy': ct.tested_by,
                'checked_by': ct.checked_by,
                'checkedBy': ct.checked_by,
                'verified_by': ct.verified_by,
                'verifiedBy': ct.verified_by,
                'sample_description': ct.sample_description,
                'cube_condition': ct.cube_condition,
                'curing_condition': ct.curing_condition,
                'machine_used': ct.machine_used,
            })

        # Get testing materials for this test request
        materials = TestingMaterial.query.filter_by(test_request_id=test_request.id).all()
        materials_data = []
        for mat in materials:
            materials_data.append({
                'id': mat.id,
                'sr_no': mat.sr_no,
                'material_name': mat.material_name,
                'quantity': mat.quantity,
                'test_requirement': mat.test_requirement,
                'test_method': mat.test_method,
                'ulr_number': mat.ulr_number,
                'sample_code_number': mat.sample_code_number,
                'job_number': mat.job_number,
            })
        
        return jsonify({
            'customer': customer_data,
            'test_request': test_request_data,
            'concrete_tests': concrete_tests_data,
            'materials': materials_data
        }), 200
        
    except Exception as e:
        app.logger.error(f"Error fetching test request details: {str(e)}")
        return jsonify({'error': 'Failed to fetch test request details'}), 500

# API endpoint to fetch dashboard statistics
@app.route('/api/dashboard/stats', methods=['GET'])
def get_dashboard_stats():
    """Fetch dashboard statistics"""
    try:
        from models import TestRequest, Customer
        
        # Get total tests count
        total_tests = TestRequest.query.count()
        
        # Get pending tests count (status != 'completed')
        pending_tests = TestRequest.query.filter(TestRequest.status != 'completed').count()
        
        # Get completed tests count
        completed_tests = TestRequest.query.filter(TestRequest.status == 'completed').count()
        
        # Get recent tests (last 30 days)
        from datetime import datetime, timedelta
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_tests = TestRequest.query.filter(TestRequest.created_at >= thirty_days_ago).count()
        
        stats = {
            'total_tests': total_tests,
            'pending_tests': pending_tests,
            'completed_tests': completed_tests,
            'recent_tests': recent_tests,
            'completion_rate': round((completed_tests / total_tests * 100) if total_tests > 0 else 0, 2)
        }
        
        return jsonify(stats), 200
    except Exception as e:
        app.logger.error(f"Error fetching dashboard stats: {str(e)}")
        return jsonify({'error': 'Failed to fetch dashboard statistics'}), 500

# API endpoint to fetch recent test requests
@app.route('/api/dashboard/recent-tests', methods=['GET'])
def get_recent_tests():
    """Fetch recent test requests for dashboard"""
    try:
        from models import TestRequest, Customer
        
        # Get tests with customer information (all data, no pagination)
        query = db.session.query(TestRequest, Customer).\
            join(Customer, TestRequest.customer_id == Customer.id).\
            order_by(TestRequest.created_at.desc())
        
        # Get all results without pagination
        results = query.all()
        
        tests_data = []
        for test_request, customer in results:
            tests_data.append({
                'id': test_request.id,
                'job_number': test_request.job_number,
                'customer_name': customer.name or f"{customer.first_name} {customer.last_name}".strip(),
                'contact_person': customer.contact_person,
                'phone': customer.phone,
                'email': customer.email,
                'site_name': test_request.site_name,
                'site_address': customer.address,
                'test_type': test_request.test_type,
                'ulr_number': test_request.ulr_number,
                'receipt_date': test_request.receipt_date.isoformat() if test_request.receipt_date else None,
                'status': test_request.status,
                'completion_date': test_request.completion_date.isoformat() if test_request.completion_date else None,
                'created_at': test_request.created_at.isoformat() if test_request.created_at else None
            })
        
        return jsonify({
            'tests': tests_data,
            'total': len(tests_data)
        }), 200
    except Exception as e:
        app.logger.error(f"Error fetching recent tests: {str(e)}")
        return jsonify({'error': 'Failed to fetch recent tests'}), 500

# API endpoint to fetch pending tests
@app.route('/api/dashboard/pending-tests', methods=['GET'])
def get_pending_tests():
    """Fetch pending test requests for dashboard"""
    try:
        from models import TestRequest, Customer
        
        # Get pending tests with customer information (all data, no pagination)
        query = db.session.query(TestRequest, Customer).\
            join(Customer, TestRequest.customer_id == Customer.id).\
            filter(TestRequest.status != 'completed').\
            order_by(TestRequest.created_at.desc())
        
        # Get all results without pagination
        results = query.all()
        
        tests_data = []
        for test_request, customer in results:
            tests_data.append({
                'id': test_request.id,
                'job_number': test_request.job_number,
                'customer_name': customer.name or f"{customer.first_name} {customer.last_name}".strip(),
                'contact_person': customer.contact_person,
                'phone': customer.phone,
                'email': customer.email,
                'site_name': test_request.site_name,
                'site_address': customer.address,
                'test_type': test_request.test_type,
                'ulr_number': test_request.ulr_number,
                'receipt_date': test_request.receipt_date.isoformat() if test_request.receipt_date else None,
                'status': test_request.status,
                'created_at': test_request.created_at.isoformat() if test_request.created_at else None
            })
        
        return jsonify({
            'tests': tests_data,
            'total': len(tests_data)
        }), 200
    except Exception as e:
        app.logger.error(f"Error fetching pending tests: {str(e)}")
        return jsonify({'error': 'Failed to fetch pending tests'}), 500

# API endpoint to fetch complete data for PDF generation
@app.route('/api/test-requests/<int:test_request_id>/pdf-data', methods=['GET'])
def get_test_request_pdf_data(test_request_id):
    """Fetch complete data for PDF generation from all related tables"""
    try:
        from models import TestRequest, ConcreteTest, TestPhoto, Customer
        import json
        
        print(f"\n{'='*50}")
        print(f"📄 PDF DATA FETCH - Test Request ID: {test_request_id}")
        print(f"{'='*50}\n")
        
        # Get test request with customer info
        test_request = db.session.query(TestRequest, Customer).\
            join(Customer, TestRequest.customer_id == Customer.id).\
            filter(TestRequest.id == test_request_id).first()
        
        if not test_request:
            print(f"❌ Test request {test_request_id} not found")
            return jsonify({'error': 'Test request not found'}), 404
        
        tr, customer = test_request
        print(f"✅ Found test request: {tr.job_number}")
        print(f"✅ Customer: {customer.name}")
        
        # Get concrete tests with results
        concrete_tests = ConcreteTest.query.filter_by(
            test_request_id=test_request_id,
            has_results=True
        ).all()
        
        if not concrete_tests:
            print(f"❌ No concrete tests with results found")
            return jsonify({'error': 'No test results found for PDF generation'}), 404
        
        concrete_test = concrete_tests[0]  # Use first test for main data
        print(f"✅ Found concrete test with results")
        
        # Get photos for this concrete test
        photos = TestPhoto.query.filter_by(concrete_test_id=concrete_test.id).all()
        print(f"✅ Found {len(photos)} photos")
        
        # Parse JSON data
        test_results_json = {}
        observations_json = {}
        
        if concrete_test.test_results_json:
            try:
                test_results_json = json.loads(concrete_test.test_results_json)
            except json.JSONDecodeError:
                print("⚠️ Failed to parse test_results_json")
        
        if concrete_test.observations_json:
            try:
                observations_json = json.loads(concrete_test.observations_json)
            except json.JSONDecodeError:
                print("⚠️ Failed to parse observations_json")
        
        # Build complete PDF data structure
        pdf_data = {
            'test_request': {
                'id': tr.id,
                'job_number': tr.job_number,
                'ulr_number': tr.ulr_number,
                'receipt_date': tr.receipt_date.isoformat() if tr.receipt_date else None,
                'completion_date': tr.completion_date.isoformat() if tr.completion_date else None,
                'site_name': tr.site_name,
                'test_type': tr.test_type,
                'status': tr.status
            },
            'customer': {
                'id': customer.id,
                'name': customer.name,
                'first_name': customer.first_name,
                'last_name': customer.last_name,
                'contact_person': customer.contact_person,
                'phone': customer.phone,
                'email': customer.email,
                'address': customer.address,
                'city': customer.city,
                'site_name': customer.site_name
            },
            'main_test': {
                'id': concrete_test.id,
                'id_mark': concrete_test.id_mark,
                'location_nature': concrete_test.location_nature,
                'grade': concrete_test.grade,
                'casting_date': concrete_test.casting_date.isoformat() if concrete_test.casting_date else None,
                'testing_date': concrete_test.testing_date.isoformat() if concrete_test.testing_date else None,
                'age_in_days': concrete_test.age_in_days,
                'sample_description': concrete_test.sample_description,
                'cube_condition': concrete_test.cube_condition,
                'curing_condition': concrete_test.curing_condition,
                'machine_used': concrete_test.machine_used,
                'test_method': concrete_test.test_method,
                'weight': concrete_test.weight,
                'dimension_length': concrete_test.dimension_length,
                'dimension_width': concrete_test.dimension_width,
                'dimension_height': concrete_test.dimension_height,
                'crushing_load': concrete_test.crushing_load,
                'compressive_strength': concrete_test.compressive_strength,
                'average_strength': concrete_test.average_strength,
                'failure_type': concrete_test.failure_type,
                'test_remarks': concrete_test.test_remarks,
                'tested_by': concrete_test.tested_by,
                'checked_by': concrete_test.checked_by,
                'verified_by': concrete_test.verified_by,
                'test_results_json': test_results_json,
                'observations_json': observations_json
            },
            'photos': [],
            'reviewer_info': {
                'name': 'Lalita S. Dussa',
                'designation': 'Quality Manager',
                'graduation': 'B.Tech.(Civil)'
            }
        }
        
        # Add photos data
        for photo in photos:
            photo_data = {
                'id': photo.id,
                'photo_type': photo.photo_type,
                'cube_number': photo.cube_number,
                'photo_data': photo.photo_data,
                'filename': photo.filename
            }
            pdf_data['photos'].append(photo_data)
        
        print(f"✅ Built complete PDF data structure")
        print(f"   - Test Request: {pdf_data['test_request']['job_number']}")
        print(f"   - Customer: {pdf_data['customer']['name']}")
        print(f"   - Test Results: {len(test_results_json)} fields")
        print(f"   - Observations: {len(observations_json)} fields")
        print(f"   - Photos: {len(pdf_data['photos'])}")
        print(f"{'='*50}\n")
        
        return jsonify(pdf_data), 200
        
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        app.logger.error(f"Error fetching PDF data: {error_trace}")
        print(f"\n❌ PDF DATA FETCH ERROR:")
        print(error_trace)
        print(f"{'='*50}\n")
        return jsonify({'error': f'Failed to fetch PDF data: {str(e)}'}), 500

# API endpoint to save test observations and results
@app.route('/api/test-observations/<int:test_request_id>', methods=['GET', 'OPTIONS'])
def get_test_observations(test_request_id):
    """Retrieve saved test observations for editing"""
    # Handle preflight request
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        from models import TestRequest, ConcreteTest
        import json
        
        print(f"\n{'='*50}")
        print(f"📥 GET TEST OBSERVATIONS - Request ID: {test_request_id}")
        print(f"{'='*50}\n")
        
        # Get test request
        test_request = db.session.get(TestRequest, test_request_id)
        if not test_request:
            print(f"❌ Test request {test_request_id} not found")
            return jsonify({'error': 'Test request not found'}), 404
        
        # Get concrete tests with results - try has_results=True first, then all tests
        concrete_tests = ConcreteTest.query.filter_by(
            test_request_id=test_request_id,
            has_results=True
        ).all()
        
        # If no tests with results, return empty structure (new test - no saved data yet)
        if not concrete_tests:
            print(f"⚠️ No tests with has_results=True")
            print(f"✅ Returning empty observation structure for new test")
            return jsonify({
                'formData': {
                    'sampleDescription': 'Concrete Cube Specimen',
                    'cubeCondition': 'Acceptable',
                    'curingCondition': '',
                    'machineUsed': 'CTM (2000KN)',
                    'testMethod': 'IS 516 (Part1/Sec1):2021',
                    'averageStrength': '',
                    'testedBy': '',
                    'checkedBy': '',
                    'verifiedBy': 'Mr. P A Sanghave',
                    'testRemarks': ''
                },
                'testRows': [],
                'capturedImages': {},
                'isEmpty': True
            }), 200
        
        print(f"✅ Found {len(concrete_tests)} concrete test(s)")
        
        # Get the first concrete test (or you can get specific one)
        concrete_test = concrete_tests[0]
        
        print(f"✅ Concrete Test Details:")
        print(f"   - ID: {concrete_test.id}")
        print(f"   - Weight: {concrete_test.weight}")
        print(f"   - Compressive Strength: {concrete_test.compressive_strength}")
        print(f"   - Has Results: {concrete_test.has_results}")
        
        # Build response data
        saved_data = {
            'formData': {
                'sampleDescription': concrete_test.sample_description or 'Concrete Cube Specimen',
                'cubeCondition': concrete_test.cube_condition or 'Acceptable',
                'curingCondition': concrete_test.curing_condition or '',
                'machineUsed': concrete_test.machine_used or 'CTM (2000KN)',
                'testMethod': concrete_test.test_method or 'IS 516 (Part1/Sec1):2021',
                'averageStrength': str(concrete_test.average_strength) if concrete_test.average_strength else '',
                'testedBy': concrete_test.tested_by or '',
                'checkedBy': concrete_test.checked_by or '',
                'verifiedBy': concrete_test.verified_by or 'Mr. P A Sanghave',
                'testRemarks': concrete_test.test_remarks or ''
            },
            'testRows': [],
            'capturedImages': {}
        }
        
        print(f"✅ Built formData")
        
        # Build test rows from observations_json if available, otherwise from concrete test data
        print(f"✅ Building test rows from {len(concrete_tests)} concrete tests...")
        
        # Try to load from observations_json first
        if concrete_tests and concrete_tests[0].observations_json:
            try:
                import json
                observations_data = json.loads(concrete_tests[0].observations_json)
                if 'testRows' in observations_data:
                    saved_data['testRows'] = observations_data['testRows']
                    print(f"✅ Loaded {len(saved_data['testRows'])} test rows from observations_json")
            except (json.JSONDecodeError, KeyError) as e:
                print(f"⚠️ Failed to parse observations_json: {e}")
        
        # Load captured images from database
        if concrete_tests:
            concrete_test = concrete_tests[0]
            photos = TestPhoto.query.filter_by(concrete_test_id=concrete_test.id).all()
            captured_images = {}
            
            for photo in photos:
                image_key = f"{photo.photo_type}_{int(photo.cube_number)}"
                if photo.photo_data:
                    # Add data URL prefix for display
                    captured_images[image_key] = f"data:image/jpeg;base64,{photo.photo_data}"
            
            saved_data['capturedImages'] = captured_images
            print(f"✅ Loaded {len(captured_images)} images from database")
        
        # Fallback to building from concrete test data if no observations_json
        if not saved_data['testRows']:
            for idx, ct in enumerate(concrete_tests):
                print(f"   Row {idx + 1}: weight={ct.weight}, strength={ct.compressive_strength}")
                row = {
                    'id': idx + 1,
                    'cubeId': ct.id_mark or f'C{idx + 1}',
                    'length': str(ct.dimension_length) if ct.dimension_length else '',
                    'breadth': str(ct.dimension_width) if ct.dimension_width else '',
                    'height': str(ct.dimension_height) if ct.dimension_height else '',
                    'area': str(ct.dimension_length * ct.dimension_width) if (ct.dimension_length and ct.dimension_width) else '',
                    'weight': str(ct.weight) if ct.weight else '',
                    'density': '',  # Calculate if needed
                    'crushingLoad': str(ct.crushing_load) if ct.crushing_load else '',
                    'compressiveStrength': str(ct.compressive_strength) if ct.compressive_strength else '',
                    'failureType': str(ct.failure_type) if ct.failure_type else ''
                }
                saved_data['testRows'].append(row)
        
        print(f"✅ Built {len(saved_data['testRows'])} test rows")
        
        # TODO: Load captured images from database if stored
        
        print(f"✅ Returning saved observations data:")
        print(f"   - formData fields: {len(saved_data['formData'])}")
        print(f"   - testRows: {len(saved_data['testRows'])}")
        print(f"{'='*50}\n")
        
        return jsonify(saved_data), 200
        
    except Exception as e:
        import traceback
        error_trace = traceback.format_exc()
        app.logger.error(f"Error retrieving test observations: {error_trace}")
        print(f"\n❌ ERROR RETRIEVING OBSERVATIONS:")
        print(error_trace)
        print(f"{'='*50}\n")
        return jsonify({'error': f'Failed to retrieve observations: {str(e)}'}), 500

@app.route('/api/test-observations/<int:test_request_id>', methods=['POST'])
def save_test_observations(test_request_id):
    """Save test observations including cube results"""
    try:
        from models import TestRequest, ConcreteTest
        
        data = request.get_json()
        print(f"Saving observations for test request {test_request_id}: {data}")
        
        # Get test request
        test_request = db.session.get(TestRequest, test_request_id)
        if not test_request:
            return jsonify({'error': 'Test request not found'}), 404
        
        # Get form data from observations
        form_data = data.get('formData', {})
        test_rows = data.get('testRows', [])
        
        # Get the first concrete test for this test request
        concrete_test = ConcreteTest.query.filter_by(test_request_id=test_request_id).first()
        if not concrete_test:
            return jsonify({'error': 'Concrete test not found'}), 404
        
        # Save all test rows as JSON in observations_json
        import json
        concrete_test.observations_json = json.dumps({
            'formData': form_data,
            'testRows': test_rows
        })
        
        # Save captured images to database
        captured_images = data.get('capturedImages', {})
        if captured_images:
            # Clear existing photos for this test
            TestPhoto.query.filter_by(concrete_test_id=concrete_test.id).delete()
            
            # Save new photos
            for image_key, image_data in captured_images.items():
                if image_data and image_data.startswith('data:image'):
                    # Parse image key to get cube number and photo type
                    # Format: front_failure_1, digital_reading_1, back_failure_1
                    parts = image_key.split('_')
                    if len(parts) >= 3:
                        photo_type = f"{parts[0]}_{parts[1]}"  # front_failure, digital_reading, back_failure
                        cube_number = float(parts[2])
                        
                        # Remove data URL prefix
                        if 'base64,' in image_data:
                            image_data = image_data.split('base64,')[1]
                        
                        photo = TestPhoto(
                            concrete_test_id=concrete_test.id,
                            photo_type=photo_type,
                            cube_number=cube_number,
                            photo_data=image_data,
                            filename=f"{photo_type}_{cube_number}.jpg"
                        )
                        db.session.add(photo)
        
        # Save additional form data
        concrete_test.sample_description = form_data.get('sampleDescription', 'Concrete Cube Specimen')
        concrete_test.cube_condition = form_data.get('cubeCondition', 'Good')
        concrete_test.curing_condition = form_data.get('curingCondition', '')
        concrete_test.machine_used = form_data.get('machineUsed', 'Universal Testing Machine')
        concrete_test.test_method = form_data.get('testMethod', 'IS 516 (Part1/Sec1):2021')
        concrete_test.test_remarks = form_data.get('testRemarks', '')
        concrete_test.tested_by = form_data.get('testedBy', '')
        concrete_test.checked_by = form_data.get('checkedBy', '')
        concrete_test.verified_by = form_data.get('verifiedBy', 'Mr. P A Sanghave')
        
        # Calculate average strength if provided
        if form_data.get('averageStrength'):
            concrete_test.average_strength = float(form_data['averageStrength'])
        
        # Update with first test row data (for backward compatibility)
        if test_rows:
            first_row = test_rows[0]
            concrete_test.weight = float(first_row.get('weight', 0)) if first_row.get('weight') else None
            concrete_test.dimension_length = float(first_row.get('length', 0)) if first_row.get('length') else None
            concrete_test.dimension_width = float(first_row.get('breadth', 0)) if first_row.get('breadth') else None
            concrete_test.dimension_height = float(first_row.get('height', 0)) if first_row.get('height') else None
            concrete_test.crushing_load = float(first_row.get('crushingLoad', 0)) if first_row.get('crushingLoad') else None
            concrete_test.compressive_strength = float(first_row.get('compressiveStrength', 0)) if first_row.get('compressiveStrength') else None
            concrete_test.failure_type = first_row.get('failureType', '')
            concrete_test.has_results = True
        
        # Update test request status
        test_request.status = 'observations_completed'
        
        db.session.commit()
        
        return jsonify({
            'message': 'Test observations saved successfully',
            'test_request_id': test_request_id
        }), 200
        
    except Exception as e:
        db.session.rollback()
        import traceback
        error_trace = traceback.format_exc()
        app.logger.error(f"Error saving test observations: {error_trace}")
        print(f"OBSERVATIONS ERROR: {error_trace}")
        return jsonify({'error': f'Failed to save observations: {str(e)}'}), 500

@app.route('/api/strength-graph/<int:test_request_id>', methods=['POST'])
def save_strength_graph(test_request_id):
    """Save strength graph data and observations"""
    import sys
    sys.stdout.flush()  # Force output
    
    print(f"\n{'='*50}", flush=True)
    print(f"[STRENGTH GRAPH] ENDPOINT HIT!", flush=True)
    print(f"   Method: {request.method}", flush=True)
    print(f"   Test Request ID: {test_request_id}", flush=True)
    print(f"{'='*50}\n", flush=True)
    
    try:
        from models import TestRequest, ConcreteTest
        import json
        
        # Get JSON data
        data = request.get_json()
        if not data:
            print("❌ ERROR: No JSON data received")
            return jsonify({'error': 'No data provided'}), 400
            
        print(f"📥 Received data: {data}")
        
        # Get test request
        test_request = db.session.get(TestRequest, test_request_id)
        if not test_request:
            print(f"❌ ERROR: Test request {test_request_id} not found")
            return jsonify({'error': 'Test request not found'}), 404
        
        print(f"✅ Found test request: {test_request.job_number}")
        
        # Get concrete tests
        concrete_tests = ConcreteTest.query.filter_by(test_request_id=test_request_id).all()
        if not concrete_tests:
            print(f"⚠️ WARNING: No concrete tests found for request {test_request_id}")
            print(f"⚠️ Creating a new concrete test record...")
            
            # Create a new concrete test record
            concrete_test = ConcreteTest(
                test_request_id=test_request_id,
                has_results=True,
                test_method='IS 516 (Part1/Sec1):2021'
            )
            db.session.add(concrete_test)
            db.session.flush()  # Get the ID
            print(f"✅ Created new concrete test with ID: {concrete_test.id}")
        else:
            print(f"✅ Found {len(concrete_tests)} concrete test(s)")
            # We'll save to the first concrete test
            concrete_test = concrete_tests[0]
        
        # Extract strength data - handle empty strings
        def safe_float(value):
            if value == '' or value is None:
                return None
            try:
                return float(value)
            except (ValueError, TypeError):
                return None
        
        strength_data = {
            "required_7": safe_float(data.get('required_7')),
            "actual_7": safe_float(data.get('actual_7')),
            "required_14": safe_float(data.get('required_14')),
            "actual_14": safe_float(data.get('actual_14')),
            "required_28": safe_float(data.get('required_28')),
            "actual_28": safe_float(data.get('actual_28')),
            "has_data": True
        }
        
        # Extract observations
        observations_data = {
            "obs_strength_duration": str(data.get('obs_strength_duration', '')),
            "obs_test_results": str(data.get('obs_test_results', '')),
            "obs_weight": str(data.get('obs_weight', '')),
            "obs_failure_pattern": str(data.get('obs_failure_pattern', '')),
            "obs_bonding": str(data.get('obs_bonding', '')),
            "obs_strength_criteria": str(data.get('obs_strength_criteria', ''))
        }
        
        print(f"📊 Strength data: {strength_data}")
        print(f"📝 Observations: {observations_data}")
        
        # Save as JSON strings
        concrete_test.test_results_json = json.dumps(strength_data)
        concrete_test.observations_json = json.dumps(observations_data)
        
        # Update test request status
        test_request.status = 'graph_generated'
        
        # Commit to database
        db.session.commit()
        
        print(f"✅ Successfully saved strength graph data for test request {test_request_id}")
        print(f"{'='*50}\n")
        
        return jsonify({
            'success': True,
            'message': 'Strength graph data saved successfully',
            'test_request_id': test_request_id,
            'strength_data': strength_data,
            'observations': observations_data
        }), 200
        
    except Exception as e:
        db.session.rollback()
        import traceback
        error_trace = traceback.format_exc()
        app.logger.error(f"Error saving strength graph: {error_trace}")
        print(f"\n❌ STRENGTH GRAPH ERROR:")
        print(error_trace)
        print(f"{'='*50}\n")
        return jsonify({'error': f'Failed to save strength graph: {str(e)}'}), 500

# Error handlers
@app.errorhandler(404)
def page_not_found(e):
    return "Page not found", 404

@app.errorhandler(500)
def server_error(e):
    # Log the error for debugging
    app.logger.error(f"Internal Server Error: {str(e)}")
    return "Internal server error", 500

# Authentication endpoints
@app.route('/api/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        from models import User
        from datetime import datetime
        
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400
        
        # Find user by email
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'error': 'Invalid email or password'}), 401
        
        if not user.is_active:
            return jsonify({'error': 'Account is disabled'}), 403
        
        # Check password (plain text comparison - SIMPLE VERSION)
        if user.password != password:
            return jsonify({'error': 'Invalid email or password'}), 401
        
        # Update last login
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'email': user.email,
                'full_name': user.full_name,
                'role': user.role
            }
        }), 200
        
    except Exception as e:
        app.logger.error(f"Login error: {str(e)}")
        return jsonify({'error': 'Login failed'}), 500


@app.route('/api/logout', methods=['POST'])
def logout():
    """User logout endpoint"""
    return jsonify({'message': 'Logout successful'}), 200


if __name__ == '__main__':
    # Disable Flask CLI dotenv loading to avoid encoding issues
    import os
    os.environ['FLASK_SKIP_DOTENV'] = '1'
    print("Starting Vitrag Associates Testing Lab Backend...")
    print("SUCCESS: Database connection: WORKING")
    print("SUCCESS: Flask app: READY")
    print("INFO: Server will be available at: http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=False)
