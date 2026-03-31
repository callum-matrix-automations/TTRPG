"use client";

import { Home, MapPin, Coins, Box, Shield, ArrowUp, Wrench, Lock } from "lucide-react";
import { playerProperty, mapLocations } from "@/data/placeholder";
import { KpiCard } from "@/components/ui/kpi-card";
import { GlassHighlight } from "@/components/ui/glass";
import { ProgressBar } from "@/components/ui/progress-bar";
import { AvatarChip, ChipRow } from "@/components/ui/avatar-chip";

const typeLabels: Record<string, string> = {
  rented_room: "Rented Room",
  apartment: "Apartment",
  house: "House",
  estate: "Estate",
};

const typeProgression = ["rented_room", "apartment", "house", "estate"];

export default function PropertyPanel() {
  if (!playerProperty) {
    return (
      <div className="flex flex-col h-full">
        <div className="panel-content flex items-center justify-center">
          <div className="text-center py-8">
            <Home size={24} className="mx-auto mb-2" style={{ color: "var(--color-text-muted)" }} />
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>No property owned</p>
            <p className="text-[0.6rem] mt-1" style={{ color: "var(--color-text-muted)" }}>
              Visit a boarding house or real estate office to rent or buy property.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const prop = playerProperty;
  const location = mapLocations.find((l) => l.id === prop.locationId);
  const currentTierIndex = typeProgression.indexOf(prop.type);
  const installedCount = prop.upgrades.filter((u) => u.installed).length;
  const upgradeProgress = (installedCount / prop.upgrades.length) * 100;

  return (
    <div className="flex flex-col h-full">
      <div className="panel-content space-y-3">

        {/* Property Header — KPI style */}
        <KpiCard
          label={typeLabels[prop.type]}
          value={prop.name}
          caption={location?.name ?? "Unknown Location"}
          tone="gold"
          size="md"
          icon={<Home size={14} />}
        />

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-2">
          <KpiCard
            label="Monthly Rent"
            value={prop.monthlyCost ? `$${prop.monthlyCost}` : "Owned"}
            tone={prop.monthlyCost ? "warning" : "success"}
            size="sm"
            compact
            icon={<Coins size={10} />}
          />
          <KpiCard
            label="Stash Capacity"
            value={`${prop.stashCapacity} items`}
            tone="default"
            size="sm"
            compact
            icon={<Box size={10} />}
          />
        </div>

        {/* Features */}
        <ChipRow>
          {prop.safeRest && (
            <AvatarChip label="Safe Rest" variant="success" size="sm" icon={<Shield size={10} />} />
          )}
          <AvatarChip label={location?.name ?? "Unknown"} variant="default" size="sm" icon={<MapPin size={10} />} />
          {prop.monthlyCost && (
            <AvatarChip label={`$${prop.monthlyCost}/mo`} variant="warning" size="sm" icon={<Coins size={10} />} />
          )}
        </ChipRow>

        {/* Upgrades */}
        <GlassHighlight title={`Upgrades (${installedCount}/${prop.upgrades.length})`} accentColor="var(--color-purple-light)">
          <ProgressBar value={upgradeProgress} color="var(--color-purple-light)" glowColor="rgba(167,139,250,0.3)" className="mb-3" />
          <div className="space-y-2">
            {prop.upgrades.map((upgrade) => (
              <div
                key={upgrade.name}
                className="flex items-start gap-2.5 px-3 py-2 rounded-lg transition-all duration-150"
                style={{
                  background: upgrade.installed ? "rgba(34,197,94,0.06)" : "rgba(13,8,20,0.3)",
                  border: `1px solid ${upgrade.installed ? "rgba(34,197,94,0.2)" : "var(--color-border-subtle)"}`,
                  opacity: upgrade.installed ? 1 : 0.75,
                }}
              >
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    background: upgrade.installed ? "rgba(34,197,94,0.12)" : "var(--color-bg-elevated)",
                    border: `1px solid ${upgrade.installed ? "rgba(34,197,94,0.3)" : "var(--color-border)"}`,
                    color: upgrade.installed ? "var(--color-success)" : "var(--color-text-muted)",
                  }}
                >
                  {upgrade.installed ? <Shield size={12} /> : <Wrench size={12} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.65rem] font-semibold" style={{ color: upgrade.installed ? "var(--color-success)" : "var(--color-text-primary)" }}>
                      {upgrade.name}
                    </span>
                    {!upgrade.installed && (
                      <span className="stat-value text-[0.55rem]" style={{ color: "var(--color-gold)" }}>${upgrade.cost}</span>
                    )}
                  </div>
                  <p className="text-[0.55rem] mt-0.5" style={{ color: "var(--color-text-muted)" }}>{upgrade.description}</p>
                  {upgrade.installed && (
                    <div className="mt-1">
                      <AvatarChip label="Installed" variant="success" size="xs" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </GlassHighlight>

        {/* Upgrade Tier */}
        {currentTierIndex < typeProgression.length - 1 && (
          <div
            className="rounded-xl p-4 text-center cursor-pointer transition-all duration-150 group"
            style={{ background: "var(--color-bg-elevated)", border: "1px dashed var(--color-border)" }}
            onClick={() => console.log("Upgrade property tier")}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 transition-all duration-200 group-hover:scale-110"
              style={{ background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.3)", color: "var(--color-purple-light)" }}
            >
              <ArrowUp size={18} />
            </div>
            <span className="text-xs font-semibold" style={{ color: "var(--color-purple-light)" }}>
              Upgrade to {typeLabels[typeProgression[currentTierIndex + 1]]}
            </span>
            <p className="text-[0.55rem] mt-1" style={{ color: "var(--color-text-muted)" }}>
              Visit a real estate office to upgrade your accommodation
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
