"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Map, MapPin, Clock, Zap, AlertTriangle, Lock, ChevronRight, Navigation, Maximize2, ChevronLeft, X } from "lucide-react";
import { mapLocations, type MapLocation, type LocationDepth } from "@/data/placeholder";
import dynamic from "next/dynamic";

const PhaserMapCanvas = dynamic(() => import("@/game/PhaserMapCanvas"), { ssr: false });

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
          <div className="w-2 h-2 rounded-full" style={{ background: dangerColors[location.dangerLevel] }} />
        </div>
      </div>
      {location.discovered && (
        <p className="text-[0.55rem] text-[var(--color-text-muted)] mt-0.5 line-clamp-1">
          {location.description}
        </p>
      )}
    </div>
  );
}

export default function WorldMap() {
  const [viewDepth, setViewDepth] = useState<LocationDepth>("district");
  const [viewParentId, setViewParentId] = useState<string | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [previewSize, setPreviewSize] = useState({ width: 300, height: 200 });
  const previewContainerRef = useRef<HTMLDivElement>(null);

  const currentLocation = mapLocations.find((l) => l.playerIsHere);
  const selectedLocation = selectedLocationId ? mapLocations.find((l) => l.id === selectedLocationId) : null;

  // Get visible locations for current view
  const visibleLocations = viewDepth === "district"
    ? mapLocations.filter((l) => l.depth === "district" && l.discovered)
    : mapLocations.filter((l) => l.parentId === viewParentId && l.discovered);

  // Find travel info between current location and selected
  const travelConnection = currentLocation && selectedLocation
    ? currentLocation.connections.find((c) => c.targetId === selectedLocation.id)
      ?? selectedLocation.connections.find((c) => c.targetId === currentLocation.id)
    : null;

  // Breadcrumb: build path from current view to root
  const breadcrumbs: { label: string; depth: LocationDepth; parentId: string | null }[] = [];
  breadcrumbs.push({ label: "City", depth: "district", parentId: null });
  if (viewParentId) {
    const parent = mapLocations.find((l) => l.id === viewParentId);
    if (parent) {
      breadcrumbs.push({ label: parent.name, depth: "zone", parentId: parent.id });
    }
  }

  // Measure preview container
  useEffect(() => {
    if (!previewContainerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect;
      setPreviewSize({ width: Math.floor(width), height: Math.floor(width * 0.6) });
    });
    obs.observe(previewContainerRef.current);
    return () => obs.disconnect();
  }, []);

  const handleLocationClick = (locId: string) => {
    const loc = mapLocations.find((l) => l.id === locId);
    if (!loc) return;

    // If clicking a district, zoom into it
    const children = mapLocations.filter((l) => l.parentId === locId && l.discovered);
    if (children.length > 0) {
      setViewDepth("zone");
      setViewParentId(locId);
      setSelectedLocationId(null);
    } else {
      setSelectedLocationId(locId);
    }
  };

  const handleBack = () => {
    if (viewParentId) {
      setViewDepth("district");
      setViewParentId(null);
      setSelectedLocationId(null);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <Map size={14} className="text-[var(--color-gold)]" />
        World Map
        <button
          onClick={() => setFullscreen(true)}
          className="ml-auto w-6 h-6 rounded flex items-center justify-center cursor-pointer transition-all duration-150"
          style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border)", color: "var(--color-text-muted)" }}
          title="Fullscreen map"
        >
          <Maximize2 size={12} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1 px-3 pt-2 pb-1">
          {breadcrumbs.map((bc, i) => (
            <div key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight size={10} className="text-[var(--color-text-muted)]" />}
              <button
                onClick={() => { setViewDepth(bc.depth); setViewParentId(bc.parentId ?? null); setSelectedLocationId(null); }}
                className="text-[0.6rem] cursor-pointer transition-colors duration-150"
                style={{
                  color: i === breadcrumbs.length - 1 ? "var(--color-gold)" : "var(--color-text-muted)",
                  background: "none", border: "none", padding: 0,
                }}
              >
                {bc.label}
              </button>
            </div>
          ))}
        </div>

        {/* Back button when zoomed in */}
        {viewParentId && (
          <button
            onClick={handleBack}
            className="flex items-center gap-1 mx-3 mb-2 px-2 py-1 rounded text-[0.65rem] cursor-pointer"
            style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}
          >
            <ChevronLeft size={12} />
            Back to City
          </button>
        )}

        {/* Phaser Map Preview */}
        <div ref={previewContainerRef} className="px-3">
          <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
            <PhaserMapCanvas
              width={previewSize.width}
              height={previewSize.height}
              depth={viewDepth}
              parentId={viewParentId}
              compact
              onLocationClick={handleLocationClick}
            />
          </div>
        </div>

        {/* Travel Preview */}
        {selectedLocation && !selectedLocation.playerIsHere && travelConnection && (
          <div className="px-3 mt-2">
            <div className="rounded-lg p-3" style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border)" }}>
              <div className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)] mb-2">
                <span>{currentLocation?.name}</span>
                <ChevronRight size={12} className="text-[var(--color-text-muted)]" />
                <span style={{ color: "var(--color-gold)" }}>{selectedLocation.name}</span>
              </div>
              <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center gap-1">
                  <Clock size={11} className="text-[var(--color-text-muted)]" />
                  <span className="stat-value text-[0.65rem]">{travelConnection.travelMinutes} min</span>
                </div>
                {travelConnection.energyCost > 0 && (
                  <div className="flex items-center gap-1">
                    <Zap size={11} className="text-[var(--color-mana)]" />
                    <span className="stat-value text-[0.65rem]">-{travelConnection.energyCost}</span>
                  </div>
                )}
                {!travelConnection.accessible && (
                  <div className="flex items-center gap-1">
                    <Lock size={11} className="text-[var(--color-danger)]" />
                    <span className="text-[0.6rem] text-[var(--color-danger)]">Restricted</span>
                  </div>
                )}
              </div>
              <div className="text-[0.6rem] text-[var(--color-text-muted)] mb-2">
                {travelConnection.direction}
              </div>
              <button
                className="w-full py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-150"
                style={{
                  background: travelConnection.accessible
                    ? "linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-dim) 100%)"
                    : "var(--color-bg-deep)",
                  color: travelConnection.accessible ? "var(--color-bg-deepest)" : "var(--color-text-muted)",
                  border: "none",
                  opacity: travelConnection.accessible ? 1 : 0.5,
                }}
                disabled={!travelConnection.accessible}
                onClick={() => console.log(`Travel to ${selectedLocation.id}`)}
              >
                {travelConnection.accessible ? "Travel" : "Locked"}
              </button>
            </div>
          </div>
        )}

        {/* Location List */}
        <div className="px-3 py-3 space-y-1.5">
          <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            {viewParentId ? mapLocations.find((l) => l.id === viewParentId)?.name : "Districts"}
          </span>
          {visibleLocations.map((loc) => (
            <LocationCard
              key={loc.id}
              location={loc}
              selected={loc.id === selectedLocationId}
              onSelect={() => handleLocationClick(loc.id)}
            />
          ))}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {fullscreen && (
        <FullscreenMapModal
          initialDepth={viewDepth}
          initialParentId={viewParentId}
          onClose={() => setFullscreen(false)}
        />
      )}
    </div>
  );
}

