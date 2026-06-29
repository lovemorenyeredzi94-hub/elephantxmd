module.exports = {
    name: 'hidetag',
    category: 'group',
    description: 'Send a message that pings everyone silently (admin only)',
    execute: async (sock, msg, args, { jid }) => {
        if (!jid.endsWith('@g.us')) {
            return sock.sendMessage(jid, { text: '❌ This command only works in groups.' }, { quoted: msg });
        }
        const metadata = await sock.groupMetadata(jid);
        const participants = metadata.participants.map(p => p.id);
        const text = args.join(' ') || '📢';
        await sock.sendMessage(jid, { text, mentions: participants });
    }
};
