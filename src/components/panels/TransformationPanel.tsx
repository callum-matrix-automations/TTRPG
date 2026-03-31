"use client";

import { Shield, Star, AlertTriangle, Dna } from "lucide-react";
import { transformation, playerCharacter } from "@/data/placeholder";
import AppearanceView from "@/components/shared/AppearanceView";
import { AvatarChip, ChipRow } from "@/components/ui/avatar-chip";

export default function TransformationPanel() {
  const t = transformation;

  if (!t.active) {
    return (
      <div className="flex flex-col h-full">
        <div className="panel-header">
          <Dna size={14} className="text-[var(--color-gold)]" />
          Transformation
        </div>
        <div className="panel-content flex items-center justify-center">
          <div className="text-center py-8">
            <Shield size={24} className="mx-auto mb-2" style={{ color: "var(--color-text-muted)" }} />
            <p className="text-xs text-[var(--color-text-muted)]">No active transformation</p>
            <p className="text-[0.6rem] text-[var(--color-text-muted)] mt-1">
              You are not under any faction&apos;s influence
            </p>
          </div>
        </div>
      </div>
    );
  }

  const identityColor = t.identity > 50 ? "var(--color-success)" : t.identity > 25 ? "var(--color-gold)" : "var(--color-danger)";
  const willpowerColor = t.willpower > 50 ? "var(--color-mana)" : t.willpower > 25 ? "var(--color-gold)" : "var(--color-danger)";
  const conditioningColor = t.conditioning < 25 ? "var(--color-purple)" : t.conditioning < 50 ? "var(--color-gold)" : "var(--color-danger)";

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <Dna size={14} className="text-[var(--color-gold)]" />
        Transformation
        <span
          className="ml-auto badge"
          style={{ background: `${t.factionColor}22`, color: t.factionColor ?? "var(--color-gold)" }}
        >
          {t.overallProgress}%
        </span>
      </div>
      <div className="panel-content space-y-4">
        {/* Faction & Status */}
        <div
          className="card"
          style={{ borderLeft: `3px solid ${t.factionColor}` }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: t.factionColor ?? "var(--color-gold)" }} />
            <span className="text-xs font-semibold" style={{ fontFamily: "var(--font-heading)", color: "var(--color-pink-light)" }}>
              {t.factionName}
            </span>
          </div>
          <span className="text-[0.65rem] text-[var(--color-text-muted)]">
            Stage {t.currentThreshold}: {t.thresholdName}
          </span>
          {t.assignedTemplate && (
            <div className="mt-1">
              <span className="badge" style={{ background: `${t.factionColor}22`, color: t.factionColor ?? "var(--color-gold)" }}>
                Template: {t.assignedTemplate}
              </span>
            </div>
          )}
        </div>

        {/* Core Metrics */}
        <div className="space-y-3">
          {/* Identity */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Shield size={13} style={{ color: identityColor }} />
                <span className="text-xs text-[var(--color-text-secondary)]">Identity</span>
              </div>
              <span className="stat-value text-xs">{t.identity}/100</span>
            </div>
            <div className="progress-bar-bg" style={{ height: "8px" }}>
              <div className="progress-bar-fill" style={{ width: `${t.identity}%`, background: identityColor, boxShadow: `0 0 6px ${identityColor}44` }} />
            </div>
            <p className="text-[0.55rem] text-[var(--color-text-muted)] mt-0.5">
              {t.identity > 75 ? "Your sense of self is intact." : t.identity > 50 ? "Something feels different. You're not sure what." : t.identity > 25 ? "Who were you before? The memories are getting fuzzy." : "You can barely remember your old life."}
            </p>
          </div>

          {/* Willpower */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <Star size={13} style={{ color: willpowerColor }} />
                <span className="text-xs text-[var(--color-text-secondary)]">Willpower</span>
              </div>
              <span className="stat-value text-xs">{t.willpower}/100</span>
            </div>
            <div className="progress-bar-bg" style={{ height: "8px" }}>
              <div className="progress-bar-fill" style={{ width: `${t.willpower}%`, background: willpowerColor, boxShadow: `0 0 6px ${willpowerColor}44` }} />
            </div>
            <p className="text-[0.55rem] text-[var(--color-text-muted)] mt-0.5">
              Mental defense modifier: {t.willpower > 75 ? "+5" : t.willpower > 50 ? "+3" : t.willpower > 25 ? "+0" : t.willpower > 0 ? "-3" : "-5"}
            </p>
          </div>

          {/* Conditioning */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1.5">
                <AlertTriangle size={13} style={{ color: conditioningColor }} />
                <span className="text-xs text-[var(--color-text-secondary)]">Conditioning</span>
              </div>
              <span className="stat-value text-xs">{t.conditioning}/100</span>
            </div>
            <div className="progress-bar-bg" style={{ height: "8px" }}>
              <div className="progress-bar-fill" style={{ width: `${t.conditioning}%`, background: conditioningColor, boxShadow: t.conditioning > 50 ? `0 0 6px rgba(239,68,68,0.4)` : "none" }} />
            </div>
            <p className="text-[0.55rem] text-[var(--color-text-muted)] mt-0.5">
              {t.conditioning < 10 ? "Minimal exposure." : t.conditioning < 25 ? "You've been exposed to something." : t.conditioning < 50 ? "Their influence is taking hold." : t.conditioning < 75 ? "Resistance is becoming difficult." : "Their programming is nearly complete."}
            </p>
          </div>
        </div>

        {/* Physical Changes */}
        {t.physicalChanges.length > 0 && (
          <div>
            <h4 className="text-[0.65rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
              Physical Changes
            </h4>
            <ChipRow>
              {t.physicalChanges.map((change) => (
                <AvatarChip
                  key={change.bodyPart}
                  label={`${change.bodyPart} ${change.changePercent}%`}
                  variant="custom"
                  customColor={t.factionColor ?? "var(--color-gold)"}
                  size="sm"
                />
              ))}
            </ChipRow>
          </div>
        )}

        {/* Current Appearance */}
        <div>
          <h4 className="text-[0.65rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
            Current Appearance
          </h4>
          <AppearanceView
            appearance={playerCharacter.appearance}
            transformation={t}
            name={playerCharacter.name}
            portrait="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80"
          />
        </div>

        {/* Overall Progress */}
        <div
          className="rounded-lg p-3 text-center"
          style={{ background: "var(--color-bg-deep)", border: "1px solid var(--color-border)" }}
        >
          <span className="text-[0.65rem] text-[var(--color-text-muted)]">Overall Transformation</span>
          <div className="progress-bar-bg mt-1.5" style={{ height: "10px" }}>
            <div
              className="progress-bar-fill"
              style={{
                width: `${t.overallProgress}%`,
                background: `linear-gradient(90deg, var(--color-purple), ${t.factionColor ?? "var(--color-danger)"})`,
                boxShadow: `0 0 8px ${t.factionColor}44`,
              }}
            />
          </div>
          <span className="stat-value text-sm mt-1 block">{t.overallProgress}%</span>
        </div>
      </div>
    </div>
  );
}
