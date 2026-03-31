"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Shield, Star, AlertTriangle } from "lucide-react";
import { type DetailedAppearance, type TransformationTracker } from "@/data/placeholder";
import { GlassCard, GlassHighlight, GlassProfile } from "@/components/ui/glass";

const categories: { title: string; fields: { key: keyof DetailedAppearance; label: string }[] }[] = [
  { title: "General", fields: [{ key: "gender", label: "Gender" }, { key: "height", label: "Height" }, { key: "posture", label: "Posture" }] },
  { title: "Head & Face", fields: [{ key: "hair", label: "Hair" }, { key: "face", label: "Face" }, { key: "eyes", label: "Eyes" }, { key: "lips", label: "Lips" }, { key: "makeup", label: "Makeup" }] },
  { title: "Body", fields: [{ key: "skin", label: "Skin" }, { key: "chest", label: "Chest" }, { key: "waist", label: "Waist" }, { key: "hips", label: "Hips" }, { key: "ass", label: "Ass" }] },
  { title: "Extremities", fields: [{ key: "handsAndNails", label: "Hands & Nails" }, { key: "legs", label: "Legs" }, { key: "feet", label: "Feet" }] },
  { title: "Mannerisms", fields: [{ key: "voice", label: "Voice" }, { key: "speech", label: "Speech" }] },
];

