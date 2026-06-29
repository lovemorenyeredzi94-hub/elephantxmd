const { isOwner, getTargetJid } = require('../../lib/helpers');

module.exports = {
    name: 'block',
    category: 'owner',
    description: 'Block a user on WhatsApp (owner only)',
    execute: async (sock, msg, args, { jid, config }) => {
        const sender = msg.key.participant || msg.key.remoteJid;
        if (!isOwner(sender, config.OWNER_NUMBER)) {
            return sock.sendMessage(jid, { text: '❌ Owner only command.' }, { quoted: msg });
        }
        const target = getTargetJid(msg, args);
        if (!target) return sock.sendMessage(jid, { text: 'Mention, reply to, or type the number to block.' }, { quoted: msg });
        await sock.updateBlockStatus(target, 'block');
        await sock.sendMessage(jid, { text: `🚫 Blocked ${target.split('@')[0]}.` });
    }
};
