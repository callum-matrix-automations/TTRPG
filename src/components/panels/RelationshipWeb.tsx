"use client";

import { useState } from "react";
import { Network, HelpCircle, User, Heart, ChevronRight } from "lucide-react";
import {
  relationshipNodes,
  relationshipLinks,
  type RelationshipNode,
} from "@/data/placeholder";
import CharacterModal from "@/components/modals/CharacterModal";
import RelationshipGraphModal from "@/components/modals/RelationshipGraphModal";
import { HoverRevealCard, RevealRow, RevealBar } from "@/components/ui/hover-reveal-card";

const dispositionColor = (d: number) => {
  const hue = ((d + 100) / 200) * 120;
  return `hsl(${hue}, 70%, 55%)`;
};

function CharacterCard({ node, onOpenModal }: { node: RelationshipNode; onOpenModal: () => void }) {
  const isPlayer = node.id === "player";
  const isUnknown = !node.known;
  const playerLink = relationshipLinks.find(
    (l) => (l.source === "player" && l.target === node.id) || (l.target === "player" && l.source === node.id),
  );
  const nodeLinks = relationshipLinks.filter(
    (l) => (l.source === node.id || l.target === node.id) && l.known,
  );

  if (isUnknown) {
    return (
      <div className="card flex items-center gap-3" style={{ opacity: 0.5 }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ border: `2px solid ${node.factionColor}`, background: "var(--color-bg-deep)" }}>
          <HelpCircle size={14} style={{ color: "var(--color-text-muted)" }} />
        </div>
        <div>
          <span className="text-xs text-[var(--color-text-muted)]">{node.name}</span>
          <span className="text-[0.55rem] block" style={{ color: node.factionColor }}>{node.faction}</span>
        </div>
      </div>
    );
  }

  return (
    <HoverRevealCard
      accentColor={node.factionColor}
      footerIcon={<User size={11} />}
      footerLabel={isPlayer ? "You" : playerLink?.type ?? node.faction}
      footerActionLabel="View Profile"
      footerAction={onOpenModal}
      summary={
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 flex items-center justify-center" style={{ border: `2px solid ${node.factionColor}`, background: "var(--color-bg-deep)" }}>
            {node.portrait ? (
              <img src={node.portrait} alt={node.name} className="w-full h-full object-cover" />
            ) : (
              <HelpCircle size={12} style={{ color: "var(--color-text-muted)" }} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium truncate" style={{ color: isPlayer ? "var(--color-pink-light)" : "var(--color-text-primary)" }}>
                {node.name}
              </span>
              {isPlayer && <span className="badge" style={{ background: "var(--color-pink-light)", color: "var(--color-bg-deepest)" }}>You</span>}
            </div>
            <span className="text-[0.55rem]" style={{ color: node.factionColor }}>{node.faction}</span>
          </div>
          {!isPlayer && (
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: dispositionColor(node.disposition), boxShadow: `0 0 6px ${dispositionColor(node.disposition)}66` }} />
          )}
        </div>
      }
      details={
        <>
          {/* Disposition bar */}
          {!isPlayer && (
            <RevealBar
              label="Disposition"
              value={`${Math.round(((node.disposition + 100) / 200) * 100)}%`}
              icon={<Heart size={10} style={{ color: dispositionColor(node.disposition) }} />}
              color={dispositionColor(node.disposition)}
            />
          )}

          {/* Description */}
          <RevealRow>
            <p className="text-[0.6rem] text-[var(--color-text-secondary)] leading-relaxed">
              {node.description}
            </p>
          </RevealRow>

          {/* Known connections */}
          {nodeLinks.length > 0 && (
            <RevealRow>
              <span className="text-[0.55rem] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Connections</span>
              <div className="space-y-0.5 mt-1">
                {nodeLinks.map((link) => {
                  const otherId = link.source === node.id ? link.target : link.source;
                  const other = relationshipNodes.find((n) => n.id === otherId);
                  if (!other) return null;
                  return (
                    <div key={otherId} className="flex items-center justify-between text-[0.55rem] px-1.5 py-0.5 rounded" style={{ background: "var(--color-bg-deep)" }}>
                      <span className="text-[var(--color-text-secondary)]">{other.name}</span>
                      <span style={{ color: other.factionColor }}>{link.type}</span>
                    </div>
                  );
                })}
              </div>
            </RevealRow>
          )}
        </>
      }
    />
  );
}

export default function RelationshipWeb() {
  const [webOpen, setWebOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState<RelationshipNode | null>(null);

  const knownNodes = relationshipNodes.filter((n) => n.known);
  const unknownNodes = relationshipNodes.filter((n) => !n.known);

  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <Network size={14} className="text-[var(--color-gold)]" />
        Relationships
      </div>
      <div className="panel-content flex-1 space-y-3">
        {/* Known Characters */}
        <div>
          <h4 className="text-[0.65rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
            Known ({knownNodes.length})
          </h4>
          <div className="space-y-1.5">
            {knownNodes.map((node) => (
              <CharacterCard
                key={node.id}
                node={node}
                onOpenModal={() => setSelectedNode(node)}
              />
            ))}
          </div>
        </div>

        {/* Unknown/Mentioned Characters */}
        {unknownNodes.length > 0 && (
          <div>
            <h4 className="text-[0.65rem] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">
              Mentioned ({unknownNodes.length})
            </h4>
            <div className="space-y-1.5">
              {unknownNodes.map((node) => (
                <CharacterCard
                  key={node.id}
                  node={node}
                  onOpenModal={() => setSelectedNode(node)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom: Open Relationship Web */}
      <div
        className="shrink-0 p-3"
        style={{
          borderTop: "1px solid var(--color-border)",
          background: "linear-gradient(135deg, var(--color-bg-base) 0%, var(--color-bg-deep) 100%)",
        }}
      >
        <button
          onClick={() => setWebOpen(true)}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-150"
          style={{
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text-secondary)",
          }}
        >
          <Network size={14} style={{ color: "var(--color-gold)" }} />
          <span className="text-xs font-medium">View Relationship Web</span>
        </button>
      </div>

      {/* Character Detail Modal */}
      {selectedNode && (
        <CharacterModal
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
        />
      )}

      {/* Fullscreen Graph Modal */}
      {webOpen && (
        <RelationshipGraphModal
          focusNodeId={null}
          onClose={() => setWebOpen(false)}
        />
      )}
    </div>
  );
}
