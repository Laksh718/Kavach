def build_fraud_features(data: dict):
    """
    data example:
    {
        "active_hours": 1.5,
        "gps_variance": 10,
        "earnings_drop": 0.9,
        "claim_frequency": 7
    }
    """
    return [[
        data["active_hours"],
        data["gps_variance"],
        data["earnings_drop"],
        data["claim_frequency"]
    ]]
