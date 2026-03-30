"use client";

import { useState } from "react";
import { Map, MapPin, Clock, Zap, AlertTriangle, Lock, ChevronRight, Navigation } from "lucide-react";
import { mapLocations, mapPaths, worldState, type MapLocation, type MapPath } from "@/data/placeholder";

const dangerColors = ["var(--color-success)", "var(--color-gold)", "#f97316", "var(--color-danger)"];
const dangerLabels = ["Safe", "Low", "Moderate", "High"];

function LocationCard({
  location,
  onSelect,
  selected,
}: {
  location: MapLocation;
  onSelect: () => void;
  selected: boolean;
}) {
  const isHere = location.playerIsHere;
  const isRestricted = !!location.restricted;
  const isClosed = location.availableHours !== null; // simplified — Phase 2 will check actual time

  return (
    <div
      className={`card cursor-pointer transition-all duration-150 ${isHere ? "gold-border-glow" : ""}`}
      style={{
        borderLeft: `3px solid ${location.factionColor ?? "var(--color-border)"}`,
        opacity: location.discovered ? 1 : 0.4,
        background: selected ? "var(--color-bg-surface)" : undefined,
      }}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2">
        {isHere && <Navigation size={11} style={{ color: "var(--color-gold)" }} />}
        <span
          className="text-xs font-medium flex-1 truncate"
          style={{ color: isHere ? "var(--color-gold)" : "var(--color-text-primary)" }}
        >
          {location.discovered ? location.name : "???"}
        </span>
        <div className="flex items-center gap-1">
          {isRestricted && <Lock size={10} className="text-[var(--color-danger)]" />}
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: dangerColors[location.dangerLevel] }}
          />
        </div>
      </div>
      {location.discovered && (
        <p className="text-[0.55rem] text-[var(--color-text-muted)] mt-0.5 truncate">
          {location.description}
        </p>
      )}
    </div>
  );
}

