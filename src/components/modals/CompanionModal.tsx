"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Heart, Star, Shield, Zap, Footprints, BookOpen, Eye, HelpCircle, Flag, ChevronDown } from "lucide-react";
import { type CompanionNpc } from "@/data/placeholder";

// ── Collapsible Drawer (reused pattern) ──
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
          <h4 className="text-[0.65rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">{title}</h4>
          {count !== undefined && (
            <span className="badge" style={{ background: "var(--color-gold-subtle)", color: "var(--color-gold-light)" }}>{count}</span>
          )}
        </div>
        <ChevronDown
          size={14}
          className="transition-transform duration-200"
          style={{ color: "var(--color-text-muted)", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-200 ease-in-out"
        style={{ maxHeight: open ? "2000px" : "0px", opacity: open ? 1 : 0 }}
      >
        <div className="pt-2 pb-1">{children}</div>
      </div>
    </div>
  );
}

export default function CompanionModal({
  npc,
  onClose,
}: {
  npc: CompanionNpc;
  onClose: () => void;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  const hpPercent = (npc.hp.current / npc.hp.max) * 100;
  const hpColor = hpPercent > 50 ? "var(--color-success)" : hpPercent > 25 ? "var(--color-gold)" : "var(--color-danger)";

  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 200);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) handleClose();
  };

  const isOpen = visible && !closing;

  return createPortal(
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: isOpen ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0)",
        backdropFilter: isOpen ? "blur(4px)" : "blur(0px)",
        transition: "background 200ms ease, backdrop-filter 200ms ease",
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-md mx-4 rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--color-bg-surface) 0%, var(--color-bg-base) 100%)",
          border: `1px solid ${npc.factionColor}66`,
          boxShadow: `0 24px 48px rgba(0,0,0,0.6), 0 0 24px ${npc.factionColor}22`,
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "scale(1) translateY(0)" : "scale(0.95) translateY(12px)",
          transition: "opacity 200ms ease, transform 200ms ease",
        }}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150"
          style={{ background: "rgba(0,0,0,0.5)", border: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}
          aria-label="Close"
        >
          <X size={14} />
        </button>

        <div className="max-h-[80vh] overflow-y-auto">
          <div className="px-5 pt-5 pb-5 space-y-3">
            {/* Portrait + Name */}
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full overflow-hidden shrink-0 flex items-center justify-center"
                style={{ border: `2px solid ${npc.factionColor}`, boxShadow: `0 0 16px ${npc.factionColor}33`, background: "var(--color-bg-deep)" }}
              >
                {npc.portrait ? (
                  <img src={npc.portrait} alt={npc.name} className="w-full h-full object-cover" />
                ) : (
                  <HelpCircle size={24} style={{ color: "var(--color-text-muted)" }} />
                )}
              </div>
              <div>
                <h2 className="text-base font-bold leading-tight" style={{ fontFamily: "var(--font-heading)", color: "var(--color-pink-light)" }}>
                  {npc.name}
                </h2>
                <p className="text-[0.7rem] text-[var(--color-text-secondary)]">
                  Level {npc.level} {npc.race} {npc.class}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Flag size={10} style={{ color: npc.factionColor }} />
                  <span className="text-[0.6rem]" style={{ color: npc.factionColor }}>{npc.faction} — {npc.factionRank}</span>
                </div>
              </div>
            </div>

            {/* HP Bar */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Heart size={12} style={{ color: hpColor }} />
                  <span className="text-[0.65rem] text-[var(--color-text-secondary)]">HP</span>
                </div>
                <span className="stat-value text-xs">{npc.hp.current}/{npc.hp.max}</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill" style={{ width: `${hpPercent}%`, background: hpColor, boxShadow: `0 0 6px ${hpColor}44` }} />
              </div>
            </div>

            {/* ── DRAWERS ── */}

            {/* Attributes */}
            <Drawer title="Attributes" defaultOpen>
              <div className="grid grid-cols-3 gap-1.5">
                {Object.entries(npc.stats).map(([key, val]) => (
                  <div key={key} className="flex flex-col items-center p-2 rounded-lg" style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border)" }}>
                    <span className="text-[0.6rem] font-semibold tracking-wider text-[var(--color-text-muted)] uppercase">{key}</span>
                    <span className="stat-value text-lg leading-none mt-1">{val.score}</span>
                    <span className="text-xs mt-0.5 px-1.5 rounded" style={{ background: "var(--color-gold-subtle)", color: "var(--color-gold-light)" }}>
                      {val.mod >= 0 ? `+${val.mod}` : val.mod}
                    </span>
                  </div>
                ))}
              </div>
            </Drawer>

            {/* Skills */}
            <Drawer title="Skills" count={npc.skills.length}>
              <div className="space-y-1">
                {npc.skills.map((skill) => (
                  <div key={skill.name} className="flex items-center justify-between py-0.5 px-2 rounded text-xs" style={{ background: "var(--color-bg-elevated)" }}>
                    <div className="flex items-center gap-1.5">
                      {skill.proficient && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-purple-light)]" />}
                      {!skill.proficient && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-bg-deep)]" />}
                      <span className="text-[var(--color-text-secondary)]">{skill.name}</span>
                    </div>
                    <span className="stat-value text-xs">{skill.mod >= 0 ? `+${skill.mod}` : skill.mod}</span>
                  </div>
                ))}
              </div>
            </Drawer>

            {/* Abilities */}
            <Drawer title="Abilities" count={npc.abilities.length}>
              <div className="space-y-1.5">
                {npc.abilities.map((ability) => (
                  <div key={ability.name} className="card">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <BookOpen size={11} className="text-[var(--color-purple-light)]" />
                      <span className="text-xs font-medium text-[var(--color-text-primary)]">{ability.name}</span>
                    </div>
                    <p className="text-[0.6rem] text-[var(--color-text-secondary)] leading-relaxed">{ability.description}</p>
                  </div>
                ))}
              </div>
            </Drawer>

            {/* Gear */}
            <Drawer title="Gear" count={npc.gear.length}>
              <div className="space-y-1">
                {npc.gear.map((g) => (
                  <div key={g.slot} className="flex items-center justify-between px-2 py-1 rounded text-xs" style={{ background: "var(--color-bg-elevated)" }}>
                    <span className="text-[var(--color-text-muted)]">{g.slot}</span>
                    <span className="text-[var(--color-text-secondary)]">{g.item}</span>
                  </div>
                ))}
              </div>
            </Drawer>

            {/* Status Effects */}
            <Drawer title="Status Effects" count={npc.statusEffects.length}>
              {npc.statusEffects.length === 0 ? (
                <p className="text-[0.65rem] text-[var(--color-text-muted)] italic">No active effects</p>
              ) : (
                <div className="space-y-1.5">
                  {npc.statusEffects.map((effect) => {
                    const isBuff = effect.type === "buff";
                    const color = isBuff ? "var(--color-success)" : "var(--color-danger)";
                    return (
                      <div key={effect.name} className="card" style={{ borderLeft: `3px solid ${color}` }}>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-xs font-medium" style={{ color }}>{effect.name}</span>
                          <span className="ml-auto badge" style={{ background: isBuff ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)", color, border: `1px solid ${color}44` }}>
                            {effect.type}
                          </span>
                        </div>
                        <p className="text-[0.6rem] text-[var(--color-text-secondary)] leading-relaxed">{effect.description}</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </Drawer>

            {/* Appearance */}
            <Drawer title="Appearance">
              <div className="space-y-1 text-[0.7rem] text-[var(--color-text-secondary)]">
                {Object.entries(npc.appearance).map(([key, val]) => (
                  <p key={key}><span className="text-[var(--color-pink-dim)] capitalize">{key}:</span> {val}</p>
                ))}
              </div>
            </Drawer>

            {/* Loyalty + Joined */}
            <div className="flex items-center justify-between text-[0.6rem] text-[var(--color-text-muted)] pt-1" style={{ borderTop: "1px solid var(--color-border-subtle)" }}>
              <span>Loyalty: <span className="stat-value">{npc.loyalty}</span></span>
              <span>Joined: {npc.joinedAt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
