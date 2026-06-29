module.exports = {
    name: 'tagall',
    category: 'group',
    description: 'Mention every member in the group',
    execute: async (sock, msg, args, { jid }) => {
        if (!jid.endsWith('@g.us')) {
            return sock.sendMessage(jid, { text: '❌ This command only works in groups.' }, { quoted: msg });
        }
        const metadata = await sock.groupMetadata(jid);
        const participants = metadata.participants.map(p => p.id);
        const note = args.join(' ') || 'Attention everyone!';

        let text = `📢 *${note}*\n\n`;
        text += participants.map(p => `@${p.split('@')[0]}`).join(' ');

        await sock.sendMessage(jid, { text, mentions: participants });
    }
};
