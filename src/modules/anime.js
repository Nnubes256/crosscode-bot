const { Module } = require('../module');
const { Utils } = require('../utils');

class Anime extends Module{
    initialize(bot) {
        super.initialize(bot, 'anime');
    }

    getCommands() {
        return {
            'EXPLOSION!': function(msg) {
                msg.channel.send('💥', Utils.createRichEmbed({
                    image: 'https://cdn.discordapp.com/attachments/380588134712475665/383777401529696256/tenor.gif'
                }));
            }
        };
    }
}

exports.anime = new Anime();