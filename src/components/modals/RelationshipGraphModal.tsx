"use client";

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { createPortal } from "react-dom";
import { X, HelpCircle, Flag, Heart, Info, Network } from "lucide-react";
import dynamic from "next/dynamic";
import {
  relationshipNodes,
  relationshipLinks,
  type RelationshipNode,
  type RelationshipLink,
} from "@/data/placeholder";

// Dynamic import — react-force-graph-2d uses canvas and must be client-only
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

const dispositionColor = (d: number) => {
  const hue = ((d + 100) / 200) * 120;
  return `hsl(${hue}, 70%, 55%)`;
};

// ── Node Detail Popup ──
function NodePopup({
  node,
  pos,
  onClose,
}: {
  node: RelationshipNode;
  pos: { x: number; y: number };
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isPlayer = node.id === "player";

  // Get links involving this node
  const nodeLinks = relationshipLinks.filter(
    (l) => (l.source === node.id || l.target === node.id) && l.known,
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    // Delay listener so the click that opened this doesn't immediately close it
    const timer = setTimeout(() => window.addEventListener("mousedown", handler), 50);
    return () => { clearTimeout(timer); window.removeEventListener("mousedown", handler); };
  }, [onClose]);

  // Clamp position to stay within viewport
  const left = Math.min(pos.x + 12, window.innerWidth - 260);
  const top = Math.min(pos.y - 20, window.innerHeight - 300);

  return (
    <div
      ref={ref}
      className="fixed rounded-lg p-4"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        zIndex: 10001,
        width: "240px",
        background: "var(--color-bg-surface)",
        border: `1px solid ${node.factionColor}88`,
        boxShadow: `0 8px 24px rgba(0,0,0,0.6), 0 0 16px ${node.factionColor}33`,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-full overflow-hidden shrink-0 flex items-center justify-center"
          style={{
            border: `2px solid ${node.factionColor}`,
            background: "var(--color-bg-deep)",
          }}
        >
          {node.portrait ? (
            <img src={node.portrait} alt={node.name} className="w-full h-full object-cover" />
          ) : (
            <HelpCircle size={20} style={{ color: "var(--color-text-muted)" }} />
          )}
        </div>
        <div>
          <h3
            className="text-sm font-bold leading-tight"
            style={{
              fontFamily: "var(--font-heading)",
              color: isPlayer ? "var(--color-pink-light)" : "var(--color-text-primary)",
            }}
          >
            {node.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Flag size={10} style={{ color: node.factionColor }} />
            <span className="text-[0.6rem]" style={{ color: node.factionColor }}>
              {node.faction}
            </span>
          </div>
        </div>
      </div>

      {/* Disposition (not for player) */}
      {!isPlayer && node.known && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1">
              <Heart size={10} style={{ color: dispositionColor(node.disposition) }} />
              <span className="text-[0.6rem] text-[var(--color-text-muted)]">Disposition</span>
            </div>
            <span className="stat-value text-[0.65rem]">{node.disposition}</span>
          </div>
          <div className="progress-bar-bg">
            <div
              className="progress-bar-fill"
              style={{
                width: `${((node.disposition + 100) / 200) * 100}%`,
                background: dispositionColor(node.disposition),
                boxShadow: `0 0 6px ${dispositionColor(node.disposition)}44`,
              }}
            />
          </div>
        </div>
      )}

      {/* Description */}
      <p className="text-[0.65rem] leading-relaxed text-[var(--color-text-secondary)] mb-3">
        {node.description}
      </p>

      {/* Known Connections */}
      {nodeLinks.length > 0 && (
        <div>
          <div className="flex items-center gap-1 mb-1.5">
            <Info size={10} className="text-[var(--color-text-muted)]" />
            <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Connections
            </span>
          </div>
          <div className="space-y-1">
            {nodeLinks.map((link, i) => {
              const otherId = link.source === node.id ? link.target : link.source;
              const other = relationshipNodes.find((n) => n.id === otherId);
              if (!other) return null;
              return (
                <div
                  key={i}
                  className="flex items-center justify-between px-2 py-1 rounded text-[0.6rem]"
                  style={{ background: "var(--color-bg-elevated)" }}
                >
                  <span className="text-[var(--color-text-secondary)]">{other.name}</span>
                  <span style={{ color: other.factionColor }}>{link.type}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Status */}
      {node.status !== "alive" && (
        <div className="mt-2">
          <span
            className="badge"
            style={{
              background: node.status === "dead" ? "rgba(239,68,68,0.15)" : "rgba(218,165,32,0.15)",
              color: node.status === "dead" ? "var(--color-danger)" : "var(--color-gold)",
              border: `1px solid ${node.status === "dead" ? "var(--color-danger)" : "var(--color-gold)"}44`,
            }}
          >
            {node.status}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Main Modal ──
export default function RelationshipGraphModal({
  focusNodeId,
  onClose,
}: {
  focusNodeId: string | null;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [selectedNode, setSelectedNode] = useState<RelationshipNode | null>(null);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  const [showUnknownLinks, setShowUnknownLinks] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const graphRef = useRef<any>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  // Measure container
  useEffect(() => {
    if (!containerRef.current) return;
    const obs = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });
    obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  // Configure d3 forces for better spacing
  // Retries because the dynamic import may not have populated the ref yet
  useEffect(() => {
    let attempts = 0;
    const configure = () => {
      const fg = graphRef.current;
      if (!fg) {
        if (attempts < 20) {
          attempts++;
          return setTimeout(configure, 150);
        }
        return;
      }
      fg.d3Force("charge")?.strength(-400);
      fg.d3Force("link")?.distance(200);
      fg.d3ReheatSimulation();
    };
    const timer = setTimeout(configure, 200);
    return () => clearTimeout(timer);
  }, [showUnknownLinks]);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 200);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (selectedNode) setSelectedNode(null);
        else handleClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose, selectedNode]);

  // Build graph data
  const graphData = useMemo(() => {
    const nodes = relationshipNodes.map((n) => ({
      ...n,
      // react-force-graph mutates node objects, so spread a copy
      _color: n.factionColor,
      _known: n.known,
    }));

    const links = relationshipLinks
      .filter((l) => showUnknownLinks || l.known)
      .map((l) => ({
        ...l,
        _known: l.known,
      }));

    return { nodes, links };
  }, [showUnknownLinks]);

  const isOpen = visible && !closing;

  const nodeCanvasObject = useCallback((node: any, ctx: CanvasRenderingContext2D) => {
    const size = node.id === "player" ? 18 : node._known ? 14 : 10;
    const x = node.x as number;
    const y = node.y as number;

    // Glow
    ctx.beginPath();
    ctx.arc(x, y, size + 3, 0, 2 * Math.PI);
    ctx.fillStyle = `${node._color}22`;
    ctx.fill();

    // Circle
    ctx.beginPath();
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fillStyle = node._known ? "#1c1228" : "#0d0814";
    ctx.fill();
    ctx.strokeStyle = node._color;
    ctx.lineWidth = node.id === "player" ? 3 : 2;
    ctx.stroke();

    // Initial letter
    ctx.fillStyle = node._known ? node._color : "#8a6a8a";
    ctx.font = `bold ${node.id === "player" ? 14 : 11}px 'Playfair Display', serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node._known ? node.name[0] : "?", x, y);

    // Name below
    ctx.fillStyle = node._known ? "#f5dcf5" : "#8a6a8a";
    ctx.font = `${node.id === "player" ? 11 : 9}px 'Montserrat', sans-serif`;
    ctx.fillText(node._known ? node.name : "???", x, y + size + 12);
  }, []);

  const linkCanvasObject = useCallback((link: any, ctx: CanvasRenderingContext2D) => {
    const source = link.source;
    const target = link.target;
    if (!source.x || !target.x) return;

    ctx.beginPath();
    ctx.moveTo(source.x, source.y);
    ctx.lineTo(target.x, target.y);

    if (link._known) {
      ctx.strokeStyle = "rgba(218, 165, 32, 0.3)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([]);
    } else {
      ctx.strokeStyle = "rgba(218, 165, 32, 0.12)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Label at midpoint (known links only)
    if (link._known && link.type) {
      const mx = (source.x + target.x) / 2;
      const my = (source.y + target.y) / 2;
      ctx.fillStyle = "rgba(200, 160, 200, 0.6)";
      ctx.font = "8px 'Montserrat', sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(link.type, mx, my - 6);
    }
  }, []);

  const handleNodeClick = useCallback((node: any, event: MouseEvent) => {
    const found = relationshipNodes.find((n) => n.id === node.id);
    if (found) {
      setSelectedNode(found);
      setPopupPos({ x: event.clientX, y: event.clientY });
    }
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 flex flex-col"
      style={{
        zIndex: 10000,
        background: isOpen ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0)",
        backdropFilter: isOpen ? "blur(6px)" : "blur(0px)",
        transition: "background 200ms ease, backdrop-filter 200ms ease",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3 shrink-0"
        style={{
          borderBottom: "1px solid var(--color-border)",
          opacity: isOpen ? 1 : 0,
          transition: "opacity 200ms ease",
        }}
      >
        <div className="flex items-center gap-3">
          <Network size={18} style={{ color: "var(--color-gold)" }} />
          <h2
            className="text-base font-bold"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-pink-light)" }}
          >
            Relationship Web
          </h2>
          <span className="badge" style={{ background: "var(--color-gold-subtle)", color: "var(--color-gold-light)" }}>
            {relationshipNodes.filter((n) => n.known).length} known
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Toggle unknown links */}
          <button
            onClick={() => setShowUnknownLinks((p) => !p)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[0.65rem] cursor-pointer transition-all duration-150"
            style={{
              background: showUnknownLinks ? "var(--color-gold-subtle)" : "var(--color-bg-elevated)",
              border: `1px solid ${showUnknownLinks ? "var(--color-gold-dim)" : "var(--color-border)"}`,
              color: showUnknownLinks ? "var(--color-gold)" : "var(--color-text-muted)",
            }}
          >
            <HelpCircle size={11} />
            {showUnknownLinks ? "Hide Unknown" : "Show Unknown"}
          </button>

          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150"
            style={{
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-secondary)",
            }}
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Graph Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-hidden relative"
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "scale(1)" : "scale(0.97)",
          transition: "opacity 200ms ease, transform 200ms ease",
        }}
      >
        <ForceGraph2D
          ref={graphRef}
          graphData={graphData}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="transparent"
          nodeCanvasObject={nodeCanvasObject}
          linkCanvasObject={linkCanvasObject}
          onNodeClick={handleNodeClick}
          nodeRelSize={6}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.2}
          warmupTicks={100}
          cooldownTicks={200}
          enableNodeDrag={true}
          enableZoomInteraction={true}
          enablePanInteraction={true}
          minZoom={0.3}
          maxZoom={5}
        />

        {/* Legend */}
        <div
          className="absolute bottom-4 left-4 rounded-lg p-3"
          style={{
            background: "rgba(13,8,20,0.9)",
            border: "1px solid var(--color-border)",
            backdropFilter: "blur(8px)",
          }}
        >
          <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] block mb-1.5">
            Factions
          </span>
          <div className="space-y-1">
            {Array.from(new Set(relationshipNodes.map((n) => n.faction))).map((faction) => {
              const node = relationshipNodes.find((n) => n.faction === faction);
              return (
                <div key={faction} className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: node?.factionColor }}
                  />
                  <span className="text-[0.6rem] text-[var(--color-text-secondary)]">
                    {faction}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Node Detail Popup */}
      {selectedNode && (
        <NodePopup
          node={selectedNode}
          pos={popupPos}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>,
    document.body,
  );
}
