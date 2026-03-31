"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Heart, Star, BookOpen, EyeOff, Eye, Sparkles, Info, Zap } from "lucide-react";
import { playerCharacter, transformation } from "@/data/placeholder";
import AppearanceView from "@/components/shared/AppearanceView";
import { AvatarChip, ChipRow } from "@/components/ui/avatar-chip";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { KpiCard } from "@/components/ui/kpi-card";
import { ProgressBar } from "@/components/ui/progress-bar";

// ── Stat Block with Modifier Popup (portaled) ──
function StatBlock({
  label,
  score,
  mod,
  modifiers,
}: {
  label: string;
  score: number;
  mod: number;
  modifiers: { source: string; value: number }[];
}) {
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  // Position the popup at the top-right of the card
  useEffect(() => {
    if (!open || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPos({ top: rect.top, left: rect.right + 8 });
  }, [open]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        cardRef.current && !cardRef.current.contains(target) &&
        popupRef.current && !popupRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const total = modifiers.reduce((sum, m) => sum + m.value, 0);

  return (
    <>
      <div
        ref={cardRef}
        className="flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all duration-150"
        style={{
          background: "var(--color-bg-elevated)",
          border: `1px solid ${open ? "var(--color-border-strong)" : "var(--color-border)"}`,
          boxShadow: open ? "0 0 8px var(--color-gold-glow)" : "none",
        }}
        onClick={() => setOpen((p) => !p)}
      >
        <span className="text-[0.6rem] font-semibold tracking-wider text-[var(--color-text-muted)] uppercase">
          {label}
        </span>
        <span className="stat-value text-lg leading-none mt-1">{score}</span>
        <span
          className="text-xs mt-0.5 px-1.5 rounded"
          style={{ background: "var(--color-gold-subtle)", color: "var(--color-gold-light)" }}
        >
          {mod >= 0 ? `+${mod}` : mod}
        </span>
      </div>

      {/* Modifier Popup — portaled to body, fixed position above everything */}
      {open && createPortal(
        <div
          ref={popupRef}
          className="fixed rounded-lg p-3"
          style={{
            top: `${pos.top}px`,
            left: `${pos.left}px`,
            zIndex: 9999,
            width: "200px",
            background: "var(--color-bg-surface)",
            border: "1px solid var(--color-border-strong)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.6), 0 0 12px var(--color-gold-glow)",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-1.5 mb-2">
            <Info size={11} style={{ color: "var(--color-gold)" }} />
            <span
              className="text-[0.65rem] font-semibold uppercase tracking-wider"
              style={{ color: "var(--color-pink-light)", fontFamily: "var(--font-heading)" }}
            >
              {label} Breakdown
            </span>
          </div>

          {/* Modifier rows */}
          <div className="space-y-1 mb-2">
            {modifiers.map((m, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-2 py-1 rounded"
                style={{ background: "var(--color-bg-elevated)" }}
              >
                <span className="text-[0.6rem] text-[var(--color-text-secondary)]">{m.source}</span>
                <span className="stat-value text-[0.65rem]">
                  {i === 0 ? m.value : (m.value >= 0 ? `+${m.value}` : m.value)}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div
            className="flex items-center justify-between px-2 py-1 rounded"
            style={{
              background: "var(--color-gold-subtle)",
              border: "1px solid var(--color-border)",
            }}
          >
            <span className="text-[0.6rem] font-semibold text-[var(--color-text-gold)]">Total</span>
            <span className="stat-value text-xs">{total}</span>
          </div>

          {/* Modifier */}
          <div className="text-center mt-1.5">
            <span className="text-[0.55rem] text-[var(--color-text-muted)]">Modifier: </span>
            <span className="stat-value text-[0.65rem]">{mod >= 0 ? `+${mod}` : mod}</span>
            <span className="text-[0.55rem] text-[var(--color-text-muted)]"> = floor(({total} - 10) / 2)</span>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}

// ── Main Component ──
export default function CharacterSheet() {
  const pc = playerCharacter;
  const hpPercent = (pc.hp.current / pc.hp.max) * 100;
  const energyPercent = (pc.energy.current / pc.energy.max) * 100;
  const energyColor = energyPercent > 50 ? "var(--color-mana)" : energyPercent > 25 ? "var(--color-gold)" : "var(--color-danger)";
  const xpPercent = (pc.xp.current / pc.xp.next) * 100;

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <Star size={14} className="text-[var(--color-gold)]" />
        Character
      </div>
      <div className="panel-content space-y-3">
        {/* Portrait + Name (always visible) */}
        <div className="flex flex-col items-center gap-2">
          <div
            className="w-24 h-24 rounded-full overflow-hidden"
            style={{
              border: "2px solid var(--color-border-strong)",
              boxShadow: "0 0 16px var(--color-gold-glow)",
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80"
              alt={`Portrait of ${pc.name}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center">
            <h3 className="text-base font-bold gold-glow leading-tight">{pc.name}</h3>
            <p className="text-[0.7rem] text-[var(--color-text-secondary)]">
              Level {pc.level} {pc.race} {pc.class}
            </p>
          </div>
        </div>

        {/* HP Bar (always visible) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <Heart size={12} className="text-[var(--color-danger)]" />
              <span className="text-[0.65rem] text-[var(--color-text-secondary)]">HP</span>
            </div>
            <span className="stat-value text-xs">{pc.hp.current}/{pc.hp.max}</span>
          </div>
          <ProgressBar value={hpPercent} color="var(--color-danger)" glowColor="rgba(239,68,68,0.4)" />
        </div>

        {/* Energy Bar (always visible) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <Zap size={12} style={{ color: energyColor }} />
              <span className="text-[0.65rem] text-[var(--color-text-secondary)]">Energy</span>
            </div>
            <span className="stat-value text-xs">{pc.energy.current}/{pc.energy.max}</span>
          </div>
          <ProgressBar value={energyPercent} color={energyColor} glowColor={`${energyColor}44`} />
        </div>

        {/* XP Bar (always visible) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <Star size={12} className="text-[var(--color-xp)]" />
              <span className="text-[0.65rem] text-[var(--color-text-secondary)]">XP</span>
            </div>
            <span className="stat-value text-xs">
              {pc.xp.current.toLocaleString()}/{pc.xp.next.toLocaleString()}
            </span>
          </div>
          <ProgressBar value={xpPercent} color="var(--color-xp)" glowColor="rgba(167,139,250,0.4)" />
        </div>

        {/* ── ACCORDION SECTIONS ── */}
        <Accordion type="multiple" defaultValue={["attributes", "appearance"]} className="-space-y-px">

          {/* Attributes */}
          <AccordionItem value="attributes" className="px-3 first:rounded-t-lg last:rounded-b-lg" style={{ background: "var(--color-bg-base)", borderColor: "var(--color-border)" }}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl" style={{ background: "var(--color-gold-subtle)", color: "var(--color-gold)" }}>
                  <Star size={16} />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-xs font-semibold" style={{ color: "var(--color-text-primary)" }}>Attributes</span>
                  <span className="text-[0.6rem]" style={{ color: "var(--color-text-muted)" }}>STR · DEX · CON · INT · WIS · CHA</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="ps-12">
              <div className="grid grid-cols-3 gap-1.5">
                {Object.entries(pc.stats).map(([key, val]) => (
                  <KpiCard
                    key={key}
                    label={key}
                    value={val.score}
                    delta={val.mod >= 0 ? `+${val.mod}` : `${val.mod}`}
                    trend={val.mod > 0 ? "up" : val.mod < 0 ? "down" : "flat"}
                    tone="gold"
                    size="sm"
                    compact
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Skills */}
          <AccordionItem value="skills" className="px-3 first:rounded-t-lg last:rounded-b-lg" style={{ background: "var(--color-bg-base)", borderColor: "var(--color-border)" }}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl" style={{ background: "rgba(96,165,250,0.1)", color: "var(--color-mana)" }}>
                  <Info size={16} />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-xs font-semibold" style={{ color: "var(--color-text-primary)" }}>Skills</span>
                  <span className="text-[0.6rem]" style={{ color: "var(--color-text-muted)" }}>{pc.skills.length} skills</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="ps-12">
              <div className="space-y-1">
                {pc.skills.map((skill) => (
                  <div key={skill.name} className="flex items-center justify-between py-0.5 px-2 rounded text-xs" style={{ background: "var(--color-bg-elevated)" }}>
                    <div className="flex items-center gap-1.5">
                      {skill.expertise && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-gold)]" />}
                      {skill.proficient && !skill.expertise && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-purple-light)]" />}
                      {!skill.proficient && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-bg-deep)]" />}
                      <span className="text-[var(--color-text-secondary)]">{skill.name}</span>
                    </div>
                    <span className="stat-value text-xs">{skill.mod >= 0 ? `+${skill.mod}` : skill.mod}</span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Abilities */}
          <AccordionItem value="abilities" className="px-3 first:rounded-t-lg last:rounded-b-lg" style={{ background: "var(--color-bg-base)", borderColor: "var(--color-border)" }}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl" style={{ background: "rgba(167,139,250,0.1)", color: "var(--color-purple-light)" }}>
                  <BookOpen size={16} />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-xs font-semibold" style={{ color: "var(--color-text-primary)" }}>Abilities</span>
                  <span className="text-[0.6rem]" style={{ color: "var(--color-text-muted)" }}>{pc.abilities.length} abilities</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="ps-12">
              <div className="space-y-1.5">
                {pc.abilities.map((ability) => (
                  <KpiCard
                    key={ability.name}
                    label={ability.name}
                    value={ability.uses ? `${ability.uses.current}/${ability.uses.max}` : "Passive"}
                    caption={ability.uses ? ability.uses.recharge : ability.source}
                    delta={ability.source}
                    trend="flat"
                    tone="purple"
                    size="sm"
                    compact
                    icon={<BookOpen size={12} />}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Status Effects */}
          <AccordionItem value="status" className="px-3 first:rounded-t-lg last:rounded-b-lg" style={{ background: "var(--color-bg-base)", borderColor: "var(--color-border)" }}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl" style={{ background: "rgba(34,197,94,0.1)", color: "var(--color-success)" }}>
                  <Sparkles size={16} />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-xs font-semibold" style={{ color: "var(--color-text-primary)" }}>Status Effects</span>
                  <span className="text-[0.6rem]" style={{ color: "var(--color-text-muted)" }}>{pc.statusEffects.length} active</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="ps-12">
              {pc.statusEffects.length === 0 ? (
                <p className="text-[0.65rem] text-[var(--color-text-muted)] italic">No active effects</p>
              ) : (
                <div className="space-y-1.5">
                  {pc.statusEffects.map((effect) => (
                    <KpiCard
                      key={effect.name}
                      label={effect.name}
                      value={effect.type === "buff" ? "Buff" : "Debuff"}
                      caption={effect.duration}
                      tone={effect.type === "buff" ? "success" : "danger"}
                      size="sm"
                      compact
                      icon={<Sparkles size={12} />}
                    />
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Appearance */}
          <AccordionItem value="appearance" className="px-3 first:rounded-t-lg last:rounded-b-lg" style={{ background: "var(--color-bg-base)", borderColor: "var(--color-border)" }}>
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl" style={{ background: "rgba(255,180,220,0.1)", color: "var(--color-pink)" }}>
                  <Eye size={16} />
                </div>
                <div className="flex flex-col items-start text-left">
                  <span className="text-xs font-semibold" style={{ color: "var(--color-text-primary)" }}>Appearance</span>
                  <span className="text-[0.6rem]" style={{ color: "var(--color-text-muted)" }}>Physical description</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="ps-12">
              <AppearanceView appearance={pc.appearance} transformation={transformation} name={pc.name} portrait="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80" />
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </div>
    </div>
  );
}
