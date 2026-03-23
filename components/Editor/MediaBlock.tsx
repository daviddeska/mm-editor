"use client";

import { useRef, useState } from "react";
import { MediaItem, MediaType, defaultMediaItem } from "@/types/blocks";

interface MediaBlockProps {
  data: MediaItem;
  onChange: (data: MediaItem) => void;
  compact?: boolean;
}

export function getEmbedUrl(url: string, type: "youtube" | "vimeo"): string {
  if (!url) return "";
  if (type === "youtube") {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );
    return match ? `https://www.youtube.com/embed/${match[1]}` : "";
  }
  if (type === "vimeo") {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? `https://player.vimeo.com/video/${match[1]}` : "";
  }
  return "";
}

// Nahraje soubor na API endpoint a vrátí URL + filename
async function uploadFile(
  file: File,
): Promise<{ url: string; filename: string; skipped?: boolean } | null> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) {
      const err = await res.json();
      alert(`Upload selhal: ${err.error}`);
      return null;
    }
    const data = await res.json();
    if (data.skipped)
      console.log(
        `Soubor "${file.name}" již existuje — použita existující verze.`,
      );
    return data;
  } catch {
    alert("Upload selhal — server není dostupný");
    return null;
  }
}

const MEDIA_TYPES: { type: MediaType; label: string }[] = [
  { type: "image-file", label: "Obrázek" },
  { type: "image-url", label: "URL" },
  { type: "video-file", label: "Video" },
  { type: "youtube", label: "YouTube" },
  { type: "vimeo", label: "Vimeo" },
];

