const { getJson } = require('./helpers');

async function fetchWaifuImage(category) {
    const data = await getJson(`https://api.waifu.pics/sfw/${category}`);
    return data.url;
}

module.exports = { fetchWaifuImage };
