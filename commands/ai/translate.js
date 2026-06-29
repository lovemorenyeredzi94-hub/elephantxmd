const axios = require('axios');

module.exports = {
    name: 'translate',
    aliases: ['tr'],
    category: 'tools',
    description: 'Translate text: .translate en <text>  (en = target language code)',
    execute: async (sock, msg, args, { jid, prefix }) => {
        const lang = args[0];
        const text = args.slice(1).join(' ');
        if (!lang || !text) {
            return sock.sendMessage(jid, { text: `Usage: ${prefix}translate <lang code> <text>\nExample: ${prefix}translate sn Hello there` }, { quoted: msg });
        }
        try {
            const { data } = await axios.get('https://translate.googleapis.com/translate_a/single', {
                params: { client: 'gtx', sl: 'auto', tl: lang, dt: 't', q: text },
                timeout: 15000
            });
            const translated = data[0].map(p => p[0]).join('');
            await sock.sendMessage(jid, { text: `🌐 ${translated}` }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(jid, { text: '❌ Translation failed. Check the language code and try again.' }, { quoted: msg });
        }
    }
};
