module.exports = {
    name: 'poll',
    category: 'tools',
    description: 'Create a poll: .poll Question, option1, option2, option3',
    execute: async (sock, msg, args, { jid, prefix }) => {
        const raw = args.join(' ');
        const parts = raw.split(',').map(p => p.trim()).filter(Boolean);
        if (parts.length < 3) {
            return sock.sendMessage(jid, { text: `Usage: ${prefix}poll Favourite food?, Sadza, Rice, Pasta` }, { quoted: msg });
        }
        const [question, ...options] = parts;
        await sock.sendMessage(jid, {
            poll: { name: question, values: options, selectableCount: 1 }
        }, { quoted: msg });
    }
};
