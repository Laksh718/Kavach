import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, LogIn, ChevronLeft, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { KavachLogo } from "@/components/shared/KavachLogo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setSession } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (data.session) {
        setSession(data.session);
        toast.success("Welcome back! ✓");
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-app)" }}>
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between" style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border-card)" }}>
        <button onClick={() => navigate("/")} className="text-[#64748B] hover:text-[#0F172A] transition-colors">
          <ChevronLeft size={24} />
        </button>
        <KavachLogo size="sm" />
        <div className="w-6" /> {/* Spacer */}
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-[420px] bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] p-8 sm:p-10 space-y-8 border border-slate-100">
          <div className="text-center space-y-2">
            <div className="mx-auto w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
              <LogIn className="text-indigo-600" size={28} />
            </div>
            <h2 className="font-syne font-extrabold text-3xl text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 font-medium">Login to manage your Kavach protection</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 flex items-center gap-2 ml-1">
                <Mail size={16} className="text-slate-400" /> Email Address
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="worker@example.com"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-[1.25rem] px-5 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium placeholder:text-slate-400"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-600 flex items-center gap-2 ml-1">
                <Lock size={16} className="text-slate-400" /> Password
              </label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-[1.25rem] px-5 py-4 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium placeholder:text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white rounded-[1.25rem] font-bold text-[15px] flex items-center justify-center gap-2 py-4 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-70 disabled:active:scale-100 shadow-[0_4px_14px_rgba(99,102,241,0.3)] mt-2"
            >
              {loading ? <span className="spinner-white w-5 h-5 border-2 border-white/20 border-t-white" /> : <>Login Safely <ArrowRight size={20} /></>}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100/80">
            <div className="text-center mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 bg-white px-2">For easier demo access</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const mockWorker = {
                  id: "demo-user",
                  name: "Demo Worker",
                  email: "demo@kavach.app",
                  phone: "+91 9999999999",
                  primaryPlatform: "zomato",
                  kycStatus: "verified",
                  status: "active",
                  trustScore: 850,
                  activePlanId: "gold"
                };
                useAuthStore.getState().setSession({
                  user: { id: "demo-user", email: "demo@kavach.app", user_metadata: { full_name: "Demo Worker" } },
                  access_token: "demo",
                  refresh_token: "demo",
                  expires_in: 9999,
                  expires_at: 9999,
                  token_type: "bearer"
                } as any);
                useAuthStore.getState().setWorker(mockWorker as any);
                navigate("/dashboard");
                toast.success("Welcome to Demo Mode by Kavach!");
              }}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 rounded-[1.25rem] font-bold text-[15px] flex items-center justify-center gap-2 py-3.5 hover:bg-slate-100 hover:border-slate-300 active:scale-[0.98] transition-all"
            >
              Checkout Kavach (Demo Mode)
            </button>
          </div>

          <div className="text-center pt-2">
            <Link to="/onboard" className="text-sm text-indigo-600 font-bold hover:text-indigo-800 transition-colors">
              New exactly? Create an account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
