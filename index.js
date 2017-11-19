const Discord = require("discord.js");
const client = new Discord.Client();
let {
    readFileSync
} = require('fs');
let prefix = process.env.BOT_PREFIX;
let generalCommands = require('./js/command/general/commands.js')(client)
let nsfwCommands = require('./js/command/nsfw/commands.js')(client)
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    //client.user.setAvatar('avatar/cloudlea.png')
});

function onMessage(msg) {
    console.log(msg.author.username)
    if (msg.author.username != "ac2pic" || msg.author.username != "acalt")
        return;
    let args = msg.content.split(' ');
    let _prefix = args.shift();
    if (_prefix !== prefix)
        return;
    let type = args.shift();
    //user wants a general command
    if (type === "-nsfw") {
        let command = args.shift()
        let func = nsfwCommands[command]
        func(msg, args, command, console)
    } else {
        let command = type;
        let func = generalCommands[command] || generalCommands.error
        func(msg, args, command)
    }
}
client.on('message', onMessage);
client.login(process.env.BOT_TOKEN);
