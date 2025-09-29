# """
# Configuration file for Vitrag Associates Testing Lab
# Set your database and other configuration here
# """

# import os
# from dotenv import load_dotenv

# # Load environment variables from .env file if it exists
# load_dotenv()

# # Database Configuration
# DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///vitrag_testing.db")

# # Session Configuration
# SESSION_SECRET = os.environ.get("SESSION_SECRET", "vitrag_associates_secure_key_2025")

# # Email Configuration (SendGrid)
# SENDGRID_API_KEY = os.environ.get("SENDGRID_API_KEY", "your_sendgrid_api_key_here")
# COMPANY_EMAIL = os.environ.get("COMPANY_EMAIL", "reports@vitragassociates.com")

# # SMS Configuration (Twilio)
# TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID", "your_twilio_account_sid_here")
# TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN", "your_twilio_auth_token_here")
# TWILIO_PHONE_NUMBER = os.environ.get("TWILIO_PHONE_NUMBER", "your_twilio_phone_number_here")
# TWILIO_WHATSAPP_NUMBER = os.environ.get("TWILIO_WHATSAPP_NUMBER", "+14155238886")

# # WhatsApp Configuration (UltraMsg - Alternative)
# ULTRAMSG_INSTANCE_ID = os.environ.get("ULTRAMSG_INSTANCE_ID", "your_ultramsg_instance_id_here")
# ULTRAMSG_TOKEN = os.environ.get("ULTRAMSG_TOKEN", "your_ultramsg_token_here")

# # Application Configuration
# APP_BASE_URL = os.environ.get("APP_BASE_URL", "https://vitrag-testing-lab.replit.app")

# # Example database URLs for different scenarios:
# DATABASE_EXAMPLES = {
#     "local_postgresql": "postgresql://username:password@localhost:5432/vitrag_testing",
#     "heroku_postgresql": "postgresql://username:password@host:port/database",
#     "sqlite_fallback": "sqlite:///vitrag_testing.db"
# }

# def print_config():
#     """Print current configuration (without sensitive data)"""
#     print("Current Configuration:")
#     print(f"DATABASE_URL: {'Set' if DATABASE_URL != 'postgresql://username:password@localhost:5432/vitrag_testing' else 'Not configured'}")
#     print(f"SESSION_SECRET: {'Set' if SESSION_SECRET != 'vitrag_associates_secure_key_2025' else 'Using default'}")
#     print(f"COMPANY_EMAIL: {COMPANY_EMAIL}")
#     print(f"APP_BASE_URL: {APP_BASE_URL}")

# if __name__ == "__main__":
#     print_config() 