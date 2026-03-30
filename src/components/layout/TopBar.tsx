"use client";

import { useState } from "react";
import {
  Clock,
  CalendarDays,
  MapPin,
  Cloud,
  Coins,
  CircleDot,
  Timer,
  Siren,
  CalendarCheck,
  Moon,
  Play,
  Loader,
  Globe,
  Sparkles,
} from "lucide-react";
import { worldState, resources, clocks, gamePhase, type GamePhase } from "@/data/placeholder";
import RestModal from "@/components/modals/RestModal";

const phaseConfig: Record<GamePhase, { label: string; icon: typeof Play; color: string }> = {
  player_action: { label: "Your Turn", icon: Play, color: "var(--color-gold)" },
  resolution: { label: "Rolling...", icon: Sparkles, color: "var(--color-purple-light)" },
  world_response: { label: "Responding", icon: Loader, color: "var(--color-mana)" },
  world_tick: { label: "World Tick", icon: Globe, color: "var(--color-text-muted)" },
};

const clockTypeConfig = {
  threat: { icon: Siren, color: "var(--color-danger)", label: "Threat" },
  event: { icon: CalendarCheck, color: "var(--color-mana)", label: "Event" },
};

function ClockTooltip({
  clock,
}: {
  clock: (typeof clocks)[number];
}) {
  const config = clockTypeConfig[clock.type];

  return (
    <div
      className="absolute top-full left-1/2 -translate-x-1/2 z-50 pt-1"
      style={{ width: "220px" }}
    >
      <div
        className="rounded-lg p-3"
        style={{
          background: "var(--color-bg-surface)",
          border: "1px solid var(--color-border-strong)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.6), 0 0 12px var(--color-gold-glow)",
        }}
      >
        {/* Type badge */}
        <div className="flex items-center gap-1.5 mb-2">
          <config.icon size={12} style={{ color: config.color }} />
          <span
            className="text-[0.6rem] font-semibold uppercase tracking-wider"
            style={{ color: config.color }}
          >
            {config.label} Clock
          </span>
        </div>

        {/* Name */}
        <p
          className="text-xs font-semibold mb-1"
          style={{ fontFamily: "var(--font-heading)", color: "var(--color-pink-light)" }}
        >
          {clock.name}
        </p>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex gap-0.5">
            {Array.from({ length: clock.segments }).map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-sm border"
                style={{
                  borderColor: "var(--color-border-strong)",
                  background: i < clock.filled ? config.color : "var(--color-bg-deep)",
                  boxShadow: i < clock.filled ? `0 0 4px ${config.color}66` : "none",
                }}
              />
            ))}
          </div>
          <span className="stat-value text-[0.65rem]">
            {clock.filled}/{clock.segments}
          </span>
        </div>

        {/* Description */}
        <p className="text-[0.65rem] leading-relaxed text-[var(--color-text-secondary)]">
          {clock.description}
        </p>
      </div>
    </div>
  );
}

function ClockDisplay({
  clock,
}: {
  clock: (typeof clocks)[number];
}) {
  const [hovered, setHovered] = useState(false);
  const config = clockTypeConfig[clock.type];

  return (
    <div
      className="relative flex items-center gap-2 cursor-default"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <config.icon size={13} style={{ color: config.color }} />
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
                  ? config.color
                  : "var(--color-bg-deep)",
              boxShadow:
                i < clock.filled
                  ? `0 0 4px ${config.color}66`
                  : "none",
            }}
          />
        ))}
      </div>
      {hovered && <ClockTooltip clock={clock} />}
    </div>
  );
}

export default function TopBar() {
  const [restOpen, setRestOpen] = useState(false);
  const phase = phaseConfig[gamePhase];
  const PhaseIcon = phase.icon;

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

      {/* Center — Phase + Clocks + Rest */}
      <div className="flex items-center gap-5">
        {/* Phase Indicator */}
        <div
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-full"
          style={{
            background: `${phase.color}15`,
            border: `1px solid ${phase.color}33`,
          }}
        >
          <PhaseIcon size={11} style={{ color: phase.color }} />
          <span className="text-[0.6rem] font-semibold" style={{ color: phase.color }}>
            {phase.label}
          </span>
        </div>

        {clocks.map((c) => (
          <ClockDisplay key={c.name} clock={c} />
        ))}

        {/* Rest Button */}
        <button
          onClick={() => setRestOpen(true)}
          className="flex items-center gap-1 px-2 py-0.5 rounded-full cursor-pointer transition-all duration-150"
          style={{
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text-muted)",
          }}
          title="Rest"
        >
          <Moon size={11} />
          <span className="text-[0.6rem]">Rest</span>
        </button>
      </div>

      {/* Rest Modal */}
      {restOpen && <RestModal onClose={() => setRestOpen(false)} />}

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
