const { isOwner, getTargetJid } = require('../../lib/helpers');
const { bannedUsers } = require('../../lib/banList');

module.exports = {
    name: 'ban',
    category: 'owner',
    description: 'Block someone from using the bot (owner only)',
    execute: async (sock, msg, args, { jid, config }) => {
        const sender = msg.key.participant || msg.key.remoteJid;
        if (!isOwner(sender, config.OWNER_NUMBER)) {
            return sock.sendMessage(jid, { text: '❌ Owner only command.' }, { quoted: msg });
        }
        const target = getTargetJid(msg, args);
        if (!target) return sock.sendMessage(jid, { text: 'Mention, reply to, or type the number to ban.' }, { quoted: msg });
        bannedUsers.add(target);
        await sock.sendMessage(jid, { text: `🚫 @${target.split('@')[0]} banned from using the bot.`, mentions: [target] });
    },

    // Exposed so lib/whatsapp.js can silently ignore banned users' commands
    isBanned: (jid) => bannedUsers.has(jid)
};
