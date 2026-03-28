"use client";

import { useState } from "react";
import {
  Sword,
  Shield,
  Shirt,
  Scroll,
  Gem,
  CircleDot,
  Footprints,
  Swords,
} from "lucide-react";
import { gear } from "@/data/placeholder";
import EquipmentSlotModal from "@/components/modals/EquipmentSlotModal";

const slotIcons: Record<string, React.ReactNode> = {
  Sword: <Sword size={16} />,
  Shield: <Shield size={16} />,
  Shirt: <Shirt size={16} />,
  Scroll: <Scroll size={16} />,
  Gem: <Gem size={16} />,
  CircleDot: <CircleDot size={16} />,
  Footprints: <Footprints size={16} />,
};

type GearSlot = (typeof gear)[number];

export default function GearPanel() {
  const [selectedSlot, setSelectedSlot] = useState<GearSlot | null>(null);

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <Swords size={14} className="text-[var(--color-gold)]" />
        Equipment
      </div>
      <div className="panel-content">
        {/* Character Visual Placeholder */}
        <div
          className="w-full rounded-lg mb-3 flex items-center justify-center"
          style={{
            height: "200px",
            background: "linear-gradient(180deg, var(--color-bg-elevated) 0%, var(--color-bg-deep) 100%)",
            border: "1px solid var(--color-border)",
          }}
        >
          <svg width="80" height="160" viewBox="0 0 80 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Head */}
            <circle cx="40" cy="24" r="14" stroke="var(--color-border-strong)" strokeWidth="1.5" fill="var(--color-bg-surface)" />
            {/* Neck */}
            <line x1="40" y1="38" x2="40" y2="46" stroke="var(--color-border-strong)" strokeWidth="1.5" />
            {/* Torso */}
            <path d="M24 46 H56 L58 90 H22 Z" stroke="var(--color-border-strong)" strokeWidth="1.5" fill="var(--color-bg-surface)" />
            {/* Left Arm */}
            <path d="M24 46 L10 72 L14 74 L26 54" stroke="var(--color-border-strong)" strokeWidth="1.5" fill="var(--color-bg-surface)" />
            {/* Right Arm */}
            <path d="M56 46 L70 72 L66 74 L54 54" stroke="var(--color-border-strong)" strokeWidth="1.5" fill="var(--color-bg-surface)" />
            {/* Left Hand */}
            <circle cx="10" cy="74" r="4" stroke="var(--color-border-strong)" strokeWidth="1.5" fill="var(--color-bg-surface)" />
            {/* Right Hand */}
            <circle cx="70" cy="74" r="4" stroke="var(--color-border-strong)" strokeWidth="1.5" fill="var(--color-bg-surface)" />
            {/* Left Leg */}
            <path d="M30 90 L26 130 L22 132 L26 134 L32 132 L34 90" stroke="var(--color-border-strong)" strokeWidth="1.5" fill="var(--color-bg-surface)" />
            {/* Right Leg */}
            <path d="M46 90 L48 130 L52 132 L56 134 L54 132 L50 90" stroke="var(--color-border-strong)" strokeWidth="1.5" fill="var(--color-bg-surface)" />
            {/* Belt */}
            <rect x="22" y="86" width="36" height="4" rx="1" stroke="var(--color-gold-dim)" strokeWidth="1" fill="var(--color-gold-subtle)" />
            {/* Belt Buckle */}
            <rect x="36" y="85" width="8" height="6" rx="1" stroke="var(--color-gold)" strokeWidth="1" fill="var(--color-gold-subtle)" />
          </svg>
          <span
            className="absolute text-[0.55rem] mt-[170px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            Character Preview
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {gear.map((g) => {
            const isEmpty = g.item === "—";
            return (
              <div
                key={g.slot}
                className="flex flex-col items-center gap-1 p-2 rounded-lg cursor-pointer transition-all duration-150"
                style={{
                  background: isEmpty
                    ? "var(--color-bg-deep)"
                    : "var(--color-bg-elevated)",
                  border: `1px solid ${isEmpty ? "var(--color-border-subtle)" : "var(--color-border)"}`,
                }}
                onClick={() => setSelectedSlot(g)}
              >
                <div
                  style={{
                    color: isEmpty
                      ? "var(--color-text-muted)"
                      : "var(--color-gold)",
                  }}
                >
                  {slotIcons[g.icon] || <CircleDot size={16} />}
                </div>
                <span className="text-[0.6rem] text-[var(--color-text-muted)] uppercase tracking-wide">
                  {g.slot}
                </span>
                <span
                  className="text-[0.65rem] text-center leading-tight"
                  style={{
                    color: isEmpty
                      ? "var(--color-text-muted)"
                      : "var(--color-text-primary)",
                  }}
                >
                  {g.item}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {selectedSlot && (
        <EquipmentSlotModal
          slotName={selectedSlot.slot}
          equippedItemName={selectedSlot.item !== "—" ? selectedSlot.item : null}
          onEquip={(itemId) => {
            // Phase 2: will update game state. For now just close.
            console.log(`Equip ${itemId} to ${selectedSlot.slot}`);
          }}
          onUnequip={() => {
            // Phase 2: will update game state. For now just close.
            console.log(`Unequip ${selectedSlot.slot}`);
          }}
          onClose={() => setSelectedSlot(null)}
        />
      )}
    </div>
  );
}
