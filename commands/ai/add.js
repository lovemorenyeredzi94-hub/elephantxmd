const { isSenderAdmin } = require('../../lib/helpers');

module.exports = {
    name: 'add',
    category: 'group',
    description: 'Add a member to the group by number (admin only)',
    execute: async (sock, msg, args, { jid, prefix }) => {
        if (!jid.endsWith('@g.us')) {
            return sock.sendMessage(jid, { text: '❌ This command only works in groups.' }, { quoted: msg });
        }
        const sender = msg.key.participant || msg.key.remoteJid;
        if (!(await isSenderAdmin(sock, jid, sender))) {
            return sock.sendMessage(jid, { text: '❌ Only group admins can use this command.' }, { quoted: msg });
        }
        const number = (args[0] || '').replace(/[^0-9]/g, '');
        if (!number) {
            return sock.sendMessage(jid, { text: `Usage: ${prefix}add 263771234567` }, { quoted: msg });
        }
        const target = `${number}@s.whatsapp.net`;
        const result = await sock.groupParticipantsUpdate(jid, [target], 'add');
        const status = result?.[0]?.status;
        if (status === '403') {
            await sock.sendMessage(jid, { text: '⚠️ Could not add directly (their privacy settings block it). Sending an invite link instead.' });
            const code = await sock.groupInviteCode(jid);
            await sock.sendMessage(target, { text: `You've been invited to a group: https://chat.whatsapp.com/${code}` });
        } else {
            await sock.sendMessage(jid, { text: `✅ Added ${number}` });
        }
    }
};
