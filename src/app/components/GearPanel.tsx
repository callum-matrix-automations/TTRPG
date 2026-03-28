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
import EquipmentSlotModal from "./EquipmentSlotModal";

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
