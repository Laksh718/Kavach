import pandas as pd
import numpy as np

def calculate_portfolio_risk(active_policies_in_zone: int, zone_capacity: int = 500) -> float:
    """
    Returns a Portfolio Risk Score (0.0 to 1.0)
    0.0 = Safe
    1.0 = Critical Exposure (High risk of insolvency if payout triggered)
    """
    if zone_capacity == 0:
        return 1.0
        
    usage_ratio = active_policies_in_zone / zone_capacity
    
    # Non-linear risk: risk stays low, then spikes as we hit 80% capacity
    risk_score = np.power(usage_ratio, 3)
    
    return float(round(np.clip(risk_score, 0.0, 1.0), 3))

def should_throttle_payouts(risk_score: float) -> bool:
    """ If risk is critical (> 0.8), we might need to throttle or hold automatic payouts for manual review. """
    return risk_score > 0.8

if __name__ == "__main__":
    print(f"100/500 policies: Risk {calculate_portfolio_risk(100)}")
    print(f"400/500 policies: Risk {calculate_portfolio_risk(400)}")
    print(f"480/500 policies: Risk {calculate_portfolio_risk(480)}")
