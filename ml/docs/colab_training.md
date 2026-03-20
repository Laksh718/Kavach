# 🧠 Google Colab Training Guide

Since your local device does not have a GPU, you can train the **XGBoost Risk Score** or **Fraud Detection Models** on Google Colab using synthetic data triggers generated in the workspace.

---

### 📋 Step 1: Export Database Data to CSV
You can create a quick Python script to dump SQLite tables into a single DataFrame merge template for training:

```python
import pandas as pd
import sqlite3

# Connect to the SQLite DB
conn = sqlite3.connect("backend/app/database/kavach.db")

# Read Tables
workers = pd.read_sql("SELECT * FROM workers", conn)
payouts = pd.read_sql("SELECT * FROM payouts", conn)

# Merge datasets for correlated fraud inference
df = payouts.merge(workers, left_on="worker_id", right_on="id")
df.to_csv("ml_training_data.csv", index=False)
print("Data Exported to ml_training_data.csv")
```

---

### 🧪 Step 2: Setup Colab Notebook
1. Go to [colab.research.google.com](https://colab.research.google.com/)
2. Upload `ml_training_data.csv` to the session storage.
3. Run the following XGBoost training snippet:

```python
import pandas as pd
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
import joblib

# Load Data
df = pd.read_csv("ml_training_data.csv")

# Feature Selection
# Let's say we want to predict 'FRAUD_SUSPECTED' based on location coefficient weights & amounts
X = df[['gps_lat', 'gps_lon', 'amount', 'risk_score']] 
y = (df['status'] == 'FRAUD_SUSPECTED').astype(int) 

# Train Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 🚀 Fit XGBoost Model
print("Training AI Fraud Detection Model...")
model = XGBClassifier(use_label_encoder=False, eval_metric='logloss')
model.fit(X_train, y_train)

# 💾 Save inference weights
joblib.dump(model, 'fraud_model.joblib')
print("Model saved to fraud_model.joblib!")
```

---

### 📥 Step 3: Implement weights on API
1. Download the `fraud_model.joblib` to your workspace folder `ml/models/`.
2. Update `backend/app/services/fraud_service.py` with:
```python
import joblib
import numpy as np

# Load model on startup
clf = joblib.load("ml/models/fraud_model.joblib")

def detect_fraud_ai(worker_id, gps_lat, gps_lon):
    X_input = np.array([[gps_lat, gps_lon, ...]])
    is_fraud = clf.predict(X_input)
    return bool(is_fraud[0])
```
