// Also wired into lib/whatsapp.js group-participants.update event for
// automatic welcome messages when someone joins (the "auto-join" feature).

const welcomeState = new Map(); // groupJid -> boolean enabled (default true)

module.exports = {
    name: 'welcome',
    category: 'group',
    description: 'Toggle automatic welcome messages: .welcome on / .welcome off',
    execute: async (sock, msg, args, { jid, prefix }) => {
        if (!jid.endsWith('@g.us')) {
            return sock.sendMessage(jid, { text: '❌ This command only works in groups.' }, { quoted: msg });
        }
        const mode = (args[0] || '').toLowerCase();
        if (mode !== 'on' && mode !== 'off') {
            return sock.sendMessage(jid, { text: `Usage: ${prefix}welcome on  |  ${prefix}welcome off` }, { quoted: msg });
        }
        welcomeState.set(jid, mode === 'on');
        await sock.sendMessage(jid, { text: `✅ Welcome messages turned ${mode.toUpperCase()}.` });
    },

    // Called automatically by lib/whatsapp.js whenever group membership changes
    onParticipantsUpdate: async (sock, event) => {
        const { id: groupJid, participants, action } = event;
        const enabled = welcomeState.get(groupJid);
        if (enabled === false) return; // explicitly disabled

        if (action === 'add') {
            const metadata = await sock.groupMetadata(groupJid);
            for (const p of participants) {
                await sock.sendMessage(groupJid, {
                    text: `🇿🇼 Welcome @${p.split('@')[0]} to *${metadata.subject}*!\nPowered by Handsome Tech Zimbabwe.`,
                    mentions: [p]
                });
            }
        }
        if (action === 'remove') {
            for (const p of participants) {
                await sock.sendMessage(groupJid, { text: `👋 @${p.split('@')[0]} left the group.`, mentions: [p] });
            }
        }
    }
};
