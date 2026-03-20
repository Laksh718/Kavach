import { Routes, Route, NavLink } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { HomeTab } from "./HomeTab";
import { PolicyTab } from "./PolicyTab";
import { PayoutsTab } from "./PayoutsTab";
import { ZoneMapTab } from "./ZoneMapTab";
import { TrustKarmaTab } from "./TrustKarmaTab";
import { cn } from "@/utils/cn";
import { Home, CreditCard, Banknote, Map, Star } from "lucide-react";

const mobileNavItems = [
  { to: "/dashboard", icon: Home, label: "Home", end: true },
  { to: "/dashboard/policy", icon: CreditCard, label: "Policy", end: false },
  { to: "/dashboard/payouts", icon: Banknote, label: "Payouts", end: false },
  { to: "/dashboard/zone-map", icon: Map, label: "Map", end: false },
  { to: "/dashboard/trust-karma", icon: Star, label: "Karma", end: false },
];

export default function WorkerDashboard() {
  return (
    <div
      className="min-h-screen p-2 md:p-4"
      style={{ background: "var(--bg-app)" }}
    >
      <div className="h-[calc(100vh-16px)] md:h-[calc(100vh-32px)] rounded-[28px] border border-[#111827] bg-[#ECECEC] overflow-hidden">
        <div className="flex h-full">
          <Sidebar />

          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {/* TopBar */}
            <header className="px-4 md:px-8 py-4 border-b border-[#D4D4D8] bg-[#ECECEC]">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="font-syne font-bold text-4xl md:text-5xl text-[#111827] leading-none">
                    Hello, Rajan!
                  </h1>
                  <p className="text-sm text-[#6B7280] mt-1">
                    All your policy and payout updates in one place.
                  </p>
                </div>
                <div className="ml-auto hidden md:flex items-center gap-3">
                  <div className="flex items-center bg-[#E4E4E7] rounded-full px-4 py-2 min-w-[280px]">
                    <Search size={16} className="text-[#6B7280]" />
                    <input
                      type="text"
                      placeholder="Search payouts, zones..."
                      className="bg-transparent text-sm text-[#111827] placeholder-[#9CA3AF] outline-none ml-2 w-full"
                    />
                  </div>
                  <button className="relative w-10 h-10 rounded-full bg-[#E4E4E7] flex items-center justify-center text-[#374151]">
                    <Bell size={17} />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#EF4444] rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                      3
                    </span>
                  </button>
                  <div className="w-10 h-10 rounded-full bg-[#111827] flex items-center justify-center text-white text-sm font-bold">
                    R
                  </div>
                </div>
              </div>
            </header>

            {/* Main scroll area */}
            <main className="flex-1 overflow-y-auto pb-16 md:pb-0 bg-[#ECECEC]">
              <Routes>
                <Route index element={<HomeTab />} />
                <Route path="policy" element={<PolicyTab />} />
                <Route path="payouts" element={<PayoutsTab />} />
                <Route path="zone-map" element={<ZoneMapTab />} />
                <Route path="trust-karma" element={<TrustKarmaTab />} />
                <Route
                  path="settings"
                  element={
                    <div className="p-6">
                      <h2 className="font-syne font-bold text-2xl text-[#111827] mb-4">
                        Settings
                      </h2>
                      <div className="k-card p-5 text-[#64748B]">
                        Language, notifications and account settings coming
                        soon.
                      </div>
                    </div>
                  }
                />
              </Routes>
            </main>
          </div>

          {/* Mobile bottom nav */}
          <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#ECECEC] border-t border-[#D4D4D8]">
            <div className="flex">
              {mobileNavItems.map(({ to, icon: Icon, label, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    cn(
                      "flex-1 flex flex-col items-center gap-1 py-2.5 transition-colors",
                      isActive ? "text-[#111827]" : "text-[#6B7280]",
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={20}
                        className={isActive ? "text-[#111827]" : ""}
                      />
                      <span className="text-[10px]">{label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}
