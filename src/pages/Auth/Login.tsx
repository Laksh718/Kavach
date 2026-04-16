import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Mail, Lock, LogIn, ChevronLeft } from "lucide-react";
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

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h2 className="font-syne font-bold text-3xl text-[#0F172A]">Welcome back</h2>
            <p className="text-[#64748B] mt-1">Login to manage your KAVACH protection</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#64748B] flex items-center gap-2">
                <Mail size={16} /> Email Address
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="worker@example.com"
                className="k-input"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#64748B] flex items-center gap-2">
                <Lock size={16} /> Password
              </label>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="k-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4"
            >
              {loading ? <span className="spinner-white w-5 h-5" /> : <>Login <LogIn size={20} /></>}
            </button>
          </form>

          <div className="text-center">
            <Link to="/onboard" className="text-sm text-[#6366F1] font-medium hover:underline">
              New to KAVACH? Create an account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
