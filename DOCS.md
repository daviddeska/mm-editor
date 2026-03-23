# MM Editor — Dokumentace projektu

> Blokový editor článků postavený na Next.js, React a TypeScript.
> Určen pro tvorbu HTML obsahu pro e-shop Shoptet.

---

## Obsah

1. [Technologie](#technologie)
2. [Struktura projektu](#struktura-projektu)
3. [Spuštění projektu](#spuštění-projektu)
4. [TypeScript základy](#typescript-základy)
5. [Soubory a komponenty](#soubory-a-komponenty)
6. [Jak přidat nový typ bloku](#jak-přidat-nový-typ-bloku)
7. [Generování HTML pro Shoptet](#generování-html-pro-shoptet)

---

## Technologie

| Technologie  | Verze  | Účel                                                        |
| ------------ | ------ | ----------------------------------------------------------- |
| Next.js      | 16.2   | Framework — routing, server, build                          |
| React        | 19     | UI komponenty                                               |
| TypeScript   | 5+     | Typová bezpečnost JavaScriptu                               |
| Tailwind CSS | 4      | Utility CSS třídy                                           |
| Tiptap       | 3      | WYSIWYG textový editor (v3 obsahuje Underline v StarterKit) |
| @dnd-kit     | latest | Drag & drop řazení bloků (nainstalováno, rozpracováno)      |

---

## Struktura projektu

```
mm-editor/
├── app/
│   ├── page.tsx          ← Hlavní stránka — řídí celý stav aplikace
│   ├── layout.tsx        ← Globální HTML obal, suppressHydrationWarning
│   └── globals.css       ← Globální styly, CSS proměnné, Tiptap styly
├── components/
│   ├── Sidebar.tsx       ← Levý panel s tlačítky pro přidání bloků
│   └── Editor/
│       ├── BlockWrapper.tsx    ← Obálka každého bloku (hover, drag & drop, kontroly)
│       ├── HeadingBlock.tsx    ← Blok hlavního nadpisu (textarea)
│       ├── RichTextBlock.tsx   ← Formátovaný text (Tiptap editor)
│       ├── ImageBlock.tsx      ← Obrázky (1, 2 nebo 3 sloupce)
│       └── ImageTextBlock.tsx  ← Kombinovaný blok obrázek + text
├── types/
│   └── blocks.ts         ← TypeScript typy sdílené napříč aplikací
├── DOCS.md               ← Tato dokumentace
└── package.json
```

---

## Spuštění projektu

```bash
# Instalace závislostí
npm install

# Vývojový server (localhost:3000)
npm run dev

# Build pro produkci
npm run build
npm start
```

### Řešení časté chyby — Tailwind nenachází soubory

Pokud se zobrazí `Can't resolve 'tailwindcss'`, zkontroluj `app/globals.css` — nesmí obsahovat `@source` direktivy s cestami mimo projekt. Správný začátek souboru:

```css
@import "tailwindcss";
/* bez @source direktiv */
```

---

## TypeScript základy

Průběžný glosář pojmů použitých v projektu.

### Základní typy

```typescript
string    // text:       "Ahoj světe"
number    // číslo:      42
boolean   // pravda/lež: true / false
void      // funkce nic nevrací
```

### `interface`

Definuje tvar objektu — jaké vlastnosti musí mít a jakého typu.

```typescript
interface Block {
  id: string; // povinné
  type: BlockType; // povinné
  filename?: string; // volitelné — otazník znamená "může chybět"
}
```

### Union type (`type`)

Hodnota může být pouze jedna z vyjmenovaných možností.

```typescript
type BlockType = "h2" | "richtext" | "img" | "img-2" | "img-3" | "img-text";
// BlockType může být POUZE jedna z těchto 6 hodnot — nic jiného TypeScript nedovolí
```

### Props

Parametry které komponenta dostává zvenčí (jako HTML atributy).

```typescript
interface MyProps {
  title: string;
  onClick: () => void; // funkce bez parametrů
  onChange: (val: string) => void; // funkce s parametrem
}
```

### Hooks

Speciální React funkce začínající `use`. Volají se vždy na nejvyšší úrovni komponenty.

```typescript
useState<T>(initialValue); // uchovává stav — T říká jakého typu
useRef<T>(initialValue); // přímá reference na DOM element
useEditor(options); // Tiptap — inicializuje editor
useSortable({ id }); // dnd-kit — přidá drag & drop chování
```

### Immutabilita stavu

V Reactu nikdy neměníme stav přímo — vždy vytváříme novou kopii.

```typescript
// ŠPATNĚ — React nedetekuje změnu
blocks[0].content = "nový text";

// SPRÁVNĚ — map vytvoří nové pole
setBlocks((prev) =>
  prev.map((b) => (b.id === id ? { ...b, content: "nový text" } : b)),
);
```

### Spread operátor (`...`)

Zkopíruje vlastnosti objektu nebo prvky pole.

```typescript
const updated = { ...block, content: "nový text" };
// = nový objekt se všemi vlastnostmi block + přepsaným content

const newBlocks = [...blocks, newBlock];
// = nové pole se všemi bloky + novým blokem na konci
```

---

## Soubory a komponenty

### `types/blocks.ts`

Centrální TypeScript typy sdílené napříč celou aplikací.

```typescript
type BlockType = "h2" | "richtext" | "img" | "img-2" | "img-3" | "img-text";

interface ImageData {
  filename: string; // název souboru na disku
  previewUrl: string; // dočasná blob:// URL pro náhled v prohlížeči
}

interface Block {
  id: string;
  type: BlockType;
  content: string;
  filename?: string; // jen img, img-text
  previewUrl?: string; // jen img, img-text
  images?: ImageData[]; // jen img-2, img-3
  imagePosition?: "left" | "right"; // jen img-text
}
```

---

### `app/globals.css`

Globální styly pro celou aplikaci.

**CSS proměnné** (definovány v `:root`):
| Proměnná | Hodnota | Použití |
|---|---|---|
| `--bg` | `#0a0a0f` | Pozadí celé aplikace |
| `--surface` | `#111118` | Povrch panelů, hlavičky |
| `--surface2` | `#16161f` | Sekundární povrch, inputy |
| `--border` | `#ffffff0f` | Jemné ohraničení |
| `--border2` | `#ffffff1a` | Výraznější ohraničení |
| `--text` | `#f4f4f8` | Hlavní text |
| `--muted` | `#6b6b8a` | Sekundární text, ikony |
| `--accent` | `#7c3aed` | Fialová — primární barva |
| `--accent2` | `#a855f7` | Světlejší fialová |
| `--gradient` | `135deg, #7c3aed → #db2777` | Fialovo-růžový gradient |
| `--glow` | `box-shadow fialová` | Záře pod editorem |

---

### `app/layout.tsx`

Globální HTML obal. Obsahuje `suppressHydrationWarning` na `<html>` i `<body>` — potlačuje varování způsobená browser extensions (password managery apod.).

---

### `app/page.tsx`

Hlavní komponenta — řídí celý stav aplikace.

**State (useState):**
| State | Typ | Popis |
|---|---|---|
| `blocks` | `Block[]` | Pole všech bloků v editoru |
| `activeId` | `string \| null` | ID bloku který se právě táhne (dnd) |
| `showModal` | `boolean` | Zobrazení export modalu |
| `generatedHtml` | `string` | Vygenerovaný HTML kód |
| `copied` | `boolean` | Stav tlačítka "Zkopírováno" |

**Klíčové funkce:**

```typescript
addBlock(type)              // Přidá nový blok na konec
removeBlock(index)          // Smaže blok podle indexu
moveBlock(index, dir)       // Přesune blok o -1 nebo +1 pozici
updateBlock(id, changes)    // Aktualizuje libovolné vlastnosti bloku
updateImage(id, i, ...)     // Aktualizuje obrázek v img-2/img-3 bloku
handleFileSelect(...)       // Zpracuje vybraný soubor, vytvoří blob:// URL
generateHTML()              // Projde bloky a sestaví HTML string pro Shoptet
processRichText(html)       // Přidá mm- CSS třídy do HTML z Tiptap editoru
```

---

### `components/Sidebar.tsx`

Levý panel s tlačítky pro přidání bloků.

Bloky jsou definovány jako pole konstant `BLOCKS` — přidání nového bloku = přidat jeden řádek do pole + implementovat komponentu.

SVG ikony jsou definovány jako mini React komponenty přímo v souboru.

**Props:**
| Prop | Typ | Popis |
|---|---|---|
| `onAddBlock` | `(type: BlockType) => void` | Callback při kliknutí na blok |

---

### `components/Editor/BlockWrapper.tsx`

Obálka každého bloku. Stará se o:

- Hover efekt (ohraničení, pozadí)
- Kontrolní lištu (zobrazí se při hoveru) s tlačítky přesun/smazat a drag handle
- Drag & drop integraci přes `useSortable` z `@dnd-kit/sortable`

**Důležité:** Hover stav je řešen přes React `useState` — nikoliv Tailwind `group`, které s Tailwind v4 nefunguje spolehlivě.

**Props:**
| Prop | Typ | Popis |
|---|---|---|
| `id` | `string` | Unikátní ID bloku (pro dnd-kit) |
| `children` | `ReactNode` | Obsah bloku |
| `onMoveUp/Down` | `() => void` | Přesun bloku |
| `onRemove` | `() => void` | Smazání bloku |
| `isFirst/Last` | `boolean` | Zakáže příslušné tlačítko přesunu |

---

### `components/Editor/HeadingBlock.tsx`

Jednoduchý `<textarea>` pro hlavní nadpis článku. Automaticky se přizpůsobuje výšce obsahu.

**Props:** `content: string`, `onChange: (value: string) => void`

---

### `components/Editor/RichTextBlock.tsx`

Tiptap WYSIWYG editor pro formátovaný text.

**Důležité poznámky:**

- Tiptap v3 — `StarterKit` již obsahuje `Underline`, neinstalovat samostatně
- `immediatelyRender: false` — nutné pro Next.js (SSR/CSR rozdíl)
- Podporuje vložení textu z MS Word přes `Ctrl+V`

**Toolbar tlačítka:** B, I, U, H2, H3, Seznam, 1. Seznam, Čistý text

**Props:** `content: string`, `onChange: (html: string) => void`

---

### `components/Editor/ImageBlock.tsx`

Univerzální blok pro 1, 2 nebo 3 obrázky.

Interně používá pomocnou komponentu `ImageSlot` pro jeden slot. Soubory se vybírají přes skrytý `<input type="file">` spouštěný přes `useRef`.

**Props:**
| Prop | Typ | Popis |
|---|---|---|
| `count` | `1 \| 2 \| 3` | Počet obrázků |
| `filename?` | `string` | Pro count=1 |
| `previewUrl?` | `string` | Pro count=1 |
| `onFileSelect?` | `(file: File) => void` | Pro count=1 |
| `images?` | `ImageData[]` | Pro count=2,3 |
| `onImageFileSelect?` | `(file: File, index: number) => void` | Pro count=2,3 |

---

### `components/Editor/ImageTextBlock.tsx`

Kombinovaný blok — obrázek vedle Tiptap editoru. Přepínač pozice obrázku vlevo/vpravo.

**Props:** kombinace `ImageBlock` + `RichTextBlock` props + `imagePosition` + `onPositionChange`

---

## Jak přidat nový typ bloku

1. **`types/blocks.ts`** — přidej nový typ do `BlockType` union:

```typescript
type BlockType = 'h2' | 'richtext' | 'img' | ... | 'muj-novy-blok';
```

2. **`components/Sidebar.tsx`** — přidej řádek do pole `BLOCKS`:

```typescript
{ type: "muj-novy-blok", label: "Můj blok", description: "Popis", Icon: Icons.Text },
```

3. **`components/Editor/`** — vytvoř novou komponentu `MujNovyBlock.tsx`

4. **`app/page.tsx`** — na dvou místech:
   - V `createBlock()` přidej případ pro nový typ
   - V JSX přidej `{block.type === "muj-novy-blok" && <MujNovyBlock ... />}`
   - V `generateHTML()` přidej HTML výstup pro nový typ

---

## Upload médií

### Aktuální stav (demo)

Soubory se nahrávají lokálně do `/public/uploads/` přes Next.js API Route.
URL v generovaném HTML: `/uploads/{filename}`

### Plán pro produkci

Při prvním spuštění aplikace uživatel vyplní:

- FTP host, port, uživatelské jméno, heslo
- Cílová složka na FTP (např. `/user/documents/upload/mmeditor/`)

Konfigurace se uloží do databáze (šifrovaně) a každý upload půjde přímo na FTP.
URL v generovaném HTML se přizpůsobí podle nastavené cesty.

### API Route pro upload

```
POST /api/upload
Content-Type: multipart/form-data

Vstup:  soubor (file)
Výstup: { url: "/uploads/nazev-souboru.jpg", filename: "nazev-souboru.jpg" }
```

Tlačítko "Exportovat HTML" projde všechny bloky a sestaví HTML string.

Funkce `processRichText()` automaticky přidá CSS třídy s prefixem `mm-` do HTML z Tiptap editoru — tyto třídy pak stylujete v Shoptetu.

**Přehled tříd:**
| Třída | Element |
|---|---|
| `mm-article-wrapper` | Obalový div celého článku |
| `mm-heading` | Nadpisy (h2, h3, h4) |
| `mm-main-heading` | Hlavní nadpis článku |
| `mm-text-block` | Obalový div textového bloku |
| `mm-paragraph` | Odstavce (`<p>`) |
| `mm-list` | Seznamy (`<ul>`, `<ol>`) |
| `mm-list-item` | Položky seznamu (`<li>`) |
| `mm-text-bold` | Tučný text (`<strong>`) |
| `mm-image-wrapper` | Obal jednoho obrázku |
| `mm-image-grid-2` | Obal dvou obrázků |
| `mm-image-grid-3` | Obal tří obrázků |
| `mm-image-item` | Jeden obrázek v gridu |
| `mm-image` | Samotný `<img>` tag |
| `mm-combined-block` | Obal bloku obrázek+text |
| `mm-combined-block.mm-reverse` | Obrázek vpravo |
| `mm-combined-image` | Část s obrázkem |
| `mm-combined-text` | Část s textem |

**Cesta k obrázkům:**

```
/user/documents/upload/mmeditor/{filename}
```

Obrázky je třeba nahrát do Shoptetu do složky `mmeditor` manuálně nebo přes budoucí backend.
