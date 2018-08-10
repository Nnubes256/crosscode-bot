const { RichEmbed } = require('discord.js');
const rp = require('request-promise');

class Utils {
    static createRichEmbed(opts) {
        let richEmbed = new RichEmbed;
        if (opts.fields) {
            let fields = opts.fields.concat([]);
            //to get the first 25 fields
            fields = fields.splice(0, 25);
            fields.forEach(function(field) {
                richEmbed.addField(field.name, field.value);
            });
        }
    		if(opts.color) {
    			var color = opts.color;
    			if(typeof color === "string") {
    				if(color.startsWith("#")) {
    					var colorToDec = Number(`0x${color.substr(1)}`);
    					richEmbed.setColor(colorToDec);
    				}
    			}
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
    static fetch(options) {
      return new rp(options);
    }
}
module.exports = Utils;
