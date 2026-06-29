const axios = require('axios');

module.exports = {
    name: 'define',
    aliases: ['dictionary'],
    category: 'tools',
    description: 'Look up a word\'s meaning: .define <word>',
    execute: async (sock, msg, args, { jid, prefix }) => {
        const word = args[0];
        if (!word) return sock.sendMessage(jid, { text: `Usage: ${prefix}define <word>` }, { quoted: msg });
        try {
            const { data } = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, { timeout: 15000 });
            const entry = data[0];
            const meaning = entry.meanings[0];
            const def = meaning.definitions[0];

            let text = `📖 *${entry.word}* (${meaning.partOfSpeech})\n\n${def.definition}`;
            if (def.example) text += `\n\n_Example: "${def.example}"_`;
            await sock.sendMessage(jid, { text }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(jid, { text: '❌ Word not found.' }, { quoted: msg });
        }
    }
};
