"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  User,
  Backpack,
  Swords,
  Network,
  Users,
  ScrollText,
  Flag,
  Shield,
  Map,
  Home,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  GripVertical,
} from "lucide-react";

import TopBar from "./TopBar";
import CharacterSheet from "@/components/panels/CharacterSheet";
import PartyPanel from "@/components/panels/PartyPanel";
import InventoryPanel from "@/components/panels/InventoryPanel";
import GearPanel from "@/components/panels/GearPanel";
import RelationshipWeb from "@/components/panels/RelationshipWeb";
import NarrativePanel from "@/components/panels/NarrativePanel";
import NpcPanel from "@/components/panels/NpcPanel";
import QuestLog from "@/components/panels/QuestLog";
import FactionReputation from "@/components/panels/FactionReputation";
import WorldMap from "@/components/panels/WorldMap";
import PropertyPanel from "@/components/panels/PropertyPanel";
import { ToastTriggerPanel } from "@/components/shared/ToastSystem";

type LeftTab = "character" | "party" | "inventory" | "gear" | "relationships" | "map" | "property";
type RightTab = "npc" | "quests" | "factions";

const leftTabs: { id: LeftTab; icon: typeof User; label: string }[] = [
  { id: "character", icon: User, label: "Character" },
  { id: "party", icon: Shield, label: "Party" },
  { id: "inventory", icon: Backpack, label: "Inventory" },
  { id: "gear", icon: Swords, label: "Equipment" },
  { id: "map", icon: Map, label: "World Map" },
  { id: "property", icon: Home, label: "Property" },
  { id: "relationships", icon: Network, label: "Relationships" },
];

const rightTabs: { id: RightTab; icon: typeof Users; label: string }[] = [
  { id: "npc", icon: Users, label: "NPCs" },
  { id: "quests", icon: ScrollText, label: "Quests" },
  { id: "factions", icon: Flag, label: "Factions" },
];

// ── Drag-to-resize hook ──
function useDragResize(
  side: "left" | "right",
  initial: number,
  min: number,
  max: number,
) {
  const [width, setWidth] = useState(initial);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startW = useRef(0);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      dragging.current = true;
      startX.current = e.clientX;
      startW.current = width;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [width],
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const delta = e.clientX - startX.current;
      const newW = side === "left"
        ? startW.current + delta
        : startW.current - delta;
      setWidth(Math.max(min, Math.min(max, newW)));
    };

    const onMouseUp = () => {
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [side, min, max]);

  return { width, onMouseDown };
}

// ── Resize Handle ──
function ResizeHandle({ onMouseDown }: { onMouseDown: (e: React.MouseEvent) => void }) {
  return (
    <div
      className="group flex items-center justify-center shrink-0 cursor-col-resize"
      style={{
        width: "12px",
        background: "var(--color-bg-deepest)",
      }}
      onMouseDown={onMouseDown}
    >
      <div
        className="flex flex-col items-center rounded transition-colors duration-150 group-hover:border-[var(--color-gold)]"
        style={{
          padding: "6px 2px",
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border)",
        }}
      >
        <GripVertical
          size={14}
          className="transition-colors duration-150"
          style={{ color: "var(--color-text-muted)" }}
        />
      </div>
    </div>
  );
}

// ── Icon Strip ──
function IconStrip({
  tabs,
  activeTab,
  onTabClick,
  collapsed,
  onToggle,
  side,
}: {
  tabs: { id: string; icon: React.ComponentType<{ size?: number }>; label: string }[];
  activeTab: string;
  onTabClick: (id: string) => void;
  collapsed: boolean;
  onToggle: () => void;
  side: "left" | "right";
}) {
  const CollapseIcon =
    side === "left"
      ? collapsed ? PanelLeftOpen : PanelLeftClose
      : collapsed ? PanelRightOpen : PanelRightClose;

  return (
    <div
      className="sidebar-icon-strip"
      style={{
        borderRight: side === "left" ? "1px solid var(--color-border)" : "none",
        borderLeft: side === "right" ? "1px solid var(--color-border)" : "none",
      }}
    >
      <button
        onClick={onToggle}
        title={collapsed ? "Expand" : "Collapse"}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <CollapseIcon size={16} />
      </button>
      <div className="w-6 my-1" style={{ borderTop: "1px solid var(--color-border)" }} />
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => onTabClick(tab.id)}
            title={tab.label}
            aria-label={tab.label}
          >
            <Icon size={16} />
          </button>
        );
      })}
    </div>
  );
}

