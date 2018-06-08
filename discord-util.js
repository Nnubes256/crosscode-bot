const Discord = require('discord.js');

let knownEmotes = {};
let manageServs = []; // cache
let roleBlacklist = [];
let roleWhitelist = [];
let roleAdmin = [];
exports.getAllEmotes = function(client) {
    //to minimize the possibility of spawning deleted emotes
    knownEmotes = {};
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

Array.prototype.listjoin = function(word) {
    if(this.length < 3)
        return this.join(` ${word} `);
    return `${this.slice(0, this.length - 1).join(", ")}, ${word} ${this[this.length - 1]}`;
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
    for(let admin of roleAdmin) {
      if(msg.member.roles.has(admin)) {
        return true;
      }
    }
    return false;
};

function discObjFind(obj, name) {
    let re = new RegExp(name.toString().trim(), 'i');
    let ret = obj.find(val => re.test(val.name));
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
//        console.log(server);

        retval.id = server.id;
        retval.greet = serverJson.greeting.replace(/\$PREFIX/g, process.env.BOT_PREFIX);
        for (let role in serverJson.channels) {
          if(!serverJson.channels[role]) continue;
          retval.chans[role] = exports.discObjFind(server.channels, serverJson.channels[role]);
        }

        if (serverJson.roles.pending) {
            for (let role of serverJson.roles.pending) {
              retval.pending.push(exports.discObjFind(server.roles, role));
            }
        }

        if (serverJson.roles.blacklist) {
            for (let role of serverJson.roles.blacklist) {
              roleBlacklist.push(exports.discObjFind(server.roles, role).id);
            }
        }

        if (serverJson.roles.whitelist) {
            for (let role of serverJson.roles.whitelist) {
                roleWhitelist.push(exports.discObjFind(server.roles, role).id);
            }
        }

        if (serverJson.roles.admin) {
            for(let role of serverJson.roles.admin) {
                roleAdmin.push(exports.discObjFind(server.roles, role).id);
            }
        }
        return retval;
    } catch(e) {
        console.log(e);
    }
    return null;
}
function findServer(msg) {
  for(let server of manageServs) {
     if(msg.guild.id === server.id) {
        return server;
     }
  }
}
exports.hasPending = function(msg) {
  return true;
  var server = findServer(msg);
  /*if(!Object.keys(server.pending)) {
     return true;
  }
  for(let pendingRole in server.pending) {
    if(msg.member.roles.has(pendingRole.id)) {
      return true;
    }
  }
   return false;*/
}
exports.removePending = function(msg, console) {
   var server = findServer(msg);
   console.log(server);
   if(server) {
     return msg.member.removeRoles(server.pending);
   }

  return msg.member;
}
exports.log = function(msg, message) {
  var server = findServer(msg);
  return server.chans["syslog"].send(message);
}
exports.getAllServers = function getAllServers(client, servers, console) {
    if(manageServs.length === 0)
        for (let json of servers)
        {
            let modServ = findModServer(client, json, console);
            if (modServ)
                manageServs.push(modServ);
        }
    return manageServs;
}
exports.updateServers = function(client, console) {
  try {
    var cachedServers = JSON.parse(JSON.stringify(manageServs));
    manageServs = [];
    this.getAllServers(client, cachedServers, console);
  }catch(e) {
    console.log(e);
  }
}
exports.getRoleBlacklist = function() {
    return roleBlacklist;
}
exports.getRoleWhitelist = function() {
    return roleWhitelist;
}
function getChanID(msg) {
  let first = msg.indexOf("chan:");
  if(first == -1) {
    return -1;
  }
  const cLen = "chan:".length;
  first += cLen;
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
   while(Array.isArray((chan = getChanID(msg)))) {
       let channel = exports.discObjFind(guild.channels, chan[1]) || "#invalid-channel";
       msg = msg.replace(new RegExp(chan[0], 'g'), channel.toString());
   }
   return msg;
}
exports.argParse = function(str) {
    let spl = [''], esc = false, quot = true;
    for (let c of str) {
        if (esc) { // last character was a backslash, skip handling
            esc = false;
            spl[spl.length - 1] += '\\' + c;
            continue;
        }
        switch(c) {
        case '\\':
            esc = true; // escape next character
            break;
        case '"':
            quot = !quot;
            break;
        case ' ':
        case '\t':
            if (quot && spl[spl.length - 1]) {
                spl.push(''); // split on unquoted spaces
                break;
            }
        default:
            spl[spl.length - 1] += c;
        }
    }
    return spl;
}
