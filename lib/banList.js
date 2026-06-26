// lib/banList.js — shared in-memory store so ban.js and unban.js agree
const bannedUsers = new Set();
module.exports = { bannedUsers };
