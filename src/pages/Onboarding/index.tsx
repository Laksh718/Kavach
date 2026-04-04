import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { ChevronLeft, Check, ChevronDown, ChevronUp } from "lucide-react";
import { KavachLogo } from "@/components/shared/KavachLogo";
import { usePolicyStore } from "@/store/policyStore";
import { PLANS } from "@/constants/plans";
import { PLATFORMS } from "@/constants/platforms";
import i18n from "@/i18n";
import { cn } from "@/utils/cn";
import { formatRupee } from "@/utils/formatRupee";
import type { PlanTier } from "@/types/worker.types";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { dbService } from "@/services/db";
import { Mail, Lock, User as UserIcon, ArrowRight, LogIn } from "lucide-react";
import { useDynamicPricing } from "@/hooks/useKavachML";

// ─── Confetti ────────────────────────────────────────────────
const CONFETTI_COLORS = [
  "#6366F1",
  "#F59E0B",
  "#10B981",
  "#EF4444",
  "#A5B4FC",
  "#FCD34D",
  "#6EE7B7",
];
function ConfettiBurst() {
  const particles = Array.from({ length: 24 }, (_, i) => ({
    id: i,
    left: `${5 + Math.random() * 90}%`,
    delay: `${Math.random() * 0.8}s`,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: `${6 + Math.random() * 8}px`,
    duration: `${2 + Math.random() * 1}s`,
  }));
  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="confetti-particle"
          style={{
            left: p.left,
            top: "-20px",
            background: p.color,
            width: p.size,
            height: p.size,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </>
  );
}

// ─── Step 1: Language ─────────────────────────────────────────
const languages = [
  { code: "hi", label: "हिंदी", name: "Hindi", script: "Devanagari" },
  { code: "en", label: "English", name: "English", script: "Latin" },
  { code: "ta", label: "தமிழ்", name: "Tamil", script: "Tamil" },
  { code: "te", label: "తెలుగు", name: "Telugu", script: "Telugu" },
  { code: "bn", label: "বাংলা", name: "Bengali", script: "Bengali" },
  { code: "kn", label: "ಕನ್ನಡ", name: "Kannada", script: "Kannada" },
];

function Step1({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState("en");
  const handleSelect = (code: string) => {
    setSelected(code);
    i18n.changeLanguage(code);
  };
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-syne font-bold text-3xl text-[#0F172A]">
          Choose your language
        </h2>
        <p className="text-[#64748B] mt-1">
          भाषा चुनें · மொழி தேர்வு · ভাষা বেছে নিন
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            className={cn(
              "k-card-sm text-left p-5 relative transition-all interactive border-2",
              selected === lang.code
                ? "border-[#6366F1] bg-indigo-50"
                : "border-transparent",
            )}
          >
            {selected === lang.code && (
              <span className="absolute top-3 right-3 w-5 h-5 bg-[#6366F1] rounded-full flex items-center justify-center">
                <Check size={12} className="text-white" />
              </span>
            )}
            <div className="font-syne font-bold text-2xl text-[#0F172A] mb-1">
              {lang.label}
            </div>
            <div className="text-sm text-[#64748B]">{lang.name}</div>
          </button>
        ))}
      </div>
      <button onClick={onNext} className="btn-primary w-full">
        Continue →
      </button>
    </div>
  );
}

