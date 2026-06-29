const { fetchWaifuImage } = require('../../lib/waifu');

module.exports = {
    name: 'dance',
    category: 'anime',
    description: '💃 React with a dance gif',
    execute: async (sock, msg, args, { jid }) => {
        try {
            const url = await fetchWaifuImage('dance');
            const sender = msg.key.participant || msg.key.remoteJid;
            await sock.sendMessage(jid, {
                image: { url },
                caption: `💃 @${sender.split('@')[0]} dances`,
                mentions: [sender]
            }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(jid, { text: '❌ Could not fetch an image right now.' }, { quoted: msg });
        }
    }
};
