/**
 * RichTextBlock.tsx
 * -----------------
 * Blok pro formátovaný text (tučné písmo, seznamy, nadpisy...).
 * Používá knihovnu Tiptap, která je modernější náhrada za Quill.js.
 *
 * TypeScript lekce:
 * - `interface` = definuje "tvar" objektu, tj. jaké vlastnosti musí mít
 * - `string` = textový typ
 * - `void` = funkce nic nevrací
 * - Props = parametry které komponenta dostává zvenčí (jako atributy v HTML)
 */

"use client"; // Next.js direktiva — říká že tato komponenta běží v prohlížeči, ne na serveru

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// --- TYPY (TypeScript) ---
// Definujeme co tato komponenta očekává jako vstup (Props)
interface RichTextBlockProps {
  content: string; // Aktuální HTML obsah editoru
  onChange: (html: string) => void; // Funkce volaná při každé změně textu
}

// --- KOMPONENTA ---
// React komponenta je funkce která vrací JSX (HTML-like syntaxi)
// Destrukturujeme props přímo v parametrech: { content, onChange }
export default function RichTextBlock({
  content,
  onChange,
}: RichTextBlockProps) {
  // useEditor = tzv. "hook" — spouští Tiptap editor a vrací jeho instanci
  // Hooks vždy začínají slovem "use" a volají se pouze uvnitř komponent
  const editor = useEditor({
    extensions: [
      StarterKit, // Základní sada: tučné, kurzíva, seznamy, nadpisy...
    ],
    content: content, // Počáteční obsah (HTML string)
    immediatelyRender: false, // Oprava pro Next.js (server vs. klient rendering)

    // onUpdate se zavolá pokaždé, když uživatel něco napíše nebo změní
    onUpdate: ({ editor }) => {
      // getHTML() vrátí aktuální obsah editoru jako HTML string
      // Posíláme ho "nahoru" do rodičovské komponenty přes onChange callback
      onChange(editor.getHTML());
    },
  });

  // Pokud editor ještě není inicializovaný, nic nevykreslujeme
  if (!editor) return null;

  // Pomocná funkce pro tlačítka v toolbaru
  // Zkracuje opakující se kód — místo psaní celého příkazu stačí zavolat applyFormat(...)
  const applyFormat = (command: () => void) => {
    command();
    editor.commands.focus(); // Po kliknutí na tlačítko vrátíme focus zpět do editoru
  };

  return (
    <div className="tiptap-wrapper">
      {/* TOOLBAR — řada tlačítek pro formátování */}
      <div className="tiptap-toolbar">
        {/* Tučné písmo */}
        <button
          onClick={() => applyFormat(() => editor.chain().toggleBold().run())}
          // Pokud je aktivní tučné písmo, přidáme CSS třídu "active" (modrý styl)
          className={editor.isActive("bold") ? "active" : ""}
          title="Tučné (Ctrl+B)"
        >
          <b>B</b>
        </button>

        {/* Kurzíva */}
        <button
          onClick={() => applyFormat(() => editor.chain().toggleItalic().run())}
          className={editor.isActive("italic") ? "active" : ""}
          title="Kurzíva (Ctrl+I)"
        >
          <i>I</i>
        </button>

        {/* Podtržení */}
        <button
          onClick={() =>
            applyFormat(() => editor.chain().toggleUnderline().run())
          }
          className={editor.isActive("underline") ? "active" : ""}
          title="Podtržení (Ctrl+U)"
        >
          <u>U</u>
        </button>
        {/* Odkaz */}
        <button
          onClick={() => {
            const url = window.prompt("Vložte URL odkazu:");
            if (url) {
              applyFormat(() =>
                editor
                  .chain()
                  .extendMarkRange("link")
                  .setLink({
                    href: url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                  })
                  .run(),
              );
            }
          }}
          className={editor.isActive("link") ? "active" : ""}
          title="Vložit odkaz"
        >
          🔗 Odkaz
        </button>
        {/* Odstranit odkaz */}
        <button
          onClick={() => applyFormat(() => editor.chain().unsetLink().run())}
          className={
            editor.isActive("link") ? "active remove-link" : "remove-link"
          }
          title="Odstranit odkaz"
        >
          ⛔ Odebrat odkaz
        </button>
        {/* Nadpis H2 */}
        <button
          onClick={() =>
            applyFormat(() => editor.chain().toggleHeading({ level: 2 }).run())
          }
          className={editor.isActive("heading", { level: 2 }) ? "active" : ""}
        >
          H2
        </button>

        {/* Nadpis H3 */}
        <button
          onClick={() =>
            applyFormat(() => editor.chain().toggleHeading({ level: 3 }).run())
          }
          className={editor.isActive("heading", { level: 3 }) ? "active" : ""}
        >
          H3
        </button>

        {/* Odrážkový seznam */}
        <button
          onClick={() =>
            applyFormat(() => editor.chain().toggleBulletList().run())
          }
          className={editor.isActive("bulletList") ? "active" : ""}
        >
          • Seznam
        </button>

        {/* Číslovaný seznam */}
        <button
          onClick={() =>
            applyFormat(() => editor.chain().toggleOrderedList().run())
          }
          className={editor.isActive("orderedList") ? "active" : ""}
        >
          1. Seznam
        </button>

        {/* Odstranit formátování */}
        <button
          onClick={() =>
            applyFormat(() => editor.chain().clearNodes().unsetAllMarks().run())
          }
          title="Odstranit veškeré formátování"
        >
          ✕ Čistý text
        </button>
      </div>

      {/* Samotná plocha editoru — Tiptap si ji vyplní sám */}
      <EditorContent editor={editor} />
    </div>
  );
}
