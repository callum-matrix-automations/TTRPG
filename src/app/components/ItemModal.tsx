"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X, Sparkles, Info, Zap, Tags } from "lucide-react";
import { inventory } from "@/data/placeholder";

type Item = (typeof inventory)[number];

const rarityColors: Record<string, { text: string; border: string; glow: string }> = {
  common: { text: "var(--color-text-secondary)", border: "var(--color-border)", glow: "transparent" },
  uncommon: { text: "#22c55e", border: "#22c55e88", glow: "rgba(34,197,94,0.15)" },
  rare: { text: "#60a5fa", border: "#60a5fa88", glow: "rgba(96,165,250,0.15)" },
  "very rare": { text: "#a78bfa", border: "#a78bfa88", glow: "rgba(167,139,250,0.15)" },
  legendary: { text: "#daa520", border: "#daa52088", glow: "rgba(218,165,32,0.2)" },
};

export default function ItemModal({
  item,
  onClose,
}: {
  item: Item;
  onClose: () => void;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const rarity = rarityColors[item.rarity] ?? rarityColors.common;
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  // Trigger enter animation on mount
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // Animated close
  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 200);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose]);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) handleClose();
  };

  const isOpen = visible && !closing;

  return (
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
          border: `1px solid ${rarity.border}`,
          boxShadow: `0 24px 48px rgba(0,0,0,0.6), 0 0 30px ${rarity.glow}`,
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "scale(1) translateY(0)" : "scale(0.95) translateY(12px)",
          transition: "opacity 200ms ease, transform 200ms ease",
        }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150"
          style={{
            background: "rgba(0,0,0,0.5)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text-secondary)",
          }}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {/* Content */}
        <div className="px-5 pt-5 pb-5">
          {/* Header: Image + Name/Badges */}
          <div className="flex gap-4 mb-4">
            {/* Item Icon Image */}
            <div
              className="shrink-0 w-20 h-28 rounded-lg overflow-hidden"
              style={{
                border: `1px solid ${rarity.border}`,
                boxShadow: `0 0 12px ${rarity.glow}`,
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name, Type, Badges */}
            <div className="flex-1 min-w-0 pt-1">
              <h2
                className="text-lg font-bold mb-0.5 leading-tight"
                style={{ fontFamily: "var(--font-heading)", color: rarity.text }}
              >
                {item.name}
              </h2>
              <p className="text-[0.7rem] text-[var(--color-text-muted)] capitalize mb-2">
                {item.type}
                {item.quantity > 1 && (
                  <span className="stat-value ml-2">×{item.quantity}</span>
                )}
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span
                  className="text-[0.6rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
                  style={{
                    background: rarity.glow,
                    color: rarity.text,
                    border: `1px solid ${rarity.border}`,
                  }}
                >
                  {item.rarity}
                </span>
                {item.equipped && (
                  <span
                    className="text-[0.6rem] font-semibold uppercase tracking-wider px-2 py-0.5 rounded"
                    style={{
                      background: "var(--color-gold-subtle)",
                      color: "var(--color-gold)",
                      border: "1px solid var(--color-gold-dim)",
                    }}
                  >
                    Equipped
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Info size={12} className="text-[var(--color-text-muted)]" />
              <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Description
              </span>
            </div>
            <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
              {item.description}
            </p>
          </div>

          {/* Effects */}
          {item.effects.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Zap size={12} style={{ color: rarity.text }} />
                <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Effects
                </span>
              </div>
              <div className="space-y-1">
                {item.effects.map((effect, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 px-2.5 py-1.5 rounded-md text-xs"
                    style={{
                      background: "var(--color-bg-elevated)",
                      border: "1px solid var(--color-border-subtle)",
                    }}
                  >
                    <Sparkles size={11} className="mt-0.5 shrink-0" style={{ color: rarity.text }} />
                    <span className="text-[var(--color-text-primary)]">{effect}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attributes */}
          {Object.keys(item.attributes).length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <Tags size={12} className="text-[var(--color-text-muted)]" />
                <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                  Attributes
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.entries(item.attributes).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded-md"
                    style={{
                      background: "var(--color-bg-elevated)",
                      border: "1px solid var(--color-border-subtle)",
                    }}
                  >
                    <span className="text-[0.6rem] capitalize text-[var(--color-text-muted)]">
                      {key}
                    </span>
                    <span className="stat-value text-[0.65rem]">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
