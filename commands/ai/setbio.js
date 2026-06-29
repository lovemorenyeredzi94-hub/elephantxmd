const { isOwner } = require('../../lib/helpers');

module.exports = {
    name: 'setbio',
    category: 'owner',
    description: 'Change the bot\'s About/status text (owner only)',
    execute: async (sock, msg, args, { jid, config, prefix }) => {
        const sender = msg.key.participant || msg.key.remoteJid;
        if (!isOwner(sender, config.OWNER_NUMBER)) {
            return sock.sendMessage(jid, { text: '❌ Owner only command.' }, { quoted: msg });
        }
        const text = args.join(' ');
        if (!text) return sock.sendMessage(jid, { text: `Usage: ${prefix}setbio <text>` }, { quoted: msg });
        await sock.updateProfileStatus(text);
        await sock.sendMessage(jid, { text: '✅ Bio updated.' });
    }
};