// ─── Step 2: Value Prop ──────────────────────────────────────
const payoutExamples = [
  {
    emoji: "🌧️",
    event: "Heavy rain in Mumbai?",
    payout: "₹840",
    time: "4 min",
    delay: 0,
  },
  {
    emoji: "😷",
    event: "Delhi AQI Severe?",
    payout: "₹588",
    time: "automatic",
    delay: 0.15,
  },
  {
    emoji: "🌊",
    event: "Chennai cyclone?",
    payout: "₹1,260",
    time: "zero paperwork",
    delay: 0.3,
  },
];
function Step2({ onNext }: { onNext: () => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-syne font-bold text-3xl text-[#0F172A] leading-tight">
          Rain day?
          <br />
          <span className="text-[#6366F1]">Still get paid.</span>
        </h2>
        <p className="text-[#64748B] mt-2">
          AI-powered protection for delivery partners. Money before your shift
          ends.
        </p>
      </div>
      <div className="space-y-3">
        {payoutExamples.map((ex, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: ex.delay }}
            className="k-card-sm flex items-center gap-3"
          >
            <span className="text-2xl">{ex.emoji}</span>
            <span className="flex-1 text-sm text-[#64748B]">{ex.event}</span>
            <span className="font-mono font-bold text-[#F59E0B]">
              {ex.payout}
            </span>
            <span className="text-xs text-[#94A3B8]">in {ex.time}</span>
          </motion.div>
        ))}
      </div>
      <div className="flex gap-3 justify-center pb-2">
        {[
          "🍕 Zomato",
          "🍜 Swiggy",
          "⚡ Zepto",
          "🛒 Blinkit",
          "📦 Amazon Flex",
        ].map((p) => (
          <span
            key={p}
            className="text-xs text-[#64748B] bg-white border border-[#E2E8F0] rounded-full px-3 py-1"
          >
            {p}
          </span>
        ))}
      </div>
      <button onClick={onNext} className="btn-primary w-full">
        Protect My Income →
      </button>
    </div>
  );
}

// ─── Step 3: Account Creation (Email/Pass) ─────────────────────
function Step3({ onNext }: { onNext: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setSession, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      onNext();
    }
  }, [isAuthenticated, onNext]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data.session) {
          setSession(data.session);
          toast.success("Welcome back! ✓");
        }
      } else {
        if (!fullName.trim()) {
          toast.error("Please enter your full name");
          setLoading(false);
          return;
        }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
          },
        });
        if (error) throw error;
        if (data.session) {
          setSession(data.session);
          toast.success("Account created! 🎉");
        } else {
          toast.success("Check your email for confirmation!");
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <h2 className="font-syne font-bold text-3xl text-[#0F172A]">
          {isLogin ? "Welcome back" : "Create your account"}
        </h2>
        <p className="text-[#64748B] mt-1">
          {isLogin 
            ? "Login to manage your KAVACH protection" 
            : "Join the most trusted platform for gig workers"}
        </p>
      </div>

      <form onSubmit={handleAuth} className="space-y-4">
        {!isLogin && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#64748B] flex items-center gap-2">
              <UserIcon size={16} /> Full Name
            </label>
            <input
              required
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="k-input"
            />
          </div>
        )}

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
            minLength={6}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2 py-4"
        >
          {loading ? (
            <span className="spinner-white w-5 h-5" />
          ) : isLogin ? (
            <>
              Login <LogIn size={20} />
            </>
          ) : (
            <>
              Create Account <ArrowRight size={20} />
            </>
          )}
        </button>
      </form>

      <div className="text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-sm text-[#6366F1] font-medium hover:underline"
        >
          {isLogin 
            ? "New to KAVACH? Create an account" 
            : "Already have an account? Login here"}
        </button>
      </div>
    </div>
  );
}

