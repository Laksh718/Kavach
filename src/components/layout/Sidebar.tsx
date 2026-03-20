import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  CreditCard,
  Banknote,
  Map,
  Star,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { cn } from "@/utils/cn";

const navItems = [
  { to: "/dashboard", icon: Home, label: "Home", end: true },
  { to: "/dashboard/policy", icon: CreditCard, label: "My Policy", end: false },
  { to: "/dashboard/payouts", icon: Banknote, label: "Payouts", end: false },
  { to: "/dashboard/zone-map", icon: Map, label: "Zone Map", end: false },
  { to: "/dashboard/trust-karma", icon: Star, label: "TrustKarma", end: false },
  { to: "/dashboard/settings", icon: Settings, label: "Settings", end: false },
];

export function Sidebar() {
  const { worker, logout } = useAuthStore();
  const navigate = useNavigate();

  return (
    <aside className="hidden md:flex flex-col w-56 bg-[#BFD2FF] border-r border-[#A5B4FC] p-5">
      {/* Logo */}
      <div className="w-11 h-11 rounded-xl bg-black text-white flex items-center justify-center font-syne font-bold text-sm">
        K
      </div>

      {/* Nav */}
      <nav className="mt-8 flex-1 space-y-2">
        {navItems.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-full text-sm font-semibold transition-all",
                isActive
                  ? "bg-black text-white"
                  : "text-[#111827] hover:bg-[#A5B4FC]",
              )
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Worker profile */}
      <div className="pt-4 border-t border-[#A5B4FC]">
        <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-white/60">
          <div className="w-9 h-9 rounded-full bg-[#111827] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {worker?.name?.charAt(0) ?? "R"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-[#111827] truncate">
              {worker?.name ?? "Rajan Kumar"}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              <span className="text-xs text-[#64748B]">Active Policy</span>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>
  );
}
