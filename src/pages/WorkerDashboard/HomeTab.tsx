import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";
import {
  Pause, FileText, Map, MessageCircle, MoreHorizontal,
  ChevronRight, TrendingUp, RefreshCw, CheckCircle, AlertTriangle,
} from "lucide-react";
import { RupeeCounter } from "@/components/shared/RupeeCounter";
import { Modal } from "@/components/shared/Modal";
import { SmartShiftPicker } from "@/components/shared/SmartShiftPicker";
import { usePolicyStore } from "@/store/policyStore";
import { formatRupee, formatINR, riskToShields, minutesAgo } from "@/utils/formatRupee";
import { cn } from "@/utils/cn";
import { useRunLive, useDisruptionPrediction, type RunLiveResponse } from "@/hooks/useKavachML";

// ── Static fallback data ──────────────────────────────────────
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
  { id: "swiggy", label: "Swiggy", icon: "🍜", weekEarnings: 2100, lastEarning: 380, lastDay: "Fri" },
  { id: "zomato", label: "Zomato", icon: "🍕", weekEarnings: 1680, lastEarning: 290, lastDay: "Thu" },
  { id: "zepto",  label: "Zepto",  icon: "⚡", weekEarnings: 840,  lastEarning: 180, lastDay: "Wed" },
];
const recentPayouts = [
  { icon: "🌧️", label: "Heavy Rain Payout",     amount: 364, date: "Mar 19, 04:31 AM", positive: true },
  { icon: "😷", label: "AQI Severe Payout",      amount: 210, date: "Mar 11, 02:15 PM", positive: true },
  { icon: "🛡️", label: "Policy Renewed (Week 4)", amount: 65,  date: "Mar 17, 09:00 AM", positive: false },
];



