"use client";

import { useState } from "react";
import { ScrollText, CheckCircle2, Circle, Star, Coins, User } from "lucide-react";
import { questLog, type Quest } from "@/data/placeholder";
import { AvatarChip } from "@/components/ui/avatar-chip";
import QuestModal from "@/components/modals/QuestModal";
import { HoverRevealCard, RevealRow } from "@/components/ui/hover-reveal-card";

const statusColors: Record<string, string> = {
  active: "var(--color-gold)",
  completed: "var(--color-success)",
  failed: "var(--color-danger)",
};

function QuestCard({ quest, onOpenModal }: { quest: Quest; onOpenModal: () => void }) {
  const completedCount = quest.objectives.filter((o) => o.completed).length;
  const statusColor = statusColors[quest.status];

  return (
    <HoverRevealCard
      accentColor={statusColor}
      footerIcon={<ScrollText size={11} />}
      footerLabel={quest.status === "completed" ? "Completed" : "Active Quest"}
      footerActionLabel="View Details"
      footerAction={onOpenModal}
      summary={
        <div style={{ opacity: quest.status === "completed" ? 0.6 : 1 }}>
          <div className="flex items-center gap-2 mb-1">
            {quest.status === "completed" ? (
              <CheckCircle2 size={12} style={{ color: statusColor }} />
            ) : (
              <ScrollText size={12} style={{ color: statusColor }} />
            )}
            <span className="text-xs font-semibold truncate" style={{ fontFamily: "var(--font-heading)", color: "var(--color-pink-light)" }}>
              {quest.title}
            </span>
          </div>
          <p className="text-[0.6rem] text-[var(--color-text-secondary)] line-clamp-1">{quest.description}</p>
          {/* Progress bar */}
          <div className="flex items-center gap-2 mt-1.5">
            <div className="progress-bar-bg flex-1" style={{ height: "3px" }}>
              <div className="progress-bar-fill" style={{ width: `${(completedCount / quest.objectives.length) * 100}%`, background: statusColor }} />
            </div>
            <span className="stat-value text-[0.5rem]">{completedCount}/{quest.objectives.length}</span>
          </div>
        </div>
      }
      details={
        <>
          {/* Quest giver chip */}
          <RevealRow>
            <AvatarChip label={quest.questGiver} icon={<User size={10} />} variant="warning" size="xs" />
          </RevealRow>

          {/* Full description */}
          <RevealRow>
            <p className="text-[0.6rem] text-[var(--color-text-secondary)] leading-relaxed">
              {quest.description}
            </p>
          </RevealRow>

          {/* Objectives */}
          <RevealRow>
            <span className="text-[0.55rem] font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>Objectives</span>
            <div className="space-y-0.5 mt-1">
              {quest.objectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-1.5 text-[0.55rem]">
                  {obj.completed ? (
                    <CheckCircle2 size={10} className="mt-0.5 shrink-0" style={{ color: "var(--color-success)" }} />
                  ) : (
                    <Circle size={10} className="mt-0.5 shrink-0" style={{ color: "var(--color-text-muted)" }} />
                  )}
                  <span className={obj.completed ? "line-through text-[var(--color-text-muted)]" : "text-[var(--color-text-secondary)]"}>
                    {obj.text}
                  </span>
                </div>
              ))}
            </div>
          </RevealRow>

          {/* Rewards */}
          <RevealRow>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star size={9} style={{ color: "var(--color-xp)" }} />
                <span className="stat-value text-[0.55rem]">{quest.rewards.xp} XP</span>
              </div>
              {quest.rewards.gold > 0 && (
                <div className="flex items-center gap-1">
                  <Coins size={9} style={{ color: "var(--color-gold)" }} />
                  <span className="stat-value text-[0.55rem]">${quest.rewards.gold}</span>
                </div>
              )}
            </div>
          </RevealRow>
        </>
      }
    />
  );
}

export default function QuestLog() {
  const [selectedQuest, setSelectedQuest] = useState<Quest | null>(null);

  return (
    <div className="flex flex-col h-full">
      <div className="panel-content space-y-2">
        {questLog.map((quest) => (
          <QuestCard key={quest.id} quest={quest} onOpenModal={() => setSelectedQuest(quest)} />
        ))}
      </div>
      {selectedQuest && <QuestModal quest={selectedQuest} onClose={() => setSelectedQuest(null)} />}
    </div>
  );
}