function TravelPreview({
  from,
  to,
  path,
}: {
  from: MapLocation;
  to: MapLocation;
  path: MapPath | null;
}) {
  if (!path) return null;

  return (
    <div
      className="rounded-lg p-3 space-y-2"
      style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border)" }}
    >
      <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
        <span>{from.name}</span>
        <ChevronRight size={12} className="text-[var(--color-text-muted)]" />
        <span style={{ color: "var(--color-gold)" }}>{to.name}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <Clock size={11} className="text-[var(--color-text-muted)]" />
          <span className="stat-value text-[0.65rem]">{path.travelMinutes} min</span>
        </div>
        {path.energyCost > 0 && (
          <div className="flex items-center gap-1">
            <Zap size={11} className="text-[var(--color-mana)]" />
            <span className="stat-value text-[0.65rem]">-{path.energyCost}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <AlertTriangle size={11} style={{ color: dangerColors[path.dangerLevel] }} />
          <span className="text-[0.6rem]" style={{ color: dangerColors[path.dangerLevel] }}>
            {dangerLabels[path.dangerLevel]}
          </span>
        </div>
      </div>
      {to.restricted && (
        <div className="flex items-center gap-1.5 text-[0.6rem]" style={{ color: "var(--color-danger)" }}>
          <Lock size={10} />
          <span>Restricted: {to.restricted.condition}</span>
        </div>
      )}
      <button
        className="w-full py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-150"
        style={{
          background: "linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-dim) 100%)",
          color: "var(--color-bg-deepest)",
          border: "none",
        }}
        onClick={() => console.log(`Travel to ${to.id}`)}
      >
        Travel
      </button>
    </div>
  );
}

export default function WorldMap() {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const currentLocation = mapLocations.find((l) => l.playerIsHere);
  const selectedLocation = selectedLocationId ? mapLocations.find((l) => l.id === selectedLocationId) : null;

  // Find path between current location and selected
  const travelPath = currentLocation && selectedLocation
    ? mapPaths.find(
        (p) =>
          (p.from === currentLocation.id && p.to === selectedLocation.id) ||
          (p.to === currentLocation.id && p.from === selectedLocation.id) ||
          (p.from === currentLocation.hubId && p.to === selectedLocation.hubId) ||
          (p.to === currentLocation.hubId && p.from === selectedLocation.hubId)
      ) ?? null
    : null;

  // Group locations by hub
  const hubs = mapLocations.filter((l) => l.type === "hub");

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <Map size={14} className="text-[var(--color-gold)]" />
        World Map
        <span className="ml-auto text-[0.6rem] text-[var(--color-text-muted)]">{worldState.time}</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Visual Map */}
        <div
          className="relative mx-3 mt-3 rounded-lg overflow-hidden"
          style={{
            height: "200px",
            background: "var(--color-bg-deep)",
            border: "1px solid var(--color-border)",
          }}
        >
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.05 }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={`${i * 10}%`} x2="100%" y2={`${i * 10}%`} stroke="var(--color-gold)" strokeWidth="1" />
            ))}
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`v${i}`} x1={`${i * 10}%`} y1="0" x2={`${i * 10}%`} y2="100%" stroke="var(--color-gold)" strokeWidth="1" />
            ))}
          </svg>

          {/* Paths between hubs */}
          <svg className="absolute inset-0 w-full h-full">
            {mapPaths
              .filter((p) => {
                const from = mapLocations.find((l) => l.id === p.from);
                const to = mapLocations.find((l) => l.id === p.to);
                return from?.type === "hub" && to?.type === "hub";
              })
              .map((p) => {
                const from = mapLocations.find((l) => l.id === p.from)!;
                const to = mapLocations.find((l) => l.id === p.to)!;
                return (
                  <line
                    key={`${p.from}-${p.to}`}
                    x1={`${from.x}%`}
                    y1={`${from.y}%`}
                    x2={`${to.x}%`}
                    y2={`${to.y}%`}
                    stroke="var(--color-border)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                );
              })}
          </svg>

          {/* Location dots */}
          {mapLocations
            .filter((l) => l.discovered)
            .map((loc) => {
              const isHub = loc.type === "hub";
              const isHere = loc.playerIsHere;
              const isSelected = loc.id === selectedLocationId;
              const size = isHub ? 10 : loc.type === "spoke" ? 6 : 4;

              return (
                <div
                  key={loc.id}
                  className="absolute cursor-pointer transition-all duration-150"
                  style={{
                    left: `${loc.x}%`,
                    top: `${loc.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  onClick={() => setSelectedLocationId(loc.id)}
                >
                  <div
                    style={{
                      width: `${size * 2}px`,
                      height: `${size * 2}px`,
                      borderRadius: "50%",
                      background: isHere ? "var(--color-gold)" : loc.factionColor ?? "var(--color-text-muted)",
                      border: `2px solid ${isSelected ? "var(--color-pink-light)" : isHere ? "var(--color-gold-light)" : "var(--color-bg-deep)"}`,
                      boxShadow: isHere
                        ? "0 0 12px var(--color-gold-glow)"
                        : isSelected
                          ? "0 0 8px var(--color-purple-glow)"
                          : "none",
                    }}
                  />
                  {isHub && (
                    <span
                      className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.5rem]"
                      style={{
                        top: `${size * 2 + 4}px`,
                        color: isHere ? "var(--color-gold)" : "var(--color-text-muted)",
                        fontWeight: isHere ? 600 : 400,
                      }}
                    >
                      {loc.name}
                    </span>
                  )}
                </div>
              );
            })}
        </div>

        {/* Travel Preview */}
        {selectedLocation && !selectedLocation.playerIsHere && currentLocation && (
          <div className="px-3 mt-2">
            <TravelPreview from={currentLocation} to={selectedLocation} path={travelPath} />
          </div>
        )}

        {/* Location List by Hub */}
        <div className="px-3 py-3 space-y-3">
          {hubs.map((hub) => {
            const spokes = mapLocations.filter((l) => l.parentId === hub.id && l.discovered);
            return (
              <div key={hub.id}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: hub.factionColor ?? "var(--color-text-muted)" }} />
                  <span
                    className="text-[0.65rem] font-semibold uppercase tracking-wider"
                    style={{ color: hub.factionColor ?? "var(--color-text-muted)" }}
                  >
                    {hub.name}
                  </span>
                  <div className="w-2 h-2 rounded-full" style={{ background: dangerColors[hub.dangerLevel] }} />
                </div>
                <div className="space-y-1">
                  {spokes.map((loc) => (
                    <LocationCard
                      key={loc.id}
                      location={loc}
                      selected={loc.id === selectedLocationId}
                      onSelect={() => setSelectedLocationId(loc.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
