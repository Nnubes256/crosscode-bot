const { Module } = require('../module');
const { Utils } = require('../utils');

class Anime extends Module{
    getCommands() {
        return {
            'EXPLOSION!': function(msg) {
                msg.channel.send('💥', Utils.createRichEmbed({
                    image: 'https://cdn.discordapp.com/attachments/380588134712475665/383777401529696256/tenor.gif'
                }));
            }
        };
    }

    /**
     * @returns {{name: string, description: string}[]}
     */
    getHelp() {
        return [
            { name: 'EXPLOSION!', description: 'Make sure Beldia won\'t get mad at you.' }
        ];
    }
}

exports.anime = new Anime();