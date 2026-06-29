const { jokes } = require('../../lib/funData');

module.exports = {
    name: 'joke',
    category: 'fun',
    description: 'Get a random joke',
    execute: async (sock, msg, args, { jid }) => {
        const joke = jokes[Math.floor(Math.random() * jokes.length)];
        await sock.sendMessage(jid, { text: `😂 ${joke}` }, { quoted: msg });
    }
};
