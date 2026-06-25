# Malvin C XMD

A WhatsApp Multi-Device bot built on [Baileys](https://github.com/WhiskeySockets/Baileys), pairing-code based (no QR scanning needed), with 100 working commands across general, fun, anime/reactions, group admin, owner, converter, downloader, and AI categories.

**Powered by Handsome Tech 🇿🇼**

---

## How it works

Pairing happens **once**, on a generator backend, and produces a portable **session ID** (format `Malvin-C-XMD~xxxxxxxx...`). You then deploy this same project to whichever platform you like — Render, Katabump, or Railway — and paste that session ID in as an environment variable. The bot boots already connected, no QR scan or pairing code needed on that deployment.

| Step | What | Where |
|---|---|---|
| 1. Generate a session ID | Open the pairing website, enter your number, link it in WhatsApp | **Vercel** (website) + **Render** (the only platform that can hold the live connection open long enough to pair) |
| 2. Deploy the actual bot | Paste the session ID as `SESSION_ID`, deploy | **Render**, **Katabump**, or **Railway** — your choice |

You can reuse the same session ID across multiple deployments, or generate a fresh one any time by pairing again.

**Why Vercel can't do step 1 by itself:** Baileys needs a constant live connection to WhatsApp's servers while it captures your session credentials. Vercel kills serverless functions after each request, so it can't hold that connection open — that's why the pairing website (hosted on Vercel) talks to a small backend on Render to actually do the pairing.

---

## 🚀 Step 1: Generate your session ID

### Deploy the pairing backend to Render
1. Push this project to GitHub
2. [render.com](https://render.com) → **New → Web Service** → connect your repo
3. Render should auto-detect `render.yaml`. If not, set manually:
   - **Build command:** `npm install`
   - **Start command:** `npm start`
4. Add environment variables: `OWNER_NUMBER`, `OWNER_NAME` (GEMINI_API_KEY and SESSION_ID can stay blank for now)
5. Deploy, then copy your Render URL, e.g. `https://malvin-c-xmd.onrender.com`

### Deploy the pairing website to Vercel
1. Open `public/index.html`, edit:
   ```js
   const API_BASE_URL = 'https://YOUR-RENDER-APP-NAME.onrender.com';
   ```
2. Commit and push
3. [vercel.com](https://vercel.com) → **New Project** → import the same repo. `vercel.json` makes it serve only `public/` automatically.
4. Deploy — you'll get a URL like `https://malvin-c-xmd.vercel.app`

### Pair
1. Open your Vercel pairing page
2. Type your number in international format, no `+`, no spaces — e.g. `263771234567`
3. Tap **Generate Pairing Code**
4. On your phone: **WhatsApp → Settings → Linked Devices → Link a Device → Link with phone number instead**, enter the code
5. The page automatically detects the connection and shows your **Session ID** — copy it (and save it somewhere safe — anyone with this string can access your WhatsApp through the bot)

---

## 🚀 Step 2: Deploy the actual bot using your session ID

Use the **same project code** on whichever platform you prefer. You don't need the Vercel/Render pairing setup again — just this one variable.

### Option A — Render
Same steps as above, but this time set `SESSION_ID` to the string you copied. It connects on boot, no pairing call needed.

### Option B — Railway
1. [railway.app](https://railway.app) → **New Project → Deploy from GitHub repo**
2. Railway auto-detects Node.js and runs `npm start`
3. Add `SESSION_ID` (and `OWNER_NUMBER`, `OWNER_NAME`) under **Variables**
4. Deploy

### Option C — Katabump (or any Pterodactyl-based panel)
Katabump runs on Pterodactyl under the hood, so:
1. Create a server using a **Node.js egg** (e.g. github.com/MyDapitt/ptero-egg or github.com/MFHaZe/Pterodactyl-Nodejs-egg if your panel doesn't already have one)
2. Upload this project's files (or pull from your GitHub repo if the egg supports it)
3. Set `SESSION_ID`, `OWNER_NUMBER`, `OWNER_NAME` in the **Startup/Variables** tab
4. Startup command: `npm install && npm start` (or just `npm start` if the egg installs dependencies automatically)
5. Start the server

---

## 🧩 Commands (100 total)

Type `.menu` in WhatsApp to see the live, categorized list. Categories:

- **General (6):** ping, alive, menu, owner, runtime, report
- **Fun (15):** joke, quote, fact, truth, dare, compliment, roast, 8ball, flirt, riddle, wouldurather, advice, ship, simp, meme
- **Anime & Reactions (31):** waifu, neko, hug, kiss, pat, slap, dance, and more — powered by waifu.pics
- **Group Admin (14):** kick, add, promote, demote, mute, unmute, tagall, hidetag, welcome, antilink, setdesc, setname, grouplink, revoke
- **Owner (9):** broadcast, ban, unban, mode, setpp, setbio, block, unblock, stats
- **Converter (6):** sticker, toimg, togif, tomp3, take, vv
- **Downloader (5):** play, song, video, tiktok, lyrics
- **AI (2):** ask, chatbot
- **Tools (12):** calc, translate, weather, shorturl, qr, define, currency, time, base64, color, poll, reverse

### Adding more commands
Drop a new `.js` file into the matching `commands/<category>/` folder:
```js
module.exports = {
    name: 'mycommand',
    category: 'tools',
    description: 'What it does',
    execute: async (sock, msg, args, { jid, prefix, config }) => {
        await sock.sendMessage(jid, { text: 'Hello!' }, { quoted: msg });
    }
};
```
It's picked up automatically on the next restart.

---

## API reference (pairing backend)

- `GET /api/status` → `{ status, connected }`
- `POST /api/pair` with `{ "number": "263771234567" }` → `{ success, code }`
- `GET /api/session` → `{ success, sessionId }` once connected

---

## 🛠️ Local testing (optional)

```bash
npm install
cp .env.example .env   # fill in your values
npm start
```
Open `http://localhost:3000`, point the pairing page's `API_BASE_URL` at `http://localhost:3000` to test pairing locally.

---

## Honest notes

- **Keep your session ID private.** It's equivalent to your linked-device credentials — anyone who has it can send/receive messages as your bot.
- **Downloader commands** (`.play`, `.song`, `.video`) rely on YouTube extraction libraries that occasionally break when YouTube changes something. If they stop working, check for an update to `@distube/ytdl-core`.
- **`.tiktok`** relies on the third-party tikwm.com service — if TikTok changes their API it may need a replacement.
- **AI commands** (`.ask`, `.chatbot`) need a free `GEMINI_API_KEY`. Without it, they politely say so instead of crashing.
- Free tiers on Render/Railway/Katabump can sleep or restart when idle. The bot reconnects automatically using its saved session, but a paid tier (or uptime pinger) keeps it online without gaps.

---

🇿🇼 Built by **Handsome Tech**
