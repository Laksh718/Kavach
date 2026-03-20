# KAVACH Platform (Mobile + User Website + Admin Portal)

KAVACH (*कवच*, Sanskrit for armor) is an AI-powered parametric income protection platform for India’s delivery gig workers. This documentation now covers the full product surfaces:

- Worker Mobile App (React Native)
- User Website (React)
- Admin + Insurer Portal (React)
- ML + data pipeline architecture

This branch contributes the mobile application implementation, while the repository’s existing web surfaces provide the user website and admin operations portal in React.
---

## Inspiration

Every day, **12.7 million gig workers** in India — the invisible backbone of Zomato, Swiggy, Zepto, Blinkit, Amazon Flex, and Flipkart Quick — wake up without knowing if they'll earn anything that day. India's gig workforce stands at 12.7 million today and is projected to hit 23.5 million by 2029-30. 64% of this workforce is aged between 24 and 38.

The trigger for KAVACH was a single data point buried in a January 2026 thread by Zomato's CEO: the average delivery partner on Zomato worked just 38 days in the year and 7 hours per working day. That means monsoon rains, Delhi's AQI 400+ winters, or a flash flood don't just ruin a workday — they wipe out a disproportionate share of someone's already fragile monthly income. A worker earning ₹21,000/month loses ₹1,800-₹2,700 in a single severe weather week. With vehicle EMI, rent, and fuel consuming 90%+ of income, one bad weather event cascades into months of informal debt at 36% annualized interest.

Zomato and Blinkit together spent over ₹100 crore on insurance for delivery partners in 2025, covering accident up to ₹10 lakh, medical ₹1 lakh, and loss-of-pay up to ₹50,000. That sounds impressive until you realize: the loss-of-pay product still requires workers to file claims. In a country where 70% of gig workers who've tried insurance report having claims denied or ignored, "file a claim" is not a solution. It is a barrier disguised as one. We didn't need another insurance product. We needed a fundamentally different delivery mechanism: **automatic, parametric, and instant.**

KAVACH was born from that insight.

---

## What It Does

KAVACH is an **AI-powered parametric income protection platform** for India’s delivery gig workers. When verified external disruptions — heavy rainfall, severe AQI (>301), extreme heat (feels-like >46°C), flood alerts, or government-declared curfews — cause a measurable drop in a worker’s earnings, KAVACH **automatically sends a UPI payout in under 4 minutes.**

- Zero claim form
- Zero call center
- Zero waiting period

### Product Stack

- **Worker Mobile App (React Native, Android-first):**
  - OTP onboarding, eKYC flow scaffolding, platform selection, earnings upload flow, AA consent flow, plan selection, UPI setup, dashboard/tabs, disruption and payout journey.
  - Designed for fast daily engagement (zone safety, earnings vs baseline, forecast, TrustKarma).

- **User Website (React):**
  - Public-facing product experience for workers and partners.
  - Product communication, onboarding entry points, plan communication, trust/transparency messaging.
  - Foundation for multilingual UX and lightweight acquisition funnel.

- **Admin + Insurer Portal (React):**
  - Real-time operations, disruption management, fraud review queue, actuarial views, payout monitoring, and IRDAI-aligned audit trail.
  - Operational controls for trigger events and payout lifecycle visibility.

- **AI/ML engine (integrated architecture):**
  - Disruption Model (RandomForestClassifier)
  - Earnings Baseline Model (XGBRegressor)
  - Fraud Detection Engine (IsolationForest + graph signals)

- **Business model:**
  - B2B2C MGA under IRDAI sandbox pathway
  - Weekly pricing ₹350-₹700 via UPI AutoPay (Starter, Standard, Shield)
  - Portable protection across multiple platforms

- **Data innovation:**
  - RBI Account Aggregator framework used to reconstruct earnings from consented bank transaction entries without requiring gig-platform earnings APIs.
---

## Technology Stack (By Surface)

### Mobile App

- React Native (Expo, TypeScript)
- React Navigation (Native Stack + Bottom Tabs)
- Zustand (client state)
- React Query (server-state foundation)
- Hermes-compatible setup
- Design system aligned to KAVACH spec:
  - warm cream backgrounds
  - royal blue primary
  - DM Sans + DM Mono
  - rounded/pill components
  - flat card system

### User Website (React)

- React + TypeScript
- Route-based public pages for awareness, trust messaging, and conversion funnel
- Shared visual language with mobile for brand continuity

### Admin + Insurer Portal (React)

- React + TypeScript dashboards
- Operational modules for disruption monitoring, payout controls, fraud review, and analytics
- Extensible data views for actuarial and compliance workflows

### Platform & Services

- Node.js/TypeScript service layer (event-driven design)
- Python ML services for scoring and trigger intelligence
- Data stack direction: PostgreSQL + MongoDB + Redis + streaming layer
- India data residency alignment (ap-south-1 orientation)

---

## How We Built It

We treated this as a production-intent product, not a visual-only demo.

- Regulatory-first architecture research (IRDAI Sandbox, SS Code 2020 draft rules, AA framework, Karnataka gig legislation)
- Weather + risk data strategy centered on WeatherUnion + IMD + CPCB + alerts
- ML architecture designed for sparse worker data reality (population model + personal deviation approach)
- Mobile-first UX language tuned for worker trust and low-friction comprehension
- Web + admin experiences in React to ensure operational transparency and scale-ready workflows
- Infrastructure direction for India data residency and event-driven operations

### End-to-End Product Flow