// ── Fullscreen Map Modal (portaled to body) ──
function FullscreenMapModal({
  initialDepth,
  initialParentId,
  onClose,
}: {
  initialDepth: LocationDepth;
  initialParentId: string | null;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [dims, setDims] = useState({ width: 0, height: 0 });
  const [viewDepth, setViewDepth] = useState(initialDepth);
  const [viewParentId, setViewParentId] = useState(initialParentId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLocation = mapLocations.find((l) => l.playerIsHere);
  const selectedLocation = selectedId ? mapLocations.find((l) => l.id === selectedId) : null;

  // Find travel connection
  const travelConnection = currentLocation && selectedLocation
    ? currentLocation.connections.find((c) => c.targetId === selectedLocation.id)
      ?? selectedLocation.connections.find((c) => c.targetId === currentLocation.id)
    : null;

  // Check if selected has children (can zoom in)
  const selectedHasChildren = selectedId
    ? mapLocations.some((l) => l.parentId === selectedId && l.discovered)
    : false;

  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  const handleClose = () => { setClosing(true); setTimeout(onClose, 200); };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedId) setSelectedId(null);
        else if (viewParentId) { setViewDepth("district"); setViewParentId(null); }
        else handleClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId, viewParentId]);

  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDims({ width: Math.floor(width), height: Math.floor(height) });
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  const handleLocationClick = (locId: string) => {
    if (locId === selectedId) {
      // Double-click: zoom in if has children
      if (selectedHasChildren) {
        setViewDepth("zone");
        setViewParentId(locId);
        setSelectedId(null);
      }
    } else {
      setSelectedId(locId);
    }
  };

  const handleZoomIn = () => {
    if (selectedId && selectedHasChildren) {
      setViewDepth("zone");
      setViewParentId(selectedId);
      setSelectedId(null);
    }
  };

  const handleZoomOut = () => {
    if (viewParentId) {
      setViewDepth("district");
      setViewParentId(null);
      setSelectedId(null);
    }
  };

  // Breadcrumbs
  const breadcrumbs: { label: string; onClick: () => void }[] = [
    { label: "City", onClick: () => { setViewDepth("district"); setViewParentId(null); setSelectedId(null); } },
  ];
  if (viewParentId) {
    const parent = mapLocations.find((l) => l.id === viewParentId);
    if (parent) breadcrumbs.push({ label: parent.name, onClick: () => {} });
  }

  const isOpen = visible && !closing;

  return createPortal(
    <div
      className="fixed inset-0 flex flex-col"
      style={{ zIndex: 10000, background: isOpen ? "rgba(0,0,0,0.95)" : "rgba(0,0,0,0)", transition: "background 200ms ease" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3 shrink-0"
        style={{ borderBottom: "1px solid var(--color-border)", background: "var(--color-bg-deep)", opacity: isOpen ? 1 : 0, transition: "opacity 200ms ease" }}
      >
        <div className="flex items-center gap-3">
          <Map size={18} style={{ color: "var(--color-gold)" }} />
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5">
            {breadcrumbs.map((bc, i) => (
              <div key={i} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={12} className="text-[var(--color-text-muted)]" />}
                <button
                  onClick={bc.onClick}
                  className="text-sm cursor-pointer"
                  style={{
                    fontFamily: "var(--font-heading)", fontWeight: 600, background: "none", border: "none", padding: 0,
                    color: i === breadcrumbs.length - 1 ? "var(--color-pink-light)" : "var(--color-text-muted)",
                  }}
                >
                  {bc.label}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {viewParentId && (
            <button
              onClick={handleZoomOut}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-all duration-150"
              style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}
            >
              <ChevronLeft size={14} /> Back
            </button>
          )}
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150"
            style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Map + Detail Panel */}
      <div className="flex-1 flex overflow-hidden" style={{ opacity: isOpen ? 1 : 0, transition: "opacity 200ms ease" }}>
        {/* Map Canvas */}
        <div ref={containerRef} className="flex-1 overflow-hidden relative">
          {dims.width > 0 && dims.height > 0 && (
            <PhaserMapCanvas
              width={selectedLocation ? dims.width : dims.width}
              height={dims.height}
              depth={viewDepth}
              parentId={viewParentId}
              onLocationClick={handleLocationClick}
            />
          )}
        </div>

        {/* Location Detail Panel (slides in from right) */}
        <div
          className="shrink-0 overflow-y-auto transition-all duration-200 ease-in-out"
          style={{
            width: selectedLocation ? "340px" : "0px",
            opacity: selectedLocation ? 1 : 0,
            background: "var(--color-bg-deep)",
            borderLeft: selectedLocation ? "1px solid var(--color-border)" : "none",
          }}
        >
          {selectedLocation && (
            <div className="p-4 space-y-4">
              {/* Location Header */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {selectedLocation.playerIsHere && <Navigation size={14} style={{ color: "var(--color-gold)" }} />}
                  <h3
                    className="text-sm font-bold"
                    style={{ fontFamily: "var(--font-heading)", color: selectedLocation.playerIsHere ? "var(--color-gold)" : "var(--color-pink-light)" }}
                  >
                    {selectedLocation.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedLocation.faction && (
                    <span className="text-[0.6rem]" style={{ color: selectedLocation.factionColor ?? "var(--color-text-muted)" }}>
                      {selectedLocation.faction}
                    </span>
                  )}
                  <span className="text-[0.55rem] px-1.5 py-0.5 rounded" style={{ background: `${dangerColors[selectedLocation.dangerLevel]}18`, color: dangerColors[selectedLocation.dangerLevel] }}>
                    {dangerLabels[selectedLocation.dangerLevel]}
                  </span>
                  {selectedLocation.restricted && (
                    <span className="text-[0.55rem] px-1.5 py-0.5 rounded flex items-center gap-1" style={{ background: "rgba(239,68,68,0.1)", color: "var(--color-danger)" }}>
                      <Lock size={8} /> Restricted
                    </span>
                  )}
                  {selectedLocation.playerIsHere && (
                    <span className="text-[0.55rem] px-1.5 py-0.5 rounded" style={{ background: "var(--color-gold-subtle)", color: "var(--color-gold)" }}>
                      Current Location
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
                {selectedLocation.description}
              </p>

              {/* Available Hours */}
              {selectedLocation.availableHours && (
                <div className="flex items-center gap-1.5 text-[0.65rem]">
                  <Clock size={11} className="text-[var(--color-text-muted)]" />
                  <span className="text-[var(--color-text-muted)]">Open: {selectedLocation.availableHours}</span>
                </div>
              )}

              {/* NPCs Present */}
              {selectedLocation.npcsPresent.length > 0 && (
                <div>
                  <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">NPCs Here</span>
                  <div className="mt-1 space-y-1">
                    {selectedLocation.npcsPresent.map((npcId) => (
                      <div key={npcId} className="text-[0.65rem] text-[var(--color-text-secondary)] px-2 py-1 rounded" style={{ background: "var(--color-bg-elevated)" }}>
                        {npcId}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Connections / Exits */}
              {selectedLocation.connections.filter((c) => c.discovered).length > 0 && (
                <div>
                  <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Exits</span>
                  <div className="mt-1 space-y-1">
                    {selectedLocation.connections.filter((c) => c.discovered).map((conn) => {
                      const target = mapLocations.find((l) => l.id === conn.targetId);
                      return (
                        <div
                          key={conn.targetId}
                          className="flex items-center justify-between px-2 py-1.5 rounded text-[0.65rem]"
                          style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)" }}
                        >
                          <div className="flex items-center gap-1.5">
                            <ChevronRight size={10} style={{ color: conn.accessible ? "var(--color-gold)" : "var(--color-danger)" }} />
                            <span className="text-[var(--color-text-secondary)]">{target?.name ?? conn.targetId}</span>
                          </div>
                          <span className="text-[var(--color-text-muted)]">{conn.travelMinutes}m</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Zoom In button (if has children) */}
              {selectedHasChildren && (
                <button
                  onClick={handleZoomIn}
                  className="w-full py-2 rounded-lg text-xs font-medium cursor-pointer transition-all duration-150 flex items-center justify-center gap-2"
                  style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border)", color: "var(--color-purple-light)" }}
                >
                  <Map size={13} /> Explore {selectedLocation.name}
                </button>
              )}

              {/* Travel Button (if not already here and has a connection) */}
              {!selectedLocation.playerIsHere && travelConnection && (
                <div
                  className="rounded-lg p-3"
                  style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border)" }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1">
                      <Clock size={12} className="text-[var(--color-text-muted)]" />
                      <span className="stat-value text-xs">{travelConnection.travelMinutes} min</span>
                    </div>
                    {travelConnection.energyCost > 0 && (
                      <div className="flex items-center gap-1">
                        <Zap size={12} className="text-[var(--color-mana)]" />
                        <span className="stat-value text-xs">-{travelConnection.energyCost}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-[0.6rem] text-[var(--color-text-muted)] mb-3 italic">
                    {travelConnection.direction}
                  </div>
                  <button
                    className="w-full py-2 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-150"
                    style={{
                      background: travelConnection.accessible
                        ? "linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-dim) 100%)"
                        : "var(--color-bg-deep)",
                      color: travelConnection.accessible ? "var(--color-bg-deepest)" : "var(--color-text-muted)",
                      border: "none",
                      opacity: travelConnection.accessible ? 1 : 0.5,
                    }}
                    disabled={!travelConnection.accessible}
                    onClick={() => {
                      // Phase 2: actual travel logic
                      console.log(`Travel to ${selectedLocation.id} via "${travelConnection.direction}"`);
                    }}
                  >
                    {travelConnection.accessible ? `Travel to ${selectedLocation.name}` : "Locked"}
                  </button>
                  {!travelConnection.accessible && travelConnection.accessCondition && (
                    <p className="text-[0.55rem] text-[var(--color-danger)] mt-1.5 text-center">
                      Requires: {travelConnection.accessCondition}
                    </p>
                  )}
                </div>
              )}

              {/* Already here message */}
              {selectedLocation.playerIsHere && (
                <div className="text-center py-2">
                  <span className="text-[0.65rem] text-[var(--color-gold)] italic">You are here</span>
                </div>
              )}

              {/* Close detail */}
              <button
                onClick={() => setSelectedId(null)}
                className="w-full py-1.5 rounded text-[0.65rem] cursor-pointer"
                style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border-subtle)", color: "var(--color-text-muted)" }}
              >
                Deselect
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
