const { Client, GuildMember, Message} = require('discord.js');
const { Config } = require('./config');
const { Module } = require('./module');

import CommandManager from './command-manager';

class Bot {

    /**
     *
     * @param {Env} env
     * @param {Config} config
     */
    constructor(env, config) {
        this.client = new Client();
        this.prefix = evn.prefix;
        this.token = evn.token;
        this.config = config;
        this.cmdManager = new CommandManager();
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
        //no bots allowed to message
        const matchPrefix = /^(.*?)\s/;
        let message = msg.content;
        let prefix = message.match(matchPrefix);
        if(prefix === this.prefix) {
          this.cmdManager.onMessage(msg, message.replace(prefix, ""));
        }
    }

    ready() {
        this.config.init(this.client);

        for (let module of Object.keys(this.config.commands)){
            this.config.commands[module].initialize(this, this.cmd,this.console);
        }
        //util.getAllEmotes(this.client);
        console.log(`Logged in as ${this.client.user.tag}!`);
        this.newGame();
        setInterval(this.newGame.bind(this), 2 * 60 * 1000);
    }
    /**
     * @param {GuildMember} member
    */
    guildMemberAdd(member) {
        for (let module of Object.keys(this.config.commands)){
            this.config.commands[module].onJoin(member);
        }
    }

    /**
     * @param {GuildMember} member
    */
    guildMemberRemove(member) {
        for (let module of Object.keys(this.config.commands)){
            this.config.commands[module].onLeave(member);
        }
    }

    /**
     * @param {Message} oldMsg
     * @param {Message} newMsg
    */
    messageUpdate(oldMsg, newMsg) {
        for (let module of Object.keys(this.config.commands)){
            this.config.commands[module].onUpdate(oldMsg, newMsg);
        }
    }

    /**
     *
     * @param {Message} msg
     */
    messageDelete(msg) {
        for (let module of Object.keys(this.config.commands)){
            this.config.commands[module].onDelete(msg);
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

    /**
     *
     * @param {GuildMember} author
     * @param {string[]} args
     */
    printHelp(author, args) {
        let result = '```\r\n';
        const defaultModule = this.config["default-module"];

        if(args.length === 0) {
            args = this.config.modules; // Get help for all modules if not specified
        }

        for(let name of args) {
            /** @type {Module} */
            const module = this.config.commands[name]; // Get module
            if(module) { // Check if it exists in case user misspelled
                const helpMatrix = module.getHelp();

                if(helpMatrix) { // Check if help is avaible
                    for(let line of helpMatrix) {
                        result += this.prefix;

                        if(name !== defaultModule) {
                            result += '-' + name + ' ';
                        }

                        result += line.name + ' - ' + line.desciption + '\r\n'; //TODO: add some padding for the looks
                    }
                }
            }
        }

        author.send(result + '```');
    }
}

exports.Bot = Bot;
