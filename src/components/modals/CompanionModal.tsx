"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Heart, Star, BookOpen, Eye, HelpCircle, Flag, Swords, Sparkles, Shirt, Info } from "lucide-react";
import { type CompanionNpc } from "@/data/placeholder";
import AppearanceModal from "./AppearanceModal";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AvatarChip, ChipRow } from "@/components/ui/avatar-chip";
import { KpiCard } from "@/components/ui/kpi-card";
import { ProgressBar } from "@/components/ui/progress-bar";

export default function CompanionModal({
  npc,
  onClose,
}: {
  npc: CompanionNpc;
  onClose: () => void;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [appearanceOpen, setAppearanceOpen] = useState(false);

  const hpPercent = (npc.hp.current / npc.hp.max) * 100;
  const hpColor = hpPercent > 50 ? "var(--color-success)" : hpPercent > 25 ? "var(--color-gold)" : "var(--color-danger)";

  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 200);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) handleClose();
  };

  const isOpen = visible && !closing;

  return <>{createPortal(
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: isOpen ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0)",
        backdropFilter: isOpen ? "blur(4px)" : "blur(0px)",
        transition: "background 200ms ease, backdrop-filter 200ms ease",
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-md mx-4 rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--color-bg-surface) 0%, var(--color-bg-base) 100%)",
          border: `1px solid ${npc.factionColor}66`,
          boxShadow: `0 24px 48px rgba(0,0,0,0.6), 0 0 24px ${npc.factionColor}22`,
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "scale(1) translateY(0)" : "scale(0.95) translateY(12px)",
          transition: "opacity 200ms ease, transform 200ms ease",
        }}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150"
          style={{ background: "rgba(0,0,0,0.5)", border: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}
          aria-label="Close"
        >
          <X size={14} />
        </button>

        <div className="max-h-[80vh] overflow-y-auto">
          <div className="px-5 pt-5 pb-5 space-y-3">
            {/* Portrait + Name */}
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-full overflow-hidden shrink-0 flex items-center justify-center"
                style={{ border: `2px solid ${npc.factionColor}`, boxShadow: `0 0 16px ${npc.factionColor}33`, background: "var(--color-bg-deep)" }}
              >
                {npc.portrait ? (
                  <img src={npc.portrait} alt={npc.name} className="w-full h-full object-cover" />
                ) : (
                  <HelpCircle size={24} style={{ color: "var(--color-text-muted)" }} />
                )}
              </div>
              <div>
                <h2 className="text-base font-bold leading-tight" style={{ fontFamily: "var(--font-heading)", color: "var(--color-pink-light)" }}>
                  {npc.name}
                </h2>
                <p className="text-[0.7rem] text-[var(--color-text-secondary)]">
                  Level {npc.level} {npc.race} {npc.class}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Flag size={10} style={{ color: npc.factionColor }} />
                  <span className="text-[0.6rem]" style={{ color: npc.factionColor }}>{npc.faction} — {npc.factionRank}</span>
                </div>
              </div>
            </div>

            {/* HP Bar */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <Heart size={12} style={{ color: hpColor }} />
                  <span className="text-[0.65rem] text-[var(--color-text-secondary)]">HP</span>
                </div>
                <span className="stat-value text-xs">{npc.hp.current}/{npc.hp.max}</span>
              </div>
              <ProgressBar value={hpPercent} color={hpColor} glowColor={`${hpColor}44`} />
            </div>

            {/* ── ACCORDION SECTIONS ── */}
            <Accordion type="multiple" defaultValue={["attributes"]} className="-space-y-px">

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
                    {Object.entries(npc.stats).map(([key, val]) => (
                      <KpiCard key={key} label={key} value={val.score} delta={val.mod >= 0 ? `+${val.mod}` : `${val.mod}`} trend={val.mod > 0 ? "up" : val.mod < 0 ? "down" : "flat"} tone="gold" size="sm" compact />
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
                      <span className="text-[0.6rem]" style={{ color: "var(--color-text-muted)" }}>{npc.skills.length} skills</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="ps-12">
                  <div className="space-y-1">
                    {npc.skills.map((skill) => (
                      <div key={skill.name} className="flex items-center justify-between py-0.5 px-2 rounded text-xs" style={{ background: "var(--color-bg-elevated)" }}>
                        <div className="flex items-center gap-1.5">
                          {skill.proficient && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-purple-light)]" />}
                          {!skill.proficient && <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-bg-deep)]" />}
                          <span style={{ color: "var(--color-text-secondary)" }}>{skill.name}</span>
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
                      <span className="text-[0.6rem]" style={{ color: "var(--color-text-muted)" }}>{npc.abilities.length} abilities</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="ps-12">
                  <div className="space-y-1.5">
                    {npc.abilities.map((ability) => (
                      <KpiCard key={ability.name} label={ability.name} value="Passive" caption={ability.description} tone="purple" size="sm" compact icon={<BookOpen size={12} />} />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Gear */}
              <AccordionItem value="gear" className="px-3 first:rounded-t-lg last:rounded-b-lg" style={{ background: "var(--color-bg-base)", borderColor: "var(--color-border)" }}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl" style={{ background: "var(--color-gold-subtle)", color: "var(--color-gold-dim)" }}>
                      <Shirt size={16} />
                    </div>
                    <div className="flex flex-col items-start text-left">
                      <span className="text-xs font-semibold" style={{ color: "var(--color-text-primary)" }}>Gear</span>
                      <span className="text-[0.6rem]" style={{ color: "var(--color-text-muted)" }}>{npc.gear.length} items</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="ps-12">
                  <div className="space-y-1">
                    {npc.gear.map((g) => (
                      <div key={g.slot} className="flex items-center justify-between px-2 py-1 rounded text-xs" style={{ background: "var(--color-bg-elevated)" }}>
                        <span style={{ color: "var(--color-text-muted)" }}>{g.slot}</span>
                        <span style={{ color: "var(--color-text-secondary)" }}>{g.item}</span>
                      </div>
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
                      <span className="text-[0.6rem]" style={{ color: "var(--color-text-muted)" }}>{npc.statusEffects.length} active</span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="ps-12">
                  {npc.statusEffects.length === 0 ? (
                    <p className="text-[0.65rem] italic" style={{ color: "var(--color-text-muted)" }}>No active effects</p>
                  ) : (
                    <ChipRow>
                      {npc.statusEffects.map((effect) => (
                        <AvatarChip key={effect.name} label={effect.name} variant={effect.type === "buff" ? "success" : "danger"} icon={<Sparkles size={10} />} size="sm" />
                      ))}
                    </ChipRow>
                  )}
                </AccordionContent>
              </AccordionItem>

            </Accordion>

            {/* Appearance — opens full modal */}
            <button
              onClick={() => setAppearanceOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[0.7rem] font-medium cursor-pointer transition-all duration-150"
              style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}
            >
              <Eye size={13} />
              View Full Appearance
            </button>

            {/* Loyalty + Joined */}
            <div className="flex items-center justify-between text-[0.6rem] pt-1" style={{ color: "var(--color-text-muted)", borderTop: "1px solid var(--color-border-subtle)" }}>
              <span>Loyalty: <span className="stat-value">{npc.loyalty}</span></span>
              <span>Joined: {npc.joinedAt}</span>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )}
  {appearanceOpen && npc.detailedAppearance && (
    <AppearanceModal
      appearance={npc.detailedAppearance}
      transformation={npc.transformation}
      name={npc.name}
      portrait={npc.portrait}
      onClose={() => setAppearanceOpen(false)}
    />
  )}
  </>;
}
