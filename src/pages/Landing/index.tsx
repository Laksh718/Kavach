import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldIcon } from "@/components/shared/ShieldIcon";
import { RupeeCounter } from "@/components/shared/RupeeCounter";
import { KavachLogo } from "@/components/shared/KavachLogo";
import { PLANS } from "@/constants/plans";
import { CITIES } from "@/constants/cities";
import { formatRupee } from "@/utils/formatRupee";

// ─── Rain Animation ─────────────────────────────────────────
function RainEffect() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const drops: HTMLDivElement[] = [];
    const count = 80;

    for (let i = 0; i < count; i++) {
      const drop = document.createElement("div");
      drop.className = "rain-drop";
      const height = 15 + Math.random() * 35;
      const duration = 0.8 + Math.random() * 1.4;
      const left = Math.random() * 100;
      const delay = Math.random() * 2;

      drop.style.cssText = `
        left: ${left}%;
        height: ${height}px;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        opacity: ${0.3 + Math.random() * 0.4};
      `;
      container.appendChild(drop);
      drops.push(drop);
    }

    return () => drops.forEach((d) => d.remove());
  }, []);

  return <div ref={containerRef} className="rain-container" />;
}

// ─── Payout Examples ─────────────────────────────────────────
const payoutExamples = [
  { event: "Heavy rain in Mumbai", payout: "₹840", time: "4 min", type: "🌧️" },
  { event: "Delhi AQI Severe", payout: "₹588", time: "automatic", type: "😷" },
  {
    event: "Chennai cyclone warning",
    payout: "₹1,260",
    time: "zero paperwork",
    type: "🌊",
  },
];

