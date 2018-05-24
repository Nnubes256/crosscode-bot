const { RichEmbed, MessageEmbed, GuildMember, Client } = require('discord.js');
const { Config } = require('./config');
const { Bot } = require('./bot');

/** @type {Config} */
let config = undefined;
/** @type {Client} */
let client = undefined;

class Utils {

    /**
     * 
     * @param {Bot} bot 
     */
    static init(bot) {
        config = bot.config;
        client = bot.client;
    }

    /**
     * 
     * @param {*} opts
     * @returns {RichEmbed | MessageEmbed} 
     */
    static createRichEmbed(opts) {
        let richEmbed = new(RichEmbed || MessageEmbed);
        if (opts.fields) {
            let fields = opts.fields.concat([]);
            //to get the first 25 fields
            fields = fields.splice(0, 25);
            fields.forEach(function(field) {
                richEmbed.addField(field.name, field.value);
            });
        }

        if(opts.author) {
            if(opts.author.name) {
                richEmbed.setAuthor(opts.author.name, opts.author.icon, opts.author.url);
            } else {
                richEmbed.setAuthor(opts.author);
            }
        }

        opts.timestamp && richEmbed.setTimestamp(opts.timestamp);
        opts.description && richEmbed.setDescription(opts.description);
        opts.image && richEmbed.setImage(opts.image);
        opts.title && richEmbed.setTitle(opts.title);
        opts.url && richEmbed.setURL(opts.url);
        opts.footer && opts.footer.text && richEmbed.setFooter(opts.footer.text);
        return richEmbed;
    };

    /**
     * @param {GuildMember} user
     * @returns {boolean}
     */
    static isAdmin(user) {
        for(let server of config.servers) {
            if(user.guild.id === server.id) {
                return server.admin.some(r => user.roles.array().some(a => a.id === r.id))
            }
        }

        return true;
    }

    /**
     * 
     * @param {string} name 
     */
    static getEmote(name) {
        const emote = client.emojis.find("name", name);
        if(emote)
            return emote;


        for(let guild of client.guilds.values()) {
            const emoji = guild.emojis.find("name", name);
            if (emoji)
                return emoji;
        }
        //console.debug(`Warning: unknown emoji "${name}"`);
        return {
            id: "",
            toString: function() {
                return "*could not find emoji*";
            }
        };
    }
}

exports.Utils = Utils;