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
    let gameStats = [
      "santiballs",
      "...hi?",
      "...bye!",
      "Hi-5!!!",
      "with mods",
      "cc.ig",
      "with CCLoader",
      "in multiplayer :o",
      "...Lea. -.-",
      "CrossCode v1",
      "Star Wars™ Battlefront™ 2"
    ]
    let newGame = function() {
        let game = gameStats.random()
        client.user.setGame(game)
    };
    newGame()
    setInterval(newGame, 120000)
});

function onError(msg) {
    // Doesn't work when combined with botrac4r: no awareness of if a command is controlled by botrac4r.
    //msg.reply("...how? RTFM.")
}

function onMessage(msg) {
    //lel
    if (msg.content.toLowerCase().startsWith("failed to load")) {
        msg.channel.send("oof")
        return;
    }
    let args = msg.content.replace(/^\s+|\s+$/g, '').split(/\s+/);
    let _prefix = args.shift();
    if (!_prefix.startsWith(prefix))
        return;
    let commandType = undefined;
    if (args[0].startsWith("-")) {
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
