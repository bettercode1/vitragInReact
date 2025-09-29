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
CORS(app, origins=['http://localhost:3000'])

# Set a secret key for session encryption
app.secret_key = "vitrag_associates_secure_key_2025"

app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)  # needed for url_for to generate with https

# Database configuration with proper error handling
#database_url = "postgresql://myapp:VitragLLP%402025@213.136.94.206:5432/vitragLLP"
database_url = "postgresql://neondb_owner:npg_eHZv0ncD8irC@ep-muddy-pond-a6nccqdf.us-west-2.aws.neon.tech/neondb?sslmode=require"

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
        from models import Customer
        
        customer = Customer.query.get_or_404(customer_id)
        
        # Check if customer has associated test requests
        if customer.test_requests:
            return jsonify({'error': 'Cannot delete customer with associated test requests'}), 400
        
        db.session.delete(customer)
        db.session.commit()
        
        return jsonify({'message': 'Customer deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error deleting customer: {str(e)}")
        return jsonify({'error': 'Failed to delete customer'}), 500

# API endpoint to fetch all test requests (for samples page)
@app.route('/api/test-requests', methods=['GET'])
def get_test_requests():
    """Fetch all test requests with customer information for samples page"""
    try:
        from models import TestRequest, Customer, ConcreteTest, TestingMaterial
        
        # Get query parameters for filtering
        status_filter = request.args.get('status', '')
        search_query = request.args.get('search', '')
        type_filter = request.args.get('type', '')
        # Removed pagination to show all data
        
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
        
        # Get all results without pagination
        results = query.order_by(TestRequest.created_at.desc()).all()
        
        # Format response with all related data
        test_requests = []
        for test_request, customer_name, customer_phone in results:
            # Get concrete tests for this test request
            concrete_tests = ConcreteTest.query.filter_by(test_request_id=test_request.id).all()
            concrete_tests_data = []
            for ct in concrete_tests:
                concrete_tests_data.append({
                    'ulr_number': ct.ulr_number,
                    'casting_date': ct.casting_date.isoformat() if ct.casting_date else None,
                    'testing_date': ct.testing_date.isoformat() if ct.testing_date else None,
                    'num_of_cubes': ct.num_of_cubes,
                    'idMark': ct.id_mark,
                    'locationNature': ct.location_nature,
                    'grade': ct.grade,
                    'method': ct.test_method,
                    'has_results': ct.has_results
                })
            
            # Get testing materials for this test request
            materials = TestingMaterial.query.filter_by(test_request_id=test_request.id).all()
            materials_data = []
            for material in materials:
                materials_data.append({
                    'material_name': material.material_name,
                    'quantity': material.quantity,
                    'test_requirement': material.test_requirement,
                    'ulr_number': material.ulr_number
                })
            
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
                # Related data
                'concrete_tests': concrete_tests_data,
                'materials': materials_data,
                'customer_phone': customer_phone
            })
        
        return jsonify({
            'test_requests': test_requests,
            'total': len(test_requests)
        }), 200
        
    except Exception as e:
        app.logger.error(f"Error fetching test requests: {str(e)}")
        return jsonify({'error': 'Failed to fetch test requests'}), 500

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
                'site_name': test_request.site_name,
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
                'site_name': test_request.site_name,
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

# Error handlers
@app.errorhandler(404)
def page_not_found(e):
    return "Page not found", 404

@app.errorhandler(500)
def server_error(e):
    # Log the error for debugging
    app.logger.error(f"Internal Server Error: {str(e)}")
    return "Internal server error", 500

if __name__ == '__main__':
    # Disable Flask CLI dotenv loading to avoid encoding issues
    import os
    os.environ['FLASK_SKIP_DOTENV'] = '1'
    print("Starting Vitrag Associates Testing Lab Backend...")
    print("SUCCESS: Database connection: WORKING")
    print("SUCCESS: Flask app: READY")
    print("INFO: Server will be available at: http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=False)
