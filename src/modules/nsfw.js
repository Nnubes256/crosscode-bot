const { Message } = require('discord.js');
const { Module } = require('../module');
const { Utils } = require('../utils');

class Nsfw extends Module{
    initialize(bot) {
        super.initialize(bot, 'nsfw');
    }

    getCommands() {
        return {
            /**
             * @param {Message} msg
             */
            lewd: msg => {
                if (this.error(msg))
                    return;
                msg.channel.send('', Utils.createRichEmbed({
                    description: '( ͡° ͜ʖ ͡°)',
                    image: 'https://images-ext-1.discordapp.net/external/RNdA2IorjgoHeslQ9Rh8oos1nkK56Y6_w4sjUaFVBC4/https/image.ibb.co/jJLNiG/leadaki.png?width=185&height=250'
                }));
            }
        };
    }

    /**
     * @param {Message} msg
     */
    error(msg) {
        if (!msg.channel.nsfw) {
            msg.reply('this channel is sfw. Please try again in a nsfw channel');
            return true;
        }
    }
}

exports.nsfw = new Nsfw();