const axios = require('axios');

async function askGemini(apiKey, prompt, systemInstruction) {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
    const body = { contents: [{ parts: [{ text: prompt }] }] };
    if (systemInstruction) {
        body.system_instruction = { parts: [{ text: systemInstruction }] };
    }
    const { data } = await axios.post(url, body, {
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        timeout: 25000
    });
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
}

module.exports = { askGemini };
