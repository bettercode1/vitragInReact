#!/usr/bin/env python3
"""
Test script to connect to PostgreSQL and query the machine table
"""

import psycopg2
from datetime import datetime, date

def test_postgres_connection():
    try:
        # Connect to PostgreSQL database
        # Update these connection details based on your setup
        conn = psycopg2.connect(
            host="localhost",
            database="vitragLLP",
            user="postgres",
            password="password"  # Update this to your actual password
        )
        
        print("✅ Connected to PostgreSQL database successfully!")
        
        # Create a cursor
        cur = conn.cursor()
        
        # Query the machine table
        cur.execute("SELECT machine_name, machine_id, last_maintenance_date, next_due_date FROM machine ORDER BY next_due_date ASC LIMIT 1")
        row = cur.fetchone()
        
        if row:
            machine_name, machine_id, last_maintenance, next_due = row
            print(f"✅ Found machine: {machine_name} ({machine_id})")
            print(f"   Last maintenance: {last_maintenance}")
            print(f"   Next due date: {next_due}")
            
            # Calculate days remaining
            today = date.today()
            days_remaining = (next_due - today).days
            is_near_expiry = days_remaining <= 30
            
            print(f"   Days remaining: {days_remaining}")
            print(f"   Near expiry: {is_near_expiry}")
            
            return {
                'success': True,
                'machine_name': machine_name,
                'machine_id': machine_id,
                'last_maintenance_date': last_maintenance.strftime('%Y-%m-%d'),
                'next_due_date': next_due.strftime('%Y-%m-%d'),
                'days_remaining': days_remaining,
                'is_near_expiry': is_near_expiry
            }
        else:
            print("❌ No machines found in database")
            return {'success': False, 'error': 'No machines found'}
            
    except psycopg2.Error as e:
        print(f"❌ PostgreSQL connection error: {e}")
        return {'success': False, 'error': str(e)}
    except Exception as e:
        print(f"❌ General error: {e}")
        return {'success': False, 'error': str(e)}
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()

if __name__ == "__main__":
    result = test_postgres_connection()
    print(f"\nResult: {result}")
