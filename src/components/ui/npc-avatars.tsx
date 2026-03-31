"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState, type KeyboardEvent } from "react";
import { HelpCircle } from "lucide-react";

interface NpcAvatar {
  id: string;
  name: string;
  portrait: string | null;
  factionColor: string;
  tier: string;
  isSelected?: boolean;
}

const tierColors: Record<string, string> = {
  active: "var(--color-gold)",
  passive: "var(--color-purple-light)",
  background: "var(--color-text-muted)",
  companion: "var(--color-success)",
};

export function NpcAvatars({
  npcs,
  selectedId,
  onSelect,
  size = 40,
  maxVisible = 8,
}: {
  npcs: NpcAvatar[];
  selectedId: string;
  onSelect: (id: string) => void;
  size?: number;
  maxVisible?: number;
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const sliced = npcs.slice(0, Math.min(maxVisible + 1, npcs.length + 1));
  const exceedsMax = npcs.length > maxVisible;

  const handleKeyEnter = (e: KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === "Enter" || e.key === " ") onSelect(npcs[index].id);
  };

  return (
    <div className="flex items-center relative py-2 px-3">
      {sliced.map((npc, index) => {
        const isHovered = hoveredIndex === index;
        const isSelected = npc.id === selectedId;
        const isOverflow = exceedsMax && index === maxVisible;
        const zIndex = isHovered ? sliced.length + 1 : index;
        const shouldScale = isHovered && !isOverflow;
        const tierDotColor = tierColors[npc.tier] ?? "var(--color-text-muted)";

        return (
          <motion.div
            key={npc.id}
            role="button"
            aria-label={npc.name}
            className="relative cursor-pointer outline-none rounded-full"
            style={{
              width: size,
              height: size,
              zIndex,
              marginLeft: index === 0 ? 0 : -(size * 0.1),
            }}
            tabIndex={0}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onFocus={() => setHoveredIndex(index)}
            onBlur={() => setHoveredIndex(null)}
            onKeyDown={(e) => handleKeyEnter(e, index)}
            onClick={() => { if (!isOverflow) onSelect(npc.id); }}
            animate={{
              scale: shouldScale ? 1.25 : isSelected ? 1.1 : 1,
            }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {/* Avatar circle */}
            <div
              className="w-full h-full rounded-full overflow-hidden"
              style={{
                border: `2px solid ${isSelected ? npc.factionColor : "var(--color-bg-deep)"}`,
                boxShadow: isSelected ? `0 0 10px ${npc.factionColor}44` : "none",
              }}
            >
              {isOverflow ? (
                <div
                  className="flex h-full w-full items-center justify-center text-[0.6rem] font-semibold"
                  style={{ background: "var(--color-bg-elevated)", color: "var(--color-text-muted)" }}
                >
                  +{npcs.length - maxVisible}
                </div>
              ) : npc.portrait ? (
                <img src={npc.portrait} alt={npc.name} className="w-full h-full object-cover" />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center"
                  style={{ background: "var(--color-bg-elevated)" }}
                >
                  <HelpCircle size={size * 0.4} style={{ color: "var(--color-text-muted)" }} />
                </div>
              )}
            </div>

            {/* Tier indicator dot */}
            {!isOverflow && (
              <div
                className="absolute rounded-full"
                style={{
                  width: size * 0.22,
                  height: size * 0.22,
                  bottom: 0,
                  right: 0,
                  background: tierDotColor,
                  border: "2px solid var(--color-bg-deep)",
                }}
              />
            )}

            {/* Tooltip */}
            <AnimatePresence>
              {shouldScale && (
                <motion.div
                  role="tooltip"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-1/2 top-full mt-1.5 z-50"
                >
                  <div
                    className="transform -translate-x-1/2 whitespace-nowrap rounded-md text-[0.6rem] px-2 py-1 font-medium"
                    style={{
                      background: "var(--color-bg-surface)",
                      border: "1px solid var(--color-border-strong)",
                      color: "var(--color-text-primary)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                    }}
                  >
                    {npc.name}
                    <span className="ml-1.5 text-[0.5rem]" style={{ color: tierDotColor }}>
                      {npc.tier}
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
