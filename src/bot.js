const { Client, GuildMember, Message} = require('discord.js');
const { Config } = require('./config');
const { Module } = require('./module');

class Bot {
    /**
     * 
     * @param {string} prefix 
     * @param {string} token 
     * @param {Config} config 
     */
    constructor(prefix, token, config) {
        this.client = new Client();
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
        this.client.on('error', this.error.bind(this));
        this.client.login(this.token).catch(error => {
            console.error("Could not connect to discord: ", error);
        });
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
        if (!module)
            return;

        let command = args.shift();

        if (command === "help") {
            return this.printHelp(msg.author, args);
        }

        let func = module.getCommands()[command];
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
        this.config.init(this.client);

        for (let module of Object.keys(this.config.commands)){
            this.config.commands[module].initialize(this);
        }
        
        //util.getAllEmotes(this.client);
        console.log('Logged in as %s on:', this.client.user.tag);
        for (let guild of this.client.guilds.values()) {
            console.log('- %s', guild.name);
        }
        this.newGame();
        this.client.setInterval(this.newGame.bind(this), 2 * 60 * 1000); // Used this.client.setInterval to avoid conflicts when restarting
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
function argParse(str) {
}
    getMessageArgs(msg) {
        msg = msg.replace(/^\s+|\s+$/g, ''); // Remove leading and trailing whitespace

        if (!msg.startsWith(this.prefix))
            return null;

	return msg.substr(this.prefix.length)
               .replace(/(^|.)"/g, (match, one) => (one + (one === '\\' ? '' : '\0') + '"')).split('\0"') // split on parts
	       .map((val, idx) => (idx & 1 ? val : val.replace(/[ \t]+/g, '\0'))).join('"').split('\0'); // rejoin
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
                console.error(new Error(`Could not find module ${type}`));
                return;
            }
            args.shift();
        }

        return this.config.commands[type];
    }

    newGame() {
        const ran = this.config.activities.random();
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
        
                        result += line.name + ' - ' + line.description + '\r\n'; //TODO: add some padding for the looks
                    }
                }
            }
        }

        author.send(result + '```');
    }

    /**
     * 
     * @param {Error} err 
     */
    error(err) {
        console.error(err);
        console.log('Restarting');
        
        this.client.destroy().then(() => {
            this.client.login(this.token);
        })
    }
}

exports.Bot = Bot;
