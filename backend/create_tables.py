# from app import app, db
# from models import *

# def create_all_tables():
#     with app.app_context():
#         try:
#             db.create_all()
#             print("✅ All database tables created successfully!")
            
#             # Test if liquid_admixture_test table exists
#             from sqlalchemy import text
#             result = db.session.execute(text("SELECT name FROM sqlite_master WHERE type='table' AND name='liquid_admixture_test'"))
#             if result.fetchone():
#                 print("✅ liquid_admixture_test table exists!")
#             else:
#                 print("❌ liquid_admixture_test table does not exist!")
                
#         except Exception as e:
#             print(f"❌ Error creating tables: {e}")

# if __name__ == "__main__":
#     create_all_tables() 