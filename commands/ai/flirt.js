const { flirts } = require('../../lib/funData');

module.exports = {
    name: 'flirt',
    category: 'fun',
    description: 'Get a cheesy pickup line',
    execute: async (sock, msg, args, { jid }) => {
        const f = flirts[Math.floor(Math.random() * flirts.length)];
        await sock.sendMessage(jid, { text: `😏 ${f}` }, { quoted: msg });
    }
};
