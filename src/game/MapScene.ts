import Phaser from "phaser";
import { mapLocations, type MapLocation, type LocationDepth } from "@/data/placeholder";

// ── Theme Colors ──
const C = {
  bgDeepest: 0x0d0814,
  bgDeep: 0x140e1f,
  bgBase: 0x1c1228,
  bgElevated: 0x241838,
  bgSurface: 0x2d1e3e,
  gold: 0xdaa520,
  goldDim: 0xb8860b,
  goldLight: 0xeeb428,
  purple: 0x9366d9,
  purpleLight: 0xb48cff,
  pink: 0xffb4dc,
  pinkLight: 0xffc8ff,
  textPrimary: 0xf5dcf5,
  textSecondary: 0xc8a0c8,
  textMuted: 0x8a6a8a,
  danger: 0xef4444,
  success: 0x22c55e,
  mana: 0x60a5fa,
  border: 0x3a2850,
  borderStrong: 0x5a3870,
};

const DANGER_COLORS = [C.success, C.gold, 0xf97316, C.danger];
const DANGER_LABELS = ["Safe", "Low Risk", "Moderate", "Dangerous"];

export type MapSceneEvents = {
  onLocationClick?: (locationId: string) => void;
  onLocationHover?: (locationId: string | null) => void;
};

export default class MapScene extends Phaser.Scene {
  private containers: Map<string, Phaser.GameObjects.Container> = new Map();
  private pathGraphics: Phaser.GameObjects.Graphics | null = null;
  private bgGraphics: Phaser.GameObjects.Graphics | null = null;
  private currentDepth: LocationDepth = "district";
  private currentParentId: string | null = null;
  private externalEvents: MapSceneEvents = {};
  private compact = false; // sidebar preview mode: small pins instead of full cards
  private isDragging = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private dragMoved = false;

  constructor() {
    super({ key: "MapScene" });
  }

  init(data: { depth?: LocationDepth; parentId?: string | null; events?: MapSceneEvents; compact?: boolean }) {
    this.currentDepth = data.depth ?? "district";
    this.currentParentId = data.parentId ?? null;
    this.externalEvents = data.events ?? {};
    this.compact = data.compact ?? false;
  }

  create() {
    this.cameras.main.setBackgroundColor(C.bgDeepest);

    // ── Camera pan (drag) ──
    this.input.on("pointerdown", (p: Phaser.Input.Pointer) => {
      this.isDragging = true;
      this.dragMoved = false;
      this.dragStartX = p.x;
      this.dragStartY = p.y;
    });
    this.input.on("pointermove", (p: Phaser.Input.Pointer) => {
      if (!this.isDragging || !p.isDown) return;
      const dx = p.x - this.dragStartX;
      const dy = p.y - this.dragStartY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) this.dragMoved = true;
      this.cameras.main.scrollX -= dx;
      this.cameras.main.scrollY -= dy;
      this.dragStartX = p.x;
      this.dragStartY = p.y;
    });
    this.input.on("pointerup", () => { this.isDragging = false; });

    // ── Camera zoom (scroll) ──
    this.input.on("wheel", (_p: Phaser.Input.Pointer, _go: unknown[], _dx: number, dy: number) => {
      const cam = this.cameras.main;
      cam.zoom = Phaser.Math.Clamp(cam.zoom + (dy > 0 ? -0.08 : 0.08), 0.5, 2.5);
    });

