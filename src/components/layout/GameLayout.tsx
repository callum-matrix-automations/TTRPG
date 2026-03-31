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
  Dna,
  GripVertical,
  X,
} from "lucide-react";

import TopBar from "./TopBar";
import GameSidebar from "./GameSidebar";
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
import TransformationPanel from "@/components/panels/TransformationPanel";
import { ToastTriggerPanel } from "@/components/shared/ToastSystem";

type LeftTab = "character" | "transformation" | "party" | "inventory" | "gear" | "relationships" | "map" | "property";
type RightTab = "npc" | "quests" | "factions";

const leftNavItems = [
  { id: "character", name: "Character", icon: User, group: "player" },
  { id: "transformation", name: "Transformation", icon: Dna, group: "player" },
  { id: "party", name: "Party", icon: Shield, group: "player" },
  { id: "inventory", name: "Inventory", icon: Backpack, group: "items" },
  { id: "gear", name: "Equipment", icon: Swords, group: "items" },
  { id: "map", name: "World Map", icon: Map, group: "world" },
  { id: "property", name: "Property", icon: Home, group: "world" },
  { id: "relationships", name: "Relationships", icon: Network, group: "world" },
];

const rightNavItems = [
  { id: "npc", name: "NPCs", icon: Users, group: "scene" },
  { id: "quests", name: "Quests", icon: ScrollText, group: "scene" },
  { id: "factions", name: "Factions", icon: Flag, group: "scene" },
];

const leftTabLabels: Record<string, string> = {
  character: "Character", transformation: "Transformation", party: "Party",
  inventory: "Inventory", gear: "Equipment", map: "World Map",
  property: "Property", relationships: "Relationships",
};

const rightTabLabels: Record<string, string> = {
  npc: "NPCs", quests: "Quests", factions: "Factions",
};

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
      style={{ width: "8px", background: "var(--color-bg-deepest)" }}
      onMouseDown={onMouseDown}
    >
      <div
        className="flex flex-col items-center rounded transition-colors duration-150"
        style={{
          padding: "6px 1px",
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border)",
        }}
      >
        <GripVertical
          size={12}
          className="transition-colors duration-150"
          style={{ color: "var(--color-text-muted)" }}
        />
      </div>
    </div>
  );
}

// ── Panel Wrapper with close button ──
function PanelWrapper({
  title,
  onClose,
  width,
  children,
}: {
  title: string;
  onClose: () => void;
  width: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="shrink-0 overflow-hidden flex flex-col"
      style={{
        width: `${width}px`,
        background: "linear-gradient(180deg, var(--color-bg-base) 0%, var(--color-bg-deep) 100%)",
      }}
    >
      {/* Panel close bar */}
      <div
        className="flex items-center justify-between px-3 py-1.5 shrink-0"
        style={{
          background: "var(--color-bg-elevated)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <span
          className="text-[0.65rem] font-semibold uppercase tracking-wider"
          style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-heading)" }}
        >
          {title}
        </span>
        <button
          onClick={onClose}
          className="w-5 h-5 rounded flex items-center justify-center cursor-pointer transition-all duration-150"
          style={{
            background: "transparent",
            border: "none",
            color: "var(--color-text-muted)",
          }}
          aria-label="Close panel"
        >
          <X size={13} />
        </button>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">
        {children}
      </div>
    </div>
  );
}

// ── Main Layout ──
export default function GameLayout() {
  const [leftTab, setLeftTab] = useState<LeftTab>("character");
  const [rightTab, setRightTab] = useState<RightTab>("npc");
  const [leftPanelOpen, setLeftPanelOpen] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(false);
  const [leftSidebarExpanded, setLeftSidebarExpanded] = useState(false);
  const [rightSidebarExpanded, setRightSidebarExpanded] = useState(false);

  const leftResize = useDragResize("left", 380, 200, 700);
  const rightResize = useDragResize("right", 380, 200, 700);

  // Clicking a nav item: open the panel, collapse sidebar
  const handleLeftItemClick = (id: string) => {
    if (leftPanelOpen && leftTab === id) {
      setLeftPanelOpen(false);
    } else {
      setLeftTab(id as LeftTab);
      setLeftPanelOpen(true);
      setLeftSidebarExpanded(false);
    }
  };

  const handleRightItemClick = (id: string) => {
    if (rightPanelOpen && rightTab === id) {
      setRightPanelOpen(false);
    } else {
      setRightTab(id as RightTab);
      setRightPanelOpen(true);
      setRightSidebarExpanded(false);
    }
  };

  // Toggle sidebar expand: when expanding, close panel
  const handleLeftToggleExpand = () => {
    const next = !leftSidebarExpanded;
    setLeftSidebarExpanded(next);
    if (next) setLeftPanelOpen(false);
  };

  const handleRightToggleExpand = () => {
    const next = !rightSidebarExpanded;
    setRightSidebarExpanded(next);
    if (next) setRightPanelOpen(false);
  };

  const renderLeftContent = () => {
    switch (leftTab) {
      case "character": return <CharacterSheet />;
      case "transformation": return <TransformationPanel />;
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
        {/* Left Sidebar Navigation */}
        <GameSidebar
          items={leftNavItems}
          activeItem={leftTab}
          panelOpen={leftPanelOpen}
          expanded={leftSidebarExpanded}
          onItemClick={handleLeftItemClick}
          onToggleExpand={handleLeftToggleExpand}
          side="left"
        />

        {/* Left Panel Content */}
        {leftPanelOpen && (
          <>
            <PanelWrapper
              title={leftTabLabels[leftTab] ?? leftTab}
              onClose={() => setLeftPanelOpen(false)}
              width={leftResize.width}
            >
              {renderLeftContent()}
            </PanelWrapper>
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

        {/* Right Panel Content */}
        {rightPanelOpen && (
          <>
            <ResizeHandle onMouseDown={rightResize.onMouseDown} />
            <PanelWrapper
              title={rightTabLabels[rightTab] ?? rightTab}
              onClose={() => setRightPanelOpen(false)}
              width={rightResize.width}
            >
              {renderRightContent()}
            </PanelWrapper>
          </>
        )}

        {/* Right Sidebar Navigation */}
        <GameSidebar
          items={rightNavItems}
          activeItem={rightTab}
          panelOpen={rightPanelOpen}
          expanded={rightSidebarExpanded}
          onItemClick={handleRightItemClick}
          onToggleExpand={handleRightToggleExpand}
          side="right"
        />
      </div>

      {/* Dev: Toast Trigger Panel */}
      <ToastTriggerPanel />
    </div>
  );
}
