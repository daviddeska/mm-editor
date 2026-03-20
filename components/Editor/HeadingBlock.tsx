/**
 * HeadingBlock.tsx
 * ----------------
 * Blok pro hlavní nadpis článku (H2).
 * Jednoduchý textarea který se automaticky přizpůsobuje výšce textu.
 *
 * TypeScript lekce:
 * - `ChangeEvent` = typ pro událost onChange (změna hodnoty inputu)
 * - Generický typ `<HTMLTextAreaElement>` = upřesňuje že jde o textarea
 */

"use client";

import { ChangeEvent } from "react";

// --- TYPY ---
interface HeadingBlockProps {
  content: string;
  onChange: (value: string) => void;
}

// --- KOMPONENTA ---
export default function HeadingBlock({ content, onChange }: HeadingBlockProps) {
  // ChangeEvent<HTMLTextAreaElement> = TypeScript typ pro onChange událost na textarea
  // event.target.value = aktuální hodnota textového pole
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
  };

  return (
    <textarea
      value={content}
      onChange={handleChange}
      placeholder="Zadejte hlavní nadpis článku..."
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
