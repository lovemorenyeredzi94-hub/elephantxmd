const { isSenderAdmin } = require('../../lib/helpers');

module.exports = {
    name: 'grouplink',
    aliases: ['linkgc', 'invitelink'],
    category: 'group',
    description: 'Get the group invite link (admin only)',
    execute: async (sock, msg, args, { jid }) => {
        if (!jid.endsWith('@g.us')) {
            return sock.sendMessage(jid, { text: '❌ This command only works in groups.' }, { quoted: msg });
        }
        const sender = msg.key.participant || msg.key.remoteJid;
        if (!(await isSenderAdmin(sock, jid, sender))) {
            return sock.sendMessage(jid, { text: '❌ Only group admins can use this command.' }, { quoted: msg });
        }
        const code = await sock.groupInviteCode(jid);
        await sock.sendMessage(jid, { text: `🔗 https://chat.whatsapp.com/${code}` }, { quoted: msg });
    }
};
