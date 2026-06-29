const { dares } = require('../../lib/funData');

module.exports = {
    name: 'dare',
    category: 'fun',
    description: 'Get a random dare',
    execute: async (sock, msg, args, { jid }) => {
        const d = dares[Math.floor(Math.random() * dares.length)];
        await sock.sendMessage(jid, { text: `🔥 Dare: ${d}` }, { quoted: msg });
    }
};