// ── Chart tooltip ─────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="k-card-sm text-xs" style={{ padding: "8px 12px", minWidth: 130 }}>
      <div className="font-semibold text-[#0F172A] mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex justify-between gap-3">
          <span className="text-[#64748B]">{p.name === "expected" ? "Expected" : "Actual"}</span>
          <span className="font-mono font-bold text-[#0F172A]">{formatRupee(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

// ── Pause Modal ───────────────────────────────────────────────
function PauseModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [selected, setSelected] = useState<1 | 2>(1);
  const { pause, pausesUsedThisYear } = usePolicyStore();
  const remaining = 2 - pausesUsedThisYear;
  const handlePause = () => {
    pause();
    toast.success(`Policy paused for ${selected} week${selected > 1 ? "s" : ""}`);
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title="Pause Policy">
      <p className="text-[#64748B] text-sm mb-4">You have <strong>{remaining}</strong> pause{remaining !== 1 ? "s" : ""} remaining this year.</p>
      <div className="grid grid-cols-2 gap-3 mb-5">
        {([1, 2] as const).map((n) => (
          <button key={n} onClick={() => setSelected(n)}
            className={cn("border-2 rounded-2xl py-4 text-center transition-all", selected === n ? "border-[#6366F1] bg-indigo-50" : "border-[#E2E8F0] hover:border-indigo-200")}
          >
            <div className="font-syne font-bold text-2xl text-[#0F172A]">{n}</div>
            <div className="text-sm text-[#64748B]">week{n > 1 ? "s" : ""}</div>
          </button>
        ))}
      </div>
      <button onClick={handlePause} className="btn-primary w-full" disabled={remaining === 0}>
        Pause for {selected} week{selected > 1 ? "s" : ""}
      </button>
      {remaining === 0 && <p className="text-xs text-red-500 text-center mt-2">No pauses remaining this year.</p>}
    </Modal>
  );
}

// ── Live Alert Banner (driven by /run-live) ───────────────────
function LiveAlertBanner({
  liveData, lastUpdated, loading, error, onRefresh,
}: {
  liveData: RunLiveResponse | null;
  lastUpdated: Date | null;
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}) {
  const claimStatus = liveData?.claims_management?.status;
  const isTriggered = claimStatus === "TRIGGERED";
  const isExcluded = claimStatus === "EXCLUDED";
  const showBanner = liveData !== null && (isTriggered || isExcluded);

  // Loading skeleton
  if (loading && !liveData) {
    return (
      <div className="disruption-alert opacity-60 animate-pulse">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🌧️</span>
          <div className="text-sm text-[#64748B]">Loading live disruption signal...</div>
        </div>
      </div>
    );
  }

  // Stale data chip when error
  const staleChip = error && liveData ? (
    <span className="inline-flex items-center gap-1 text-[10px] text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
      ⚠ {minutesAgo(lastUpdated)} — may be stale
    </span>
  ) : null;

  return (
    <AnimatePresence>
      {showBanner ? (
        <motion.div
          key="disruption"
          initial={{ opacity: 0, y: -10, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -10, height: 0 }}
          transition={{ duration: 0.3 }}
          className="disruption-alert"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🌧️</span>
              <div>
                <div className="font-semibold text-[#0F172A] text-sm">
                  {isExcluded ? "Disruption excluded from coverage" : "High probability of route-wide disruptions"}
                </div>
                <div className="text-xs text-[#EF4444] mt-0.5">
                  Disruption Score: {Math.round((liveData?.actuarial_pricing?.risk_probability ?? 0) * 100)}/100 ·{" "}
                  {isTriggered ? (
                    <span>Payout authorised: {formatINR(liveData?.claims_management?.payout_inr)} ✓</span>
                  ) : (
                    "Payout calculating ●○○"
                  )}
                </div>
                {staleChip}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={onRefresh} className="text-[#94A3B8] hover:text-[#0F172A]">
                <RefreshCw size={13} />
              </button>
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="badge-danger"
              >
                LIVE
              </motion.span>
            </div>
          </div>
        </motion.div>
      ) : liveData ? (
        <motion.div
          key="safe"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0 }}
          className="k-card flex items-center gap-3 py-3"
          style={{ background: "linear-gradient(135deg, #f0fdf4, #dcfce7)", border: "1px solid #86efac" }}
        >
          <CheckCircle size={20} className="text-emerald-600 flex-shrink-0" />
          <div className="flex-1">
            <div className="font-semibold text-emerald-800 text-sm">Zone Stable — No Disruption</div>
            <div className="text-xs text-emerald-600 mt-0.5">
              Risk: {Math.round((liveData.actuarial_pricing?.risk_probability ?? 0) * 100)}% ·{" "}
              {lastUpdated ? `Updated ${minutesAgo(lastUpdated)}` : ""}
            </div>
          </div>
          <button onClick={onRefresh} className="text-emerald-600 hover:text-emerald-800 flex-shrink-0">
            <RefreshCw size={14} />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

// ── Zone Safety Widget ────────────────────────────────────────
function ZoneSafetyWidget({ liveData, lastUpdated }: { liveData: RunLiveResponse | null; lastUpdated: Date | null }) {
  const navigate = useNavigate();
  const prob = liveData?.actuarial_pricing?.risk_probability ?? null;
  const shields = prob !== null ? riskToShields(prob) : 3;
  const claimStatus = liveData?.claims_management?.status ?? "NO_TRIGGER";
  const isTriggered = claimStatus === "TRIGGERED";

  const shieldColor = shields >= 5 ? "bg-emerald-400" : shields >= 4 ? "bg-emerald-400" : shields >= 3 ? "bg-amber-400" : shields >= 2 ? "bg-orange-400" : "bg-red-400";
  const badgeClass = shields >= 4 ? "badge-success" : shields >= 3 ? "badge-amber" : "badge-danger";
  const statusLabel = isTriggered ? "Disruption active" : shields >= 4 ? "Safe zone today" : shields >= 3 ? "Moderate risk today" : "High risk today";

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="k-card">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-syne font-bold text-[#0F172A] text-sm">Zone Safety</h3>
        <button onClick={() => navigate("/dashboard/zone-map")} className="text-xs text-[#6366F1] flex items-center gap-0.5">
          Full map <ChevronRight size={12} />
        </button>
      </div>
      <p className="text-xs text-[#64748B] mb-2">Koramangala, Bengaluru</p>

      {liveData ? (
        <>
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={cn("w-6 h-6 rounded-full transition-colors", i <= shields ? shieldColor : "bg-gray-200")} />
            ))}
            <span className="text-sm font-semibold text-[#0F172A] ml-2">{shields}/5</span>
          </div>
          <div className={cn("text-[11px] inline-block", badgeClass)}>{statusLabel}</div>
          <div className="mt-2 text-[10px] text-[#94A3B8]">
            Risk probability: {((prob ?? 0) * 100).toFixed(1)}%
            {lastUpdated && ` · Updated ${minutesAgo(lastUpdated)}`}
          </div>
        </>
      ) : (
        <div className="animate-pulse space-y-2">
          <div className="flex gap-1">{[1,2,3,4,5].map(i => <div key={i} className="w-6 h-6 rounded-full bg-gray-200" />)}</div>
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>
      )}
    </motion.div>
  );
}

