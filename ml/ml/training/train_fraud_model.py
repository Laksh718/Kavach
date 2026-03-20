import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib
import os

# Load data
df = pd.read_csv("ml/data/fraud_data.csv")

X = df.drop("is_fraud", axis=1)

# Model
model = IsolationForest(
    n_estimators=150,
    contamination=0.1,
    random_state=42
)

model.fit(X)

# Evaluate (Self)
# IsolationForest.predict returns -1 for anomalies, 1 for normal
# We can check the proportions
predictions = model.predict(X)
print("\n📊 FRAUD MODEL TRAINING")
print("Anomalies detected:", (predictions == -1).sum())
print("Normal instances:", (predictions == 1).sum())

# Save
os.makedirs("ml/models", exist_ok=True)
joblib.dump(model, "ml/models/fraud_model.pkl")

print("✅ Fraud model trained and saved at ml/models/fraud_model.pkl")
