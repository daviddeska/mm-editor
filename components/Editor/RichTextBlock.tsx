"use client";

import { useState, useCallback, useEffect } from "react";
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
        openOnClick: false,
        autolink: false,
        linkOnPaste: true,
      }),
    ],
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      handleDOMEvents: {
        click(_view, event) {
          const target = event.target as HTMLElement;
          const anchor = target.closest("a");
          if (anchor && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            window.open(anchor.href, "_blank", "noopener,noreferrer");
            return true;
          }
          return false;
        },
      },
    },
  });

  // Force re-render při změně selekce (pro aktualizaci toolbar stavu)
  const [, setSelTick] = useState(0);
  const bumpSel = useCallback(() => setSelTick((t) => t + 1), []);

  // Ctrl/Cmd detekce — přidá/odebere .mod-key-held třídu na ProseMirror element
  useEffect(() => {
    const el = editor?.view?.dom;
    if (!el) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) el.classList.add("mod-key-held");
    };
    const onKeyUp = () => el.classList.remove("mod-key-held");
    const onBlur = () => el.classList.remove("mod-key-held");
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [editor]);

  if (!editor) return null;

  const isLink = editor.isActive("link");
  const hasSelection = !editor.state.selection.empty;

  const openLinkModal = () => {
    if (!hasSelection) {
      alert("Nejdříve označte text, na který chcete přidat odkaz.");
      return;
    }
    // Pokud je na vybraném textu už odkaz, předvyplnit URL
    if (isLink) {
      const attrs = editor.getAttributes("link");
      setLinkUrl(attrs.href || "");
      setLinkTarget(attrs.target || "_blank");
    } else {
      setLinkUrl("");
      setLinkTarget("_blank");
    }
    setIsLinkModalOpen(true);
  };

  const removeLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
  };

  const saveLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .setLink({
          href: linkUrl,
          target: linkTarget,
          rel: linkTarget === "_blank" ? "noopener noreferrer" : "",
        })
        .run();
    }
    setIsLinkModalOpen(false);
  };

  const applyFormat = (command: () => void) => {
    command();
    editor.commands.focus();
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
          onClick={() =>
            applyFormat(() => editor.chain().toggleItalic().run())
          }
          className={editor.isActive("italic") ? "active" : ""}
          title="Kurzíva (Ctrl+I)"
        >
          <i>I</i>
        </button>

        <button
          onClick={() =>
            applyFormat(() => editor.chain().toggleUnderline().run())
          }
          className={editor.isActive("underline") ? "active" : ""}
          title="Podtržení (Ctrl+U)"
        >
          <u>U</u>
        </button>

        {/* Odkaz — přidat */}
        <button
          onClick={openLinkModal}
          className={isLink ? "active" : ""}
          title="Přidat / upravit odkaz"
        >
          🔗 Odkaz
        </button>

        {/* Odkaz — odebrat (viditelný jen když je kurzor na odkazu) */}
        {isLink && (
          <button
            onClick={removeLink}
            title="Odebrat odkaz"
            style={{ color: "#ef4444" }}
          >
            ✕ Zrušit odkaz
          </button>
        )}

        <button
          onClick={() =>
            applyFormat(() =>
              editor.chain().toggleHeading({ level: 2 }).run()
            )
          }
          className={editor.isActive("heading", { level: 2 }) ? "active" : ""}
        >
          H2
        </button>

        <button
          onClick={() =>
            applyFormat(() =>
              editor.chain().toggleHeading({ level: 3 }).run()
            )
          }
          className={editor.isActive("heading", { level: 3 }) ? "active" : ""}
        >
          H3
        </button>

        <button
          onClick={() =>
            applyFormat(() => editor.chain().toggleBulletList().run())
          }
          className={editor.isActive("bulletList") ? "active" : ""}
        >
          • Seznam
        </button>

        <button
          onClick={() =>
            applyFormat(() => editor.chain().toggleOrderedList().run())
          }
          className={editor.isActive("orderedList") ? "active" : ""}
        >
          1. Seznam
        </button>

        <button
          onClick={() =>
            applyFormat(() =>
              editor.chain().clearNodes().unsetAllMarks().run()
            )
          }
          title="Odstranit veškeré formátování"
        >
          ✕ Čistý text
        </button>
      </div>

      {/* PLOCHA EDITORU */}
      <div onMouseUp={bumpSel} onKeyUp={bumpSel}>
        <EditorContent editor={editor} />
      </div>

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
                onKeyDown={(e) => e.key === "Enter" && saveLink()}
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
