const { askGemini } = require('../../lib/gemini');

const SYSTEM_PROMPT =
    "You are ELEPHANT-X MD, a friendly WhatsApp assistant built by ICON-X MD TECH. " +
    "Keep replies short and conversational (2-3 sentences max) unless asked for detail.";

module.exports = {
    name: 'chatbot',
    category: 'ai',
    description: 'Toggle AI auto-reply for this chat: .chatbot on / .chatbot off',
    execute: async (sock, msg, args, { jid, prefix, chatbotEnabledChats, config }) => {
        const mode = (args[0] || '').toLowerCase();
        if (mode !== 'on' && mode !== 'off') {
            return sock.sendMessage(jid, { text: `Usage: ${prefix}chatbot on  |  ${prefix}chatbot off` }, { quoted: msg });
        }
        if (mode === 'on' && !config.GEMINI_API_KEY) {
            return sock.sendMessage(jid, {
                text: '🤖 AI isn\'t configured yet. Get a free key at https://aistudio.google.com/app/apikey and set GEMINI_API_KEY in your Render environment variables.'
            }, { quoted: msg });
        }
        if (mode === 'on') chatbotEnabledChats.add(jid); else chatbotEnabledChats.delete(jid);
        await sock.sendMessage(jid, { text: `🤖 Chatbot mode turned ${mode.toUpperCase()} for this chat.` }, { quoted: msg });
    },

    // Called automatically by lib/whatsapp.js for every message in a chat
    // where chatbot mode is enabled.
    autoReply: async (sock, msg, text, { jid, config }) => {
        if (!config.GEMINI_API_KEY) return;
        try {
            const answer = await askGemini(config.GEMINI_API_KEY, text, SYSTEM_PROMPT);
            if (answer) await sock.sendMessage(jid, { text: answer }, { quoted: msg });
        } catch (_) {
            // stay silent on auto-reply failures so the chat isn't spammed with errors
        }
    }
};
