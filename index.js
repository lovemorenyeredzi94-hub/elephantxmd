// index.js — Malvin C XMD entry point
// Powered by Handsome Tech
//
// Deploy this whole project on RENDER (Web Service). It runs an Express
// server that exposes a pairing API, keeps the Baileys socket alive, and
// can hand out a portable "session ID" once paired.
//
// The pairing WEBSITE (public/index.html) is deployed separately on
// VERCEL — it calls this server's /api/pair, /api/status and /api/session
// endpoints over the network.
//
// Two ways to get this bot running:
//  1) Pair directly here: open the website, enter your number, the bot
//     connects and stays running on THIS server.
//  2) Pair once to get a session ID, then deploy this exact project to
//     Render, Katabump, or Railway with the SESSION_ID env var set — it
//     boots already connected, no pairing step needed on that deployment.

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const config = require('./config');
const { startSocket, getStatus, isReady, getSessionId } = require('./lib/whatsapp');

const app = express();
app.use(cors()); // allow the Vercel-hosted pairing page to call this API
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let pairingInProgress = false;

app.get('/', (req, res) => {
    res.json({
        bot: config.BOT_NAME,
        poweredBy: config.POWERED_BY,
        status: getStatus(),
        message: 'ELEPHANT-X MD backend is running. Use POST /api/pair to link a number.'
    });
});

app.get('/api/status', (req, res) => {
    res.json({ status: getStatus(), connected: isReady() });
});

// Returns the portable session ID once the bot has paired successfully.
// Copy this and set it as SESSION_ID when deploying elsewhere.
app.get('/api/session', (req, res) => {
    const sessionId = getSessionId();
    if (!sessionId) {
        return res.status(404).json({ success: false, message: 'No active session yet — pair first.' });
    }
    res.json({ success: true, sessionId });
});

// Body: { "number": "263771234567" }
app.post('/api/pair', async (req, res) => {
    try {
        if (isReady()) {
            return res.json({ success: true, alreadyConnected: true, sessionId: getSessionId(), message: 'Bot is already connected.' });
        }
        if (pairingInProgress) {
            return res.status(429).json({ success: false, message: 'A pairing request is already in progress, please wait.' });
        }

        const { number } = req.body;
        if (!number || !/^[0-9]{10,15}$/.test(number.replace(/[^0-9]/g, ''))) {
            return res.status(400).json({ success: false, message: 'Send a valid number in international format, e.g. 263771234567 (no + or spaces).' });
        }

        pairingInProgress = true;
        const code = await startSocket(number);
        pairingInProgress = false;

        if (!code) {
            return res.status(500).json({ success: false, message: 'Could not generate a pairing code. The session may already exist — delete the session folder on the server and try again.' });
        }

        res.json({ success: true, code });
    } catch (err) {
        pairingInProgress = false;
        console.error('Pairing error:', err);
        res.status(500).json({ success: false, message: err.message || 'Pairing failed.' });
    }
});

app.listen(config.PORT, () => {
    console.log(`🇿🇼 ${config.BOT_NAME} — ${config.POWERED_BY}`);
    console.log(`🚀 Server listening on port ${config.PORT}`);
    console.log(`📲 Open the pairing page and enter your WhatsApp number to link the bot.`);
});

// Auto-reconnect on boot if a session already exists on disk, OR if a
// SESSION_ID env var was provided (Render/Katabump/Railway deployments).
const hasLocalSession = fs.existsSync(config.SESSION_DIR) && fs.readdirSync(config.SESSION_DIR).length > 0;
if (hasLocalSession || config.SESSION_ID) {
    startSocket().catch(err => console.error('Auto-reconnect failed:', err.message));
}
