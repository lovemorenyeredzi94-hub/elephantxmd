const { downloadMediaMessage } = require('@whiskeysockets/baileys');

module.exports = {
    name: 'vv',
    category: 'converter',
    description: 'Reply to a view-once photo/video with .vv to reveal it again',
    execute: async (sock, msg, args, { jid }) => {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const viewOnce = quoted?.viewOnceMessage?.message || quoted?.viewOnceMessageV2?.message;

        if (!viewOnce) {
            return sock.sendMessage(jid, { text: 'Reply to a view-once photo or video with .vv' }, { quoted: msg });
        }

        const type = viewOnce.imageMessage ? 'imageMessage' : 'videoMessage';
        const buffer = await downloadMediaMessage({ message: viewOnce }, 'buffer', {});

        if (type === 'imageMessage') {
            await sock.sendMessage(jid, { image: buffer, caption: '🔓 Revealed' });
        } else {
            await sock.sendMessage(jid, { video: buffer, caption: '🔓 Revealed' });
        }
    }
};
