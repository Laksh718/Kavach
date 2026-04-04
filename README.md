![WhatsApp Image 2026-04-05 at 12 00 27 AM](https://github.com/user-attachments/assets/25ea7b65-4c0c-45ab-8e63-71cbd2bde2d3)
# KAVACH Platform (Mobile + User Website + Admin Portal)

KAVACH (*कवच*, Sanskrit for armor) is an AI-powered parametric income protection platform for India's delivery gig workers. This documentation now covers the full product surfaces:

- Worker Mobile App (React Native)
- User Website (React)
- Admin + Insurer Portal (React)
- ML + data pipeline architecture
- Supabase backend (PostgreSQL + Edge Functions + Realtime)

This branch contributes the mobile application implementation, while the repository's existing web surfaces provide the user website and admin operations portal in React.

---

## Inspiration

Every day, **12.7 million gig workers** in India — the invisible backbone of Zomato, Swiggy, Zepto, Blinkit, Amazon Flex, and Flipkart Quick — wake up without knowing if they'll earn anything that day. India's gig workforce stands at 12.7 million today and is projected to hit 23.5 million by 2029-30. 64% of this workforce is aged between 24 and 38.

The trigger for KAVACH was a single data point buried in a January 2026 thread by Zomato's CEO: the average delivery partner on Zomato worked just 38 days in the year and 7 hours per working day. That means monsoon rains, Delhi's AQI 400+ winters, or a flash flood don't just ruin a workday — they wipe out a disproportionate share of someone's already fragile monthly income. A worker earning ₹21,000/month loses ₹1,800-₹2,700 in a single severe weather week. With vehicle EMI, rent, and fuel consuming 90%+ of income, one bad weather event cascades into months of informal debt at 36% annualized interest.

Zomato and Blinkit together spent over ₹100 crore on insurance for delivery partners in 2025, covering accident up to ₹10 lakh, medical ₹1 lakh, and loss-of-pay up to ₹50,000. That sounds impressive until you realize: the loss-of-pay product still requires workers to file claims. In a country where 70% of gig workers who've tried insurance report having claims denied or ignored, "file a claim" is not a solution. It is a barrier disguised as one. We didn't need another insurance product. We needed a fundamentally different delivery mechanism: **automatic, parametric, and instant.**

KAVACH was born from that insight.

---

## What It Does

KAVACH is an **AI-powered parametric income protection platform** for India's delivery gig workers. When verified external disruptions — heavy rainfall, severe AQI (>301), extreme heat (feels-like >46°C), flood alerts, or government-declared curfews — cause a measurable drop in a worker's earnings, KAVACH **automatically sends a UPI payout in under 4 minutes.**

- Zero claim form
- Zero call center
- Zero waiting period

### Product Stack

- **Worker Mobile App (React Native, Android-first):**
  - OTP onboarding, eKYC flow scaffolding, platform selection, earnings upload flow, AA consent flow, plan selection, UPI setup, dashboard/tabs, disruption and payout journey.
  - Designed for fast daily engagement (zone safety, earnings vs baseline, forecast, TrustKarma).

- **User Website (Vite + React + TypeScript):**
  - Public-facing product experience for workers and partners.
  - Product communication, onboarding entry points, plan communication, trust/transparency messaging.
  - Foundation for multilingual UX and lightweight acquisition funnel.
  - ML API integrated at `/kavach-ml` → `https://kavach-ml-y38n.onrender.com`

- **Admin + Insurer Portal (React):**
  - Real-time operations, disruption management, fraud review queue, actuarial views, payout monitoring, and IRDAI-aligned audit trail.
  - Operational controls for trigger events and payout lifecycle visibility.
  - Live all-city data via `useAdminAllCities()` hook polling all 9 cities simultaneously.

- **AI/ML engine (integrated architecture):**
  - Disruption Model (RandomForestClassifier)
  - Earnings Baseline Model (XGBRegressor)
  - Fraud Detection Engine (IsolationForest + graph signals)
  - Dynamic Premium Pricing (XGBoost Regressor, ±30% of base tier)

- **Backend (Supabase):**
  - PostgreSQL with PostGIS for HyperLocal Risk Grid (500m zone geometry)
  - Edge Functions for zero-touch claims pipeline, AA webhook, Razorpay AutoPay
  - Realtime subscriptions for live disruption banners, confetti on claim approval, zone risk updates
  - Row Level Security across all worker, admin, and insurer roles

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

- Vite + React + TypeScript
- Route-based public pages for awareness, trust messaging, and conversion funnel
- Shared visual language with mobile for brand continuity
- `canvas-confetti` for claim approval celebration
- Central ML hooks: `useRunLive`, `useAdminAllCities` (15-minute auto-polling)

### Admin + Insurer Portal (React)

- React + TypeScript dashboards
- Operational modules for disruption monitoring, payout controls, fraud review, and analytics
- Extensible data views for actuarial and compliance workflows
- Live city data table with sortable risk scores, replacing static mock rows

### Backend (Supabase)

- PostgreSQL 16 with PostGIS (HLRG zone geometry)
- Supabase Edge Functions (Deno, TypeScript)
- Supabase Realtime (postgres_changes + broadcast channels)
- Row Level Security (worker / admin / fraud_analyst / insurer roles)
- pg_cron for AutoPay runner, ML sync, AA data pull, materialized view refresh

### Platform & Services

- Python FastAPI ML services (hosted on Render) for scoring and trigger intelligence
- Razorpay AutoPay (premium deduction) + RazorpayX (UPI payouts)
- Finvu / OneMoney Account Aggregator integration (FIU registered)
- Firebase Cloud Messaging + Gupshup WhatsApp Business API for notifications
- India data residency alignment (ap-south-1 orientation)

---

## ML API — Live Endpoints

The ML backend is live at `https://kavach-ml-y38n.onrender.com` and proxied in the frontend at `/kavach-ml`. All components consume these through `kavachMlApi.ts`.

| Endpoint | Key Response Fields |
|---|---|
| `GET /run-live/{city}` | `city`, `parametric_signals.weather`, `parametric_signals.news`, `actuarial_pricing.risk_probability`, `actuarial_pricing.weekly_gross_premium`, `claims_management.{status, payout_inr, recommendation}` |
| `POST /predict/disruption` | `disruption` (0/1), `confidence` (0–1), `message` |
| `POST /predict/earnings` | `expected_earnings`, `base_prediction`, `deviation_factor`, `message` |
| `GET /insurance/dynamic-pricing/{city}` | `city`, `weekly_premium`, `coverage_hours`, `risk_score`, `is_safe_zone`, `adjustment_applied` |
| `POST /insurance/insurance-claim` | `is_eligible`, `status`, `reason`, `triggers_found[]`, `environment_data.{rain_mm, aqi_pm25, news}`, `suggested_premium` |

---

## Phase 2 — What We Built (Automation & Protection)

Phase 2 (March 21 – April 4) focused on the theme **"Protect Your Worker"** — wiring every ML API endpoint to the correct frontend component and building the full automation and protection layer.

### Deliverables

**Registration Process**
- Full Supabase-backed onboarding state machine (Steps 1–9)
- AA consent flow with Realtime subscription advancing the UI on `aa_consents.status = ACTIVE`
- eKYC via IDfy/Signzy/HyperVerge SDK (face match + PAN verification)
- UPI AutoPay mandate creation via Razorpay

**Insurance Policy Management**
- `policies` table with full lifecycle: `ACTIVE → PAUSED → SUSPENDED → LAPSED`
- AutoPay grace period logic (Monday deduction → Wednesday retry → Thursday WhatsApp warning → Friday suspension → Monday lapse)
- Policy pause feature (up to 2 weeks/year without TrustKarma penalty)
- Realtime `live_disruptions` channel driving the `LiveAlertBanner` component

**Dynamic Premium Calculation**
- `GET /insurance/dynamic-pricing/{city}` wired to Onboarding Step 7
- AI-adjusted prices shown when API returns data; graceful fallback to static `PLANS` constants on failure
- "How is my price calculated?" section shows real `adjustment_applied` multiplier from API response
- "Safe Zone Discount" badge shown when `is_safe_zone === true`
- `riskToShields(probability)` utility mapping ML risk probability → 1–5 shield display

**Claims Management**
- Zero-touch pipeline: `disruptions` INSERT → `claim-state-machine` Edge Function → fraud score → `APPROVED` / `MANUAL_REVIEW` → `payout-executor` → Razorpay UPI → `PAID`
- `canvas-confetti` fires in `PayoutsTab` when `is_eligible === true` (first time only, not on re-open)
- 5-step AI Proof Timeline stepper in `TrustReportModal` using real API fields (`triggers_found[]`, `environment_data`, `reason`, `status`)
- Admin fraud queue wired to live `claims` table (fraud_score ≥ 60 + status = MANUAL_REVIEW) with 4-hour SLA tracking

### Frontend Changes — File by File

**`src/hooks/useKavachML.ts`** *(New)*
- `useRunLive(city)` — polls `/run-live/{city}` every 15 minutes; returns `{data, loading, error, lastUpdated, refetch}`
- `useAdminAllCities()` — polls all 9 cities via `Promise.all`; returns live data array for the admin table

**`src/utils/formatRupee.ts`** *(Modified)*
- Added `formatINR` alias
- Added `riskToShields(probability)` — maps `risk_probability` → shield count (1–5)
- Added `getCurrentHourBucket()` — maps current hour to morning / afternoon / evening / night

**`src/pages/WorkerDashboard/HomeTab.tsx`** *(Modified)*
- 15-minute auto-poll via `useRunLive("Bangalore")` replaces one-shot `useEffect`
- `LiveAlertBanner` wired to `claims_management.status`; shows only when `!== "NO_TRIGGER"` with pulsing LIVE badge animation; Disruption Score from `actuarial_pricing.risk_probability × 100`
- `ZoneSafetyWidget` updated to shared hook data; shield count from real `risk_probability`
- 72-hour Forecast Strip — new component calling `predictDisruption` 3× labeled Today / Tomorrow / Day After
- SmartShiftPicker — new collapsible component (see below)

**`src/components/shared/SmartShiftPicker.tsx`** *(New)*
- Platform pill toggles: Zomato, Swiggy, Zepto, Blinkit, Amazon Flex, Flipkart Quick
- Time-of-day slider (Morning / Afternoon / Evening / Night → hour buckets 9 / 14 / 19 / 23)
- Predicted earnings display from `POST /predict/earnings`; debounced 500ms

**`src/pages/WorkerDashboard/ZoneMapTab.tsx`** *(Modified)*
- Live analysis now auto-runs on mount (previously required manual button press)
- "Run Live Analysis" button retained and also fires on page load
- "Last updated" timestamp shown under results

**`src/pages/WorkerDashboard/PayoutsTab.tsx`** *(Modified)*
- `canvas-confetti` fires on `is_eligible === true` (first time only)
- `TrustReportModal` enhanced with 5-step AI Proof Timeline stepper

**`src/pages/AdminDashboard/index.tsx`** *(Modified)*
- `useAdminAllCities()` hook replaces 4 static rows
- Last-updated timestamp below table header
- Sortable "Risk Score" column (click to sort descending)
- Loading skeleton while fetching

**`src/pages/Onboarding/index.tsx`** *(Modified — Step 7)*
- Calls `getDynamicPricing("Bangalore_South")` on mount
- AI-adjusted prices displayed; graceful fallback to static constants on API failure
- Real `adjustment_applied` multiplier shown in pricing explanation section
- Safe Zone Discount badge when `is_safe_zone === true`

### New Dependency

```bash
npm install canvas-confetti
npm install --save-dev @types/canvas-confetti
```

---

## Backend — Supabase Architecture

### Database Schema

| Table | Purpose |
|---|---|
| `worker_profiles` | Worker identity, UPI VPA, zone assignment, TrustKarma score |
| `aa_consents` | Account Aggregator consent handles and status |
| `worker_platforms` | Per-platform 30-day earnings baseline reconstructed from AA/UPI data |
| `zones` | HyperLocal Risk Grid — 500m cells with PostGIS geometry and weekly risk scores |
| `policies` | Active/paused/suspended/lapsed weekly policies per worker |
| `autopay_mandates` | Razorpay AutoPay mandate tracking |
| `disruptions` | Live and historical disruption events per zone |
| `claims` | Full claims lifecycle: `EVALUATING → APPROVED / MANUAL_REVIEW → PAID` |
| `fraud_investigations` | Manual review queue with SHAP features and 4-hour SLA deadlines |
| `trust_karma_ledger` | Append-only ledger; DB trigger auto-updates `worker_profiles.trust_karma_score` |
| `payments` | All financial transactions (premium deductions + claim payouts) |

### Edge Functions

| Function | Trigger | What It Does |
|---|---|---|
| `aa-webhook-handler` | HTTP POST from Finvu AA | Parses UPI credits, maps to platforms, upserts `worker_platforms` |
| `razorpay-autopay-webhook` | HTTP POST from Razorpay | Updates mandate status; suspends policy on payment failure |
| `kavach-ml-sync` | Cron every 15 min | Fetches ML `/admin/all-cities`, upserts `zones.risk_score`, manages `disruptions` |
| `claim-state-machine` | DB Webhook on `claims` INSERT | Calculates shortfall, calls ML fraud score, routes to APPROVED or MANUAL_REVIEW |
| `payout-executor` | DB Webhook on `claims` UPDATE (APPROVED) | Calls RazorpayX, inserts into `payments`, sets claim to PAID |
| `notification-router` | DB Webhook on `payments` / `disruptions` | Routes FCM push + Gupshup WhatsApp |

### Realtime Subscriptions

| Channel | Table | Filter | Drives |
|---|---|---|---|
| `claim_updates` | `claims` | `worker_id = eq.[uid]` | PayoutsTab — confetti on PAID |
| `live_disruptions` | `disruptions` | `zone_id = eq.[worker_zone]` | HomeTab — LiveAlertBanner |
| `aa_status` | `aa_consents` | `worker_id = eq.[uid]` | Onboarding Step 5 — AA consent advance |
| `zone_risk_broadcast` | broadcast | — | ZoneMapTab — instant color grid re-render |

### Zero-Touch Claims Pipeline

```
disruptions INSERT
    └─► claim-state-machine Edge Function
            ├─ Calculate shortfall (worker_platforms vs AA actuals)
            ├─ Call ML API → fraud score + SHAP features
            ├─ fraud_score < 60   →  claims.status = APPROVED
            │       └─► payout-executor  →  RazorpayX UPI  →  PAID
            │               └─► Realtime fires → confetti on client
            └─ fraud_score ≥ 60  →  claims.status = MANUAL_REVIEW
                    └─► Admin fraud queue (4-hour SLA)
```

### AutoPay Grace Period Logic

| Day | Action |
|---|---|
| Monday 8 AM | Primary AutoPay deduction attempt |
| Wednesday | Automatic retry on failure |
| Thursday | WhatsApp warning via Gupshup |
| Friday 00:01 | `policies.status = 'SUSPENDED'` |
| Following Monday | `policies.status = 'LAPSED'` |

---

## How We Built It

We treated this as a production-intent product, not a visual-only demo.

- Regulatory-first architecture research (IRDAI Sandbox, SS Code 2020 draft rules, AA framework, Karnataka gig legislation)
- Weather + risk data strategy centered on WeatherUnion + IMD + CPCB + alerts
- ML architecture designed for sparse worker data reality (population model + personal deviation approach)
- Mobile-first UX language tuned for worker trust and low-friction comprehension
- Web + admin experiences in React to ensure operational transparency and scale-ready workflows
- Supabase backend with zero-touch claims pipeline, idempotent payout execution, and real-time UI synchronization
- Infrastructure direction for India data residency and event-driven operations

### End-to-End Product Flow

1. Worker onboarding (mobile)
2. Identity + baseline setup (mobile + OCR + AA consent)
3. Risk monitoring + disruption scoring (ML services, 15-min polling)
4. Shortfall detection + payout decisioning (rules + model outputs)
5. Instant payout experience + transparency screens (mobile + confetti)
6. Operational supervision, overrides, and analytics (admin portal)

---

## Challenges We Ran Into

- No public gig-platform earnings APIs (moved to AA framework)
- Individual LSTM infeasible with sparse worker data (moved to two-stage XGBoost approach)
- National threshold fallacy for rainfall triggers (moved to zone-level calibration)
- Moral hazard tradeoff (shortfall-proportional payout design)
- Coordinated fraud risk in parametric flows (multi-layer + graph-based detection approach)
- ML API response shapes differing from spec — adapted frontend to real backend responses, not spec shapes

---

## Accomplishments We're Proud Of

- Practical use of hyperlocal delivery-focused weather infrastructure
- Earnings verification path designed without platform lock-in
- Full product surface implemented across worker + operational contexts
- Worker-first UX language and multilingual direction
- Portable, platform-agnostic protection experience
- End-to-end zero-touch claims pipeline from disruption trigger to UPI payout with real-time UI feedback
- AI-powered SmartShiftPicker helping workers maximize earnings before disruptions hit
- Dynamic premium pricing wired to live ML risk scores with safe-zone discounts

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
- Real ML API response shapes always take precedence over spec — adapt to what the backend actually returns

---

## What's Next

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
npm install canvas-confetti
npm install --save-dev @types/canvas-confetti
npm run dev
```

Build:

```bash
npm run build
npm run preview
```

### 3) Admin Portal (React)

Path: same React workspace/pages module in repository main structure.

```bash
npm run dev
```

### Environment Setup (Suggested)

- `VITE_API_BASE_URL` for web/admin API client
- `EXPO_PUBLIC_API_BASE_URL` for mobile runtime config
- `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` for Supabase client
- `WEATHERUNION_API_KEY`, `AA_PROVIDER_KEY`, `RAZORPAY_KEY` for backend integrations

### Verification Checklist (Phase 2)

After running locally, verify the Phase 2 integrations:

- Open `/dashboard` → confirm `LiveAlertBanner` reacts to live ML status with pulsing badge
- Open `/dashboard` → confirm `SmartShiftPicker` shows predicted earnings per platform + time slot
- Open `/dashboard/zone-map` → confirm live analysis auto-fires on mount
- Open `/dashboard/payouts` → expand a payout → click "View Verification Proof" → confirm 5-step AI Proof Timeline renders
- Open `/dashboard/payouts` → simulate APPROVED claim → confirm confetti fires (once only)
- Open `/admin/disruptions` → confirm table populates from all-cities API with sortable Risk Score column
- Open `/onboarding` → reach Step 7 → confirm AI-adjusted prices show (or graceful fallback to static plans)

### Validation

Type check (mobile):

```bash
npx tsc --noEmit
```

Web/admin build check:

```bash
npm run build
```

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
- Plan selection (AI-adjusted pricing via ML), UPI AutoPay setup, welcome activation
- Home (normal/disruption), live disruption banner with pulsing badge, payout processing/received
- SmartShiftPicker for earnings optimization, 72-hour forecast strip
- Protect, Earnings, Zones, Profile, TrustKarma, Claims, Notifications

### User Website Journeys (React)

- Product overview and trust messaging
- Worker-focused value communication and onboarding entry
- Plan-level understanding with AI-adjusted premium display and safe zone discount badges
- Public information architecture aligned with low-trust insurance audiences

### Admin & Insurer Journeys (React)

- Real-time disruption event visibility (live all-cities data, 15-min refresh)
- Risk score monitoring with sortable table and last-updated timestamp
- Fraud review queue with SHAP-based explainability and 4-hour SLA tracking
- Operations and audit surfaces for governance/compliance

### Data & Intelligence

- Trigger intelligence via environmental and platform-side signals (WeatherUnion, IMD, CPCB, NDMA)
- Baseline earnings estimation for fair shortfall computation (XGBoost population + deviation factor)
- Fraud/anomaly layers for ring detection and abuse mitigation (DAS + WBS + NFS)
- Transparent payout math communication to workers (AI Proof Timeline in claims)
- Dynamic premium pricing from live ML risk scores with zone-level safe-zone discounts

---

## Deployment & Scaling Notes

### Deployment Direction

- Mobile: Expo-managed build flow (web preview + device targets)
- Web/Admin: Vite + React build pipelines, CI/CD to managed hosting
- Backend + ML: Supabase (PostgreSQL + Edge Functions) + FastAPI on Render
- ML sync: Edge Function cron every 15 minutes keeping zone risk scores and disruptions current

### Compliance Orientation

- IRDAI sandbox pathway alignment
- RBI AA framework-aligned data consent model (Finvu / OneMoney as FIU partners)
- DPDP-aware India data residency direction (raw bank statements deleted within 24 hours; raw GPS within 60 seconds)

### Scale Goals

- City-level rollout with zone calibration
- Seasonal trigger adaptation (rain/AQI/heat)
- Higher automation with reviewer-in-the-loop safeguards
- Materialized views for insurer portal ensuring no query load on primary transactional tables

---

## Vision

Rain will always come.
Workers shouldn't have to fear it.


<img width="891" height="511" alt="image" src="https://github.com/user-attachments/assets/807c127a-8976-4e41-87a3-0d50ee81a8b9" />


<img width="880" height="498" alt="image" src="https://github.com/user-attachments/assets/e12a115d-c33d-4829-a650-029055f86e4b" />

