'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Sparkles, AlertCircle, BarChart2, FileText, DollarSign, LogOut, Settings, Users } from 'lucide-react';

const API_BASE = "http://127.0.0.1:8000/api/v1";

interface Worker {
  id: number;
  name: string;
  location: string;
  base_income_daily: number;
}

interface Policy {
  id: number;
  weekly_premium: number;
  daily_coverage: number;
}

interface RiskProfile {
  risk_score: number;
  premium: number;
  risk_factors: { rain: string; aqi: string };
}

export default function Home() {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [policy, setPolicy] = useState<Policy | null>(null);
  const [risk, setRisk] = useState<RiskProfile | null>(null);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [view, setView] = useState<'auth' | 'dashboard' | 'policy' | 'admin'>('auth');
  const [sensor, setSensor] = useState("");
  const [isTriggerActive, setIsTriggerActive] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("Chennai");
  const [baseIncome, setBaseIncome] = useState(1000);

  // Poll intervals
  useEffect(() => {
    if (worker) {
      fetchRiskProfile();
      const interval = setInterval(() => {
        const isRain = Math.random() > 0.5;
        const value = isRain 
            ? `${(Math.random() * 60).toFixed(1)}mm Rain` 
            : `${(Math.random() * 250).toFixed(0)} AQI`;
            
        setSensor(value);
        
        // Simulate heavy rain triggering banner 
        if (isRain && parseFloat(value) > 40) {
            setIsTriggerActive(true);
        } else {
            setIsTriggerActive(false);
        }
        fetchPayouts();
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [worker]);

  const fetchRiskProfile = async () => {
    try {
      if (!worker) return;
      // Added in previous phase
      const res = await axios.get(`${API_BASE}/workers/risk/${worker.id}`);
      setRisk(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchPayouts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/simulate/payouts`);
      const filtered = res.data.filter((p: any) => p.worker_id === worker?.id);
      setPayouts(filtered);
    } catch (e) { console.error(e); }
  };

  const handleOnboard = async (e: any) => {
    e.preventDefault();
    try {
      const resWorker = await axios.post(`${API_BASE}/workers/`, {
        name, email, phone, location, base_income_daily: baseIncome, upi_id: "demo@upi"
      });
      const u = resWorker.data;
      setWorker(u);

      const resPolicy = await axios.post(`${API_BASE}/policies/`, {
        worker_id: u.id, daily_coverage: baseIncome
      });
      setPolicy(resPolicy.data);

      setView('dashboard');
    } catch (err: any) { alert("Error onboarding: " + err.message); }
  };

  if (view === 'auth') {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div style={{ maxWidth: '420px', width: '100%', background: 'white', padding: '32px', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <h2 style={{ marginBottom: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={24} color="#0b6e4f" /> Kavach-ML Model Setup
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.9rem' }}>Fill in details to compute dynamic AI cover levels.</p>
          <form onSubmit={handleOnboard}>
            <div style={{ marginBottom: '16px' }}><label>Full Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} required /></div>
            <div style={{ marginBottom: '16px' }}><label>Email</label><input type="email" value={email} onChange={e => setEmail(e.target.value)} required /></div>
            <div style={{ marginBottom: '16px' }}><label>Phone</label><input type="text" value={phone} onChange={e => setPhone(e.target.value)} required /></div>
            <div style={{ marginBottom: '16px' }}>
              <label>Location</label>
              <select value={location} onChange={e => setLocation(e.target.value)}>
                <option value="Chennai">Chennai</option><option value="Mumbai">Mumbai</option><option value="Delhi">Delhi</option><option value="Bangalore">Bangalore</option>
              </select>
            </div>
            <button type="submit" style={{ background: '#37352f', color: 'white', border: 'none', padding: '12px', borderRadius: '8px', width: '100%', cursor: 'pointer', fontWeight: 500 }}> Onboard Worker </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: '240px', background: 'var(--sidebar-bg)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', padding: '24px 12px' }}>
        <div style={{ fontWeight: 700, fontSize: '1.2rem', padding: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}> 🛡️ Kavach-ML Model </div>
        <div style={{ flexGrow: 1 }}>
          <div onClick={() => setView('dashboard')} style={{ padding: '10px 12px', display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer', borderRadius: '6px', background: view === 'dashboard' ? 'rgba(0,0,0,0.05)' : 'none' }}> <BarChart2 size={18} /> Dashboard </div>
          <div onClick={() => setView('policy')} style={{ padding: '10px 12px', display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer', borderRadius: '6px', background: view === 'policy' ? 'rgba(0,0,0,0.05)' : 'none', marginTop: '4px' }}> <FileText size={18} /> Policy </div>
          <hr style={{ margin: '12px 0', borderColor: 'var(--border-color)' }} />
          <div onClick={() => setView('admin')} style={{ padding: '10px 12px', display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer', borderRadius: '6px', background: view === 'admin' ? 'rgba(255,100,0,0.08)' : 'none', color: '#ea580c' }}> <Settings size={18} /> Admin Console </div>
        </div>
        <div onClick={() => setView('auth')} style={{ padding: '10px 12px', display: 'flex', gap: '10px', alignItems: 'center', cursor: 'pointer', color: '#dc2626' }}> <LogOut size={18} /> Logout </div>
      </aside>

      {/* Content */}
      <main style={{ flexGrow: 1, padding: '40px', overflowY: 'auto' }}>
        {/* Live Disruption Banner */}
        {isTriggerActive && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 12px rgba(220,38,38,0.05)' }}>
                <AlertCircle size={24} color="#dc2626" />
                <div>
                   <strong style={{ color: '#991b1b' }}>⚠️ Continuous Disruption Active:</strong> Heavy weather node reading {sensor}. 
                   <div style={{ fontSize: '0.85rem', color: '#b91c1c', marginTop: '2px' }}>Automated payout engine verifying income logs stream...</div>
                </div>
            </div>
        )}

        {view === 'dashboard' && (
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>Hello, {worker?.name}</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Parametric Cover Active in {worker?.location}.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '24px' }}>
              <div className="card"><h3>🛡️ Active Coverage</h3><div style={{ fontSize: '2rem', fontWeight: 700, margin: '8px 0' }}>₹{policy?.daily_coverage}</div><p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Instant direct UPI disbursement</p></div>
              <div className="card">
                 <h3>💸 Weekly Premium</h3>
                 <div style={{ fontSize: '2rem', fontWeight: 700, margin: '8px 0', color: '#0b6e4f' }}>₹{risk ? risk.premium : 18}</div>
                 <span style={{ fontSize: '0.75rem', padding: '3px 8px', background: '#d1fae5', color: '#065f46', borderRadius: '12px', fontWeight: 500 }}>
                    Risk Level: {risk && risk.risk_score > 0.5 ? 'HIGH' : 'MEDIUM'}
                 </span>
              </div>
              <div className="card"><h3>🌦️ IoT Node Sensor</h3><div style={{ fontSize: '1.4rem', fontWeight: 600, margin: '12px 0' }}>{sensor || "Scanning..."}</div><p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Fitted via edge compute grids</p></div>
            </div>

            <div style={{ marginTop: '32px', background: 'var(--glass)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', fontWeight: 600, borderBottom: '1px solid var(--border-color)' }}> 🔄 Automated Payout Logs </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ textAlign: 'left', background: 'rgba(0,0,0,0.02)' }}><th style={{ padding: '14px 20px' }}>Type</th><th>Amount</th><th>Status</th><th>Timestamp</th></tr></thead>
                <tbody>
                  {payouts.length === 0 ? (
                    <tr><td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)' }}>No triggers fully approved matching income impact.</td></tr>
                  ) : payouts.map((p, i) => (
                    <tr key={i} style={{ borderTop: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '14px 20px' }}>Parametric Trigger</td><td>₹{p.amount}</td>
                      <td><span style={{ padding: '3px 8px', borderRadius: '12px', fontSize: '0.8rem', background: p.status === 'APPROVED' ? '#d1fae5' : '#fef3c7', color: p.status === 'APPROVED' ? '#065f46' : '#92400e' }}>{p.status}</span></td>
                      <td>{new Date(p.triggered_at || Date.now()).toLocaleTimeString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === 'admin' && (
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>🛠️ Admin Console</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Continuous risk assessment heatmaps and aggregated triggers streams.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '24px' }}>
               <div className="card"><h3>Total Disbursed</h3><div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '8px', color: '#0b6e4f' }}>₹4,520</div></div>
               <div className="card"><h3>Active Fraud Holds</h3><div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '8px', color: '#dc2626' }}>2</div></div>
               <div className="card"><h3>Network Integrity</h3><div style={{ fontSize: '2rem', fontWeight: 700, marginTop: '8px' }}>98.2%</div></div>
            </div>

            <div className="card" style={{ marginTop: '24px' }}>
                <h3>🗺️ Risk Heatmap (Synthetic Grid)</h3>
                <div style={{ height: '200px', background: 'linear-gradient(45deg, #fef2f2, #fee2e2, #fecaca, #fca5a5)', borderRadius: '8px', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#991b1b', fontWeight: 600 }}>
                    Red Zones Aggregated (Chennai/Delhi Cluster)
                </div>
            </div>
          </div>
        )}

        {view === 'policy' && (
          <div>
            <h1>📜 Policy Conditions</h1>
            <div style={{ marginTop: '24px' }} className="card">
              <p style={{ marginBottom: '16px' }}>Your items cover triggers strictly on parametric parameters scaling below target ranges:</p>
              <div style={{ display: 'flex', gap: '20px' }}>
                <div><strong>Rainfall Threshold:</strong> 50.0 mm</div>
                <div><strong>AQI Threshold:</strong> 350.0 Index</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
