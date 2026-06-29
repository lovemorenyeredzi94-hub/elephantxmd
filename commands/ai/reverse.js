module.exports = {
    name: 'reverse',
    category: 'tools',
    description: 'Reverse text: .reverse <text>',
    execute: async (sock, msg, args, { jid, prefix }) => {
        const text = args.join(' ');
        if (!text) return sock.sendMessage(jid, { text: `Usage: ${prefix}reverse <text>` }, { quoted: msg });
        await sock.sendMessage(jid, { text: text.split('').reverse().join('') }, { quoted: msg });
    }
};
