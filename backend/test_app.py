#!/usr/bin/env python3
"""
Simple test version of the Flask app to verify database connectivity
"""

import os
import logging
from dotenv import load_dotenv

from flask import Flask, request, flash, redirect, url_for
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.exc import IntegrityError, OperationalError
from werkzeug.middleware.proxy_fix import ProxyFix
from werkzeug.exceptions import RequestEntityTooLarge
from database import db

# Load environment variables from .env file
load_dotenv()

# Configure logging for better debugging
logging.basicConfig(level=logging.DEBUG)

# Create the app
app = Flask(__name__)

# Set a secret key for session encryption
app.secret_key = "vitrag_associates_secure_key_2025"

app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)  # needed for url_for to generate with https

# Database configuration with proper error handling
# database_url = "postgresql://myapp:VitragLLP%402025@213.136.94.206:5432/vitragLLP"
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
            print("✅ Database connection successful!")
            return True
    except OperationalError as e:
        error_msg = str(e)
        print(f"❌ Database connection failed: {error_msg}")
        print("💡 Check your database server is running")
        print("💡 Verify host, port, username, and password")
        return False
    except Exception as e:
        print(f"❌ Unexpected database error: {str(e)}")
        return False

# Test database connection
if not test_database_connection():
    print("❌ Database connection failed. Please check your PostgreSQL server.")
    exit(1)

with app.app_context():
    # Import the models here so tables are created
    import models  # noqa: F401
    
    # Create all tables
    try:
        db.create_all()
        print("✅ Database tables created successfully!")
    except Exception as e:
        print(f"❌ Error creating database tables: {str(e)}")
        print("💡 Check your database permissions and connection")

# Health check endpoint for monitoring
@app.route('/ping')
def health_check():
    """Simple health check endpoint that returns 200 OK"""
    return "OK", 200

# Simple test endpoint
@app.route('/')
def home():
    """Simple home endpoint"""
    return "✅ Vitrag Associates Testing Lab - Backend is running!", 200

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
    print("🚀 Starting Vitrag Associates Testing Lab Backend...")
    print("✅ Database connection: WORKING")
    print("✅ Flask app: READY")
    print("🌐 Server will be available at: http://localhost:5000")
    app.run(host='0.0.0.0', port=5000, debug=False)
