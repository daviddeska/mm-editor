/**
 * blocks.ts
 * ---------
 * Centrální TypeScript typy pro celou aplikaci.
 * Každý nový typ bloku musí být přidán sem.
 */

// --- TYPY BLOKŮ ---

// Bloky pro Článek a Popis produktu (sdílené)
export type ContentBlockType =
  | "h2"
  | "richtext"
  | "media" // 1 médium (obrázek/video/YouTube/Vimeo)
  | "media-2" // 2 média vedle sebe
  | "media-3" // 3 média vedle sebe
  | "media-text"; // médium + formátovaný text vedle sebe

// Typ médií v media bloku
export type MediaType =
  | "image-file" // Nahrání obrázku ze souboru
  | "image-url" // URL obrázku
  | "video-file" // Nahrání videa ze souboru
  | "youtube" // YouTube URL
  | "vimeo"; // Vimeo URL

// BlockType = alias pro ContentBlockType
export type BlockType = ContentBlockType;

// Typ editoru — přepínání v horní liště
export type EditorMode = "article" | "product" | "banner";

// --- INTERFACES ---

export interface MediaItem {
  mediaType: MediaType;
  mediaUrl: string;
  mediaFilename: string;
  mediaPreview: string;
  alt: string;
}

// Výchozí prázdný MediaItem
export const defaultMediaItem = (): MediaItem => ({
  mediaType: "image-file",
  mediaUrl: "",
  mediaFilename: "",
  mediaPreview: "",
  alt: "",
});

export type HeadingLevel = 2 | 3 | 4 | 5;

export interface Block {
  id: string;
  type: ContentBlockType;
  content: string;
  // Pro h2 blok — úroveň nadpisu (h2–h5, výchozí 2)
  headingLevel?: HeadingLevel;
  // Pro media-text — pozice média
  mediaPosition?: "left" | "right";
  // Hlavní médium (pro bloky media, media-text)
  media?: MediaItem;
  // Více médií (pro media-2, media-3)
  mediaItems?: MediaItem[];
}

// Banner má pevná pole — není blokový editor
export interface BannerData {
  backgroundFilename: string;
  backgroundPreview: string;
  backgroundUrl: string; // Alternativa — URL obrázku pozadí
  heading: string;
  text: string;
  buttonLabel: string;
  buttonUrl: string;
}

// Výchozí prázdný banner
export const defaultBanner = (): BannerData => ({
  backgroundFilename: "",
  backgroundPreview: "",
  backgroundUrl: "",
  heading: "",
  text: "",
  buttonLabel: "",
  buttonUrl: "",
});
