const { riddles } = require('../../lib/funData');

module.exports = {
    name: 'riddle',
    category: 'fun',
    description: 'Get a random riddle',
    execute: async (sock, msg, args, { jid }) => {
        const r = riddles[Math.floor(Math.random() * riddles.length)];
        await sock.sendMessage(jid, { text: `🧩 ${r.q}

_Reply ".riddle" again for a new one, think before scrolling for the answer:_
||${r.a}||` }, { quoted: msg });
    }
};
