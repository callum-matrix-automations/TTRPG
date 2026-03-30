"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Moon, Sun, Heart, Zap, Clock, MapPin, ShieldCheck, AlertTriangle } from "lucide-react";
import { playerCharacter, worldState, mapLocations, playerProperty } from "@/data/placeholder";

type RestType = "short" | "long";

export default function RestModal({ onClose }: { onClose: () => void }) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  // Check location safety
  const currentLocation = mapLocations.find((l) => l.playerIsHere);
  const isOwnedProperty = playerProperty && currentLocation && playerProperty.locationId === currentLocation.id;
  const isSafeLocation = currentLocation ? currentLocation.dangerLevel === 0 : false;
  const canShortRest = isSafeLocation;
  const canLongRest = isSafeLocation && (isOwnedProperty || currentLocation?.dangerLevel === 0);

  const pc = playerCharacter;

  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 200);
  }, [onClose]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === backdropRef.current) handleClose();
  };

  const isOpen = visible && !closing;

  function RestOption({ type, disabled }: { type: RestType; disabled: boolean }) {
    const isShort = type === "short";
    return (
      <div
        className={`rounded-lg p-4 ${disabled ? "" : "cursor-pointer"} transition-all duration-150`}
        style={{
          background: "var(--color-bg-elevated)",
          border: `1px solid ${disabled ? "var(--color-border-subtle)" : "var(--color-border)"}`,
          opacity: disabled ? 0.4 : 1,
        }}
        onClick={() => {
          if (!disabled) {
            // Phase 2: will trigger actual rest logic
            console.log(`${type} rest triggered`);
            handleClose();
          }
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          {isShort ? (
            <Sun size={20} style={{ color: "var(--color-gold)" }} />
          ) : (
            <Moon size={20} style={{ color: "var(--color-purple-light)" }} />
          )}
          <div>
            <h3
              className="text-sm font-bold"
              style={{ fontFamily: "var(--font-heading)", color: "var(--color-pink-light)" }}
            >
              {isShort ? "Short Rest" : "Long Rest"}
            </h3>
            <div className="flex items-center gap-1 mt-0.5">
              <Clock size={10} className="text-[var(--color-text-muted)]" />
              <span className="text-[0.6rem] text-[var(--color-text-muted)]">
                {isShort ? "1 hour" : "8 hours"}
              </span>
            </div>
          </div>
        </div>

        {/* Recovery Preview */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Heart size={11} className="text-[var(--color-danger)]" />
              <span className="text-[var(--color-text-secondary)]">HP</span>
            </div>
            <span className="stat-value text-[0.65rem]">
              {pc.hp.current}/{pc.hp.max} → {isShort ? pc.hp.current : pc.hp.max}
              {!isShort && pc.hp.current < pc.hp.max && (
                <span className="text-[var(--color-success)] ml-1">(+{pc.hp.max - pc.hp.current})</span>
              )}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Zap size={11} className="text-[var(--color-mana)]" />
              <span className="text-[var(--color-text-secondary)]">Energy</span>
            </div>
            <span className="stat-value text-[0.65rem]">
              {pc.energy.current}/{pc.energy.max} → {isShort ? Math.min(pc.energy.max, pc.energy.current + Math.floor(pc.energy.max / 2)) : pc.energy.max}
              <span className="text-[var(--color-success)] ml-1">
                (+{isShort ? Math.min(pc.energy.max - pc.energy.current, Math.floor(pc.energy.max / 2)) : pc.energy.max - pc.energy.current})
              </span>
            </span>
          </div>
        </div>

        {/* Warning if clocks will tick */}
        <div
          className="flex items-center gap-1.5 mt-3 px-2 py-1.5 rounded"
          style={{ background: "var(--color-bg-deep)" }}
        >
          <Clock size={10} style={{ color: "var(--color-gold)" }} />
          <span className="text-[0.6rem] text-[var(--color-text-muted)]">
            {isShort ? "Clocks may advance slightly" : "Clocks will advance. The world moves on."}
          </span>
        </div>
      </div>
    );
  }

  return createPortal(
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: isOpen ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0)",
        backdropFilter: isOpen ? "blur(4px)" : "blur(0px)",
        transition: "background 200ms ease, backdrop-filter 200ms ease",
      }}
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-lg mx-4 rounded-xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, var(--color-bg-surface) 0%, var(--color-bg-base) 100%)",
          border: "1px solid var(--color-border-strong)",
          boxShadow: "0 24px 48px rgba(0,0,0,0.6), 0 0 20px var(--color-gold-glow)",
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? "scale(1) translateY(0)" : "scale(0.95) translateY(12px)",
          transition: "opacity 200ms ease, transform 200ms ease",
        }}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer transition-all duration-150"
          style={{ background: "rgba(0,0,0,0.5)", border: "1px solid var(--color-border)", color: "var(--color-text-secondary)" }}
          aria-label="Close"
        >
          <X size={14} />
        </button>

        <div className="px-5 pt-5 pb-5 space-y-4">
          <h2
            className="text-base font-bold"
            style={{ fontFamily: "var(--font-heading)", color: "var(--color-pink-light)" }}
          >
            Rest & Recovery
          </h2>

          {/* Location Safety */}
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg"
            style={{
              background: isSafeLocation ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
              border: `1px solid ${isSafeLocation ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
            }}
          >
            {isSafeLocation ? (
              <ShieldCheck size={16} style={{ color: "var(--color-success)" }} />
            ) : (
              <AlertTriangle size={16} style={{ color: "var(--color-danger)" }} />
            )}
            <div>
              <span className="text-xs font-medium" style={{ color: isSafeLocation ? "var(--color-success)" : "var(--color-danger)" }}>
                {isSafeLocation ? "Safe Location" : "Unsafe Location"}
              </span>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin size={9} className="text-[var(--color-text-muted)]" />
                <span className="text-[0.6rem] text-[var(--color-text-muted)]">
                  {currentLocation?.name ?? worldState.location}
                </span>
                {isOwnedProperty && (
                  <span className="badge ml-1" style={{ background: "var(--color-gold-subtle)", color: "var(--color-gold)" }}>
                    Your Property
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Rest Options */}
          <div className="grid grid-cols-2 gap-3">
            <RestOption type="short" disabled={!canShortRest} />
            <RestOption type="long" disabled={!canLongRest} />
          </div>

          {!isSafeLocation && (
            <p className="text-[0.65rem] text-[var(--color-text-muted)] italic text-center">
              Find a safe location or return to your property to rest.
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
