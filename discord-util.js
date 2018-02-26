const Discord = require('discord.js');

let knownEmotes = {};

exports.getAllEmotes = function(client) {
    client.emojis.array().forEach(function(emote) {
        if(emote.animated)
            return;
        var name = emote.name;
        for (var i = 1; knownEmotes[name]; i++) {
            name = emote.name + i;
        }
        knownEmotes[name] = {
            id: emote.id,
            guildId: emote.guild.id,
            name: emote.name
        };
    });
};

exports.getCacheEmotesIds = function(guildId) {
    var ids = [];
    for (var i in knownEmotes) {
        var emote = knownEmotes[i];
        //since o
        if (!emote.animated || (guildId !== undefined && emote.animated && emote.guidId === guidID)) {
            ids.push(i);
        }
    }
    return ids;
};

function filterUserId(id) {
    return id.replace(/[^0-9]/g, "");
}

function isId(id) {
    return (id.startsWith("<@") || id.startsWith("<@!")) && id.endsWith(">")
}

exports.getEmote = function(object, name) {
    //just in case for unintentional whitespace
    name = name.trim();
    let emote = knownEmotes[name];
    if (emote && emote.id !== undefined) {
        return {
            id: emote.id,
            toString: function() {
                return `<:${emote.name}:${emote.id}>`;
            }
        };
    }
    //Weird error can not find emojis of undefined
    // don't think we need this anymore -alwinfy
/*
    let emojis = null;
    if (object instanceof Discord.Message && object.guild !== undefined) {
        emojis = object.guild.emojis.find("name", name);
        if (emojis)
            return emojis;
    }
*/
    //console.debug(`Warning: unknown emoji "${name}"`);
    return {
        id: "",
        toString: function() {
            return "*could not find emoji*";
        }
    };
};

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
};

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
};

exports.formatHelpText = function(prefix, suffix, helpText) {
    return `\`\`\`md\n${helpText.replace(/^#.*\n/mg, '').replace(/\{%/g, prefix + ' ').replace(/%}/g, suffix)}\n\`\`\``;
};

exports.isFromAdmin = function(msg) {
    let adminPosition = msg.member.guild.roles.size - 1;
    return msg.member.highestRole.position === adminPosition;
};
