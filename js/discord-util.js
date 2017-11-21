const Discord = require('discord.js')
exports.getEmoji = function(object, name) {
    let emojis = null
    if (object instanceof Discord.Message) {
        emojis = object.channel.guild.emojis
    }
    return emojis.find("name", name) || ({
        toString: function() {
            return `*emojiNotFound*`
        }
    });
}

function filterUserId(id) {
    return id.replace(/[^0-9]/g, "")
}

function isId(id) {
    return (id.startsWith("<@") || id.startsWith("<@!")) && id.endsWith(">")
}
exports.findMember = function(object, string) {
    let member = null;
    if (object instanceof Discord.Message) {
        if (isId(string)) {
            string = filterUserId(string)
        }
        member = object.channel.guild.members.find(function(item) {
            return item.user.username.indexOf(string) > -1 || item.user.id.indexOf(string) > -1
        })
    }
    return member;
}

exports.createRichEmbed = function(opts) {
    let richEmbed = new(Discord.RichEmbed || Discord.MessageEmbed);
    opts.description && richEmbed.setDescription(opts.description)
    opts.image && richEmbed.setImage(opts.image)
    opts.title && richEmbed.setTitle(opts.title)
    opts.author && richEmbed.setAuthor(opts.author)
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
