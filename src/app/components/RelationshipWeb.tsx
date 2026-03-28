"use client";

import { Network } from "lucide-react";
import { relationships } from "@/data/placeholder";

export default function RelationshipWeb() {
  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <Network size={14} className="text-[var(--color-gold)]" />
        Relationships
      </div>
      <div className="panel-content">
        <div
          className="relative w-full rounded-lg"
          style={{
            aspectRatio: "4/3",
            background: "var(--color-bg-deep)",
            border: "1px solid var(--color-border-subtle)",
            overflow: "hidden",
          }}
        >
          {/* Connection Lines (SVG) */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ opacity: 0.3 }}
          >
            {relationships
              .filter((r) => r.id !== "player")
              .map((r) => (
                <line
                  key={r.id}
                  x1="50%"
                  y1="50%"
                  x2={`${r.x}%`}
                  y2={`${r.y}%`}
                  stroke="var(--color-gold)"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}
          </svg>

          {/* Nodes */}
          {relationships.map((r) => (
            <div
              key={r.id}
              className="absolute flex flex-col items-center gap-0.5 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${r.x}%`, top: `${r.y}%` }}
            >
              <div
                className="relationship-node"
                style={{
                  borderColor:
                    r.id === "player"
                      ? "var(--color-pink)"
                      : "var(--color-gold)",
                  boxShadow:
                    r.id === "player"
                      ? "0 0 12px var(--color-purple-glow)"
                      : "0 0 8px var(--color-gold-glow)",
                }}
              >
                {r.name[0]}
              </div>
              <span className="text-[0.55rem] text-[var(--color-text-secondary)] whitespace-nowrap">
                {r.name}
              </span>
              {"relationToPlayer" in r && (
                <span className="text-[0.5rem] text-[var(--color-text-muted)]">
                  {r.relationToPlayer}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
