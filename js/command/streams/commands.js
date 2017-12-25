const TwitchStreams = require('./crosscode-twitch-search.js');
let streams = new TwitchStreams();
module.exports = function(instance) {
    let notify_channels = {};
    instance.on('channelDelete', function() {
        //check if it had an associate channel
    });
    instance.on('guildDelete', function() {
        //check if it had an associated guild
    });
    setInterval(function() {
        var streamEmbed = streams.get();
        //console.log("Showing streams");
        if (!streamEmbed) {
            //console.log("None found, aborting");
            return;
        }
        //console.log("Found!");
        for (var id in notify_channels) {
            notify_channels[id].chan_handle.send('', streamEmbed);
        }
    }, (1 * 1 * 15 * 60 * 1000));
    let commands = {
        setchannel: function(msg) {
            if (msg.author.email !== "ac2pic@gmail.com")
                return;
            var chan_id = msg.channel.id;
            let notif_chan = notify_channels[chan_id + "|" + msg.guild.id] = notify_channels[chan_id] || {};
            notif_chan.chan_handle = msg.channel;
            msg.channel.send('This channel has been set to be notified of CrossCode streams periodically.');
        }
    };
    return commands;
};