// ── Main Layout ──
export default function GameLayout() {
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [leftTab, setLeftTab] = useState<LeftTab>("character");
  const [rightTab, setRightTab] = useState<RightTab>("npc");

  const leftResize = useDragResize("left", 380, 200, 700);
  const rightResize = useDragResize("right", 380, 200, 700);

  const handleLeftTabClick = useCallback(
    (id: string) => {
      setLeftTab(id as LeftTab);
      if (leftCollapsed) setLeftCollapsed(false);
    },
    [leftCollapsed],
  );

  const handleRightTabClick = useCallback(
    (id: string) => {
      setRightTab(id as RightTab);
      if (rightCollapsed) setRightCollapsed(false);
    },
    [rightCollapsed],
  );

  const renderLeftContent = () => {
    switch (leftTab) {
      case "character": return <CharacterSheet />;
      case "party": return <PartyPanel />;
      case "inventory": return <InventoryPanel />;
      case "gear": return <GearPanel />;
      case "map": return <WorldMap />;
      case "property": return <PropertyPanel />;
      case "relationships": return <RelationshipWeb />;
    }
  };

  const renderRightContent = () => {
    switch (rightTab) {
      case "npc": return <NpcPanel />;
      case "quests": return <QuestLog />;
      case "factions": return <FactionReputation />;
    }
  };

  return (
    <div className="flex flex-col h-screen" style={{ background: "var(--color-bg-deepest)" }}>
      <TopBar />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Icon Strip */}
        <IconStrip
          tabs={leftTabs}
          activeTab={leftTab}
          onTabClick={handleLeftTabClick}
          collapsed={leftCollapsed}
          onToggle={() => setLeftCollapsed((p) => !p)}
          side="left"
        />

        {/* Left Sidebar */}
        {!leftCollapsed && (
          <>
            <div
              className="shrink-0 overflow-hidden flex flex-col"
              style={{
                width: `${leftResize.width}px`,
                background: "linear-gradient(180deg, var(--color-bg-base) 0%, var(--color-bg-deep) 100%)",
              }}
            >
              {renderLeftContent()}
            </div>
            <ResizeHandle onMouseDown={leftResize.onMouseDown} />
          </>
        )}

        {/* Center / Narrative */}
        <div
          className="flex-1 min-w-0 overflow-hidden flex flex-col"
          style={{ background: "var(--color-bg-deepest)" }}
        >
          <NarrativePanel />
        </div>

        {/* Right Sidebar */}
        {!rightCollapsed && (
          <>
            <ResizeHandle onMouseDown={rightResize.onMouseDown} />
            <div
              className="shrink-0 overflow-hidden flex flex-col"
              style={{
                width: `${rightResize.width}px`,
                background: "linear-gradient(180deg, var(--color-bg-base) 0%, var(--color-bg-deep) 100%)",
              }}
            >
              {renderRightContent()}
            </div>
          </>
        )}

        {/* Right Icon Strip */}
        <IconStrip
          tabs={rightTabs}
          activeTab={rightTab}
          onTabClick={handleRightTabClick}
          collapsed={rightCollapsed}
          onToggle={() => setRightCollapsed((p) => !p)}
          side="right"
        />
      </div>

      {/* Dev: Toast Trigger Panel */}
      <ToastTriggerPanel />
    </div>
  );
}
