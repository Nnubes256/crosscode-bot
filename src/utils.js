const { RichEmbed, MessageEmbed } = require('discord.js');

class Utils {
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
        opts.timestamp && richEmbed.setTimestamp(opts.timestamp);
        opts.description && richEmbed.setDescription(opts.description);
        opts.image && richEmbed.setImage(opts.image);
        opts.title && richEmbed.setTitle(opts.title);
        opts.author && richEmbed.setAuthor(opts.author);
        opts.url && richEmbed.setURL(opts.url);
        opts.footer && opts.footer.text && richEmbed.setFooter(opts.footer.text);
        return richEmbed;
    };
}

exports.Utils = Utils;