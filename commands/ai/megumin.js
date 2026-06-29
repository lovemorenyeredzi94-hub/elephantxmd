const { fetchWaifuImage } = require('../../lib/waifu');

module.exports = {
    name: 'megumin',
    category: 'anime',
    description: 'Get a Megumin picture',
    execute: async (sock, msg, args, { jid }) => {
        try {
            const url = await fetchWaifuImage('megumin');
            await sock.sendMessage(jid, { image: { url } }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(jid, { text: '❌ Could not fetch an image right now.' }, { quoted: msg });
        }
    }
};
