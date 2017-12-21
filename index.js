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
    let gameStats = [{
            name: "santiballs",
            type: 0
    }, {
            name: "...hi?",
            type: 0
    }, {
            name: "...bye!",
            type: 0
    }, {
            name: "Hi-5!!!",
            type: 0
    }, {
            name: "the devs code :)"
            type: 3
    }, {
            name: "with mods",
            type: 0
    },
        {
            name: "cc.ig",
            type: 2
    }, {
            name: "with CCLoader",
            type: 0
    }, {
            name: "in multiplayer :o",
            type: 0
    }, {
            name: "...Lea. -.-",
            type: 3
    }, {
            name: "CrossCode v1",
            type: 0
    }, {
            name: "to Intero's Music :o",
            type: 2
    }]
    let newGame = function() {
        let game = gameStats.random();
        client.user.setPresence({
            game: game
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