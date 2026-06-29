const { truths } = require('../../lib/funData');

module.exports = {
    name: 'truth',
    category: 'fun',
    description: 'Get a random truth question',
    execute: async (sock, msg, args, { jid }) => {
        const t = truths[Math.floor(Math.random() * truths.length)];
        await sock.sendMessage(jid, { text: `🤔 Truth: ${t}` }, { quoted: msg });
    }
};
