"use client";

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

const slotIcons: Record<string, React.ReactNode> = {
  Sword: <Sword size={16} />,
  Shield: <Shield size={16} />,
  Shirt: <Shirt size={16} />,
  Scroll: <Scroll size={16} />,
  Gem: <Gem size={16} />,
  CircleDot: <CircleDot size={16} />,
  Footprints: <Footprints size={16} />,
};

export default function GearPanel() {
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
    </div>
  );
}
