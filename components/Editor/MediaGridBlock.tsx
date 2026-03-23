/**
 * MediaGridBlock.tsx
 * ------------------
 * Grid 2 nebo 3 médií vedle sebe.
 * Každý slot je samostatný MediaBlock v kompaktním režimu.
 */

"use client";

import { MediaItem, defaultMediaItem } from "@/types/blocks";
import MediaBlock from "./MediaBlock";

interface MediaGridBlockProps {
  count: 2 | 3;
  items: MediaItem[];
  onChange: (items: MediaItem[]) => void;
}

export default function MediaGridBlock({
  count,
  items,
  onChange,
}: MediaGridBlockProps) {
  // Zajistíme že items má vždy správný počet prvků
  const safeItems: MediaItem[] = Array.from(
    { length: count },
    (_, i) => items[i] ?? defaultMediaItem(),
  );

  const updateItem = (index: number, data: MediaItem) => {
    const updated = [...safeItems];
    updated[index] = data;
    onChange(updated);
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: count === 2 ? "1fr 1fr" : "1fr 1fr 1fr",
        gap: "16px",
      }}
    >
      {safeItems.map((item, i) => (
        <div
          key={i}
          style={{
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "12px",
          }}
        >
          <p
            style={{
              fontSize: "10px",
              fontWeight: "600",
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              margin: "0 0 10px",
            }}
          >
            Médium {i + 1}
          </p>
          <MediaBlock
            data={item}
            onChange={(data) => updateItem(i, data)}
            compact
          />
        </div>
      ))}
    </div>
  );
}
