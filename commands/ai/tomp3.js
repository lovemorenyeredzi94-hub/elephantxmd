const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const ffmpegPath = require('ffmpeg-static');
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

module.exports = {
    name: 'tomp3',
    aliases: ['toaudio'],
    category: 'converter',
    description: 'Reply to a video with .tomp3 to extract its audio',
    execute: async (sock, msg, args, { jid }) => {
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        const videoMsg = quoted?.videoMessage || msg.message?.videoMessage;
        if (!videoMsg) {
            return sock.sendMessage(jid, { text: 'Reply to a video with .tomp3' }, { quoted: msg });
        }

        const buffer = await downloadMediaMessage({ message: { videoMessage: videoMsg } }, 'buffer', {});
        const tmpIn = path.join(os.tmpdir(), `in_${Date.now()}.mp4`);
        const tmpOut = path.join(os.tmpdir(), `out_${Date.now()}.mp3`);
        fs.writeFileSync(tmpIn, buffer);

        await new Promise((resolve, reject) => {
            const ff = spawn(ffmpegPath, ['-i', tmpIn, '-vn', '-acodec', 'libmp3lame', tmpOut]);
            ff.on('close', code => code === 0 ? resolve() : reject(new Error('ffmpeg failed')));
        });

        await sock.sendMessage(jid, { audio: fs.readFileSync(tmpOut), mimetype: 'audio/mpeg' }, { quoted: msg });
        fs.unlinkSync(tmpIn);
        fs.unlinkSync(tmpOut);
    }
};
