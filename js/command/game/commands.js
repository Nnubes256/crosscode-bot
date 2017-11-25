module.exports = function(instance) {
    let Character = require('./game/character.js');
    let characters = new Map();
    return {
        add: function(msg, args) {
            if (args[0] === "character") {
                if (characters.has(msg.author.id)) {
                    msg.reply('but you already have a character!');
                    return;
                }
                var name = args[1];
                if (Character.isValidName(name)) {
                    msg.reply("not a valid name.");
                    return;
                }
                var className = Character.getClass(args[2]);
                if (className) {
                    msg.reply("not a valid class.");
                    return;
                }
                let newChar = new Character(name, className, msg.author);
                characters.set(msg.author.id, newChar);
                msg.reply(`...!\nHere are your stats:\n${newChar.getStats()}`);
            }
        }
    };
}
