"use client";

import { useState } from "react";
import { Block } from "@/types/blocks";
import { parseHtmlToBlocks } from "@/lib/htmlImport";

interface ImportModalProps {
  onClose: () => void;
  onImport: (introText: string, blocks: Block[]) => void;
}

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

const ImportIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
  </svg>
);

export default function ImportModal({ onClose, onImport }: ImportModalProps) {
  const [pastedHtml, setPastedHtml] = useState("");

  const handleImport = () => {
    if (!pastedHtml.trim()) {
      alert("Vložte HTML kód pro import");
      return;
    }
    const { introText, blocks } = parseHtmlToBlocks(pastedHtml);
    onImport(introText, blocks);
  };

  return (
    <div
      onClick={onClose}
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
        {/* Header */}
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
              Import HTML
            </h2>
            <p
              style={{
                margin: "3px 0 0",
                fontSize: "12px",
                color: "var(--muted)",
              }}
            >
              Vložte HTML s třídami{" "}
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
              </code>{" "}
              a{" "}
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
                post-description
              </code>
            </p>
          </div>
          <button
            onClick={onClose}
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

        {/* Textarea */}
        <textarea
          value={pastedHtml}
          onChange={(e) => setPastedHtml(e.target.value)}
          placeholder={'<div class="post-description">...</div>\n<div class="mm-article-wrapper">...</div>'}
          style={{
            width: "100%",
            minHeight: "300px",
            maxHeight: "380px",
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "16px",
            fontSize: "12px",
            lineHeight: "1.6",
            color: "var(--accent)",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontFamily: "'SF Mono', 'Fira Code', monospace",
            resize: "vertical",
            outline: "none",
            boxSizing: "border-box",
          }}
          onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
        />

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            marginTop: "16px",
          }}
        >
          <button
            onClick={onClose}
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
            Zrušit
          </button>
          <button
            onClick={handleImport}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              fontSize: "12px",
              fontWeight: "600",
              background: "var(--gradient)",
              border: "none",
              color: "black",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <ImportIcon /> Importovat
          </button>
        </div>
      </div>
    </div>
  );
}
