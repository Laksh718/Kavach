def get_hyperlocal_risk(city: str) -> dict:
    """
    Returns hyper-local risk factors for a given city.
    In a production scenario, this would query a GIS database for water logging historical data.
    """
    safe_zones = ["mumbai_island_city", "bangalore_south", "pune", "delhi_lutvens"]
    
    city_lower = city.lower()
    
    # Simple check for demo purposes
    # If the city is in the safe_zones list, mark as safe from water logging
    is_safe = False
    for zone in safe_zones:
        if zone in city_lower:
            is_safe = True
            break
            
    # Also mark smaller cities as potentially safer if not specifically blocked
    if not is_safe and len(city) % 2 == 0: 
        is_safe = True
        
    return {
        "is_safe_from_water_logging": is_safe,
        "historical_risk_factor": 0.1 if is_safe else 0.4
    }
