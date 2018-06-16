let {
    readFileSync
} = require('fs');
let streamArtLink = function getStreamArt() {
    let data = readFileSync('stream.txt', 'utf8')
    return data.split("\n");
}();
const FanArt = require('./art.d/crosscode-fanart.js');
let fanArt = new FanArt();
module.exports = function(instance, {createRichEmbed}) {
    let commands = {
        fromstream: function showStreamArt(msg) {
            let index = parseInt(Math.random() * streamArtLink.length)
            let image = createRichEmbed({
                description: "Random stream art",
                image: streamArtLink[index]
            });
            msg.channel.send('', image).catch(function(error) {
                console.log("streamart error:\n${error}")
            });
        },
        fromfan: function showFanArt(msg) {
            msg.channel.send('', fanArt.getRandomArt());
        }
    };
    return commands;
}
