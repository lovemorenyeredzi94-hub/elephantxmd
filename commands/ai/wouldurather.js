const { wouldurather } = require('../../lib/funData');

module.exports = {
    name: 'wouldurather',
    aliases: ['wyr'],
    category: 'fun',
    description: 'Get a random "would you rather" question',
    execute: async (sock, msg, args, { jid }) => {
        const w = wouldurather[Math.floor(Math.random() * wouldurather.length)];
        await sock.sendMessage(jid, { text: `🤷 Would you rather...
${w}` }, { quoted: msg });
    }
};
