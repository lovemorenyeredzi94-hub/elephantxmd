module.exports = {
    name: 'time',
    category: 'tools',
    description: 'Show the current time in a timezone: .time Africa/Harare',
    execute: async (sock, msg, args, { jid, prefix }) => {
        const zone = args.join('') || 'Africa/Harare';
        try {
            const formatted = new Intl.DateTimeFormat('en-GB', {
                timeZone: zone,
                dateStyle: 'full',
                timeStyle: 'medium'
            }).format(new Date());
            await sock.sendMessage(jid, { text: `🕒 *${zone}*\n${formatted}` }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(jid, { text: `❌ Unknown timezone. Use a format like ${prefix}time Africa/Harare or ${prefix}time Europe/London` }, { quoted: msg });
        }
    }
};
