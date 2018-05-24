const fs = require('fs');

const { Utils } = require('../utils');
const { Module } = require('../module');
const { CrossCodeFanArt } = require('./art.d/crosscode-fanart');

class Art extends Module{
    constructor() {
        super();

        this.streamArtLinks = this.getStreamArt();
        this.fanArt = new CrossCodeFanArt();
    }

    getCommands() {
        const streamArtLinks = this.streamArtLinks;
        const fanArt = this.fanArt;

        return {
            fromstream: function showStreamArt(msg) {
                const index = parseInt(Math.random() * streamArtLinks.length);
                const image = Utils.createRichEmbed({
                    description: 'Random stream art',
                    image: streamArtLinks[index]
                });
                msg.channel.send('', image).catch(error => {
                    console.log(`streamart error:\n${error}`);
                });
            },
            fromfan: function showFanArt(msg) {
                msg.channel.send('', fanArt.getRandomArt());
            }
        };
    }

    getHelp() {
        return [
            { name: 'fromstream', description: 'Displays a random official streamart' },
            { name: 'fromfan', description: 'Displays a random fannart' }
        ];
    }

    /**
     * @returns {string[]}
     */
    getStreamArt() {
        let data = fs.readFileSync('stream.txt', 'utf8');
        return data.split('\n');
    }
}

exports.art = new Art();