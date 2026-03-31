"use client";

import { cn } from "@/lib/utils";

export function ProgressCircle({
  value = 0,
  size = 80,
  strokeWidth = 6,
  color = "var(--color-gold)",
  trackColor = "var(--color-bg-deep)",
  children,
  className,
}: {
  value?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(Math.max(value, 0), 100) / 100) * circumference;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        className="absolute inset-0 -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Indicator */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{
            transition: "stroke-dashoffset 0.5s ease-in-out",
            filter: `drop-shadow(0 0 4px ${color}66)`,
          }}
        />
      </svg>
      {children && (
        <div className="relative z-10 flex flex-col items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
