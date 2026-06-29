const { eightball } = require('../../lib/funData');

module.exports = {
    name: 'eightball',
    aliases: ['8ball'],
    category: 'fun',
    description: 'Ask the magic 8-ball a question: .8ball <question>',
    execute: async (sock, msg, args, { jid, prefix }) => {
        if (!args.length) return sock.sendMessage(jid, { text: `Usage: ${prefix}8ball <question>` }, { quoted: msg });
        const answer = eightball[Math.floor(Math.random() * eightball.length)];
        await sock.sendMessage(jid, { text: `🎱 ${answer}` }, { quoted: msg });
    }
};
