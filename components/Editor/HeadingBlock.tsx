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
    <textarea
      value={content}
      onChange={handleChange}
      placeholder="Zadejte nadpis..."
      rows={1}
      className="w-full border-none outline-none bg-transparent resize-y text-3xl font-bold"
      style={{
        color: "var(--text)",
        caretColor: "#a78bfa",
        fontFamily: "inherit",
      }}
    />
  );
}