// ─── Hero Section ────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0E1A] via-[#0D1225] to-[#080C18]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.12),transparent_60%)]" />
      <RainEffect />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left: Text */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-blue-300 font-dm">
                Now live in 9 cities
              </span>
            </div>

            <h1 className="font-syne font-bold text-5xl lg:text-7xl text-white leading-[1.05] mb-4">
              Rain day?
              <br />
              <span className="text-gradient-blue">Still get paid.</span>
            </h1>

            <p className="font-devanagari text-2xl text-amber-400 mb-6 font-medium">
              बारिश हो या धूप, कमाई बंद नहीं।
            </p>

            <p className="text-gray-400 text-lg font-dm mb-8 max-w-lg">
              AI-powered income protection for Zomato, Swiggy & Zepto delivery
              partners. Money arrives before your shift ends.
            </p>

            {/* Payout examples */}
            <div className="space-y-3 mb-10">
              {payoutExamples.map((ex, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.15 }}
                  className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3"
                >
                  <span className="text-2xl">{ex.type}</span>
                  <div className="flex-1">
                    <span className="text-gray-300 text-sm font-dm">
                      {ex.event}?
                    </span>
                  </div>
                  <span className="font-mono font-bold text-amber-400">
                    → {ex.payout}
                  </span>
                  <span className="text-gray-500 text-xs">in {ex.time}</span>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/onboard"
                className="btn-kavach-primary px-8 py-4 text-lg font-semibold text-center rounded-2xl"
              >
                Start Protection — ₹350/week
              </Link>
              <a
                href="#how-it-works"
                className="px-8 py-4 text-lg font-dm text-gray-300 text-center rounded-2xl border border-white/20 hover:border-white/40 hover:text-white transition-all"
              >
                See how it works ↓
              </a>
            </div>
          </motion.div>
        </div>

        {/* Right: Shield */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:flex flex-col items-center justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-3xl scale-150" />
            <ShieldIcon size={200} glowing />
          </div>
          <div className="mt-8 text-center">
            <div className="text-gray-400 text-sm font-dm mb-1">
              Average payout time
            </div>
            <div className="font-mono font-bold text-5xl text-white">
              4 <span className="text-2xl text-gray-400">min</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Platform logos */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/5 bg-[#0A0E1A]/80 backdrop-blur-sm py-6">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-gray-600 text-xs uppercase tracking-widest mb-4 font-dm">
            Works with your platform
          </p>
          <div className="flex justify-center items-center gap-8 flex-wrap">
            {[
              "🍕 Zomato",
              "🍜 Swiggy",
              "⚡ Zepto",
              "🛒 Blinkit",
              "📦 Amazon Flex",
              "🛍️ Flipkart Quick",
            ].map((p) => (
              <span
                key={p}
                className="text-gray-400 text-sm font-dm hover:text-white transition-colors"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    {
      icon: "🛡️",
      step: "01",
      title: "Enroll in 3 minutes",
      desc: "Mobile OTP + eKYC + UPI AutoPay. Plans from ₹350/week. Cancel anytime.",
    },
    {
      icon: "🌧️",
      step: "02",
      title: "Disruption detected",
      desc: "AI monitors weather, AQI, floods across your delivery zone 24/7.",
    },
    {
      icon: "💸",
      step: "03",
      title: "Money arrives",
      desc: "UPI payout in 4 minutes. No claim form. No call. No waiting.",
    },
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#0A0E1A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-syne font-bold text-4xl lg:text-5xl text-white mb-4">
            How KAVACH works
          </h2>
          <p className="text-gray-400 text-lg font-dm">
            Automatic. Instant. Zero paperwork.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-600/0 via-blue-600/50 to-blue-600/0" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="kavach-card p-8 text-center relative"
            >
              <div className="absolute -top-3 left-6 bg-blue-600 text-white text-xs font-mono font-bold px-3 py-1 rounded-full">
                {step.step}
              </div>
              <div className="text-5xl mb-6">{step.icon}</div>
              <h3 className="font-syne font-bold text-xl text-white mb-3">
                {step.title}
              </h3>
              <p className="text-gray-400 font-dm leading-relaxed">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ─────────────────────────────────────────────────
function PricingSection() {
  return (
    <section className="py-24 bg-[#080C18]" id="pricing">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-4">
          <h2 className="font-syne font-bold text-4xl lg:text-5xl text-white mb-4">
            Simple pricing. Personalized for you.
          </h2>
          <p className="text-gray-400 font-dm">
            Your actual price is AI-personalized based on your zone risk.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-12">
          {Object.values(PLANS).map((plan) =>
            (() => {
              const isPopular = "popular" in plan && !!plan.popular;
              return (
                <motion.div
                  key={plan.id}
                  whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
                  className={`kavach-card p-8 relative ${isPopular ? "border-glow-blue" : ""}`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-6">
                    <div
                      className="text-sm font-semibold uppercase tracking-wider mb-1"
                      style={{ color: plan.color }}
                    >
                      {plan.label}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-mono font-bold text-4xl text-white">
                        ₹{plan.basePrice}
                      </span>
                      <span className="text-gray-400 font-dm">/week</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Coverage</span>
                      <span className="font-mono text-white font-semibold">
                        {plan.coveragePercent}% of loss
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Max weekly</span>
                      <span className="font-mono text-white font-semibold">
                        {formatRupee(plan.maxWeeklyPayout)}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 bg-white/5 rounded-xl p-3 mt-4">
                      <span className="text-amber-400 text-sm">✓</span>
                      <span className="text-sm text-gray-300 font-dm italic">
                        &quot;{plan.example}&quot;
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/onboard"
                    className={`w-full block text-center py-3 rounded-xl font-semibold transition-all ${
                      isPopular
                        ? "btn-kavach-primary"
                        : "border border-white/20 text-white hover:border-white/40 hover:bg-white/5"
                    }`}
                  >
                    Get {plan.label}
                  </Link>
                </motion.div>
              );
            })(),
          )}
        </div>
      </div>
    </section>
  );
}

// ─── City Section ─────────────────────────────────────────────
function CitySection() {
  return (
    <section className="py-24 bg-[#0A0E1A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-syne font-bold text-4xl text-white mb-4">
            9 Cities, Live Now
          </h2>
          <p className="text-gray-400 font-dm">
            Hyperlocal weather monitoring in every delivery zone
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          {CITIES.map((city, i) => (
            <motion.div
              key={city.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="kavach-card p-5"
            >
              <div className="font-syne font-bold text-white text-lg mb-2">
                {city.label}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {city.risks.map((risk) => (
                  <span
                    key={risk}
                    className="text-xs bg-blue-500/10 border border-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full"
                  >
                    {risk}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Stats Section ────────────────────────────────────────────
function StatsSection() {
  const stats = [
    { value: 4, suffix: " min", label: "Payout speed" },
    { value: 0, prefix: "₹", label: "Claim forms required" },
    { value: 9, label: "Cities at launch" },
    { value: 5000000, prefix: "", suffix: "+", label: "Gig workers in India" },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-[#0D1225] to-[#0A0E1A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <RupeeCounter
                value={stat.value}
                prefix={stat.prefix ?? ""}
                suffix={stat.suffix}
                size="lg"
                className="text-blue-400"
              />
              <p className="text-gray-400 text-sm font-dm mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Persona Section ──────────────────────────────────────────
function PersonaSection() {
  const personas = [
    {
      name: "Rajan Kumar",
      city: "Bengaluru",
      platform: "🍕 Zomato",
      risk: "High (Koramangala floods)",
      value: "₹364/event",
      avatar: "👨🏾",
    },
    {
      name: "Suresh Patel",
      city: "Delhi-NCR",
      platform: "⚡ Zepto",
      risk: "High (AQI & heat)",
      value: "₹5,880/week",
      avatar: "👨🏽",
    },
    {
      name: "Kalyan Rao",
      city: "Hyderabad",
      platform: "🍜 Swiggy",
      risk: "Medium (Monsoon)",
      value: "₹420/event",
      avatar: "👨🏾",
    },
  ];

  return (
    <section className="py-24 bg-[#0A0E1A]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-syne font-bold text-4xl text-white mb-4">
            Built for real workers
          </h2>
          <p className="text-gray-400 font-dm">
            Like them, millions rely on daily earnings.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {personas.map((p, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              className="kavach-card p-6"
            >
              <div className="text-5xl mb-4">{p.avatar}</div>
              <div className="font-syne font-bold text-white text-xl mb-1">
                {p.name}
              </div>
              <div className="text-gray-400 text-sm font-dm mb-4">
                {p.city} · {p.platform}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Weekly risk</span>
                  <span className="text-orange-400">{p.risk}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">KAVACH value</span>
                  <span className="font-mono font-bold text-emerald-400">
                    {p.value}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t border-[#1F2937] bg-[#080C18] py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <KavachLogo size="sm" showTagline />
            <p className="text-gray-500 text-xs mt-3 font-dm leading-relaxed">
              IRDAI Regulatory Sandbox approved parametric insurance. Powered by
              AI weather data.
            </p>
          </div>
          {[
            {
              title: "Product",
              links: ["How It Works", "Pricing", "Cities", "Platforms"],
            },
            {
              title: "Company",
              links: ["About", "Careers", "IRDAI Sandbox", "Partners"],
            },
            {
              title: "Legal",
              links: [
                "Privacy Policy (DPDP)",
                "Terms of Service",
                "Grievance Redressal",
                "Cookie Policy",
              ],
            },
          ].map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold font-dm text-sm mb-3">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-500 text-sm font-dm hover:text-gray-300 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-[#1F2937] pt-6 text-center text-gray-600 text-xs font-dm">
          © 2026 KAVACH Technologies Pvt. Ltd. · CIN: U65999KA2024PTC000001 ·
          IRDAI Reg. Pending
        </div>
      </div>
    </footer>
  );
}

// ─── Landing Page ─────────────────────────────────────────────
export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0E1A]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <KavachLogo size="sm" />
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#how-it-works"
              className="text-gray-400 text-sm hover:text-white transition-colors font-dm"
            >
              How it works
            </a>
            <a
              href="#pricing"
              className="text-gray-400 text-sm hover:text-white transition-colors font-dm"
            >
              Pricing
            </a>
            <Link
              to="/admin"
              className="text-gray-400 text-sm hover:text-white transition-colors font-dm"
            >
              Admin
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="text-gray-300 text-sm font-dm hover:text-white"
            >
              Login
            </Link>
            <Link
              to="/onboard"
              className="btn-kavach-primary px-5 py-2.5 text-sm rounded-xl"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      <HeroSection />
      <HowItWorksSection />
      <PricingSection />
      <StatsSection />
      <CitySection />
      <PersonaSection />
      <Footer />
    </div>
  );
}
