const Discord = require('discord.js')
exports.getEmoji = function(object, name) {
    let emojis = null
    if (object instanceof Discord.Message) {
        emojis = object.channel.guild.emojis
    }
    return emojis.find("name", name) || `:${name}:`
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
