# MM Editor — Dokumentace projektu

> Blokový editor článků postavený na Next.js, React a TypeScript.
> Tento soubor se průběžně aktualizuje s každou novou částí projektu.

---

## Obsah
1. [Technologie](#technologie)
2. [Struktura projektu](#struktura-projektu)
3. [TypeScript základy](#typescript-základy)
4. [Soubory a komponenty](#soubory-a-komponenty)

---

## Technologie

| Technologie | Verze | Účel |
|---|---|---|
| Next.js | 15+ | Framework — routing, server, build |
| React | 19 | UI komponenty |
| TypeScript | 5+ | Typová bezpečnost JavaScriptu |
| Tailwind CSS | 3+ | Utility CSS třídy |
| Tiptap | 2+ | WYSIWYG textový editor (náhrada Quill.js) |

---

## Struktura projektu

```
mm-editor/
├── app/
│   ├── page.tsx          ← Hlavní stránka editoru
│   ├── layout.tsx        ← Globální layout (HTML obal)
│   └── globals.css       ← Globální styly + Tiptap styly
├── components/
│   └── Editor/
│       └── RichTextBlock.tsx   ← Formátovaný textový editor
├── types/
│   └── blocks.ts         ← TypeScript typy pro bloky
└── DOCS.md               ← Tato dokumentace
```

---

## TypeScript základy

Průběžný glosář pojmů které se v projektu vyskytují.

### `interface`
Definuje "tvar" objektu — jaké vlastnosti musí mít a jakého typu.
```typescript
interface Block {
  id: string;       // musí být text
  type: string;     // musí být text
  content: string;  // musí být text
}
```
Pokud předáš objekt bez povinné vlastnosti, TypeScript tě upozorní ještě před spuštěním aplikace.

### Základní typy
```typescript
string    // text:          "Ahoj světe"
number    // číslo:         42, 3.14
boolean   // pravda/lež:    true, false
void      // funkce nic nevrací
null      // záměrně prázdné
undefined // nenastavené
```

### `type` vs `interface`
```typescript
// interface — pro objekty, lze rozšiřovat
interface User { name: string; }

// type — pro cokoliv, včetně union typů
type BlockType = 'h2' | 'richtext' | 'img'; // jen tyto 3 hodnoty jsou povolené
```

### Props
Parametry které komponenta dostává zvenčí (jako HTML atributy).
```typescript
interface MyComponentProps {
  title: string;
  onClick: () => void;  // funkce bez parametrů, nic nevrací
}

export default function MyComponent({ title, onClick }: MyComponentProps) {
  return <button onClick={onClick}>{title}</button>;
}
```

### Hooks
Speciální React funkce začínající slovem `use`. Volají se vždy na nejvyšší úrovni komponenty.
```typescript
useState   // uchovává stav (data která se mění)
useEffect  // spustí kód při změně dat nebo při načtení komponenty
useEditor  // (Tiptap) inicializuje editor
```

---

## Soubory a komponenty

---

### `types/blocks.ts`
**Účel:** Centrální definice TypeScript typů pro celou aplikaci. Importuje se všude kde pracujeme s bloky.

```typescript
// Union type — BlockType může být pouze jedna z těchto hodnot
type BlockType = 'h2' | 'richtext' | 'img' | 'img-2' | 'img-3' | 'img-text';

// Interface pro jeden obrázek
interface ImageData {
  filename: string;   // název souboru na disku
  previewUrl: string; // dočasná URL pro náhled v prohlížeči (blob:// URL)
}

// Interface pro jeden blok v editoru
// Otazník (?) = vlastnost je volitelná, nemusí být přítomna
interface Block {
  id: string;
  type: BlockType;
  content: string;
  filename?: string;        // jen pro img a img-text bloky
  previewUrl?: string;      // jen pro img a img-text bloky
  images?: ImageData[];     // jen pro img-2 a img-3 bloky (pole obrázků)
  imagePosition?: 'left' | 'right'; // jen pro img-text blok
}
```

---

### `app/globals.css`
**Účel:** Globální CSS styly platné pro celou aplikaci. Obsahuje:
- Tailwind CSS direktivy (`@tailwind base/components/utilities`)
- CSS proměnné (barvy, rozměry) v `:root`
- Styly pro Tiptap editor (toolbar tlačítka, plocha editoru)

---

### `components/Editor/RichTextBlock.tsx`
**Účel:** Komponenta formátovaného textového editoru. Umožňuje tučné písmo, kurzívu, podtržení, nadpisy H2/H3 a seznamy. Podporuje vložení textu z MS Word (Ctrl+V).

**Props:**
| Prop | Typ | Popis |
|---|---|---|
| `content` | `string` | Aktuální HTML obsah editoru |
| `onChange` | `(html: string) => void` | Callback volaný při každé změně |

**Klíčové koncepty:**
- `useEditor` hook — inicializuje Tiptap instanci
- `editor.chain()` — řetězení příkazů formátování
- `editor.isActive()` — zjišťuje aktivní formátování (pro zvýraznění tlačítek)
- `"use client"` — Next.js direktiva, editor musí běžet v prohlížeči

**Použití:**
```tsx
<RichTextBlock
  content={block.content}
  onChange={(html) => updateBlock(block.id, html)}
/>
```
