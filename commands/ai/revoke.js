const { isSenderAdmin } = require('../../lib/helpers');

module.exports = {
    name: 'revoke',
    category: 'group',
    description: 'Reset the group invite link, invalidating the old one (admin only)',
    execute: async (sock, msg, args, { jid }) => {
        if (!jid.endsWith('@g.us')) {
            return sock.sendMessage(jid, { text: '❌ This command only works in groups.' }, { quoted: msg });
        }
        const sender = msg.key.participant || msg.key.remoteJid;
        if (!(await isSenderAdmin(sock, jid, sender))) {
            return sock.sendMessage(jid, { text: '❌ Only group admins can use this command.' }, { quoted: msg });
        }
        const code = await sock.groupRevokeInvite(jid);
        await sock.sendMessage(jid, { text: `🔄 New invite link: https://chat.whatsapp.com/${code}` });
    }
};
