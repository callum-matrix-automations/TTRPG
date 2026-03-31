"use client";

import { useState, useRef } from "react";
import {
  Sword,
  Shield,
  Shirt,
  Scroll,
  Gem,
  CircleDot,
  Footprints,
  Swords,
  Backpack,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { gear } from "@/data/placeholder";
import EquipmentSlotModal from "@/components/modals/EquipmentSlotModal";

const slotIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Sword, Shield, Shirt, Scroll, Gem, CircleDot, Footprints, Backpack,
};

type GearSlot = (typeof gear)[number];

function GearSlotCard({ slot, onSelect }: { slot: GearSlot; onSelect: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  const isEmpty = slot.item === "—";
  const Icon = slotIcons[slot.icon] ?? CircleDot;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const rotateX = (y - height / 2) / (height / 2) * -6;
    const rotateY = (x - width / 2) / (width / 2) * 6;
    setStyle({
      transform: `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`,
      transition: "transform 0.1s ease-out",
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
      transition: "transform 0.3s ease-in-out",
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={cn(
        "relative w-full rounded-2xl cursor-pointer overflow-hidden",
        isEmpty ? "aspect-[4/3]" : "aspect-[4/3]",
      )}
      onClick={onSelect}
    >
      {/* Background — image or fallback */}
      {!isEmpty && slot.image ? (
        <img
          src={slot.image}
          alt={slot.item}
          className="absolute inset-0 w-full h-full object-cover rounded-2xl"
        />
      ) : (
        <div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: isEmpty
              ? "var(--color-bg-deep)"
              : "linear-gradient(135deg, var(--color-bg-elevated) 0%, var(--color-bg-surface) 100%)",
            border: isEmpty ? "1px dashed var(--color-border)" : "1px solid var(--color-border)",
          }}
        />
      )}

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: isEmpty
            ? "none"
            : slot.image
              ? "linear-gradient(180deg, rgba(13,8,20,0.2) 0%, rgba(13,8,20,0.85) 100%)"
              : "linear-gradient(180deg, transparent 30%, rgba(13,8,20,0.6) 100%)",
        }}
      />

      {/* Border overlay (on top of image) */}
      {!isEmpty && (
        <div className="absolute inset-0 rounded-2xl" style={{ border: "1px solid var(--color-border)" }} />
      )}

      {/* Icon — only show when no image */}
      {(!slot.image || isEmpty) && (
        <div className="absolute inset-0 flex items-center justify-center transition-all duration-200" style={{ color: isEmpty ? "var(--color-border)" : "var(--color-gold)", opacity: isEmpty ? 0.3 : 0.15 }}>
          <Icon size={isEmpty ? 28 : 36} />
        </div>
      )}

      {/* Content overlay */}
      <div className="absolute inset-0 p-2.5 flex flex-col justify-between rounded-2xl">
        {/* Top: Slot label */}
        <div
          className="inline-flex self-start items-center gap-1 rounded-full px-2 py-0.5 text-[0.5rem] font-semibold uppercase tracking-wider"
          style={{
            background: isEmpty ? "transparent" : "rgba(0,0,0,0.5)",
            color: isEmpty ? "var(--color-text-muted)" : "var(--color-text-secondary)",
            backdropFilter: isEmpty ? "none" : "blur(6px)",
            border: isEmpty ? "1px solid var(--color-border-subtle)" : "none",
          }}
        >
          <span style={{ color: isEmpty ? "var(--color-text-muted)" : "var(--color-gold)" }}><Icon size={9} /></span>
          {slot.slot}
        </div>

        {/* Bottom: Item name + effects or empty prompt */}
        <div>
          {isEmpty ? (
            <div className="flex items-center gap-1">
              <Plus size={10} style={{ color: "var(--color-text-muted)" }} />
              <span className="text-[0.6rem]" style={{ color: "var(--color-text-muted)" }}>Empty</span>
            </div>
          ) : (
            <div>
              {/* Effects */}
              {slot.effects.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-1">
                  {slot.effects.map((effect, i) => (
                    <span
                      key={i}
                      className="text-[0.45rem] font-medium px-1.5 py-0.5 rounded-full"
                      style={{ background: "rgba(218,165,32,0.2)", color: "var(--color-gold)", backdropFilter: "blur(4px)" }}
                    >
                      {effect}
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs font-semibold leading-tight" style={{ color: "var(--color-text-primary)", textShadow: slot.image ? "0 1px 4px rgba(0,0,0,0.8)" : "none" }}>
                {slot.item}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GearPanel() {
  const [selectedSlot, setSelectedSlot] = useState<GearSlot | null>(null);

  return (
    <div className="flex flex-col h-full">
      <div className="panel-content">
        {/* Character Visual Placeholder */}
        <div
          className="w-full rounded-lg mb-3 flex items-center justify-center"
          style={{
            height: "180px",
            background: "linear-gradient(180deg, var(--color-bg-elevated) 0%, var(--color-bg-deep) 100%)",
            border: "1px solid var(--color-border)",
          }}
        >
          <svg width="80" height="150" viewBox="0 0 80 160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="24" r="14" stroke="var(--color-border-strong)" strokeWidth="1.5" fill="var(--color-bg-surface)" />
            <line x1="40" y1="38" x2="40" y2="46" stroke="var(--color-border-strong)" strokeWidth="1.5" />
            <path d="M24 46 H56 L58 90 H22 Z" stroke="var(--color-border-strong)" strokeWidth="1.5" fill="var(--color-bg-surface)" />
            <path d="M24 46 L10 72 L14 74 L26 54" stroke="var(--color-border-strong)" strokeWidth="1.5" fill="var(--color-bg-surface)" />
            <path d="M56 46 L70 72 L66 74 L54 54" stroke="var(--color-border-strong)" strokeWidth="1.5" fill="var(--color-bg-surface)" />
            <circle cx="10" cy="74" r="4" stroke="var(--color-border-strong)" strokeWidth="1.5" fill="var(--color-bg-surface)" />
            <circle cx="70" cy="74" r="4" stroke="var(--color-border-strong)" strokeWidth="1.5" fill="var(--color-bg-surface)" />
            <path d="M30 90 L26 130 L22 132 L26 134 L32 132 L34 90" stroke="var(--color-border-strong)" strokeWidth="1.5" fill="var(--color-bg-surface)" />
            <path d="M46 90 L48 130 L52 132 L56 134 L54 132 L50 90" stroke="var(--color-border-strong)" strokeWidth="1.5" fill="var(--color-bg-surface)" />
            <rect x="22" y="86" width="36" height="4" rx="1" stroke="var(--color-gold-dim)" strokeWidth="1" fill="var(--color-gold-subtle)" />
            <rect x="36" y="85" width="8" height="6" rx="1" stroke="var(--color-gold)" strokeWidth="1" fill="var(--color-gold-subtle)" />
          </svg>
        </div>

        {/* Gear Slots Grid */}
        <div className="grid grid-cols-2 gap-2">
          {gear.map((g) => (
            <GearSlotCard key={g.slot} slot={g} onSelect={() => setSelectedSlot(g)} />
          ))}
        </div>
      </div>

      {selectedSlot && (
        <EquipmentSlotModal
          slotName={selectedSlot.slot}
          equippedItemName={selectedSlot.item !== "—" ? selectedSlot.item : null}
          onEquip={(itemId) => console.log(`Equip ${itemId} to ${selectedSlot.slot}`)}
          onUnequip={() => console.log(`Unequip ${selectedSlot.slot}`)}
          onClose={() => setSelectedSlot(null)}
        />
      )}
    </div>
  );
}
