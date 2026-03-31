"use client";

import * as React from "react";
import { motion, type Transition } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const springTransition: Transition = { type: "spring", stiffness: 300, damping: 30 };

const summaryTextVariants = { collapsed: { opacity: 1, y: 0 }, expanded: { opacity: 0, y: -16 } };
const actionTextVariants = { collapsed: { opacity: 0, y: 16 }, expanded: { opacity: 1, y: 0 } };

export function HoverRevealCard({
  summary,
  details,
  footerIcon,
  footerLabel,
  footerAction,
  footerActionLabel,
  accentColor,
  onClick,
}: {
  summary: React.ReactNode;
  details: React.ReactNode;
  footerIcon: React.ReactNode;
  footerLabel: string;
  footerAction?: () => void;
  footerActionLabel?: string;
  accentColor?: string;
  onClick?: () => void;
}) {
  return (
    <motion.div
      className="rounded-xl space-y-2 cursor-pointer"
      style={{
        background: "var(--color-bg-elevated)",
        padding: "8px",
        border: "1px solid var(--color-border)",
      }}
      initial="collapsed"
      whileHover="expanded"
      onClick={onClick ?? footerAction}
    >
      {/* Main card area */}
      <motion.div
        layout="position"
        transition={springTransition}
        className="rounded-lg px-3 py-2.5"
        style={{ background: "var(--color-bg-base)", border: "1px solid var(--color-border-subtle)" }}
      >
        {/* Always visible summary */}
        {summary}

        {/* Reveal on hover */}
        <motion.div
          variants={{
            collapsed: { height: 0, opacity: 0, marginTop: 0 },
            expanded: { height: "auto", opacity: 1, marginTop: "10px" },
          }}
          transition={{ staggerChildren: 0.08, ...springTransition }}
          className="overflow-hidden"
        >
          {details}
        </motion.div>
      </motion.div>

      {/* Footer bar */}
      <div className="flex items-center gap-2 px-1">
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
          style={{ background: accentColor ?? "var(--color-gold)", color: "var(--color-bg-deepest)" }}
        >
          {footerIcon}
        </div>
        <span className="grid flex-1">
          <motion.span
            className="text-[0.7rem] font-medium row-start-1 col-start-1"
            style={{ color: "var(--color-text-muted)" }}
            variants={summaryTextVariants}
            transition={{ duration: 0.22, ease: "easeInOut" }}
          >
            {footerLabel}
          </motion.span>
          <motion.span
            className="text-[0.7rem] font-medium flex items-center gap-1 row-start-1 col-start-1 cursor-pointer"
            style={{ color: accentColor ?? "var(--color-gold)" }}
            variants={actionTextVariants}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            onClick={(e) => {
              if (footerAction) {
                e.stopPropagation();
                footerAction();
              }
            }}
          >
            {footerActionLabel ?? "View Details"} <ArrowUpRight size={13} />
          </motion.span>
        </span>
      </div>
    </motion.div>
  );
}

// Animated detail row — fades/slides in with stagger
export function RevealRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{ collapsed: { opacity: 0, y: 8 }, expanded: { opacity: 1, y: 0 } }}
      transition={springTransition}
      className={className ?? "mt-1.5"}
    >
      {children}
    </motion.div>
  );
}

// Animated progress bar for reveal sections
export function RevealBar({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  color?: string;
}) {
  const barColor = color ?? "var(--color-gold)";
  return (
    <RevealRow>
      <div className="flex items-center justify-between text-[0.6rem] font-medium mb-0.5" style={{ color: "var(--color-text-muted)" }}>
        <div className="flex items-center gap-1.5">
          {icon}
          {label}
        </div>
        <span className="stat-value text-[0.6rem]">{value}</span>
      </div>
      <div className="h-1 w-full rounded-full" style={{ background: "var(--color-bg-deep)" }}>
        <motion.div
          className="h-1 rounded-full"
          style={{ background: barColor }}
          variants={{ collapsed: { width: 0 }, expanded: { width: value } }}
          transition={springTransition}
        />
      </div>
    </RevealRow>
  );
}
