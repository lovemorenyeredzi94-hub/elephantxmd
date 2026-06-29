const QRCode = require('qrcode');

module.exports = {
    name: 'qrcode',
    aliases: ['qr'],
    category: 'tools',
    description: 'Generate a QR code: .qr <text or link>',
    execute: async (sock, msg, args, { jid, prefix }) => {
        const text = args.join(' ');
        if (!text) return sock.sendMessage(jid, { text: `Usage: ${prefix}qr <text or link>` }, { quoted: msg });
        try {
            const buffer = await QRCode.toBuffer(text, { width: 512, margin: 2 });
            await sock.sendMessage(jid, { image: buffer, caption: '✅ QR code generated' }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(jid, { text: '❌ Could not generate QR code.' }, { quoted: msg });
        }
    }
};
