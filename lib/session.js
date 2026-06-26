// lib/session.js — turns Baileys creds.json into a portable, copy-pasteable
// "session ID" string, and back again.
//
// Format: ELEPHANT-X MD~<base64-encoded-creds-json>
// Powered by Handsome Tech

const PREFIX = 'ELEPHANT-X MD~';

function encodeSession(credsObject) {
    const json = JSON.stringify(credsObject);
    const base64 = Buffer.from(json, 'utf8').toString('base64');
    return PREFIX + base64;
}

function decodeSession(sessionId) {
    if (typeof sessionId !== 'string' || !sessionId.startsWith(PREFIX)) {
        throw new Error('Invalid session ID — it must start with "ELEPHANT-X MD~"');
    }
    const base64 = sessionId.slice(PREFIX.length).trim();
    const json = Buffer.from(base64, 'base64').toString('utf8');
    return JSON.parse(json);
}

module.exports = { encodeSession, decodeSession, PREFIX };
