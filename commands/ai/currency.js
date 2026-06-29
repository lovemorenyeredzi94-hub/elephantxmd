const axios = require('axios');

module.exports = {
    name: 'currency',
    aliases: ['convert'],
    category: 'tools',
    description: 'Convert currency: .currency 100 USD ZAR',
    execute: async (sock, msg, args, { jid, prefix }) => {
        const [amountStr, from, to] = args;
        const amount = parseFloat(amountStr);
        if (!amount || !from || !to) {
            return sock.sendMessage(jid, { text: `Usage: ${prefix}currency <amount> <from> <to>\nExample: ${prefix}currency 100 USD ZAR` }, { quoted: msg });
        }
        try {
            const { data } = await axios.get('https://api.frankfurter.dev/v1/latest', {
                params: { base: from.toUpperCase(), symbols: to.toUpperCase() }, timeout: 15000
            });
            const rate = data.rates[to.toUpperCase()];
            if (!rate) throw new Error('No rate');
            const converted = (amount * rate).toFixed(2);
            await sock.sendMessage(jid, { text: `💱 ${amount} ${from.toUpperCase()} = *${converted} ${to.toUpperCase()}*` }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(jid, { text: '❌ Conversion failed. Check the currency codes.' }, { quoted: msg });
        }
    }
};
