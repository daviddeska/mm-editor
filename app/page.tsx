"use client";

import { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import {
  Block,
  BlockType,
  BannerData,
  EditorMode,
  defaultBanner,
  defaultMediaItem,
} from "@/types/blocks";
import Sidebar from "@/components/Sidebar";
import BlockWrapper from "@/components/Editor/BlockWrapper";
import HeadingBlock from "@/components/Editor/HeadingBlock";
import RichTextBlock from "@/components/Editor/RichTextBlock";
import MediaBlock from "@/components/Editor/MediaBlock";
import MediaGridBlock from "@/components/Editor/MediaGridBlock";
import MediaTextBlock from "@/components/Editor/MediaTextBlock";
import BannerEditor from "@/components/Editor/BannerEditor";

// --- POMOCNÉ FUNKCE ---
const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2);

function createBlock(type: BlockType): Block {
  const base: Block = { id: generateId(), type, content: "" };
  if (type === "media") return { ...base, media: defaultMediaItem() };
  if (type === "media-2")
    return { ...base, mediaItems: [defaultMediaItem(), defaultMediaItem()] };
  if (type === "media-3")
    return {
      ...base,
      mediaItems: [defaultMediaItem(), defaultMediaItem(), defaultMediaItem()],
    };
  if (type === "media-text")
    return { ...base, media: defaultMediaItem(), mediaPosition: "left" };
  return base;
}

function processRichText(html: string): string {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  div.querySelectorAll("p").forEach((el) => el.classList.add("mm-paragraph"));
  div
    .querySelectorAll("h1,h2,h3,h4")
    .forEach((el) => el.classList.add("mm-heading"));
  div.querySelectorAll("ul,ol").forEach((el) => el.classList.add("mm-list"));
  div.querySelectorAll("li").forEach((el) => el.classList.add("mm-list-item"));
  div
    .querySelectorAll("strong")
    .forEach((el) => el.classList.add("mm-text-bold"));
  return div.innerHTML;
}

// Konfigurace tabs
const TABS: { mode: EditorMode; label: string; description: string }[] = [
  {
    mode: "article",
    label: "Článek",
    description: "Blokový editor pro blogové příspěvky",
  },
  // { mode: "product", label: "Popis produktu", description: "Obsah pro stránku produktu" },
  // { mode: "banner", label: "Banner", description: "Reklamní banner s pevnými poli" },
];

// --- SVG ikony ---
const ExportIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
  </svg>
);
const CopyIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);
const CloseIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

