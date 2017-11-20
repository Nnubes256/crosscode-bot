const Discord = require("discord.js");
const client = new Discord.Client();
let {
    readFileSync
} = require('fs');
let prefix = process.env.BOT_PREFIX;
let commands = {
    "": require('./js/command/general/commands.js')(client),
    "nsfw": require('./js/command/nsfw/commands.js')(client),
    "voice": require('./js/command/voice/commands.js')(client),
    "mods": require('./js/command/mods/commands.js')(client)
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
      "CrossCode v1"
    ]
    let newGame = function() {
        let game = gameStats.random()
        client.user.setGame(game)
    };
    newGame()
    setInterval(newGame, 120000)
});

function onError(msg) {
    msg.reply("...how? RTFM.")
}

function onMessage(msg) {
    let args = msg.content.split(' ');
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
        commandType = commands[""]

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
