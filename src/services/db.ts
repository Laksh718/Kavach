import { supabase } from '@/lib/supabase';
import type { Worker } from '@/types/worker.types';

export interface PayoutRecord {
  id: string;
  label: string;
  amount: number;
  date: string;
  dateDisplay: string;
  icon: string;
  emoji: string;
  type: string;
  positive: boolean;
  upi: string;
  credited: string;
  timeToPayment: string;
  zone: string;
  expected: number;
  actual: number;
  shortfall: number;
  coverage: number;
  severity: number;
  income: number;
}

export const dbService = {
  /**
   * Profiles
   */
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('worker_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createInitialProfile(userId: string, fullName: string) {
    const { data, error } = await supabase
      .from('worker_profiles')
      .upsert({
        id: userId,
        full_name: fullName,
        trust_karma_score: 800,
        kyc_status: 'PENDING'
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error in createInitialProfile:', error);
      throw error;
    }
    return data;
  },

  async updateProfile(userId: string, updates: Partial<Worker>) {
    // Map frontend camelCase to DB snake_case
    const dbUpdates: any = { ...updates };
    if (updates.kycStatus) {
      dbUpdates.kyc_status = updates.kycStatus.toUpperCase();
      delete dbUpdates.kycStatus;
    }

    // 1. First attempt to update existing row
    const { data: updated, error: updateError } = await supabase
      .from('worker_profiles')
      .update({
        ...dbUpdates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()
      .maybeSingle();

    if (updateError) throw updateError;
    if (updated) return updated;

    // 2. If no row updated, it might be missing. Try to fetch Name from Auth
    const { data: { user } } = await supabase.auth.getUser();
    const fullName = user?.user_metadata?.full_name || 'Kavach User';

    // 3. Perform a robust upsert including the mandatory name
    const { data: upserted, error: upsertError } = await supabase
      .from('worker_profiles')
      .upsert({
        id: userId,
        full_name: fullName,
        trust_karma_score: 800,
        ...dbUpdates,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (upsertError) {
      console.error('Error in robust updateProfile:', upsertError);
      throw upsertError;
    }
    return upserted;
  },

  /**
   * Policies
   */
  async getActivePolicy(userId: string) {
    const { data, error } = await supabase
      .from('policies')
      .select('*')
      .eq('worker_id', userId)
      .eq('status', 'ACTIVE')
      .maybeSingle();
    
    if (error) throw error;
    return data;
  },

  async createPolicy(userId: string, tier: string, weeklyPremium: number) {
    try {
      // 1. Check for existing active policy to avoid 409 Conflict
      const { data: existing, error: checkError } = await supabase
        .from('policies')
        .select('*')
        .eq('worker_id', userId)
        .eq('status', 'ACTIVE')
        .maybeSingle();

      if (checkError) throw checkError;
      if (existing) return existing;

      // 2. Create new policy if none active
      const { data, error } = await supabase
        .from('policies')
        .insert({
          worker_id: userId,
          tier: tier.toLowerCase(),
          status: 'ACTIVE',
          zone_id: 'Bangalore_South', // Corrected default zone ID
          weekly_premium: weeklyPremium,
          valid_from: new Date().toISOString(),
        })
        .select()
        .single();
      
      // If error is 409 (Conflict/Duplicate) it means another request created it in the meantime
      if (error && (error.code === '23505' || error.code === '409')) {
        const { data: retryData } = await supabase
          .from('policies')
          .select('*')
          .eq('worker_id', userId)
          .eq('status', 'ACTIVE')
          .single();
        if (retryData) return retryData;
      }
      
      if (error) throw error;
      return data;
    } catch (e) {
      console.error('Error in createPolicy:', e);
      throw e;
    }
  },

  /**
   * Payouts / Claims
   */
  async getRecentPayouts(userId: string) {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        id,
        amount,
        created_at,
        payout_status,
        type
      `)
      .eq('worker_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    return (data || []).map(p => ({
      id: p.id,
      label: p.type === 'CLAIM_PAYOUT' ? 'Disruption Payout' : 'Earnings Withdrawal',
      amount: p.amount,
      date: p.created_at,
      dateDisplay: new Date(p.created_at).toLocaleDateString('en-IN', {
        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      }),
      icon: p.type === 'CLAIM_PAYOUT' ? '🌧️' : '💸',
      emoji: p.type === 'CLAIM_PAYOUT' ? '🌧️' : '💸',
      type: p.type === 'CLAIM_PAYOUT' ? 'rain' : 'withdrawal',
      positive: p.amount > 0,
      upi: `pay_${p.id.slice(0, 10)}`,
      credited: 'UPI Wallet',
      timeToPayment: 'Instant',
      zone: 'Active Zone',
      expected: p.amount * 1.5,
      actual: p.amount * 0.5,
      shortfall: p.amount,
      coverage: 70,
      severity: 1.0,
      income: 18000
    }));
  },

  /**
   * AutoPay
   */
  async recordAutoPayMandate(userId: string, platform: string) {
    const { data, error } = await supabase
      .from('autopay_mandates')
      .insert({
        worker_id: userId,
        upi_platform: platform,
        status: 'ACTIVE'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};
