const { Message, TextChannel } = require('discord.js');

const { Module } = require('../module');
const { Utils } = require('../utils');
const { CrossCodeStream } = require('./streams.d/crosscode-twitch-search');

class Streams extends Module{
    constructor() {
        super();

        this.streams = new CrossCodeStream();
        /** @type {TextChannel[]} */
        this.notify_channels = [];

        setInterval(() => {
            const streamEmbed = this.streams.get();
            //console.log("Showing streams");
            if (!streamEmbed) {
                //console.log("None found, aborting");
                return;
            }
            //console.log("Found!");
            for (let channel of this.notify_channels) {
                if (channel)
                    channel.send('', streamEmbed);
            }
        }, (30 * 60 * 1000)); //Updates channels every 30 minutes
    }

    getCommands() {
        return {
            /**
             * @param {Message} msg
             */
            set: msg => {
                if (!Utils.isAdmin(msg.member))
                    return;
                
                this.notify_channels.push(msg.channel);
                msg.channel.send('This channel has been set to be notified of CrossCode streams periodically.');
            },
            /**
             * @param {Message} msg
             */
            get: msg => {
                const sEmbed = this.streams.get();
                msg.channel.send("Streaming CrossCode right now:" + (sEmbed ? '' : "\n*Tumbleweeds rolling*"), sEmbed);
            },
            /**
             * @param {Message} msg
             */
            remove: msg => {
                if (!Utils.isAdmin(msg.member))
                    return;
                    
                delete this.notify_channels[this.notify_channels.indexOf(msg.channel)];
                msg.channel.send('This channel will no longer be notified of streams');
            }
        }
    }
}

exports.streams = new Streams();