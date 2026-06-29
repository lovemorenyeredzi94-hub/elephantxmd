module.exports = {
    name: 'simp',
    category: 'fun',
    description: 'Get a random simp percentage for fun: .simp @user',
    execute: async (sock, msg, args, { jid }) => {
        const ctx = msg.message?.extendedTextMessage?.contextInfo;
        const target = ctx?.mentionedJid?.[0] || msg.key.participant || msg.key.remoteJid;
        const score = Math.floor(Math.random() * 101);
        await sock.sendMessage(jid, { text: `💗 @${target.split('@')[0]} is ${score}% simp today.`, mentions: [target] }, { quoted: msg });
    }
};
