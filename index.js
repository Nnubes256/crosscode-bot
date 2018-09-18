const Discord = require("discord.js");
const client = new Discord.Client();

let {
    readFileSync
} = require('fs');
let util = require('./discord-util.js');
const fetch = require('node-fetch');
if(!process.env.BOT_PREFIX) {
  var env = readFileSync('.env', 'utf8').split("\n");
  env.forEach(function(element) {
      if(!element)
          return;
      var token = element.split("=");
      process.env[token[0]] = token[1];
  });
}

let prefix = process.env.BOT_PREFIX;
let configuration = JSON.parse(readFileSync("./config.json"));

let servers = configuration["role-servers"];
let manageServs;
let cmdTypes = configuration.modules;
let commands = {};
let helpText = {};
for (let type of cmdTypes) {
    commands[type] = require(`./modules/${type}.js`)(client, util, configuration, console);
    //TODO: Add help text for each function
    helpText[type] = readFileSync(`./help/${type}.txt`).toString();
}
Array.prototype.random = Array.prototype.random || function() {
    return this[parseInt(Math.random() * this.length)];
}

let activities = [];
for(let act of configuration.activities)
{
    act.type = configuration["activity-types"].indexOf(act.type);
    activities.push(act);
}

/*function newGame() {
    var ran = activities.random();
    client.user.setPresence({
        game: ran
    });
};*/

function countDown() {
  let releaseDate = new Date('Thu, 20 Sep 2018 20:00:00 GMT+02:00');
  let currentDate = new Date();
  let diffDays = Math.ceil((releaseDate - currentDate)/ 86400000);
  let diffHrs = Math.ceil((releaseDate - currentDate)/ 1440000);

  client.user.setPresence({
      game: {
          type: 3,
          name: diffDays > 1
            ? `the calendar - ${diffDays} days left!`
            : diffHrs > 1
              ? `the clock - ${diffHrs} hours left!`
              : 'RFG\'s website - just a few minutes to go!!'
      }
  });
}
client.on('ready', () => {
    manageServs = util.getAllServers(client, servers, console);
    util.getAllEmotes(client);
    console.log(`Logged in as ${client.user.tag}!`);
    countDown();
    setInterval(countDown, 2 * 60 * 1000);
});
client.on('guildMemberAdd', function(newMember) {
    for (let serv of manageServs)
        if (newMember.guild.id === serv.id) {
            if(serv.pending.length) {
              //newMember.addRoles(serv.pending).catch(console.log);
              //serv.chans.syslog.send(`Added ${serv.pending[0].name} role to ${newMember}`);
            }
            var newGreet = util.greetingsParse(newMember.guild, serv.greet);
            serv.chans.greet.send(`${newMember}, ${newGreet}`);
            break;
        }
});
client.on('guildMemberRemove', member => {
    for (let serv of manageServs)
        if (member.guild.id === serv.id) {
            if(!serv.chans.editlog)
                break;
            try {
              serv.chans.editlog.send(`Member left the server: ${member}`, util.createRichEmbed({
                  fields:[{
                      name:"Had roles",
                      value: member.roles.array().join('\r\n')
                  }]
              })).catch(console.log);
            }catch(e) {
              console.log(e);
            }

            break;
        }
});
client.on('messageUpdate', (oldMsg, newMsg) => {
    var author = oldMsg.author;
    if(author.bot || oldMsg.content == newMsg.content)
        return;
    for (let serv of manageServs)
        if (oldMsg.guild.id === serv.id) {
            if(!serv.chans.editlog)
                break;

            serv.chans.editlog.send(`Member updated message in ${oldMsg.channel}: ${author}`, util.createRichEmbed({
                fields: [
                    { name: "From", value: oldMsg.content },
                    { name: "To", value: newMsg.content }
                ]
            })).catch(console.log);
            break;
        }
});
client.on('messageDelete', msg => {
    var author = msg.author;
    if(author.bot)
        return;
    for (let serv of manageServs)
        if (msg.guild.id === serv.id) {
            if(!serv.chans.editlog)
                break;

            serv.chans.editlog.send(`A message was deleted in ${msg.channel}: ${author}`, util.createRichEmbed({
                fields: [
                    { name: "Content", value: msg.content }
                ]
            })).catch(console.log);
            break;
        }
});
async function getDriveFileDirLink(url) {
	var regexfileID = /\/d\/(.*?)\//;

	var fileID = url.match(regexfileID)[1];
	var response = await fetch(`https://drive.google.com/uc?id=${fileID}`)
	return response.url
}
function getJPGUrl(msg) {
  var regexfileURL = /(?:JPG\:\s?)(.*)/;
  if(regexfileURL.test(msg)) {
    return msg.match(regexfileURL)[1];
  }
  return "";
}

async function onMessage(msg) {
    //lel
    if (msg.content.toLowerCase().startsWith("failed to load")) {
        msg.channel.send("oof");
        return;
    }
    // Get stream drawings links automatically
	if(msg.channel.name === "media") {
        var ccChan = util.discObjFind(msg.guild.channels, "^crosscode$");
        if(ccChan) {
            var url = getJPGUrl(msg.content);
            if(!url)
              return;
            if(url.includes("dropbox")) {
                // this will auto redirect to raw location
                var res = await fetch(url);
                ccChan.send(`<@!208763015657553921>! Add this url to stream drawings. ${res.url}`);
            } else if(url.includes("drive.google.com")) {
                var directLink = await getDriveFileDirLink(url);
                ccChan.send(`<@!208763015657553921>! Add this url to stream drawings. ${directLink}`);
            }
        }

        return;
    }
    //Allow for new line parsing
	var message = msg.content.replace(/<@!?(.*?)>/g,"") // Remove mentions
	                                    .replace(/^\s+|\s+$/g, '')
    let args = util.argParse(message);
    let _prefix = args.shift();
    if (!_prefix.startsWith(prefix))
        return;
    let invoc = _prefix;
    let type = configuration["default-module"];
    if (args[0] && args[0].startsWith("-")) {
        type = args[0].substring(1)
        if (!commands[type]) {
            onError(msg);
            return;
        }
        invoc += ` ${args[0]}`;
        args.shift();
    }

    let command = args.shift()
    if (command === "help") {
        msg.author.send(util.formatHelpText(invoc, helpText[type]));
        return;
    }
    let func = commands[type][command]
    if (func) {
        (new Promise((resolve, reject) => {
            let result;
            try {
                result = func(msg, args, command, console);
            } catch (err) {
                reject(err);
            }
            resolve(result);
        })).then(function(res) {}, function(err) {
            console.log(err);
        });
    }

}
client.on('message', onMessage);
client.login(process.env.BOT_TOKEN);
