"use client";

import { useState } from "react";
import { Eye, User } from "lucide-react";
import { type DetailedAppearance, type TransformationTracker } from "@/data/placeholder";
import AppearanceModal from "@/components/modals/AppearanceModal";

// At-a-glance fields
const overviewFields: { key: keyof DetailedAppearance; label: string }[] = [
  { key: "gender", label: "Gender" },
  { key: "height", label: "Height" },
  { key: "hair", label: "Hair" },
  { key: "face", label: "Face" },
];

export default function AppearanceView({
  appearance,
  transformation,
  compact = false,
  name,
  portrait,
}: {
  appearance: DetailedAppearance;
  transformation?: TransformationTracker | null;
  compact?: boolean;
  name?: string;
  portrait?: string | null;
}) {
  const [modalOpen, setModalOpen] = useState(false);

  if (compact) {
    return (
      <p className="text-[0.65rem] text-[var(--color-text-secondary)] italic">
        {appearance.overall}
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {/* Overview summary */}
      <p className="text-xs text-[var(--color-text-secondary)] italic leading-relaxed">
        {appearance.overall}
      </p>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-1">
        {overviewFields.map((field) => (
          <div
            key={field.key}
            className="px-2 py-1 rounded text-[0.6rem]"
            style={{ background: "var(--color-bg-deep)" }}
          >
            <span className="text-[var(--color-text-muted)]">{field.label}: </span>
            <span className="text-[var(--color-text-secondary)]">
              {appearance[field.key] ?? "—"}
            </span>
          </div>
        ))}
      </div>

      {/* Open full description modal */}
      <button
        onClick={() => setModalOpen(true)}
        className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded text-[0.65rem] cursor-pointer transition-all duration-150"
        style={{
          background: "var(--color-bg-elevated)",
          border: "1px solid var(--color-border)",
          color: "var(--color-text-secondary)",
        }}
      >
        <Eye size={11} />
        Full Description
      </button>

      {modalOpen && (
        <AppearanceModal
          appearance={appearance}
          transformation={transformation}
          name={name}
          portrait={portrait}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
