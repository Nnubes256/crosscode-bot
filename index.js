const Discord = require("discord.js");
const client = new Discord.Client();

let {
    readFileSync
} = require('fs');
let util = require('./discord-util.js');
let prefix = process.env.BOT_PREFIX;
let configuration = JSON.parse(readFileSync("./config.json"));

let servers = configuration["role-servers"];
let manageServs;
let cmdTypes = configuration.modules;
let commands = {};
let helpText = {};
for (let type of cmdTypes) {
    commands[type] = require(`./modules/${type}.js`)(client, util);
    //TODO: Add help text for each function
    helpText[type] = readFileSync(`./help/${type}.txt`).toString();
}
Array.prototype.random = function() {
    return this[parseInt(Math.random() * this.length)];
}

let activityTypes = {
    GAMING: 0,
    STREAMING: 1,
    LISTENING: 2,
    WATCHING: 3
};
let gameStats = [{
    name: "santiballs",
    type: activityTypes.GAMING
}, {
    name: "...hi?",
    type: activityTypes.GAMING
}, {
    name: "...bye!",
    type: activityTypes.GAMING
}, {
    name: "Hi-5!!!",
    type: activityTypes.GAMING
}, {
    name: "the devs code :)",
    type: activityTypes.WATCHING
}, {
    name: "with mods",
    type: activityTypes.GAMING
}, {
    name: "cc.ig",
    type: activityTypes.GAMING
}, {
    name: "with CCLoader",
    type: activityTypes.GAMING
}, {
    name: "in multiplayer :o",
    type: activityTypes.GAMING
}, {
    name: "...Lea. -.-",
    type: activityTypes.WATCHING
}, {
    name: "CrossCode v1",
    type: activityTypes.GAMING
}, {
    name: "Intero's Music :o",
    type: activityTypes.LISTENING
}]

function newGame() {
    var ran = gameStats.random();
    client.user.setPresence({
        activity: ran
    });
};
client.on('ready', () => {
    console.log(servers);
    manageServs = util.getAllServers(client, servers);
    util.getAllEmotes(client);
    console.log(`Logged in as ${client.user.tag}!`);
    newGame();
    setInterval(newGame, 2 * 60 * 1000);
});
client.on('guildMemberAdd', function(newMember) {
    for (let serv of manageServs)
        if (newMember.guild.id === serv.id) {
            for(let i in newMember)
                console.log(i);
            newMember.addRoles(serv.pending);
            serv.chans.syslog.send(`Added pending role to ${newMember}`);
            serv.chans.greet.send(`${newMember}, ${serv.greet}`);
            break;
        }
});

function onMessage(msg) {
    //lel
    if (msg.content.toLowerCase().startsWith("failed to load")) {
        msg.channel.send("oof");
        return;
    }
    //Allow for new line parsing
    let args = msg.content.replace(/^\s+|\s+$/g, '').split(/[ \t]+/);
    let _prefix = args.shift();
    if (!_prefix.startsWith(prefix))
        return;
    let invoc = _prefix;
    let type = "general";
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
