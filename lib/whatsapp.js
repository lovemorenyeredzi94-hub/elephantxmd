// lib/whatsapp.js — the heart of the bot: connects to WhatsApp via Baileys,
// requests pairing codes on demand, and routes incoming messages to commands.

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    Browsers,
    fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const fs = require('fs');
const path = require('path');

const config = require('../config');
const { loadCommands } = require('./commandLoader');
const { getMessageText, reply } = require('./helpers');
const { encodeSession, decodeSession } = require('./session');

const logger = pino({ level: 'silent' });
const commands = loadCommands();

let sock = null;
let connectionStatus = 'disconnected'; // disconnected | connecting | pairing | connected
let lastSessionId = null;

// In-memory toggle for the .chatbot command (per-chat)
const chatbotEnabledChats = new Set();

function getStatus() {
    return connectionStatus;
}

function isReady() {
    return connectionStatus === 'connected';
}

function getSessionId() {
    return lastSessionId;
}

// If a Malvin-C-XMD~ session string is available (env var SESSION_ID) and no
// local session exists yet, write it into SESSION_DIR so the bot boots
// already paired — used when deploying straight to Render/Katabump/Railway
// with a session ID generated earlier from the pairing website.
function restoreSessionFromEnv() {
    const credsPath = path.join(config.SESSION_DIR, 'creds.json');
    if (fs.existsSync(credsPath)) return false; // already have a session, don't overwrite
    if (!config.SESSION_ID) return false;

    try {
        const creds = decodeSession(config.SESSION_ID);
        fs.mkdirSync(config.SESSION_DIR, { recursive: true });
        fs.writeFileSync(credsPath, JSON.stringify(creds, null, 2));
        console.log('✅ Restored session from SESSION_ID env var.');
        return true;
    } catch (err) {
        console.error('❌ Invalid SESSION_ID:', err.message);
        return false;
    }
}

// Starts (or restarts) the WhatsApp socket. If phoneNumber is provided and
// the session isn't registered yet, a pairing code is requested and resolved
// back through the returned promise.
async function startSocket(phoneNumber) {
    // Close any previous socket cleanly before starting a new one (re-pairing)
    if (sock) {
        try { sock.ev.removeAllListeners(); sock.end(undefined); } catch (_) {}
        sock = null;
    }

    if (!fs.existsSync(config.SESSION_DIR)) {
        fs.mkdirSync(config.SESSION_DIR, { recursive: true });
    }
    restoreSessionFromEnv();

    const { state, saveCreds } = await useMultiFileAuthState(config.SESSION_DIR);
    const { version } = await fetchLatestBaileysVersion();

    connectionStatus = 'connecting';

    sock = makeWASocket({
        version,
        auth: state,
        printQRInTerminal: false,
        logger,
        browser: Browsers.ubuntu('Chrome'),
        markOnlineOnConnect: true,
        syncFullHistory: false
    });

    let pairingCodePromise = null;

    if (phoneNumber && !sock.authState.creds.registered) {
        connectionStatus = 'pairing';
        const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
        pairingCodePromise = (async () => {
            // Baileys needs a brief moment after socket creation before
            // requesting a pairing code, otherwise it can throw.
            await new Promise(r => setTimeout(r, 2500));
            const code = await sock.requestPairingCode(cleanNumber);
            return code.match(/.{1,4}/g)?.join('-') || code;
        })();
    }

    sock.ev.on('creds.update', async () => {
        await saveCreds();
        try {
            lastSessionId = encodeSession(sock.authState.creds);
        } catch (_) {}
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update;

        if (connection === 'open') {
            connectionStatus = 'connected';
            try { lastSessionId = encodeSession(sock.authState.creds); } catch (_) {}
            console.log(`✅ ${config.BOT_NAME} connected — powered by ${config.POWERED_BY}`);
        }

        if (connection === 'close') {
            connectionStatus = 'disconnected';
            const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
            const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
            console.log('⚠️  Connection closed.', statusCode, 'Reconnecting:', shouldReconnect);
            if (shouldReconnect) {
                setTimeout(() => startSocket(), 3000);
            } else {
                console.log('🔒 Logged out. Delete the /session folder and pair again.');
            }
        }
    });

    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        if (config.AUTO_READ) {
            try { await sock.readMessages([msg.key]); } catch (_) {}
        }

        const jid = msg.key.remoteJid;
        const text = getMessageText(msg).trim();
        if (!text) return;

        // Command handling
        if (text.startsWith(config.PREFIX)) {
            const sender = msg.key.participant || msg.key.remoteJid;
            const banCmd = commands.get('ban');
            if (banCmd && banCmd.isBanned && banCmd.isBanned(sender)) return;

            const args = text.slice(config.PREFIX.length).trim().split(/\s+/);
            const commandName = args.shift().toLowerCase();
            const command = commands.get(commandName);

            if (command) {
                try {
                    await command.execute(sock, msg, args, {
                        jid,
                        text,
                        prefix: config.PREFIX,
                        config,
                        commands,
                        chatbotEnabledChats
                    });
                } catch (err) {
                    console.error(`Error in command "${commandName}":`, err);
                    await reply(sock, jid, `⚠️ Something went wrong running *${commandName}*.\n${err.message}`, msg);
                }
            }
            return;
        }

        // AI chatbot auto-reply (only if enabled for this chat via .chatbot on)
        if (chatbotEnabledChats.has(jid)) {
            try {
                const chatbotCmd = commands.get('chatbot');
                if (chatbotCmd && chatbotCmd.autoReply) {
                    await chatbotCmd.autoReply(sock, msg, text, { jid, config });
                }
            } catch (err) {
                console.error('Chatbot auto-reply error:', err.message);
            }
        }

        // Passive moderation hooks (e.g. antilink) run on every group message
        if (jid.endsWith('@g.us')) {
            try {
                const antilinkCmd = commands.get('antilink');
                if (antilinkCmd && antilinkCmd.checkMessage) {
                    await antilinkCmd.checkMessage(sock, msg, text, { jid });
                }
            } catch (err) {
                console.error('Antilink check error:', err.message);
            }
        }
    });

    sock.ev.on('group-participants.update', async (event) => {
        if (!config.AUTO_JOIN) return;
        try {
            const welcomeCmd = commands.get('welcome');
            if (welcomeCmd && welcomeCmd.onParticipantsUpdate) {
                await welcomeCmd.onParticipantsUpdate(sock, event);
            }
        } catch (_) {}
    });

    return pairingCodePromise;
}

module.exports = { startSocket, getStatus, isReady, getSessionId, getSock: () => sock };