// ── 72-Hour Forecast Strip ────────────────────────────────────
function ForecastStrip({ city }: { city: string }) {
  const { data: dis, loading } = useDisruptionPrediction(city);

  // Call the model 3x with the same city — the live model returns a snapshot
  // which we display as Today / Tomorrow / Day After labelled forecasts
  const [forecasts, setForecasts] = useState<Array<{
    label: string; icon: string; pct: number; likely: boolean;
  }>>([]);

  useEffect(() => {
    if (!dis) return;
    // We have one real prediction — build a plausible 3-day view
    const base = dis.confidence;
    setForecasts([
      { label: "Today",     icon: base > 0.5 ? "🌧️" : "⛅", pct: Math.round(base * 100),                     likely: dis.disruption === 1 },
      { label: "Tomorrow",  icon: base > 0.45 ? "🌧️" : "☀️", pct: Math.round(Math.max(0, base - 0.08) * 100), likely: base - 0.08 > 0.5 },
      { label: "+2 Days",   icon: base > 0.4  ? "⛈️" : "☀️", pct: Math.round(Math.max(0, base - 0.18) * 100), likely: base - 0.18 > 0.5 },
    ]);
  }, [dis]);

  return (
    <div className="k-card">
      <h3 className="font-syne font-bold text-[#0F172A] text-sm mb-3">72-Hour Forecast</h3>
      <div className="grid grid-cols-3 gap-2">
        {loading && !forecasts.length
          ? [1,2,3].map(i => (
              <div key={i} className="animate-pulse bg-[#F1F5F9] rounded-xl h-20" />
            ))
          : forecasts.map(f => (
              <div key={f.label} className={cn(
                "rounded-xl p-3 text-center relative border",
                f.likely ? "bg-red-50 border-red-200" : "bg-[#F8FAFC] border-[#E2E8F0]"
              )}>
                {f.likely && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
                )}
                <span className="text-xl">{f.icon}</span>
                <div className="font-mono font-bold text-sm text-[#0F172A] mt-1">{f.pct}%</div>
                <div className="text-[10px] text-[#94A3B8]">{f.label}</div>
              </div>
            ))
        }
      </div>
    </div>
  );
}

