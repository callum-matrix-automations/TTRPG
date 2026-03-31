"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, HelpCircle, Flag, Heart, ArrowLeft, ChevronRight } from "lucide-react";
import {
  relationshipNodes,
  relationshipLinks,
  type RelationshipNode,
} from "@/data/placeholder";
import { GlassCard, GlassHighlight, GlassProfile, GlassLinkRow } from "@/components/ui/glass";

const dispositionColor = (d: number) => {
  const hue = ((d + 100) / 200) * 120;
  return `hsl(${hue}, 70%, 55%)`;
};

const dispositionLabel = (d: number) => {
  if (d <= -61) return "Hostile";
  if (d <= -21) return "Unfriendly";
  if (d <= 20) return "Neutral";
  if (d <= 60) return "Friendly";
  return "Loyal";
};

// ── Character Content ──
function CharacterContent({ node, onNavigate }: { node: RelationshipNode; onNavigate: (node: RelationshipNode) => void }) {
  const isPlayer = node.id === "player";
  const nodeLinks = relationshipLinks.filter((l) => (l.source === node.id || l.target === node.id) && l.known);

  return (
    <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
      {/* Left — Profile */}
      <GlassProfile
        portrait={node.portrait}
        name={node.name}
        subtitle={node.faction}
        description={node.description}
        accentColor={node.factionColor}
        fullBody
        badge={
          !isPlayer && node.known ? (
            <div className="flex items-center gap-2">
              <Heart size={11} style={{ color: dispositionColor(node.disposition) }} />
              <span className="text-[0.65rem] font-medium" style={{ color: dispositionColor(node.disposition) }}>
                {dispositionLabel(node.disposition)} ({node.disposition})
              </span>
            </div>
          ) : null
        }
      >
        {/* Disposition bar */}
        {!isPlayer && node.known && (
          <div className="mt-2">
            <div className="h-1.5 w-full rounded-full" style={{ background: "var(--color-bg-deep)" }}>
              <div className="h-1.5 rounded-full transition-all" style={{
                width: `${((node.disposition + 100) / 200) * 100}%`,
                background: dispositionColor(node.disposition),
                boxShadow: `0 0 6px ${dispositionColor(node.disposition)}44`,
              }} />
            </div>
          </div>
        )}
      </GlassProfile>

      {/* Right — Info + Connections */}
      <div className="space-y-3">
        {/* Status */}
        {node.status !== "alive" && (
          <GlassHighlight title="Status">
            <span style={{ color: node.status === "dead" ? "var(--color-danger)" : "var(--color-gold)" }}>
              {node.status}
            </span>
          </GlassHighlight>
        )}

        {/* Known Connections */}
        {nodeLinks.length > 0 && (
          <div>
            <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: "var(--color-text-muted)" }}>
              Known Connections
            </p>
            <div className="space-y-1.5">
              {nodeLinks.map((link) => {
                const otherId = link.source === node.id ? link.target : link.source;
                const other = relationshipNodes.find((n) => n.id === otherId);
                if (!other) return null;
                return (
                  <GlassLinkRow
                    key={otherId}
                    icon={
                      other.portrait ? (
                        <img src={other.portrait} alt={other.name} className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <HelpCircle size={14} />
                      )
                    }
                    label={other.name}
                    detail={link.type}
                    accentColor={other.factionColor}
                    onClick={() => onNavigate(other)}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Modal Shell ──
export default function CharacterModal({ node, onClose }: { node: RelationshipNode; onClose: () => void }) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [stack, setStack] = useState<RelationshipNode[]>([node]);

  const current = stack[stack.length - 1];
  const canGoBack = stack.length > 1;

  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);
  const handleClose = useCallback(() => { setClosing(true); setTimeout(onClose, 200); }, [onClose]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (canGoBack) setStack((s) => s.slice(0, -1));
        else handleClose();
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [handleClose, canGoBack]);

  const isOpen = visible && !closing;

  return createPortal(
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: isOpen ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0)",
        backdropFilter: isOpen ? "blur(6px)" : "blur(0px)",
        transition: "background 200ms ease, backdrop-filter 200ms ease",
      }}
      onClick={(e) => { if (e.target === backdropRef.current) handleClose(); }}
    >
      <div
        className="relative w-full max-w-2xl mx-4 rounded-2xl overflow-hidden"
        style={{
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "scale(1) translateY(0)" : "scale(0.97) translateY(12px)",
          transition: "opacity 200ms ease, transform 200ms ease",
        }}
      >
        <GlassCard className="p-5 md:p-6">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-4">
            {canGoBack ? (
              <button
                onClick={() => setStack((s) => s.slice(0, -1))}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[0.65rem] cursor-pointer"
                style={{ background: "var(--color-bg-elevated)", border: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}
              >
                <ArrowLeft size={12} /> {stack[stack.length - 2].name}
              </button>
            ) : (
              <span className="text-[0.6rem]" style={{ color: "var(--color-text-muted)" }}>Character</span>
            )}
            <button
              onClick={handleClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer"
              style={{ background: "rgba(0,0,0,0.3)", border: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[70vh] overflow-y-auto">
            <CharacterContent key={current.id} node={current} onNavigate={(n) => setStack((s) => [...s, n])} />
          </div>
        </GlassCard>
      </div>
    </div>,
    document.body,
  );
}
