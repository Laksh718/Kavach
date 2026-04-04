-- 03_tables.sql
-- KAVACH Supabase Database Schema

-- HyperLocal Risk Grid (HLRG)
CREATE TABLE IF NOT EXISTS zones (
  id TEXT PRIMARY KEY,
  city TEXT NOT NULL,
  name TEXT NOT NULL,
  geom GEOGRAPHY(POLYGON, 4326),
  risk_score INT DEFAULT 0,
  primary_risk TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_zones_geom ON zones USING GIST (geom);

-- Worker Profiles
CREATE TABLE IF NOT EXISTS worker_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,
  vpa TEXT,
  zone_id TEXT REFERENCES zones(id),
  trust_karma_score INT DEFAULT 800 CHECK (trust_karma_score BETWEEN 0 AND 1000),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Account Aggregator Consents
CREATE TABLE IF NOT EXISTS aa_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES worker_profiles(id),
  consent_handle TEXT UNIQUE NOT NULL,
  status aa_status DEFAULT 'PENDING',
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_aa_consents_worker ON aa_consents(worker_id);

-- Worker Platforms Earnings Baseline
CREATE TABLE IF NOT EXISTS worker_platforms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES worker_profiles(id),
  platform_name TEXT NOT NULL, -- e.g., 'Zomato', 'Swiggy'
  baseline_30d NUMERIC(10,2) DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(worker_id, platform_name)
);
CREATE INDEX IF NOT EXISTS idx_worker_platforms_worker_id ON worker_platforms(worker_id);

-- Policies
CREATE TABLE IF NOT EXISTS policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES worker_profiles(id),
  tier TEXT NOT NULL,
  zone_id TEXT NOT NULL REFERENCES zones(id),
  status policy_status DEFAULT 'ACTIVE',
  weekly_premium NUMERIC(10,2) NOT NULL,
  pauses_used INT DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_policies_worker_status ON policies(worker_id, status);
CREATE INDEX IF NOT EXISTS idx_policies_zone ON policies(zone_id);
CREATE INDEX IF NOT EXISTS idx_policies_active ON policies(zone_id) WHERE status = 'ACTIVE';

-- AutoPay Mandates
CREATE TABLE IF NOT EXISTS autopay_mandates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES worker_profiles(id),
  razorpay_mandate_id TEXT UNIQUE,
  status mandate_status DEFAULT 'PENDING',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disruptions (Live Alerts)
CREATE TABLE IF NOT EXISTS disruptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zone_id TEXT NOT NULL REFERENCES zones(id),
  type disruption_type NOT NULL,
  severity INT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_disruptions_zone_active ON disruptions(zone_id) WHERE is_active = TRUE;

-- Claims Pipeline
CREATE TABLE IF NOT EXISTS claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES worker_profiles(id),
  policy_id UUID NOT NULL REFERENCES policies(id),
  disruption_id UUID NOT NULL REFERENCES disruptions(id),
  expected_earnings NUMERIC(10,2) NOT NULL,
  actual_earnings NUMERIC(10,2),
  shortfall NUMERIC(10,2),
  fraud_score INT,
  status claim_status DEFAULT 'EVALUATING',
  payout_amount NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(worker_id, disruption_id) -- Idempotency
);
CREATE INDEX IF NOT EXISTS idx_claims_worker_status ON claims(worker_id, status);
CREATE INDEX IF NOT EXISTS idx_claims_fraud_review ON claims (fraud_score) WHERE status = 'MANUAL_REVIEW';

-- Fraud Investigations
CREATE TABLE IF NOT EXISTS fraud_investigations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id UUID NOT NULL REFERENCES claims(id),
  reviewer_id UUID REFERENCES auth.users(id),
  status investigation_status DEFAULT 'OPEN',
  resolution investigation_resolution,
  shap_features JSONB,
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  deadline TIMESTAMPTZ, -- Calculated via trigger
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- TrustKarma Ledger
CREATE TABLE IF NOT EXISTS trust_karma_ledger (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES worker_profiles(id),
  delta INT NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments (Deductions & Payouts)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES worker_profiles(id),
  related_id UUID, -- Policy ID or Claim ID
  type payment_type NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  status payment_status DEFAULT 'PENDING',
  rzp_transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id UUID NOT NULL REFERENCES worker_profiles(id),
  disruption_id UUID REFERENCES disruptions(id),
  channel TEXT, -- EMAIL, WHATSAPP, PUSH
  status TEXT DEFAULT 'SENT', -- SENT, DELIVERED, READ
  message TEXT,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
