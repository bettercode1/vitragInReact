#!/usr/bin/env python3
"""
Production deployment script for Vitrag Associates Testing Lab
This script helps you set up the application for hosting with proper database configuration
"""

import os
import sys
from pathlib import Path

def create_env_file():
    """Create .env file with production configuration"""
    env_content = """# Database Configuration
# Replace with your actual database URL for hosting
DATABASE_URL=postgresql://username:password@host:port/database_name

# Session Configuration
SESSION_SECRET=your_secure_session_secret_here

# Email Configuration (SendGrid)
SENDGRID_API_KEY=your_sendgrid_api_key_here
COMPANY_EMAIL=reports@vitragassociates.com

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here
TWILIO_WHATSAPP_NUMBER=+14155238886

# WhatsApp Configuration (UltraMsg - Alternative)
ULTRAMSG_INSTANCE_ID=your_ultramsg_instance_id_here
ULTRAMSG_TOKEN=your_ultramsg_token_here

# Application Configuration
APP_BASE_URL=https://your-app-domain.com
FLASK_DEBUG=False

# Example database URLs for different hosting platforms:
# Heroku: postgresql://user:pass@host:port/dbname
# Railway: postgresql://user:pass@host:port/dbname
# Render: postgresql://user:pass@host:port/dbname
# DigitalOcean: postgresql://user:pass@host:port/dbname
# Supabase: postgresql://postgres:password@host:port/postgres
"""
    
    env_file = Path(".env")
    if env_file.exists():
        print("⚠️  .env file already exists. Backing up to .env.backup")
        env_file.rename(".env.backup")
    
    with open(".env", "w") as f:
        f.write(env_content)
    
    print("✅ Created .env file with production template")
    print("📝 Please edit .env file with your actual database credentials")

def check_requirements():
    """Check if all required packages are installed"""
    try:
        import flask
        import sqlalchemy
        import psycopg2
        import python_dotenv
        print("✅ All required packages are installed")
        return True
    except ImportError as e:
        print(f"❌ Missing required package: {e}")
        print("💡 Run: pip install -r requirements.txt")
        return False

def test_database_connection():
    """Test database connection using the .env file"""
    try:
        from dotenv import load_dotenv
        load_dotenv()
        
        database_url = os.environ.get("DATABASE_URL")
        if not database_url or database_url == "postgresql://username:password@host:port/database_name":
            print("⚠️  DATABASE_URL not configured in .env file")
            print("💡 Please update .env file with your actual database URL")
            return False
        
        from sqlalchemy import create_engine
        engine = create_engine(database_url)
        connection = engine.connect()
        connection.close()
        print("✅ Database connection test successful!")
        return True
    except Exception as e:
        print(f"❌ Database connection test failed: {e}")
        print("💡 Check your DATABASE_URL in .env file")
        return False

def create_production_script():
    """Create a production startup script"""
    script_content = """#!/bin/bash
# Production startup script for Vitrag Associates Testing Lab

echo "🚀 Starting Vitrag Associates Testing Lab..."

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ DATABASE_URL not found in environment"
    echo "💡 Please set DATABASE_URL in your hosting platform's environment variables"
    exit 1
fi

# Start the application with Gunicorn
echo "📊 Starting application with Gunicorn..."
gunicorn --config gunicorn_config.py app:app
"""
    
    with open("start_production.sh", "w") as f:
        f.write(script_content)
    
    # Make it executable
    os.chmod("start_production.sh", 0o755)
    print("✅ Created start_production.sh script")

def main():
    """Main deployment function"""
    print("🏗️  Vitrag Associates Testing Lab - Production Deployment")
    print("=" * 60)
    
    # Check requirements
    if not check_requirements():
        sys.exit(1)
    
    # Create .env file
    create_env_file()
    
    # Create production script
    create_production_script()
    
    print("\n📋 Next Steps:")
    print("1. Edit .env file with your actual database credentials")
    print("2. Set DATABASE_URL environment variable in your hosting platform")
    print("3. Test the connection: python deploy_production.py --test-db")
    print("4. Deploy using: ./start_production.sh")
    
    # Test database if requested
    if "--test-db" in sys.argv:
        print("\n🔍 Testing database connection...")
        test_database_connection()

if __name__ == "__main__":
    main()
