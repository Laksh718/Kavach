import { useMemo, useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import {
  Bell,
  Search,
  Home,
  Wallet,
  Store,
  ArrowRightLeft,
  Settings,
  MoreVertical,
  ArrowUpRight,
  ArrowDown,
  ListChecks,
  Save,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { mockPipelineHealth } from "@/services/mock/disruption.mock";
import { formatRupee, formatRupeeCompact } from "@/utils/formatRupee";

const adminNav = [
  { to: "/admin", icon: Home, label: "Home", end: true },
  { to: "/admin/disruptions", icon: Wallet, label: "Disruptions" },
  { to: "/admin/fraud", icon: Store, label: "Fraud Queue" },
  { to: "/admin/analytics", icon: ArrowRightLeft, label: "Analytics" },
  { to: "/admin/pipeline", icon: ListChecks, label: "Pipeline" },
  { to: "/admin/config", icon: Settings, label: "Config" },
];

const quickTransfers = ["Riya", "Vikram", "Aman", "Nisha", "Tarun", "Priya"];
const weeklySeries = [240, 410, 315, 365, 480, 390, 460];
const monthlySeries = [1200, 1350, 1480, 1390, 1520, 1625, 1710];

function AdminHome() {
  const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
  const series = period === "weekly" ? weeklySeries : monthlySeries;

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-7 gap-5">
        <div className="lg:col-span-3 k-card-hero">
          <p className="text-indigo-900/70 text-sm">Available balance</p>
          <h2 className="font-mono font-bold text-5xl text-[#0F172A] mt-1">
            $8,405.00
          </h2>
          <div className="mt-6 flex items-start justify-between gap-4">
            {[
              { icon: ArrowUpRight, label: "Send" },
              { icon: ArrowDown, label: "Request" },
              { icon: Wallet, label: "Split bill" },
              { icon: Home, label: "Top up" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 text-center"
              >
                <button className="k-action-btn" aria-label={label}>
                  <Icon size={19} />
                </button>
                <span className="text-xs text-[#374151]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              name: "Corporate",
              amount: "$1,842",
              digits: "**1499",
              expiry: "04/28",
              active: false,
            },
            {
              name: "Operations",
              amount: "$4,342.11",
              digits: "**1345",
              expiry: "01/28",
              active: true,
            },
            {
              name: "Reserve",
              amount: "$1,205",
              digits: "**1491",
              expiry: "09/29",
              active: false,
            },
          ].map((card) => (
            <div
              key={card.name}
              className={cn("k-card-sm p-5", card.active ? "bg-[#BFD2FF]" : "")}
            >
              <div className="flex items-center justify-between">
                <span className="font-syne font-bold text-xl text-[#111827]">
                  VISA
                </span>
                <MoreVertical size={16} className="text-[#374151]" />
              </div>
              <p className="mt-6 text-sm text-[#4B5563]">{card.name}</p>
              <p className="font-syne font-bold text-4xl text-[#111827] mt-2">
                {card.amount}
              </p>
              <div className="mt-6 flex items-center justify-between text-xs text-[#111827] font-mono">
                <span>{card.digits}</span>
                <span>{card.expiry}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-7 gap-5">
        <div className="lg:col-span-3 space-y-5">
          <div className="k-card p-5">
            <h3 className="font-syne font-bold text-4xl text-[#111827] mb-5">
              Quick transfer
            </h3>
            <div className="k-card-sm flex items-center gap-3 overflow-x-auto">
              <button className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-3xl pb-1">
                +
              </button>
              {quickTransfers.map((name) => (
                <div key={name} className="text-center min-w-[56px]">
                  <div className="w-12 h-12 rounded-full bg-[#DBEAFE] text-[#1E3A8A] font-semibold flex items-center justify-center mx-auto">
                    {name.charAt(0)}
                  </div>
                  <p className="text-xs text-[#4B5563] mt-1">{name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="k-card p-5">
            <h3 className="font-syne font-bold text-4xl text-[#111827] mb-4">
              Transactions
            </h3>
            <div className="space-y-3">
              {[
                {
                  vendor: "Rain Alert Payout",
                  date: "Oct 14, 2024",
                  amount: "-$956.50",
                },
                {
                  vendor: "Policy Premium Batch",
                  date: "Oct 13, 2024",
                  amount: "+$1,120.00",
                },
                {
                  vendor: "Fraud Refund Hold",
                  date: "Oct 12, 2024",
                  amount: "-$11.20",
                },
              ].map((txn) => (
                <div
                  key={txn.vendor}
                  className="k-card-sm flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-[#111827] text-sm">
                      {txn.vendor}
                    </p>
                    <p className="text-xs text-[#6B7280]">{txn.date}</p>
                  </div>
                  <p className="font-mono font-bold text-[#111827]">
                    {txn.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 k-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-syne font-bold text-4xl text-[#111827]">
              Statistics
            </h3>
            <div className="k-toggle-group">
              <button
                className={cn("k-toggle-btn", period === "weekly" && "active")}
                onClick={() => setPeriod("weekly")}
              >
                Weekly
              </button>
              <button
                className={cn("k-toggle-btn", period === "monthly" && "active")}
                onClick={() => setPeriod("monthly")}
              >
                Monthly
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <h4 className="font-mono font-bold text-5xl text-[#111827]">
              $7,432.20
            </h4>
            <button className="btn-secondary py-2 px-4">Details</button>
          </div>
          <div className="mt-6 grid grid-cols-7 gap-2 items-end h-56">
            {series.map((value, idx) => {
              const maxValue = Math.max(...series);
              const barHeight = Math.max(
                18,
                Math.round((value / maxValue) * 100),
              );
              const active = idx === 4;
              return (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div
                    className={cn(
                      "w-8 rounded-xl",
                      active ? "bg-[#A5B4FC]" : "bg-[#111827]",
                    )}
                    style={{ height: `${barHeight}%` }}
                  />
                  <span className="text-xs text-[#6B7280]">
                    {period === "weekly"
                      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][idx]
                      : `W${idx + 1}`}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="mt-5 grid sm:grid-cols-2 gap-3">
            <div className="k-card-sm">
              <p className="text-xs text-[#6B7280]">Income</p>
              <p className="font-mono font-bold text-xl text-[#111827]">
                $9,898.00
              </p>
            </div>
            <div className="k-card-sm">
              <p className="text-xs text-[#6B7280]">Expenses</p>
              <p className="font-mono font-bold text-xl text-[#111827]">
                $4,204.00
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminDisruptions() {
  const [filter, setFilter] = useState<"all" | "active" | "resolved">("all");
  const rows = [
    {
      city: "Bengaluru",
      type: "Rain",
      score: 78,
      status: "active",
      payout: 364000,
    },
    {
      city: "Delhi-NCR",
      type: "AQI",
      score: 82,
      status: "active",
      payout: 588000,
    },
    {
      city: "Mumbai",
      type: "Flood",
      score: 66,
      status: "resolved",
      payout: 259000,
    },
    {
      city: "Chennai",
      type: "Cyclone",
      score: 74,
      status: "resolved",
      payout: 342000,
    },
  ];

  const filteredRows = rows.filter(
    (row) => filter === "all" || row.status === filter,
  );

  return (
    <div className="k-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-syne font-bold text-3xl text-[#111827]">
          Disruption Events
        </h2>
        <div className="k-toggle-group">
          {(["all", "active", "resolved"] as const).map((value) => (
            <button
              key={value}
              className={cn(
                "k-toggle-btn capitalize",
                filter === value && "active",
              )}
              onClick={() => setFilter(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[#6B7280] border-b border-[#E2E8F0]">
              <th className="py-3">City</th>
              <th className="py-3">Type</th>
              <th className="py-3">Risk Score</th>
              <th className="py-3">Status</th>
              <th className="py-3">Estimated Payout</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr
                key={`${row.city}-${row.type}`}
                className="border-b border-[#EDE9FE] text-[#111827]"
              >
                <td className="py-3">{row.city}</td>
                <td className="py-3">{row.type}</td>
                <td className="py-3">{row.score}/100</td>
                <td className="py-3">
                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-xs font-semibold",
                      row.status === "active"
                        ? "bg-[#FEE2E2] text-[#B91C1C]"
                        : "bg-[#DCFCE7] text-[#166534]",
                    )}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="py-3 font-mono">{formatRupee(row.payout)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminFraudQueue() {
  const [accepted, setAccepted] = useState<string[]>([]);
  const cases = [
    { id: "FR-1021", reason: "Geo mismatch", age: "14m", amount: 18400 },
    { id: "FR-1022", reason: "Duplicate trigger", age: "21m", amount: 12200 },
    { id: "FR-1023", reason: "Suspicious OCR", age: "43m", amount: 9800 },
  ];

  return (
    <div className="k-card p-6">
      <h2 className="font-syne font-bold text-3xl text-[#111827] mb-4">
        Fraud Review Queue
      </h2>
      <div className="space-y-3">
        {cases.map((fraudCase) => {
          const isApproved = accepted.includes(fraudCase.id);
          return (
            <div
              key={fraudCase.id}
              className="k-card-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
            >
              <div>
                <p className="font-semibold text-[#111827]">
                  {fraudCase.id} - {fraudCase.reason}
                </p>
                <p className="text-sm text-[#6B7280]">
                  Oldest age: {fraudCase.age} | Amount:{" "}
                  {formatRupee(fraudCase.amount)}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="btn-secondary py-2 px-3">Escalate</button>
                <button
                  className={cn(
                    "py-2 px-3 rounded-xl text-sm font-semibold",
                    isApproved
                      ? "bg-[#DCFCE7] text-[#166534]"
                      : "bg-black text-white",
                  )}
                  onClick={() =>
                    setAccepted((prev) =>
                      isApproved
                        ? prev.filter((id) => id !== fraudCase.id)
                        : [...prev, fraudCase.id],
                    )
                  }
                >
                  {isApproved ? "Approved" : "Approve"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AdminAnalytics() {
  const metrics = [
    { label: "Active policies", value: "24,831" },
    { label: "Loss ratio", value: "58.3%" },
    { label: "Payout liability", value: formatRupeeCompact(1842000) },
    { label: "AA consent", value: "82%" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="k-card-sm">
            <p className="text-xs text-[#6B7280]">{metric.label}</p>
            <p className="font-syne font-bold text-3xl text-[#111827] mt-2">
              {metric.value}
            </p>
          </div>
        ))}
      </div>
      <div className="k-card p-6">
        <h2 className="font-syne font-bold text-3xl text-[#111827] mb-4">
          Regional Trends
        </h2>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            { city: "Bengaluru", ratio: 63, active: 0.63 },
            { city: "Delhi-NCR", ratio: 59, active: 0.59 },
            { city: "Mumbai", ratio: 56, active: 0.56 },
          ].map((item) => (
            <div key={item.city} className="k-card-sm">
              <p className="font-semibold text-[#111827]">{item.city}</p>
              <div className="h-2 bg-[#E2E8F0] rounded-full mt-3 overflow-hidden">
                <div
                  className="h-full bg-[#6366F1]"
                  style={{ width: `${item.active * 100}%` }}
                />
              </div>
              <p className="text-xs text-[#6B7280] mt-2">
                Loss ratio {item.ratio}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminPipeline() {
  return (
    <div className="k-card p-6">
      <h2 className="font-syne font-bold text-3xl text-[#111827] mb-4">
        Pipeline Health
      </h2>
      <div className="space-y-2">
        {mockPipelineHealth.map((service) => (
          <div
            key={service.name}
            className="k-card-sm flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
          >
            <div
              className={cn(
                "w-2.5 h-2.5 rounded-full mt-1",
                service.status === "live" ? "bg-[#10B981]" : "bg-[#F59E0B]",
              )}
            />
            <div className="flex-1">
              <p className="font-semibold text-[#111827]">{service.name}</p>
              <p className="text-xs text-[#6B7280]">
                {service.lastUpdated} | latency: {service.latency}
              </p>
            </div>
            <p className="font-mono text-sm text-[#111827]">
              {service.uptime}% uptime
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminConfig() {
  const [threshold, setThreshold] = useState("70");
  const [payoutWindow, setPayoutWindow] = useState("4");
  const canSave = Number(threshold) > 0 && Number(payoutWindow) > 0;

  return (
    <div className="k-card p-6">
      <h2 className="font-syne font-bold text-3xl text-[#111827] mb-4">
        Configuration
      </h2>
      <div className="grid md:grid-cols-2 gap-4">
        <label className="block">
          <span className="text-sm text-[#6B7280]">
            Disruption trigger threshold
          </span>
          <input
            value={threshold}
            onChange={(event) =>
              setThreshold(event.target.value.replace(/\D/g, ""))
            }
            className="k-input mt-2"
            placeholder="70"
          />
        </label>
        <label className="block">
          <span className="text-sm text-[#6B7280]">Payout SLA (minutes)</span>
          <input
            value={payoutWindow}
            onChange={(event) =>
              setPayoutWindow(event.target.value.replace(/\D/g, ""))
            }
            className="k-input mt-2"
            placeholder="4"
          />
        </label>
      </div>
      <div className="mt-5 flex items-center gap-2 text-sm text-[#6B7280]">
        <AlertTriangle size={16} className="text-[#F59E0B]" />
        Changes are applied to sandbox only.
      </div>
      <button
        className="btn-primary mt-4 inline-flex items-center gap-2"
        disabled={!canSave}
      >
        <Save size={16} />
        Save settings
      </button>
    </div>
  );
}

export default function AdminDashboard() {
  const today = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      }),
    [],
  );

  return (
    <div
      className="min-h-screen p-2 md:p-4"
      style={{ background: "var(--bg-app)" }}
    >
      <div className="h-[calc(100vh-16px)] md:h-[calc(100vh-32px)] rounded-[28px] border border-[#111827] bg-[#ECECEC] overflow-hidden">
        <div className="flex h-full">
          <aside className="hidden md:flex flex-col w-56 bg-[#BFD2FF] border-r border-[#A5B4FC] p-5">
            <div className="w-11 h-11 rounded-xl bg-black text-white flex items-center justify-center font-syne font-bold text-sm">
              K
            </div>
            <nav className="mt-8 flex-1 space-y-2">
              {adminNav.map(({ to, icon: Icon, label, end }) => (
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
          </aside>

          <div className="flex-1 flex flex-col min-w-0">
            <header className="px-4 md:px-8 py-4 border-b border-[#D4D4D8] bg-[#ECECEC]">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="font-syne font-bold text-5xl text-[#111827]">
                    Hello, Admin!
                  </h1>
                  <p className="text-sm text-[#6B7280] mt-1">
                    All platform and risk operations in one place. {today}.
                  </p>
                </div>
                <div className="ml-auto hidden md:flex items-center gap-3">
                  <div className="flex items-center bg-[#E4E4E7] rounded-full px-4 py-2 min-w-[280px]">
                    <Search size={16} className="text-[#6B7280]" />
                    <input
                      className="bg-transparent outline-none ml-2 text-sm text-[#111827] w-full"
                      placeholder="Search something"
                    />
                  </div>
                  <button className="w-10 h-10 rounded-full bg-[#E4E4E7] flex items-center justify-center text-[#374151]">
                    <Bell size={17} />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-[#111827] text-white flex items-center justify-center font-semibold">
                    A
                  </div>
                </div>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              <Routes>
                <Route index element={<AdminHome />} />
                <Route path="disruptions" element={<AdminDisruptions />} />
                <Route path="fraud" element={<AdminFraudQueue />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="pipeline" element={<AdminPipeline />} />
                <Route path="config" element={<AdminConfig />} />
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
