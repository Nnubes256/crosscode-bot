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
            let channel = notify_channels[id];
            if (channel)
                channel.chan_handle.send('', streamEmbed);
        }
    }, (30 * 60 * 1000)); //Updates channels every 30 minutes
    let commands = {
        set: function(msg) {
            if (msg.author.id !== "208763015657553921")
                return;
            var chan_id = msg.channel.id;
            let notif_chan = notify_channels[chan_id + "|" + msg.guild.id] = notify_channels[chan_id] || {};
            notif_chan.chan_handle = msg.channel;
            msg.channel.send('This channel has been set to be notified of CrossCode streams periodically.');
        },
        get: function(msg) {
            msg.channel.send("Streaming CrossCode right now:\n" + (streams.get() || "*Tumbleweeds rolling*"));
        },
        remove: function(msg) {
            if (msg.author.id !== "208763015657553921")
                return;
            var chan_id = msg.channel.id;
            delete notify_channels[chan_id + "|" + msg.guild.id];
            msg.channel.send('This channel will no longer be notified of streams');
        }
    };
    return commands;
};
