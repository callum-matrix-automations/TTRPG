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
import AppearanceView from "@/components/shared/AppearanceView";
import { AvatarChip, ChipRow } from "@/components/ui/avatar-chip";
import { KpiCard } from "@/components/ui/kpi-card";
import { ProgressBar } from "@/components/ui/progress-bar";

const dispositionColor = (d: number) => {
  const hue = ((d + 100) / 200) * 120;
  return `hsl(${hue}, 70%, 55%)`;
};

const tierLabel: Record<string, { label: string; color: string }> = {
  active: { label: "Active", color: "var(--color-gold)" },
  passive: { label: "Present", color: "var(--color-purple-light)" },
  background: { label: "Background", color: "var(--color-text-muted)" },
};

// NpcSelector removed — now using NpcAvatars component

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
        <ProgressBar value={((npc.disposition + 100) / 200) * 100} color={`hsl(${hue}, 70%, 50%)`} glowColor={`hsla(${hue}, 70%, 50%, 0.4)`} />
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
        <ProgressBar
          value={(npc.hp.current / npc.hp.max) * 100}
          color={npc.hp.current / npc.hp.max > 0.5 ? "var(--color-success)" : npc.hp.current / npc.hp.max > 0.25 ? "var(--color-gold)" : "var(--color-danger)"}
          glowColor={npc.hp.current / npc.hp.max > 0.5 ? "rgba(34,197,94,0.4)" : npc.hp.current / npc.hp.max > 0.25 ? "rgba(218,165,32,0.4)" : "rgba(239,68,68,0.4)"}
        />
      </div>

      {/* Attributes */}
      <div>
        <span className="text-[0.65rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Attributes</span>
        <div className="grid grid-cols-3 gap-1 mt-1.5">
          {Object.entries(npc.stats).map(([key, val]) => (
            <KpiCard key={key} label={key} value={val.score} delta={val.mod >= 0 ? `+${val.mod}` : `${val.mod}`} trend={val.mod > 0 ? "up" : val.mod < 0 ? "down" : "flat"} tone="gold" size="sm" compact />
          ))}
        </div>
      </div>

      {/* Threat Impression */}
      <KpiCard
        label="Impression"
        value={npc.threatImpression}
        tone="warning"
        size="sm"
        icon={<AlertTriangle size={12} />}
      />

      {/* Observed Capabilities */}
      {npc.observedCapabilities.length > 0 && (
        <div>
          <span className="text-[0.65rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Observed</span>
          <ChipRow className="mt-1.5">
            {npc.observedCapabilities.map((cap) => (
              <AvatarChip key={cap} label={cap} variant="default" size="xs" icon={<Eye size={9} />} />
            ))}
          </ChipRow>
        </div>
      )}

      {/* Visible Status */}
      {npc.visibleStatus.length > 0 && (
        <div>
          <span className="text-[0.65rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Status</span>
          <ChipRow className="mt-1.5">
            {npc.visibleStatus.map((s) => (
              <AvatarChip key={s} label={s} variant="warning" size="xs" />
            ))}
          </ChipRow>
        </div>
      )}

      {/* Traits */}
      <div>
        <span className="text-[0.65rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Traits</span>
        <ChipRow className="mt-1.5">
          {npc.traits.map((trait) => (
            <AvatarChip key={trait} label={trait} variant="purple" size="xs" />
          ))}
        </ChipRow>
      </div>

      {/* Appearance */}
      <div>
        <span className="text-[0.65rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
          <Eye size={11} className="inline mr-1" />Appearance
        </span>
        <div className="mt-1.5">
          <AppearanceView appearance={npc.detailedAppearance} transformation={npc.transformation} name={npc.name} portrait={npc.portrait} />
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
        <ProgressBar value={((npc.disposition + 100) / 200) * 100} color={`hsl(${hue}, 70%, 50%)`} glowColor={`hsla(${hue}, 70%, 50%, 0.4)`} />
      </div>

      {/* Traits */}
      <div>
        <span className="text-[0.65rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Traits</span>
        <ChipRow className="mt-1.5">
          {npc.traits.map((trait) => (
            <AvatarChip key={trait} label={trait} variant="purple" size="xs" />
          ))}
        </ChipRow>
      </div>

      {/* Appearance */}
      <div>
        <span className="text-[0.65rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
          <Eye size={11} className="inline mr-1" />Appearance
        </span>
        <div className="mt-1.5">
          <AppearanceView appearance={npc.detailedAppearance} transformation={npc.transformation} name={npc.name} portrait={npc.portrait} />
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
              className="group flex items-start gap-2.5 px-2.5 py-1.5 rounded-md transition-all duration-200"
              style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }}
            >
              <div
                className="w-6 h-6 rounded-full overflow-hidden shrink-0 flex items-center justify-center mt-0.5"
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
                <p className="text-[0.55rem] text-[var(--color-text-muted)] truncate group-hover:whitespace-normal group-hover:overflow-visible transition-all duration-200">{npc.description}</p>
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

      {/* NPC Selector — Chips */}
      {nonBackground.length > 1 && (
        <div className="px-3 py-2" style={{ borderBottom: "1px solid var(--color-border)", background: "linear-gradient(135deg, var(--color-bg-elevated) 0%, var(--color-bg-base) 100%)" }}>
          <ChipRow>
            {nonBackground.map((npc) => (
              <AvatarChip
                key={npc.id}
                label={npc.name}
                portrait={npc.portrait}
                variant={selectedId === npc.id ? "custom" : "default"}
                customColor={npc.factionColor}
                size="sm"
                onClick={() => setSelectedId(npc.id)}
              />
            ))}
          </ChipRow>
        </div>
      )}

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
