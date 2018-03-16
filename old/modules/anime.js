module.exports = function(instance, util) {
    let {
        createRichEmbed
    } = util;
    return {
        "EXPLOSION!": function(msg) {
            msg.channel.send('💥', createRichEmbed({
                image: 'https://cdn.discordapp.com/attachments/380588134712475665/383777401529696256/tenor.gif'
            }))
        }
    }
};