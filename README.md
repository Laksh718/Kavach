# KAVACH

KAVACH is a Vite + React + TypeScript web app that simulates an income-protection platform for gig workers.

## What Is Included

- Worker dashboard with policy, payouts, zone map, and trust-karma flows
- Onboarding journey (language, OTP, eKYC, plan selection, autopay)
- Admin dashboard with live ops, disruptions, fraud queue, analytics, pipeline, and config pages
- Insurer portal with settlement data views
- Mocked services and Zustand state stores for local development

## Tech Stack

- React 18
- TypeScript 5
- Vite 5
- Tailwind CSS
- Framer Motion
- React Router
- Zustand
- React Query

## Plan Pricing (Updated)

- Starter: ₹350/week, up to ₹15,000 weekly payout
- Standard: ₹500/week, up to ₹25,000 weekly payout
- Shield: ₹700/week, up to ₹35,000 weekly payout

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build
```

4. Preview production build:

```bash
npm run preview
```

## Project Structure

- `src/pages` - route-level pages (Landing, Onboarding, Worker, Admin, Insurer)
- `src/components` - reusable UI components
- `src/constants` - plan/platform/city and rules configuration
- `src/services/mock` - mock datasets
- `src/store` - Zustand stores
- `src/router` - app routing
- `src/styles` - global styles and theme tokens

## Branching

Primary feature work was prepared on `frontend-setup` and then merged into `main`.
