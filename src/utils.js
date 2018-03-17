const { RichEmbed, MessageEmbed } = require('discord.js');

class Utils {
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
}

exports.Utils = Utils;