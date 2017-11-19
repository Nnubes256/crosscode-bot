const Discord = require("discord.js");
const client = new Discord.Client();
let {
    readFileSync
} = require('fs');
let prefix = process.env.BOT_PREFIX;
let commands = {
    "": require('./js/command/general/commands.js')(client),
    "nsfw": require('./js/command/nsfw/commands.js')(client),
    "voice": require('./js/command/voice/commands.js')(client)
}
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    //client.user.setAvatar('avatar/cloudlea.png')
});

function onMessage(msg) {
    if (msg.guild.ownerID !== msg.author.id)
        return;
    let args = msg.content.split(' ');
    let _prefix = args.shift();
    if (!_prefix.startsWith(prefix))
        return;
    let type = _prefix.substring(1).trim()
    let commandType = commands[type]
    if (!commandType) {
        commands[""].error(msg, args, type)
        return;
    }
    let command = args.shift()
    let func = commandType[command]
    console.log("Args:", args, "command", command)
    console.log("Function:", func)
    if (!func) {
        func(msg, args, command, console)
    } else {
        commands[""].error(msg, args, command)
    }

}
client.on('message', onMessage);
client.login(process.env.BOT_TOKEN);
