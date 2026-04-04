# [Deterministic Rules] Payout Constraints
# Final logic to ensure payout is within insurance policy limits.

MIN_LOSS_THRESHOLD = 50.0  # ₹50 minimum loss to trigger
MAX_PAYOUT_CAP = 120.0     # ₹120 maximum payout per disruption

def apply_payout_constraints(estimated_loss: float, severity_multiplier: float) -> float:
    """ 
    Calculates final payout with constraints.
    Rules:
    - Minimum Loss Threshold: If estimated loss is too small, payout 0.
    - Severity Scaling: Scaled by the multiplier.
    - Max Payout Cap: Payout is capped at ₹120.
    """
    
    if estimated_loss < MIN_LOSS_THRESHOLD:
        return 0.0

    # Scale the loss by the severity of the weather
    payout = estimated_loss * severity_multiplier
    
    # Apply Cap
    final_payout = min(payout, MAX_PAYOUT_CAP)
    
    return float(round(final_payout, 2))

if __name__ == "__main__":
    # Test cases
    print(f"Loss 300, Sev 1.0: ₹{apply_payout_constraints(300, 1.0)} (Capped)")
    print(f"Loss 80, Sev 1.2: ₹{apply_payout_constraints(80, 1.2)} (Bonus)")
    print(f"Loss 40, Sev 1.0: ₹{apply_payout_constraints(40, 1.0)} (Below Threshold)")
    print(f"Loss 120, Sev 0.5: ₹{apply_payout_constraints(120, 0.5)} (Mid-tier scaling)")
