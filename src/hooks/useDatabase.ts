import { useState, useEffect, useCallback } from 'react';
import { dbService, type PayoutRecord } from '@/services/db';
import { useAuthStore } from '@/store/authStore';

export function useProfile() {
  const { user } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetch = useCallback(async () => {
    if (!user) return;
    try {
      const profile = await dbService.getProfile(user.id);
      setData(profile);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useActivePolicy() {
  const { user } = useAuthStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) return;
    try {
      const policy = await dbService.getActivePolicy(user.id);
      setData(policy);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, refetch: fetch };
}

export function usePayouts() {
  const { user } = useAuthStore();
  const [data, setData] = useState<PayoutRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!user) return;
    try {
      const history = await dbService.getRecentPayouts(user.id);
      setData(history);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, refetch: fetch };
}
