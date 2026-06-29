const { evaluate } = require('mathjs');

module.exports = {
    name: 'calculate',
    aliases: ['calc', 'math'],
    category: 'tools',
    description: 'Evaluate a math expression: .calc 12 * (3 + 4)',
    execute: async (sock, msg, args, { jid, prefix }) => {
        const expr = args.join(' ');
        if (!expr) return sock.sendMessage(jid, { text: `Usage: ${prefix}calc <expression>` }, { quoted: msg });
        try {
            const result = evaluate(expr);
            await sock.sendMessage(jid, { text: `🧮 ${expr} = *${result}*` }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(jid, { text: '❌ Invalid expression.' }, { quoted: msg });
        }
    }
};
