"use client";

import { useState } from "react";
import { Flag, MapPin, Crown } from "lucide-react";
import { factions, type Faction } from "@/data/placeholder";
import FactionModal from "@/components/modals/FactionModal";
import { HoverRevealCard, RevealRow, RevealBar } from "@/components/ui/hover-reveal-card";

function FactionCard({ faction, onOpenModal }: { faction: Faction; onOpenModal: () => void }) {
  const percent = ((faction.reputation + 100) / 200) * 100;

  return (
    <HoverRevealCard
      accentColor={faction.color}
      footerIcon={<Flag size={11} />}
      footerLabel={faction.tier}
      footerActionLabel="View Full Profile"
      footerAction={onOpenModal}
      summary={
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium" style={{ color: faction.color }}>{faction.name}</span>
            <span className="stat-value text-[0.6rem]">{faction.reputation > 0 ? `+${faction.reputation}` : faction.reputation}</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: `${percent}%`, background: faction.color, boxShadow: `0 0 6px ${faction.color}44` }} />
          </div>
          <span className="text-[0.55rem] mt-0.5 inline-block" style={{ color: faction.color }}>{faction.tier}</span>
        </div>
      }
      details={
        <>
          {/* Description */}
          <RevealRow>
            <p className="text-[0.6rem] text-[var(--color-text-secondary)] leading-relaxed">
              {faction.description}
            </p>
          </RevealRow>

          {/* Territory */}
          <RevealRow>
            <div className="flex items-center gap-1.5 text-[0.55rem]">
              <MapPin size={9} style={{ color: "var(--color-text-muted)" }} />
              <span style={{ color: "var(--color-text-muted)" }}>Territory:</span>
              <span className="text-[var(--color-text-secondary)]">{faction.territory}</span>
            </div>
          </RevealRow>

          {/* Leader */}
          <RevealRow>
            <div className="flex items-center gap-1.5 text-[0.55rem]">
              <Crown size={9} style={{ color: "var(--color-text-muted)" }} />
              <span style={{ color: "var(--color-text-muted)" }}>Leader:</span>
              <span className="text-[var(--color-text-secondary)]">{faction.leader}</span>
            </div>
          </RevealRow>

          {/* Inter-faction relationships */}
          {faction.relationships.length > 0 && (
            <RevealRow>
              <span className="text-[0.55rem] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Relations</span>
              <div className="space-y-0.5 mt-1">
                {faction.relationships.map((rel) => {
                  const other = factions.find((f) => f.name === rel.faction);
                  return (
                    <div key={rel.faction} className="flex items-center justify-between text-[0.55rem] px-1.5 py-0.5 rounded" style={{ background: "var(--color-bg-deep)" }}>
                      <span className="text-[var(--color-text-secondary)]">{rel.faction}</span>
                      <span style={{ color: other?.color ?? "var(--color-text-muted)" }}>{rel.stance}</span>
                    </div>
                  );
                })}
              </div>
            </RevealRow>
          )}
        </>
      }
    />
  );
}

export default function FactionReputation() {
  const [selectedFaction, setSelectedFaction] = useState<Faction | null>(null);

  return (
    <div className="flex flex-col h-full">
      <div className="panel-content space-y-2">
        {factions.map((f) => (
          <FactionCard key={f.name} faction={f} onOpenModal={() => setSelectedFaction(f)} />
        ))}
      </div>
      {selectedFaction && <FactionModal faction={selectedFaction} onClose={() => setSelectedFaction(null)} />}
    </div>
  );
}
