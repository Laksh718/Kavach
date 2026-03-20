import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import joblib
import xgboost as xgb
import os

# Load data
df = pd.read_csv("ml/data/earnings_data.csv")

X = df.drop("earnings", axis=1)
y = df["earnings"]

# Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Model
model = xgb.XGBRegressor(
    n_estimators=200,
    learning_rate=0.1,
    max_depth=5
)

model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)

mae = mean_absolute_error(y_test, y_pred)

print("\n📊 Earnings Model Performance")
print("MAE:", mae)

# Save
os.makedirs("ml/models", exist_ok=True)
joblib.dump(model, "ml/models/earnings_model.pkl")

print("\n✅ Model saved at ml/models/earnings_model.pkl")
