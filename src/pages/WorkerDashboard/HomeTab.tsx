import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";
import {
  Pause,
  FileText,
  Map,
  MessageCircle,
  MoreHorizontal,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { RupeeCounter } from "@/components/shared/RupeeCounter";
import { Modal } from "@/components/shared/Modal";
import { usePolicyStore } from "@/store/policyStore";
import { formatRupee } from "@/utils/formatRupee";
import { cn } from "@/utils/cn";

// ── Weekly data ──────────────────────────────────────────
const weeklyData = [
  { day: "Mon", expected: 740, actual: 720 },
  { day: "Tue", expected: 740, actual: 680 },
  { day: "Wed", expected: 740, actual: 480 },
  { day: "Thu", expected: 740, actual: 740 },
  { day: "Fri", expected: 820, actual: 900 },
  { day: "Sat", expected: 760, actual: 730 },
  { day: "Sun", expected: 700, actual: 680 },
];
const monthlyData = [
  { day: "W1", expected: 3700, actual: 3540 },
  { day: "W2", expected: 3700, actual: 3200 },
  { day: "W3", expected: 3700, actual: 3800 },
  { day: "W4", expected: 3700, actual: 3490 },
];

const platformCards = [
  {
    id: "swiggy",
    label: "Swiggy",
    icon: "🍜",
    color: "#FC8019",
    weekEarnings: 2100,
    lastEarning: 380,
    lastDay: "Fri",
  },
  {
    id: "zomato",
    label: "Zomato",
    icon: "🍕",
    color: "#E23744",
    weekEarnings: 1680,
    lastEarning: 290,
    lastDay: "Thu",
  },
  {
    id: "zepto",
    label: "Zepto",
    icon: "⚡",
    color: "#9333EA",
    weekEarnings: 840,
    lastEarning: 180,
    lastDay: "Wed",
  },
];

const recentPayouts = [
  {
    icon: "🌧️",
    label: "Heavy Rain Payout",
    amount: 364,
    date: "Mar 19, 04:31 AM",
    positive: true,
  },
  {
    icon: "😷",
    label: "AQI Severe Payout",
    amount: 210,
    date: "Mar 11, 02:15 PM",
    positive: true,
  },
  {
    icon: "🛡️",
    label: "Policy Renewed (Week 4)",
    amount: 65,
    date: "Mar 17, 09:00 AM",
    positive: false,
  },
];

// ── Animated dots ────────────────────────────────────────
function AnimatedDots() {
  const [dots, setDots] = useState(1);
  useEffect(() => {
    const t = setInterval(() => setDots((d) => (d === 3 ? 1 : d + 1)), 600);
    return () => clearInterval(t);
  }, []);
  return (
    <span>
      {"●".repeat(dots)}
      {"○".repeat(3 - dots)}
    </span>
  );
}

// ── Custom tooltip ────────────────────────────────────────
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number; name: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="k-card-sm text-xs"
      style={{ padding: "8px 12px", minWidth: 130 }}
    >
      <div className="font-semibold text-[#0F172A] mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex justify-between gap-3">
          <span className="text-[#64748B]">
            {p.name === "expected" ? "Expected" : "Actual"}
          </span>
          <span className="font-mono font-bold text-[#0F172A]">
            {formatRupee(p.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Pause Modal ───────────────────────────────────────────
function PauseModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selected, setSelected] = useState<1 | 2>(1);
  const { pause, pausesUsedThisYear } = usePolicyStore();
  const remaining = 2 - pausesUsedThisYear;

  const handlePause = () => {
    pause();
    toast.success(
      `Policy paused for ${selected} week${selected > 1 ? "s" : ""}`,
    );
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Pause Policy">
      <p className="text-[#64748B] text-sm mb-4">
        You have <strong>{remaining}</strong> pause{remaining !== 1 ? "s" : ""}{" "}
        remaining this year.
      </p>
      <div className="grid grid-cols-2 gap-3 mb-5">
        {([1, 2] as const).map((n) => (
          <button
            key={n}
            onClick={() => setSelected(n)}
            className={cn(
              "border-2 rounded-2xl py-4 text-center transition-all",
              selected === n
                ? "border-[#6366F1] bg-indigo-50"
                : "border-[#E2E8F0] hover:border-indigo-200",
            )}
          >
            <div className="font-syne font-bold text-2xl text-[#0F172A]">
              {n}
            </div>
            <div className="text-sm text-[#64748B]">week{n > 1 ? "s" : ""}</div>
          </button>
        ))}
      </div>
      <button
        onClick={handlePause}
        className="btn-primary w-full"
        disabled={remaining === 0}
      >
        Pause for {selected} week{selected > 1 ? "s" : ""}
      </button>
      {remaining === 0 && (
        <p className="text-xs text-red-500 text-center mt-2">
          No pauses remaining this year.
        </p>
      )}
    </Modal>
  );
}

// ── Home Tab ──────────────────────────────────────────────
export function HomeTab() {
  const [chartPeriod, setChartPeriod] = useState<"weekly" | "monthly">(
    "weekly",
  );
  const [pauseOpen, setPauseOpen] = useState(false);
  const navigate = useNavigate();
  const chartData = chartPeriod === "weekly" ? weeklyData : monthlyData;
  const totalEarnings = weeklyData.reduce((s, d) => s + d.actual, 0);

  return (
    <div className="p-6 space-y-5">
      <PauseModal open={pauseOpen} onClose={() => setPauseOpen(false)} />

      <div className="grid lg:grid-cols-3 gap-5">
        {/* LEFT: Hero + Actions + Platforms + Disruption + Payouts */}
        <div className="lg:col-span-2 space-y-4">
          {/* Hero earnings card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="k-card-hero"
          >
            <p className="text-[#3730A3] text-sm font-medium mb-1">
              Today's Earnings
            </p>
            <RupeeCounter
              value={480}
              size="xl"
              className="text-[#1E1B4B] font-syne font-bold"
            />
            <p className="text-indigo-700 text-sm mt-1">
              Expected today: {formatRupee(740)}
            </p>

            {/* Progress */}
            <div className="mt-4 mb-5">
              <div className="h-2 bg-indigo-200/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "65%" }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                  className="h-full bg-[#1E1B4B] rounded-full"
                />
              </div>
              <p className="text-xs text-indigo-700 mt-1">
                65% of daily target · ₹260 shortfall
              </p>
            </div>

            {/* Quick actions */}
            <div className="flex gap-6">
              {[
                {
                  icon: Pause,
                  label: "Pause",
                  onClick: () => setPauseOpen(true),
                },
                {
                  icon: FileText,
                  label: "Policy",
                  onClick: () => navigate("/dashboard/policy"),
                },
                {
                  icon: Map,
                  label: "Zone Map",
                  onClick: () => navigate("/dashboard/zone-map"),
                },
                {
                  icon: MessageCircle,
                  label: "WhatsApp",
                  onClick: () =>
                    window.open("https://wa.me/+917676767676", "_blank"),
                },
              ].map(({ icon: Icon, label, onClick }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <button
                    className="k-action-btn"
                    onClick={onClick}
                    aria-label={label}
                  >
                    <Icon size={20} />
                  </button>
                  <span className="text-xs text-[#64748B]">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Disruption banner */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="disruption-alert"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌧️</span>
                <div>
                  <div className="font-semibold text-[#0F172A] text-sm">
                    Heavy rain detected in Koramangala zone
                  </div>
                  <div className="text-xs text-[#EF4444] mt-0.5">
                    Disruption Score: 78/100 · Est. payout: ₹364
                  </div>
                  <div className="text-xs text-[#64748B] mt-0.5">
                    Payout calculating <AnimatedDots />
                  </div>
                </div>
              </div>
              <span className="badge-danger flex-shrink-0">LIVE</span>
            </div>
          </motion.div>

          {/* Platform cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-syne font-bold text-[#0F172A]">
                Linked Platforms
              </h3>
              <button className="text-xs text-[#6366F1] font-medium">
                + Add platform
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {platformCards.map((p) => (
                <div key={p.id} className="k-card-sm flex-shrink-0 w-44">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{p.icon}</span>
                    <button className="text-[#94A3B8]">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  <div className="text-xs text-[#64748B] mb-1">{p.label}</div>
                  <div className="font-mono font-bold text-[#0F172A]">
                    {formatRupee(p.weekEarnings)}
                  </div>
                  <div className="text-xs text-[#94A3B8] mt-0.5">
                    Last: {formatRupee(p.lastEarning)} {p.lastDay}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent payouts */}
          <div className="k-card">
            <h3 className="font-syne font-bold text-[#0F172A] mb-4">
              Recent Payouts
            </h3>
            <div className="space-y-3">
              {recentPayouts.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 py-2 border-b border-[#EDE9FE] last:border-0"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center text-xl flex-shrink-0">
                    {r.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#0F172A]">
                      {r.label}
                    </div>
                    <div className="text-xs text-[#94A3B8]">{r.date}</div>
                  </div>
                  <div
                    className={cn(
                      "font-mono font-bold text-sm",
                      r.positive ? "text-[#10B981]" : "text-[#EF4444]",
                    )}
                  >
                    {r.positive ? "+" : "-"}
                    {formatRupee(r.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Zone safety + Statistics */}
        <div className="space-y-4">
          {/* Zone safety */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="k-card"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-syne font-bold text-[#0F172A] text-sm">
                Zone Safety
              </h3>
              <button
                onClick={() => navigate("/dashboard/zone-map")}
                className="text-xs text-[#6366F1] flex items-center gap-0.5"
              >
                Full map <ChevronRight size={12} />
              </button>
            </div>
            <p className="text-xs text-[#64748B] mb-2">
              Koramangala, Bengaluru
            </p>
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "w-6 h-6 rounded-full",
                    i <= 3 ? "bg-amber-400" : "bg-gray-200",
                  )}
                />
              ))}
              <span className="text-sm font-semibold text-[#0F172A] ml-2">
                3/5
              </span>
            </div>
            <div className="badge-amber text-[11px]">Moderate risk today</div>
          </motion.div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="k-card"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-syne font-bold text-[#0F172A] text-sm">
                Statistics
              </h3>
              <div className="k-toggle-group">
                <button
                  className={cn(
                    "k-toggle-btn",
                    chartPeriod === "weekly" && "active",
                  )}
                  onClick={() => setChartPeriod("weekly")}
                >
                  Weekly
                </button>
                <button
                  className={cn(
                    "k-toggle-btn",
                    chartPeriod === "monthly" && "active",
                  )}
                  onClick={() => setChartPeriod("monthly")}
                >
                  Monthly
                </button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData} barGap={3}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94A3B8", fontSize: 11 }}
                />
                <YAxis hide />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="expected"
                  name="expected"
                  radius={[4, 4, 0, 0]}
                  fill="var(--chart-secondary)"
                />
                <Bar
                  dataKey="actual"
                  name="actual"
                  radius={[4, 4, 0, 0]}
                  fill="var(--chart-primary)"
                />
              </BarChart>
            </ResponsiveContainer>

            <div className="flex gap-2 mt-1 mb-4">
              <span className="flex items-center gap-1 text-xs text-[#64748B]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1E1B4B] inline-block" />
                Actual
              </span>
              <span className="flex items-center gap-1 text-xs text-[#64748B]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#A5B4FC] inline-block" />
                Expected
              </span>
            </div>

            <div className="border-t border-[#EDE9FE] pt-4">
              <p className="text-xs text-[#64748B] mb-1">
                Total earnings this week
              </p>
              <RupeeCounter
                value={totalEarnings}
                size="lg"
                className="text-[#0F172A] font-syne font-bold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-[#EEF2FF] rounded-2xl p-3">
                <div className="flex items-center gap-1 text-xs text-[#64748B] mb-1">
                  <TrendingUp size={12} className="text-[#10B981]" /> Income
                </div>
                <div className="font-mono font-bold text-[#0F172A] text-sm">
                  {formatRupee(totalEarnings)} ↑
                </div>
              </div>
              <div className="bg-[#FFF1F2] rounded-2xl p-3">
                <div className="flex items-center gap-1 text-xs text-[#64748B] mb-1">
                  🛡️ Premium
                </div>
                <div className="font-mono font-bold text-[#0F172A] text-sm">
                  ₹500 ↓
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
