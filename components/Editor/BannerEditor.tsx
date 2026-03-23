/**
 * BannerEditor.tsx
 * ----------------
 * Editor pro banner — pevná pole místo blokového editoru.
 * Pole: pozadí (soubor nebo URL), nadpis, text, tlačítko (text + odkaz).
 */

"use client";

import { useRef, useState } from "react";
import { BannerData } from "@/types/blocks";

interface BannerEditorProps {
  data: BannerData;
  onChange: (data: BannerData) => void;
}

// Pomocná komponenta pro jedno pole formuláře
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label
        style={{
          display: "block",
          fontSize: "11px",
          fontWeight: "600",
          color: "var(--muted)",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          marginBottom: "6px",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

// Styly pro textové inputy — sdílené
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "9px 12px",
  borderRadius: "8px",
  border: "1px solid var(--border)",
  background: "var(--surface2)",
  fontSize: "13px",
  color: "var(--text)",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

export default function BannerEditor({ data, onChange }: BannerEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Přepínač mezi souborem a URL pro pozadí
  const [bgMode, setBgMode] = useState<"file" | "url">(
    data.backgroundUrl ? "url" : "file",
  );

  // Zkratka pro aktualizaci jednoho pole
  const update = (field: keyof BannerData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    onChange({
      ...data,
      backgroundFilename: file.name,
      backgroundPreview: previewUrl,
      backgroundUrl: "",
    });
  };

  // Aktivní pozadí pro náhled (soubor má přednost před URL)
  const activeBg = data.backgroundPreview || data.backgroundUrl;

  return (
    <div style={{ display: "flex", gap: "32px", alignItems: "flex-start" }}>
      {/* Levá část — formulář */}
      <div style={{ flex: 1 }}>
        {/* Pozadí */}
        <Field label="Obrázek pozadí">
          {/* Přepínač soubor / URL */}
          <div
            style={{
              display: "flex",
              gap: "4px",
              marginBottom: "10px",
              background: "var(--surface2)",
              borderRadius: "8px",
              padding: "4px",
              width: "fit-content",
            }}
          >
            {(["file", "url"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setBgMode(mode)}
                style={{
                  padding: "4px 12px",
                  borderRadius: "6px",
                  border: "none",
                  fontSize: "12px",
                  fontWeight: "500",
                  cursor: "pointer",
                  background:
                    bgMode === mode ? "var(--surface)" : "transparent",
                  color: bgMode === mode ? "var(--accent)" : "var(--muted)",
                  boxShadow:
                    bgMode === mode ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.12s",
                }}
              >
                {mode === "file" ? "Soubor" : "URL"}
              </button>
            ))}
          </div>

          {bgMode === "file" ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  width: "100%",
                  padding: "9px 12px",
                  borderRadius: "8px",
                  border: "1px dashed var(--border2)",
                  background: "var(--surface2)",
                  fontSize: "13px",
                  color: "var(--muted)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "var(--accent)";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor =
                    "var(--border2)";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "var(--muted)";
                }}
              >
                {data.backgroundFilename || "Vybrat obrázek..."}
              </button>
            </div>
          ) : (
            <input
              type="url"
              value={data.backgroundUrl}
              onChange={(e) => update("backgroundUrl", e.target.value)}
              placeholder="https://example.com/banner.jpg"
              style={inputStyle}
              onFocus={(e) =>
                ((e.target as HTMLInputElement).style.borderColor =
                  "var(--accent)")
              }
              onBlur={(e) =>
                ((e.target as HTMLInputElement).style.borderColor =
                  "var(--border)")
              }
            />
          )}
        </Field>

        {/* Nadpis */}
        <Field label="Nadpis">
          <input
            type="text"
            value={data.heading}
            onChange={(e) => update("heading", e.target.value)}
            placeholder="Hlavní nadpis banneru"
            style={inputStyle}
            onFocus={(e) =>
              ((e.target as HTMLInputElement).style.borderColor =
                "var(--accent)")
            }
            onBlur={(e) =>
              ((e.target as HTMLInputElement).style.borderColor =
                "var(--border)")
            }
          />
        </Field>

        {/* Text */}
        <Field label="Popisný text">
          <textarea
            value={data.text}
            onChange={(e) => update("text", e.target.value)}
            placeholder="Krátký popis nebo podnadpis banneru"
            rows={3}
            style={{ ...inputStyle, resize: "vertical", lineHeight: "1.6" }}
            onFocus={(e) =>
              ((e.target as HTMLTextAreaElement).style.borderColor =
                "var(--accent)")
            }
            onBlur={(e) =>
              ((e.target as HTMLTextAreaElement).style.borderColor =
                "var(--border)")
            }
          />
        </Field>

        {/* Tlačítko */}
        <div
          style={{
            background: "var(--surface2)",
            borderRadius: "10px",
            padding: "16px",
            border: "1px solid var(--border)",
          }}
        >
          <p
            style={{
              margin: "0 0 12px",
              fontSize: "11px",
              fontWeight: "600",
              color: "var(--muted)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Tlačítko
          </p>
          <div style={{ display: "flex", gap: "10px" }}>
            <div style={{ flex: 1 }}>
              <label
                style={{
                  fontSize: "11px",
                  color: "var(--muted)",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                Text tlačítka
              </label>
              <input
                type="text"
                value={data.buttonLabel}
                onChange={(e) => update("buttonLabel", e.target.value)}
                placeholder="Zobrazit více"
                style={inputStyle}
                onFocus={(e) =>
                  ((e.target as HTMLInputElement).style.borderColor =
                    "var(--accent)")
                }
                onBlur={(e) =>
                  ((e.target as HTMLInputElement).style.borderColor =
                    "var(--border)")
                }
              />
            </div>
            <div style={{ flex: 2 }}>
              <label
                style={{
                  fontSize: "11px",
                  color: "var(--muted)",
                  display: "block",
                  marginBottom: "5px",
                }}
              >
                Odkaz (URL)
              </label>
              <input
                type="url"
                value={data.buttonUrl}
                onChange={(e) => update("buttonUrl", e.target.value)}
                placeholder="https://example.com"
                style={inputStyle}
                onFocus={(e) =>
                  ((e.target as HTMLInputElement).style.borderColor =
                    "var(--accent)")
                }
                onBlur={(e) =>
                  ((e.target as HTMLInputElement).style.borderColor =
                    "var(--border)")
                }
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pravá část — živý náhled banneru */}
      <div style={{ width: "340px", flexShrink: 0 }}>
        <p
          style={{
            fontSize: "11px",
            fontWeight: "600",
            color: "var(--muted)",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            marginBottom: "10px",
          }}
        >
          Náhled
        </p>
        <div
          style={{
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid var(--border)",
            minHeight: "200px",
            background: activeBg
              ? `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.55)), url(${activeBg}) center/cover no-repeat`
              : "var(--surface2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px 24px",
            textAlign: "center",
            position: "relative",
          }}
        >
          {!activeBg && (
            <p style={{ color: "var(--muted)", fontSize: "13px" }}>
              Vyberte obrázek pozadí
            </p>
          )}
          {activeBg && (
            <>
              {data.heading && (
                <h2
                  style={{
                    margin: "0 0 10px",
                    fontSize: "22px",
                    fontWeight: "700",
                    color: "white",
                    lineHeight: "1.2",
                    textShadow: "0 1px 4px rgba(0,0,0,0.4)",
                  }}
                >
                  {data.heading}
                </h2>
              )}
              {data.text && (
                <p
                  style={{
                    margin: "0 0 18px",
                    fontSize: "14px",
                    color: "rgba(255,255,255,0.85)",
                    lineHeight: "1.5",
                    textShadow: "0 1px 3px rgba(0,0,0,0.3)",
                  }}
                >
                  {data.text}
                </p>
              )}
              {data.buttonLabel && (
                <a
                  href={data.buttonUrl || "#"}
                  style={{
                    display: "inline-block",
                    padding: "9px 22px",
                    background: "white",
                    color: "#1a1a2e",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    textDecoration: "none",
                  }}
                >
                  {data.buttonLabel}
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
