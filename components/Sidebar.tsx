"use client";

import { BlockType } from "@/types/blocks";

interface SidebarProps {
  onAddBlock: (type: BlockType) => void;
}

const Icons = {
  Heading: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M4 12h16M4 6h8M4 18h8" />
    </svg>
  ),
  Text: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 6h16M4 10h16M4 14h10M4 18h8" />
    </svg>
  ),
  Image: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  ),
  Grid2: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="8" height="18" rx="1.5" />
      <rect x="13" y="3" width="8" height="18" rx="1.5" />
    </svg>
  ),
  Grid3: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="3" width="6" height="18" rx="1.5" />
      <rect x="9" y="3" width="6" height="18" rx="1.5" />
      <rect x="16" y="3" width="6" height="18" rx="1.5" />
    </svg>
  ),
  ImageText: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="3" y="3" width="9" height="18" rx="1.5" />
      <path d="M16 7h4M16 12h4M16 17h4" />
    </svg>
  ),
  Plus: () => (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  Media: () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <polygon points="10,8 16,12 10,16" />
    </svg>
  ),
};

const BLOCKS: {
  type: BlockType;
  label: string;
  description: string;
  Icon: () => React.JSX.Element;
}[] = [
  {
    type: "h2",
    label: "Nadpis",
    description: "H2–H5, volitelná úroveň",
    Icon: Icons.Heading,
  },
  {
    type: "richtext",
    label: "Text",
    description: "Formátovaný obsah",
    Icon: Icons.Text,
  },
  {
    type: "media",
    label: "Médium",
    description: "Obrázek / video / embed",
    Icon: Icons.Media,
  },
  {
    type: "media-2",
    label: "2 média",
    description: "Dvě média vedle sebe",
    Icon: Icons.Grid2,
  },
  {
    type: "media-3",
    label: "3 média",
    description: "Tři média vedle sebe",
    Icon: Icons.Grid3,
  },
  {
    type: "media-text",
    label: "Médium + text",
    description: "Médium vedle textu",
    Icon: Icons.ImageText,
  },
];

export default function Sidebar({ onAddBlock }: SidebarProps) {
  return (
    <aside
      style={{
        width: "240px",
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <div
          style={{
            width: "28px",
            height: "28px",
            background: "var(--gradient)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "13px",
            fontWeight: "700",
            color: "black",
          }}
        >
          M
        </div>
        <span
          style={{ fontWeight: "600", fontSize: "14px", color: "var(--text)" }}
        >
          Web Editor
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: "10px",
            fontWeight: "600",
            padding: "2px 7px",
            borderRadius: "99px",
            background: "var(--accent-bg)",
            color: "var(--accent)",
          }}
        >
          RC 1.0.0
        </span>
      </div>

      {/* Bloky */}
      <div style={{ padding: "16px 12px", flexGrow: 1, overflowY: "auto" }}>
        <p
          style={{
            fontSize: "10px",
            fontWeight: "600",
            letterSpacing: "0.08em",
            color: "var(--muted)",
            textTransform: "uppercase",
            margin: "0 0 10px 8px",
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
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 10px",
              borderRadius: "8px",
              marginBottom: "2px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              transition: "all 0.12s",
              color: "var(--muted)",
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.background = "var(--accent-bg)";
              btn.style.color = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.background = "transparent";
              btn.style.color = "var(--muted)";
            }}
          >
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "7px",
                background: "var(--surface2)",
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: "inherit",
              }}
            >
              <b.Icon />
            </div>
            <div>
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "500",
                  color: "inherit",
                  lineHeight: "1.2",
                }}
              >
                {b.label}
              </div>
              <div
                style={{
                  fontSize: "11px",
                  color: "inherit",
                  opacity: 0.7,
                  marginTop: "1px",
                }}
              >
                {b.description}
              </div>
            </div>
            <div style={{ marginLeft: "auto", opacity: 0.4 }}>
              <Icons.Plus />
            </div>
          </button>
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "14px 20px",
          borderTop: "1px solid var(--border)",
          fontSize: "11px",
          color: "var(--muted)",
          lineHeight: "1.6",
        }}
      >
        Text z Wordu vložte přes{" "}
        <kbd
          style={{
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            borderRadius: "4px",
            padding: "1px 5px",
            fontSize: "10px",
            fontFamily: "monospace",
            color: "var(--accent)",
          }}
        >
          Ctrl+V
        </kbd>{" "}
        do bloku Text.
      </div>
    </aside>
  );
}
