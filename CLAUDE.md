@AGENTS.md

## Workflow pravidla

- **Před git commit**: Vždy spustit `npm run lint` s nulovou tolerancí warningů (`npm run lint -- --max-warnings 0`). Commit se nesmí provést, dokud lint neprochází bez chyb i warningů.
- **ZÁKAZ automatického deploye**: Nikdy nepushovat přímo na `main` ani nespouštět deploy bez výslovného pokynu uživatele. Změny se commitují lokálně, uživatel je kontroluje a sám pushne do `main`, čímž se spustí deploy přes webhook.
- **Po git push na main** (provádí uživatel): Zkontrolovat, že se na serveru spustil deployment proces — ověřit přes `ssh standa@178.104.123.42 "tail -5 ~/deploy.log"` a `ssh standa@178.104.123.42 "pm2 status"`.

## Server

- Production server IP: `178.104.123.42` (Ubuntu Noble, Hetzner, root access via SSH)
- Doména: `webeditor.mirandamedia.cz` (HTTPS, Let's Encrypt SSL, auto-renew, expirace 2026-06-28)
- Nginx reverse proxy: HTTPS → app (port 3000), `/deploy` → webhook (port 9000), HTTP 301 → HTTPS
- Nginx: basic auth (`vpodlahy` / heslo v `/etc/nginx/.htpasswd`), webhook `/deploy` je bez auth
- App user: `standa`, app directory: `/home/standa/mm-editor`
- Process manager: PM2 (pm2-logrotate: max 10MB, retain 7, compress)
- PM2 services: `mm-editor` (Next.js app, port 3000), `webhook` (autodeploy listener, port 9000)
- PM2 konfigurace: `/home/standa/ecosystem.config.js`
- Deploy se provádí přes webhook, který volá autodeployment na serveru (`POST https://webeditor.mirandamedia.cz/deploy`)
- Webhook při přijetí requestu spustí `~/deploy.sh` (git pull, npm install, build, pm2 restart)
- GitHub webhook URL: `https://webeditor.mirandamedia.cz/deploy` (content type: `application/json`, event: push)
- Webhook secret: ověřuje HMAC SHA-256 signature z GitHub hlavičky `x-hub-signature-256`
- Bezpečnost: UFW (porty 22/80/443), fail2ban (nftables, IP whitelist 213.29.254.105), SSH key-only, sysctl hardening

## Shoptet SFTP (upload médií)

- Host: `ftp.myshoptet.com`, port 22, uživatel: `uploader_727188`
- Vzdálená složka: `/upload/webeditor`
- Veřejná URL souborů: `https://727188.myshoptet.com/user/documents/upload/webeditor/{filename}`
- SFTP se volá přes `sshpass` + `sftp` příkaz (lib/sftp.ts), ne přes ssh2 knihovnu (nekompatibilní s Turbopack)
- Server musí mít nainstalovaný balíček `sshpass`
- SFTP batch příkazy musí mít cesty v uvozovkách kvůli mezerám v názvech souborů (`put "src" "dst"`, `rm "path"`)
- Při uploadu souboru se soubor uloží lokálně do `public/uploads/` a současně se nahraje na Shoptet SFTP
- HTML export generuje URL přímo na Shoptet (`https://727188.myshoptet.com/user/documents/upload/webeditor/...`)
- Názvy souborů v URL se enkódují přes `encodeURIComponent()` (kvůli mezerám a speciálním znakům)

## Architektura editoru

- Next.js 16 (Turbopack), React 19, Tailwind CSS 4, Tiptap (rich text) + extensions: Link, Underline
- Typy bloků: h2 (s volbou H2–H5), richtext, media, media-2, media-3, media-text
- Nadpisový blok má přepínač úrovně (H2/H3/H4/H5), export generuje odpovídající tag (`<h2>`–`<h5>`)
- RichText blok: formátování (B, I, U), nadpisy (H2, H3), seznamy, odkazy (přidat/upravit/odebrat)
- Odkazy v editoru: modré podtržení + pozadí, modální okno pro URL a target, Ctrl/Cmd+click otevře odkaz
- Média: obrázek (soubor/URL), video (soubor), YouTube, Vimeo
- **Úvodní text** — fixní blok na první pozici, nelze přesunout/smazat, export jako `<p class="post-description">plain text</p>` mimo wrapper, nesmí být prázdný (jinak export odmítne generovat)
- `MediaBlock` — výběr typu média, upload, náhled, alt text + záložka "Knihovna" (výběr z nahraných souborů ze Shoptet SFTP)
- `MediaLibrary` — grid existujících souborů načtených přes `/api/upload/list` (SFTP readdir), klik vybere soubor
- **Import HTML** — tlačítko "Importovat HTML" parsuje mm-* třídy zpět do editor bloků (lib/htmlImport.ts)
- **Onboarding** — úvodní průvodce po prvním přihlášení (components/Onboarding.tsx), localStorage klíč `mm-editor-onboarding-dismissed`
- API `/api/upload` (POST) — validace typu/velikosti, uložení lokálně + SFTP upload na Shoptet (vždy uploaduje, i když soubor lokálně existuje)
- API `/api/upload/list` (GET) — výpis souborů ze Shoptet SFTP s veřejnými URL
- API `/api/upload/delete` (POST) — smazání souboru ze Shoptet SFTP (validace názvu, ochrana proti path traversal)
- `MediaLibrary` umožňuje mazání souborů (červený křížek při hoveru, confirm dialog)
- Tlačítko "Odebrat" u nahraného média resetuje blok do výchozího stavu (nesmaže soubor z SFTP)
- Záložky "Popis produktu" a "Banner" jsou skryté (jen "Článek" je aktivní)

## HTML struktura exportu

```html
<p class="post-description">Úvodní text...</p>
<div class="mm-article-wrapper">
  <h2 class="mm-heading mm-main-heading">...</h2>
  <div class="mm-text-block">...</div>
  <div class="mm-media-wrapper"><img class="mm-image" ...></div>
  <div class="mm-media-grid-2">...</div>
  <div class="mm-media-grid-3">...</div>
  <div class="mm-media-text">...</div>
</div>
```
