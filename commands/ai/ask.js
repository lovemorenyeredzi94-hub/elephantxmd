const { askGemini } = require('../../lib/gemini');

module.exports = {
    name: 'ask',
    aliases: ['ai', 'gpt'],
    category: 'ai',
    description: 'Ask the AI a question: .ask <question>',
    execute: async (sock, msg, args, { jid, config, prefix }) => {
        const question = args.join(' ');
        if (!question) return sock.sendMessage(jid, { text: `Usage: ${prefix}ask <question>` }, { quoted: msg });

        if (!config.GEMINI_API_KEY) {
            return sock.sendMessage(jid, {
                text: '🤖 AI isn\'t configured yet. Get a free key at https://aistudio.google.com/app/apikey and set GEMINI_API_KEY in your Render environment variables.'
            }, { quoted: msg });
        }

        try {
            const answer = await askGemini(config.GEMINI_API_KEY, question);
            await sock.sendMessage(jid, { text: answer || '🤖 No response generated, try rephrasing.' }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(jid, { text: '⚠️ AI request failed. Check your GEMINI_API_KEY and try again.' }, { quoted: msg });
        }
    }
};
