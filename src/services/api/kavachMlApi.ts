import axios from 'axios';

const kavachMlClient = axios.create({
  // In dev, Vite proxies /kavach-ml/* → https://kavach-ml-y38n.onrender.com/*
  // This bypasses the browser CORS restriction entirely.
  baseURL: '/kavach-ml',
  timeout: 30000,
});

export const kavachMlApi = {
  checkHealth: async (): Promise<boolean> => {
    console.log('%c[Kavach-ML] GET / (health)', 'color:#6366f1;font-weight:bold');
    try {
      const res = await kavachMlClient.get('/', { timeout: 8000 });
      const ok = res.status >= 200 && res.status < 300;
      console.log('%c[Kavach-ML] ← / (health)', ok ? 'color:#10b981;font-weight:bold' : 'color:#ef4444;font-weight:bold', res.data);
      return ok;
    } catch (e) {
      console.warn('[Kavach-ML] Health check failed', e);
      return false;
    }
  },

  predictEarnings: async (city_name: string, day_of_week: number, hour_bucket: number, platform: number = 1, worker_avg: number = 500) => {
    const payload = { city_name, day_of_week, hour_bucket, platform, worker_avg };
    console.log('%c[Kavach-ML] POST /predict/earnings', 'color:#6366f1;font-weight:bold', payload);
    const res = await kavachMlClient.post('/predict/earnings', payload);
    console.log('%c[Kavach-ML] ← /predict/earnings response', 'color:#10b981;font-weight:bold', res.data);
    return res.data;
  },

  getDynamicPricing: async (city: string) => {
    console.log(`%c[Kavach-ML] GET /insurance/dynamic-pricing/${city}`, 'color:#6366f1;font-weight:bold');
    const res = await kavachMlClient.get(`/insurance/dynamic-pricing/${city}`);
    console.log('%c[Kavach-ML] ← /insurance/dynamic-pricing response', 'color:#10b981;font-weight:bold', res.data);
    return res.data;
  },

  checkClaim: async (premium_amt_per_month: number, location: string, avg_hours: number, income: number) => {
    const payload = { premium_amt_per_month, location, avg_hours, income };
    console.log('%c[Kavach-ML] POST /insurance/insurance-claim', 'color:#6366f1;font-weight:bold', payload);
    const res = await kavachMlClient.post('/insurance/insurance-claim', payload);
    console.log('%c[Kavach-ML] ← /insurance/insurance-claim response', 'color:#10b981;font-weight:bold', res.data);
    return res.data;
  },

  runLive: async (city: string) => {
    console.log(`%c[Kavach-ML] GET /run-live/${city}`, 'color:#6366f1;font-weight:bold');
    const res = await kavachMlClient.get(`/run-live/${city}`);
    console.log('%c[Kavach-ML] ← /run-live response', 'color:#10b981;font-weight:bold', res.data);
    return res.data;
  },

  predictDisruption: async (city_name: string) => {
    const payload = { city_name };
    console.log('%c[Kavach-ML] POST /predict/disruption', 'color:#6366f1;font-weight:bold', payload);
    const res = await kavachMlClient.post('/predict/disruption', payload);
    console.log('%c[Kavach-ML] ← /predict/disruption response', 'color:#10b981;font-weight:bold', res.data);
    return res.data;
  },
};
