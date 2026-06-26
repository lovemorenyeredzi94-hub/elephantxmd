// lib/helpers.js — shared utilities used by every command file
const axios = require('axios');

// Pulls the plain text out of any Baileys message type
function getMessageText(msg) {
    const m = msg.message;
    if (!m) return '';
    return (
        m.conversation ||
        m.extendedTextMessage?.text ||
        m.imageMessage?.caption ||
        m.videoMessage?.caption ||
        m.buttonsResponseMessage?.selectedButtonId ||
        m.listResponseMessage?.singleSelectReply?.selectedRowId ||
        ''
    );
}

// Simple GET wrapper with a timeout so a slow API never hangs the bot
async function getJson(url, opts = {}) {
    const res = await axios.get(url, { timeout: 15000, ...opts });
    return res.data;
}

// Sends a plain text reply, quoting the original message
async function reply(sock, jid, text, quoted) {
    return sock.sendMessage(jid, { text }, { quoted });
}

function isOwner(jid, ownerNumber) {
    const num = jid.replace(/[^0-9]/g, '');
    return num === ownerNumber.replace(/[^0-9]/g, '');
}

// Resolves the target user for admin commands: a @mention, a replied-to
// message, or a typed number like 263771234567
function getTargetJid(msg, args) {
    const ctx = msg.message?.extendedTextMessage?.contextInfo;
    if (ctx?.mentionedJid?.length) return ctx.mentionedJid[0];
    if (ctx?.participant) return ctx.participant;
    if (args[0]) {
        const num = args[0].replace(/[^0-9]/g, '');
        if (num.length >= 8) return `${num}@s.whatsapp.net`;
    }
    return null;
}

async function isSenderAdmin(sock, groupJid, senderJid) {
    const metadata = await sock.groupMetadata(groupJid);
    const participant = metadata.participants.find(p => p.id === senderJid);
    return participant?.admin === 'admin' || participant?.admin === 'superadmin';
}

module.exports = { getMessageText, getJson, reply, isOwner, getTargetJid, isSenderAdmin };
