const { facts } = require('../../lib/funData');

module.exports = {
    name: 'fact',
    category: 'fun',
    description: 'Get a random fun fact',
    execute: async (sock, msg, args, { jid }) => {
        const fact = facts[Math.floor(Math.random() * facts.length)];
        await sock.sendMessage(jid, { text: `🧠 Did you know? ${fact}` }, { quoted: msg });
    }
};
