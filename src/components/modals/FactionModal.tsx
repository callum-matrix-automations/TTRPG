"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  X, Flag, MapPin, Crown, Target, Users, BookOpen, Handshake,
} from "lucide-react";
import { type Faction, factions } from "@/data/placeholder";
import { GlassHighlight, GlassLinkRow } from "@/components/ui/glass";
import { AvatarChip, ChipRow } from "@/components/ui/avatar-chip";
import { ProgressBar } from "@/components/ui/progress-bar";

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
          {/* Faction Cover Image */}
          {faction.image && (
            <div className="relative w-full h-40 overflow-hidden">
              <img src={faction.image} alt={faction.name} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 30%, var(--color-bg-surface) 100%)` }} />
            </div>
          )}

          <div className={`px-5 pb-5 space-y-4 ${faction.image ? "-mt-6 relative z-10" : "pt-5"}`}>

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
              <ProgressBar value={percent} color={faction.color} glowColor={`${faction.color}44`} height={8} />
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
              <GlassHighlight title="Territory" accentColor={faction.color}>
                {faction.territory}
              </GlassHighlight>
              <GlassHighlight title="Leader" accentColor={faction.color}>
                {faction.leader}
              </GlassHighlight>
            </div>

            {/* Goals */}
            <GlassHighlight title="Goals" accentColor={faction.color}>
              <div className="space-y-1">
                {faction.goals.map((goal, i) => (
                  <div key={i} className="flex items-start gap-2 text-[0.6rem]">
                    <span className="mt-0.5 shrink-0" style={{ color: faction.color }}>•</span>
                    <span>{goal}</span>
                  </div>
                ))}
              </div>
            </GlassHighlight>

            {/* Known Members */}
            <GlassHighlight title="Known Members" accentColor={faction.color}>
              <ChipRow>
                {faction.knownMembers.map((member) => (
                  <AvatarChip key={member} label={member} variant="custom" customColor={faction.color} size="sm" icon={<Users size={10} />} />
                ))}
              </ChipRow>
            </GlassHighlight>

            {/* Faction Relationships */}
            <div>
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: "var(--color-text-muted)" }}>Relations</p>
              <div className="space-y-1.5">
                {faction.relationships.map((rel) => {
                  const otherFaction = factions.find((f) => f.name === rel.faction);
                  const stanceColor = stanceColors[rel.stance] ?? "var(--color-text-muted)";
                  return (
                    <GlassLinkRow
                      key={rel.faction}
                      icon={<Flag size={12} style={{ color: otherFaction?.color ?? "var(--color-text-muted)" }} />}
                      label={rel.faction}
                      detail={rel.stance}
                      accentColor={stanceColor}
                    />
                  );
                })}
              </div>
            </div>

            {/* Player History */}
            <GlassHighlight title="Your History">
              <div className="space-y-1">
                {faction.playerHistory.map((event, i) => (
                  <div key={i} className="flex items-start gap-2 text-[0.6rem]">
                    <span className="mt-0.5 shrink-0" style={{ color: "var(--color-gold)" }}>•</span>
                    <span>{event}</span>
                  </div>
                ))}
              </div>
            </GlassHighlight>

          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
