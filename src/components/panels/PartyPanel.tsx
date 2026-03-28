"use client";

import { useState } from "react";
import { Shield, Heart, HelpCircle } from "lucide-react";
import { companions, type CompanionNpc } from "@/data/placeholder";
import CompanionModal from "@/components/modals/CompanionModal";

function CompanionCard({
  npc,
  onClick,
}: {
  npc: CompanionNpc;
  onClick: () => void;
}) {
  const hpPercent = (npc.hp.current / npc.hp.max) * 100;
  const hpColor = hpPercent > 50 ? "var(--color-success)" : hpPercent > 25 ? "var(--color-gold)" : "var(--color-danger)";

  return (
    <div
      className="card cursor-pointer transition-all duration-150"
      onClick={onClick}
    >
      {/* Top row: portrait + name/class + HP */}
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-11 h-11 rounded-full overflow-hidden shrink-0 flex items-center justify-center"
          style={{ border: `2px solid ${npc.factionColor}`, background: "var(--color-bg-deep)" }}
        >
          {npc.portrait ? (
            <img src={npc.portrait} alt={npc.name} className="w-full h-full object-cover" />
          ) : (
            <HelpCircle size={16} style={{ color: "var(--color-text-muted)" }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-[var(--color-text-primary)] truncate">{npc.name}</span>
          </div>
          <span className="text-[0.55rem] text-[var(--color-text-muted)]">Level {npc.level} {npc.race} {npc.class}</span>
          {/* HP bar */}
          <div className="flex items-center gap-1.5 mt-1">
            <Heart size={9} style={{ color: hpColor }} />
            <div className="progress-bar-bg flex-1" style={{ height: "4px" }}>
              <div className="progress-bar-fill" style={{ width: `${hpPercent}%`, background: hpColor, boxShadow: `0 0 4px ${hpColor}44` }} />
            </div>
            <span className="stat-value text-[0.5rem]">{npc.hp.current}/{npc.hp.max}</span>
          </div>
        </div>
      </div>

      {/* Attribute row — compact 6-across */}
      <div className="grid grid-cols-6 gap-1">
        {Object.entries(npc.stats).map(([key, val]) => (
          <div
            key={key}
            className="flex flex-col items-center py-0.5 rounded"
            style={{ background: "var(--color-bg-deep)" }}
          >
            <span className="text-[0.45rem] text-[var(--color-text-muted)] uppercase leading-none">{key}</span>
            <span className="stat-value text-[0.6rem] leading-tight">{val.score}</span>
          </div>
        ))}
      </div>

      {/* Status effects — compact row */}
      {npc.statusEffects.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {npc.statusEffects.map((effect) => (
            <span
              key={effect.name}
              className="badge"
              style={{
                background: effect.type === "buff" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
                color: effect.type === "buff" ? "var(--color-success)" : "var(--color-danger)",
                border: `1px solid ${effect.type === "buff" ? "var(--color-success)" : "var(--color-danger)"}33`,
              }}
            >
              {effect.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PartyPanel() {
  const [selectedNpc, setSelectedNpc] = useState<CompanionNpc | null>(null);

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <Shield size={14} className="text-[var(--color-gold)]" />
        Party
        {companions.length > 0 && (
          <span className="ml-auto badge" style={{ background: "var(--color-gold-subtle)", color: "var(--color-gold-light)" }}>
            {companions.length}
          </span>
        )}
      </div>
      <div className="panel-content space-y-2">
        {companions.length === 0 ? (
          <div className="text-center py-8">
            <Shield size={24} className="mx-auto mb-2" style={{ color: "var(--color-text-muted)" }} />
            <p className="text-xs text-[var(--color-text-muted)]">No companions yet</p>
            <p className="text-[0.6rem] text-[var(--color-text-muted)] mt-1">
              Allies who join your party will appear here
            </p>
          </div>
        ) : (
          companions.map((npc) => (
            <CompanionCard
              key={npc.id}
              npc={npc}
              onClick={() => setSelectedNpc(npc)}
            />
          ))
        )}
      </div>

      {selectedNpc && (
        <CompanionModal npc={selectedNpc} onClose={() => setSelectedNpc(null)} />
      )}
    </div>
  );
}