// ─── Step 4: eKYC ─────────────────────────────────────────────
function Step4({ onNext }: { onNext: () => void }) {
  const [pan, setPan] = useState("");
  const [panValid, setPanValid] = useState<boolean | null>(null);
  const [selfie, setSelfie] = useState<"idle" | "capturing" | "done">("idle");
  const [loading, setLoading] = useState(false);

  const validatePan = (v: string) => {
    setPan(v.toUpperCase());
    setPanValid(
      v.length === 10
        ? /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(v.toUpperCase())
        : null,
    );
  };

  const takeSelfie = () => {
    setSelfie("capturing");
    setTimeout(() => {
      setSelfie("done");
    }, 1500);
  };

  const { user } = useAuthStore();
  const handleVerify = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await dbService.updateProfile(user.id, { kycStatus: "verified" });
      setLoading(false);
      toast.success("Identity verified ✓");
      onNext();
    } catch (e) {
      console.error(e);
      toast.error("Error updating profile");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-syne font-bold text-3xl text-[#0F172A]">
          Verify Identity
        </h2>
        <p className="text-[#64748B] mt-1">
          Quick eKYC — takes under 60 seconds
        </p>
      </div>
      <div>
        <label className="text-sm font-medium text-[#64748B] block mb-2">
          PAN Number
        </label>
        <input
          value={pan}
          onChange={(e) => validatePan(e.target.value)}
          placeholder="ABCDE1234F"
          className={cn("k-input", panValid === false && "border-red-400")}
          maxLength={10}
        />
        {panValid === false && (
          <p className="text-xs text-red-500 mt-1">
            Format: 5 letters, 4 digits, 1 letter (e.g. ABCDE1234F)
          </p>
        )}
        {panValid === true && (
          <p className="text-xs text-[#10B981] mt-1">✓ Valid PAN format</p>
        )}
      </div>
      <div>
        <label className="text-sm font-medium text-[#64748B] block mb-2">
          Selfie Verification
        </label>
        {selfie === "idle" && (
          <button
            onClick={takeSelfie}
            className="w-full h-36 k-card-sm border-2 border-dashed border-[#C7D2FE] flex flex-col items-center justify-center gap-2 hover:border-[#6366F1] transition-colors"
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6366F1"
              strokeWidth="1.5"
            >
              <circle cx="12" cy="8" r="3.5" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              <circle
                cx="12"
                cy="8"
                r="6"
                strokeDasharray="3 2"
                strokeWidth="1"
                stroke="#C7D2FE"
              />
            </svg>
            <span className="text-sm text-[#6366F1] font-medium">
              Take Selfie
            </span>
          </button>
        )}
        {selfie === "capturing" && (
          <div className="w-full h-36 k-card-sm flex items-center justify-center">
            <div className="spinner w-8 h-8" />
            <span className="ml-3 text-[#64748B]">Capturing...</span>
          </div>
        )}
        {selfie === "done" && (
          <div className="w-full h-36 k-card-sm bg-[#D1FAE5] border-[#10B981] flex flex-col items-center justify-center gap-2">
            <span className="text-4xl">🤳</span>
            <span className="text-[#065F46] font-semibold">Captured ✓</span>
          </div>
        )}
      </div>
      <button
        onClick={handleVerify}
        className="btn-primary w-full flex items-center justify-center gap-2"
        disabled={!panValid || selfie !== "done" || loading}
      >
        {loading ? (
          <>
            <span className="spinner-white w-4 h-4" /> Verifying...
          </>
        ) : (
          "Verify Identity →"
        )}
      </button>
    </div>
  );
}

// ─── Step 5: Platforms ────────────────────────────────────────
const earningsGuide: Record<string, string> = {
  zomato: "Open Zomato app → Earnings → This Week. Screenshot the total.",
  swiggy: "Open Swiggy Delivery app → My Earnings. View weekly summary.",
  zepto: "Zepto app → Profile → My Wallet. Export last 30 days.",
  blinkit:
    "Blinkit Partner app → Earnings → Weekly. The auto-import is faster.",
  amazon_flex: "Amazon Flex app → Earnings → History. Select date range.",
  flipkart_quick: "Ekart app → My Earnings. Share the PDF generated.",
};

