const sharp = require('sharp');

module.exports = {
    name: 'color',
    category: 'tools',
    description: 'Preview a hex color: .color #1bd95f',
    execute: async (sock, msg, args, { jid, prefix }) => {
        let hex = (args[0] || '').replace('#', '');
        if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
            return sock.sendMessage(jid, { text: `Usage: ${prefix}color #RRGGBB` }, { quoted: msg });
        }
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);

        const buffer = await sharp({
            create: { width: 400, height: 400, channels: 3, background: { r, g, b } }
        }).png().toBuffer();

        await sock.sendMessage(jid, { image: buffer, caption: `🎨 #${hex.toUpperCase()}\nRGB(${r}, ${g}, ${b})` }, { quoted: msg });
    }
};
