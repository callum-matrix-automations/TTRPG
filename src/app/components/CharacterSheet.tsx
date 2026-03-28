"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Heart, Star, BookOpen, EyeOff, Eye, Sparkles, ChevronDown, Info } from "lucide-react";
import { playerCharacter } from "@/data/placeholder";

// ── Collapsible Drawer ──
function Drawer({
  title,
  defaultOpen = false,
  count,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  count?: number;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between py-1.5 cursor-pointer"
        style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
      >
        <div className="flex items-center gap-2">
          <h4 className="text-[0.65rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
            {title}
          </h4>
          {count !== undefined && (
            <span
              className="badge"
              style={{ background: "var(--color-gold-subtle)", color: "var(--color-gold-light)" }}
            >
              {count}
            </span>
          )}
        </div>
        <ChevronDown
          size={14}
          className="transition-transform duration-200"
          style={{
            color: "var(--color-text-muted)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-200 ease-in-out"
        style={{
          maxHeight: open ? "2000px" : "0px",
          opacity: open ? 1 : 0,
        }}
      >
        <div className="pt-2 pb-1">
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Stat Block with Modifier Popup (portaled) ──
function StatBlock({
  label,
  score,
  mod,
  modifiers,
}: {
  label: string;
  score: number;
  mod: number;
  modifiers: { source: string; value: number }[];
}) {
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  // Position the popup at the top-right of the card
  useEffect(() => {
    if (!open || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPos({ top: rect.top, left: rect.right + 8 });
  }, [open]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        cardRef.current && !cardRef.current.contains(target) &&
        popupRef.current && !popupRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const total = modifiers.reduce((sum, m) => sum + m.value, 0);

  return (
    <>
      <div
        ref={cardRef}
        className="flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all duration-150"
        style={{
          background: "var(--color-bg-elevated)",
          border: `1px solid ${open ? "var(--color-border-strong)" : "var(--color-border)"}`,
          boxShadow: open ? "0 0 8px var(--color-gold-glow)" : "none",
        }}
        onClick={() => setOpen((p) => !p)}
      >
        <span className="text-[0.6rem] font-semibold tracking-wider text-[var(--color-text-muted)] uppercase">
          {label}
        </span>
        <span className="stat-value text-lg leading-none mt-1">{score}</span>
        <span
          className="text-xs mt-0.5 px-1.5 rounded"
          style={{ background: "var(--color-gold-subtle)", color: "var(--color-gold-light)" }}
        >
          {mod >= 0 ? `+${mod}` : mod}
        </span>
      </div>

      {/* Modifier Popup — portaled to body, fixed position above everything */}
      {open && createPortal(
        <div
          ref={popupRef}
          className="fixed rounded-lg p-3"
          style={{
            top: `${pos.top}px`,
            left: `${pos.left}px`,
            zIndex: 9999,
            width: "200px",
            background: "var(--color-bg-surface)",
            border: "1px solid var(--color-border-strong)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.6), 0 0 12px var(--color-gold-glow)",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-1.5 mb-2">
            <Info size={11} style={{ color: "var(--color-gold)" }} />
            <span
              className="text-[0.65rem] font-semibold uppercase tracking-wider"
              style={{ color: "var(--color-pink-light)", fontFamily: "var(--font-heading)" }}
            >
              {label} Breakdown
            </span>
          </div>

          {/* Modifier rows */}
          <div className="space-y-1 mb-2">
            {modifiers.map((m, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-2 py-1 rounded"
                style={{ background: "var(--color-bg-elevated)" }}
              >
                <span className="text-[0.6rem] text-[var(--color-text-secondary)]">{m.source}</span>
                <span className="stat-value text-[0.65rem]">
                  {i === 0 ? m.value : (m.value >= 0 ? `+${m.value}` : m.value)}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div
            className="flex items-center justify-between px-2 py-1 rounded"
            style={{
              background: "var(--color-gold-subtle)",
              border: "1px solid var(--color-border)",
            }}
          >
            <span className="text-[0.6rem] font-semibold text-[var(--color-text-gold)]">Total</span>
            <span className="stat-value text-xs">{total}</span>
          </div>

          {/* Modifier */}
          <div className="text-center mt-1.5">
            <span className="text-[0.55rem] text-[var(--color-text-muted)]">Modifier: </span>
            <span className="stat-value text-[0.65rem]">{mod >= 0 ? `+${mod}` : mod}</span>
            <span className="text-[0.55rem] text-[var(--color-text-muted)]"> = floor(({total} - 10) / 2)</span>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

// ── Main Component ──
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
        {/* Portrait + Name (always visible) */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-24 h-24 rounded-full overflow-hidden"
            style={{
              border: "2px solid var(--color-border-strong)",
              boxShadow: "0 0 16px var(--color-gold-glow)",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80"
              alt={`Portrait of ${pc.name}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center">
            <h3 className="text-base font-bold gold-glow leading-tight">{pc.name}</h3>
            <p className="text-[0.7rem] text-[var(--color-text-secondary)]">
              Level {pc.level} {pc.race} {pc.class}
            </p>
          </div>
        </div>

        {/* HP Bar (always visible) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <Heart size={12} className="text-[var(--color-danger)]" />
              <span className="text-[0.65rem] text-[var(--color-text-secondary)]">HP</span>
            </div>
            <span className="stat-value text-xs">{pc.hp.current}/{pc.hp.max}</span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{
                width: `${hpPercent}%`,
                background: "linear-gradient(90deg, var(--color-danger), #f87171)",
                boxShadow: "0 0 6px rgba(239, 68, 68, 0.4)",
              }}
            />
          </div>
        </div>

        {/* XP Bar (always visible) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <Star size={12} className="text-[var(--color-xp)]" />
              <span className="text-[0.65rem] text-[var(--color-text-secondary)]">XP</span>
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
                background: "linear-gradient(90deg, var(--color-xp), #c4b5fd)",
                boxShadow: "0 0 6px rgba(167, 139, 250, 0.4)",
              }}
            />
          </div>
        </div>

        {/* ── DRAWERS ── */}

        {/* Attributes (STR/DEX/CON/INT/WIS/CHA) */}
        <Drawer title="Attributes" defaultOpen>
          <div className="grid grid-cols-3 gap-1.5">
            {Object.entries(pc.stats).map(([key, val]) => (
              <StatBlock key={key} label={key} score={val.score} mod={val.mod} modifiers={val.modifiers} />
            ))}
          </div>
        </Drawer>

        {/* Skills */}
        <Drawer title="Skills" count={pc.skills.length}>
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
                  <span className="text-[var(--color-text-secondary)]">{skill.name}</span>
                </div>
                <span className="stat-value text-xs">
                  {skill.mod >= 0 ? `+${skill.mod}` : skill.mod}
                </span>
              </div>
            ))}
          </div>
        </Drawer>

        {/* Abilities (Class Features) */}
        <Drawer title="Abilities" count={pc.abilities.length}>
          <div className="space-y-1.5">
            {pc.abilities.map((ability) => (
              <div key={ability.name} className="card">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={11} className="text-[var(--color-purple-light)]" />
                    <span className="text-xs font-medium text-[var(--color-text-primary)]">
                      {ability.name}
                    </span>
                  </div>
                  <span
                    className="badge"
                    style={{
                      background: "var(--color-bg-deep)",
                      color: "var(--color-text-muted)",
                      border: "1px solid var(--color-border-subtle)",
                    }}
                  >
                    {ability.source}
                  </span>
                </div>
                <p className="text-[0.6rem] text-[var(--color-text-secondary)] leading-relaxed">
                  {ability.description}
                </p>
                {ability.uses && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="text-[0.55rem] text-[var(--color-text-muted)]">Uses:</span>
                    <div className="flex gap-0.5">
                      {Array.from({ length: ability.uses.max }).map((_, i) => (
                        <div
                          key={i}
                          className="w-2.5 h-2.5 rounded-full border"
                          style={{
                            borderColor: "var(--color-border-strong)",
                            background: i < ability.uses!.current ? "var(--color-gold)" : "var(--color-bg-deep)",
                            boxShadow: i < ability.uses!.current ? "0 0 4px var(--color-gold-glow)" : "none",
                          }}
                        />
                      ))}
                    </div>
                    <span className="text-[0.55rem] text-[var(--color-text-muted)]">
                      ({ability.uses.recharge})
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Drawer>

        {/* Status Effects */}
        <Drawer title="Status Effects" count={pc.statusEffects.length}>
          {pc.statusEffects.length === 0 ? (
            <p className="text-[0.65rem] text-[var(--color-text-muted)] italic">No active effects</p>
          ) : (
            <div className="space-y-1.5">
              {pc.statusEffects.map((effect) => {
                const isBuff = effect.type === "buff";
                const accentColor = isBuff ? "var(--color-success)" : "var(--color-danger)";
                return (
                  <div
                    key={effect.name}
                    className="card"
                    style={{ borderLeft: `3px solid ${accentColor}` }}
                  >
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {effect.icon === "eye-off" && <EyeOff size={11} style={{ color: accentColor }} />}
                      {effect.icon === "eye" && <Eye size={11} style={{ color: accentColor }} />}
                      {!["eye-off", "eye"].includes(effect.icon) && (
                        <Sparkles size={11} style={{ color: accentColor }} />
                      )}
                      <span className="text-xs font-medium" style={{ color: accentColor }}>
                        {effect.name}
                      </span>
                      <span
                        className="ml-auto badge"
                        style={{
                          background: isBuff ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                          color: accentColor,
                          border: `1px solid ${accentColor}44`,
                        }}
                      >
                        {effect.type}
                      </span>
                    </div>
                    <p className="text-[0.6rem] text-[var(--color-text-secondary)] leading-relaxed">
                      {effect.description}
                    </p>
                    <p className="text-[0.55rem] text-[var(--color-text-muted)] mt-1">
                      {effect.duration}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </Drawer>

        {/* Appearance */}
        <Drawer title="Appearance">
          <div className="space-y-1 text-[0.7rem] text-[var(--color-text-secondary)]">
            {Object.entries(pc.appearance).map(([key, val]) => (
              <p key={key}>
                <span className="text-[var(--color-pink-dim)] capitalize">{key}:</span> {val}
              </p>
            ))}
          </div>
        </Drawer>
      </div>
    </div>
  );
}