    this.renderMap();
  }

  renderMap() {
    // Cleanup
    this.containers.forEach((c) => c.destroy());
    this.containers.clear();
    this.pathGraphics?.destroy();
    this.bgGraphics?.destroy();

    const { width, height } = this.scale;
    const locations = this.getVisibleLocations();

    // ── Background atmosphere ──
    this.bgGraphics = this.add.graphics();
    this.drawBackground(width, height);

    // ── Paths between locations ──
    this.pathGraphics = this.add.graphics();
    this.drawPaths(locations, width, height);

    // ── Location markers ──
    locations.forEach((loc) => {
      if (this.compact) {
        this.createCompactPin(loc, width, height);
      } else {
        this.createLocationMarker(loc, width, height);
      }
    });
  }

  private getVisibleLocations(): MapLocation[] {
    if (this.currentDepth === "district") {
      return mapLocations.filter((l) => l.depth === "district" && l.discovered);
    }
    return mapLocations.filter((l) => l.parentId === this.currentParentId && l.discovered);
  }

  // ── Atmospheric background ──
  private drawBackground(w: number, h: number) {
    const g = this.bgGraphics!;

    // Radial gradient center glow
    const cx = w / 2, cy = h / 2;
    for (let r = Math.max(w, h) * 0.6; r > 0; r -= 4) {
      const alpha = (r / (Math.max(w, h) * 0.6)) * 0.03;
      g.fillStyle(C.purple, alpha);
      g.fillCircle(cx, cy, r);
    }

    // Subtle grid overlay
    g.lineStyle(1, C.border, 0.04);
    const gridSize = 60;
    for (let x = 0; x < w; x += gridSize) {
      g.moveTo(x, 0); g.lineTo(x, h); g.strokePath();
    }
    for (let y = 0; y < h; y += gridSize) {
      g.moveTo(0, y); g.lineTo(w, y); g.strokePath();
    }
  }

  // ── Paths between connected locations ──
  private drawPaths(locations: MapLocation[], w: number, h: number) {
    const g = this.pathGraphics!;
    const locMap = new Map(locations.map((l) => [l.id, l]));
    const drawnPairs = new Set<string>();

    locations.forEach((loc) => {
      loc.connections.forEach((conn) => {
        if (!conn.discovered) return;
        const target = locMap.get(conn.targetId);
        if (!target) return;

        const pairKey = [loc.id, target.id].sort().join("-");
        if (drawnPairs.has(pairKey)) return;
        drawnPairs.add(pairKey);

        const x1 = (loc.x / 100) * w;
        const y1 = (loc.y / 100) * h;
        const x2 = (target.x / 100) * w;
        const y2 = (target.y / 100) * h;

        // Road/path with slight curve
        const midX = (x1 + x2) / 2 + (Math.random() - 0.5) * 20;
        const midY = (y1 + y2) / 2 + (Math.random() - 0.5) * 20;

        // Outer glow
        g.lineStyle(6, C.border, 0.1);
        g.beginPath();
        g.moveTo(x1, y1);
        g.lineTo(midX, midY);
        g.lineTo(x2, y2);
        g.strokePath();

        // Inner path
        g.lineStyle(2, conn.accessible ? C.borderStrong : C.danger, conn.accessible ? 0.3 : 0.15);
        g.beginPath();
        g.moveTo(x1, y1);
        g.lineTo(midX, midY);
        g.lineTo(x2, y2);
        g.strokePath();

        // Dotted center line
        g.lineStyle(1, conn.accessible ? C.gold : C.danger, conn.accessible ? 0.15 : 0.08);
        const segs = 30;
        for (let i = 0; i < segs; i += 2) {
          const t1 = i / segs, t2 = (i + 1) / segs;
          const px1 = x1 + (x2 - x1) * t1, py1 = y1 + (y2 - y1) * t1;
          const px2 = x1 + (x2 - x1) * t2, py2 = y1 + (y2 - y1) * t2;
          g.moveTo(px1, py1);
          g.lineTo(px2, py2);
        }
        g.strokePath();
      });
    });
  }

  // ── Styled location marker ──
  private createLocationMarker(loc: MapLocation, mapW: number, mapH: number) {
    const x = (loc.x / 100) * mapW;
    const y = (loc.y / 100) * mapH;
    const isHere = loc.playerIsHere;
    const isDistrict = loc.depth === "district";
    const fColor = loc.factionColor ? parseInt(loc.factionColor.replace("#", ""), 16) : C.textMuted;

    const container = this.add.container(x, y);

    // ── Player location glow pulse ──
    if (isHere) {
      const pulseOuter = this.add.circle(0, 0, isDistrict ? 40 : 28, C.gold, 0.06);
      container.add(pulseOuter);
      this.tweens.add({
        targets: pulseOuter,
        alpha: { from: 0.06, to: 0.01 },
        scale: { from: 1, to: 1.5 },
        duration: 2000, yoyo: true, repeat: -1, ease: "Sine.easeInOut",
      });

      const pulseInner = this.add.circle(0, 0, isDistrict ? 28 : 20, C.gold, 0.1);
      container.add(pulseInner);
      this.tweens.add({
        targets: pulseInner,
        alpha: { from: 0.1, to: 0.03 },
        scale: { from: 1, to: 1.2 },
        duration: 1500, yoyo: true, repeat: -1, ease: "Sine.easeInOut", delay: 300,
      });
    }

    // ── Marker card background ──
    const cardW = isDistrict ? 140 : 120;
    const cardH = isDistrict ? 48 : 40;
    const cardX = -cardW / 2;
    const cardY = -cardH / 2;

    // Card shadow
    const shadow = this.add.graphics();
    shadow.fillStyle(0x000000, 0.3);
    shadow.fillRoundedRect(cardX + 2, cardY + 2, cardW, cardH, 8);
    container.add(shadow);

    // Card background
    const cardBg = this.add.graphics();
    cardBg.fillStyle(isHere ? C.bgSurface : C.bgElevated, isHere ? 0.95 : 0.85);
    cardBg.fillRoundedRect(cardX, cardY, cardW, cardH, 8);
    container.add(cardBg);

    // Card border
    const cardBorder = this.add.graphics();
    cardBorder.lineStyle(1.5, isHere ? C.gold : fColor, isHere ? 0.8 : 0.4);
    cardBorder.strokeRoundedRect(cardX, cardY, cardW, cardH, 8);
    container.add(cardBorder);

    // ── Left accent bar ──
    const accentBar = this.add.graphics();
    accentBar.fillStyle(fColor, 0.8);
    accentBar.fillRoundedRect(cardX, cardY, 4, cardH, { tl: 8, bl: 8, tr: 0, br: 0 });
    container.add(accentBar);

    // ── Location name ──
    const nameText = this.add.text(cardX + 12, cardY + (isDistrict ? 8 : 6), loc.name, {
      fontFamily: "'Playfair Display', serif",
      fontSize: isDistrict ? "12px" : "10px",
      fontStyle: "bold",
      color: isHere ? "#daa520" : "#f5dcf5",
    });
    nameText.setWordWrapWidth(cardW - 30);
    container.add(nameText);

    // ── Subtitle: faction or description snippet ──
    const subtitle = loc.faction ?? (loc.description.length > 30 ? loc.description.slice(0, 30) + "..." : loc.description);
    const subText = this.add.text(cardX + 12, cardY + (isDistrict ? 24 : 20), subtitle, {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: "8px",
      color: loc.factionColor ?? "#8a6a8a",
    });
    subText.setWordWrapWidth(cardW - 30);
    container.add(subText);

    // ── Right side indicators ──
    // Danger dot
    if (loc.dangerLevel > 0) {
      const dangerDot = this.add.circle(cardX + cardW - 12, cardY + 12, 4, DANGER_COLORS[loc.dangerLevel]);
      container.add(dangerDot);
    }

    // Restricted icon (red dot)
    if (loc.restricted) {
      const lockDot = this.add.circle(cardX + cardW - 12, cardY + cardH - 12, 4, C.danger, 0.8);
      container.add(lockDot);
    }

    // ── "You are here" pin ──
    if (isHere) {
      const pinY = cardY - 14;
      const pin = this.add.graphics();
      pin.fillStyle(C.gold, 1);
      // Pin head
      pin.fillCircle(0, pinY, 6);
      // Pin point
      pin.fillTriangle(-4, pinY + 4, 4, pinY + 4, 0, pinY + 12);
      // Inner dot
      pin.fillStyle(C.bgDeepest, 1);
      pin.fillCircle(0, pinY, 3);
      container.add(pin);
    }

    // ── Interactivity ──
    // Create a hit area covering the card
    const hitZone = this.add.zone(0, 0, cardW + 10, cardH + 10).setInteractive({ cursor: "pointer" });
    container.add(hitZone);

    hitZone.on("pointerover", () => {
      cardBorder.clear();
      cardBorder.lineStyle(2, C.goldLight, 0.9);
      cardBorder.strokeRoundedRect(cardX, cardY, cardW, cardH, 8);
      container.setScale(1.05);
      this.externalEvents.onLocationHover?.(loc.id);
    });

    hitZone.on("pointerout", () => {
      cardBorder.clear();
      cardBorder.lineStyle(1.5, isHere ? C.gold : fColor, isHere ? 0.8 : 0.4);
      cardBorder.strokeRoundedRect(cardX, cardY, cardW, cardH, 8);
      container.setScale(1);
      this.externalEvents.onLocationHover?.(null);
    });

    hitZone.on("pointerup", () => {
      if (!this.dragMoved) {
        this.externalEvents.onLocationClick?.(loc.id);
      }
    });

    this.containers.set(loc.id, container);
  }

  // ── Compact pin for sidebar preview ──
  private createCompactPin(loc: MapLocation, mapW: number, mapH: number) {
    const x = (loc.x / 100) * mapW;
    const y = (loc.y / 100) * mapH;
    const isHere = loc.playerIsHere;
    const fColor = loc.factionColor ? parseInt(loc.factionColor.replace("#", ""), 16) : C.textMuted;

    const container = this.add.container(x, y);

    // Glow for player location
    if (isHere) {
      const glow = this.add.circle(0, 0, 14, C.gold, 0.1);
      container.add(glow);
      this.tweens.add({
        targets: glow, alpha: { from: 0.1, to: 0.02 }, scale: { from: 1, to: 1.4 },
        duration: 1800, yoyo: true, repeat: -1, ease: "Sine.easeInOut",
      });
    }

    // Pin dot
    const dotSize = isHere ? 7 : 5;
    const dot = this.add.circle(0, 0, dotSize, isHere ? C.gold : fColor);
    dot.setStrokeStyle(1.5, isHere ? C.goldLight : C.bgDeepest);
    container.add(dot);

    // Danger ring
    if (loc.dangerLevel >= 2) {
      const dangerRing = this.add.circle(0, 0, dotSize + 3);
      dangerRing.setStrokeStyle(1, DANGER_COLORS[loc.dangerLevel], 0.5);
      container.add(dangerRing);
    }

    // Name label (short)
    const shortName = loc.name.length > 16 ? loc.name.slice(0, 14) + "…" : loc.name;
    const label = this.add.text(0, dotSize + 5, shortName, {
      fontFamily: "'Montserrat', sans-serif",
      fontSize: "7px",
      color: isHere ? "#daa520" : "#c8a0c8",
      align: "center",
    });
    label.setOrigin(0.5, 0);
    container.add(label);

    // Hit zone
    const hitZone = this.add.zone(0, 0, 50, 30).setInteractive({ cursor: "pointer" });
    container.add(hitZone);

    hitZone.on("pointerover", () => {
      dot.setScale(1.4);
      label.setColor("#eeb428");
      this.externalEvents.onLocationHover?.(loc.id);
    });
    hitZone.on("pointerout", () => {
      dot.setScale(1);
      label.setColor(isHere ? "#daa520" : "#c8a0c8");
      this.externalEvents.onLocationHover?.(null);
    });
    hitZone.on("pointerup", () => {
      if (!this.dragMoved) this.externalEvents.onLocationClick?.(loc.id);
    });

    this.containers.set(loc.id, container);
  }

  // ── Public API ──

  setView(depth: LocationDepth, parentId: string | null) {
    this.currentDepth = depth;
    this.currentParentId = parentId;
    this.renderMap();
    this.cameras.main.scrollX = 0;
    this.cameras.main.scrollY = 0;
    this.cameras.main.zoom = 1;
  }

  getView() {
    return { depth: this.currentDepth, parentId: this.currentParentId };
  }
}
