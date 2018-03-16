const { Client, GuildMember, Message} = require('discord.js');
const { Config } = require('./config');

export class Bot {
    /** @type {string} */ prefix = null;
    /** @type {string} */ token = null;
    client = new Client();
    config = null;

    /**
     * 
     * @param {string} prefix 
     * @param {string} token 
     * @param {Config} config 
     */
    constructor(prefix, token, config) {
        this.prefix = prefix;
        this.token = token;
        this.config = config;

        this.init();
    }

    init() {
        this.client.on('ready', this.ready.bind(this));
        this.client.on('guildMemberAdd', this.guildMemberAdd.bind(this));
        this.client.on('guildMemberRemove', this.guildMemberRemove.bind(this));
        this.client.on('messageUpdate', this.messageUpdate.bind(this));
        this.client.on('messageDelete', this.messageDelete.bind(this));
        this.client.on('message', this.onMessage.bind(this));
        this.client.login(this.token);
    }

    /**
     * 
     * @param {Message} msg 
     */
    onMessage(msg) {
        if (msg.content.toLowerCase().startsWith("failed to load")) {
            msg.channel.send("oof");
            return;
        }

        let args = this.getMessageArgs(msg.content);
        if (!args)
            return;

        let module = this.getModule(args);
        let command = args.shift();

        if (command === "help") {
            msg.author.send(util.formatHelpText(invoc, helpText[type]));
            return;
        }

        let func = module[command];
        if (func) {
            new Promise((resolve, reject) => {
                try {
                    resolve(func(msg, args, command));
                } catch (err) {
                    reject(err);
                }
            }).then(function(res) {}, function(err) {
                console.error(err);
            });
        } else {
            //TODO: function not found
        }
    }

    ready() {
        manageServs = util.getAllServers(this.client, servers, console);
        util.getAllEmotes(this.client);
        console.log(`Logged in as ${this.client.user.tag}!`);
        this.newGame();
        setInterval(this.newGame.bind(this), 2 * 60 * 1000);
    }

    /** 
     * @param {GuildMember} newMember
    */
    guildMemberAdd(newMember) {
        for (let serv of manageServs) {
            if (newMember.guild.id === serv.id) {
                if(serv.pending.length) {
                  newMember.addRoles(serv.pending).catch(console.log);
                  serv.chans.syslog.send(`Added ${serv.pending[0].name} role to ${newMember}`);
                  var newGreet = util.greetingsParse(newMember.guild, serv.greet);
                  serv.chans.greet.send(`${newMember}, ${newGreet}`);
                }
                break;
            }
        }
    }

    /** 
     * @param {GuildMember} member
    */
    guildMemberRemove(member) {
        for (let serv of manageServs) {
            if (member.guild.id === serv.id) {
                if(!serv.chans.editlog)
                    break;
                try {
                  serv.chans.editlog.send(`Member left the server: ${member}`, util.createRichEmbed({
                      fields:[{
                          name:"Had roles",
                          value: member.roles.array().join('\r\n')
                      }]
                  })).catch(console.log);
                }catch(e) {
                  console.log(e);
                }
    
                break;
            }
        }
    }

    /** 
     * @param {Message} oldMsg
     * @param {Message} newMsg
    */
    messageUpdate(oldMsg, newMsg) {
        var author = oldMsg.author;
        if(author.bot)
            return;

        for (let serv of manageServs) {
            if (oldMsg.guild.id === serv.id) {
                if(!serv.chans.editlog)
                    break;
    
                serv.chans.editlog.send(`Member updated message in ${oldMsg.channel}: ${author}`, util.createRichEmbed({
                    fields: [
                        { name: "From", value: oldMsg.content },
                        { name: "To", value: newMsg.content }
                    ]
                })).catch(console.log);
                break;
            }
        }
    }

    /**
     * 
     * @param {Message} msg 
     */
    messageDelete(msg) {
        var author = msg.author;
        if(author.bot)
            return;
        for (let serv of manageServs) {
            if (msg.guild.id === serv.id) {
                if(!serv.chans.editlog)
                    break;
    
                serv.chans.editlog.send(`A message was deleted in ${msg.channel}: ${author}`, util.createRichEmbed({
                    fields: [
                        { name: "Content", value: msg.content }
                    ]
                })).catch(console.log);
                break;
            }
        }
    }

    /**
     * 
     * @param {string} msg 
     * @returns {string[]}
     */
    getMessageArgs(msg) {
        msg = msg.replace(/^\s+|\s+$/g, ''); // Remove leading whitespace

        if (!msg.startsWith(this.prefix))
            return null;

        msg = msg.substr(this.prefix.length);
        return msg.replace(/^\s+|\s+$/g, '').split(/[ \t]+/);
    }

    /** 
     * @param {string[]} args
     * @returns {Module}
    */
    getModule(args) {
        let type = this.config["default-module"];
        if (args[0] && args[0].startsWith("-")) {
            type = args[0].substring(1);
            if (!this.config.commands[type]) {
                onError(msg); // onError not defined?
                return;
            }
            args.shift();
        }

        return this.config.commands[type];
    }

    newGame() {
        var ran = this.config.activities.random();
        this.client.user.setPresence({
            game: ran
        });
    };
}

