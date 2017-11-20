module.exports = function(instance) {
    let {
        createRichEmbed
    } = require('./../../discord-util.js');
    return {
        triggered: function(msg) {
            msg.channel.send(createRichEmbed({
                image: 'https://cdn.discordapp.com/attachments/376138665954377728/381565961582411777/Lea_triggered.png'
            }))
        },
        mlg: function(msg, args, command) {
            if (args[0] === "glasses")
                msg.channel.send(createRichEmbed({
                    image: 'https://cdn.discordapp.com/attachments/373163281755537420/381790329550143488/Deal_with_it_Lea.gif'
                }))
        }
    }
};
