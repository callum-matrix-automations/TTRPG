"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { X, Sparkles, Zap, Backpack, Trash2, Package } from "lucide-react";
import { inventory } from "@/data/placeholder";

type Item = (typeof inventory)[number];

const rarityColors: Record<string, { text: string; bg: string; border: string }> = {
  common: { text: "var(--color-text-secondary)", bg: "var(--color-bg-elevated)", border: "var(--color-border)" },
  uncommon: { text: "#22c55e", bg: "rgba(34,197,94,0.1)", border: "#22c55e44" },
  rare: { text: "#60a5fa", bg: "rgba(96,165,250,0.1)", border: "#60a5fa44" },
  "very rare": { text: "#a78bfa", bg: "rgba(167,139,250,0.1)", border: "#a78bfa44" },
  legendary: { text: "#daa520", bg: "rgba(218,165,32,0.1)", border: "#daa52044" },
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

  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);
  const handleClose = useCallback(() => { setClosing(true); setTimeout(onClose, 200); }, [onClose]);
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [handleClose]);

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
      onClick={(e) => { if (e.target === backdropRef.current) handleClose(); }}
    >
      <div
        className="relative w-full max-w-sm mx-4 overflow-hidden rounded-xl group"
        style={{
          background: "var(--color-bg-base)",
          border: `1px solid ${rarity.border}`,
          boxShadow: `0 24px 48px rgba(0,0,0,0.5), 0 0 20px ${rarity.bg}`,
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "scale(1) translateY(0)" : "scale(0.95) translateY(12px)",
          transition: "opacity 200ms ease, transform 200ms ease",
        }}
      >
        {/* ── Image ── */}
        <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
          <motion.img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />

          {/* Badges — top left */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {item.rarity !== "common" && (
              <span
                className="text-[0.6rem] font-semibold px-2.5 py-0.5 rounded-full capitalize"
                style={{ background: rarity.bg, color: rarity.text, backdropFilter: "blur(8px)" }}
              >
                {item.rarity}
              </span>
            )}
            {item.equipped && (
              <span className="text-[0.6rem] font-semibold px-2.5 py-0.5 rounded-full" style={{ background: "rgba(218,165,32,0.15)", color: "var(--color-gold)", backdropFilter: "blur(8px)" }}>
                Equipped
              </span>
            )}
            {item.quantity > 1 && (
              <span className="text-[0.6rem] font-semibold px-2.5 py-0.5 rounded-full" style={{ background: "rgba(0,0,0,0.6)", color: "var(--color-text-primary)", backdropFilter: "blur(8px)" }}>
                ×{item.quantity}
              </span>
            )}
          </div>

          {/* Close — top right */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 h-8 w-8 rounded-full flex items-center justify-center cursor-pointer"
            style={{ background: "var(--color-bg-base)", border: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}
          >
            <X size={14} />
          </button>
        </div>

        {/* ── Content ── */}
        <div className="p-4 space-y-3">
          {/* Name + type row */}
          <div>
            <h3 className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{item.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs capitalize" style={{ color: rarity.text }}>{item.type}</span>
              {item.slots.length > 0 && (
                <span className="text-[0.6rem] ml-auto" style={{ color: "var(--color-text-muted)" }}>
                  {item.slots.join(" · ")}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            {item.description}
          </p>

          {/* Effects */}
          {item.effects.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[0.6rem]" style={{ color: "var(--color-text-muted)" }}>Effects</span>
              <div className="flex flex-col gap-1.5">
                {item.effects.map((effect, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 px-3 py-2 rounded-lg text-xs"
                    style={{ background: rarity.bg, border: `1px solid ${rarity.border}` }}
                  >
                    <Sparkles size={12} className="mt-0.5 shrink-0" style={{ color: rarity.text }} />
                    <span style={{ color: "var(--color-text-primary)" }}>{effect}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Attributes as inline tags */}
          {Object.keys(item.attributes).length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[0.6rem]" style={{ color: "var(--color-text-muted)" }}>Details</span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(item.attributes).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs"
                    style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border)" }}
                  >
                    <span className="capitalize" style={{ color: "var(--color-text-muted)" }}>{key}</span>
                    <span className="font-semibold" style={{ color: "var(--color-text-primary)" }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Footer Actions ── */}
        <div className="p-4 pt-0 flex gap-2">
          {/* Primary action */}
          {item.type === "consumable" ? (
            <button
              className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150"
              style={{ background: rarity.text, color: "var(--color-bg-deepest)" }}
              onClick={() => console.log(`Use ${item.id}`)}
            >
              <Zap size={14} /> Use Item
            </button>
          ) : item.slots.length > 0 ? (
            <button
              className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150"
              style={{
                background: item.equipped ? "var(--color-bg-elevated)" : rarity.text,
                color: item.equipped ? "var(--color-text-secondary)" : "var(--color-bg-deepest)",
                border: item.equipped ? "1px solid var(--color-border)" : "none",
              }}
              onClick={() => console.log(`${item.equipped ? "Unequip" : "Equip"} ${item.id}`)}
            >
              <Backpack size={14} /> {item.equipped ? "Unequip" : "Equip"}
            </button>
          ) : (
            <button
              className="flex-1 h-9 flex items-center justify-center gap-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-150"
              style={{ background: "var(--color-bg-elevated)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}
              onClick={() => console.log(`Inspect ${item.id}`)}
            >
              <Package size={14} /> Inspect
            </button>
          )}

          {/* Drop button */}
          <button
            className="h-9 w-9 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-150"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "var(--color-danger)" }}
            onClick={() => console.log(`Drop ${item.id}`)}
            title="Drop item"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
