const { fetchWaifuImage } = require('../../lib/waifu');

module.exports = {
    name: 'smile',
    category: 'anime',
    description: '😄 React with a smile gif',
    execute: async (sock, msg, args, { jid }) => {
        try {
            const url = await fetchWaifuImage('smile');
            const sender = msg.key.participant || msg.key.remoteJid;
            await sock.sendMessage(jid, {
                image: { url },
                caption: `😄 @${sender.split('@')[0]} smiles`,
                mentions: [sender]
            }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(jid, { text: '❌ Could not fetch an image right now.' }, { quoted: msg });
        }
    }
};
