const { isSenderAdmin } = require('../../lib/helpers');

module.exports = {
    name: 'mute',
    category: 'group',
    description: 'Lock the group so only admins can send messages',
    execute: async (sock, msg, args, { jid }) => {
        if (!jid.endsWith('@g.us')) {
            return sock.sendMessage(jid, { text: '❌ This command only works in groups.' }, { quoted: msg });
        }
        const sender = msg.key.participant || msg.key.remoteJid;
        if (!(await isSenderAdmin(sock, jid, sender))) {
            return sock.sendMessage(jid, { text: '❌ Only group admins can use this command.' }, { quoted: msg });
        }
        await sock.groupSettingUpdate(jid, 'announcement');
        await sock.sendMessage(jid, { text: '🔇 Group muted — only admins can send messages now.' });
    }
};
