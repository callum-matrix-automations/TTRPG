"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, User } from "lucide-react";
import { type DetailedAppearance, type TransformationTracker } from "@/data/placeholder";

// Grouped body part categories
const categories: { title: string; fields: { key: keyof DetailedAppearance; label: string }[] }[] = [
  {
    title: "General",
    fields: [
      { key: "gender", label: "Gender" },
      { key: "height", label: "Height" },
      { key: "posture", label: "Posture" },
    ],
  },
  {
    title: "Head & Face",
    fields: [
      { key: "hair", label: "Hair" },
      { key: "face", label: "Face" },
      { key: "eyes", label: "Eyes" },
      { key: "lips", label: "Lips" },
      { key: "makeup", label: "Makeup" },
    ],
  },
  {
    title: "Body",
    fields: [
      { key: "skin", label: "Skin" },
      { key: "chest", label: "Chest" },
      { key: "waist", label: "Waist" },
      { key: "hips", label: "Hips" },
      { key: "ass", label: "Ass" },
    ],
  },
  {
    title: "Extremities",
    fields: [
      { key: "handsAndNails", label: "Hands & Nails" },
      { key: "legs", label: "Legs" },
      { key: "feet", label: "Feet" },
    ],
  },
  {
    title: "Mannerisms",
    fields: [
      { key: "voice", label: "Voice" },
      { key: "speech", label: "Speech" },
    ],
  },
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
  const fColor = transformation?.factionColor;

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
          border: "1px solid var(--color-border-strong)",
          boxShadow: "0 24px 48px rgba(0,0,0,0.6), 0 0 20px var(--color-gold-glow)",
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
          <div className="flex flex-col md:flex-row">
            {/* Left: Full Body Image Placeholder */}
            <div
              className="w-full md:w-64 shrink-0 flex flex-col items-center justify-center p-6"
              style={{
                background: "linear-gradient(180deg, var(--color-bg-elevated) 0%, var(--color-bg-deep) 100%)",
                borderRight: "1px solid var(--color-border-subtle)",
                minHeight: "400px",
              }}
            >
              {portrait ? (
                <div
                  className="w-48 h-64 rounded-lg overflow-hidden mb-3"
                  style={{ border: `2px solid ${fColor ?? "var(--color-border)"}`, boxShadow: `0 0 16px ${fColor ?? "var(--color-gold-glow)"}` }}
                >
                  <img src={portrait} alt={name ?? "Character"} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div
                  className="w-48 h-64 rounded-lg flex flex-col items-center justify-center mb-3"
                  style={{ background: "var(--color-bg-deep)", border: "1px solid var(--color-border)" }}
                >
                  <User size={48} style={{ color: "var(--color-text-muted)" }} />
                  <span className="text-[0.6rem] text-[var(--color-text-muted)] mt-2">Full Body</span>
                </div>
              )}

              {name && (
                <h2
                  className="text-base font-bold text-center"
                  style={{ fontFamily: "var(--font-heading)", color: "var(--color-pink-light)" }}
                >
                  {name}
                </h2>
              )}

              <p className="text-[0.65rem] text-[var(--color-text-secondary)] italic text-center mt-2 leading-relaxed px-2">
                {appearance.overall}
              </p>

              {/* Transformation badge */}
              {transformation?.active && (
                <div className="mt-3">
                  <span
                    className="badge"
                    style={{ background: `${fColor}22`, color: fColor ?? "var(--color-gold)", border: `1px solid ${fColor}44` }}
                  >
                    {transformation.overallProgress}% Transformed
                  </span>
                </div>
              )}
              {transformation && !transformation.active && transformation.conditioning === 100 && (
                <div className="mt-3">
                  <span
                    className="badge"
                    style={{ background: `${fColor}22`, color: fColor ?? "var(--color-gold)", border: `1px solid ${fColor}44` }}
                  >
                    {transformation.assignedTemplate ?? "Converted"}
                  </span>
                </div>
              )}
            </div>

            {/* Right: Categorized Details */}
            <div className="flex-1 p-5 space-y-4">
              {categories.map((category) => {
                const visibleFields = category.fields.filter((f) => {
                  const val = appearance[f.key];
                  return val && val !== "—";
                });
                if (visibleFields.length === 0) return null;

                return (
                  <div key={category.title}>
                    <h3
                      className="text-[0.7rem] font-semibold uppercase tracking-wider mb-2"
                      style={{ color: "var(--color-text-muted)", borderBottom: "1px solid var(--color-border-subtle)", paddingBottom: "4px" }}
                    >
                      {category.title}
                    </h3>
                    <div className="space-y-1">
                      {visibleFields.map((field) => {
                        const value = appearance[field.key];
                        const change = transformation?.physicalChanges.find(
                          (c) => c.bodyPart.toLowerCase() === field.label.toLowerCase()
                        );

                        return (
                          <div
                            key={field.key}
                            className="flex items-start gap-3 px-3 py-2 rounded-md"
                            style={{
                              background: "var(--color-bg-elevated)",
                              borderLeft: change ? `3px solid ${fColor ?? "var(--color-gold)"}` : "3px solid transparent",
                            }}
                          >
                            <span
                              className="text-[0.65rem] font-medium shrink-0 w-24"
                              style={{ color: change ? fColor ?? "var(--color-gold)" : "var(--color-text-muted)" }}
                            >
                              {field.label}
                            </span>
                            <span className="text-[0.65rem] text-[var(--color-text-secondary)] flex-1 leading-relaxed">
                              {value}
                            </span>
                            {change && (
                              <div className="flex flex-col items-end shrink-0">
                                <span className="stat-value text-[0.6rem]">{change.changePercent}%</span>
                                <span className="text-[0.5rem] text-[var(--color-text-muted)] line-through">{change.before}</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
