"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { X, Check, Minus, Sparkles } from "lucide-react";
import { inventory } from "@/data/placeholder";

type Item = (typeof inventory)[number];

const rarityColors: Record<string, { text: string; border: string; glow: string }> = {
  common: { text: "var(--color-text-secondary)", border: "var(--color-border)", glow: "transparent" },
  uncommon: { text: "#22c55e", border: "#22c55e88", glow: "rgba(34,197,94,0.15)" },
  rare: { text: "#60a5fa", border: "#60a5fa88", glow: "rgba(96,165,250,0.15)" },
  "very rare": { text: "#a78bfa", border: "#a78bfa88", glow: "rgba(167,139,250,0.15)" },
  legendary: { text: "#daa520", border: "#daa52088", glow: "rgba(218,165,32,0.2)" },
};

export default function EquipmentSlotModal({
  slotName,
  equippedItemName,
  onEquip,
  onUnequip,
  onClose,
}: {
  slotName: string;
  equippedItemName: string | null;
  onEquip: (itemId: string) => void;
  onUnequip: () => void;
  onClose: () => void;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  // Items that can fit this slot
  const compatibleItems = inventory.filter((item) => item.slots.includes(slotName));
  const currentlyEquipped = equippedItemName && equippedItemName !== "—" ? equippedItemName : null;

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 200);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose]);

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
        className="relative w-full max-w-sm mx-4 rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--color-bg-surface) 0%, var(--color-bg-base) 100%)",
          border: "1px solid var(--color-border-strong)",
          boxShadow: "0 24px 48px rgba(0,0,0,0.6), 0 0 20px var(--color-gold-glow)",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "scale(1) translateY(0)" : "scale(0.95) translateY(12px)",
          transition: "opacity 200ms ease, transform 200ms ease",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: "1px solid var(--color-border)" }}
        >
          <div>
            <h2
              className="text-sm font-bold"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-pink-light)" }}
            >
              {slotName}
            </h2>
            <p className="text-[0.65rem] text-[var(--color-text-muted)]">
              {currentlyEquipped
                ? `Equipped: ${currentlyEquipped}`
                : "Empty slot"}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150"
            style={{
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-secondary)",
            }}
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        {/* Unequip button (if something is equipped) */}
        {currentlyEquipped && (
          <div className="px-4 pt-3">
            <button
              onClick={() => { onUnequip(); handleClose(); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150"
              style={{
                background: "var(--color-bg-elevated)",
                border: "1px solid rgba(239,68,68,0.3)",
              }}
            >
              <div
                className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                style={{ background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)" }}
              >
                <Minus size={14} style={{ color: "var(--color-danger)" }} />
              </div>
              <div className="flex-1 text-left">
                <span className="text-xs font-medium text-[var(--color-danger)]">Unequip</span>
                <p className="text-[0.6rem] text-[var(--color-text-muted)]">Remove {currentlyEquipped}</p>
              </div>
            </button>
          </div>
        )}

        {/* Compatible items list */}
        <div className="px-4 pt-3 pb-4">
          <p className="text-[0.6rem] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-2">
            {compatibleItems.length > 0 ? "Available Items" : "No compatible items in inventory"}
          </p>
          <div className="space-y-1.5 max-h-64 overflow-y-auto">
            {compatibleItems.map((item) => {
              const rarity = rarityColors[item.rarity] ?? rarityColors.common;
              const isEquipped = item.name === currentlyEquipped;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (!isEquipped) {
                      onEquip(item.id);
                      handleClose();
                    }
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150 text-left"
                  style={{
                    background: isEquipped
                      ? "var(--color-gold-subtle)"
                      : "var(--color-bg-elevated)",
                    border: `1px solid ${isEquipped ? "var(--color-gold-dim)" : "var(--color-border-subtle)"}`,
                  }}
                >
                  {/* Item thumbnail */}
                  <div
                    className="w-10 h-14 rounded-md overflow-hidden shrink-0"
                    style={{ border: `1px solid ${rarity.border}` }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Item info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium truncate" style={{ color: rarity.text }}>
                        {item.name}
                      </span>
                      <span
                        className="text-[0.55rem] uppercase tracking-wider px-1.5 py-0 rounded"
                        style={{ background: rarity.glow, color: rarity.text, border: `1px solid ${rarity.border}` }}
                      >
                        {item.rarity}
                      </span>
                    </div>
                    {/* First effect as preview */}
                    {item.effects.length > 0 && (
                      <p className="text-[0.6rem] text-[var(--color-text-muted)] mt-0.5 flex items-center gap-1">
                        <Sparkles size={9} style={{ color: rarity.text }} />
                        {item.effects[0]}
                      </p>
                    )}
                  </div>

                  {/* Equip status */}
                  <div className="shrink-0">
                    {isEquipped ? (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: "var(--color-gold-subtle)", border: "1px solid var(--color-gold)" }}
                      >
                        <Check size={12} style={{ color: "var(--color-gold)" }} />
                      </div>
                    ) : (
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ background: "var(--color-bg-deep)", border: "1px solid var(--color-border)" }}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
