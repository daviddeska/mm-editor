"use client";

import { BlockType } from "@/types/blocks";

interface SidebarProps {
  onAddBlock: (type: BlockType) => void;
}

const BLOCKS: { type: BlockType; label: string; desc: string }[] = [
  { type: "h2", label: "Heading", desc: "Hlavní nadpis" },
  { type: "richtext", label: "Text", desc: "Formátovaný odstavec" },
  { type: "img", label: "Image", desc: "Jeden obrázek" },
  { type: "img-2", label: "Image 2×", desc: "Dva obrázky vedle sebe" },
  { type: "img-3", label: "Image 3×", desc: "Tři obrázky vedle sebe" },
  { type: "img-text", label: "Image + Text", desc: "Obrázek s textem" },
];

// Ikony jako SVG — žádné emoji
const BlockIcon = ({ type }: { type: BlockType }) => {
  const s = {
    width: 14,
    height: 14,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
  } as const;
  if (type === "h2")
    return (
      <svg {...s}>
        <path d="M2 4h12M2 8h8M2 12h10" strokeLinecap="round" />
      </svg>
    );
  if (type === "richtext")
    return (
      <svg {...s}>
        <path d="M2 4h12M2 7h12M2 10h8M2 13h6" strokeLinecap="round" />
      </svg>
    );
  if (type === "img")
    return (
      <svg {...s}>
        <rect x="2" y="3" width="12" height="10" rx="1.5" />
        <circle cx="5.5" cy="6.5" r="1" />
        <path d="M2 11l3-3 2 2 2-3 3 4" />
      </svg>
    );
  if (type === "img-2")
    return (
      <svg {...s}>
        <rect x="1" y="3" width="6" height="10" rx="1" />
        <rect x="9" y="3" width="6" height="10" rx="1" />
      </svg>
    );
  if (type === "img-3")
    return (
      <svg {...s}>
        <rect x="1" y="4" width="4" height="8" rx="1" />
        <rect x="6" y="4" width="4" height="8" rx="1" />
        <rect x="11" y="4" width="4" height="8" rx="1" />
      </svg>
    );
  return (
    <svg {...s}>
      <rect x="1" y="3" width="6" height="10" rx="1" />
      <path d="M9 6h6M9 9h6M9 12h4" strokeLinecap="round" />
    </svg>
  );
};

export default function Sidebar({ onAddBlock }: SidebarProps) {
  return (
    <aside
      style={{
        width: 220,
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "18px 18px 16px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            borderRadius: 7,
            background: "var(--gradient)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 16 16"
            fill="none"
            stroke="white"
            strokeWidth="2.2"
          >
            <path
              d="M3 8h10M8 3l5 5-5 5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <span
          style={{
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: "-0.02em",
            color: "var(--text)",
          }}
        >
          MM Editor
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 10,
            fontWeight: 600,
            color: "var(--accent2)",
            background: "rgba(124,58,237,0.15)",
            padding: "2px 7px",
            borderRadius: 99,
          }}
        >
          beta
        </span>
      </div>

      {/* Bloky */}
      <div style={{ padding: "12px 10px", flex: 1, overflowY: "auto" }}>
        <p
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.08em",
            color: "var(--muted)",
            textTransform: "uppercase",
            padding: "0 6px",
            marginBottom: 8,
          }}
        >
          Bloky
        </p>

        {BLOCKS.map((b) => (
          <button
            key={b.type}
            onClick={() => onAddBlock(b.type)}
            style={{
              width: "100%",
              textAlign: "left",
              background: "transparent",
              border: "none",
              borderRadius: 8,
              padding: "8px 10px",
              marginBottom: 2,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 10,
              transition: "background 0.12s",
              color: "var(--muted)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background =
                "var(--border)";
              (e.currentTarget as HTMLElement).style.color = "var(--text)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "var(--muted)";
            }}
          >
            <span style={{ opacity: 0.7, flexShrink: 0 }}>
              <BlockIcon type={b.type} />
            </span>
            <span>
              <span
                style={{
                  display: "block",
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: "inherit",
                  lineHeight: 1.3,
                }}
              >
                {b.label}
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: 11,
                  color: "var(--muted)",
                  marginTop: 1,
                }}
              >
                {b.desc}
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}
      >
        <p
          style={{
            fontSize: 11,
            color: "var(--muted)",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          Text z Wordu vložte pomocí{" "}
          <kbd
            style={{
              background: "var(--surface2)",
              border: "1px solid var(--border2)",
              borderRadius: 4,
              padding: "1px 5px",
              fontSize: 10,
              fontFamily: "monospace",
            }}
          >
            Ctrl+V
          </kbd>
        </p>
      </div>
    </aside>
  );
}
