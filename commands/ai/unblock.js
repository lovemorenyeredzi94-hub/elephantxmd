const { isOwner, getTargetJid } = require('../../lib/helpers');

module.exports = {
    name: 'unblock',
    category: 'owner',
    description: 'Unblock a user on WhatsApp (owner only)',
    execute: async (sock, msg, args, { jid, config }) => {
        const sender = msg.key.participant || msg.key.remoteJid;
        if (!isOwner(sender, config.OWNER_NUMBER)) {
            return sock.sendMessage(jid, { text: '❌ Owner only command.' }, { quoted: msg });
        }
        const target = getTargetJid(msg, args);
        if (!target) return sock.sendMessage(jid, { text: 'Mention, reply to, or type the number to unblock.' }, { quoted: msg });
        await sock.updateBlockStatus(target, 'unblock');
        await sock.sendMessage(jid, { text: `✅ Unblocked ${target.split('@')[0]}.` });
    }
};
