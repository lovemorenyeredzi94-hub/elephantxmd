const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const { Sticker, StickerTypes } = require('wa-sticker-formatter');
const config = require('../../config');

module.exports = {
    name: 'sticker',
    aliases: ['s'],
    category: 'converter',
    description: 'Convert a replied image/video into a sticker',
    execute: async (sock, msg, args, { jid }) => {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const imageMsg = quoted?.imageMessage || msg.message?.imageMessage;
        const videoMsg = quoted?.videoMessage || msg.message?.videoMessage;

        if (!imageMsg && !videoMsg) {
            return sock.sendMessage(jid, { text: 'Reply to an image or short video with .sticker' }, { quoted: msg });
        }

        await sock.sendMessage(jid, { react: { text: '⏳', key: msg.key } });

        const mediaMessage = imageMsg ? { imageMessage: imageMsg } : { videoMessage: videoMsg };
        const buffer = await downloadMediaMessage({ message: mediaMessage }, 'buffer', {});

        const sticker = new Sticker(buffer, {
            pack: 'Malvin C XMD',
            author: config.POWERED_BY,
            type: StickerTypes.FULL,
            quality: 70
        });

        const webp = await sticker.toBuffer();
        await sock.sendMessage(jid, { sticker: webp }, { quoted: msg });
    }
};
