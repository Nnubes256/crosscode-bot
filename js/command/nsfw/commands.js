module.exports = function(instance) {
    const Discord = require("discord.js");
    let {
        findMember,
        createRichEmbed
    } = require('./../../discord-util.js')
    let _command = {
        lewd: function showLewdArt(msg, args, command) {
            if (_command.error(msg, command))
                return;
            msg.channel.send('', createRichEmbed({
                description: "( ͡° ͜ʖ ͡°)",
                image: 'https://images-ext-1.discordapp.net/external/RNdA2IorjgoHeslQ9Rh8oos1nkK56Y6_w4sjUaFVBC4/https/image.ibb.co/jJLNiG/leadaki.png?width=185&height=250'
            }))
        },
        error: function error(msg, command) {
            if (!msg.channel.nsfw) {
                msg.reply("this channel is sfw. Please try again in a nsfw channel")
                return true;
            }
        }
    };
    return _command
}
