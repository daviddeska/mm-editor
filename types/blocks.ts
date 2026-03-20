export type BlockType =
  | "h2"
  | "richtext"
  | "img"
  | "img-2"
  | "img-3"
  | "img-text";

export interface ImageData {
  filename: string;
  previewUrl: string;
}

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  // Pro img a img-text
  filename?: string;
  previewUrl?: string;
  // Pro img-2 a img-3
  images?: ImageData[];
  // Pro img-text
  imagePosition?: "left" | "right";
}
