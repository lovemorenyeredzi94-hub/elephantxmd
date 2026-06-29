const { roasts } = require('../../lib/funData');
const { getTargetJid } = require('../../lib/helpers');

module.exports = {
    name: 'roast',
    category: 'fun',
    description: 'Playfully roast someone: .roast @user',
    execute: async (sock, msg, args, { jid }) => {
        const target = getTargetJid(msg, args);
        const r = roasts[Math.floor(Math.random() * roasts.length)];
        if (target) {
            await sock.sendMessage(jid, { text: `🔥 @${target.split('@')[0]} ${r}`, mentions: [target] }, { quoted: msg });
        } else {
            await sock.sendMessage(jid, { text: `🔥 You ${r}` }, { quoted: msg });
        }
    }
};
