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
client.on('ready', () => {
    manageServs = util.getAllServers(client, servers, console);
    util.getAllEmotes(client);
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({type: 0, name: "CrossCode 1.0!!"});
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
    if (msg.content.toLowerCase().startsWith("failed to load")) {
        msg.channel.send("oof");
        return;
    }
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
