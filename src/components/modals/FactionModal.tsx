"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  X, Flag, MapPin, Crown, Target, Users, BookOpen, Handshake,
} from "lucide-react";
import { type Faction, factions } from "@/data/placeholder";

const stanceColors: Record<string, string> = {
  Allied: "var(--color-success)",
  Friendly: "#22c55e",
  Neutral: "var(--color-text-muted)",
  Cautious: "var(--color-gold)",
  Unfriendly: "#f97316",
  Hostile: "var(--color-danger)",
};

export default function FactionModal({
  faction,
  onClose,
}: {
  faction: Faction;
  onClose: () => void;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  const percent = ((faction.reputation + 100) / 200) * 100;

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
        className="relative w-full max-w-2xl mx-4 rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--color-bg-surface) 0%, var(--color-bg-base) 100%)",
          border: `1px solid ${faction.color}44`,
          boxShadow: `0 24px 48px rgba(0,0,0,0.6), 0 0 20px ${faction.color}22`,
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
          <div className="px-5 pt-5 pb-5 space-y-4">

            {/* Header */}
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ background: `${faction.color}18`, border: `1px solid ${faction.color}44` }}
                >
                  <Flag size={20} style={{ color: faction.color }} />
                </div>
                <div>
                  <h2
                    className="text-base font-bold leading-tight"
                    style={{ fontFamily: "var(--font-heading)", color: faction.color }}
                  >
                    {faction.name}
                  </h2>
                  <span
                    className="badge mt-0.5 inline-block"
                    style={{ background: `${faction.color}18`, color: faction.color, border: `1px solid ${faction.color}44` }}
                  >
                    {faction.tier}
                  </span>
                </div>
              </div>
            </div>

            {/* Reputation */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[0.65rem] text-[var(--color-text-muted)]">Reputation</span>
                <span className="stat-value text-xs">
                  {faction.reputation > 0 ? `+${faction.reputation}` : faction.reputation}
                </span>
              </div>
              <div className="progress-bar-bg" style={{ height: "8px" }}>
                <div
                  className="progress-bar-fill"
                  style={{ width: `${percent}%`, background: faction.color, boxShadow: `0 0 8px ${faction.color}44` }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[0.5rem] text-[var(--color-text-muted)]">Hostile</span>
                <span className="text-[0.5rem] text-[var(--color-text-muted)]">Neutral</span>
                <span className="text-[0.5rem] text-[var(--color-text-muted)]">Loyal</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
              {faction.description}
            </p>

            {/* Info grid */}
            <div className="grid grid-cols-2 gap-2">
              <div
                className="px-3 py-2 rounded-md"
                style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin size={10} className="text-[var(--color-text-muted)]" />
                  <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Territory</span>
                </div>
                <p className="text-[0.65rem] text-[var(--color-text-secondary)]">{faction.territory}</p>
              </div>
              <div
                className="px-3 py-2 rounded-md"
                style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Crown size={10} className="text-[var(--color-text-muted)]" />
                  <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Leader</span>
                </div>
                <p className="text-[0.65rem] text-[var(--color-text-secondary)]">{faction.leader}</p>
              </div>
            </div>

            {/* Goals */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Target size={11} className="text-[var(--color-text-muted)]" />
                <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Goals</span>
              </div>
              <div className="space-y-1">
                {faction.goals.map((goal, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 px-2.5 py-1.5 rounded-md text-[0.65rem]"
                    style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }}
                  >
                    <span className="mt-0.5 shrink-0" style={{ color: faction.color }}>•</span>
                    <span className="text-[var(--color-text-secondary)]">{goal}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Known Members */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Users size={11} className="text-[var(--color-text-muted)]" />
                <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Known Members</span>
              </div>
              <div className="space-y-1">
                {faction.knownMembers.map((member) => (
                  <div
                    key={member}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[0.65rem]"
                    style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }}
                  >
                    <Users size={10} style={{ color: faction.color }} />
                    <span className="text-[var(--color-text-secondary)]">{member}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Faction Relationships */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <Handshake size={11} className="text-[var(--color-text-muted)]" />
                <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Relations</span>
              </div>
              <div className="space-y-1">
                {faction.relationships.map((rel) => {
                  const otherFaction = factions.find((f) => f.name === rel.faction);
                  const stanceColor = stanceColors[rel.stance] ?? "var(--color-text-muted)";
                  return (
                    <div
                      key={rel.faction}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-md"
                      style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ background: otherFaction?.color ?? "var(--color-text-muted)" }} />
                        <span className="text-[0.65rem] text-[var(--color-text-secondary)]">{rel.faction}</span>
                      </div>
                      <span className="text-[0.6rem] font-medium" style={{ color: stanceColor }}>{rel.stance}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Player History */}
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <BookOpen size={11} className="text-[var(--color-text-muted)]" />
                <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Your History</span>
              </div>
              <div className="space-y-1">
                {faction.playerHistory.map((event, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 px-2.5 py-1.5 rounded-md text-[0.65rem]"
                    style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }}
                  >
                    <span className="mt-0.5 shrink-0 text-[var(--color-gold)]">•</span>
                    <span className="text-[var(--color-text-secondary)]">{event}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
