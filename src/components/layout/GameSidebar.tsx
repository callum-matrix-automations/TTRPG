"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from "lucide-react";

interface NavItem {
  id: string;
  name: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  group?: string;
}

const sidebarVariants = {
  open: { width: "13rem" },
  closed: { width: "3.25rem" },
};

const labelVariants = {
  open: { x: 0, opacity: 1, transition: { x: { stiffness: 1000, velocity: -100 } } },
  closed: { x: -16, opacity: 0, transition: { x: { stiffness: 100 } } },
};

const transitionProps = {
  type: "tween" as const,
  ease: "easeOut" as const,
  duration: 0.2,
};

const staggerVariants = {
  open: { transition: { staggerChildren: 0.03, delayChildren: 0.02 } },
};

export default function GameSidebar({
  items,
  activeItem,
  panelOpen,
  expanded,
  onItemClick,
  onToggleExpand,
  side,
}: {
  items: NavItem[];
  activeItem: string;
  panelOpen: boolean;
  expanded: boolean;
  onItemClick: (id: string) => void;
  onToggleExpand: () => void;
  side: "left" | "right";
}) {
  const isCollapsed = !expanded;

  const ToggleIcon = side === "left"
    ? expanded ? PanelLeftClose : PanelLeftOpen
    : expanded ? PanelRightClose : PanelRightOpen;

  // Group items
  const groups: { group: string | null; items: NavItem[] }[] = [];
  let currentGroup: string | null | undefined = undefined;
  items.forEach((item) => {
    if (item.group !== currentGroup) {
      currentGroup = item.group ?? null;
      groups.push({ group: currentGroup, items: [] });
    }
    groups[groups.length - 1].items.push(item);
  });

  return (
    <motion.div
      className={cn("h-full shrink-0 flex flex-col z-40")}
      style={{
        background: "linear-gradient(180deg, var(--color-bg-base) 0%, var(--color-bg-deep) 100%)",
        borderRight: side === "left" ? "1px solid var(--color-border)" : "none",
        borderLeft: side === "right" ? "1px solid var(--color-border)" : "none",
      }}
      initial="closed"
      animate={isCollapsed ? "closed" : "open"}
      variants={sidebarVariants}
      transition={transitionProps}
    >
      {/* Toggle button */}
      <div className="shrink-0 p-1.5" style={{ borderBottom: "1px solid var(--color-border-subtle)" }}>
        <button
          onClick={onToggleExpand}
          className="w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 cursor-pointer transition-all duration-150 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
          style={{ background: "transparent", border: "none" }}
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
        >
          <div className="flex items-center justify-center w-5 shrink-0">
            <ToggleIcon size={16} />
          </div>
          <motion.span
            variants={labelVariants}
            className="text-[0.7rem] whitespace-nowrap overflow-hidden"
            style={{ fontFamily: "var(--font-body)" }}
          >
            {!isCollapsed && (expanded ? "Collapse" : "Expand")}
          </motion.span>
        </button>
      </div>

      <motion.ul variants={staggerVariants} className="flex h-full flex-col">
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-0.5 p-1.5">
            {groups.map((group, gi) => (
              <div key={gi}>
                {gi > 0 && <Separator className="my-1.5" />}
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = panelOpen && activeItem === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => onItemClick(item.id)}
                      className={cn(
                        "w-full flex items-center gap-2.5 rounded-md px-2.5 py-2 text-left transition-all duration-150 group relative cursor-pointer",
                        isActive
                          ? "text-[var(--color-gold)]"
                          : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]",
                      )}
                      style={{
                        background: isActive ? "var(--color-gold-subtle)" : "transparent",
                      }}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <div
                          className="absolute rounded-full"
                          style={{
                            [side === "left" ? "left" : "right"]: "0px",
                            top: "25%",
                            height: "50%",
                            width: "3px",
                            background: "var(--color-gold)",
                            boxShadow: "0 0 8px var(--color-gold-glow)",
                          }}
                        />
                      )}

                      <div className="flex items-center justify-center w-5 shrink-0">
                        <Icon
                          size={16}
                          className={cn(
                            "transition-colors duration-150",
                            isActive
                              ? "text-[var(--color-gold)]"
                              : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]",
                          )}
                        />
                      </div>

                      <motion.span
                        variants={labelVariants}
                        className={cn(
                          "text-[0.75rem] whitespace-nowrap overflow-hidden",
                          isActive ? "font-medium" : "font-normal",
                        )}
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {!isCollapsed && item.name}
                      </motion.span>

                      {/* Tooltip when collapsed */}
                      {isCollapsed && (
                        <div
                          className={cn(
                            "absolute px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50 pointer-events-none",
                            side === "left" ? "left-full ml-2" : "right-full mr-2",
                          )}
                          style={{
                            background: "var(--color-bg-surface)",
                            border: "1px solid var(--color-border-strong)",
                            color: "var(--color-text-primary)",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
                            fontFamily: "var(--font-body)",
                          }}
                        >
                          {item.name}
                          <div
                            className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rotate-45"
                            style={{
                              background: "var(--color-bg-surface)",
                              borderColor: "var(--color-border-strong)",
                              [side === "left" ? "left" : "right"]: "-4px",
                              [side === "left" ? "borderLeft" : "borderRight"]: "1px solid var(--color-border-strong)",
                              [side === "left" ? "borderBottom" : "borderTop"]: "1px solid var(--color-border-strong)",
                            }}
                          />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </ScrollArea>
      </motion.ul>
    </motion.div>
  );
}
