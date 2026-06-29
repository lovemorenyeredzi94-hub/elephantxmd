const { fetchWaifuImage } = require('../../lib/waifu');
const { getTargetJid } = require('../../lib/helpers');

module.exports = {
    name: 'cuddle',
    category: 'anime',
    description: 'cuddles someone: .cuddle @user',
    execute: async (sock, msg, args, { jid }) => {
        try {
            const url = await fetchWaifuImage('cuddle');
            const sender = msg.key.participant || msg.key.remoteJid;
            const target = getTargetJid(msg, args) || sender;
            const caption = target === sender
                ? `@${sender.split('@')[0]} cuddles the air 😅`
                : `@${sender.split('@')[0]} cuddles @${target.split('@')[0]}`;
            await sock.sendMessage(jid, {
                image: { url },
                caption,
                mentions: [sender, target]
            }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(jid, { text: '❌ Could not fetch an image right now.' }, { quoted: msg });
        }
    }
};
