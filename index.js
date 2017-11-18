const Discord = require("discord.js");
const client = new Discord.Client();
let {
    readFileSync
} = require('fs');
let prefix = process.env.BOT_PREFIX;
let generalCommands = require('./js/command/general/commands.js')
let nsfwCommands = require('./js/command/nsfw/commands.js')
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    //client.user.setAvatar('avatar/cloudlea.png')
});

function onMessage(msg) {
    let args = msg.content.split(' ');
    let _prefix = args.shift();
    if (_prefix !== prefix)
        return;
    let type = args.shift();
    //user wants a general command
    if (type === '-g') {
        let command = args.shift();
        let func = generalCommands[command] || generalCommands.error
        func(msg, command, args, client)
    } else if (type === "-nsfw") {
        let command = args.shift()
        let func = nsfwCommands[command]
        try {
            func(msg, command, args, console)
        } catch (e) {
            console.log(e)
        }
    }
}
client.on('message', onMessage);
client.login(process.env.BOT_TOKEN);
