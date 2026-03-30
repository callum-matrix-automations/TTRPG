"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import {
  X,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  Scroll,
} from "lucide-react";

// ── Types ──

export type ToastType = "success" | "warning" | "error" | "info" | "story";

type Toast = {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // ms, default 4000
};

type ToastContextType = {
  addToast: (toast: Omit<Toast, "id">) => void;
};

const ToastContext = createContext<ToastContextType>({ addToast: () => {} });

export const useToast = () => useContext(ToastContext);

// ── Icons & Colors ──

const toastConfig: Record<
  ToastType,
  { icon: typeof Info; color: string; bg: string; border: string }
> = {
  success: {
    icon: CheckCircle2,
    color: "var(--color-success)",
    bg: "rgba(34,197,94,0.08)",
    border: "rgba(34,197,94,0.3)",
  },
  warning: {
    icon: AlertTriangle,
    color: "var(--color-gold)",
    bg: "var(--color-gold-subtle)",
    border: "rgba(218,165,32,0.3)",
  },
  error: {
    icon: XCircle,
    color: "var(--color-danger)",
    bg: "rgba(239,68,68,0.08)",
    border: "rgba(239,68,68,0.3)",
  },
  info: {
    icon: Info,
    color: "var(--color-mana)",
    bg: "rgba(96,165,250,0.08)",
    border: "rgba(96,165,250,0.3)",
  },
  story: {
    icon: Scroll,
    color: "var(--color-purple-light)",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.3)",
  },
};

// ── Single Toast ──

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);
  const config = toastConfig[toast.type];
  const Icon = config.icon;

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(toast.id), 200);
    }, toast.duration ?? 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => onDismiss(toast.id), 200);
  };

  const isOpen = visible && !exiting;

  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-lg mb-2 cursor-pointer"
      style={{
        width: "320px",
        background: "var(--color-bg-surface)",
        border: `1px solid ${config.border}`,
        boxShadow: `0 8px 24px rgba(0,0,0,0.5), 0 0 8px ${config.border}`,
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? "translateX(0)" : "translateX(20px)",
        transition: "opacity 200ms ease, transform 200ms ease",
      }}
      onClick={handleDismiss}
    >
      <Icon size={16} style={{ color: config.color }} className="shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <span className="text-xs font-semibold block" style={{ color: config.color }}>
          {toast.title}
        </span>
        {toast.message && (
          <p className="text-[0.65rem] text-[var(--color-text-secondary)] mt-0.5 leading-relaxed">
            {toast.message}
          </p>
        )}
      </div>
      <X size={12} className="shrink-0 mt-0.5" style={{ color: "var(--color-text-muted)" }} />
    </div>
  );
}

// ── Provider ──

let toastCounter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = `toast-${++toastCounter}-${Date.now()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {mounted &&
        createPortal(
          <div
            className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end"
            style={{ pointerEvents: "none" }}
          >
            <div style={{ pointerEvents: "auto" }}>
              {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
              ))}
            </div>
          </div>,
          document.body,
        )}
    </ToastContext.Provider>
  );
}

// ── Manual Trigger Button (Dev Tool) ──

export function ToastTriggerPanel() {
  const { addToast } = useToast();

  const triggers: { type: ToastType; title: string; message: string }[] = [
    { type: "success", title: "Quest Complete!", message: "A Merchant's Debt — 400 XP earned" },
    { type: "warning", title: "Clock Advanced", message: "Syndicate Retaliation: 3/6 segments filled" },
    { type: "error", title: "HP Critical", message: "You are badly wounded. Seek healing." },
    { type: "info", title: "Reputation Changed", message: "+15 Merchants Guild" },
    { type: "story", title: "Something Stirs...", message: "You feel eyes watching from the shadows." },
  ];

  return (
    <div
      className="fixed bottom-4 left-4 z-[9998] rounded-lg p-3"
      style={{
        background: "var(--color-bg-surface)",
        border: "1px solid var(--color-border-strong)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
      }}
    >
      <span className="text-[0.6rem] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] block mb-2">
        Toast Triggers (Dev)
      </span>
      <div className="flex flex-col gap-1">
        {triggers.map((t) => (
          <button
            key={t.type}
            onClick={() => addToast(t)}
            className="flex items-center gap-2 px-2 py-1 rounded text-[0.65rem] cursor-pointer transition-all duration-150 text-left"
            style={{
              background: "var(--color-bg-elevated)",
              border: "1px solid var(--color-border)",
              color: toastConfig[t.type].color,
            }}
          >
            {(() => { const Icon = toastConfig[t.type].icon; return <Icon size={11} />; })()}
            {t.title}
          </button>
        ))}
      </div>
    </div>
  );
}