// --- HLAVNÍ KOMPONENTA ---
export default function EditorPage() {
  const [mode, setMode] = useState<EditorMode>("article");
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [banner, setBanner] = useState<BannerData>(defaultBanner());
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [copied, setCopied] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  );

  const handleDragStart = (e: DragStartEvent) =>
    setActiveId(e.active.id as string);
  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = e;
    if (over && active.id !== over.id) {
      setBlocks((prev) => {
        const oi = prev.findIndex((b) => b.id === active.id);
        const ni = prev.findIndex((b) => b.id === over.id);
        return arrayMove(prev, oi, ni);
      });
    }
  };

  const addBlock = (type: BlockType) =>
    setBlocks((prev) => [...prev, createBlock(type)]);
  const removeBlock = (i: number) =>
    setBlocks((prev) => prev.filter((_, idx) => idx !== i));
  const moveBlock = (i: number, dir: -1 | 1) => {
    const ni = i + dir;
    if (ni < 0 || ni >= blocks.length) return;
    const u = [...blocks];
    [u[i], u[ni]] = [u[ni], u[i]];
    setBlocks(u);
  };
  const updateBlock = (id: string, changes: Partial<Block>) =>
    setBlocks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...changes } : b)),
    );

  // --- GENEROVÁNÍ HTML ---
  // Převede jeden MediaItem na HTML string

  // Převede jeden MediaItem na HTML string
  const renderMediaItem = (
    item: import("@/types/blocks").MediaItem,
  ): string => {
    const { mediaType, mediaFilename, mediaUrl, alt = "" } = item;
    const shoptetUrl = (f: string) =>
      `https://727188.myshoptet.com/user/documents/webeditor/${f}`;
    // Pokud mediaUrl je už plná Shoptet URL, použít ji; jinak sestavit ze jména souboru
    const resolveUrl = (f: string, url: string) =>
      url && url.startsWith("https://") ? url : shoptetUrl(f);
    if (mediaType === "image-file" && mediaFilename)
      return `<img class="mm-image" src="${resolveUrl(mediaFilename, mediaUrl)}" alt="${alt}">`;
    if (mediaType === "image-url" && mediaUrl)
      return `<img class="mm-image" src="${mediaUrl}" alt="${alt}">`;
    if (mediaType === "video-file" && mediaFilename)
      return `<video class="mm-video" src="${resolveUrl(mediaFilename, mediaUrl)}" controls></video>`;
    if ((mediaType === "youtube" || mediaType === "vimeo") && mediaUrl)
      return `<iframe class="mm-iframe" src="${mediaUrl}" frameborder="0" allowfullscreen></iframe>`;
    return "<!-- prázdné médium -->";
  };

  const generateHTML = () => {
    let html = "";

    if (mode === "banner") {
      const bg = banner.backgroundFilename
        ? `/user/documents/upload/mmeditor/${banner.backgroundFilename}`
        : banner.backgroundUrl || "";
      html = `<div class="mm-banner" style="background-image:url('${bg}')">\n`;
      html += `  <div class="mm-banner-inner">\n`;
      if (banner.heading)
        html += `    <h2 class="mm-banner-heading">${banner.heading}</h2>\n`;
      if (banner.text)
        html += `    <p class="mm-banner-text">${banner.text}</p>\n`;
      if (banner.buttonLabel)
        html += `    <a class="mm-banner-btn" href="${banner.buttonUrl}">${banner.buttonLabel}</a>\n`;
      html += `  </div>\n</div>`;
    } else {
      html = `<div class="mm-article-wrapper">\n`;
      blocks.forEach((b) => {
        if (b.type === "h2")
          html += `  <h2 class="mm-heading mm-main-heading">${b.content.replace(/\n/g, "<br>")}</h2>\n`;
        if (b.type === "richtext")
          html += `  <div class="mm-text-block">\n    ${processRichText(b.content)}\n  </div>\n`;
        if (b.type === "media" && b.media) {
          html += `  <div class="mm-media-wrapper">\n    ${renderMediaItem(b.media)}\n  </div>\n`;
        }
        if ((b.type === "media-2" || b.type === "media-3") && b.mediaItems) {
          const cls =
            b.type === "media-2" ? "mm-media-grid-2" : "mm-media-grid-3";
          html += `  <div class="${cls}">\n`;
          b.mediaItems.forEach((item) => {
            html += `    <div class="mm-media-item">\n      ${renderMediaItem(item)}\n    </div>\n`;
          });
          html += `  </div>\n`;
        }
        if (b.type === "media-text" && b.media) {
          const rev = b.mediaPosition === "right" ? " mm-reverse" : "";
          html += `  <div class="mm-media-text${rev}">\n`;
          html += `    <div class="mm-media-part">\n      ${renderMediaItem(b.media)}\n    </div>\n`;
          html += `    <div class="mm-text-part">\n      ${processRichText(b.content)}\n    </div>\n`;
          html += `  </div>\n`;
        }
      });
      html += "</div>";
    }

    setGeneratedHtml(html);
    setShowModal(true);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generatedHtml).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const isBanner = mode === "banner";
  const blockCount = blocks.length;
  const currentTab = TABS.find((t) => t.mode === mode)!;

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "var(--bg)",
      }}
    >
      {/* Sidebar — skrytý v banner módu */}
      {!isBanner && <Sidebar onAddBlock={addBlock} />}

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header s tabs */}
        <header
          style={{
            background: "var(--surface)",
            borderBottom: "1px solid var(--border)",
            flexShrink: 0,
          }}
        >
          {/* Horní řada — tabs + tlačítko export */}
          <div
            style={{
              padding: "0 28px",
              height: "52px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {/* Tabs */}
            <div style={{ display: "flex", gap: "2px" }}>
              {TABS.map((tab) => (
                <button
                  key={tab.mode}
                  onClick={() => setMode(tab.mode)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: "13px",
                    fontWeight: "500",
                    cursor: "pointer",
                    transition: "all 0.12s",
                    background:
                      mode === tab.mode ? "var(--accent-bg)" : "transparent",
                    color: mode === tab.mode ? "var(--accent)" : "var(--muted)",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Statistiky + export */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {!isBanner && (
                <div style={{ display: "flex", gap: "6px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--muted)",
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                      borderRadius: "6px",
                      padding: "2px 8px",
                    }}
                  >
                    {blockCount}{" "}
                    {blockCount === 1
                      ? "blok"
                      : blockCount < 5
                        ? "bloky"
                        : "bloků"}
                  </span>
                </div>
              )}
              <button
                onClick={generateHTML}
                style={{
                  background: "var(--gradient)",
                  color: "black",
                  border: "none",
                  borderRadius: "8px",
                  padding: "7px 16px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  letterSpacing: "0.01em",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 2px 8px rgba(124,58,237,0.25)",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.opacity =
                    "0.85")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLButtonElement).style.opacity = "1")
                }
              >
                <ExportIcon /> Exportovat HTML
              </button>
            </div>
          </div>

          {/* Popis aktivního módu */}
          <div
            style={{
              padding: "0 28px 10px",
              fontSize: "11px",
              color: "var(--muted)",
            }}
          >
            {currentTab.description}
          </div>
        </header>

        {/* Obsah */}
        <div style={{ flex: 1, overflowY: "auto", padding: "32px 40px" }}>
          {/* Banner mód */}
          {isBanner && (
            <div
              style={{
                maxWidth: "900px",
                margin: "0 auto",
                background: "var(--surface)",
                borderRadius: "16px",
                border: "1px solid var(--border)",
                padding: "40px",
                boxShadow: "var(--shadow)",
              }}
            >
              <BannerEditor data={banner} onChange={setBanner} />
            </div>
          )}

          {/* Článek / Popis produktu mód */}
          {!isBanner && (
            <div
              style={{
                maxWidth: "100%",
                margin: "0 auto",
                minHeight: "500px",
                background: "var(--surface)",
                borderRadius: "16px",
                border: "1px solid var(--border)",
                padding: "40px 44px",
                boxShadow: "var(--shadow)",
              }}
            >
              {blocks.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "80px 0",
                    userSelect: "none",
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      margin: "0 auto 16px",
                      background: "var(--surface2)",
                      borderRadius: "12px",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--muted)"
                      strokeWidth="1.5"
                    >
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </div>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "var(--text)",
                      margin: "0 0 4px",
                    }}
                  >
                    Začněte přidáním bloku
                  </p>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "var(--muted)",
                      margin: 0,
                    }}
                  >
                    Vyberte typ bloku z levého panelu
                  </p>
                </div>
              )}

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={blocks.map((b) => b.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {blocks.map((block, index) => (
                    <BlockWrapper
                      key={block.id}
                      id={block.id}
                      onMoveUp={() => moveBlock(index, -1)}
                      onMoveDown={() => moveBlock(index, 1)}
                      onRemove={() => removeBlock(index)}
                      isFirst={index === 0}
                      isLast={index === blocks.length - 1}
                    >
                      {block.type === "h2" && (
                        <HeadingBlock
                          content={block.content}
                          onChange={(v) =>
                            updateBlock(block.id, { content: v })
                          }
                        />
                      )}
                      {block.type === "richtext" && (
                        <RichTextBlock
                          content={block.content}
                          onChange={(h) =>
                            updateBlock(block.id, { content: h })
                          }
                        />
                      )}
                      {block.type === "media" && (
                        <MediaBlock
                          data={block.media ?? defaultMediaItem()}
                          onChange={(media) => updateBlock(block.id, { media })}
                        />
                      )}
                      {(block.type === "media-2" ||
                        block.type === "media-3") && (
                        <MediaGridBlock
                          count={block.type === "media-2" ? 2 : 3}
                          items={block.mediaItems ?? []}
                          onChange={(mediaItems) =>
                            updateBlock(block.id, { mediaItems })
                          }
                        />
                      )}
                      {block.type === "media-text" && (
                        <MediaTextBlock
                          media={block.media ?? defaultMediaItem()}
                          onMediaChange={(media) =>
                            updateBlock(block.id, { media })
                          }
                          content={block.content}
                          onContentChange={(h) =>
                            updateBlock(block.id, { content: h })
                          }
                          mediaPosition={block.mediaPosition ?? "left"}
                          onPositionChange={(pos) =>
                            updateBlock(block.id, { mediaPosition: pos })
                          }
                        />
                      )}
                    </BlockWrapper>
                  ))}
                </SortableContext>
                <DragOverlay>
                  {activeId ? (
                    <div
                      style={{
                        background: "var(--surface2)",
                        border: "1px solid var(--accent)",
                        borderRadius: "12px",
                        padding: "16px",
                        opacity: 0.9,
                        boxShadow: "0 8px 24px rgba(124,58,237,0.2)",
                        color: "var(--muted)",
                        fontSize: "13px",
                        fontWeight: "500",
                      }}
                    >
                      Přesouvám blok...
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            </div>
          )}
        </div>
      </main>

      {/* Export Modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "92vw",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "16px",
              padding: "28px",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: "15px",
                    fontWeight: "700",
                    color: "var(--text)",
                  }}
                >
                  Export HTML
                </h2>
                <p
                  style={{
                    margin: "3px 0 0",
                    fontSize: "12px",
                    color: "var(--muted)",
                  }}
                >
                  Vložte kód do Shoptetu — bloky mají třídy{" "}
                  <code
                    style={{
                      background: "var(--surface2)",
                      border: "1px solid var(--border)",
                      borderRadius: "4px",
                      padding: "1px 5px",
                      fontSize: "11px",
                      color: "var(--accent)",
                    }}
                  >
                    mm-*
                  </code>
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "var(--surface2)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "7px",
                  cursor: "pointer",
                  color: "var(--muted)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <CloseIcon />
              </button>
            </div>
            <pre
              style={{
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "16px",
                fontSize: "12px",
                lineHeight: "1.6",
                color: "var(--accent)",
                overflowY: "auto",
                maxHeight: "380px",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                margin: 0,
                fontFamily: "'SF Mono', 'Fira Code', monospace",
              }}
            >
              {generatedHtml}
            </pre>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
                marginTop: "16px",
              }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  background: "transparent",
                  border: "1px solid var(--border)",
                  color: "var(--muted)",
                  cursor: "pointer",
                  fontWeight: "500",
                }}
              >
                Zavřít
              </button>
              <button
                onClick={copyCode}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "600",
                  background: copied ? "#059669" : "var(--gradient)",
                  border: "none",
                  color: "black",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  transition: "background 0.2s",
                }}
              >
                <CopyIcon /> {copied ? "Zkopírováno!" : "Kopírovat kód"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
