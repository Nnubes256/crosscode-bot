const Discord = require('discord.js');

let knownEmotes = {
	"leaCheese": 257888171772215296,
	"emilieWhy": 337989242674479105,
	"apolloPoint": 337987749011259392,
	"apolloShout": 337987748675715076
};

function filterUserId(id) {
    return id.replace(/[^0-9]/g, "")
}

function isId(id) {
    return (id.startsWith("<@") || id.startsWith("<@!")) && id.endsWith(">")
}

exports.getEmoji = function(object, name) {
    let emojis = null
    //Weird error can not find emojis of undefined
    if (object instanceof Discord.Message && object.channel.guild) {
        emojis = object.channel.guild.emojis.find("name", name)
        if (emojis)
            return emojis
    }
    let emoteId = knownEmotes[name];
    if (emoteId !== undefined)
        return {
            toString: function() {
                return `<:${name}:${emoteId}>`;
            }
        };
    return {
        toString: function() {
            return "*could not find emoji*";
        }
    };
}
exports.findMember = function(object, string) {
    let member = null;
    if (string && object instanceof Discord.Message && object.channel.guild) {
        if (isId(string)) {
            string = filterUserId(string)
        }
        member = object.channel.guild.members.find(function(item) {
            return item.user.username.indexOf(string) > -1 || item.user.id.indexOf(string) > -1;
        })
    }
    return member;
}
exports.createRichEmbed = function(opts) {
    let richEmbed = new(Discord.RichEmbed || Discord.MessageEmbed);
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
}
exports.getHelpText = function(obj, type) {
    let commands = Object.keys(obj)
    let helpText = commands.reduce(function(str, command) {
        if (command) {
            str += `- ${process.env.BOT_PREFIX}${type? ' -' + type : ''} ${command}` + '\n'
        }
        return str
    }, "```diff\n") + '```'
    return `${helpText}`
}
exports.isFromAdmin = function(msg) {
    let adminPosition = msg.member.guild.roles.size - 1;
    return msg.member.highestRole.position === adminPosition;
}
