const Discord = require('discord.js');


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
    return {
        toString: function() {
            return "*could not find emoji*";
        }
    };
}
exports.findMember = function(object, string) {
    let member = null;
    if (object instanceof Discord.Message && object.channel.guild) {
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
exports.isFromAdmin = function(msg){
	if(!msg.member)
		return true;
	
	return msg.member.hasPermission("administrator");
}
