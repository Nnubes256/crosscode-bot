const { Module } = require('../module');
const { GuildMember, Message } = require('discord.js');
const { Utils } = require('../utils');

class Log extends Module{
    
    /**
     * 
     * @param {GuildMember} member 
     */
    onJoin(member) {
        for (let server of this.bot.config.servers) {
            if (member.guild.id === server.id) {
                if(server.pending.length) {
                    member.addRoles(server.pending).catch(err => console.error(err));
                    server.chans.syslog.send(`Added ${server.pending[0].name} role to ${member}`);
                    var newGreet = util.greetingsParse(member.guild, server.greet);
                    server.chans.greet.send(`${member}, ${newGreet}`);
                }
                break;
            }
        }
    }

    /**
     * 
     * @param {GuildMember} member 
     */
    onLeave(member) {
        for (let server of this.bot.config.servers) {
            if (member.guild.id === server.id) {
                if(!server.chans.editlog)
                    break;

                server.chans.editlog.send('', Utils.createRichEmbed({
                    description: `${member} left the server`,
                    fields: [
                        { name: "Had roles", value: member.roles.array().join('\r\n') }
                    ],
                    author: {
                        name: member.user.tag,
                        icon: member.user.avatarURL
                    },
                    timestamp: new Date()
                })).catch(err => console.error(err));
    
                break;
            }
        }
    }

    
    /** 
     * @param {Message} oldMsg
     * @param {Message} newMsg
    */
    onUpdate(oldMsg, newMsg) {
        if(oldMsg.author.bot)
            return;

        for (let server of this.bot.config.servers) {
            if (oldMsg.guild.id === server.id) {
                if(!server.chans.editlog)
                    break;

                server.chans.editlog.send('', Utils.createRichEmbed({
                    description: `${oldMsg.author} updated a message in ${oldMsg.channel}`,
                    fields: [
                        { name: "From", value: oldMsg.content },
                        { name: "To", value: newMsg.content }
                    ],
                    author: {
                        name: oldMsg.author.tag,
                        icon: oldMsg.author.avatarURL
                    },
                    timestamp: new Date()
                })).catch(err => console.error(err));
                break;
            }
        }
    }
    
    /**
     * 
     * @param {Message} msg 
     */
    onDelete(msg) {
        if(msg.author.bot)
            return;

        for (let server of this.bot.config.servers) {
            if (msg.guild.id === server.id) {
                if(!server.chans.editlog)
                    break;
    
                server.chans.editlog.send('', Utils.createRichEmbed({
                    description: `${msg.author}'s message was deleted in ${msg.channel}`,
                    fields: [
                        { name: "Content", value: msg.content }
                    ],
                    author: {
                        name: msg.author.tag,
                        icon: msg.author.avatarURL
                    },
                    timestamp: new Date()
                })).catch(err => console.error(err));
                break;
            }
        }
    }

}

exports.log = new Log();