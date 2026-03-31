"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, User } from "lucide-react";

// ── Glass Card — outer container with blur and gradient ──
export function GlassCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${className ?? ""}`}
      style={{
        background: "rgba(28, 18, 38, 0.45)",
        border: "1px solid var(--color-border)",
        backdropFilter: "blur(24px)",
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(245,220,245,0.03) 0%, transparent 50%, transparent 100%)" }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

// ── Glass Highlight — hoverable info card ──
export function GlassHighlight({
  title,
  children,
  accentColor,
}: {
  title: string;
  children: React.ReactNode;
  accentColor?: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="group relative overflow-hidden rounded-xl p-4 transition-all"
      style={{
        background: "rgba(36, 24, 56, 0.6)",
        border: "1px solid var(--color-border)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(218,165,32,0.04) 0%, transparent 100%)" }}
      />
      <div className="relative space-y-1.5">
        <p
          className="text-[0.6rem] font-semibold uppercase tracking-[0.2em]"
          style={{ color: accentColor ?? "var(--color-text-muted)" }}
        >
          {title}
        </p>
        <div className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
          {children}
        </div>
      </div>
    </motion.div>
  );
}

// ── Glass Profile — portrait card with glow ──
// Supports two modes: circular avatar (default) or full-body portrait
export function GlassProfile({
  portrait,
  name,
  subtitle,
  description,
  accentColor,
  badge,
  fullBody = false,
  children,
}: {
  portrait?: string | null;
  name: string;
  subtitle: string;
  description?: string;
  accentColor?: string;
  badge?: React.ReactNode;
  fullBody?: boolean;
  children?: React.ReactNode;
}) {
  const color = accentColor ?? "var(--color-gold)";

  return (
    <div
      className="relative flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: "rgba(36, 24, 56, 0.6)",
        border: "1px solid var(--color-border)",
        backdropFilter: "blur(16px)",
      }}
    >
      {/* Portrait area */}
      {fullBody ? (
        // Full-body portrait mode — tall image with gradient overlay
        <div className="relative w-full" style={{ aspectRatio: "3/4" }}>
          {portrait ? (
            <img
              src={portrait}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center"
              style={{ background: "var(--color-bg-deep)" }}
            >
              <User size={64} style={{ color: "var(--color-text-muted)" }} />
              <span className="text-[0.6rem] mt-2" style={{ color: "var(--color-text-muted)" }}>Full Body</span>
            </div>
          )}
          {/* Gradient fade at bottom */}
          <div
            className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
            style={{ background: "linear-gradient(180deg, transparent 0%, rgba(36, 24, 56, 0.95) 100%)" }}
          />
          {/* Name overlay at bottom of image */}
          <div className="absolute inset-x-0 bottom-0 p-5">
            <h3
              className="text-lg font-bold tracking-tight"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}
            >
              {name}
            </h3>
            <p
              className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] mt-0.5"
              style={{ color: `${color}cc` }}
            >
              {subtitle}
            </p>
            {badge && <div className="mt-2">{badge}</div>}
          </div>
        </div>
      ) : (
        // Circular avatar mode (original)
        <div className="p-6">
          <div
            className="absolute inset-x-0 top-0 h-32 pointer-events-none"
            style={{ background: `linear-gradient(180deg, ${color}15 0%, transparent 100%)` }}
          />
          <div className="relative flex flex-col items-center text-center">
            <div className="relative mb-4">
              <div
                className="absolute left-1/2 top-1/2 w-28 h-28 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
                style={{ background: `${color}20` }}
              />
              {portrait ? (
                <img
                  src={portrait}
                  alt={name}
                  className="relative w-24 h-24 rounded-full object-cover"
                  style={{ border: `2px solid ${color}66`, boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}
                />
              ) : (
                <div
                  className="relative w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold"
                  style={{ background: "var(--color-bg-elevated)", border: `2px solid ${color}66`, color: "var(--color-text-muted)" }}
                >
                  {name[0]}
                </div>
              )}
            </div>
            <h3
              className="text-lg font-bold tracking-tight"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-text-primary)" }}
            >
              {name}
            </h3>
            <p
              className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] mt-0.5"
              style={{ color: `${color}aa` }}
            >
              {subtitle}
            </p>
            {description && (
              <p className="mt-3 text-xs leading-relaxed max-w-xs" style={{ color: "var(--color-text-secondary)" }}>
                {description}
              </p>
            )}
            {badge && <div className="mt-3">{badge}</div>}
          </div>
        </div>
      )}

      {/* Description (only in fullBody mode, below image) */}
      {fullBody && description && (
        <div className="px-5 pb-2">
          <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            {description}
          </p>
        </div>
      )}

      {children && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

// ── Glass Link Row — clickable row ──
export function GlassLinkRow({
  icon,
  label,
  detail,
  accentColor,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  detail: string;
  accentColor?: string;
  onClick?: () => void;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -1 }}
      whileTap={{ scale: 0.99 }}
      className="group flex items-center justify-between rounded-xl px-3 py-2.5 cursor-pointer transition-all"
      style={{
        background: "rgba(36, 24, 56, 0.7)",
        border: "1px solid var(--color-border)",
      }}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-full"
          style={{
            background: "var(--color-bg-elevated)",
            border: "1px solid var(--color-border)",
            color: accentColor ?? "var(--color-text-secondary)",
          }}
        >
          {icon}
        </span>
        <div>
          <p className="text-xs font-semibold" style={{ color: "var(--color-text-primary)" }}>{label}</p>
          <p className="text-[0.6rem]" style={{ color: accentColor ?? "var(--color-text-muted)" }}>{detail}</p>
        </div>
      </div>
      <ArrowUpRight size={14} className="transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ color: "var(--color-text-muted)" }} />
    </motion.div>
  );
}
