"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type Tone = "default" | "gold" | "success" | "warning" | "danger" | "mana" | "purple" | "pink";
type Size = "sm" | "md" | "lg";
type Trend = "up" | "down" | "flat";

export type KpiCardProps = {
  label: string;
  value: string | number;
  delta?: number | string;
  trend?: Trend;
  caption?: string;
  icon?: React.ReactNode;
  tone?: Tone;
  size?: Size;
  compact?: boolean;
  className?: string;
  onClick?: () => void;
};

const toneMap: Record<Tone, { bg: string; border: string; value: string; deltaUp: string; deltaDown: string }> = {
  default: {
    bg: "var(--color-bg-elevated)", border: "var(--color-border)",
    value: "var(--color-text-primary)", deltaUp: "var(--color-success)", deltaDown: "var(--color-danger)",
  },
  gold: {
    bg: "rgba(218,165,32,0.08)", border: "rgba(218,165,32,0.25)",
    value: "var(--color-gold)", deltaUp: "var(--color-success)", deltaDown: "var(--color-danger)",
  },
  success: {
    bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.25)",
    value: "var(--color-success)", deltaUp: "var(--color-success)", deltaDown: "var(--color-danger)",
  },
  warning: {
    bg: "rgba(218,165,32,0.08)", border: "rgba(218,165,32,0.25)",
    value: "var(--color-gold)", deltaUp: "var(--color-success)", deltaDown: "var(--color-danger)",
  },
  danger: {
    bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)",
    value: "var(--color-danger)", deltaUp: "var(--color-success)", deltaDown: "var(--color-danger)",
  },
  mana: {
    bg: "rgba(96,165,250,0.08)", border: "rgba(96,165,250,0.25)",
    value: "var(--color-mana)", deltaUp: "var(--color-success)", deltaDown: "var(--color-danger)",
  },
  purple: {
    bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.25)",
    value: "var(--color-purple-light)", deltaUp: "var(--color-success)", deltaDown: "var(--color-danger)",
  },
  pink: {
    bg: "rgba(255,180,220,0.08)", border: "rgba(255,180,220,0.25)",
    value: "var(--color-pink)", deltaUp: "var(--color-success)", deltaDown: "var(--color-danger)",
  },
};

const sizeMap: Record<Size, { pad: string; label: string; value: string; caption: string }> = {
  sm: { pad: "p-2.5", label: "text-[0.55rem]", value: "text-base", caption: "text-[0.5rem]" },
  md: { pad: "p-3", label: "text-[0.6rem]", value: "text-lg", caption: "text-[0.55rem]" },
  lg: { pad: "p-4", label: "text-xs", value: "text-2xl", caption: "text-[0.6rem]" },
};

export function KpiCard({
  label, value, delta, trend = "flat", caption, icon, tone = "default", size = "sm", compact = false, className, onClick,
}: KpiCardProps) {
  const t = toneMap[tone];
  const s = sizeMap[size];
  const deltaValue = typeof delta === "number" ? `${delta > 0 ? "+" : ""}${delta}%` : delta;
  const isUp = trend === "up";
  const isDown = trend === "down";
  const DeltaIcon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;

  return (
    <div
      className={cn("relative overflow-hidden rounded-xl transition-all duration-150", s.pad, !compact && "min-h-[60px]", onClick && "cursor-pointer", className)}
      style={{ background: t.bg, border: `1px solid ${t.border}` }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2 relative">
        <div className="space-y-0.5">
          <div className={cn("font-medium", s.label)} style={{ color: "var(--color-text-muted)" }}>
            {label}
          </div>
          <div className={cn("font-semibold tracking-tight font-[var(--font-mono)]", s.value)} style={{ color: t.value }}>
            {typeof value === "number" ? value.toLocaleString() : value}
          </div>
          {caption && (
            <div className={cn(s.caption)} style={{ color: "var(--color-text-muted)" }}>
              {caption}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {typeof deltaValue !== "undefined" && (
            <div className="flex items-center gap-0.5 text-[0.6rem] font-medium" style={{ color: isUp ? t.deltaUp : isDown ? t.deltaDown : "var(--color-text-muted)" }}>
              <DeltaIcon size={12} />
              {deltaValue}
            </div>
          )}
          {icon && (
            <div className="rounded-full p-1" style={{ background: `${t.border}`, color: t.value }}>
              {icon}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
