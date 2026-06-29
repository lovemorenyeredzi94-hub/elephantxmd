module.exports = {
    name: 'base64',
    category: 'tools',
    description: 'Encode or decode base64: .base64 encode <text> | .base64 decode <text>',
    execute: async (sock, msg, args, { jid, prefix }) => {
        const mode = (args[0] || '').toLowerCase();
        const text = args.slice(1).join(' ');
        if (!['encode', 'decode'].includes(mode) || !text) {
            return sock.sendMessage(jid, { text: `Usage: ${prefix}base64 encode <text>\n${prefix}base64 decode <text>` }, { quoted: msg });
        }
        try {
            const result = mode === 'encode'
                ? Buffer.from(text, 'utf8').toString('base64')
                : Buffer.from(text, 'base64').toString('utf8');
            await sock.sendMessage(jid, { text: result }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(jid, { text: '❌ Could not process that text.' }, { quoted: msg });
        }
    }
};
