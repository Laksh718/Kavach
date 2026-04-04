-- 04_functions_triggers.sql
-- Database level logic for KAVACH

-- 1. UTILITY: Update timestamps automatically
CREATE OR REPLACE FUNCTION handle_updated_at() 
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. LOGIC: TrustKarma Score calculation
-- Trigger on trust_karma_ledger INSERT automatically updates worker_profiles
CREATE OR REPLACE FUNCTION update_trust_karma_score() 
RETURNS TRIGGER AS $$
BEGIN
  UPDATE worker_profiles 
  SET trust_karma_score = LEAST(1000, GREATEST(0, trust_karma_score + NEW.delta)) 
  WHERE id = NEW.worker_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. LOGIC: Claim Payout Execution Guard (Manual check before PAID)
-- (Mostly handled via Edge Functions, but can have safety triggers here)

-- 4. LOGIC: Notification Cleanup
CREATE OR REPLACE FUNCTION mark_notification_read(notif_id UUID) 
RETURNS VOID AS $$
BEGIN
  UPDATE notifications SET status = 'READ', delivered_at = NOW() WHERE id = notif_id;
END;
$$ LANGUAGE plpgsql;

-- 5. LOGIC: Fraud Investigation Deadline
CREATE OR REPLACE FUNCTION set_investigation_deadline() 
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.deadline IS NULL THEN
    NEW.deadline = NEW.assigned_at + INTERVAL '4 hours';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- --- ATTACH TRIGGERS ---

-- Trigger: worker_profiles updated_at
CREATE TRIGGER tr_worker_profiles_updated_at
BEFORE UPDATE ON worker_profiles
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Trigger: zones updated_at
CREATE TRIGGER tr_zones_updated_at
BEFORE UPDATE ON zones
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Trigger: policies updated_at
CREATE TRIGGER tr_policies_updated_at
BEFORE UPDATE ON policies
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Trigger: claims updated_at
CREATE TRIGGER tr_claims_updated_at
BEFORE UPDATE ON claims
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Trigger: payments updated_at
CREATE TRIGGER tr_payments_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Trigger: update_trust_karma_score
-- Runs whenever a new entry is added to the ledger
CREATE TRIGGER tr_update_trust_karma_score
AFTER INSERT ON trust_karma_ledger
FOR EACH ROW EXECUTE FUNCTION update_trust_karma_score();

-- Trigger: set_investigation_deadline
-- Runs before insert to set SLA deadline
CREATE TRIGGER tr_set_investigation_deadline
BEFORE INSERT ON fraud_investigations
FOR EACH ROW EXECUTE FUNCTION set_investigation_deadline();
