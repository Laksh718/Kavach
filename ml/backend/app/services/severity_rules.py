# [Deterministic Rules] Severity Scaling
# This module implements the payout multiplier based on event intensity.

def get_severity_multiplier(rainfall: float, aqi: float, threshold_rain: float = 40.0, threshold_aqi: float = 300.0) -> float:
    """ 
    Scales the payout based on severity buckets.
    Rules:
    - Below Threshold: 0.0 (No Payout)
    - Borderline (40-60mm): 0.5 (Half Payout)
    - Severe (>70mm): 1.0 (Full Payout)
    - Extreme (>120mm): 1.2 (Bonused for extreme catastrophe)
    """

    if rainfall >= 120 or aqi >= 450:
        return 1.2
    
    if rainfall >= 70 or aqi >= 350:
        return 1.0
    
    if rainfall >= threshold_rain or aqi >= threshold_aqi:
        return 0.5
    
    return 0.0

if __name__ == "__main__":
    # Test cases
    print(f"60mm Rain: {get_severity_multiplier(60, 200)}x Payout")
    print(f"90mm Rain: {get_severity_multiplier(90, 200)}x Payout")
    print(f"25mm Rain: {get_severity_multiplier(25, 200)}x Payout")
    print(f"130mm Rain: {get_severity_multiplier(130, 200)}x Payout")
