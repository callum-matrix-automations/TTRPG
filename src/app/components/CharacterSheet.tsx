"use client";

import { Heart, Shield, Zap, Footprints, Star } from "lucide-react";
import { playerCharacter } from "@/data/placeholder";

function StatBlock({
  label,
  score,
  mod,
}: {
  label: string;
  score: number;
  mod: number;
}) {
  return (
    <div
      className="flex flex-col items-center p-2 rounded-lg"
      style={{
        background: "var(--color-bg-elevated)",
        border: "1px solid var(--color-border)",
      }}
    >
      <span className="text-[0.6rem] font-semibold tracking-wider text-[var(--color-text-muted)] uppercase">
        {label}
      </span>
      <span className="stat-value text-lg leading-none mt-1">{score}</span>
      <span
        className="text-xs mt-0.5 px-1.5 rounded"
        style={{
          background: "var(--color-gold-subtle)",
          color: "var(--color-gold-light)",
        }}
      >
        {mod >= 0 ? `+${mod}` : mod}
      </span>
    </div>
  );
}

export default function CharacterSheet() {
  const pc = playerCharacter;
  const hpPercent = (pc.hp.current / pc.hp.max) * 100;
  const xpPercent = (pc.xp.current / pc.xp.next) * 100;

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <Star size={14} className="text-[var(--color-gold)]" />
        Character
      </div>
      <div className="panel-content space-y-3">
        {/* Name & Level */}
        <div className="text-center">
          <h3 className="text-base font-bold gold-glow leading-tight">
            {pc.name}
          </h3>
          <p className="text-[0.7rem] text-[var(--color-text-secondary)]">
            Level {pc.level} {pc.race} {pc.class}
          </p>
        </div>

        {/* HP Bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <Heart size={12} className="text-[var(--color-danger)]" />
              <span className="text-[0.65rem] text-[var(--color-text-secondary)]">
                HP
              </span>
            </div>
            <span className="stat-value text-xs">
              {pc.hp.current}/{pc.hp.max}
            </span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{
                width: `${hpPercent}%`,
                background: `linear-gradient(90deg, var(--color-danger), #f87171)`,
                boxShadow: "0 0 6px rgba(239, 68, 68, 0.4)",
              }}
            />
          </div>
        </div>

        {/* XP Bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <Star size={12} className="text-[var(--color-xp)]" />
              <span className="text-[0.65rem] text-[var(--color-text-secondary)]">
                XP
              </span>
            </div>
            <span className="stat-value text-xs">
              {pc.xp.current.toLocaleString()}/{pc.xp.next.toLocaleString()}
            </span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{
                width: `${xpPercent}%`,
                background: `linear-gradient(90deg, var(--color-xp), #c4b5fd)`,
                boxShadow: "0 0 6px rgba(167, 139, 250, 0.4)",
              }}
            />
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="flex justify-between gap-2">
          <div className="card flex-1 flex flex-col items-center py-1.5">
            <Shield size={14} className="text-[var(--color-mana)]" />
            <span className="stat-value text-sm">{pc.ac}</span>
            <span className="text-[0.55rem] text-[var(--color-text-muted)]">
              AC
            </span>
          </div>
          <div className="card flex-1 flex flex-col items-center py-1.5">
            <Zap size={14} className="text-[var(--color-gold)]" />
            <span className="stat-value text-sm">+{pc.initiative}</span>
            <span className="text-[0.55rem] text-[var(--color-text-muted)]">
              Init
            </span>
          </div>
          <div className="card flex-1 flex flex-col items-center py-1.5">
            <Footprints size={14} className="text-[var(--color-success)]" />
            <span className="stat-value text-sm">{pc.speed}</span>
            <span className="text-[0.55rem] text-[var(--color-text-muted)]">
              Speed
            </span>
          </div>
        </div>

        {/* Ability Scores */}
        <div>
          <h4 className="text-[0.65rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
            Abilities
          </h4>
          <div className="grid grid-cols-3 gap-1.5">
            {Object.entries(pc.stats).map(([key, val]) => (
              <StatBlock key={key} label={key} score={val.score} mod={val.mod} />
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <h4 className="text-[0.65rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
            Skills
          </h4>
          <div className="space-y-1">
            {pc.skills.map((skill) => (
              <div
                key={skill.name}
                className="flex items-center justify-between py-0.5 px-2 rounded text-xs"
                style={{ background: "var(--color-bg-elevated)" }}
              >
                <div className="flex items-center gap-1.5">
                  {skill.expertise && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />
                  )}
                  {skill.proficient && !skill.expertise && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-purple-light)]" />
                  )}
                  {!skill.proficient && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-bg-deep)]" />
                  )}
                  <span className="text-[var(--color-text-secondary)]">
                    {skill.name}
                  </span>
                </div>
                <span className="stat-value text-xs">
                  {skill.mod >= 0 ? `+${skill.mod}` : skill.mod}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div>
          <h4 className="text-[0.65rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
            Appearance
          </h4>
          <div className="space-y-1 text-[0.7rem] text-[var(--color-text-secondary)]">
            {Object.entries(pc.appearance).map(([key, val]) => (
              <p key={key}>
                <span className="text-[var(--color-pink-dim)] capitalize">
                  {key}:
                </span>{" "}
                {val}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
