"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Backpack, Eye } from "lucide-react";
import { inventory } from "@/data/placeholder";
import ItemModal from "@/components/modals/ItemModal";

type Item = (typeof inventory)[number];

const rarityColors: Record<string, { text: string; bg: string; border: string }> = {
  common: { text: "var(--color-text-secondary)", bg: "var(--color-bg-elevated)", border: "var(--color-border)" },
  uncommon: { text: "#22c55e", bg: "rgba(34,197,94,0.08)", border: "#22c55e33" },
  rare: { text: "#60a5fa", bg: "rgba(96,165,250,0.08)", border: "#60a5fa33" },
  "very rare": { text: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "#a78bfa33" },
  legendary: { text: "#daa520", bg: "rgba(218,165,32,0.08)", border: "#daa52033" },
};

function InventoryCard({ item, onSelect }: { item: Item; onSelect: () => void }) {
  const rarity = rarityColors[item.rarity] ?? rarityColors.common;

  return (
    <motion.div
      whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
      className="flex items-center justify-between w-full p-3 rounded-xl cursor-pointer transition-shadow hover:shadow-md"
      style={{ background: "var(--color-bg-elevated)", border: `1px solid ${rarity.border}` }}
      onClick={onSelect}
    >
      {/* Left: Image + Name/Type */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={item.image}
          alt={item.name}
          className="h-10 w-10 rounded-lg object-cover shrink-0"
          style={{ border: `1px solid ${rarity.border}` }}
        />
        <div className="min-w-0">
          <p className="text-xs font-semibold truncate" style={{ color: rarity.text }}>{item.name}</p>
          <p className="text-[0.6rem] capitalize truncate" style={{ color: "var(--color-text-muted)" }}>{item.type}</p>
        </div>
      </div>

      {/* Right: Badges + View */}
      <div className="flex items-center gap-2.5 shrink-0 ml-3">
        <div className="text-right">
          {item.equipped && (
            <span className="text-[0.55rem] font-semibold block" style={{ color: "var(--color-gold)" }}>Equipped</span>
          )}
          {item.quantity > 1 && (
            <span className="text-[0.55rem] font-medium block" style={{ color: "var(--color-text-muted)" }}>×{item.quantity}</span>
          )}
          {!item.equipped && item.quantity <= 1 && (
            <span
              className="text-[0.55rem] font-medium capitalize"
              style={{ color: rarity.text }}
            >
              {item.rarity}
            </span>
          )}
        </div>
        <button
          className="h-7 px-2.5 rounded-lg text-[0.6rem] font-semibold flex items-center gap-1 cursor-pointer transition-all duration-150"
          style={{ background: rarity.bg, color: rarity.text, border: `1px solid ${rarity.border}` }}
          onClick={(e) => { e.stopPropagation(); onSelect(); }}
        >
          <Eye size={11} /> View
        </button>
      </div>
    </motion.div>
  );
}

export default function InventoryPanel() {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  return (
    <div className="flex flex-col h-full">
      <div className="panel-content">
        <div className="flex flex-col gap-2">
          {inventory.map((item) => (
            <InventoryCard key={item.id} item={item} onSelect={() => setSelectedItem(item)} />
          ))}
        </div>
      </div>

      {selectedItem && (
        <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
