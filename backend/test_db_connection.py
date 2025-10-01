#!/usr/bin/env python3
"""
Database connection test script
Run this to test your database connection before deploying
"""

import os
import sys
from dotenv import load_dotenv

def test_connection():
    """Test database connection"""
    print("🔍 Testing Database Connection...")
    print("=" * 40)
    
    # Load environment variables
    load_dotenv()
    
    # Get database URL
    database_url = os.environ.get("DATABASE_URL")
    if not database_url:
        print("❌ DATABASE_URL not found in environment variables")
        print("💡 Make sure you have a .env file or set DATABASE_URL environment variable")
        return False
    
    if database_url == "postgresql://username:password@host:port/database_name":
        print("❌ DATABASE_URL is still using the template value")
        print("💡 Please update .env file with your actual database credentials")
        return False
    
    print(f"📊 Database URL: {database_url}")
    
    try:
        # Test PostgreSQL connection
        if database_url.startswith("postgresql://"):
            import psycopg2
            from urllib.parse import urlparse
            
            # Parse the URL
            parsed = urlparse(database_url)
            
            # Test connection
            conn = psycopg2.connect(
                host=parsed.hostname,
                port=parsed.port,
                database=parsed.path[1:],  # Remove leading slash
                user=parsed.username,
                password=parsed.password
            )
            
            # Test query
            cursor = conn.cursor()
            cursor.execute("SELECT version();")
            version = cursor.fetchone()
            print(f"✅ PostgreSQL connection successful!")
            print(f"📊 Database version: {version[0]}")
            
            cursor.close()
            conn.close()
            
        # Test SQLite connection
        elif database_url.startswith("sqlite:///"):
            import sqlite3
            db_path = database_url.replace("sqlite:///", "")
            
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            cursor.execute("SELECT sqlite_version();")
            version = cursor.fetchone()
            print(f"✅ SQLite connection successful!")
            print(f"📊 SQLite version: {version[0]}")
            
            cursor.close()
            conn.close()
            
        else:
            print(f"❌ Unsupported database URL format: {database_url}")
            return False
            
        return True
        
    except Exception as e:
        print(f"❌ Database connection failed: {str(e)}")
        
        # Provide helpful error messages
        error_msg = str(e).lower()
        if "could not connect to server" in error_msg:
            print("💡 Check if your database server is running")
            print("💡 Verify the host and port in your DATABASE_URL")
        elif "authentication failed" in error_msg:
            print("💡 Check your username and password")
        elif "database" in error_msg and "does not exist" in error_msg:
            print("💡 The database does not exist - create it first")
        elif "permission denied" in error_msg:
            print("💡 Check your database user permissions")
        
        return False

def test_flask_app():
    """Test Flask app database initialization"""
    print("\n🔍 Testing Flask App Database Initialization...")
    print("=" * 50)
    
    try:
        # Import the app
        from app import app, db
        
        with app.app_context():
            # Test database connection
            db.engine.execute("SELECT 1")
            print("✅ Flask app database connection successful!")
            
            # Test table creation
            db.create_all()
            print("✅ Database tables created/verified successfully!")
            
        return True
        
    except Exception as e:
        print(f"❌ Flask app database test failed: {str(e)}")
        return False

def main():
    """Main test function"""
    print("🧪 Vitrag Associates Testing Lab - Database Connection Test")
    print("=" * 70)
    
    # Test basic connection
    if not test_connection():
        print("\n❌ Basic database connection test failed")
        print("💡 Fix the database connection before proceeding")
        sys.exit(1)
    
    # Test Flask app
    if not test_flask_app():
        print("\n❌ Flask app database test failed")
        print("💡 Check your app configuration")
        sys.exit(1)
    
    print("\n🎉 All database tests passed!")
    print("✅ Your application is ready for deployment")

if __name__ == "__main__":
    main()