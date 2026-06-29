const { isOwner } = require('../../lib/helpers');
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

module.exports = {
    name: 'setpp',
    category: 'owner',
    description: 'Set the bot\'s profile picture by replying to an image (owner only)',
    execute: async (sock, msg, args, { jid, config }) => {
        const sender = msg.key.participant || msg.key.remoteJid;
        if (!isOwner(sender, config.OWNER_NUMBER)) {
            return sock.sendMessage(jid, { text: '❌ Owner only command.' }, { quoted: msg });
        }
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const imageMsg = quoted?.imageMessage || msg.message?.imageMessage;
        if (!imageMsg) {
            return sock.sendMessage(jid, { text: 'Reply to (or send with caption) an image to use as the new profile picture.' }, { quoted: msg });
        }
        const buffer = await downloadMediaMessage({ message: { imageMessage: imageMsg } }, 'buffer', {});
        await sock.updateProfilePicture(sock.user.id, buffer);
        await sock.sendMessage(jid, { text: '✅ Profile picture updated.' });
    }
};
