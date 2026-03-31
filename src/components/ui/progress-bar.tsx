"use client";

import { useEffect, useState } from "react";

export function ProgressBar({
  value,
  color,
  glowColor,
  height = 6,
  animated = true,
  className,
}: {
  value: number;
  color: string;
  glowColor?: string;
  height?: number;
  animated?: boolean;
  className?: string;
}) {
  const [width, setWidth] = useState(animated ? 0 : value);

  useEffect(() => {
    if (animated) {
      const timer = requestAnimationFrame(() => setWidth(value));
      return () => cancelAnimationFrame(timer);
    }
    setWidth(value);
  }, [value, animated]);

  return (
    <div
      className={`w-full rounded-full overflow-hidden ${className ?? ""}`}
      style={{ height: `${height}px`, background: "var(--color-bg-deep)" }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${Math.min(Math.max(width, 0), 100)}%`,
          background: color,
          boxShadow: glowColor ? `0 0 6px ${glowColor}` : "none",
          transition: animated ? "width 0.6s ease-out" : "none",
        }}
      />
    </div>
  );
}