1. Worker onboarding (mobile)
2. Identity + baseline setup (mobile + OCR + AA consent)
3. Risk monitoring + disruption scoring (ML services)
4. Shortfall detection + payout decisioning (rules + model outputs)
5. Instant payout experience + transparency screens (mobile)
6. Operational supervision, overrides, and analytics (admin portal)

---

## Challenges We Ran Into

- No public gig-platform earnings APIs (moved to AA framework)
- Individual LSTM infeasible with sparse worker data (moved to two-stage XGBoost approach)
- National threshold fallacy for rainfall triggers (moved to zone-level calibration)
- Moral hazard tradeoff (shortfall-proportional payout design)
- Coordinated fraud risk in parametric flows (multi-layer + graph-based detection approach)

---

## Accomplishments We’re Proud Of

- Practical use of hyperlocal delivery-focused weather infrastructure
- Earnings verification path designed without platform lock-in
- Full product surface implemented across worker + operational contexts
- Worker-first UX language and multilingual direction
- Portable, platform-agnostic protection experience

### Documentation & Research

- 📄 [Full Product Requirements Document (PRD)](https://drive.google.com/file/d/1XCZU1e34WegmuRa1ah7Z9s_VCgse0-0U/view?usp=sharing)
- 🔬 [KAVACH Research & Critical Review Document](https://drive.google.com/file/d/1qf54FBEescZjVoFiJOIy6ze0zAg8Au5e/view?usp=drive_link)
- 🌐 [Live Product](https://kavach-beta.vercel.app)

---

## What We Learned

- Regulatory depth is a strategic advantage, not overhead
- In AI insurance, data architecture determines viability
- Transparency UX (showing payout math) is core trust infrastructure
- Sparse-data modeling demands pragmatic model choices

---

## What’s Next

- Bengaluru pilot with real worker cohorts
- Empirical threshold calibration by zone
- Fraud model tuning with live labeled signals
- SS Code compliance integration as platform distribution channel
- 9-city expansion and trigger broadening (e.g., AQI-heavy winter windows)
- Kavach Kitty phase (income continuity advance flow)

---

## Local Development (Mobile + Website + Admin)

### Prerequisites

- Node.js 18+
- npm 9+
- Git

### 1) Mobile App (this folder)

Path: `mobile-app/`

```bash
npm install
npm run web
```

If port 8081 is occupied, Expo auto-switches (commonly 8082).

Android/iOS:

```bash
npm run android
npm run ios
```

### 2) User Website (React)

Path: repository root web app (React workspace in main branch structure)

```bash
npm install
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

### 3) Admin Portal (React)

Path: same React workspace/pages module in repository main structure.

Typical run command:

```bash
npm run dev
```

### Environment Setup (Suggested)

- `VITE_API_BASE_URL` for web/admin API client
- `EXPO_PUBLIC_API_BASE_URL` for mobile runtime config
- `WEATHERUNION_API_KEY`, `AA_PROVIDER_KEY`, `RAZORPAY_KEY` for backend integrations

### Validation

- Type check (mobile):

```bash
npx tsc --noEmit
```

- Lint/test commands can be run per surface as configured in each workspace/package.

---

## Repository Scope & Surfaces

- Repo: https://github.com/Laksh718/Kavach.git
- User Website: React-based product surface for worker/partner communication
- Admin + Insurer Portal: React-based operations and governance interface
- Mobile App: React Native worker app with onboarding, risk, payout, and TrustKarma journeys

### Branch Notes

- `mobile-app-rn` / `mobile-app-rn-fix`: mobile app contribution branches
- `mobile-app-rn-fix` is the clean compare branch created from `origin/main`

### PR (Mobile Integration)

- https://github.com/Laksh718/Kavach/pull/new/mobile-app-rn-fix

---

## Detailed Feature Coverage

### Worker Mobile Journeys

- Splash, language selection, value proposition onboarding
- Mobile OTP, eKYC scaffold, PAN step
- Platform selection, earnings upload, AA consent flow
- Plan selection, UPI AutoPay setup, welcome activation
- Home (normal/disruption), live disruption, payout processing/received
- Protect, Earnings, Zones, Profile, TrustKarma, Claims, Notifications

### User Website Journeys (React)

- Product overview and trust messaging
- Worker-focused value communication and onboarding entry
- Plan-level understanding and disruption protection explanation
- Public information architecture aligned with low-trust insurance audiences

### Admin & Insurer Journeys (React)

- Real-time disruption event visibility
- Trigger score monitoring and payout queue observability
- Fraud review path with explainability support
- Operations and audit surfaces for governance/compliance

### Data & Intelligence

- Trigger intelligence via environmental and platform-side signals
- Baseline earnings estimation for fair shortfall computation
- Fraud/anomaly layers for ring detection and abuse mitigation
- Transparent payout math communication to workers

---

## Deployment & Scaling Notes

### Deployment Direction

- Mobile: Expo-managed build flow (web preview + device targets)
- Web/Admin: React build pipelines, CI/CD to managed hosting
- Backend + ML: service split for inference and orchestration

### Compliance Orientation

- IRDAI sandbox pathway alignment
- RBI AA framework-aligned data consent model
- DPDP-aware India data residency direction

### Scale Goals

- City-level rollout with zone calibration
- Seasonal trigger adaptation (rain/AQI/heat)
- Higher automation with reviewer-in-the-loop safeguards

---

## Vision

Rain will always come.
Workers shouldn’t have to fear it.
