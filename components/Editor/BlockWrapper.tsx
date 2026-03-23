"use client";

import { ReactNode, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface BlockWrapperProps {
  id: string;
  children: ReactNode;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
  isFirst: boolean;
  isLast: boolean;
}

const DragHandle = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="9" cy="6" r="1.5" />
    <circle cx="15" cy="6" r="1.5" />
    <circle cx="9" cy="12" r="1.5" />
    <circle cx="15" cy="12" r="1.5" />
    <circle cx="9" cy="18" r="1.5" />
    <circle cx="15" cy="18" r="1.5" />
  </svg>
);
const ChevronUp = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="m18 15-6-6-6 6" />
  </svg>
);
const ChevronDown = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const Trash = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
  </svg>
);

interface CtrlBtnProps {
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  title: string;
  children: ReactNode;
}

function CtrlBtn({ onClick, disabled, danger, title, children }: CtrlBtnProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:
          hovered && !disabled
            ? danger
              ? "rgba(248,113,113,0.1)"
              : "var(--surface)"
            : "transparent",
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        padding: "5px 7px",
        borderRadius: "5px",
        color:
          hovered && !disabled
            ? danger
              ? "#f87171"
              : "var(--text)"
            : "var(--muted)",
        display: "flex",
        alignItems: "center",
        opacity: disabled ? 0.3 : 1,
        transition: "all 0.1s",
      }}
    >
      {children}
    </button>
  );
}

export default function BlockWrapper({
  id,
  children,
  onMoveUp,
  onMoveDown,
  onRemove,
  isFirst,
  isLast,
}: BlockWrapperProps) {
  // Lokální state pro hover — spolehlivější než Tailwind group v tomto setupu
  const [isHovered, setIsHovered] = useState(false);
  const [dragHandleHovered, setDragHandleHovered] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 1 : 1,
    position: "relative" as const,
    zIndex: isDragging ? 999 : ("auto" as const),
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        style={{
          padding: "12px",
          borderRadius: "12px",
          border: `1px solid ${isHovered ? "var(--border2)" : "var(--border)"}`,
          background: isHovered ? "var(--surface2)" : "var(--surface)",
          transition: "border-color 0.15s, background 0.15s",
          position: "relative",
          marginBottom: "8px",
        }}
      >
        {/* Kontrolní lišta — viditelná při hoveru */}
        {isHovered && (
          <div
            style={{
              position: "absolute",
              top: "-14px",
              right: "12px",
              display: "flex",
              alignItems: "center",
              gap: "1px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "2px 3px",
              zIndex: 10,
              boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
            }}
          >
            {/* Drag handle */}
            <div
              {...attributes}
              {...listeners}
              onMouseEnter={() => setDragHandleHovered(true)}
              onMouseLeave={() => setDragHandleHovered(false)}
              style={{
                padding: "5px 7px",
                borderRadius: "5px",
                cursor: "grab",
                color: dragHandleHovered ? "var(--text)" : "var(--muted)",
                display: "flex",
                alignItems: "center",
                background: dragHandleHovered
                  ? "var(--surface)"
                  : "transparent",
                transition: "all 0.1s",
                userSelect: "none",
                touchAction: "none", // Klíčové pro dnd-kit — vypne browser scroll při tažení
              }}
              title="Přetáhnout"
            >
              <DragHandle />
            </div>

            <div
              style={{
                width: "1px",
                height: "14px",
                background: "var(--border2)",
                margin: "0 2px",
              }}
            />

            <CtrlBtn onClick={onMoveUp} disabled={isFirst} title="Nahoru">
              <ChevronUp />
            </CtrlBtn>
            <CtrlBtn onClick={onMoveDown} disabled={isLast} title="Dolů">
              <ChevronDown />
            </CtrlBtn>

            <div
              style={{
                width: "1px",
                height: "14px",
                background: "var(--border2)",
                margin: "0 2px",
              }}
            />

            <CtrlBtn onClick={onRemove} title="Smazat" danger>
              <Trash />
            </CtrlBtn>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
