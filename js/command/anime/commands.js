module.exports = function(instance) {
    let {
        createRichEmbed
    } = require('./../../discord-util.js');
    return {
        "EKUSUPUROSION!": function(msg) {
            msg.channel.send('💥', createRichEmbed({
                image: 'https://cdn.discordapp.com/attachments/380588134712475665/383777401529696256/tenor.gif'
            }))
        }
    }
};
