"use client";

import { useState } from "react";
import { Backpack, Sword, ShieldCheck, Sparkles, FlaskConical, Wrench, Box } from "lucide-react";
import { inventory } from "@/data/placeholder";
import ItemModal from "./ItemModal";

const rarityColors: Record<string, string> = {
  common: "var(--color-text-secondary)",
  uncommon: "#22c55e",
  rare: "#60a5fa",
  "very rare": "#a78bfa",
  legendary: "#daa520",
};

const typeIcons: Record<string, React.ReactNode> = {
  weapon: <Sword size={12} />,
  armor: <ShieldCheck size={12} />,
  wondrous: <Sparkles size={12} />,
  consumable: <FlaskConical size={12} />,
  tool: <Wrench size={12} />,
  gear: <Box size={12} />,
};

type Item = (typeof inventory)[number];

export default function InventoryPanel() {
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <Backpack size={14} className="text-[var(--color-gold)]" />
        Inventory
        <span
          className="ml-auto badge"
          style={{
            background: "var(--color-gold-subtle)",
            color: "var(--color-gold-light)",
          }}
        >
          {inventory.length}
        </span>
      </div>
      <div className="panel-content space-y-1.5">
        {inventory.map((item) => (
          <div
            key={item.id}
            className="card flex items-start gap-2 cursor-pointer"
            onClick={() => setSelectedItem(item)}
          >
            <div
              className="mt-0.5 flex-shrink-0"
              style={{ color: rarityColors[item.rarity] }}
            >
              {typeIcons[item.type] || <Box size={12} />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-medium truncate"
                  style={{ color: rarityColors[item.rarity] }}
                >
                  {item.name}
                </span>
                {item.equipped && (
                  <span
                    className="badge"
                    style={{
                      background: "var(--color-gold-subtle)",
                      color: "var(--color-gold)",
                    }}
                  >
                    E
                  </span>
                )}
                {item.quantity > 1 && (
                  <span className="stat-value text-[0.6rem]">
                    x{item.quantity}
                  </span>
                )}
              </div>
              <p className="text-[0.6rem] text-[var(--color-text-muted)] truncate">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
