// lib/commandLoader.js — recursively loads every command file from /commands
const fs = require('fs');
const path = require('path');

function loadCommands() {
    const commandsPath = path.join(__dirname, '..', 'commands');
    const commands = new Map();
    const categories = fs.readdirSync(commandsPath).filter(f =>
        fs.statSync(path.join(commandsPath, f)).isDirectory()
    );

    let total = 0;
    for (const category of categories) {
        const categoryPath = path.join(commandsPath, category);
        const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.js'));

        for (const file of files) {
            try {
                const cmd = require(path.join(categoryPath, file));
                if (!cmd || !cmd.name || typeof cmd.execute !== 'function') {
                    console.warn(`⚠️  Skipped invalid command file: ${category}/${file}`);
                    continue;
                }
                cmd.category = cmd.category || category;
                commands.set(cmd.name.toLowerCase(), cmd);
                if (Array.isArray(cmd.aliases)) {
                    for (const alias of cmd.aliases) {
                        commands.set(alias.toLowerCase(), cmd);
                    }
                }
                total++;
            } catch (err) {
                console.error(`❌ Failed to load command ${category}/${file}:`, err.message);
            }
        }
    }
    console.log(`✅ Loaded ${total} commands across ${categories.length} categories.`);
    return commands;
}

module.exports = { loadCommands };
