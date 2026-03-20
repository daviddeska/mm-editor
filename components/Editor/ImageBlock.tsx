/**
 * ImageBlock.tsx
 * --------------
 * Univerzální blok pro obrázky — zvládá 1, 2 i 3 obrázky vedle sebe.
 * Kliknutím na placeholder se otevře dialog pro výběr souboru.
 *
 * TypeScript lekce:
 * - `useRef` = reference na DOM element (přímý přístup k HTML prvku)
 * - `RefObject<HTMLInputElement>` = typ reference na input element
 * - Array typ: `ImageData[]` = pole objektů typu ImageData
 */

"use client";

import { useRef } from "react";
import { ImageData } from "@/types/blocks"; // @ = zkratka pro kořen projektu

// --- TYPY ---
interface ImageBlockProps {
  // "1" | "2" | "3" = union type, počet obrázků může být pouze 1, 2 nebo 3
  count: 1 | 2 | 3;
  // Pro jeden obrázek
  filename?: string;
  previewUrl?: string;
  onFileSelect?: (file: File) => void;
  // Pro více obrázků
  images?: ImageData[];
  onImageFileSelect?: (file: File, index: number) => void;
}

// --- POMOCNÁ KOMPONENTA pro jeden slot obrázku ---
interface ImageSlotProps {
  previewUrl: string;
  filename: string;
  onSelect: () => void;
  label?: string; // volitelný popisek (např. "Obrázek 1")
}

function ImageSlot({ previewUrl, filename, onSelect, label }: ImageSlotProps) {
  return (
    <div className="flex flex-col">
      {previewUrl ? (
        // Náhled obrázku — kliknutím lze změnit
        <div className="text-center">
          <img
            src={previewUrl}
            alt={filename}
            onClick={onSelect}
            className="max-w-full rounded-lg cursor-pointer object-cover hover:opacity-80 transition-opacity"
          />
          <p className="text-xs text-slate-400 mt-1 break-all">{filename}</p>
        </div>
      ) : (
        // Placeholder — zobrazí se před výběrem obrázku
        <div
          onClick={onSelect}
          className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer flex flex-col items-center justify-center min-h-[150px] transition-all"
          style={{
            borderColor: "var(--border2)",
            background: "var(--surface2)",
            color: "var(--muted)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor =
              "var(--accent)";
            (e.currentTarget as HTMLDivElement).style.color = "var(--accent2)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLDivElement).style.borderColor =
              "var(--border2)";
            (e.currentTarget as HTMLDivElement).style.color = "var(--muted)";
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            style={{ marginBottom: "8px" }}
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <span className="text-sm">
            {label ?? "Klikněte pro výběr obrázku"}
          </span>
        </div>
      )}
    </div>
  );
}

// --- HLAVNÍ KOMPONENTA ---
export default function ImageBlock({
  count,
  filename = "",
  previewUrl = "",
  onFileSelect,
  images = [],
  onImageFileSelect,
}: ImageBlockProps) {
  // useRef = přímá reference na skrytý <input type="file">
  // Místo klasického kliknutí na input ho spouštíme programaticky přes ref.current.click()
  const singleInputRef = useRef<HTMLInputElement>(null);

  // Pro více obrázků potřebujeme více referencí — ukládáme je do pole
  // useRef<HTMLInputElement[]>([]) = reference na pole input elementů
  const multiInputRefs = useRef<HTMLInputElement[]>([]);

  // Handler pro výběr jednoho souboru
  const handleSingleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // ?.[0] = bezpečný přístup (může být undefined)
    if (file && onFileSelect) onFileSelect(file);
  };

  // Handler pro výběr souboru v gridu (index = který obrázek)
  const handleMultiChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const file = e.target.files?.[0];
    if (file && onImageFileSelect) onImageFileSelect(file, index);
  };

  // --- RENDER pro 1 obrázek ---
  if (count === 1) {
    return (
      <div>
        {/* Skrytý file input — spouštíme ho přes ref */}
        <input
          ref={singleInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleSingleChange}
        />
        <ImageSlot
          previewUrl={previewUrl}
          filename={filename}
          onSelect={() => singleInputRef.current?.click()} // ?. = optional chaining
        />
      </div>
    );
  }

  // --- RENDER pro 2 nebo 3 obrázky (grid) ---
  const gridClass =
    count === 2 ? "grid grid-cols-2 gap-4" : "grid grid-cols-3 gap-3";

  return (
    <div className={gridClass}>
      {/* Array.from vytvoří pole délky `count`, mapujeme přes každý index */}
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          {/* Ukládáme ref pro každý input do pole */}
          <input
            ref={(el) => {
              if (el) multiInputRefs.current[i] = el;
            }}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleMultiChange(e, i)}
          />
          <ImageSlot
            previewUrl={images[i]?.previewUrl ?? ""}
            filename={images[i]?.filename ?? ""}
            onSelect={() => multiInputRefs.current[i]?.click()}
            label={`Obrázek ${i + 1}`}
          />
        </div>
      ))}
    </div>
  );
}
