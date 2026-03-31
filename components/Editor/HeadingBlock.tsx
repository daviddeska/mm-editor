"use client";

import { ChangeEvent } from "react";
import type { HeadingLevel } from "@/types/blocks";

interface HeadingBlockProps {
  content: string;
  onChange: (value: string) => void;
  level: HeadingLevel;
  onLevelChange: (level: HeadingLevel) => void;
}

const LEVELS: { level: HeadingLevel; label: string; size: string }[] = [
  { level: 2, label: "H2", size: "1.6rem" },
  { level: 3, label: "H3", size: "1.3rem" },
  { level: 4, label: "H4", size: "1.1rem" },
  { level: 5, label: "H5", size: "0.95rem" },
];

export default function HeadingBlock({
  content,
  onChange,
  level,
  onLevelChange,
}: HeadingBlockProps) {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  const currentLevel = LEVELS.find((l) => l.level === level) ?? LEVELS[0];

  return (
    <div>
      {/* Přepínač úrovně */}
      <div
        style={{
          display: "flex",
          gap: "3px",
          marginBottom: "8px",
          background: "var(--surface2)",
          borderRadius: "6px",
          padding: "2px",
          width: "fit-content",
        }}
      >
        {LEVELS.map((l) => (
          <button
            key={l.level}
            onClick={() => onLevelChange(l.level)}
            style={{
              padding: "3px 10px",
              borderRadius: "5px",
              border: "none",
              fontSize: "11px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.12s",
              background:
                level === l.level ? "var(--surface)" : "transparent",
              color:
                level === l.level ? "var(--accent)" : "var(--muted)",
              boxShadow:
                level === l.level
                  ? "0 1px 3px rgba(0,0,0,0.08)"
                  : "none",
            }}
          >
            {l.label}
          </button>
        ))}
      </div>

      <textarea
        value={content}
        onChange={handleChange}
        placeholder="Zadejte nadpis..."
        rows={1}
        className="w-full border-none outline-none bg-transparent resize-y font-bold"
        style={{
          color: "var(--text)",
          caretColor: "#a78bfa",
          fontFamily: "inherit",
          fontSize: currentLevel.size,
        }}
      />
    </div>
  );
}
