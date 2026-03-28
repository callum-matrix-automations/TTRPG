"use client";

import { ScrollText, CheckCircle2, Circle, Trophy, Coins, Star } from "lucide-react";
import { questLog } from "@/data/placeholder";

const statusColors: Record<string, string> = {
  active: "var(--color-gold)",
  completed: "var(--color-success)",
  failed: "var(--color-danger)",
};

export default function QuestLog() {
  return (
    <div className="flex flex-col h-full">
      <div className="panel-header">
        <ScrollText size={14} className="text-[var(--color-gold)]" />
        Quest Log
        <span
          className="ml-auto badge"
          style={{
            background: "var(--color-gold-subtle)",
            color: "var(--color-gold-light)",
          }}
        >
          {questLog.filter((q) => q.status === "active").length} active
        </span>
      </div>
      <div className="panel-content space-y-2">
        {questLog.map((quest) => (
          <div
            key={quest.id}
            className="card cursor-pointer"
            style={{
              borderLeft: `3px solid ${statusColors[quest.status]}`,
              opacity: quest.status === "completed" ? 0.6 : 1,
            }}
          >
            {/* Title */}
            <div className="flex items-center gap-2 mb-1">
              {quest.status === "completed" ? (
                <CheckCircle2
                  size={13}
                  style={{ color: statusColors[quest.status] }}
                />
              ) : (
                <ScrollText
                  size={13}
                  style={{ color: statusColors[quest.status] }}
                />
              )}
              <span
                className="text-xs font-semibold"
                style={{
                  fontFamily: "var(--font-heading)",
                  color: "var(--color-pink-light)",
                }}
              >
                {quest.title}
              </span>
            </div>

            {/* Description */}
            <p className="text-[0.65rem] text-[var(--color-text-secondary)] mb-2 leading-relaxed">
              {quest.description}
            </p>

            {/* Objectives */}
            <div className="space-y-0.5 mb-2">
              {quest.objectives.map((obj, i) => (
                <div
                  key={i}
                  className="flex items-start gap-1.5 text-[0.65rem]"
                >
                  {obj.completed ? (
                    <CheckCircle2
                      size={11}
                      className="mt-0.5 flex-shrink-0 text-[var(--color-success)]"
                    />
                  ) : (
                    <Circle
                      size={11}
                      className="mt-0.5 flex-shrink-0 text-[var(--color-text-muted)]"
                    />
                  )}
                  <span
                    className={
                      obj.completed
                        ? "line-through text-[var(--color-text-muted)]"
                        : "text-[var(--color-text-secondary)]"
                    }
                  >
                    {obj.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Rewards Preview */}
            <div
              className="flex items-center gap-3 pt-1.5"
              style={{ borderTop: "1px solid var(--color-border-subtle)" }}
            >
              <div className="flex items-center gap-1">
                <Star size={10} className="text-[var(--color-xp)]" />
                <span className="stat-value text-[0.6rem]">
                  {quest.rewards.xp} XP
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Coins size={10} className="text-[var(--color-gold)]" />
                <span className="stat-value text-[0.6rem]">
                  {quest.rewards.gold} gp
                </span>
              </div>
              {quest.rewards.items.length > 0 && (
                <div className="flex items-center gap-1">
                  <Trophy size={10} className="text-[var(--color-purple-light)]" />
                  <span className="text-[0.6rem] text-[var(--color-purple-light)]">
                    {quest.rewards.items.join(", ")}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
