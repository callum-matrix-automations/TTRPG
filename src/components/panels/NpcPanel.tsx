"use client";

import { useState } from "react";
import { Users, Flag, Eye, HelpCircle, Swords, AlertTriangle, User, ChevronDown, Heart } from "lucide-react";
import {
  sceneNpcs,
  type SceneNpc,
  type ActiveNpc,
  type PassiveNpc,
  type BackgroundNpc,
} from "@/data/placeholder";

const dispositionColor = (d: number) => {
  const hue = ((d + 100) / 200) * 120;
  return `hsl(${hue}, 70%, 55%)`;
};

const tierLabel: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "var(--color-gold)" },
  passive: { label: "Present", color: "var(--color-purple-light)" },
  background: { label: "Background", color: "var(--color-text-muted)" },
};

// ── NPC Selector ──
function NpcSelector({
  npcs,
  selectedId,
  onSelect,
}: {
  npcs: SceneNpc[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  // Only show non-background NPCs in the selector
  const selectableNpcs = npcs.filter((n) => n.tier !== "background");
  if (selectableNpcs.length <= 1) return null;

  return (
    <div
      className="flex gap-2 px-3 py-2 overflow-x-auto shrink-0"
      style={{
        borderBottom: "1px solid var(--color-border)",
        background: "linear-gradient(135deg, var(--color-bg-elevated) 0%, var(--color-bg-base) 100%)",
      }}
    >
      {selectableNpcs.map((npc) => {
        const isSelected = npc.id === selectedId;
        return (
          <button
            key={npc.id}
            onClick={() => onSelect(npc.id)}
            className="flex flex-col items-center gap-1 shrink-0 cursor-pointer transition-all duration-150"
            style={{ opacity: isSelected ? 1 : 0.5 }}
            title={npc.name}
            aria-label={npc.name}
          >
            <div className="relative">
              <div
                className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center transition-all duration-150"
                style={{
                  border: `2px solid ${isSelected ? npc.factionColor : "var(--color-border)"}`,
                  boxShadow: isSelected ? `0 0 10px ${npc.factionColor}44` : "none",
                  background: "var(--color-bg-deep)",
                }}
              >
                {npc.portrait ? (
                  <img src={npc.portrait} alt={npc.name} className="w-full h-full object-cover" />
                ) : (
                  <HelpCircle size={16} style={{ color: "var(--color-text-muted)" }} />
                )}
              </div>
              {/* Tier dot */}
              <div
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2"
                style={{
                  borderColor: "var(--color-bg-base)",
                  background: tierLabel[npc.tier]?.color ?? "var(--color-text-muted)",
                }}
              />
            </div>
            <span
              className="text-[0.55rem] max-w-[56px] truncate"
              style={{
                color: isSelected ? npc.factionColor : "var(--color-text-muted)",
                fontWeight: isSelected ? 600 : 400,
              }}
            >
              {npc.name.split(" ")[0]}
            </span>
          </button>
        );
      })}
    </div>
  );
}

// ── Active NPC Detail ──
function ActiveNpcDetail({ npc }: { npc: ActiveNpc }) {
  const hue = ((npc.disposition + 100) / 200) * 120;

  return (
    <div className="space-y-3">
      {/* Portrait */}
      <div
        className="w-full aspect-[4/3] rounded-lg relative overflow-hidden"
        style={{ border: `2px solid ${npc.factionColor}44`, boxShadow: `0 0 20px ${npc.factionColor}22` }}
      >
        {npc.portrait ? (
          <img src={npc.portrait} alt={npc.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: "var(--color-bg-deep)" }}>
            <User size={48} style={{ color: "var(--color-text-muted)" }} />
          </div>
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 50%, rgba(13,8,20,0.7) 100%)" }} />
        {/* Tier badge */}
        <div className="absolute top-2 right-2">
          <span
            className="badge"
            style={{ background: "rgba(0,0,0,0.6)", color: "var(--color-gold)", border: "1px solid var(--color-gold-dim)", backdropFilter: "blur(4px)" }}
          >
            Active
          </span>
        </div>
      </div>

      {/* Name & Faction */}
      <div className="text-center">
        <h3 className="text-sm font-bold gold-glow">{npc.name}</h3>
        <div className="flex items-center justify-center gap-2 mt-0.5">
          <Flag size={11} style={{ color: npc.factionColor }} />
          <span className="text-[0.65rem]" style={{ color: npc.factionColor }}>{npc.faction} — {npc.factionRank}</span>
        </div>
        <span className="text-[0.6rem] text-[var(--color-text-muted)]">Level {npc.level} {npc.race} {npc.class}</span>
      </div>

      {/* Disposition */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[0.65rem] text-[var(--color-text-muted)]">Disposition</span>
          <div className="flex items-center gap-2">
            <span className="text-[0.6rem]" style={{ color: dispositionColor(npc.disposition) }}>{npc.dispositionLabel}</span>
            <span className="stat-value text-xs">{npc.disposition}</span>
          </div>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${((npc.disposition + 100) / 200) * 100}%`, background: `hsl(${hue}, 70%, 50%)`, boxShadow: `0 0 6px hsla(${hue}, 70%, 50%, 0.4)` }} />
        </div>
      </div>

      {/* HP */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1">
            <Heart size={11} style={{ color: npc.hp.current / npc.hp.max > 0.5 ? "var(--color-success)" : npc.hp.current / npc.hp.max > 0.25 ? "var(--color-gold)" : "var(--color-danger)" }} />
            <span className="text-[0.65rem] text-[var(--color-text-muted)]">HP</span>
          </div>
          <span className="stat-value text-xs">{npc.hp.current}/{npc.hp.max}</span>
        </div>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{
              width: `${(npc.hp.current / npc.hp.max) * 100}%`,
              background: npc.hp.current / npc.hp.max > 0.5 ? "var(--color-success)" : npc.hp.current / npc.hp.max > 0.25 ? "var(--color-gold)" : "var(--color-danger)",
              boxShadow: `0 0 6px ${npc.hp.current / npc.hp.max > 0.5 ? "rgba(34,197,94,0.4)" : npc.hp.current / npc.hp.max > 0.25 ? "rgba(218,165,32,0.4)" : "rgba(239,68,68,0.4)"}`,
            }}
          />
        </div>
      </div>

      {/* Attributes */}
      <div>
        <span className="text-[0.65rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Attributes</span>
        <div className="grid grid-cols-6 gap-1 mt-1.5">
          {Object.entries(npc.stats).map(([key, val]) => (
            <div
              key={key}
              className="flex flex-col items-center py-1 rounded"
              style={{ background: "var(--color-bg-deep)" }}
            >
              <span className="text-[0.5rem] text-[var(--color-text-muted)] uppercase">{key}</span>
              <span className="stat-value text-xs">{val.score}</span>
              <span className="text-[0.5rem]" style={{ color: "var(--color-gold-dim)" }}>
                {val.mod >= 0 ? `+${val.mod}` : val.mod}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Threat Impression */}
      <div className="card" style={{ borderLeft: "3px solid var(--color-gold)" }}>
        <div className="flex items-center gap-1.5 mb-1">
          <AlertTriangle size={11} style={{ color: "var(--color-gold)" }} />
          <span className="text-[0.65rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Impression</span>
        </div>
        <p className="text-[0.65rem] text-[var(--color-text-secondary)] italic">{npc.threatImpression}</p>
      </div>

      {/* Observed Capabilities */}
      {npc.observedCapabilities.length > 0 && (
        <div>
          <span className="text-[0.65rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Observed</span>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {npc.observedCapabilities.map((cap) => (
              <span key={cap} className="badge" style={{ background: "var(--color-bg-deep)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}>
                {cap}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Visible Status */}
      {npc.visibleStatus.length > 0 && (
        <div>
          <span className="text-[0.65rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Status</span>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {npc.visibleStatus.map((s) => (
              <span key={s} className="badge" style={{ background: "rgba(218,165,32,0.12)", color: "var(--color-gold)", border: "1px solid var(--color-gold-dim)" }}>
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Traits */}
      <div>
        <span className="text-[0.65rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Traits</span>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {npc.traits.map((trait) => (
            <span key={trait} className="badge" style={{ background: "var(--color-bg-elevated)", color: "var(--color-purple-light)", border: "1px solid var(--color-border)" }}>
              {trait}
            </span>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div>
        <span className="text-[0.65rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
          <Eye size={11} className="inline mr-1" />Appearance
        </span>
        <div className="space-y-1 mt-1.5 text-[0.7rem] text-[var(--color-text-secondary)]">
          {Object.entries(npc.appearance).map(([key, val]) => (
            <p key={key}><span className="text-[var(--color-pink-dim)] capitalize">{key}:</span> {val}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Passive NPC Detail ──
function PassiveNpcDetail({ npc }: { npc: PassiveNpc }) {
  const hue = ((npc.disposition + 100) / 200) * 120;

  return (
    <div className="space-y-3">
      {/* Portrait */}
      <div
        className="w-full aspect-[4/3] rounded-lg relative overflow-hidden"
        style={{ border: `2px solid ${npc.factionColor}44`, boxShadow: `0 0 20px ${npc.factionColor}22` }}
      >
        {npc.portrait ? (
          <img src={npc.portrait} alt={npc.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: "var(--color-bg-deep)" }}>
            <User size={48} style={{ color: "var(--color-text-muted)" }} />
          </div>
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 50%, rgba(13,8,20,0.7) 100%)" }} />
      </div>

      {/* Name & Faction */}
      <div className="text-center">
        <h3 className="text-sm font-bold gold-glow">{npc.name}</h3>
        <div className="flex items-center justify-center gap-2 mt-0.5">
          <Flag size={11} style={{ color: npc.factionColor }} />
          <span className="text-[0.65rem]" style={{ color: npc.factionColor }}>{npc.faction} — {npc.factionRank}</span>
        </div>
        <span className="text-[0.6rem] text-[var(--color-text-muted)]">Level {npc.level} {npc.race}</span>
      </div>

      {/* Disposition */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-[0.65rem] text-[var(--color-text-muted)]">Disposition</span>
          <div className="flex items-center gap-2">
            <span className="text-[0.6rem]" style={{ color: dispositionColor(npc.disposition) }}>{npc.dispositionLabel}</span>
            <span className="stat-value text-xs">{npc.disposition}</span>
          </div>
        </div>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${((npc.disposition + 100) / 200) * 100}%`, background: `hsl(${hue}, 70%, 50%)`, boxShadow: `0 0 6px hsla(${hue}, 70%, 50%, 0.4)` }} />
        </div>
      </div>

      {/* Traits */}
      <div>
        <span className="text-[0.65rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Traits</span>
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {npc.traits.map((trait) => (
            <span key={trait} className="badge" style={{ background: "var(--color-bg-elevated)", color: "var(--color-purple-light)", border: "1px solid var(--color-border)" }}>
              {trait}
            </span>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div>
        <span className="text-[0.65rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
          <Eye size={11} className="inline mr-1" />Appearance
        </span>
        <div className="space-y-1 mt-1.5 text-[0.7rem] text-[var(--color-text-secondary)]">
          {Object.entries(npc.appearance).map(([key, val]) => (
            <p key={key}><span className="text-[var(--color-pink-dim)] capitalize">{key}:</span> {val}</p>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Background NPC Section ──
function BackgroundSection({ npcs }: { npcs: BackgroundNpc[] }) {
  const [open, setOpen] = useState(false);

  if (npcs.length === 0) return null;

  return (
    <div style={{ borderTop: "1px solid var(--color-border-subtle)" }}>
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-3 py-2 cursor-pointer"
      >
        <span className="text-[0.6rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
          Background ({npcs.length})
        </span>
        <ChevronDown
          size={12}
          className="transition-transform duration-200"
          style={{ color: "var(--color-text-muted)", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-200 ease-in-out"
        style={{ maxHeight: open ? "400px" : "0px", opacity: open ? 1 : 0 }}
      >
        <div className="px-3 pb-3 space-y-1.5">
          {npcs.map((npc) => (
            <div
              key={npc.id}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md"
              style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }}
            >
              <div
                className="w-6 h-6 rounded-full overflow-hidden shrink-0 flex items-center justify-center"
                style={{ background: "var(--color-bg-deep)", border: "1px solid var(--color-border)" }}
              >
                {npc.portrait ? (
                  <img src={npc.portrait} alt={npc.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={10} style={{ color: "var(--color-text-muted)" }} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[0.65rem] text-[var(--color-text-secondary)]">{npc.name}</span>
                <p className="text-[0.55rem] text-[var(--color-text-muted)] truncate">{npc.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Panel ──
export default function NpcPanel() {
  const nonBackground = sceneNpcs.filter((n): n is ActiveNpc | PassiveNpc => n.tier === "active" || n.tier === "passive");
  const backgroundNpcs = sceneNpcs.filter((n): n is BackgroundNpc => n.tier === "background");
  const [selectedId, setSelectedId] = useState(nonBackground[0]?.id ?? "");
  const selectedNpc = nonBackground.find((n) => n.id === selectedId) ?? nonBackground[0];

  if (sceneNpcs.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="panel-header">
          <Users size={14} className="text-[var(--color-gold)]" />
          NPCs
        </div>
        <div className="panel-content flex items-center justify-center">
          <p className="text-xs text-[var(--color-text-muted)] italic">No NPCs in this scene</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <Users size={14} className="text-[var(--color-gold)]" />
        NPCs
        <span className="ml-auto badge" style={{ background: "var(--color-gold-subtle)", color: "var(--color-gold-light)" }}>
          {sceneNpcs.length}
        </span>
      </div>

      {/* NPC Selector */}
      <NpcSelector npcs={sceneNpcs} selectedId={selectedId} onSelect={setSelectedId} />

      {/* Selected NPC Detail */}
      <div className="flex-1 overflow-y-auto">
        <div className="panel-content">
          {selectedNpc && selectedNpc.tier === "active" && (
            <ActiveNpcDetail key={selectedNpc.id} npc={selectedNpc as ActiveNpc} />
          )}
          {selectedNpc && selectedNpc.tier === "passive" && (
            <PassiveNpcDetail key={selectedNpc.id} npc={selectedNpc as PassiveNpc} />
          )}
        </div>

        {/* Background NPCs — collapsible at bottom */}
        <BackgroundSection npcs={backgroundNpcs} />
      </div>
    </div>
  );
}
