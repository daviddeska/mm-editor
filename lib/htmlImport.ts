/**
 * htmlImport.ts
 * -------------
 * Parsování HTML s mm-* třídami zpět do editor bloků.
 * Reverzní operace k generateHTML() v page.tsx.
 */

import {
  Block,
  MediaItem,
  MediaType,
  defaultMediaItem,
} from "@/types/blocks";

const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2);

/** Odstraní mm-* třídy z richtext HTML (reverz processRichText) */
export function stripMmClasses(html: string): string {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  const mmClasses = [
    "mm-paragraph",
    "mm-heading",
    "mm-list",
    "mm-list-item",
    "mm-text-bold",
  ];
  div.querySelectorAll("*").forEach((el) => {
    mmClasses.forEach((cls) => el.classList.remove(cls));
    if (el.classList.length === 0) el.removeAttribute("class");
  });
  return div.innerHTML;
}

/** Převede embed URL zpět na watch/page URL */
function reverseEmbedUrl(src: string): string {
  const ytMatch = src.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
  if (ytMatch) return `https://www.youtube.com/watch?v=${ytMatch[1]}`;
  const vimeoMatch = src.match(/player\.vimeo\.com\/video\/(\d+)/);
  if (vimeoMatch) return `https://vimeo.com/${vimeoMatch[1]}`;
  return src;
}

/** Parsuje media element (img/video/iframe) na MediaItem */
function parseMediaElement(container: Element): MediaItem {
  // Obrázek
  const img = container.querySelector("img.mm-image, img");
  if (img) {
    const src = img.getAttribute("src") || "";
    const alt = img.getAttribute("alt") || "";
    const shoptetMatch = src.match(/\/webeditor\/([^?]+)/);
    const filename = shoptetMatch
      ? decodeURIComponent(shoptetMatch[1])
      : "";
    return {
      mediaType: filename ? "image-file" : "image-url",
      mediaUrl: src,
      mediaFilename: filename,
      mediaPreview: src,
      alt,
    };
  }

  // Video
  const video = container.querySelector("video.mm-video, video");
  if (video) {
    const src = video.getAttribute("src") || "";
    const shoptetMatch = src.match(/\/webeditor\/([^?]+)/);
    const filename = shoptetMatch
      ? decodeURIComponent(shoptetMatch[1])
      : "";
    return {
      mediaType: "video-file",
      mediaUrl: src,
      mediaFilename: filename,
      mediaPreview: src,
      alt: "",
    };
  }

  // iframe (YouTube / Vimeo)
  const iframe = container.querySelector("iframe.mm-iframe, iframe");
  if (iframe) {
    const src = iframe.getAttribute("src") || "";
    let mediaType: MediaType = "youtube";
    if (src.includes("vimeo")) mediaType = "vimeo";
    return {
      mediaType,
      mediaUrl: reverseEmbedUrl(src),
      mediaFilename: "",
      mediaPreview: "",
      alt: "",
    };
  }

  return defaultMediaItem();
}

/** Hlavní parser: HTML string → { introText, blocks } */
export function parseHtmlToBlocks(html: string): {
  introText: string;
  blocks: Block[];
} {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  let introText = "";
  const blocks: Block[] = [];

  // 1. Úvodní text z .post-description
  const postDesc = doc.querySelector(".post-description");
  if (postDesc) {
    introText = stripMmClasses(postDesc.innerHTML.trim());
  }

  // 2. Bloky z .mm-article-wrapper
  const wrapper = doc.querySelector(".mm-article-wrapper");
  if (!wrapper) return { introText, blocks };

  for (const child of Array.from(wrapper.children)) {
    // h2 nadpis
    if (
      child.matches("h2.mm-main-heading") ||
      child.matches("h2.mm-heading")
    ) {
      blocks.push({
        id: generateId(),
        type: "h2",
        content: (child.innerHTML || "").replace(/<br\s*\/?>/g, "\n"),
      });
      continue;
    }

    // richtext blok
    if (child.matches(".mm-text-block")) {
      blocks.push({
        id: generateId(),
        type: "richtext",
        content: stripMmClasses(child.innerHTML.trim()),
      });
      continue;
    }

    // single media
    if (child.matches(".mm-media-wrapper")) {
      blocks.push({
        id: generateId(),
        type: "media",
        content: "",
        media: parseMediaElement(child),
      });
      continue;
    }

    // media grid 2
    if (child.matches(".mm-media-grid-2")) {
      const items = Array.from(
        child.querySelectorAll(".mm-media-item"),
      ).map(parseMediaElement);
      // Doplnit na přesně 2 položky
      while (items.length < 2) items.push(defaultMediaItem());
      blocks.push({
        id: generateId(),
        type: "media-2",
        content: "",
        mediaItems: items.slice(0, 2),
      });
      continue;
    }

    // media grid 3
    if (child.matches(".mm-media-grid-3")) {
      const items = Array.from(
        child.querySelectorAll(".mm-media-item"),
      ).map(parseMediaElement);
      while (items.length < 3) items.push(defaultMediaItem());
      blocks.push({
        id: generateId(),
        type: "media-3",
        content: "",
        mediaItems: items.slice(0, 3),
      });
      continue;
    }

    // media-text
    if (child.matches(".mm-media-text")) {
      const isReverse = child.classList.contains("mm-reverse");
      const mediaPart = child.querySelector(".mm-media-part");
      const textPart = child.querySelector(".mm-text-part");
      blocks.push({
        id: generateId(),
        type: "media-text",
        content: textPart ? stripMmClasses(textPart.innerHTML.trim()) : "",
        media: mediaPart
          ? parseMediaElement(mediaPart)
          : defaultMediaItem(),
        mediaPosition: isReverse ? "right" : "left",
      });
      continue;
    }
  }

  return { introText, blocks };
}
