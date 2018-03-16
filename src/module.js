const { Message, GuildMember } = require('discord.js');
const { Bot } = require('./bot');

class Module {
    /**
     * 
     * @param {Bot} bot 
     */
    initialize(bot) {
        this.bot = bot;
    }
    
    /**
     * @returns {{command: (msg: Message, args: string[], command: string) => void}[]}
     */
    getCommands() {
        return null;
    }

    /**
     * 
     * @param {GuildMember} member 
     */
    onJoin(member) {

    }

    /**
     * 
     * @param {GuildMember} member 
     */
    onLeave(member) {

    }

    /**
     * 
     * @param {Message} oldMsg 
     * @param {Message} newMsg 
     */
    onUpdate(oldMsg, newMsg) {

    }

    /**
     * 
     * @param {Message} msg 
     */
    onDelete(msg) {

    }

    /**
     * @returns {{name: string, desciption: string}[]}
     */
    getHelp() {
        return null;
    }
}

exports.Module = Module;