function Step5({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [openGuide, setOpenGuide] = useState<string | null>(null);

  const toggle = (id: string) =>
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-syne font-bold text-3xl text-[#0F172A]">
          Select your platforms
        </h2>
        <p className="text-[#64748B] mt-1">
          We'll link earnings to calculate your baseline
        </p>
      </div>
      <div className="space-y-2">
        {PLATFORMS.map((p) => {
          const sel = selected.includes(p.id);
          return (
            <div key={p.id}>
              <button
                onClick={() => toggle(p.id)}
                className={cn(
                  "w-full k-card-sm flex items-center gap-3 transition-all interactive border-2",
                  sel ? "border-[#6366F1] bg-indigo-50" : "border-transparent",
                )}
              >
                <span className="text-2xl">{p.icon}</span>
                <div className="flex-1 text-left">
                  <div className="font-semibold text-[#0F172A] text-sm">
                    {p.label}
                  </div>
                </div>
                {sel && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenGuide(openGuide === p.id ? null : p.id);
                      }}
                      className="text-xs text-[#6366F1] flex items-center gap-0.5"
                    >
                      Earnings guide{" "}
                      {openGuide === p.id ? (
                        <ChevronUp size={12} />
                      ) : (
                        <ChevronDown size={12} />
                      )}
                    </button>
                    <div className="w-5 h-5 bg-[#6366F1] rounded-full flex items-center justify-center">
                      <Check size={12} className="text-white" />
                    </div>
                  </div>
                )}
              </button>
              {sel && openGuide === p.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="bg-[#EEF2FF] rounded-xl mx-1 px-4 py-3 text-sm text-[#4338CA]"
                >
                  {earningsGuide[p.id]}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
      <button
        onClick={async () => {
          const { user } = useAuthStore.getState();
          if (user) {
            try {
              await dbService.updateProfile(user.id, { platforms: selected as any });
            } catch (e) {
              console.error(e);
            }
          }
          onNext();
        }}
        className="btn-primary w-full"
        disabled={selected.length === 0}
      >
        Continue with {selected.length} platform
        {selected.length !== 1 ? "s" : ""} →
      </button>
    </div>
  );
}

// ─── Step 6: AA Consent ──────────────────────────────────────
const BANKS = [
  "SBI",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "Kotak Mahindra",
  "PNB",
  "Bank of Baroda",
  "Canara Bank",
  "Union Bank",
  "IndusInd Bank",
  "Yes Bank",
  "Federal Bank",
  "IDFC First Bank",
  "AU Small Finance",
  "Airtel Payments Bank",
];

function Step6({ onNext }: { onNext: () => void }) {
  const [bank, setBank] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"idle" | "linking" | "done">("idle");
  const [skipped, setSkipped] = useState(false);
  const filteredBanks = BANKS.filter((b) =>
    b.toLowerCase().includes(search.toLowerCase()),
  );

  const handleConnect = async () => {
    setStatus("linking");
    await new Promise((r) => setTimeout(r, 2000));
    setStatus("done");
    toast.success("Bank linked. Earnings data loading...");
  };

  const handleSkip = () => {
    setSkipped(true);
    toast("Conservative 15% adjustment applied", { icon: "⚠️" });
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-syne font-bold text-3xl text-[#0F172A]">
          AA Consent
        </h2>
        <p className="text-[#64748B] mt-1">
          Connect your bank for automatic earnings data
        </p>
      </div>
      {status === "done" ? (
        <div className="k-card-sm bg-[#D1FAE5] border-[#10B981] text-center py-8">
          <div className="text-4xl mb-2">✓</div>
          <div className="font-semibold text-[#065F46]">{bank} linked</div>
          <div className="text-sm text-[#059669] mt-1">
            Earnings data loading in the background...
          </div>
        </div>
      ) : (
        <>
          <div>
            <label className="text-sm font-medium text-[#64748B] block mb-2">
              Search bank
            </label>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Type bank name..."
              className="k-input mb-2"
            />
            <div className="max-h-44 overflow-y-auto k-card-sm p-2 space-y-0.5">
              {filteredBanks.map((b) => (
                <button
                  key={b}
                  onClick={() => {
                    setBank(b);
                    setSearch(b);
                  }}
                  className={cn(
                    "w-full text-left text-sm px-3 py-2 rounded-xl transition-colors",
                    bank === b
                      ? "bg-[#EEF2FF] text-[#6366F1] font-semibold"
                      : "text-[#64748B] hover:bg-[#F8FAFF]",
                  )}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleConnect}
            className="btn-primary w-full flex items-center justify-center gap-2"
            disabled={!bank || status === "linking"}
          >
            {status === "linking" ? (
              <>
                <span className="spinner-white w-4 h-4" /> Connecting...
              </>
            ) : (
              "Connect Bank via AA →"
            )}
          </button>
          <button
            onClick={handleSkip}
            className="text-sm text-[#64748B] w-full text-center hover:text-[#0F172A]"
          >
            Skip for now — use OCR upload instead
          </button>
          {skipped && (
            <div className="badge-amber w-full text-center py-2">
              ⚠️ Conservative 15% adjustment applied to your baseline
            </div>
          )}
        </>
      )}
      {(status === "done" || skipped) && (
        <button onClick={onNext} className="btn-primary w-full">
          Continue →
        </button>
      )}
    </div>
  );
}

// ─── Step 7: Plan ─────────────────────────────────────────────
function Step7({ onNext }: { onNext: () => void }) {
  const { tier, setTier } = usePolicyStore();
  const [howOpen, setHowOpen] = useState(false);
  const { data: pricingData, loading: pricingLoading } = useDynamicPricing('Bangalore_South');

  // Risk multiplier from API (0.8–1.3 typically)
  const riskMultiplier = pricingData
    ? Math.min(1.5, Math.max(0.7, pricingData.risk_score + 1))
    : 1

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-syne font-bold text-3xl text-[#0F172A]">
          Choose your shield
        </h2>
        <p className="text-[#64748B] mt-1">
          Recommended for Koramangala zone: <strong>Standard</strong>
        </p>
        {pricingData && (
          <div className={cn(
            "mt-2 flex items-center gap-2 text-xs px-3 py-2 rounded-xl border font-medium",
            pricingData.is_safe_zone
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : pricingData.risk_score > 0.6
                ? "bg-red-50 border-red-200 text-red-700"
                : "bg-amber-50 border-amber-200 text-amber-700"
          )}>
            {pricingData.is_safe_zone ? "⚡ Safe Zone — Hyper-local discount applied" : `⚠ Zone risk: ${Math.round(pricingData.risk_score * 100)}% · price adjusted`}
          </div>
        )}
        {pricingLoading && (
          <div className="mt-2 h-8 bg-[#F1F5F9] rounded-xl animate-pulse" />
        )}
      </div>
      <div className="space-y-3">
        {(Object.values(PLANS) as (typeof PLANS)[PlanTier][]).map((plan) => {
          const active = tier === plan.id;
          // Apply AI risk multiplier to the base price if data is available
          const aiPrice = pricingData
            ? Math.round(plan.basePrice * riskMultiplier / 10) * 10
            : plan.basePrice;
          const priceChanged = aiPrice !== plan.basePrice;

          return (
            <button
              key={plan.id}
              onClick={() => setTier(plan.id as PlanTier)}
              className={cn(
                "w-full k-card-sm text-left border-2 transition-all interactive p-5",
                active ? "border-[#6366F1] bg-indigo-50" : "border-transparent",
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-syne font-bold text-lg text-[#0F172A]">
                      {plan.label}
                    </span>
                    {"popular" in plan && plan.popular && (
                      <span className="badge-blue text-[10px]">
                        Most Popular
                      </span>
                    )}
                    {pricingData?.is_safe_zone && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold">
                        🏷 Discount
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[#64748B]">
                    {plan.coveragePercent}% coverage · max{" "}
                    {formatRupee(plan.maxWeeklyPayout)}/wk
                  </div>
                  <div className="text-xs text-[#F59E0B] mt-1 italic">
                    ✓ &quot;{plan.example}&quot;
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  {pricingLoading ? (
                    <div className="h-7 w-14 bg-[#E2E8F0] rounded animate-pulse" />
                  ) : (
                    <>
                      <div className="font-syne font-bold text-2xl text-[#0F172A]">
                        ₹{aiPrice}
                      </div>
                      {priceChanged && (
                        <div className="text-[10px] text-[#94A3B8] line-through">₹{plan.basePrice}</div>
                      )}
                    </>
                  )}
                  <div className="text-xs text-[#64748B]">/week</div>
                </div>
              </div>
              {active && (
                <div className="mt-2 w-5 h-5 bg-[#6366F1] rounded-full flex items-center justify-center ml-auto">
                  <Check size={12} className="text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
      <button
        onClick={() => setHowOpen(!howOpen)}
        className="text-sm text-[#6366F1] flex items-center gap-1 w-full"
      >
        How is my price calculated?{" "}
        {howOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {howOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="k-card-sm bg-[#EEF2FF] text-sm text-[#4338CA]"
        >
          {pricingData?.adjustment_applied
            ? pricingData.adjustment_applied
            : "Your price starts at the base rate, then we apply your zone's HLRG risk score (1–10). Higher-risk zones pay slightly more; lower-risk zones get a discount. The price shown is the AI-estimated average for your location."
          }
        </motion.div>
      )}
      <button onClick={onNext} className="btn-primary w-full">
        Continue with {PLANS[tier].label} →
      </button>
    </div>
  );
}

// ─── Step 8: UPI AutoPay ──────────────────────────────────────
const upiApps = [
  {
    id: "phonepe",
    label: "PhonePe",
    color: "#4F0E83",
    bg: "#F3E8FF",
    icon: "💜",
  },
  {
    id: "gpay",
    label: "Google Pay",
    color: "#2563EB",
    bg: "#EFF6FF",
    icon: "🟢",
  },
  { id: "bhim", label: "BHIM", color: "#0D7A36", bg: "#D1FAE5", icon: "🇮🇳" },
  { id: "paytm", label: "Paytm", color: "#00B9F1", bg: "#EFF6FF", icon: "💙" },
];

function Step8({ onNext }: { onNext: () => void }) {
  const { tier, weeklyPremium } = usePolicyStore();
  const [status, setStatus] = useState<
    Record<string, "idle" | "loading" | "done">
  >({});

  const handleUpi = async (id: string) => {
    const { user } = useAuthStore.getState();
    if (!user) return;

    setStatus((s) => ({ ...s, [id]: "loading" }));
    try {
      await Promise.all([
        dbService.recordAutoPayMandate(user.id, id),
        dbService.createPolicy(user.id, tier, weeklyPremium)
      ]);
      setStatus((s) => ({ ...s, [id]: "done" }));
      toast.success("AutoPay mandate created ✓");
      setTimeout(onNext, 600);
    } catch (e) {
      toast.error("Error setting up AutoPay");
      setStatus((s) => ({ ...s, [id]: "idle" }));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-syne font-bold text-3xl text-[#0F172A]">
          Set up AutoPay
        </h2>
        <p className="text-[#64748B] mt-1">
          Weekly ₹{weeklyPremium} deducted every Monday. Cancel anytime.
        </p>
      </div>
      <div className="k-card-sm bg-[#EEF2FF] text-center py-4">
        <div className="font-syne font-bold text-4xl text-[#1E1B4B]">
          ₹{weeklyPremium}
        </div>
        <div className="text-[#6366F1] text-sm">
          {PLANS[tier].label} Plan · every Monday
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {upiApps.map((app) => {
          const s = status[app.id] || "idle";
          return (
            <button
              key={app.id}
              onClick={() => handleUpi(app.id)}
              disabled={s !== "idle"}
              className={cn(
                "k-card-sm p-5 text-center transition-all interactive border-2",
                s === "done"
                  ? "border-[#10B981] bg-[#D1FAE5]"
                  : "border-transparent",
              )}
              style={{ background: s === "idle" ? app.bg : undefined }}
            >
              {s === "loading" ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="spinner w-5 h-5" />
                </div>
              ) : s === "done" ? (
                <div className="text-[#065F46] font-semibold text-sm">
                  ✓ Linked
                </div>
              ) : (
                <>
                  <div className="text-3xl mb-1">{app.icon}</div>
                  <div
                    className="font-semibold text-sm"
                    style={{ color: app.color }}
                  >
                    {app.label}
                  </div>
                </>
              )}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-center text-[#94A3B8]">
        Powered by NPCI · 100% secure · Cancel anytime
      </p>
    </div>
  );
}

// ─── Step 9: Confirmation ─────────────────────────────────────
function Step9() {
  const navigate = useNavigate();
  const { tier, weeklyPremium } = usePolicyStore();
  return (
    <div className="text-center space-y-6 relative">
      <ConfettiBurst />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 14, stiffness: 200, delay: 0.1 }}
        className="flex justify-center"
      >
        <div className="relative">
          <svg
            width="120"
            height="140"
            viewBox="0 0 48 56"
            fill="none"
            className="shield-glow-anim"
          >
            <path
              d="M24 2L4 10V26C4 37.4 12.8 48 24 51C35.2 48 44 37.4 44 26V10L24 2Z"
              fill="#6366F1"
            />
            <path
              d="M24 8L10 14.5V26C10 34.5 16.5 42.5 24 45C31.5 42.5 38 34.5 38 26V14.5L24 8Z"
              fill="rgba(255,255,255,0.15)"
            />
            <path
              d="M18 28L21.5 31.5L30 22"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="font-syne font-bold text-4xl text-[#0F172A]">
          You're Protected! 🎉
        </h2>
        <p className="text-[#64748B] font-devanagari text-xl mt-1">
          आपकी सुरक्षा शुरू हो गई है।
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="k-card text-left space-y-3"
      >
        {[
          { l: "Plan", v: PLANS[tier].label },
          { l: "Weekly premium", v: `₹${weeklyPremium} (next Monday)` },
          {
            l: "Coverage",
            v: `Up to ₹${PLANS[tier].maxWeeklyPayout.toLocaleString("en-IN")}/week`,
          },
          { l: "Earnings baseline", v: "₹740/day" },
        ].map(({ l, v }) => (
          <div key={l} className="flex justify-between text-sm">
            <span className="text-[#64748B]">{l}</span>
            <span className="font-mono font-semibold text-[#0F172A]">{v}</span>
          </div>
        ))}
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="k-card-sm bg-[#EEF2FF] text-sm text-[#4338CA]"
      >
        📱 Policy document sent to your WhatsApp · Start at 0 pts, earn{" "}
        <strong>+5 pts</strong> every week
      </motion.div>
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        onClick={() => navigate("/dashboard")}
        className="btn-primary w-full text-lg py-4"
      >
        Open My Dashboard →
      </motion.button>
    </div>
  );
}

// ─── Wizard Shell ─────────────────────────────────────────────
const STEPS = [
  "Verify Number",
  "Language",
  "Why KAVACH",
  "eKYC",
  "Platforms",
  "AA Consent",
  "Choose Plan",
  "AutoPay",
  "Protected!",
];

export default function Onboarding() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => {
    if (step > 0) setStep((s) => s - 1);
    else navigate("/");
  };

  const stepComponents: Record<number, React.ReactNode> = {
    0: <Step3 onNext={next} />,
    1: <Step1 onNext={next} />,
    2: <Step2 onNext={next} />,
    3: <Step4 onNext={next} />,
    4: <Step5 onNext={next} />,
    5: <Step6 onNext={next} />,
    6: <Step7 onNext={next} />,
    7: <Step8 onNext={next} />,
    8: <Step9 />,
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg-app)" }}
    >
      {/* Header */}
      <header
        className="px-6 py-4 flex items-center gap-4"
        style={{
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border-card)",
        }}
      >
        <button
          onClick={back}
          className="text-[#64748B] hover:text-[#0F172A] transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-1.5">
            <span>
              Step {step + 1} of {STEPS.length} — {STEPS[step]}
            </span>
            <span>{Math.round(((step + 1) / STEPS.length) * 100)}%</span>
          </div>
          <div className="h-1.5 bg-[#EEF2FF] rounded-full overflow-hidden">
            <motion.div
              animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="h-full bg-[#6366F1] rounded-full"
            />
          </div>
        </div>
        <KavachLogo size="sm" />
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.18 }}
            >
              {stepComponents[step]}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
