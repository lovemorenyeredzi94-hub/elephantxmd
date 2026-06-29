const os = require('os');
const { isOwner } = require('../../lib/helpers');

module.exports = {
    name: 'stats',
    category: 'owner',
    description: 'Show server resource usage (owner only)',
    execute: async (sock, msg, args, { jid, config, commands }) => {
        const sender = msg.key.participant || msg.key.remoteJid;
        if (!isOwner(sender, config.OWNER_NUMBER)) {
            return sock.sendMessage(jid, { text: '❌ Owner only command.' }, { quoted: msg });
        }
        const totalMem = (os.totalmem() / 1024 / 1024).toFixed(0);
        const freeMem = (os.freemem() / 1024 / 1024).toFixed(0);
        const usedMem = totalMem - freeMem;
        const unique = new Set(commands.values()).size;

        await sock.sendMessage(jid, {
            text:
`📊 *Server Stats*

🧠 RAM: ${usedMem}MB / ${totalMem}MB
🖥️ Platform: ${os.platform()} (${os.arch()})
⚙️ Node: ${process.version}
📦 Commands loaded: ${unique}
⏱️ Uptime: ${Math.floor(process.uptime())}s`
        }, { quoted: msg });
    }
};
