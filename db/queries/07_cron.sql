-- 07_cron.sql
-- Scheduling background tasks for KAVACH via pg_cron

-- 1. Refresh Materialized View (Every Hour)
SELECT cron.schedule('refresh-insurer-mv', '0 * * * *', 'SELECT refresh_mv_insurer_financials()');

-- 2. Call ML Sync Edge Function (Every 15 mins)
-- Note: Replace URL with your Supabase Edge Function URL
SELECT cron.schedule('kavach-ml-sync', '*/15 * * * *', 'SELECT net.http_post(''https://[YOUR_PROJECT_REF].functions.supabase.co/kavach-ml-sync'', ''{}'', ''{}'', ''{"Authorization": "Bearer [SERVICE_ROLE_KEY]"}''::jsonb)');

-- 3. AutoPay Runner (Weekly, Monday 8 AM)
SELECT cron.schedule('weekly-autopay-runner', '0 8 * * 1', 'SELECT net.http_post(''https://[YOUR_PROJECT_REF].functions.supabase.co/autopay-runner'', ''{}'', ''{}'', ''{"Authorization": "Bearer [SERVICE_ROLE_KEY]"}''::jsonb)');

-- 4. Daily AA Sync (Daily at 3 AM)
SELECT cron.schedule('daily-aa-sync', '0 3 * * *', 'SELECT net.http_post(''https://[YOUR_PROJECT_REF].functions.supabase.co/daily-aa-sync'', ''{}'', ''{}'', ''{"Authorization": "Bearer [SERVICE_ROLE_KEY]"}''::jsonb)');

-- 5. Suspend Failing Policies (Friday 00:01 AM)
CREATE OR REPLACE FUNCTION suspend_failing_policies() 
RETURNS VOID AS $$
BEGIN
  -- Multi-step logic to identify failing payments and suspend policies
  UPDATE policies
  SET status = 'SUSPENDED'
  WHERE status = 'ACTIVE'
  AND id IN (
    SELECT related_id 
    FROM payments 
    WHERE status = 'FAILED' 
    AND created_at > NOW() - INTERVAL '4 days'
    GROUP BY related_id
    HAVING COUNT(*) >= 2
  );
END;
$$ LANGUAGE plpgsql;

SELECT cron.schedule('friday-policy-suspension', '1 0 * * 5', 'SELECT suspend_failing_policies()');

-- 6. Lapse Suspended Policies (Following Monday at 12:01 AM)
SELECT cron.schedule('monday-policy-lapse', '1 0 * * 1', 'UPDATE policies SET status = ''LAPSED'' WHERE status = ''SUSPENDED''');
