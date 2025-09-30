"""
Script to add users to the database
Run this to create new users with email and password
"""
import os
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from dotenv import load_dotenv
from database import db
from flask import Flask
from models import User
from datetime import datetime

load_dotenv()

app = Flask(__name__)
database_url = "postgresql://myapp:VitragLLP%402025@213.136.94.206:5432/vitragLLP"
app.config['SQLALCHEMY_DATABASE_URI'] = database_url
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

def add_user(email, password, full_name, role='user'):
    """Add a new user to the database"""
    with app.app_context():
        try:
            # Check if user already exists
            existing_user = User.query.filter_by(email=email).first()
            if existing_user:
                print(f"User {email} already exists!")
                return
            
            # Create new user
            user = User(
                email=email,
                full_name=full_name,
                role=role,
                is_active=True
            )
            user.set_password(password)  # This will hash the password automatically
            
            db.session.add(user)
            db.session.commit()
            
            print(f"User added successfully!")
            print(f"  Email: {email}")
            print(f"  Name: {full_name}")
            print(f"  Role: {role}")
            print(f"  Password: (hashed securely)")
            
        except Exception as e:
            db.session.rollback()
            print(f"Error adding user: {str(e)}")
            import traceback
            traceback.print_exc()

if __name__ == '__main__':
    print("=== Add Users to Vitrag System ===\n")
    
    # Add admin user
    add_user(
        email='admin@vitrag.com',
        password='admin123',
        full_name='Admin User',
        role='admin'
    )
    
    print()
    
    # Add regular user
    add_user(
        email='user@vitrag.com',
        password='user123',
        full_name='Regular User',
        role='user'
    )
    
    print("\n=== Users added successfully! ===")
    print("\nYou can login with:")
    print("  Email: admin@vitrag.com, Password: admin123")
    print("  Email: user@vitrag.com, Password: user123")
