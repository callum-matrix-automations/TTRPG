"use client";

import {
  Clock,
  CalendarDays,
  MapPin,
  Cloud,
  Coins,
  CircleDot,
  Timer,
} from "lucide-react";
import { worldState, resources, clocks } from "@/data/placeholder";

function ClockDisplay({
  clock,
}: {
  clock: { name: string; segments: number; filled: number };
}) {
  return (
    <div className="flex items-center gap-2">
      <Timer size={13} className="text-[var(--color-purple-light)]" />
      <span className="text-xs text-[var(--color-text-secondary)]">
        {clock.name}
      </span>
      <div className="flex gap-0.5">
        {Array.from({ length: clock.segments }).map((_, i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-sm border"
            style={{
              borderColor: "var(--color-border-strong)",
              background:
                i < clock.filled
                  ? "var(--color-gold)"
                  : "var(--color-bg-deep)",
              boxShadow:
                i < clock.filled
                  ? "0 0 4px var(--color-gold-glow)"
                  : "none",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function TopBar() {
  return (
    <div
      className="flex items-center justify-between px-4 h-10 shrink-0"
      style={{
        background:
          "linear-gradient(135deg, var(--color-bg-base) 0%, var(--color-bg-deep) 100%)",
        borderBottom: "1px solid var(--color-border)",
        boxShadow:
          "0 2px 12px rgba(0,0,0,0.5), 0 0 15px var(--color-gold-glow)",
      }}
    >
      {/* Left — Time & Date */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-1.5">
          <Clock size={13} className="text-[var(--color-gold)]" />
          <span className="stat-value text-sm">{worldState.time}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <CalendarDays size={13} className="text-[var(--color-gold)]" />
          <span className="text-xs text-[var(--color-text-secondary)]">
            {worldState.date}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={13} className="text-[var(--color-purple-light)]" />
          <span className="text-xs text-[var(--color-text-secondary)]">
            {worldState.location}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Cloud size={13} className="text-[var(--color-text-muted)]" />
          <span className="text-xs text-[var(--color-text-muted)]">
            {worldState.weather}
          </span>
        </div>
      </div>

      {/* Center — Clocks */}
      <div className="flex items-center gap-5">
        {clocks.map((c) => (
          <ClockDisplay key={c.name} clock={c} />
        ))}
      </div>

      {/* Right — Resources */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Coins size={13} className="text-[var(--color-gold)]" />
          <span className="stat-value text-sm">{resources.gold}</span>
          <span className="text-[0.6rem] text-[var(--color-text-muted)]">
            gp
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <CircleDot size={11} className="text-[var(--color-text-secondary)]" />
          <span className="stat-value text-xs">{resources.silver}</span>
          <span className="text-[0.6rem] text-[var(--color-text-muted)]">
            sp
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <CircleDot size={11} className="text-[var(--color-gold-dim)]" />
          <span className="stat-value text-xs">{resources.copper}</span>
          <span className="text-[0.6rem] text-[var(--color-text-muted)]">
            cp
          </span>
        </div>
      </div>
    </div>
  );
}
