module.exports = function(instance) {
    let Character = require('./game/character.js');
    let characters = new Map();
    return {
        add: function(msg, args) {
            if (args[0] === "character") {
                if (characters.has(msg.author.id)) {
                    msg.reply('but you already have a character!');
                }
                let newChar = new Character('Test', 'SPHEROMANCER', msg.author);
                characters.set(msg.author.id, newChar);
                msg.reply(`...!\nHere are your stats:\n${newChar.getStats()}`);
            }
        }
    };
}
