"use client";

import { User, Heart, Flag, Eye } from "lucide-react";
import { currentNpc } from "@/data/placeholder";

function DispositionBar({ value }: { value: number }) {
  // Scale: -100 to 100, display as 0-100% bar
  const percent = ((value + 100) / 200) * 100;
  const hue = (value + 100) * 0.6; // red → green

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[0.65rem] text-[var(--color-text-muted)]">
          Disposition
        </span>
        <span className="stat-value text-xs">{value}</span>
      </div>
      <div className="progress-bar-bg">
        <div
          className="progress-bar-fill"
          style={{
            width: `${percent}%`,
            background: `hsl(${hue}, 70%, 50%)`,
            boxShadow: `0 0 6px hsla(${hue}, 70%, 50%, 0.4)`,
          }}
        />
      </div>
      <span
        className="text-[0.6rem] mt-0.5 inline-block"
        style={{ color: `hsl(${hue}, 70%, 65%)` }}
      >
        {currentNpc.dispositionLabel}
      </span>
    </div>
  );
}

export default function NpcPanel() {
  const npc = currentNpc;

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <User size={14} className="text-[var(--color-gold)]" />
        NPC — {npc.name}
      </div>
      <div className="panel-content space-y-3">
        {/* Portrait Placeholder */}
        <div
          className="w-full aspect-square rounded-lg flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, var(--color-bg-elevated) 0%, var(--color-bg-deep) 100%)",
            border: "2px solid var(--color-border)",
            boxShadow:
              "0 0 20px var(--color-gold-glow), inset 0 0 30px rgba(0,0,0,0.5)",
          }}
        >
          <div className="text-center">
            <User
              size={48}
              className="mx-auto mb-2"
              style={{ color: "var(--color-text-muted)" }}
            />
            <span className="text-[0.65rem] text-[var(--color-text-muted)]">
              Portrait
            </span>
          </div>
        </div>

        {/* Name & Status */}
        <div className="text-center">
          <h3 className="text-sm font-bold gold-glow">{npc.name}</h3>
          <div className="flex items-center justify-center gap-2 mt-1">
            <Flag size={11} className="text-[var(--color-gold)]" />
            <span className="text-[0.65rem] text-[var(--color-text-secondary)]">
              {npc.faction} — {npc.factionRank}
            </span>
          </div>
        </div>

        {/* Disposition */}
        <DispositionBar value={npc.disposition} />

        {/* Traits */}
        <div>
          <h4 className="text-[0.65rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">
            Traits
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {npc.traits.map((trait) => (
              <span
                key={trait}
                className="badge"
                style={{
                  background: "var(--color-bg-elevated)",
                  color: "var(--color-purple-light)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        {/* Appearance */}
        <div>
          <h4 className="text-[0.65rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">
            <Eye size={11} className="inline mr-1" />
            Appearance
          </h4>
          <div className="space-y-1 text-[0.7rem] text-[var(--color-text-secondary)]">
            {Object.entries(npc.appearance).map(([key, val]) => (
              <p key={key}>
                <span className="text-[var(--color-pink-dim)] capitalize">
                  {key}:
                </span>{" "}
                {val}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
