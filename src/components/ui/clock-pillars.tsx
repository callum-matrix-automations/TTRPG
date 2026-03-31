"use client";

import { motion } from "framer-motion";

type ClockType = "threat" | "event";

const typeColors: Record<ClockType, { from: string; via: string; to: string }> = {
  threat: { from: "rgb(239, 68, 68)", via: "rgb(220, 38, 38)", to: "rgb(185, 28, 28)" },
  event: { from: "rgb(96, 165, 250)", via: "rgb(59, 130, 246)", to: "rgb(37, 99, 235)" },
};

export function ClockPillars({
  segments,
  filled,
  type = "event",
  name,
}: {
  segments: number;
  filled: number;
  type?: ClockType;
  name?: string;
}) {
  const colors = typeColors[type];
  const maxHeight = 60;

  return (
    <div className="flex flex-col items-center gap-2">
      {name && (
        <p
          className="text-[0.65rem] font-semibold uppercase tracking-wider"
          style={{ color: "var(--color-text-muted)" }}
        >
          {name}
        </p>
      )}
      <div className="flex items-end gap-1 pointer-events-none" style={{ height: `${maxHeight + 16}px` }}>
        {Array.from({ length: segments }).map((_, index) => {
          const isFilled = index < filled;
          const barHeight = ((index + 1) / segments) * maxHeight;

          return (
            <div
              key={index}
              className="flex flex-col items-center justify-end"
              style={{ height: `${maxHeight + 16}px`, width: "20px" }}
            >
              {/* Bar container — always at proportional height */}
              <div
                className="w-full rounded-md overflow-hidden"
                style={{
                  height: `${barHeight}px`,
                  background: isFilled ? "transparent" : "var(--color-bg-elevated)",
                  border: `1px solid ${isFilled ? `${colors.from}44` : "var(--color-border)"}`,
                }}
              >
                {/* Fill — grows up from bottom */}
                {isFilled && (
                  <motion.div
                    className="w-full h-full"
                    style={{
                      background: `linear-gradient(to top, ${colors.from}, ${colors.via}, ${colors.to})`,
                      transformOrigin: "bottom",
                      boxShadow: `0 0 8px ${colors.from}33`,
                    }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.1,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  />
                )}
              </div>
              {/* Number below */}
              <span
                className="text-[0.45rem] mt-1"
                style={{ color: isFilled ? colors.from : "var(--color-text-muted)" }}
              >
                {index + 1}
              </span>
            </div>
          );
        })}
      </div>
      <p className="text-[0.6rem]" style={{ color: filled === segments ? colors.from : "var(--color-text-muted)" }}>
        <span className="stat-value">{filled}</span>
        <span> / {segments}</span>
        {filled === segments && <span className="ml-1 font-semibold">Complete</span>}
      </p>
    </div>
  );
}
