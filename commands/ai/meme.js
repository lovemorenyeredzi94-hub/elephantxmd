const { getJson } = require('../../lib/helpers');

module.exports = {
    name: 'meme',
    category: 'fun',
    description: 'Get a random meme',
    execute: async (sock, msg, args, { jid }) => {
        try {
            const data = await getJson('https://meme-api.com/gimme');
            await sock.sendMessage(jid, {
                image: { url: data.url },
                caption: `😂 ${data.title}\nr/${data.subreddit}`
            }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(jid, { text: '❌ Could not fetch a meme right now.' }, { quoted: msg });
        }
    }
};