export default function AppearanceModal({
  appearance,
  transformation,
  name,
  portrait,
  onClose,
}: {
  appearance: DetailedAppearance;
  transformation?: TransformationTracker | null;
  name?: string;
  portrait?: string | null;
  onClose: () => void;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);
  const handleClose = useCallback(() => { setClosing(true); setTimeout(onClose, 200); }, [onClose]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [handleClose]);

  const isOpen = visible && !closing;
  const fColor = transformation?.factionColor ?? "var(--color-gold)";

  return createPortal(
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: isOpen ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0)",
        backdropFilter: isOpen ? "blur(6px)" : "blur(0px)",
        transition: "background 200ms ease, backdrop-filter 200ms ease",
      }}
      onClick={(e) => { if (e.target === backdropRef.current) handleClose(); }}
    >
      <div
        className="relative w-full max-w-3xl mx-4 rounded-2xl overflow-hidden"
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "scale(1) translateY(0)" : "scale(0.97) translateY(12px)",
          transition: "opacity 200ms ease, transform 200ms ease",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer"
          style={{ background: "rgba(0,0,0,0.5)", border: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}
          aria-label="Close"
        >
          <X size={14} />
        </button>

        <GlassCard className="p-6 md:p-8">
          <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
            {/* Left — Profile + Transformation */}
            <div className="space-y-4">
              <GlassProfile
                portrait={portrait}
                name={name ?? "Character"}
                subtitle={appearance.overall}
                accentColor={fColor}
                fullBody
                badge={
                  transformation?.active ? (
                    <span
                      className="text-[0.6rem] font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: `${fColor}22`, color: fColor, border: `1px solid ${fColor}44` }}
                    >
                      {transformation.overallProgress}% Transformed
                    </span>
                  ) : transformation && transformation.conditioning === 100 ? (
                    <span
                      className="text-[0.6rem] font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: `${fColor}22`, color: fColor, border: `1px solid ${fColor}44` }}
                    >
                      {transformation.assignedTemplate ?? "Converted"}
                    </span>
                  ) : null
                }
              />

              {/* Transformation Stats */}
              {transformation && (transformation.active || transformation.conditioning > 0) && (
                <GlassHighlight title={transformation.factionName ?? "Transformation"} accentColor={fColor}>
                  <div className="space-y-2.5">
                    {/* Identity */}
                    <div>
                      <div className="flex items-center justify-between text-[0.6rem] mb-0.5">
                        <div className="flex items-center gap-1">
                          <Shield size={9} style={{ color: transformation.identity > 50 ? "var(--color-success)" : transformation.identity > 25 ? "var(--color-gold)" : "var(--color-danger)" }} />
                          <span style={{ color: "var(--color-text-muted)" }}>Identity</span>
                        </div>
                        <span className="stat-value text-[0.6rem]">{transformation.identity}/100</span>
                      </div>
                      <div className="h-1 w-full rounded-full" style={{ background: "var(--color-bg-deep)" }}>
                        <div className="h-1 rounded-full transition-all" style={{
                          width: `${transformation.identity}%`,
                          background: transformation.identity > 50 ? "var(--color-success)" : transformation.identity > 25 ? "var(--color-gold)" : "var(--color-danger)",
                        }} />
                      </div>
                    </div>

                    {/* Willpower */}
                    <div>
                      <div className="flex items-center justify-between text-[0.6rem] mb-0.5">
                        <div className="flex items-center gap-1">
                          <Star size={9} style={{ color: transformation.willpower > 50 ? "var(--color-mana)" : transformation.willpower > 25 ? "var(--color-gold)" : "var(--color-danger)" }} />
                          <span style={{ color: "var(--color-text-muted)" }}>Willpower</span>
                        </div>
                        <span className="stat-value text-[0.6rem]">{transformation.willpower}/100</span>
                      </div>
                      <div className="h-1 w-full rounded-full" style={{ background: "var(--color-bg-deep)" }}>
                        <div className="h-1 rounded-full transition-all" style={{
                          width: `${transformation.willpower}%`,
                          background: transformation.willpower > 50 ? "var(--color-mana)" : transformation.willpower > 25 ? "var(--color-gold)" : "var(--color-danger)",
                        }} />
                      </div>
                    </div>

                    {/* Conditioning */}
                    <div>
                      <div className="flex items-center justify-between text-[0.6rem] mb-0.5">
                        <div className="flex items-center gap-1">
                          <AlertTriangle size={9} style={{ color: transformation.conditioning < 25 ? "var(--color-purple)" : transformation.conditioning < 50 ? "var(--color-gold)" : "var(--color-danger)" }} />
                          <span style={{ color: "var(--color-text-muted)" }}>Conditioning</span>
                        </div>
                        <span className="stat-value text-[0.6rem]">{transformation.conditioning}/100</span>
                      </div>
                      <div className="h-1 w-full rounded-full" style={{ background: "var(--color-bg-deep)" }}>
                        <div className="h-1 rounded-full transition-all" style={{
                          width: `${transformation.conditioning}%`,
                          background: transformation.conditioning < 25 ? "var(--color-purple)" : transformation.conditioning < 50 ? "var(--color-gold)" : "var(--color-danger)",
                        }} />
                      </div>
                    </div>
                  </div>
                </GlassHighlight>
              )}
            </div>

            {/* Right — Categorized body parts as glass highlight cards */}
            <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
              {categories.map((category) => {
                const visibleFields = category.fields.filter((f) => {
                  const val = appearance[f.key];
                  return val && val !== "—";
                });
                if (visibleFields.length === 0) return null;

                return (
                  <GlassHighlight key={category.title} title={category.title}>
                    <div className="space-y-1.5">
                      {visibleFields.map((field) => {
                        const value = appearance[field.key];
                        const change = transformation?.physicalChanges.find(
                          (c) => c.bodyPart.toLowerCase() === field.label.toLowerCase()
                        );

                        return (
                          <div
                            key={field.key}
                            className="flex items-start gap-2 px-2 py-1.5 rounded-lg"
                            style={{
                              background: "rgba(13,8,20,0.3)",
                              borderLeft: change ? `2px solid ${fColor}` : "2px solid transparent",
                            }}
                          >
                            <span className="text-[0.6rem] font-medium shrink-0 w-20" style={{ color: change ? fColor : "var(--color-text-muted)" }}>
                              {field.label}
                            </span>
                            <span className="text-[0.6rem] flex-1 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                              {value}
                            </span>
                            {change && (
                              <div className="flex flex-col items-end shrink-0">
                                <span className="stat-value text-[0.5rem]">{change.changePercent}%</span>
                                <span className="text-[0.45rem] line-through" style={{ color: "var(--color-text-muted)" }}>{change.before}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </GlassHighlight>
                );
              })}
            </div>
          </div>
        </GlassCard>
      </div>
    </div>,
    document.body,
  );
}
