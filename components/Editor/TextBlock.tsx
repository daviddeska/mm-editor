/**
 * ImageTextBlock.tsx
 * ------------------
 * Kombinovaný blok — obrázek vedle formátovaného textu.
 * Uživatel může přepínat pozici obrázku (vlevo / vpravo).
 */

"use client";

import { useRef } from "react";
import RichTextBlock from "./RichTextBlock";

// --- TYPY ---
interface ImageTextBlockProps {
  content: string;
  onChange: (html: string) => void;
  filename: string;
  previewUrl: string;
  onFileSelect: (file: File) => void;
  imagePosition: "left" | "right";
  onPositionChange: (pos: "left" | "right") => void;
}

// --- KOMPONENTA ---
export default function ImageTextBlock({
  content,
  onChange,
  filename,
  previewUrl,
  onFileSelect,
  imagePosition,
  onPositionChange,
}: ImageTextBlockProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  // Část s obrázkem
  const imagePart = (
    <div className="flex-none w-2/5">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      {previewUrl ? (
        <div className="text-center">
          <img // eslint-disable-line @next/next/no-img-element
            src={previewUrl}
            alt={filename}
            onClick={() => inputRef.current?.click()}
            className="max-w-full rounded-lg cursor-pointer hover:opacity-80 transition-opacity object-cover"
          />
          <p className="text-xs text-slate-400 mt-1 break-all">{filename}</p>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-lg p-6 text-center text-slate-400 cursor-pointer flex flex-col items-center justify-center min-h-[150px] hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-500 transition-all"
        >
          <span className="text-xl mb-1">🖼️</span>
          <span className="text-sm">Vybrat obrázek</span>
        </div>
      )}
    </div>
  );

  // Část s textem
  const textPart = (
    <div className="flex-1">
      <RichTextBlock content={content} onChange={onChange} />
    </div>
  );

  return (
    <div>
      {/* Přepínač pozice obrázku */}
      <div className="flex items-center gap-2 mb-3 text-sm text-slate-500">
        <span>Pozice obrázku:</span>
        <button
          onClick={() => onPositionChange("left")}
          className={`px-3 py-1 rounded border text-sm transition-all ${
            imagePosition === "left"
              ? "bg-indigo-100 text-indigo-600 border-indigo-400"
              : "bg-white border-slate-200 hover:border-indigo-300"
          }`}
        >
          Vlevo
        </button>
        <button
          onClick={() => onPositionChange("right")}
          className={`px-3 py-1 rounded border text-sm transition-all ${
            imagePosition === "right"
              ? "bg-indigo-100 text-indigo-600 border-indigo-400"
              : "bg-white border-slate-200 hover:border-indigo-300"
          }`}
        >
          Vpravo
        </button>
      </div>

      {/* Layout — pořadí se mění podle imagePosition */}
      <div
        className={`flex gap-5 items-stretch ${imagePosition === "right" ? "flex-row-reverse" : "flex-row"}`}
      >
        {imagePart}
        {textPart}
      </div>
    </div>
  );
}
