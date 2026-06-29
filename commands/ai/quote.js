const { quotes } = require('../../lib/funData');

module.exports = {
    name: 'quote',
    category: 'fun',
    description: 'Get an inspirational quote',
    execute: async (sock, msg, args, { jid }) => {
        const quote = quotes[Math.floor(Math.random() * quotes.length)];
        await sock.sendMessage(jid, { text: `💬 ${quote}` }, { quoted: msg });
    }
};
