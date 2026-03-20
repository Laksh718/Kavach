import { motion, AnimatePresence } from "framer-motion";
import {
  CloudRain,
  Wind,
  Thermometer,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/utils/cn";
import { formatRupee } from "@/utils/formatRupee";

type DisruptionType = "rain" | "aqi" | "heat" | "flood" | "curfew";
type DisruptionStatus =
  | "detecting"
  | "confirmed"
  | "payout-processing"
  | "payout-complete";

interface DisruptionBannerProps {
  type: DisruptionType;
  zone: string;
  score: number;
  estimatedPayout?: number;
  status?: DisruptionStatus;
  className?: string;
}

const typeConfig: Record<
  DisruptionType,
  { icon: LucideIcon; label: string; emoji: string }
> = {
  rain: { icon: CloudRain, label: "Heavy Rain", emoji: "🌧️" },
  aqi: { icon: Wind, label: "AQI Severe", emoji: "😷" },
  heat: { icon: Thermometer, label: "Extreme Heat", emoji: "🌡️" },
  flood: { icon: AlertTriangle, label: "Flood Alert", emoji: "🌊" },
  curfew: { icon: AlertTriangle, label: "Curfew Active", emoji: "🚫" },
};

const statusConfig: Record<DisruptionStatus, { label: string; color: string }> =
  {
    detecting: { label: "Detecting...", color: "text-yellow-400" },
    confirmed: {
      label: "Confirmed — Calculating payout",
      color: "text-blue-400",
    },
    "payout-processing": {
      label: "Payout processing — ETA 4 minutes",
      color: "text-blue-300",
    },
    "payout-complete": { label: "Payout sent ✓", color: "text-emerald-400" },
  };

export function DisruptionBanner({
  type,
  zone,
  score,
  estimatedPayout,
  status = "confirmed",
  className,
}: DisruptionBannerProps) {
  const config = typeConfig[type];
  const statusConf = statusConfig[status];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -80, opacity: 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 300 }}
        className={cn(
          "disruption-banner rounded-xl p-4 bg-[#111827]",
          "border border-red-500/30",
          className,
        )}
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <Icon size={20} className="text-red-400" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-red-400">
                {config.emoji} {config.label} in {zone}
              </span>
              <span className="text-xs bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full font-mono">
                Score: {score}/100
              </span>
            </div>

            <p className={cn("text-xs", statusConf.color)}>
              {statusConf.label}
            </p>
          </div>

          {/* Payout */}
          {estimatedPayout && (
            <div className="text-right flex-shrink-0">
              <div className="text-xs text-gray-400 mb-0.5">Est. payout</div>
              <div className="font-mono font-bold text-emerald-400 text-lg leading-none">
                {formatRupee(estimatedPayout)}
              </div>
            </div>
          )}

          {/* Status indicator */}
          {status === "payout-complete" ? (
            <CheckCircle size={20} className="text-emerald-400 flex-shrink-0" />
          ) : (
            <motion.div
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <Clock size={20} className="text-blue-400 flex-shrink-0" />
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
