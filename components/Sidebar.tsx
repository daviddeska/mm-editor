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
          <svg
            width="15"
            height="15"
            viewBox="0 0 67 55"
            xmlns="http://www.w3.org/2000/svg"
            data-v-db080b12=""
          >
            <title data-v-db080b12="">MirandaMedia Group s.r.o.</title>
            <path
              d="M0 0H6.76955V6.54484H0V0ZM0 8.08755H6.76955V14.6324H0V8.08755ZM0 16.1517H6.76955V22.6966H0V16.1517ZM0 24.2159H6.76955V30.7607H0V24.2159ZM0 32.3034H6.76955V38.8483H0V32.3034ZM0 40.3676H6.76955V46.9125H0V40.3676ZM0 48.4552H6.76955V55H0V48.4552ZM8.60104 0H15.3706V6.54484H8.60104V0ZM8.60104 8.08755H15.3706V14.6324H8.60104V8.08755ZM8.60104 16.1517H15.3706V22.6966H8.60104V16.1517ZM8.60104 24.2159H15.3706V30.7607H8.60104V24.2159ZM8.60104 32.3034H15.3706V38.8483H8.60104V32.3034ZM8.60104 40.3676H15.3706V46.9125H8.60104V40.3676ZM8.60104 48.4552H15.3706V55H8.60104V48.4552ZM17.2253 8.08755H23.9948V14.6324H17.2253V8.08755ZM17.2253 16.1517H23.9948V22.6966H17.2253V16.1517ZM17.2253 24.2159H23.9948V30.7607H17.2253V24.2159ZM17.2253 32.3034H23.9948V38.8483H17.2253V32.3034ZM25.8263 16.1517H32.5959V22.6966H25.8263V16.1517ZM25.8263 24.2159H32.5959V30.7607H25.8263V24.2159ZM25.8263 32.3034H32.5959V38.8483H25.8263V32.3034ZM25.8263 40.3676H32.5959V46.9125H25.8263V40.3676ZM34.4273 16.1517H41.1969V22.6966H34.4273V16.1517ZM34.4273 24.2159H41.1969V30.7607H34.4273V24.2159ZM34.4273 32.3034H41.1969V38.8483H34.4273V32.3034ZM34.4273 40.3676H41.1969V46.9125H34.4273V40.3676ZM43.0284 8.08755H49.7979V14.6324H43.0284V8.08755ZM43.0284 16.1517H49.7979V22.6966H43.0284V16.1517ZM43.0284 24.2159H49.7979V30.7607H43.0284V24.2159ZM43.0284 32.3034H49.7979V38.8483H43.0284V32.3034ZM51.6294 0H58.399V6.54484H51.6294V0ZM51.6294 8.08755H58.399V14.6324H51.6294V8.08755ZM51.6294 16.1517H58.399V22.6966H51.6294V16.1517ZM51.6294 24.2159H58.399V30.7607H51.6294V24.2159ZM51.6294 32.3034H58.399V38.8483H51.6294V32.3034ZM51.6294 40.3676H58.399V46.9125H51.6294V40.3676ZM51.6294 48.4552H58.399V55H51.6294V48.4552ZM60.2305 0H67V6.54484H60.2305V0ZM60.2305 8.08755H67V14.6324H60.2305V8.08755ZM60.2305 16.1517H67V22.6966H60.2305V16.1517ZM60.2305 24.2159H67V30.7607H60.2305V24.2159ZM60.2305 32.3034H67V38.8483H60.2305V32.3034ZM60.2305 40.3676H67V46.9125H60.2305V40.3676ZM60.2305 48.4552H67V55H60.2305V48.4552Z"
              data-v-db080b12=""
            ></path>
          </svg>
        </div>
        <span
          style={{ fontWeight: "600", fontSize: "14px", color: "var(--text)" }}
        >
          Web Editor <br />
          <span style={{ fontWeight: "400", fontSize: "8px" }}>
            by MirandaMedia
          </span>
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: "10px",
            fontWeight: "600",
            padding: "2px 7px",
            borderRadius: "99px",
            background: "black",
            color: "white",
          }}
        >
          Build 1.0.1
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
