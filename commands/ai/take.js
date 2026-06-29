const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');

module.exports = {
    name: 'take',
    category: 'converter',
    description: 'Reply to a sticker with .take <pack name> to rebrand it',
    execute: async (sock, msg, args, { jid, prefix }) => {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const stickerMsg = quoted?.stickerMessage;
        if (!stickerMsg) {
            return sock.sendMessage(jid, { text: `Reply to a sticker with ${prefix}take <pack name>` }, { quoted: msg });
        }
        const packName = args.join(' ') || 'Malvin C XMD';
        const buffer = await downloadMediaMessage({ message: { stickerMessage: stickerMsg } }, 'buffer', {});

        const sticker = new Sticker(buffer, {
            pack: packName,
            author: 'Handsome Tech Zimbabwe',
            type: StickerTypes.FULL,
            quality: 70
        });

        await sock.sendMessage(jid, { sticker: await sticker.toBuffer() }, { quoted: msg });
    }
};
