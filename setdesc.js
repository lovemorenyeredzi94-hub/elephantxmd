const { isSenderAdmin } = require('../../lib/helpers');

module.exports = {
    name: 'setdesc',
    category: 'group',
    description: 'Change the group description (admin only)',
    execute: async (sock, msg, args, { jid, prefix }) => {
        if (!jid.endsWith('@g.us')) {
            return sock.sendMessage(jid, { text: '❌ This command only works in groups.' }, { quoted: msg });
        }
        const sender = msg.key.participant || msg.key.remoteJid;
        if (!(await isSenderAdmin(sock, jid, sender))) {
            return sock.sendMessage(jid, { text: '❌ Only group admins can use this command.' }, { quoted: msg });
        }
        const text = args.join(' ');
        if (!text) return sock.sendMessage(jid, { text: `Usage: ${prefix}setdesc <new description>` }, { quoted: msg });
        await sock.groupUpdateDescription(jid, text);
        await sock.sendMessage(jid, { text: '✅ Group description updated.' });
    }
};
