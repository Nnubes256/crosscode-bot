const Discord = require("discord.js");
const client = new Discord.Client();

let {
    readFileSync
} = require('fs');
let util = require('./discord-util.js');
let prefix = process.env.BOT_PREFIX;
let cmdTypes = ["general", "nsfw", "streams", "art", "voice", "mods", "anime", "game"];
let defCmd = cmdTypes[0]
let commands = {};
let helpText = {};
for (let type of cmdTypes) {
    let req = require(`./modules/${type}.js`)(client, util);
    let ht = readFileSync(`./help/${type}.txt`);
    if(type === defCmd)
        type = "";
    for(let name in req)
        if(typeof req[name] === "function")
            commands[name + type] = req[name];
    helpText[type] = ht.toString();
}
Array.prototype.random = function() {
    return this[parseInt(Math.random() * this.length)];
}
var ccModServ;
var pendingRole;
var watchTower;

function findModServer() {
    ccModServ = client.guilds.find('name', 'CrossCode Modding');
    if (ccModServ) {
        console.log("Found your server.");
        pendingRole = ccModServ.roles.find('name', 'pending');
        watchTower = ccModServ.channels.find('name', 'admin-watchtower');
    } else {
        console.log("Modding Server does not exist");
    }
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
    //doesn't work anymore
    var ran = gameStats.random();
    client.user.setPresence({
        activity: ran
    });
};
client.on('ready', () => {
    findModServer();
    util.getAllEmotes(client);
    console.log(`Logged in as ${client.user.tag}!`);
    newGame();
    setInterval(newGame, 120000);
});
client.on('guildMemberAdd', function(newMember) {
    if (newMember.guild.id === ccModServ.id && pendingRole) {
        newMember.addRoles([pendingRole]);
        watchTower.send(`Added pending role to ${newMember.toString()}`);
    }
});

function promisify(func, ...args) {
    (new Promise((resolve, reject) => {
        let result;
        try {
            result = func(...args);
        } catch(err) {
            reject(err);
        }
        resolve(result);
    })).then(function(res) {}, function (err) {
        console.log(err);
    });
}

function onMessage(msg) {
    //lel
    if (msg.content.toLowerCase().startsWith("failed to load")) {
        msg.channel.send("oof");
        return;
    }
    //Allow for new line parsing
    let [invoc, cmd, ...args] = msg.content.replace(/^\s+|\s+$/g, '').split(/[ \t]+/);
    if (!invoc.startsWith(prefix) || !cmd)
        return;

    if (cmd.startsWith("help")) {
        let type = cmd.substr(4);
        if(helpText[type] !== undefined)
            msg.author.send(util.formatHelpText(invoc, type, helpText[type]));
        return;
    }
    let func = commands[cmd];
    if (func) {
        promisify(func, msg, args, cmd, console);
    }

}
client.on('message', onMessage);
client.login(process.env.BOT_TOKEN);
