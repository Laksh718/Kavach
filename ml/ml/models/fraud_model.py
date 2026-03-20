import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest

def _init_model():
    """ Trains a synthetic IsolationForest on initialization """
    n_samples = 1000
    np.random.seed(42)
    X = pd.DataFrame({
        'gps_disparity': np.random.uniform(0, 10, n_samples),
        'requests_count': np.random.poisson(2, n_samples),
        'amount': np.random.uniform(200, 1500, n_samples)
    })
    X.loc[980:999, 'gps_disparity'] = np.random.uniform(80, 200, 20)
    
    model = IsolationForest(contamination=0.03, random_state=42)
    model.fit(X)
    return model

_model = _init_model()

def detect_anomaly(gps_disparity: float, requests_count: int, amount: float) -> bool:
    """ Returns True if anomaly/fraud detected """
    X_pred = pd.DataFrame([[gps_disparity, requests_count, amount]], columns=['gps_disparity', 'requests_count', 'amount'])
    pred = _model.predict(X_pred)[0]
    return pred == -1 # Outlier
