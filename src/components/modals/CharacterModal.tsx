"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, HelpCircle, Flag, Heart, Info, BookOpen, ArrowLeft, ChevronRight } from "lucide-react";
import {
  relationshipNodes,
  relationshipLinks,
  type RelationshipNode,
} from "@/data/placeholder";

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

// ── Character Content (rendered inside the modal shell) ──
function CharacterContent({
  node,
  onNavigate,
}: {
  node: RelationshipNode;
  onNavigate: (node: RelationshipNode) => void;
}) {
  const isPlayer = node.id === "player";

  const nodeLinks = relationshipLinks.filter(
    (l) => (l.source === node.id || l.target === node.id) && l.known,
  );

  return (
    <div className="px-5 pt-5 pb-5">
      {/* Header: Portrait + Name */}
      <div className="flex items-center gap-4 mb-4">
        <div
          className="w-16 h-16 rounded-full overflow-hidden shrink-0 flex items-center justify-center"
          style={{
            border: `2px solid ${node.factionColor}`,
            boxShadow: `0 0 16px ${node.factionColor}33`,
            background: "var(--color-bg-deep)",
          }}
        >
          {node.portrait ? (
            <img src={node.portrait} alt={node.name} className="w-full h-full object-cover" />
          ) : (
            <HelpCircle size={24} style={{ color: "var(--color-text-muted)" }} />
          )}
        </div>
        <div>
          <h2
            className="text-base font-bold leading-tight"
            style={{
              fontFamily: "var(--font-heading)",
              color: isPlayer ? "var(--color-pink-light)" : "var(--color-text-primary)",
            }}
          >
            {node.name}
          </h2>
          <div className="flex items-center gap-1.5 mt-1">
            <Flag size={11} style={{ color: node.factionColor }} />
            <span className="text-[0.65rem]" style={{ color: node.factionColor }}>
              {node.faction}
            </span>
          </div>
          {node.status !== "alive" && (
            <span
              className="badge mt-1 inline-block"
              style={{
                background: node.status === "dead" ? "rgba(239,68,68,0.15)" : "rgba(218,165,32,0.15)",
                color: node.status === "dead" ? "var(--color-danger)" : "var(--color-gold)",
                border: `1px solid ${node.status === "dead" ? "var(--color-danger)" : "var(--color-gold)"}44`,
              }}
            >
              {node.status}
            </span>
          )}
        </div>
      </div>

      {/* Disposition */}
      {!isPlayer && node.known && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Heart size={11} style={{ color: dispositionColor(node.disposition) }} />
              <span className="text-[0.65rem] text-[var(--color-text-muted)]">Disposition</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[0.6rem]" style={{ color: dispositionColor(node.disposition) }}>
                {dispositionLabel(node.disposition)}
              </span>
              <span className="stat-value text-[0.65rem]">{node.disposition}</span>
            </div>
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
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-1.5">
          <BookOpen size={11} className="text-[var(--color-text-muted)]" />
          <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            About
          </span>
        </div>
        <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
          {node.description}
        </p>
      </div>

      {/* Known Connections — clickable */}
      {nodeLinks.length > 0 && (
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Info size={11} className="text-[var(--color-text-muted)]" />
            <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
              Known Connections
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
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md cursor-pointer transition-all duration-150"
                  style={{
                    background: "var(--color-bg-elevated)",
                    border: "1px solid var(--color-border-subtle)",
                  }}
                  onClick={() => onNavigate(other)}
                >
                  <div
                    className="w-6 h-6 rounded-full overflow-hidden shrink-0 flex items-center justify-center"
                    style={{ border: `1.5px solid ${other.factionColor}`, background: "var(--color-bg-deep)" }}
                  >
                    {other.portrait ? (
                      <img src={other.portrait} alt={other.name} className="w-full h-full object-cover" />
                    ) : (
                      <HelpCircle size={10} style={{ color: "var(--color-text-muted)" }} />
                    )}
                  </div>
                  <span className="text-[0.65rem] text-[var(--color-text-secondary)] flex-1">
                    {other.name}
                  </span>
                  <span className="text-[0.6rem]" style={{ color: other.factionColor }}>
                    {link.type}
                  </span>
                  <ChevronRight size={12} style={{ color: "var(--color-text-muted)" }} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Modal Shell (manages navigation stack) ──
export default function CharacterModal({
  node,
  onClose,
}: {
  node: RelationshipNode;
  onClose: () => void;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [stack, setStack] = useState<RelationshipNode[]>([node]);

  const current = stack[stack.length - 1];
  const canGoBack = stack.length > 1;

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 200);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (canGoBack) {
          setStack((s) => s.slice(0, -1));
        } else {
          handleClose();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose, canGoBack]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) handleClose();
  };

  const handleNavigate = (target: RelationshipNode) => {
    setStack((s) => [...s, target]);
  };

  const handleBack = () => {
    setStack((s) => s.slice(0, -1));
  };

  const isOpen = visible && !closing;

  return createPortal(
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
        className="relative w-full max-w-sm mx-4 rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--color-bg-surface) 0%, var(--color-bg-base) 100%)",
          border: `1px solid ${current.factionColor}66`,
          boxShadow: `0 24px 48px rgba(0,0,0,0.6), 0 0 24px ${current.factionColor}22`,
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "scale(1) translateY(0)" : "scale(0.95) translateY(12px)",
          transition: "opacity 200ms ease, transform 200ms ease, border-color 200ms ease, box-shadow 200ms ease",
        }}
      >
        {/* Top bar: Back + breadcrumb + Close */}
        <div
          className="flex items-center justify-between px-3 py-2"
          style={{ borderBottom: "1px solid var(--color-border-subtle)" }}
        >
          <div className="flex items-center gap-2">
            {canGoBack ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-1 px-1.5 py-0.5 rounded cursor-pointer transition-all duration-150"
                style={{
                  background: "var(--color-bg-elevated)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-secondary)",
                }}
                aria-label="Go back"
              >
                <ArrowLeft size={12} />
                <span className="text-[0.6rem]">{stack[stack.length - 2].name}</span>
              </button>
            ) : (
              <span className="text-[0.6rem] text-[var(--color-text-muted)]">Character</span>
            )}
          </div>
          <button
            onClick={handleClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150"
            style={{
              background: "rgba(0,0,0,0.3)",
              border: "1px solid var(--color-border)",
              color: "var(--color-text-secondary)",
            }}
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="max-h-[70vh] overflow-y-auto">
          <CharacterContent
            key={current.id}
            node={current}
            onNavigate={handleNavigate}
          />
        </div>
      </div>
    </div>,
    document.body,
  );
}
