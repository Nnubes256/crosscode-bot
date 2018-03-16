module.exports = function(instance, util) {
    let Character = require('./game.d/character.js');
    let Match = require('./game.d/match.js');
    let characters = new Map();
    let matches = new Map();
    let {
        findMember
    } = util;
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
                if (!className) {
                    msg.reply("not a valid class.");
                    return;
                }
                let newChar = new Character(name, className, msg.author);
                characters.set(msg.author.id, newChar);
                msg.reply(`...!\nHere are your stats:\n${newChar.getStats()}`);
            }
        },
        pvp: function(msg, args) {
            var challenger = characters.get(msg.author.id);
            if (!challenger) {
                msg.reply('you do not have a character.');
                return;
            }
            var member = findMember(msg, args[0]);
            if (!member) {
                msg.reply('could not find guild member.');
                return;
            }
            var target = characters.get(member.user.id);
            if (!target) {
                msg.reply('they do not have a character.');
                return;
            }
            if (target.isInPvp()) {
                return;
            }
            //this is just in case one or the other deals a finishing blow
            let newMatch = new Match(challenger, target, msg.channel);
            matches.set(msg.channel.id, newMatch);
            msg.channel.send(`${challenger.getName()} is now fighting ${target.getName()}!`);
        },
        attack: function(msg, args) {
            //should probably break up error checking..
            var activeMatch = matches.get(msg.channel.id);
            if (!activeMatch) {
                return;
            }
            let member = activeMatch.findPlayer(msg.author.id);
            if (!member) {
                return;
            }
            if (!activeMatch.isTurn(member)) {
                msg.reply('it is not your turn.');
                return;
            }
            let target = findMember(msg, args[0]);
            if (!target) {
                return;
            }
            target = activeMatch.findPlayer(target.id);
            if (!target) {
                msg.reply('target is not playing a pvp.');
                return;
            }
            activeMatch.attackSequence(target);
            if (activeMatch.hasWinner()) {
                activeMatch.endMatch();
                matches.delete(msg.channel.id);
                return;
            }
            activeMatch.nextTurn();
            msg.reply(`It is now ${activeMatch.getTurnName()}`);
        },
        stats: function(msg) {
            var character = characters.get(msg.author.id);
            if (!character) {
                return;
            }
            msg.channel.send(character.getStats());
        }
    };
}