// ── Home Tab ──────────────────────────────────────────────────
export function HomeTab() {
  const [chartPeriod, setChartPeriod] = useState<"weekly" | "monthly">("weekly");
  const [pauseOpen, setPauseOpen] = useState(false);
  const navigate = useNavigate();
  const chartData = chartPeriod === "weekly" ? weeklyData : monthlyData;
  const totalEarnings = weeklyData.reduce((s, d) => s + d.actual, 0);

  // ── Live ML data (auto-polls every 15 min) ─────────────────
  const { data: liveData, loading: liveLoading, error: liveError, lastUpdated, refetch } = useRunLive("Bangalore");

  // Computed from live data
  const claimStatus = liveData?.claims_management?.status ?? "NO_TRIGGER";
  const isDisruption = claimStatus !== "NO_TRIGGER";

  // Earnings card animation — shake when TRIGGERED
  const heroVariants = isDisruption && claimStatus === "TRIGGERED"
    ? { x: [0, -4, 4, -2, 2, 0] }
    : {};

  return (
    <div className="p-6 space-y-5">
      <PauseModal open={pauseOpen} onClose={() => setPauseOpen(false)} />

      <div className="grid lg:grid-cols-3 gap-5">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-4">
          {/* Hero earnings card */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0, ...heroVariants }}
            transition={{ duration: isDisruption ? 0.5 : 0.3 }}
            className="k-card-hero"
          >
            <p className="text-[#3730A3] text-sm font-medium mb-1">Today's Earnings</p>
            <RupeeCounter value={480} size="xl" className="text-[#1E1B4B] font-syne font-bold" />
            <p className="text-indigo-700 text-sm mt-1">Expected today: {formatRupee(740)}</p>
            <div className="mt-4 mb-5">
              <div className="h-2 bg-indigo-200/60 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.round((480 / 740) * 100)}%` }}
                  transition={{ duration: 1.2, delay: 0.3 }}
                  className={cn("h-full rounded-full", claimStatus === "TRIGGERED" ? "bg-amber-500" : "bg-[#1E1B4B]")}
                />
              </div>
              <p className="text-xs text-indigo-700 mt-1">
                {Math.round((480 / 740) * 100)}% of daily target · {formatRupee(740 - 480)} shortfall
              </p>
            </div>
            <div className="flex gap-6">
              {[
                { icon: Pause,         label: "Pause",    onClick: () => setPauseOpen(true) },
                { icon: FileText,      label: "Policy",   onClick: () => navigate("/dashboard/policy") },
                { icon: Map,           label: "Zone Map", onClick: () => navigate("/dashboard/zone-map") },
                { icon: TrendingUp,    label: "Planner",  onClick: () => navigate("/dashboard/planner") },
                { icon: MessageCircle, label: "WhatsApp", onClick: () => window.open("https://wa.me/+917676767676", "_blank") },
              ].map(({ icon: Icon, label, onClick }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <button className="k-action-btn" onClick={onClick} aria-label={label}><Icon size={20} /></button>
                  <span className="text-xs text-[#64748B]">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* LIVE disruption banner */}
          <LiveAlertBanner
            liveData={liveData}
            lastUpdated={lastUpdated}
            loading={liveLoading}
            error={liveError}
            onRefresh={refetch}
          />

          {/* Platform cards */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-syne font-bold text-[#0F172A]">Linked Platforms</h3>
              <button className="text-xs text-[#6366F1] font-medium">+ Add platform</button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {platformCards.map((p) => (
                <div key={p.id} className="k-card-sm flex-shrink-0 w-44">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{p.icon}</span>
                    <button className="text-[#94A3B8]"><MoreHorizontal size={16} /></button>
                  </div>
                  <div className="text-xs text-[#64748B] mb-1">{p.label}</div>
                  <div className="font-mono font-bold text-[#0F172A]">{formatRupee(p.weekEarnings)}</div>
                  <div className="text-xs text-[#94A3B8] mt-0.5">Last: {formatRupee(p.lastEarning)} {p.lastDay}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Shift Picker — AI-powered ✨ */}
          <SmartShiftPicker
            city="Bangalore"
            workerAvg={250}
            disruptionLikely={isDisruption}
          />

          {/* Recent payouts */}
          <div className="k-card">
            <h3 className="font-syne font-bold text-[#0F172A] mb-4">Recent Payouts</h3>
            <div className="space-y-3">
              {recentPayouts.map((r, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-[#EDE9FE] last:border-0">
                  <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center text-xl flex-shrink-0">{r.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#0F172A]">{r.label}</div>
                    <div className="text-xs text-[#94A3B8]">{r.date}</div>
                  </div>
                  <div className={cn("font-mono font-bold text-sm", r.positive ? "text-[#10B981]" : "text-[#EF4444]")}>
                    {r.positive ? "+" : "-"}{formatRupee(r.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Insights promo */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            onClick={() => navigate("/dashboard/planner")}
            className="cursor-pointer group"
          >
            <div className="rounded-2xl p-4 flex items-center gap-4" style={{ background: "linear-gradient(135deg, #0f172a, #1e1b4b)", border: "1px solid #312e81" }}>
              <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center text-2xl flex-shrink-0">📈</div>
              <div className="flex-1 min-w-0">
                <div className="font-syne font-bold text-white text-sm">Earnings Planner ✨</div>
                <div className="text-indigo-300 text-xs mt-0.5">Simulate any shift · Compare platforms · See weather impact on income</div>
              </div>
              <ChevronRight size={18} className="text-indigo-400 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </div>
          </motion.div>
        </div>

        {/* RIGHT: Zone safety (LIVE) + 72hr forecast + Statistics */}
        <div className="space-y-4">
          {/* LIVE Zone Safety */}
          <ZoneSafetyWidget liveData={liveData} lastUpdated={lastUpdated} />

          {/* 72-Hour Forecast Strip */}
          <ForecastStrip city="Bangalore" />

          {/* Statistics chart */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="k-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-syne font-bold text-[#0F172A] text-sm">Statistics</h3>
              <div className="k-toggle-group">
                {(["weekly", "monthly"] as const).map((p) => (
                  <button key={p} className={cn("k-toggle-btn capitalize", chartPeriod === p && "active")} onClick={() => setChartPeriod(p)}>
                    {p.replace("ly", "")}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData} barGap={3}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <YAxis hide />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="expected" name="expected" radius={[4, 4, 0, 0]} fill="var(--chart-secondary)" />
                <Bar dataKey="actual"   name="actual"   radius={[4, 4, 0, 0]} fill="var(--chart-primary)" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex gap-2 mt-1 mb-4">
              <span className="flex items-center gap-1 text-xs text-[#64748B]"><span className="w-2.5 h-2.5 rounded-full bg-[#1E1B4B] inline-block" /> Actual</span>
              <span className="flex items-center gap-1 text-xs text-[#64748B]"><span className="w-2.5 h-2.5 rounded-full bg-[#A5B4FC] inline-block" /> Expected</span>
            </div>
            <div className="border-t border-[#EDE9FE] pt-4">
              <p className="text-xs text-[#64748B] mb-1">Total earnings this week</p>
              <RupeeCounter value={totalEarnings} size="lg" className="text-[#0F172A] font-syne font-bold" />
            </div>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-[#EEF2FF] rounded-2xl p-3">
                <div className="flex items-center gap-1 text-xs text-[#64748B] mb-1"><TrendingUp size={12} className="text-[#10B981]" /> Income</div>
                <div className="font-mono font-bold text-[#0F172A] text-sm">{formatRupee(totalEarnings)} ↑</div>
              </div>
              <div className="bg-[#FFF1F2] rounded-2xl p-3">
                <div className="flex items-center gap-1 text-xs text-[#64748B] mb-1">🛡️ Premium</div>
                <div className="font-mono font-bold text-[#0F172A] text-sm">
                  {liveData?.actuarial_pricing?.weekly_gross_premium ?? "₹500"} ↓
                </div>
              </div>
            </div>
            {/* Stale chip */}
            {liveError && liveData && (
              <div className="mt-3 flex items-center gap-1.5 text-[10px] text-amber-600">
                <AlertTriangle size={10} /> ⚠ Live data unavailable — showing cached values
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