export default function MediaBlock({
  data,
  onChange,
  compact = false,
}: MediaBlockProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState(data.mediaUrl);
  const [uploading, setUploading] = useState(false);

  const update = (changes: Partial<MediaItem>) =>
    onChange({ ...data, ...changes });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Okamžitý lokální náhled + default alt z názvu souboru
    const localPreview = URL.createObjectURL(file);
    const defaultAlt = file.name
      .replace(/\.[^/.]+$/, "") // odstraní příponu (.jpg, .png...)
      .replace(/[-_]/g, " ") // pomlčky a podtržítka → mezery
      .replace(/\b\w/g, (c) => c.toUpperCase()); // první písmeno každého slova velké
    update({
      mediaFilename: file.name,
      mediaPreview: localPreview,
      mediaUrl: "",
      alt: defaultAlt,
    });

    // Upload na server
    setUploading(true);
    const result = await uploadFile(file);
    setUploading(false);

    if (result) {
      update({
        mediaFilename: result.filename,
        mediaPreview: result.url,
        mediaUrl: "",
      });
    }
  };

  const handleUrlSubmit = () => update({ mediaUrl: urlInput });

  const embedUrl =
    data.mediaType === "youtube" || data.mediaType === "vimeo"
      ? getEmbedUrl(data.mediaUrl, data.mediaType)
      : "";

  const accept = data.mediaType === "video-file" ? "video/*" : "image/*";

  return (
    <div>
      {/* Přepínač typu */}
      <div
        style={{
          display: "flex",
          gap: "3px",
          marginBottom: "10px",
          background: "var(--surface2)",
          borderRadius: "8px",
          padding: "3px",
          width: "fit-content",
        }}
      >
        {MEDIA_TYPES.map((m) => (
          <button
            key={m.type}
            onClick={() => {
              onChange({ ...defaultMediaItem(), mediaType: m.type });
              setUrlInput("");
            }}
            style={{
              padding: compact ? "3px 8px" : "4px 11px",
              borderRadius: "6px",
              border: "none",
              fontSize: compact ? "11px" : "12px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.12s",
              background:
                data.mediaType === m.type ? "var(--surface)" : "transparent",
              color:
                data.mediaType === m.type ? "var(--accent)" : "var(--muted)",
              boxShadow:
                data.mediaType === m.type
                  ? "0 1px 3px rgba(0,0,0,0.08)"
                  : "none",
            }}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Soubor */}
      {(data.mediaType === "image-file" || data.mediaType === "video-file") && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          {data.mediaPreview ? (
            <div style={{ textAlign: "center", position: "relative" }}>
              {uploading && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "rgba(255,255,255,0.8)",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 1,
                    fontSize: "12px",
                    color: "var(--accent)",
                    fontWeight: "600",
                    gap: "8px",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    style={{ animation: "spin 1s linear infinite" }}
                  >
                    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                  </svg>
                  Nahrávám...
                </div>
              )}
              {data.mediaType === "image-file" ? (
                <img
                  src={data.mediaPreview}
                  alt={data.alt}
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  style={{
                    maxWidth: "100%",
                    borderRadius: "8px",
                    cursor: uploading ? "wait" : "pointer",
                  }}
                />
              ) : (
                <video
                  src={data.mediaPreview}
                  controls
                  style={{ width: "100%", borderRadius: "8px" }}
                />
              )}
              <p
                style={{
                  fontSize: "11px",
                  color: "var(--muted)",
                  marginTop: "6px",
                }}
              >
                {data.mediaFilename}
              </p>
              {/* Alt text input — zobrazí se pouze pro obrázky */}
              {data.mediaType !== "video-file" && (
                <input
                  type="text"
                  value={data.alt ?? ""}
                  onChange={(e) => update({ alt: e.target.value })}
                  placeholder="Alt text (popis obrázku pro SEO)"
                  style={{
                    width: "100%",
                    marginTop: "8px",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    border: "1px solid var(--border)",
                    background: "var(--surface2)",
                    fontSize: "12px",
                    color: "var(--text)",
                    outline: "none",
                    fontFamily: "inherit",
                    textAlign: "left",
                  }}
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
            </div>
          ) : (
            <MediaPlaceholder
              onClick={() => fileInputRef.current?.click()}
              label={
                data.mediaType === "video-file"
                  ? "Klikněte pro výběr videa"
                  : "Klikněte pro výběr obrázku"
              }
              isVideo={data.mediaType === "video-file"}
              compact={compact}
            />
          )}
        </div>
      )}

      {/* URL obrázku */}
      {data.mediaType === "image-url" && (
        <div>
          <UrlInput
            value={urlInput}
            placeholder="https://example.com/obrazek.jpg"
            onChange={setUrlInput}
            onSubmit={handleUrlSubmit}
          />
          {data.mediaUrl ? (
            <img
              src={data.mediaUrl}
              alt=""
              style={{ maxWidth: "100%", borderRadius: "8px" }}
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          ) : (
            <MediaPlaceholder
              onClick={() => {}}
              label="Vložte URL obrázku výše"
              compact={compact}
            />
          )}
        </div>
      )}

      {/* YouTube / Vimeo */}
      {(data.mediaType === "youtube" || data.mediaType === "vimeo") && (
        <div>
          <UrlInput
            value={urlInput}
            placeholder={
              data.mediaType === "youtube"
                ? "https://youtube.com/watch?v=..."
                : "https://vimeo.com/123456789"
            }
            onChange={setUrlInput}
            onSubmit={handleUrlSubmit}
          />
          {embedUrl ? (
            <div
              style={{
                position: "relative",
                paddingBottom: "56.25%",
                height: 0,
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <iframe
                src={embedUrl}
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            </div>
          ) : (
            <MediaPlaceholder
              onClick={() => {}}
              label={`Vložte ${data.mediaType === "youtube" ? "YouTube" : "Vimeo"} URL výše`}
              isVideo
              compact={compact}
            />
          )}
        </div>
      )}
    </div>
  );
}

// --- Pomocné komponenty ---

export function MediaPlaceholder({
  onClick,
  label,
  isVideo = false,
  compact = false,
}: {
  onClick: () => void;
  label: string;
  isVideo?: boolean;
  compact?: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const isClickable = onClick.toString() !== "() => {}";
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `2px dashed ${hovered && isClickable ? "var(--accent)" : "var(--border2)"}`,
        background:
          hovered && isClickable ? "var(--accent-bg)" : "var(--surface2)",
        borderRadius: "10px",
        padding: compact ? "20px" : "36px",
        textAlign: "center",
        cursor: isClickable ? "pointer" : "default",
        transition: "all 0.15s",
        color: hovered && isClickable ? "var(--accent)" : "var(--muted)",
      }}
    >
      {isVideo ? <VideoIcon /> : <ImageIcon />}
      <p
        style={{
          margin: "8px 0 0",
          fontSize: compact ? "12px" : "13px",
          fontWeight: "500",
        }}
      >
        {label}
      </p>
    </div>
  );
}

function UrlInput({
  value,
  placeholder,
  onChange,
  onSubmit,
}: {
  value: string;
  placeholder: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
      <input
        type="url"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onSubmit}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        style={{
          flex: 1,
          padding: "8px 12px",
          borderRadius: "8px",
          border: "1px solid var(--border)",
          background: "var(--surface2)",
          fontSize: "13px",
          color: "var(--text)",
          outline: "none",
          fontFamily: "inherit",
        }}
        onFocus={(e) =>
          ((e.target as HTMLInputElement).style.borderColor = "var(--accent)")
        }
        onBlurCapture={(e) =>
          ((e.target as HTMLInputElement).style.borderColor = "var(--border)")
        }
      />
      <button
        onClick={onSubmit}
        style={{
          padding: "8px 14px",
          borderRadius: "8px",
          border: "none",
          background: "var(--accent)",
          color: "white",
          fontSize: "12px",
          fontWeight: "600",
          cursor: "pointer",
        }}
      >
        Načíst
      </button>
    </div>
  );
}

function ImageIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      style={{ margin: "0 auto", display: "block" }}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg
      width="26"
      height="26"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      style={{ margin: "0 auto", display: "block" }}
    >
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <polygon points="10,8 16,12 10,16" />
    </svg>
  );
}
