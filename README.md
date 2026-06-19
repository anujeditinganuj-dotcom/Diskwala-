# TeraBox + DiskWala API v7.0

## Deploy Steps

1. Node.js install karo (https://nodejs.org)
2. Is folder mein terminal kholo
3. Run karo:
   ```
   npm install
   npx wrangler login
   npx wrangler deploy
   ```

## Usage
```
GET /api?url=https://www.diskwala.com/app/HEXID
GET /api?url=https://terabox.app/s/XXXXX
```

## Files
- worker.js — Main worker
- appicrypt_sdk.js — Diskwala security SDK
- appicrypt-web-f-0_1_216-bg.wasm — WASM binary
- wrangler.toml — Cloudflare config
