from datetime import datetime

payouts_db = []

def create_payout(worker_id: int, amount: float, status: str):
    payout = {
        "worker_id": worker_id,
        "amount": round(amount, 2),
        "status": status,
        "timestamp": datetime.utcnow().isoformat()
    }

    payouts_db.append(payout)

    print(f"💸 Payout: {status} | ₹{amount}")

    return payout

def get_all_payouts():
    return payouts_db
