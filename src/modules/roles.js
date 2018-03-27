//TODO: restructure
const { Module } = require('../module');
const { Utils } = require('../utils');
const { Message, Role } = require('discord.js');

class Roles extends Module {
    getCommands() {
        return {
            /**
             *  @param {Message} msg 
             *  @param {string[]} args
             * */
            add: (msg, args) => {
                const roles = msg.guild.roles.filterArray(r => args.join(" ").split(",").includes(r.name))
                    .filter(r => this.getWhitelist(msg).includes(r));
                const dupRoles = msg.member.roles.array().filter(r => roles.includes(r));
                const newRoles = roles.filter(r => !dupRoles.includes(r));

                if (newRoles.length === 0) {
                    msg.channel.send(`Could not add any new roles.`);
                    return;
                }

                msg.member.addRoles(newRoles).then(member => {
                    if (this.hasPending(member)) {
                        return this.removePending(member);
                    }
                    return member;
                }).then(member => {
                    if (newRoles.length) {
                        const newRolesName = newRoles.map(r => r.name).join('and');
                        this.log(msg, `Added ${newRolesName} to ${member}`);
                        const dupRolesName = dupRoles.map(r => r.name).join('and');
                        let retMessage = `${msg.author} is now ${newRolesName}.`;
                        if (dupRoles.length) {
                            retMessage += `\nAlready had ${dupRolesName}`;
                        }
                        msg.channel.send(retMessage);
                    }
                }).catch(err => {
                    msg.channel.send('Encountered an error. Could not add role.');
                    console.error(err);
                });
            },
            /**
             * @param {Message} msg
             */
            get: msg => {
                msg.channel.send("```\n" + this.getWhitelist(msg).map(r => r.name).join("\n") + "```");
            },
            /**
             *  @param {Message} msg 
             *  @param {string[]} args
             * */
            rm: (msg, args) => {
                const whitelist = this.getWhitelist(msg);
                const requested = args.join(" ").split(",");
                const roles = whitelist.filter(r => requested.includes(r.name));
                if (roles.length) {
                    msg.member.removeRoles(roles).then(member => {
                        const oldRoles = roles.map(r => r.name).join('and');
                        msg.channel.send(`${msg.author} is no longer ${oldRoles}`);
                        this.log(msg, `Removed ${oldRoles} from ${member}`);
                    }).catch(err => {
                        msg.channel.send('Encountered an error. Could not remove role.');
                        console.log(err);
                    });
                } else {
                    msg.reply('could not find role');
                }
            }
        };
    }

    /**
     * 
     * @param {Message} msg 
     * @returns {Role[]}
     */
    getWhitelist(msg) {
        for(let server of this.bot.config.servers) {
            if(msg.member.guild.id === server.id) {
                return server.whitelist;
            }
        }
    }

    hasPending(member) {
        console.info('Pending is no longer supported')
        return false;
    }

    removePending(member) {
        console.warn('Pending is no longer supported')
        return member;
    }

    /**
     * 
     * @param {string} msg 
     * @param {string} text
     */
    log(msg, text) {
        for(let server of this.bot.config.servers) {
            if(msg.member.guild.id === server.id) {
                server.chans.syslog.send(text);
            }
        }
    }
}

exports.roles = new Roles();