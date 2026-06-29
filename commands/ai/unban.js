const { isOwner, getTargetJid } = require('../../lib/helpers');
const { bannedUsers } = require('../../lib/banList');

module.exports = {
    name: 'unban',
    category: 'owner',
    description: 'Restore someone\'s access to the bot (owner only)',
    execute: async (sock, msg, args, { jid, config }) => {
        const sender = msg.key.participant || msg.key.remoteJid;
        if (!isOwner(sender, config.OWNER_NUMBER)) {
            return sock.sendMessage(jid, { text: '❌ Owner only command.' }, { quoted: msg });
        }
        const target = getTargetJid(msg, args);
        if (!target) return sock.sendMessage(jid, { text: 'Mention, reply to, or type the number to unban.' }, { quoted: msg });
        bannedUsers.delete(target);
        await sock.sendMessage(jid, { text: `✅ @${target.split('@')[0]} unbanned.`, mentions: [target] });
    }
};
