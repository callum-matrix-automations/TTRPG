"use client";

import { Home, MapPin, Coins, Box, Lock, CheckCircle2, Circle, ArrowUp } from "lucide-react";
import { playerProperty, mapLocations } from "@/data/placeholder";

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
        <div className="panel-header">
          <Home size={14} className="text-[var(--color-gold)]" />
          Property
        </div>
        <div className="panel-content flex items-center justify-center">
          <div className="text-center py-8">
            <Home size={24} className="mx-auto mb-2" style={{ color: "var(--color-text-muted)" }} />
            <p className="text-xs text-[var(--color-text-muted)]">No property owned</p>
            <p className="text-[0.6rem] text-[var(--color-text-muted)] mt-1">
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

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <Home size={14} className="text-[var(--color-gold)]" />
        Property
      </div>
      <div className="panel-content space-y-3">
        {/* Property Header */}
        <div className="card gold-border-glow">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ background: "var(--color-gold-subtle)", border: "1px solid var(--color-gold-dim)" }}
            >
              <Home size={18} style={{ color: "var(--color-gold)" }} />
            </div>
            <div>
              <h3
                className="text-sm font-bold"
                style={{ fontFamily: "var(--font-heading)", color: "var(--color-pink-light)" }}
              >
                {prop.name}
              </h3>
              <span className="badge" style={{ background: "var(--color-gold-subtle)", color: "var(--color-gold)" }}>
                {typeLabels[prop.type]}
              </span>
            </div>
          </div>
        </div>

        {/* Location */}
        {location && (
          <div className="flex items-center gap-2 text-[0.65rem]">
            <MapPin size={11} className="text-[var(--color-text-muted)]" />
            <span className="text-[var(--color-text-secondary)]">{location.name}</span>
          </div>
        )}

        {/* Cost */}
        {prop.monthlyCost && (
          <div className="flex items-center gap-2 text-[0.65rem]">
            <Coins size={11} className="text-[var(--color-gold)]" />
            <span className="text-[var(--color-text-secondary)]">
              {prop.monthlyCost} gp / month
            </span>
          </div>
        )}

        {/* Stash */}
        <div className="flex items-center gap-2 text-[0.65rem]">
          <Box size={11} className="text-[var(--color-text-muted)]" />
          <span className="text-[var(--color-text-secondary)]">
            Stash capacity: <span className="stat-value">{prop.stashCapacity}</span> items
          </span>
        </div>

        {/* Features */}
        <div className="card" style={{ borderLeft: "3px solid var(--color-success)" }}>
          <div className="flex items-center gap-1.5">
            <Lock size={11} className="text-[var(--color-success)]" />
            <span className="text-xs text-[var(--color-success)]">Safe Rest Location</span>
          </div>
          <p className="text-[0.6rem] text-[var(--color-text-muted)] mt-0.5">
            You can take a long rest here without cost.
          </p>
        </div>

        {/* Upgrades */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[0.65rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
              Upgrades
            </span>
            <span className="stat-value text-[0.6rem]">
              {installedCount}/{prop.upgrades.length}
            </span>
          </div>
          <div className="space-y-1.5">
            {prop.upgrades.map((upgrade) => (
              <div
                key={upgrade.name}
                className="flex items-start gap-2.5 px-2.5 py-2 rounded-md"
                style={{
                  background: "var(--color-bg-elevated)",
                  border: `1px solid ${upgrade.installed ? "var(--color-success)" : "var(--color-border-subtle)"}33`,
                  opacity: upgrade.installed ? 1 : 0.7,
                }}
              >
                {upgrade.installed ? (
                  <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-[var(--color-success)]" />
                ) : (
                  <Circle size={13} className="mt-0.5 shrink-0 text-[var(--color-text-muted)]" />
                )}
                <div className="flex-1">
                  <span className="text-[0.65rem] font-medium text-[var(--color-text-primary)]">
                    {upgrade.name}
                  </span>
                  <p className="text-[0.55rem] text-[var(--color-text-muted)]">{upgrade.description}</p>
                </div>
                {!upgrade.installed && (
                  <span className="stat-value text-[0.6rem] shrink-0">{upgrade.cost} gp</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade Property Tier */}
        {currentTierIndex < typeProgression.length - 1 && (
          <div
            className="rounded-lg p-3 text-center cursor-pointer transition-all duration-150"
            style={{
              background: "var(--color-bg-elevated)",
              border: "1px dashed var(--color-border)",
            }}
            onClick={() => console.log("Upgrade property tier")}
          >
            <ArrowUp size={16} className="mx-auto mb-1" style={{ color: "var(--color-purple-light)" }} />
            <span className="text-[0.65rem] text-[var(--color-purple-light)]">
              Upgrade to {typeLabels[typeProgression[currentTierIndex + 1]]}
            </span>
            <p className="text-[0.55rem] text-[var(--color-text-muted)] mt-0.5">
              Visit a real estate office to upgrade
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
