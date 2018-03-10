const Discord = require('discord.js');

let knownEmotes = {};
let manageServs = []; // cache
let roleBlacklist = [];
let roleWhitelist = [];
exports.getAllEmotes = function(client) {
    client.emojis.array().forEach(function(emote) {
        if (emote.animated)
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
    let emojis = null;
    if (object instanceof Discord.Message && object.guild !== undefined) {
        emojis = object.guild.emojis.find("name", name);
        if (emojis)
            return emojis;
    }
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

exports.formatHelpText = function(invoc, helpText) {
    let prefix = invoc.replace(/\s[^\s]+$/, '');
    return `\`\`\`md\n${helpText.replace(/^#.*\n/mg, '').replace(/INVOC/g, prefix)}\n\`\`\``;
};

exports.isFromAdmin = function(msg) {
    let adminPosition = msg.member.guild.roles.size - 1;
    return msg.member.highestRole.position === adminPosition;
};

function discObjFind(obj, name) {
    let ret = obj.find(val => val.name.match(name));
    if (obj && name && ret)
        return ret;
    else
        throw `Could not find ${name} in ${obj}`;
}
exports.discObjFind = function(obj, name) {
    try {
        return discObjFind(obj, name);
    } catch(e) {
        console.log(e);
    }
    return null;
}
function findModServer(client, serverJson, console) {
    let retval = {id: "", chans: {}, pending: []};
    try {
        let server = discObjFind(client.guilds, serverJson.name);
        console.log(server);

        retval.id = server.id;
        retval.greet = serverJson.greeting.replace(/\$PREFIX/g, process.env.BOT_PREFIX);
        for (let role in serverJson.channels) {
          retval.chans[role] = discObjFind(server.channels, serverJson.channels[role]);
        }

        for (let role of serverJson.roles.pending) {
          retval.pending.push(discObjFind(server.roles, role));
        }

        for (let role of serverJson.roles.blacklist) {
          roleBlacklist.push(discObjFind(server.roles, role).id);
        }

        for (let role of serverJson.roles.whitelist) {
          try {
            roleWhitelist.push(discObjFind(server.roles, role).id);
          } catch(e) {
            console.log("In whitelist:", e);
          }

        }
        return retval;
    } catch(e) {
        console.log(e);
    }
    return null;
}
exports.getAllServers = function(client, servers, console) {
    if(manageServs.length === 0)
        for (let json of servers)
        {
            let modServ = findModServer(client, json, console);
            if (modServ)
                manageServs.push(modServ);
        }
    return manageServs;
}
exports.getRoleBlacklist = function() {
    return roleBlacklist;
}
exports.getRoleWhitelist = function() {
    return roleWhitelist;
}
function getChanID(msg) {
  const cLen = "chan:".length;
  let first = msg.indexOf("chan:") + cLen;
  if(first == -1) {
    return -1;
  }
  let last = first;
  var res = msg.indexOf(" ", first);
  if(res > -1) {
    last = res;
  } else {
    last = msg.length;
  }
  return [msg.substring(first - cLen, last), msg.substring(first, last)];
}
exports.greetingsParse = function(guild, msg) {
   var chan;
   while((chan = getChanID(msg)).length) {
       let channel = guild.channels.find('name', chan[1]) || "#invalid-channel";
       msg = msg.replace(new RegExp(chan[0], 'g'), channel.toString());
   }
   return msg;
}
