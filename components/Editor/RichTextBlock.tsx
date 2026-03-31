"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";

interface RichTextBlockProps {
  content: string;
  onChange: (html: string) => void;
}

export default function RichTextBlock({
  content,
  onChange,
}: RichTextBlockProps) {
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTarget, setLinkTarget] = useState("_blank");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: "whenNotEditable",
        autolink: true,
        HTMLAttributes: {
          class: "tiptap-link",
        },
      }),
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const applyFormat = (command: () => void) => {
    command();
    editor.commands.focus();
  };

  const handleLinkToggle = () => {
    if (editor.isActive("link")) {
      applyFormat(() => editor.chain().unsetLink().run());
    } else {
      setLinkUrl("");
      setLinkTarget("_blank");
      setIsLinkModalOpen(true);
    }
  };

  const saveLink = () => {
    if (linkUrl) {
      applyFormat(() =>
        editor
          .chain()
          .extendMarkRange("link")
          .setLink({
            href: linkUrl,
            target: linkTarget,
            rel: linkTarget === "_blank" ? "noopener noreferrer" : "",
          })
          .run()
      );
    }
    setIsLinkModalOpen(false);
  };

  return (
    <div className="tiptap-wrapper">
      
      {/* TOOLBAR */}
      <div className="tiptap-toolbar">
        <button
          onClick={() => applyFormat(() => editor.chain().toggleBold().run())}
          className={editor.isActive("bold") ? "active" : ""}
          title="Tučné (Ctrl+B)"
        >
          <b>B</b>
        </button>

        <button
          onClick={() => applyFormat(() => editor.chain().toggleItalic().run())}
          className={editor.isActive("italic") ? "active" : ""}
          title="Kurzíva (Ctrl+I)"
        >
          <i>I</i>
        </button>

        <button
          onClick={() => applyFormat(() => editor.chain().toggleUnderline().run())}
          className={editor.isActive("underline") ? "active" : ""}
          title="Podtržení (Ctrl+U)"
        >
          <u>U</u>
        </button>

        <button
          onClick={handleLinkToggle}
          className={editor.isActive("link") ? "active" : ""}
          title={editor.isActive("link") ? "Odstranit odkaz" : "Přidat odkaz"}
        >
          {editor.isActive("link") ? "⛔ Odebrat odkaz" : "🔗 Odkaz"}
        </button>

        <button
          onClick={() => applyFormat(() => editor.chain().toggleHeading({ level: 2 }).run())}
          className={editor.isActive("heading", { level: 2 }) ? "active" : ""}
        >
          H2
        </button>

        <button
          onClick={() => applyFormat(() => editor.chain().toggleHeading({ level: 3 }).run())}
          className={editor.isActive("heading", { level: 3 }) ? "active" : ""}
        >
          H3
        </button>

        <button
          onClick={() => applyFormat(() => editor.chain().toggleBulletList().run())}
          className={editor.isActive("bulletList") ? "active" : ""}
        >
          • Seznam
        </button>

        <button
          onClick={() => applyFormat(() => editor.chain().toggleOrderedList().run())}
          className={editor.isActive("orderedList") ? "active" : ""}
        >
          1. Seznam
        </button>

        <button
          onClick={() => applyFormat(() => editor.chain().clearNodes().unsetAllMarks().run())}
          title="Odstranit veškeré formátování"
        >
          ✕ Čistý text
        </button>
      </div>

      {/* PLOCHA EDITORU — Ctrl/Cmd+click otevře odkaz */}
      <EditorContent
        editor={editor}
        onClick={(e: React.MouseEvent) => {
          const target = e.target as HTMLElement;
          const anchor = target.closest("a");
          if (anchor && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            window.open(anchor.href, "_blank", "noopener,noreferrer");
          }
        }}
      />

      {/* MODÁLNÍ OKNO PRO ODKAZ */}
      {isLinkModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Vložit odkaz</h3>

            <label style={{ display: "block", marginBottom: "10px" }}>
              URL adresa:
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                className="modal-input"
                autoFocus
              />
            </label>

            <label style={{ display: "block", marginBottom: "20px" }}>
              Otevřít odkaz:
              <select
                value={linkTarget}
                onChange={(e) => setLinkTarget(e.target.value)}
                className="modal-input"
              >
                <option value="_blank">V novém okně (_blank)</option>
                <option value="_self">Ve stejném okně (_self)</option>
              </select>
            </label>

            <div className="modal-actions">
              <button
                onClick={() => setIsLinkModalOpen(false)}
                className="modal-btn-cancel"
              >
                Zrušit
              </button>
              <button onClick={saveLink} className="modal-btn-save">
                Uložit odkaz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}