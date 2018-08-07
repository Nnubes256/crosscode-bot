const { Module } = require('../module');
const { GuildMember, Message } = require('discord.js');
const { Utils } = require('../utils');

class Log extends Module {

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

                server.chans.editlog.send(`Member left the server: ${member}`, Utils.createRichEmbed({
                    fields:[{
                        name:"Had roles",
                        value: member.roles.array().join('\r\n')
                    }]
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

                server.chans.editlog.send(`Member updated message in ${oldMsg.channel}: ${oldMsg.author}`, Utils.createRichEmbed({
                    fields: [
                        { name: "From", value: oldMsg.content },
                        { name: "To", value: newMsg.content }
                    ]
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
        if(true || msg.author.bot)
            return;

        /**for (let server of manageServs) {
            if (msg.guild.id === server.id) {
                if(!server.chans.editlog)
                    break;

                    server.chans.editlog.send(`A message was deleted in ${msg.channel}: ${msg.author}`, Utils.createRichEmbed({
                    fields: [
                        { name: "Content", value: msg.content }
                    ]
                })).catch(err => console.error(err));
                break;
            }
        }*/
    }

}

exports.log = new Log();
