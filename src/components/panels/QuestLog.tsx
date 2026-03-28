"use client";

import { useState } from "react";
import { ScrollText, CheckCircle2, Circle, Trophy, Coins, Star } from "lucide-react";
import { questLog, type Quest } from "@/data/placeholder";
import QuestModal from "@/components/modals/QuestModal";

const statusColors: Record<string, string> = {
  active: "var(--color-gold)",
  completed: "var(--color-success)",
  failed: "var(--color-danger)",
};

export default function QuestLog() {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

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
            onClick={() => setSelectedQuest(quest)}
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
            <p className="text-[0.65rem] text-[var(--color-text-secondary)] mb-2 leading-relaxed line-clamp-2">
              {quest.description}
            </p>

            {/* Objectives summary */}
            <div className="flex items-center gap-2 mb-2">
              <div className="progress-bar-bg flex-1" style={{ height: "3px" }}>
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${(quest.objectives.filter((o) => o.completed).length / quest.objectives.length) * 100}%`,
                    background: statusColors[quest.status],
                  }}
                />
              </div>
              <span className="stat-value text-[0.55rem]">
                {quest.objectives.filter((o) => o.completed).length}/{quest.objectives.length}
              </span>
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
                    {quest.rewards.items.length} item{quest.rewards.items.length > 1 ? "s" : ""}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedQuest && (
        <QuestModal quest={selectedQuest} onClose={() => setSelectedQuest(null)} />
      )}
    </div>
  );
}
