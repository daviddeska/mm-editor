@AGENTS.md

## Workflow pravidla

- **Před git commit**: Vždy spustit `npm run lint` s nulovou tolerancí warningů (`npm run lint -- --max-warnings 0`). Commit se nesmí provést, dokud lint neprochází bez chyb i warningů.
- **Po git push**: Vždy zkontrolovat, že se na serveru spustil deployment proces — ověřit přes `ssh standa@178.104.123.42 "tail -5 ~/deploy.log"` a `ssh standa@178.104.123.42 "pm2 status"`.

## Server

- Production server IP: `178.104.123.42` (Ubuntu Noble, Hetzner, root access via SSH)
- Doména: `webeditor.mirandamedia.cz` (HTTPS, Let's Encrypt SSL, auto-renew, expirace 2026-06-28)
- Nginx reverse proxy: HTTPS → app (port 3000), `/deploy` → webhook (port 9000), HTTP 301 → HTTPS
- Nginx: basic auth (`admin` / heslo v `/etc/nginx/.htpasswd`), webhook `/deploy` je bez auth
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
- Při uploadu souboru se soubor uloží lokálně do `public/uploads/` a současně se nahraje na Shoptet SFTP
- HTML export generuje URL přímo na Shoptet (`https://727188.myshoptet.com/user/documents/upload/webeditor/...`)

## Architektura editoru

- Next.js 16 (Turbopack), React 19, Tailwind CSS 4, Tiptap (rich text)
- Typy bloků: h2, h3, perex, text, media, media-2, media-3, media-text, button, spacer, divider
- Média: obrázek (soubor/URL), video (soubor), YouTube, Vimeo
- `MediaBlock` — výběr typu média, upload, náhled, alt text + záložka "Knihovna" (výběr z nahraných souborů ze Shoptet SFTP)
- `MediaLibrary` — grid existujících souborů načtených přes `/api/upload/list` (SFTP readdir), klik vybere soubor
- API `/api/upload` (POST) — validace typu/velikosti, uložení lokálně + SFTP upload na Shoptet
- API `/api/upload/list` (GET) — výpis souborů ze Shoptet SFTP s veřejnými URL
