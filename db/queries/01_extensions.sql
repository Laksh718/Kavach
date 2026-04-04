-- 01_extensions.sql
-- Enable necessary PostgreSQL extensions for KAVACH

-- PostGIS for HyperLocal Risk Grid (HLRG)
CREATE EXTENSION IF NOT EXISTS postgis;

-- pg_cron for scheduled tasks (Maintenance, ML Sync, AutoPay)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- uuid-ossp for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- pg_net for making HTTP calls from triggers (optional but recommended for async events)
CREATE EXTENSION IF NOT EXISTS pg_net;
