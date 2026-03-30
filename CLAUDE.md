@AGENTS.md

## Workflow pravidla

- **Před git commit**: Vždy spustit `npm run lint` s nulovou tolerancí warningů (`npm run lint -- --max-warnings 0`). Commit se nesmí provést, dokud lint neprochází bez chyb i warningů.
- **Po git push**: Vždy zkontrolovat, že se na serveru spustil deployment proces — ověřit přes `ssh standa@178.104.123.42 "tail -5 ~/deploy.log"` a `ssh standa@178.104.123.42 "pm2 status"`.

## Server

- Production server IP: `178.104.123.42` (Ubuntu Noble, Hetzner, root access via SSH)
- Doména: `webeditor.mirandamedia.cz` (HTTPS, Let's Encrypt SSL, auto-renew, expirace 2026-06-28)
- Nginx reverse proxy: HTTPS → app (port 3000), `/deploy` → webhook (port 9000), HTTP 301 → HTTPS
- App user: `standa`, app directory: `/home/standa/mm-editor`
- Process manager: PM2 (pm2-logrotate: max 10MB, retain 7, compress)
- PM2 services: `mm-editor` (Next.js app, port 3000), `webhook` (autodeploy listener, port 9000)
- Deploy se provádí přes webhook, který volá autodeployment na serveru (`POST https://webeditor.mirandamedia.cz/deploy`)
- Webhook při přijetí requestu spustí `~/deploy.sh` (git pull, npm install, build, pm2 restart)
- GitHub webhook URL: `https://webeditor.mirandamedia.cz/deploy` (content type: `application/json`, event: push)
