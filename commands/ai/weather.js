const axios = require('axios');

module.exports = {
    name: 'weather',
    category: 'tools',
    description: 'Get current weather for a city: .weather Harare',
    execute: async (sock, msg, args, { jid, prefix }) => {
        const city = args.join(' ');
        if (!city) return sock.sendMessage(jid, { text: `Usage: ${prefix}weather <city>` }, { quoted: msg });

        try {
            const geo = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
                params: { name: city, count: 1 }, timeout: 15000
            });
            const place = geo.data?.results?.[0];
            if (!place) return sock.sendMessage(jid, { text: '❌ City not found.' }, { quoted: msg });

            const w = await axios.get('https://api.open-meteo.com/v1/forecast', {
                params: { latitude: place.latitude, longitude: place.longitude, current_weather: true },
                timeout: 15000
            });
            const cw = w.data.current_weather;

            await sock.sendMessage(jid, {
                text: `🌤️ *Weather in ${place.name}, ${place.country}*\n\n🌡️ Temp: ${cw.temperature}°C\n💨 Wind: ${cw.windspeed} km/h\n🕒 Updated: ${cw.time}`
            }, { quoted: msg });
        } catch (err) {
            await sock.sendMessage(jid, { text: '❌ Could not fetch weather right now.' }, { quoted: msg });
        }
    }
};
