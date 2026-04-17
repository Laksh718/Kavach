import { useState } from "react";
import { Bell, Shield, LogOut, ChevronRight, FileText } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function SettingsTab() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      navigate("/");
      toast.success("Successfully logged out");
    } catch (e: any) {
      toast.error(e.message || "Failed to log out");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6 pb-24">
      <div>
        <h2 className="font-syne font-extrabold text-3xl md:text-4xl text-[#111827]">Settings</h2>
        <p className="text-[#6B7280] font-medium mt-1">Manage your account, preferences, and security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Profile Card */}
          <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 shadow-lg shadow-indigo-600/20">
              {user?.user_metadata?.full_name?.charAt(0) ?? "K"}
            </div>
            <div className="flex-1">
              <h3 className="font-syne font-bold text-xl text-slate-900">{user?.user_metadata?.full_name ?? "Partner Name"}</h3>
              <p className="text-slate-500 text-sm font-medium">{user?.email}</p>
            </div>
            <button className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-sm rounded-xl transition-colors">
              Edit
            </button>
          </div>

          {/* Preferences Settings */}
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 space-y-6">
            <h3 className="font-syne font-bold text-xl text-slate-900 flex items-center gap-2 mb-2">
              <Bell className="text-indigo-600" size={20} /> App Preferences
            </h3>
            
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <div className="font-semibold text-slate-800">Push Notifications</div>
                <div className="text-sm text-slate-500 mt-0.5">Alerts for rain, payouts, and zones</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <div>
                <div className="font-semibold text-slate-800">Language</div>
                <div className="text-sm text-slate-500 mt-0.5">English (EN)</div>
              </div>
              <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <div className="font-semibold text-slate-800">AutoPay Mandate</div>
                <div className="text-sm text-slate-500 mt-0.5 text-emerald-600 font-medium">Active · ₹84/week via PhonePe</div>
              </div>
              <button className="text-slate-400 hover:text-indigo-600 transition-colors">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Security & Documents */}
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 space-y-4">
            <h3 className="font-syne font-bold text-xl text-slate-900 flex items-center gap-2 mb-4">
              <Shield className="text-indigo-600" size={20} /> Security & Legal
            </h3>
            
            <button className="w-full flex items-center px-4 py-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-left group">
              <FileText className="text-slate-400 group-hover:text-indigo-600 mr-4" size={20} />
              <div className="flex-1 font-semibold text-slate-700 group-hover:text-slate-900">View Policy Document</div>
              <ChevronRight className="text-slate-400 group-hover:text-indigo-600" size={18} />
            </button>
            
            <button className="w-full flex items-center px-4 py-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors text-left group">
              <Shield className="text-slate-400 group-hover:text-indigo-600 mr-4" size={20} />
              <div className="flex-1 font-semibold text-slate-700 group-hover:text-slate-900">Change Password</div>
              <ChevronRight className="text-slate-400 group-hover:text-indigo-600" size={18} />
            </button>
          </div>

        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-indigo-600 rounded-[2rem] p-6 text-white shadow-lg shadow-indigo-600/20 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/10 rounded-full blur-xl" />
            <Shield size={32} className="text-indigo-200 mb-4" />
            <h4 className="font-syne font-bold text-xl mb-1">Platform Account</h4>
            <p className="text-indigo-100 text-sm font-medium mb-6">Linked via Account Aggregator. Data syncs automatically.</p>
            <div className="space-y-3">
              <div className="bg-white/10 rounded-xl p-3 flex justify-between items-center">
                <span className="text-sm">Status</span>
                <span className="text-xs font-bold bg-emerald-400/20 text-emerald-100 px-2 py-1 rounded-md">VERIFIED</span>
              </div>
              <div className="bg-white/10 rounded-xl p-3 flex justify-between items-center">
                <span className="text-sm">Bank</span>
                <span className="text-sm font-bold">HDFC Bank</span>
              </div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            disabled={loading}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-[1.5rem] p-4 flex items-center justify-center gap-2 font-bold transition-all active:scale-[0.98]"
          >
            {loading ? <span className="spinner w-5 h-5 border-2 border-red-600/20 border-t-red-600" /> : <><LogOut size={20} /> Logout Safely</>}
          </button>
        </div>
      </div>
    </div>
  );
}