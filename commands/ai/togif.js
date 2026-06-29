const { downloadMediaMessage } = require('@whiskeysockets/baileys');

module.exports = {
    name: 'togif',
    category: 'converter',
    description: 'Reply to a video sticker with .togif to send it as a looping GIF-style video',
    execute: async (sock, msg, args, { jid }) => {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const stickerMsg = quoted?.stickerMessage;
        const videoMsg = quoted?.videoMessage || msg.message?.videoMessage;
        const target = stickerMsg || videoMsg;

        if (!target) {
            return sock.sendMessage(jid, { text: 'Reply to an animated sticker or video with .togif' }, { quoted: msg });
        }
        const key = stickerMsg ? 'stickerMessage' : 'videoMessage';
        const buffer = await downloadMediaMessage({ message: { [key]: target } }, 'buffer', {});

        await sock.sendMessage(jid, { video: buffer, gifPlayback: true, caption: '✅ Converted' }, { quoted: msg });
    }
};
