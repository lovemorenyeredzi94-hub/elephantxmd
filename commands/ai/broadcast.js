const { isOwner } = require('../../lib/helpers');

module.exports = {
    name: 'broadcast',
    aliases: ['bc'],
    category: 'owner',
    description: 'Send a message to every chat (owner only)',
    execute: async (sock, msg, args, { jid, config, prefix }) => {
        const sender = msg.key.participant || msg.key.remoteJid;
        if (!isOwner(sender, config.OWNER_NUMBER)) {
            return sock.sendMessage(jid, { text: '❌ Owner only command.' }, { quoted: msg });
        }
        const text = args.join(' ');
        if (!text) return sock.sendMessage(jid, { text: `Usage: ${prefix}broadcast <message>` }, { quoted: msg });

        const chats = await sock.groupFetchAllParticipating();
        const groupJids = Object.keys(chats);
        let sent = 0;
        for (const gJid of groupJids) {
            try {
                await sock.sendMessage(gJid, { text: `📢 *Broadcast*\n\n${text}` });
                sent++;
                await new Promise(r => setTimeout(r, 800)); // avoid rate limiting
            } catch (_) {}
        }
        await sock.sendMessage(jid, { text: `✅ Broadcast sent to ${sent} group(s).` });
    }
};
