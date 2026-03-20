/**
 * page.tsx
 * --------
 * Hlavní stránka editoru. Řídí celý stav aplikace.
 *
 * TypeScript lekce:
 * - `useState<T>` = hook pro stav, T říká jakého typu stav je
 * - `Block[]` = pole objektů typu Block
 * - Immutabilita: stav v Reactu nikdy neměníme přímo (block.content = "x"),
 *   vždy vytváříme novou kopii přes map/filter/spread
 */

"use client";

import { useState } from "react";
import { Block, BlockType } from "@/types/blocks";
import Sidebar from "@/components/Sidebar";
import BlockWrapper from "@/components/Editor/BlockWrapper";
import HeadingBlock from "@/components/Editor/HeadingBlock";
import RichTextBlock from "@/components/Editor/RichTextBlock";
import ImageBlock from "@/components/Editor/ImageBlock";
import ImageTextBlock from "@/components/Editor/ImageTextBlock";

// --- POMOCNÉ FUNKCE ---

// Vygeneruje unikátní ID pro každý nový blok
const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2);

// Vytvoří prázdný blok podle typu
function createBlock(type: BlockType): Block {
  const base: Block = { id: generateId(), type, content: "" };

  if (type === "img" || type === "img-text") {
    return { ...base, filename: "", previewUrl: "", imagePosition: "left" };
  }
  if (type === "img-2") {
    return {
      ...base,
      images: [
        { filename: "", previewUrl: "" },
        { filename: "", previewUrl: "" },
      ],
    };
  }
  if (type === "img-3") {
    return {
      ...base,
      images: [
        { filename: "", previewUrl: "" },
        { filename: "", previewUrl: "" },
        { filename: "", previewUrl: "" },
      ],
    };
  }
  return base;
}

// Přidá mm- CSS třídy do HTML z Tiptap editoru (pro Shoptet)
function processRichText(html: string): string {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  div.querySelectorAll("p").forEach((el) => el.classList.add("mm-paragraph"));
  div
    .querySelectorAll("h1,h2,h3,h4")
    .forEach((el) => el.classList.add("mm-heading", "mm-subheading"));
  div.querySelectorAll("ul,ol").forEach((el) => el.classList.add("mm-list"));
  div.querySelectorAll("li").forEach((el) => el.classList.add("mm-list-item"));
  div
    .querySelectorAll("strong")
    .forEach((el) => el.classList.add("mm-text-bold"));
  return div.innerHTML;
}

