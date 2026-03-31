"use client";

import { HelpCircle } from "lucide-react";

export type ChipVariant = "default" | "success" | "danger" | "warning" | "info" | "purple" | "custom";

const variantStyles: Record<Exclude<ChipVariant, "custom">, { bg: string; text: string; border: string }> = {
  default: { bg: "var(--color-bg-elevated)", text: "var(--color-text-secondary)", border: "var(--color-border)" },
  success: { bg: "rgba(34,197,94,0.12)", text: "var(--color-success)", border: "rgba(34,197,94,0.3)" },
  danger: { bg: "rgba(239,68,68,0.12)", text: "var(--color-danger)", border: "rgba(239,68,68,0.3)" },
  warning: { bg: "var(--color-gold-subtle)", text: "var(--color-gold)", border: "rgba(218,165,32,0.3)" },
  info: { bg: "rgba(96,165,250,0.12)", text: "var(--color-mana)", border: "rgba(96,165,250,0.3)" },
  purple: { bg: "rgba(167,139,250,0.12)", text: "var(--color-purple-light)", border: "rgba(167,139,250,0.3)" },
};

export function AvatarChip({
  label,
  portrait,
  icon,
  variant = "default",
  customColor,
  size = "sm",
  onClick,
}: {
  label: string;
  portrait?: string | null;
  icon?: React.ReactNode;
  variant?: ChipVariant;
  customColor?: string;
  size?: "xs" | "sm" | "md";
  onClick?: () => void;
}) {
  const styles = variant === "custom" && customColor
    ? { bg: `${customColor}18`, text: customColor, border: `${customColor}44` }
    : variantStyles[variant === "custom" ? "default" : variant];

  const avatarSize = size === "xs" ? 14 : size === "sm" ? 18 : 22;
  const fontSize = size === "xs" ? "0.55rem" : size === "sm" ? "0.6rem" : "0.7rem";
  const padding = size === "xs" ? "1px 6px 1px 2px" : size === "sm" ? "2px 8px 2px 3px" : "3px 10px 3px 4px";

  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full transition-all duration-150 cursor-pointer shrink-0"
      style={{
        background: styles.bg,
        border: `1px solid ${styles.border}`,
        padding,
      }}
    >
      {/* Avatar or Icon */}
      {portrait ? (
        <img
          src={portrait}
          alt={label}
          className="rounded-full object-cover shrink-0"
          style={{ width: avatarSize, height: avatarSize }}
        />
      ) : icon ? (
        <span
          className="flex items-center justify-center rounded-full shrink-0"
          style={{ width: avatarSize, height: avatarSize, color: styles.text }}
        >
          {icon}
        </span>
      ) : (
        <span
          className="flex items-center justify-center rounded-full text-[0.5rem] font-bold shrink-0"
          style={{
            width: avatarSize, height: avatarSize,
            background: `${styles.text}22`,
            color: styles.text,
          }}
        >
          {label[0]}
        </span>
      )}

      {/* Label */}
      <span className="font-medium whitespace-nowrap" style={{ fontSize, color: styles.text }}>
        {label}
      </span>
    </button>
  );
}

// ── Chip Row — horizontal scrollable row of chips ──
export function ChipRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap gap-1.5 ${className ?? ""}`}>
      {children}
    </div>
  );
}
