module.exports = {
    name: 'ship',
    category: 'fun',
    description: 'Calculate a fun compatibility score: .ship @user1 @user2',
    execute: async (sock, msg, args, { jid }) => {
        const ctx = msg.message?.extendedTextMessage?.contextInfo;
        const mentioned = ctx?.mentionedJid || [];
        const sender = msg.key.participant || msg.key.remoteJid;

        const a = mentioned[0] || sender;
        const b = mentioned[1] || mentioned[0] || sender;

        let hash = 0;
        const combo = a + b;
        for (let i = 0; i < combo.length; i++) hash = (hash * 31 + combo.charCodeAt(i)) % 100;
        const score = Math.abs(hash);

        const bar = '💖'.repeat(Math.round(score / 10)) + '🤍'.repeat(10 - Math.round(score / 10));
        await sock.sendMessage(jid, {
            text: `💘 @${a.split('@')[0]} + @${b.split('@')[0]} = ${score}%
${bar}`,
            mentions: [a, b]
        }, { quoted: msg });
    }
};
