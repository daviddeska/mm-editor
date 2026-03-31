/**
 * MediaTextBlock.tsx
 * ------------------
 * Kombinovaný blok — médium vedle formátovaného textu.
 * Přepínač pozice média vlevo / vpravo.
 */

"use client";

import { MediaItem } from "@/types/blocks";
import MediaBlock from "./MediaBlock";
import RichTextBlock from "./RichTextBlock";

interface MediaTextBlockProps {
  media: MediaItem;
  onMediaChange: (data: MediaItem) => void;
  content: string;
  onContentChange: (html: string) => void;
  mediaPosition: "left" | "right";
  onPositionChange: (pos: "left" | "right") => void;
}

export default function MediaTextBlock({
  media,
  onMediaChange,
  content,
  onContentChange,
  mediaPosition,
  onPositionChange,
}: MediaTextBlockProps) {
  const mediaPart = (
    <div style={{ flex: "1" }}>
      <MediaBlock data={media} onChange={onMediaChange} compact />
    </div>
  );

  const textPart = (
    <div style={{ flex: 1 }}>
      <RichTextBlock content={content} onChange={onContentChange} />
    </div>
  );

  return (
    <div>
      {/* Přepínač pozice */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "12px",
        }}
      >
        <span
          style={{ fontSize: "11px", color: "var(--muted)", fontWeight: "500" }}
        >
          Pozice média:
        </span>
        {(["left", "right"] as const).map((pos) => (
          <button
            key={pos}
            onClick={() => onPositionChange(pos)}
            style={{
              padding: "4px 12px",
              borderRadius: "6px",
              border: "none",
              fontSize: "12px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.12s",
              background:
                mediaPosition === pos ? "var(--accent-bg)" : "var(--surface2)",
              color: mediaPosition === pos ? "var(--accent)" : "var(--muted)",
              outline:
                mediaPosition === pos
                  ? "1px solid var(--accent)"
                  : "1px solid var(--border)",
            }}
          >
            {pos === "left" ? "Vlevo" : "Vpravo"}
          </button>
        ))}
      </div>

      {/* Layout */}
      <div
        style={{
          display: "flex",
          flexDirection: mediaPosition === "right" ? "row-reverse" : "row",
          gap: "20px",
          alignItems: "stretch",
          flexWrap: "wrap",
        }}
      >
        {mediaPart}
        {textPart}
      </div>
    </div>
  );
}
