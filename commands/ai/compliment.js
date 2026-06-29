const { compliments } = require('../../lib/funData');
const { getTargetJid } = require('../../lib/helpers');

module.exports = {
    name: 'compliment',
    category: 'fun',
    description: 'Send someone a compliment: .compliment @user',
    execute: async (sock, msg, args, { jid }) => {
        const target = getTargetJid(msg, args);
        const c = compliments[Math.floor(Math.random() * compliments.length)];
        if (target) {
            await sock.sendMessage(jid, { text: `✨ @${target.split('@')[0]} ${c}`, mentions: [target] }, { quoted: msg });
        } else {
            await sock.sendMessage(jid, { text: `✨ You ${c}` }, { quoted: msg });
        }
    }
};
