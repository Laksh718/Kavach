-- 08_auth_trigger.sql
-- Automate worker profile creation when a new user signs up via Supabase Auth

-- Function to handle new user insertion
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.worker_profiles (id, full_name, phone)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'New KAVACH User'),
    new.phone -- Fallback to NULL if phone isn't provided immediately
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to fire after a user is created in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- --- Role Management (Optional Helper) ---
-- This function can be used to check roles in RLS if you don't use JWT claims directly
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
  SELECT (auth.jwt() ->> 'role')::TEXT;
$$ LANGUAGE sql STABLE;
