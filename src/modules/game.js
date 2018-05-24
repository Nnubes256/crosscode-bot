const { Module } = require('../module');
const { Character } = require('./game.d/character.js');
const { Match } = require('./game.d/match.js');

const { Message } = require('discord.js');

class Game extends Module{
    constructor() {
        super();
        /** @type {Map<string, Character>} */
        this.characters = new Map();
        /** @type {Map<string, Match>} */
        this.matches = new Map();
    }

    getCommands(){
        return {
            /**
             * @param {Message} msg
             * @param {string[]} args
             */
            add: (msg, args) => {
                if (args[0] === 'character') {
                    if (this.characters.has(msg.author.id)) {
                        msg.reply('but you already have a character!');
                        return;
                    }
                    const name = args[1];
                    if (Character.isValidName(name)) {
                        msg.reply('not a valid name.');
                        return;
                    }
                    const className = Character.getClass(args[2]);
                    if (!className) {
                        msg.reply('not a valid class.');
                        return;
                    }
                    const newChar = new Character(name, className, msg.author);
                    this.characters.set(msg.author.id, newChar);
                    msg.reply(`...!\nHere are your stats:\n${newChar.getStats()}`);
                }
            },
            /**
             * @param {Message} msg
             * @param {string[]} args
             */
            pvp: (msg, args) => {
                const challenger = this.characters.get(msg.author.id);
                if (!challenger) {
                    msg.reply('you do not have a character.');
                    return;
                }
                const member = this.findMember(msg, args[0]);
                if (!member) {
                    msg.reply('could not find guild member.');
                    return;
                }
                const target = this.characters.get(member.user.id);
                if (!target) {
                    msg.reply('they do not have a character.');
                    return;
                }
                if (target.isInPvp()) {
                    return;
                }
                //this is just in case one or the other deals a finishing blow
                const newMatch = new Match(challenger, target, msg.channel);
                this.matches.set(msg.channel.id, newMatch);
                msg.channel.send(`${challenger.getName()} is now fighting ${target.getName()}!`);
            },
            /**
             * @param {Message} msg
             * @param {string[]} args
             */
            attack: (msg, args) => {
                //should probably break up error checking..
                const activeMatch = this.matches.get(msg.channel.id);
                if (!activeMatch) {
                    return;
                }
                const member = activeMatch.findPlayer(msg.author.id);
                if (!member) {
                    return;
                }
                if (!activeMatch.isTurn(member)) {
                    msg.reply('it is not your turn.');
                    return;
                }
                let target = msg.mentions.users.first();
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
                    this.matches.delete(msg.channel.id);
                    return;
                }
                activeMatch.nextTurn();
                msg.reply(`It is now ${activeMatch.getTurnName()}`);
            },
            /**
             * @param {Message} msg
             */
            stats: (msg) => {
                const character = this.characters.get(msg.author.id);
                if (!character) {
                    return;
                }
                msg.channel.send(character.getStats());
            }
        };
    }

    getHelp() {
        return [
            { name: 'add', description: '' },
            { name: 'pvp', description: '' },
            { name: 'attack', description: '' },
            { name: 'stats', description: '' }
        ];
    }
}

exports.game = new Game();