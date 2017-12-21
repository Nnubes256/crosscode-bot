const Discord = require("discord.js");
const client = new Discord.Client();
//require("./botrac4r/botrac4r.js");
let {
    readFileSync
} = require('fs');
let prefix = process.env.BOT_PREFIX;
let cmdTypes = ["general", "nsfw", "voice", "mods", "anime", "game"];
let commands = {}
for (let type of cmdTypes) {
    commands[type] = require(`./js/command/${type}/commands.js`)(client);
}
Array.prototype.random = function() {
    return this[parseInt(Math.random() * this.length)];
}
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    //client.user.setAvatar('avatar/cloudlea.png')
    //Playing...
    let activityTypes = {
        GAMING: 0,
        STREAMING: 1,
        LISTENING: 2,
        WATCHING: 3
    }
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
        name: "to Intero's Music :o",
        type: activityTypes.LISTENING
    }]
    let newGame = function() {
        let activity = gameStats.random();
        client.user.setPresence({
            activity: activity
        });
    };
    newGame()
    setInterval(newGame, 120000)
});

function onError(msg) {
    // Doesn't work when combined with botrac4r: no awareness of if a command is controlled by botrac4r.
    //msg.reply("...how? RTFM.")
}

function processArgs(args) {}

function onMessage(msg) {
    //lel
    if (msg.content.toLowerCase().startsWith("failed to load")) {
        msg.channel.send("oof")
        return;
    }
    //Allow for new line parsing
    let args = msg.content.replace(/^\s+|\s+$/g, '').split(/\s+/);
    let _prefix = args.shift();
    if (!_prefix.startsWith(prefix))
        return;
    let commandType = undefined;
    //2767mr fix
    if (args[0] && args[0].startsWith("-")) {
        let type = args[0].substring(1)
        commandType = commands[type]
        if (!commandType) {
            onError(msg)
            return;
        }
        args.shift()
    } else
        commandType = commands["general"]

    let command = args.shift()
    let func = commandType[command]
    if (func) {
        func(msg, args, command, console)
    } else {
        onError(msg)
    }

}
client.on('message', onMessage);
client.login(process.env.BOT_TOKEN);