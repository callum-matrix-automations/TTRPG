"use client";

import { useState } from "react";
import { Flag } from "lucide-react";
import { factions, type Faction } from "@/data/placeholder";
import FactionModal from "@/components/modals/FactionModal";

export default function FactionReputation() {
  const [selectedFaction, setSelectedFaction] = useState<Faction | null>(null);

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <Flag size={14} className="text-[var(--color-gold)]" />
        Factions
      </div>
      <div className="panel-content space-y-2">
        {factions.map((f) => {
          const percent = ((f.reputation + 100) / 200) * 100;
          return (
            <div
              key={f.name}
              className="card cursor-pointer"
              onClick={() => setSelectedFaction(f)}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium" style={{ color: f.color }}>
                  {f.name}
                </span>
                <span className="stat-value text-[0.65rem]">
                  {f.reputation > 0 ? `+${f.reputation}` : f.reputation}
                </span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${percent}%`,
                    background: f.color,
                    boxShadow: `0 0 6px ${f.color}44`,
                  }}
                />
              </div>
              <span className="text-[0.6rem] mt-0.5 inline-block" style={{ color: f.color }}>
                {f.tier}
              </span>
            </div>
          );
        })}
      </div>

      {selectedFaction && (
        <FactionModal faction={selectedFaction} onClose={() => setSelectedFaction(null)} />
      )}
    </div>
  );
}
