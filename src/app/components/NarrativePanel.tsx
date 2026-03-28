"use client";

import { BookOpen, Dice5, Send, ChevronRight, MessageSquare } from "lucide-react";
import { narrativeHistory, diceResult } from "@/data/placeholder";

function DiceResultDisplay() {
  const d = diceResult;
  const isSuccess = d.outcome === "success" || d.outcome === "crit_success";
  const outcomeColor = isSuccess ? "var(--color-success)" : "var(--color-danger)";

  return (
    <div
      className="card flex items-center gap-3 my-2"
      style={{
        borderLeft: `3px solid ${outcomeColor}`,
        background:
          "linear-gradient(135deg, var(--color-bg-surface) 0%, var(--color-bg-elevated) 100%)",
      }}
    >
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center"
        style={{
          background: "var(--color-bg-deep)",
          border: `1px solid ${outcomeColor}`,
          boxShadow: `0 0 10px ${outcomeColor}44`,
        }}
      >
        <Dice5 size={20} style={{ color: outcomeColor }} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[var(--color-text-primary)]">
            {d.type} Check
          </span>
          <span className="text-[0.6rem] text-[var(--color-text-muted)]">
            DC {d.dc}
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="stat-value text-sm">{d.total}</span>
          <span className="text-[0.6rem] text-[var(--color-text-muted)]">
            ({d.roll} + {d.modifier})
          </span>
          <span
            className="badge ml-1"
            style={{
              background: `${outcomeColor}22`,
              color: outcomeColor,
              border: `1px solid ${outcomeColor}44`,
            }}
          >
            {d.outcome.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
}

function NarrativeEntry({
  entry,
}: {
  entry: (typeof narrativeHistory)[number];
}) {
  if (entry.type === "narration") {
    return (
      <div className="py-2">
        <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">
          {entry.text}
        </p>
      </div>
    );
  }

  if (entry.type === "npc") {
    return (
      <div
        className="py-2 pl-3 my-1"
        style={{ borderLeft: "2px solid var(--color-purple-light)" }}
      >
        <span
          className="text-xs font-semibold block mb-1"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-purple-light)",
          }}
        >
          {entry.speaker}
        </span>
        <p className="text-sm leading-relaxed text-[var(--color-text-primary)]">
          {entry.text}
        </p>
      </div>
    );
  }

  if (entry.type === "player") {
    return (
      <div
        className="py-2 pl-3 my-1"
        style={{ borderLeft: "2px solid var(--color-pink)" }}
      >
        <span
          className="text-xs font-semibold block mb-1"
          style={{
            fontFamily: "var(--font-heading)",
            color: "var(--color-pink)",
          }}
        >
          You
        </span>
        <p className="text-sm leading-relaxed text-[var(--color-text-primary)] italic">
          {entry.text}
        </p>
      </div>
    );
  }

  if (entry.type === "system") {
    return (
      <div
        className="my-2 p-2 rounded-md text-xs"
        style={{
          background: "var(--color-gold-subtle)",
          border: "1px solid var(--color-border)",
          color: "var(--color-text-gold)",
          fontFamily: "var(--font-mono)",
        }}
      >
        {entry.text}
      </div>
    );
  }

  return null;
}

export default function NarrativePanel() {
  return (
    <div className="flex flex-col h-full">
      {/* Scene Image Placeholder */}
      <div
        className="w-full shrink-0"
        style={{
          height: "180px",
          background:
            "linear-gradient(180deg, var(--color-bg-surface) 0%, var(--color-bg-base) 100%)",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Atmospheric gradient overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, var(--color-purple-glow) 0%, transparent 70%)",
            opacity: 0.3,
          }}
        />
        <div className="text-center relative z-10">
          <BookOpen
            size={32}
            className="mx-auto mb-2"
            style={{ color: "var(--color-text-muted)" }}
          />
          <span className="text-xs text-[var(--color-text-muted)]">
            Scene Image
          </span>
          <p className="text-[0.6rem] text-[var(--color-text-muted)] mt-1">
            The Gilded Rat Tavern
          </p>
        </div>
      </div>

      {/* Narrative Content */}
      <div className="panel-header">
        <MessageSquare size={14} className="text-[var(--color-gold)]" />
        Narrative
      </div>
      <div className="panel-content flex-1 overflow-y-auto">
        {narrativeHistory.map((entry, i) => (
          <NarrativeEntry key={i} entry={entry} />
        ))}
        <DiceResultDisplay />
        {/* Streaming cursor placeholder */}
        <div className="py-2">
          <span className="streaming-cursor text-sm text-[var(--color-text-primary)]" />
        </div>
      </div>

      {/* Player Input Area */}
      <div
        className="shrink-0 p-3"
        style={{
          background:
            "linear-gradient(135deg, var(--color-bg-base) 0%, var(--color-bg-deep) 100%)",
          borderTop: "1px solid var(--color-border)",
        }}
      >
        {/* Action Suggestions */}
        <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
          {["Examine the note", "Persuade Marcus", "Check surroundings"].map(
            (action) => (
              <button
                key={action}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[0.65rem] whitespace-nowrap cursor-pointer transition-all duration-150"
                style={{
                  background: "var(--color-bg-elevated)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-secondary)",
                }}
              >
                <ChevronRight size={10} />
                {action}
              </button>
            ),
          )}
        </div>

        {/* Text Input */}
        <div
          className="flex items-center gap-2 p-2 rounded-xl"
          style={{
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border)",
          }}
        >
          <input
            type="text"
            placeholder="What do you do?"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{
              color: "var(--color-text-primary)",
              fontFamily: "var(--font-body)",
            }}
          />
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150"
            style={{
              background:
                "linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-dim) 100%)",
              border: "none",
              color: "var(--color-bg-deepest)",
            }}
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
