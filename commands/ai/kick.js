const { getTargetJid, isSenderAdmin } = require('../../lib/helpers');

module.exports = {
    name: 'kick',
    aliases: ['remove'],
    category: 'group',
    description: 'Remove a member from the group (admin only)',
    execute: async (sock, msg, args, { jid }) => {
        if (!jid.endsWith('@g.us')) {
            return sock.sendMessage(jid, { text: '❌ This command only works in groups.' }, { quoted: msg });
        }
        const sender = msg.key.participant || msg.key.remoteJid;
        if (!(await isSenderAdmin(sock, jid, sender))) {
            return sock.sendMessage(jid, { text: '❌ Only group admins can use this command.' }, { quoted: msg });
        }
        const target = getTargetJid(msg, args);
        if (!target) {
            return sock.sendMessage(jid, { text: 'Mention, reply to, or type the number of the person to kick.' }, { quoted: msg });
        }
        await sock.groupParticipantsUpdate(jid, [target], 'remove');
        await sock.sendMessage(jid, { text: `✅ Removed @${target.split('@')[0]}`, mentions: [target] });
    }
};
