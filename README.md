# KAVACH Mobile App (React Native)

KAVACH (*कवच*, Sanskrit for armor) is an AI-powered parametric income protection platform for India’s delivery gig workers. This repository branch contains the **mobile app** implementation built with React Native + TypeScript + Expo.

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

- **Worker Mobile App (this branch):**
  - OTP onboarding, eKYC flow scaffolding, platform selection, earnings upload flow, AA consent flow, plan selection, UPI setup, dashboard/tabs, disruption and payout journey.
  - Designed for fast daily engagement (zone safety, earnings vs baseline, forecast, TrustKarma).

- **Admin + Insurer Web Dashboard (existing branch in main repo):**
  - Real-time operations, disruption management, fraud review queue, actuarial views, IRDAI-aligned audit trail.

- **AI/ML engine (integrated architecture):**
  - Disruption Model (RandomForestClassifier)
  - Earnings Baseline Model (XGBRegressor)
  - Fraud Detection Engine (IsolationForest + graph signals)

- **Business model:**
  - B2B2C MGA under IRDAI sandbox pathway
  - Weekly pricing ₹350–₹700 via UPI AutoPay
  - Portable protection across multiple platforms

- **Data innovation:**
  - RBI Account Aggregator framework used to reconstruct earnings from consented bank transaction entries without requiring gig-platform earnings APIs.

---

## Mobile Tech Stack (Implemented)

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

---

## How We Built It

We treated this as a production-intent product, not a visual-only demo.

- Regulatory-first architecture research (IRDAI Sandbox, SS Code 2020 draft rules, AA framework, Karnataka gig legislation)
- Weather + risk data strategy centered on WeatherUnion + IMD + CPCB + alerts
- ML architecture designed for sparse worker data reality (population model + personal deviation approach)
- Mobile-first UX language tuned for worker trust and low-friction comprehension
- Infrastructure direction for India data residency and event-driven operations

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

## Local Development (Mobile)

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Run on laptop (web demo)

```bash
npm run web
```

If port 8081 is occupied, Expo auto-switches to another port (commonly 8082).

### Run on Android/iOS

```bash
npm run android
npm run ios
```

---

## Current Branch Purpose

This branch is dedicated to the **mobile app implementation** so it can be merged alongside existing website/admin portal work in the main GitHub repository:

- Repo: https://github.com/Laksh718/Kavach.git
- Scope of this branch: React Native mobile app, flows, and mobile design system

---

## Vision

Rain will always come.
Workers shouldn’t have to fear it.
