-- 02_types.sql
-- Define all custom ENUM types for KAVACH

-- Account Aggregator Status
CREATE TYPE aa_status AS ENUM (
  'PENDING',
  'ACTIVE',
  'REVOKED',
  'EXPIRED'
);

-- Policy Status
CREATE TYPE policy_status AS ENUM (
  'ACTIVE',
  'PAUSED',
  'SUSPENDED',
  'CANCELLED',
  'LAPSED'
);

-- Mandate Status
CREATE TYPE mandate_status AS ENUM (
  'PENDING',
  'ACTIVE',
  'FAILED',
  'REVOKED'
);

-- Disruption Type
CREATE TYPE disruption_type AS ENUM (
  'RAIN',
  'AQI',
  'HEAT',
  'BANDH'
);

-- Claim Status
CREATE TYPE claim_status AS ENUM (
  'EVALUATING',
  'APPROVED',
  'MANUAL_REVIEW',
  'REJECTED',
  'PAID'
);

-- Fraud Investigation Status
CREATE TYPE investigation_status AS ENUM (
  'OPEN',
  'RESOLVED'
);

-- Fraud Investigation Resolution
CREATE TYPE investigation_resolution AS ENUM (
  'APPROVED',
  'REJECTED'
);

-- Payment Type
CREATE TYPE payment_type AS ENUM (
  'PREMIUM_DEDUCTION',
  'CLAIM_PAYOUT'
);

-- Payment Status
CREATE TYPE payment_status AS ENUM (
  'PENDING',
  'SUCCESS',
  'FAILED'
);
