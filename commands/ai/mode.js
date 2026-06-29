const { isOwner } = require('../../lib/helpers');

let publicMode = true;

module.exports = {
    name: 'mode',
    category: 'owner',
    description: 'Switch bot between public and private (owner only): .mode public / .mode private',
    execute: async (sock, msg, args, { jid, config, prefix }) => {
        const sender = msg.key.participant || msg.key.remoteJid;
        if (!isOwner(sender, config.OWNER_NUMBER)) {
            return sock.sendMessage(jid, { text: '❌ Owner only command.' }, { quoted: msg });
        }
        const choice = (args[0] || '').toLowerCase();
        if (choice !== 'public' && choice !== 'private') {
            return sock.sendMessage(jid, { text: `Usage: ${prefix}mode public  |  ${prefix}mode private\nCurrent: ${publicMode ? 'public' : 'private'}` }, { quoted: msg });
        }
        publicMode = choice === 'public';
        await sock.sendMessage(jid, { text: `✅ Bot is now in *${choice.toUpperCase()}* mode.` });
    },
    isPublic: () => publicMode
};
