const { Message, GuildMember } = require('discord.js');
const { Bot } = require('./bot');
const { Utils } = require('./utils');

class Module {
    /**
     * 
     * @param {Bot} bot 
     * @param {string?} help File that contains help data 
     */
    initialize(bot, help) {
        this.bot = bot;

        if(help) {
            this.help = Utils.generateHelp(help);
        }
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
     * @returns {{name: string, description: string}[]}
     */
    getHelp() {
        if(this.help !== undefined)
            return this.help;
        else 
            return null;
    }
}

exports.Module = Module;