const axios = require('axios');

module.exports = {
    name: 'shorturl',
    aliases: ['short'],
    category: 'tools',
    description: 'Shorten a link: .shorturl <url>',
    execute: async (sock, msg, args, { jid, prefix }) => {
        const url = args[0];
        if (!url) return sock.sendMessage(jid, { text: `Usage: ${prefix}shorturl <link>` }, { quoted: msg });
        try {
            const { data } = await axios.get('https://is.gd/create.php', {
                params: { format: 'json', url }, timeout: 15000
            });
            if (data.errorcode) throw new Error(data.errormessage);
            await sock.sendMessage(jid, { text: `🔗 ${data.shorturl}` }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(jid, { text: '❌ Could not shorten that link.' }, { quoted: msg });
        }
    }
};
