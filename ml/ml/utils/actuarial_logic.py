import numpy as np

def calculate_pure_premium(risk_score, base_payout=300):
    """
    Quantitative Actuarial Calculation:
    Pure Premium = Probability of Loss * Magnitude of Loss
    """
    # risk_score (0-1) is our estimated probability of loss
    pure_premium = risk_score * base_payout
    return round(pure_premium, 2)

def check_exclusion_clauses(news_description):
    """
    Standard Insurance Exclusions:
    Returns True if an exclusion event is detected in the environment.
    Exclusions: War, Pandemic, Nuclear, Catastrophic Acts of God (outside parametric scope).
    """
    exclusions = ["war", "invasion", "pandemic", "covid", "nuclear", "civil war", "terrorism"]
    desc_lower = news_description.lower()
    
    for exc in exclusions:
        if exc in desc_lower:
            return True, exc
    return False, None

def calculate_final_premium(risk_score, expense_ratio=0.2, profit_margin=0.1):
    """
    Gross Premium = Pure Premium / (1 - Expense Ratio - Profit Margin)
    Ensures the business is sustainable (Actuarial best practice).
    """
    pure_premium = calculate_pure_premium(risk_score)
    gross_premium = pure_premium / (1 - expense_ratio - profit_margin)
    return round(gross_premium, 2)

def adjust_premium_for_local_risk(base_premium: float, is_safe_zone: bool) -> tuple:
    """
    Adjusts premium based on hyper-local risk factors.
    - ₹2 discount if historically safe from water logging.
    """
    adjustment = 0.0
    reason = "Standard Pricing"
    
    if is_safe_zone:
        adjustment = -2.0
        reason = "Hyper-local Safety Discount (No Water Logging)"
        
    final_premium = max(base_premium + adjustment, 5.0) # Ensure a floor
    return round(final_premium, 2), reason

def calculate_coverage_adjustment(predicted_precip_mm: float, base_hours: int = 8) -> int:
    """
    Dynamically adjusts coverage hours based on predictive weather modeling.
    - +2 hours if rainfall > 10mm (anticipatory protection).
    """
    if predicted_precip_mm > 10.0:
        return base_hours + 2
    return base_hours
