import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "gigguard.db")

def get_connection():
    return sqlite3.connect(DB_PATH)

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    # Create Workers table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS workers (
            worker_id INTEGER PRIMARY KEY,
            name TEXT,
            city TEXT,
            platform TEXT,
            avg_daily_income REAL,
            reliability_score REAL DEFAULT 1.0,
            claims_count INTEGER DEFAULT 0,
            fraud_flags INTEGER DEFAULT 0
        )
    """)
    
    # Create Payouts table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS payouts (
            payout_id INTEGER PRIMARY KEY AUTOINCREMENT,
            worker_id INTEGER,
            amount REAL,
            disruption_prob REAL,
            expected_earnings REAL,
            actual_earnings REAL,
            fraud_score REAL,
            status TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (worker_id) REFERENCES workers (worker_id)
        )
    """)
    
    # Create Events table (Weather/AQI/Alerts)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS events (
            event_id INTEGER PRIMARY KEY AUTOINCREMENT,
            city TEXT,
            rainfall REAL,
            aqi REAL,
            temperature REAL,
            severity TEXT,
            event_type TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Create Risk Scores table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS risk_scores (
            city TEXT PRIMARY KEY,
            risk_index REAL,
            disruption_frequency REAL,
            seasonal_multiplier REAL DEFAULT 1.0
        )
    """)
    
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()
    print("✅ SQLite database initialized with corrected tables.")
