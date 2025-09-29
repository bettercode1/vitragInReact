#!/usr/bin/env python3
import sys
sys.path.append('backend')

from backend.models import TestRequest, Customer
from backend.database import db
from backend.app import app

with app.app_context():
    # Check if we have any test requests
    test_count = TestRequest.query.count()
    customer_count = Customer.query.count()
    print(f'Test Requests in DB: {test_count}')
    print(f'Customers in DB: {customer_count}')
    
    if test_count > 0:
        # Show first few test requests
        tests = TestRequest.query.limit(5).all()
        for test in tests:
            print(f'Test ID: {test.id}, Job: {test.job_number}, Status: {test.status}')
    else:
        print('No test requests found in database')
        
    # Check customers
    if customer_count > 0:
        customers = Customer.query.limit(3).all()
        for customer in customers:
            print(f'Customer ID: {customer.id}, Name: {customer.name}, Phone: {customer.phone}')
