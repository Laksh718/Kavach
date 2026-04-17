-- 06_views.sql
-- Materialized Views for KAVACH Insurance Portal

-- 1. INSURER FINANCIALS VIEW
-- Summarizes GWP, Payouts, and Loss Ratio by week and zone
CREATE MATERIALIZED VIEW IF NOT EXISTS mv_insurer_financials AS
SELECT 
  DATE_TRUNC('week', p.created_at) as week,
  p.zone_id,
  COUNT(DISTINCT p.id) as total_policies,
  SUM(p.weekly_premium) as gross_written_premium,
  COALESCE(SUM(c.payout_amount), 0) as incurred_losses,
  CASE 
    WHEN SUM(p.weekly_premium) > 0 THEN (COALESCE(SUM(c.payout_amount), 0) / SUM(p.weekly_premium)) 
    ELSE 0 
  END as loss_ratio
FROM policies p
LEFT JOIN claims c ON p.id = c.policy_id AND c.status = 'PAID'
GROUP BY week, p.zone_id
WITH NO DATA;

-- 2. REFRESH FUNCTION
CREATE OR REPLACE FUNCTION refresh_mv_insurer_financials() 
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW mv_insurer_financials;
END;
$$ LANGUAGE plpgsql;

-- 3. UNIQUE INDEX FOR CONCURRENT REFRESH
CREATE UNIQUE INDEX IF NOT EXISTS idx_mv_insurer_financials_unique_key 
ON mv_insurer_financials (week, zone_id);
