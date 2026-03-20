// ──────────────────────────────────────────────
// Worker Types
// ──────────────────────────────────────────────
import type { City } from "@/types/zone.types";

export type Platform =
  | "zomato"
  | "swiggy"
  | "zepto"
  | "blinkit"
  | "amazon_flex"
  | "flipkart_quick";
export type Language = "en" | "hi" | "ta" | "te" | "bn" | "kn";
export type KYCStatus = "pending" | "verified" | "failed";
export type PolicyStatus = "active" | "paused" | "suspended" | "lapsed";
export type PlanTier = "starter" | "standard" | "shield";
export type TrustKarmaTier =
  | "base"
  | "silver"
  | "gold"
  | "platinum"
  | "champion";

export interface Worker {
  id: string;
  mobile: string;
  name: string;
  city: City;
  platforms: Platform[];
  kycStatus: KYCStatus;
  language: Language;
  createdAt: string;
}

export interface Policy {
  id: string;
  workerId: string;
  tier: PlanTier;
  status: PolicyStatus;
  weeklyPremium: number;
  basePremium: number;
  coveragePercent: number;
  maxWeeklyPayout: number;
  startDate: string;
  nextRenewalDate: string;
  pausesUsedThisYear: number;
}

export interface EarningsBaseline {
  workerId: string;
  platformId: Platform;
  dailyExpected: number;
  thirtyDayAverage: number;
  deviationFactor: number;
  lastUpdated: string;
  source: "aa_framework" | "ocr_provisional";
}
