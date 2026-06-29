const { getTargetJid, isSenderAdmin } = require('../../lib/helpers');

module.exports = {
    name: 'promote',
    category: 'group',
    description: 'Make a member a group admin (admin only)',
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
            return sock.sendMessage(jid, { text: 'Mention or reply to the person to promote.' }, { quoted: msg });
        }
        await sock.groupParticipantsUpdate(jid, [target], 'promote');
        await sock.sendMessage(jid, { text: `👑 Promoted @${target.split('@')[0]} to admin`, mentions: [target] });
    }
};
