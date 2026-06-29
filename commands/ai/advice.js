const { advice } = require('../../lib/funData');

module.exports = {
    name: 'advice',
    category: 'fun',
    description: 'Get a random piece of advice',
    execute: async (sock, msg, args, { jid }) => {
        const a = advice[Math.floor(Math.random() * advice.length)];
        await sock.sendMessage(jid, { text: `💡 ${a}` }, { quoted: msg });
    }
};