// --- HLAVNÍ KOMPONENTA ---
export default function EditorPage() {
  // useState<Block[]>([]) = stav je pole bloků, začíná prázdné
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [generatedHtml, setGeneratedHtml] = useState("");

  // --- SPRÁVA BLOKŮ ---

  // Přidá nový blok na konec seznamu
  const addBlock = (type: BlockType) => {
    // Spread operátor: [...blocks, newBlock] = nové pole se všemi starými + novým blokem
    setBlocks((prev) => [...prev, createBlock(type)]);
  };

  // Smaže blok podle indexu
  const removeBlock = (index: number) => {
    // filter vrátí nové pole bez prvku na daném indexu
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  // Přesune blok nahoru nebo dolů
  const moveBlock = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    // Vytvoříme kopii pole a prohodíme dva prvky
    const updated = [...blocks];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setBlocks(updated);
  };

  // Aktualizuje libovolnou vlastnost bloku
  // Partial<Block> = objekt s libovolnou podmnožinou vlastností Block
  const updateBlock = (id: string, changes: Partial<Block>) => {
    setBlocks((prev) =>
      prev.map((block) =>
        // Pokud ID sedí, sloučíme stávající blok s novými hodnotami
        block.id === id ? { ...block, ...changes } : block,
      ),
    );
  };

  // Aktualizuje jeden obrázek v img-2 nebo img-3 bloku
  const updateImage = (
    id: string,
    index: number,
    filename: string,
    previewUrl: string,
  ) => {
    setBlocks((prev) =>
      prev.map((block) => {
        if (block.id !== id || !block.images) return block;
        const updatedImages = [...block.images];
        updatedImages[index] = { filename, previewUrl };
        return { ...block, images: updatedImages };
      }),
    );
  };

  // Zpracuje vybraný soubor obrázku a vytvoří lokální náhled
  const handleFileSelect = (block: Block, file: File, index?: number) => {
    const previewUrl = URL.createObjectURL(file); // Dočasná blob:// URL pro náhled
    const filename = file.name;

    if (index !== undefined) {
      updateImage(block.id, index, filename, previewUrl);
    } else {
      updateBlock(block.id, { filename, previewUrl });
    }
  };

  // --- GENEROVÁNÍ HTML ---
  const generateHTML = () => {
    let html = '<div class="mm-article-wrapper">\n';

    blocks.forEach((b) => {
      if (b.type === "h2") {
        html += `  <h2 class="mm-heading mm-main-heading">${b.content.replace(/\n/g, "<br>")}</h2>\n`;
      }
      if (b.type === "richtext") {
        html += `  <div class="mm-text-block">\n    ${processRichText(b.content)}\n  </div>\n`;
      }
      if (b.type === "img") {
        const src = b.filename
          ? `/user/documents/upload/mmeditor/${b.filename}`
          : "https://via.placeholder.com/800x400";
        html += `  <div class="mm-image-wrapper">\n    <img class="mm-image" src="${src}" alt="">\n  </div>\n`;
      }
      if (b.type === "img-2" || b.type === "img-3") {
        const cls = b.type === "img-2" ? "mm-image-grid-2" : "mm-image-grid-3";
        html += `  <div class="${cls}">\n`;
        b.images?.forEach((img) => {
          const src = img.filename
            ? `/user/documents/upload/mmeditor/${img.filename}`
            : "https://via.placeholder.com/400x400";
          html += `    <div class="mm-image-item"><img class="mm-image" src="${src}" alt=""></div>\n`;
        });
        html += `  </div>\n`;
      }
      if (b.type === "img-text") {
        const src = b.filename
          ? `/user/documents/upload/mmeditor/${b.filename}`
          : "https://via.placeholder.com/400x300";
        const reverseClass = b.imagePosition === "right" ? " mm-reverse" : "";
        html += `  <div class="mm-combined-block${reverseClass}">\n`;
        html += `    <div class="mm-combined-image"><img class="mm-image" src="${src}" alt=""></div>\n`;
        html += `    <div class="mm-combined-text">\n      ${processRichText(b.content)}\n    </div>\n`;
        html += `  </div>\n`;
      }
    });

    html += "</div>";
    setGeneratedHtml(html);
    setShowModal(true);
  };

  const copyCode = () => {
    navigator.clipboard
      .writeText(generatedHtml)
      .then(() => alert("Kód zkopírován!"));
  };

  // --- RENDER ---
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--bg-color)" }}
    >
      <Sidebar onAddBlock={addBlock} />

      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header
          className="px-8 py-4 flex justify-between items-center shrink-0"
          style={{
            background: "var(--surface)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div className="flex items-center gap-3">
            <div>
              <h1
                className="text-sm font-semibold"
                style={{ color: "var(--text-main)" }}
              >
                Nový článek
              </h1>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {blocks.length === 0
                  ? "Žádné bloky"
                  : `${blocks.length} ${blocks.length === 1 ? "blok" : blocks.length < 5 ? "bloky" : "bloků"}`}
              </p>
            </div>
          </div>
          <button
            onClick={generateHTML}
            className="font-semibold px-5 py-2 rounded-xl text-sm transition-all duration-150 flex items-center gap-2"
            style={{
              background: "linear-gradient(135deg, #6d28d9, #db2777)",
              color: "white",
              boxShadow: "0 0 20px rgba(109,40,217,0.4)",
            }}
          >
            <span>⚙️</span> Vygenerovat HTML
          </button>
        </header>

        {/* Plocha editoru */}
        <div className="flex-1 overflow-y-auto p-8">
          <div
            className="max-w-3xl mx-auto min-h-[600px] rounded-2xl p-10"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "0 0 60px rgba(109,40,217,0.08)",
            }}
          >
            {blocks.length === 0 && (
              <div className="text-center pt-24 select-none">
                <div className="text-5xl mb-4">✨</div>
                <p
                  className="text-lg font-semibold"
                  style={{ color: "var(--text-main)" }}
                >
                  Zatím tu nic není
                </p>
                <p
                  className="text-sm mt-1"
                  style={{ color: "var(--text-muted)" }}
                >
                  Přidejte bloky z levého panelu
                </p>
              </div>
            )}

            {blocks.map((block, index) => (
              <BlockWrapper
                key={block.id}
                onMoveUp={() => moveBlock(index, -1)}
                onMoveDown={() => moveBlock(index, 1)}
                onRemove={() => removeBlock(index)}
                isFirst={index === 0}
                isLast={index === blocks.length - 1}
              >
                {block.type === "h2" && (
                  <HeadingBlock
                    content={block.content}
                    onChange={(val) => updateBlock(block.id, { content: val })}
                  />
                )}
                {block.type === "richtext" && (
                  <RichTextBlock
                    content={block.content}
                    onChange={(html) =>
                      updateBlock(block.id, { content: html })
                    }
                  />
                )}
                {block.type === "img" && (
                  <ImageBlock
                    count={1}
                    filename={block.filename}
                    previewUrl={block.previewUrl}
                    onFileSelect={(file) => handleFileSelect(block, file)}
                  />
                )}
                {block.type === "img-2" && (
                  <ImageBlock
                    count={2}
                    images={block.images}
                    onImageFileSelect={(file, i) =>
                      handleFileSelect(block, file, i)
                    }
                  />
                )}
                {block.type === "img-3" && (
                  <ImageBlock
                    count={3}
                    images={block.images}
                    onImageFileSelect={(file, i) =>
                      handleFileSelect(block, file, i)
                    }
                  />
                )}
                {block.type === "img-text" && (
                  <ImageTextBlock
                    content={block.content}
                    onChange={(html) =>
                      updateBlock(block.id, { content: html })
                    }
                    filename={block.filename ?? ""}
                    previewUrl={block.previewUrl ?? ""}
                    onFileSelect={(file) => handleFileSelect(block, file)}
                    imagePosition={block.imagePosition ?? "left"}
                    onPositionChange={(pos) =>
                      updateBlock(block.id, { imagePosition: pos })
                    }
                  />
                )}
              </BlockWrapper>
            ))}
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{
            background: "rgba(0,0,0,0.7)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-[800px] max-w-[90%] rounded-2xl p-8"
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              boxShadow: "0 0 60px rgba(109,40,217,0.3)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="text-xl font-bold mb-1"
              style={{ color: "var(--text-main)" }}
            >
              Vygenerovaný HTML kód
            </h2>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
              Zkopírujte kód do Shoptetu. Prvky mají třídy{" "}
              <code
                className="px-1.5 py-0.5 rounded text-xs"
                style={{ background: "#2e2e3e", color: "#a78bfa" }}
              >
                mm-
              </code>
              .
            </p>
            <pre
              className="p-5 rounded-xl text-sm overflow-auto max-h-96 whitespace-pre-wrap break-words"
              style={{
                background: "#0f0f13",
                color: "#e2e8f0",
                border: "1px solid var(--border)",
              }}
            >
              {generatedHtml}
            </pre>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: "var(--surface2)",
                  color: "var(--text-muted)",
                  border: "1px solid var(--border)",
                }}
              >
                Zavřít
              </button>
              <button
                onClick={copyCode}
                className="px-5 py-2 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: "linear-gradient(135deg, #6d28d9, #db2777)",
                  color: "white",
                }}
              >
                📋 Kopírovat kód
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
