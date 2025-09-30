from models import Customer
from database import db
from app import app

with app.app_context():
    customer_name = "Jasprit Bumrah"
    print(f'Searching for: "{customer_name}"')
    
    # Test all the lookup methods
    print('\n1. Exact name match:')
    customer = Customer.query.filter_by(name=customer_name).first()
    print(f'Result: {customer.name if customer else "NOT FOUND"}')
    
    print('\n2. First + Last name split:')
    name_parts = customer_name.split(' ', 1)
    if len(name_parts) >= 2:
        customer = Customer.query.filter_by(
            first_name=name_parts[0],
            last_name=name_parts[1]
        ).first()
        print(f'First: "{name_parts[0]}", Last: "{name_parts[1]}"')
        print(f'Result: {customer.name if customer else "NOT FOUND"}')
    
    print('\n3. Case-insensitive search:')
    customer = Customer.query.filter(
        Customer.name.ilike(f'%{customer_name}%')
    ).first()
    print(f'Result: {customer.name if customer else "NOT FOUND"}')
    
    print('\n4. First name only:')
    customer = Customer.query.filter_by(first_name=customer_name).first()
    print(f'Result: {customer.name if customer else "NOT FOUND"}')
