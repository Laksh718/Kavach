-- 05_rls.sql
-- Row Level Security (RLS) for KAVACH

-- Enable RLS on all tables
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE aa_consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE worker_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE autopay_mandates ENABLE ROW LEVEL SECURITY;
ALTER TABLE disruptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE trust_karma_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- --- 1. ZONES & DISRUPTIONS (Public Read) ---
CREATE POLICY "Public Read Zones" ON zones FOR SELECT USING (true);
CREATE POLICY "Public Read Disruptions" ON disruptions FOR SELECT USING (true);

-- --- 2. WORKER PROFILES ---
CREATE POLICY "Workers Select Own Profile" ON worker_profiles 
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Workers Update Own Profile" ON worker_profiles 
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin Select All Profiles" ON worker_profiles 
FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- --- 3. POLICIES, CLAIMS, MANDATES, PLATFORMS, LEDGER ---
-- These all have worker_id column

-- WORKER: Select Own Data
CREATE POLICY "Workers Select Own Policies" ON policies FOR SELECT USING (auth.uid() = worker_id);
CREATE POLICY "Workers Select Own Claims" ON claims FOR SELECT USING (auth.uid() = worker_id);
CREATE POLICY "Workers Select Own AA Consents" ON aa_consents FOR SELECT USING (auth.uid() = worker_id);
CREATE POLICY "Workers Select Own Platforms" ON worker_platforms FOR SELECT USING (auth.uid() = worker_id);
CREATE POLICY "Workers Select Own Mandates" ON autopay_mandates FOR SELECT USING (auth.uid() = worker_id);
CREATE POLICY "Workers Select Own Ledger" ON trust_karma_ledger FOR SELECT USING (auth.uid() = worker_id);
CREATE POLICY "Workers Select Own Payments" ON payments FOR SELECT USING (auth.uid() = worker_id);

-- ADMIN: Select & Update
CREATE POLICY "Admin All Access Policies" ON policies FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin All Access Claims" ON claims FOR ALL USING (auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin All Access Mandates" ON autopay_mandates FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- INSURER: Select Access
CREATE POLICY "Insurer Select Policies" ON policies FOR SELECT USING (auth.jwt() ->> 'role' = 'insurer');
CREATE POLICY "Insurer Select Claims" ON claims FOR SELECT USING (auth.jwt() ->> 'role' = 'insurer');
CREATE POLICY "Insurer Select Payments" ON payments FOR SELECT USING (auth.jwt() ->> 'role' = 'insurer');

-- --- 4. FRAUD INVESTIGATIONS ---
-- Only Admins and Fraud Analysts
CREATE POLICY "Fraud Team Access Investigations" ON fraud_investigations 
FOR ALL USING (auth.jwt() ->> 'role' IN ('admin', 'fraud_analyst'));

-- --- 5. SERVICE ROLE OVERRIDE ---
-- (Supabase default allows service_role bypass, but we ensure it's explicitly allowed if needed)
-- (Actually, we don't need explicit policies for service_role if it's already bypassing RLS)
