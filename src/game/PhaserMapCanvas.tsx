"use client";

import { useEffect, useRef, useCallback } from "react";
import type { LocationDepth } from "@/data/placeholder";

type PhaserMapCanvasProps = {
  width: number;
  height: number;
  depth?: LocationDepth;
  parentId?: string | null;
  compact?: boolean;
  onLocationClick?: (locationId: string) => void;
  onLocationHover?: (locationId: string | null) => void;
};

export default function PhaserMapCanvas({
  width,
  height,
  depth = "district",
  parentId = null,
  compact = false,
  onLocationClick,
  onLocationHover,
}: PhaserMapCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<import("./MapScene").default | null>(null);

  const onLocationClickRef = useRef(onLocationClick);
  const onLocationHoverRef = useRef(onLocationHover);
  onLocationClickRef.current = onLocationClick;
  onLocationHoverRef.current = onLocationHover;

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    // Dynamic import to avoid SSR issues
    const init = async () => {
      const Phaser = (await import("phaser")).default;
      const { default: MapScene } = await import("./MapScene");

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: containerRef.current!,
        width,
        height,
        backgroundColor: "#0d0814",
        scene: MapScene,
        scale: {
          mode: Phaser.Scale.NONE,
        },
        input: {
          mouse: { preventDefaultWheel: false },
        },
        // Pass initial data to the scene
        callbacks: {
          preBoot: (game) => {
            game.registry.set("initialDepth", depth);
            game.registry.set("initialParentId", parentId);
          },
        },
      };

      const game = new Phaser.Game(config);
      gameRef.current = game;

      // Wait for scene to be ready
      game.events.on("ready", () => {
        const scene = game.scene.getScene("MapScene") as import("./MapScene").default;
        sceneRef.current = scene;

        // Re-init with proper data and events
        scene.scene.restart({
          depth,
          parentId,
          compact,
          events: {
            onLocationClick: (id: string) => onLocationClickRef.current?.(id),
            onLocationHover: (id: string | null) => onLocationHoverRef.current?.(id),
          },
        });
      });
    };

    init();

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
      sceneRef.current = null;
    };
  // Only run on mount/unmount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update scene when depth/parentId changes
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setView(depth, parentId);
    }
  }, [depth, parentId]);

  // Resize game when dimensions change
  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.scale.resize(width, height);
      if (sceneRef.current) {
        sceneRef.current.renderMap();
      }
    }
  }, [width, height]);

  return (
    <div
      ref={containerRef}
      style={{ width: `${width}px`, height: `${height}px`, overflow: "hidden", borderRadius: "8px" }}
    />
  );
}
