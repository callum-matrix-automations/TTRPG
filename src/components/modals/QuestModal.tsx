"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  X, ScrollText, CheckCircle2, Circle, Trophy, Coins, Star,
  MapPin, User, BookOpen, StickyNote, Flag, ChevronRight,
} from "lucide-react";
import { type Quest } from "@/data/placeholder";

const statusConfig: Record<string, { color: string; label: string; bg: string }> = {
  active: { color: "var(--color-gold)", label: "Active", bg: "var(--color-gold-subtle)" },
  completed: { color: "var(--color-success)", label: "Completed", bg: "rgba(34,197,94,0.12)" },
  failed: { color: "var(--color-danger)", label: "Failed", bg: "rgba(239,68,68,0.12)" },
};

export default function QuestModal({
  quest,
  onClose,
}: {
  quest: Quest;
  onClose: () => void;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const status = statusConfig[quest.status] ?? statusConfig.active;

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
  const completedCount = quest.objectives.filter((o) => o.completed).length;

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
          border: `1px solid ${status.color}44`,
          boxShadow: `0 24px 48px rgba(0,0,0,0.6), 0 0 20px ${status.color}22`,
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
              <div className="flex items-center gap-2 mb-1">
                <ScrollText size={16} style={{ color: status.color }} />
                <h2
                  className="text-base font-bold leading-tight"
                  style={{ fontFamily: "var(--font-heading)", color: "var(--color-pink-light)" }}
                >
                  {quest.title}
                </h2>
              </div>
              <div className="flex items-center gap-3 mt-1.5">
                <span
                  className="badge"
                  style={{ background: status.bg, color: status.color, border: `1px solid ${status.color}44` }}
                >
                  {status.label}
                </span>
                <div className="flex items-center gap-1">
                  <User size={10} className="text-[var(--color-text-muted)]" />
                  <span className="text-[0.6rem] text-[var(--color-text-secondary)]">{quest.questGiver}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin size={10} className="text-[var(--color-text-muted)]" />
                  <span className="text-[0.6rem] text-[var(--color-text-secondary)]">{quest.location}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
              {quest.description}
            </p>

            {/* Lore */}
            <div
              className="rounded-lg p-3"
              style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <BookOpen size={11} style={{ color: "var(--color-purple-light)" }} />
                <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Lore</span>
              </div>
              <p className="text-[0.65rem] leading-relaxed text-[var(--color-text-secondary)] italic">
                {quest.lore}
              </p>
            </div>

            {/* Objectives */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Objectives
                </span>
                <span className="stat-value text-[0.6rem]">
                  {completedCount}/{quest.objectives.length}
                </span>
              </div>
              {/* Progress bar */}
              <div className="progress-bar-bg mb-2">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${(completedCount / quest.objectives.length) * 100}%`,
                    background: status.color,
                    boxShadow: `0 0 6px ${status.color}44`,
                  }}
                />
              </div>
              <div className="space-y-1">
                {quest.objectives.map((obj, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 px-2.5 py-1.5 rounded-md"
                    style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }}
                  >
                    {obj.completed ? (
                      <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-[var(--color-success)]" />
                    ) : (
                      <Circle size={13} className="mt-0.5 shrink-0 text-[var(--color-text-muted)]" />
                    )}
                    <span
                      className={`text-xs ${obj.completed ? "line-through text-[var(--color-text-muted)]" : "text-[var(--color-text-secondary)]"}`}
                    >
                      {obj.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Rewards */}
            <div>
              <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Rewards
              </span>
              <div className="grid grid-cols-2 gap-1.5 mt-2">
                <div
                  className="flex items-center gap-2 px-2.5 py-2 rounded-md"
                  style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }}
                >
                  <Star size={14} className="text-[var(--color-xp)]" />
                  <div>
                    <span className="stat-value text-sm">{quest.rewards.xp}</span>
                    <span className="text-[0.6rem] text-[var(--color-text-muted)] ml-1">XP</span>
                  </div>
                </div>
                <div
                  className="flex items-center gap-2 px-2.5 py-2 rounded-md"
                  style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }}
                >
                  <Coins size={14} className="text-[var(--color-gold)]" />
                  <div>
                    <span className="stat-value text-sm">{quest.rewards.gold}</span>
                    <span className="text-[0.6rem] text-[var(--color-text-muted)] ml-1">gp</span>
                  </div>
                </div>
                {quest.rewards.items.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-md"
                    style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }}
                  >
                    <Trophy size={14} className="text-[var(--color-purple-light)]" />
                    <span className="text-xs text-[var(--color-purple-light)]">{item}</span>
                  </div>
                ))}
                {quest.rewards.reputation.map((rep) => (
                  <div
                    key={rep.faction}
                    className="flex items-center gap-2 px-2.5 py-2 rounded-md"
                    style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }}
                  >
                    <Flag size={14} style={{ color: rep.change >= 0 ? "var(--color-success)" : "var(--color-danger)" }} />
                    <div className="flex-1 min-w-0">
                      <span className="text-[0.6rem] text-[var(--color-text-secondary)] truncate block">{rep.faction}</span>
                      <span
                        className="stat-value text-[0.65rem]"
                        style={{ color: rep.change >= 0 ? "var(--color-success)" : "var(--color-danger)" }}
                      >
                        {rep.change >= 0 ? `+${rep.change}` : rep.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {quest.notes.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <StickyNote size={11} className="text-[var(--color-text-muted)]" />
                  <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Notes</span>
                </div>
                <div className="space-y-1">
                  {quest.notes.map((note, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 px-2.5 py-1.5 rounded-md text-[0.65rem]"
                      style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }}
                    >
                      <ChevronRight size={10} className="mt-0.5 shrink-0 text-[var(--color-gold)]" />
                      <span className="text-[var(--color-text-secondary)]">{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
