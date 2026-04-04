import logging

# [Deterministic Rules] Coverage Eligibility
# This module implements hard kill-switches for non-insurable catastrophic events.

EXCLUDED_KEYWORDS = ["war", "geopolitical", "national pandemic", "lockdown", "civil unrest"]

def is_event_eligible(event_description: str, city_status: str = "open") -> (bool, str):
    """
    Returns (is_eligible, reason)
    Checks if an event description contains catastrophic/excluded terms.
    """
    
    # 1. Geopolitical / War Exclusions
    for word in EXCLUDED_KEYWORDS:
        if word in event_description.lower():
            return False, f"Event Excluded: Policy does not cover {word.title()} events."

    # 2. Administrative / Government Lockdown Exclusions
    if city_status.lower() == "lockdown" or city_status.lower() == "emergency":
        return False, f"Event Excluded: Nationwide {city_status} overrides parametric triggers."

    # 3. Valid Parametric Scope
    return True, "Eligible: Event within policy scope."

if __name__ == "__main__":
    # Test cases
    print(is_event_eligible("Light rainfall and AQI 200"))
    print(is_event_eligible("National Pandemic Lockdown 2024"))
    print(is_event_eligible("Rainfall in a state of civil unrest"))
