const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const sharp = require('sharp');

module.exports = {
    name: 'toimg',
    category: 'converter',
    description: 'Convert a replied sticker into an image',
    execute: async (sock, msg, args, { jid }) => {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const stickerMsg = quoted?.stickerMessage || msg.message?.stickerMessage;
        if (!stickerMsg) {
            return sock.sendMessage(jid, { text: 'Reply to a sticker with .toimg' }, { quoted: msg });
        }
        const buffer = await downloadMediaMessage({ message: { stickerMessage: stickerMsg } }, 'buffer', {});
        const png = await sharp(buffer).png().toBuffer();
        await sock.sendMessage(jid, { image: png, caption: '✅ Converted to image' }, { quoted: msg });
    }
};
