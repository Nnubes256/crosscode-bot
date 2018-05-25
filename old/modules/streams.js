const TwitchStreams = require('./streams.d/crosscode-twitch-search.js');
let streams = new TwitchStreams();
module.exports = function(instance, util, config) {
    let notify_channels = {};
    instance.on('channelDelete', function() {
        //TODO: check if it had an associate channel
    });
    instance.on('guildDelete', function() {
        //TODO: check if it had an associated guild
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
            var chan_id = msg.channel.id;
            let notif_chan = notify_channels[chan_id + "|" + msg.guild.id] = notify_channels[chan_id] || {};
            notif_chan.chan_handle = msg.channel;
            msg.channel.send('This channel has been set to be notified of CrossCode streams periodically.');
        },
        get: function(msg) {
            let sEmbed = streams.get();
            msg.channel.send("Streaming CrossCode right now:" + (sEmbed ? '' : "\n*Tumbleweeds rolling*"), sEmbed);
        },
        remove: function(msg) {
            var chan_id = msg.channel.id;
            delete notify_channels[chan_id + "|" + msg.guild.id];
            msg.channel.send('This channel will no longer be notified of streams');
        }
    };
    config["role-servers"].forEach(serv => {
        let server = util.discObjFind(instance.guilds, serv.name);
        let chans = serv["stream-chans"];
        if(!server || !Array.isArray(chans)) return;
        chans.forEach(name => {
            let chan = util.discObjFind(server.channels, name);
            if(chan)
                commands.set({channel: chan, guild: server});
        });
    });
    
    return commands;
};
