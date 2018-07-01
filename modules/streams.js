const TwitchStreams = require('./streams.d/crosscode-twitch-search.js');
let streams = new TwitchStreams();
module.exports = function(instance, util, config) {
    let notify_channels = {};
    instance.on('channelDelete', function(deletedChannel) {
        for (var id in notify_channels) {
            let channel = notify_channels[id];

            if (channel &&
                deletedChannel.id == channel.id)
            {
                delete notify_channels[id];
                return;
            }
        }
    });
    instance.on('guildDelete', function() {
        //TODO: check if it had an associated guild
    });
    instance.on('messageDelete', function(messageDeleted) {
        for (var id in notify_channels) {
            let channel = notify_channels[id];

            if (channel && channel.update_message &&
                channel.update_message.id == messageDeleted.id)
            {
                channel.update_message = null;
                return;
            }
        }
    });
    instance.on('messageDeleteBulk', function(messagesDeleted) {
        for (var id in notify_channels) {
            let channel = notify_channels[id];

            if (channel &&
                channel.update_message &&
                messagesDeleted.has(channel.update_message.id))
            {
                channel.update_message = null;
            }
        }
    });

    setInterval(function() {
        var streamEmbed = streams.get();

        for (var id in notify_channels) {
            let channel = notify_channels[id];

            console.log(streamEmbed)

            if (channel) {
                if (channel.update_message) {
                    channel.update_message.delete(1000).catch(console.error);
                }
                channel.chan_handle.send('', streamEmbed).then((message) => {
                    // Watch out for race conditions!
                    if (notify_channels[id]) {
                        notify_channels[id].update_message = message;
                    }
                });
            }
        }

    }, (/*30 * */10 * 1000)); //Updates channels every 30 minutes
    let commands = {
        set: function(msg) {
            var chan_id = msg.channel.id;
            let notif_chan = notify_channels[chan_id + "|" + msg.guild.id] = notify_channels[chan_id] || {};
            notif_chan.chan_handle = msg.channel;
            notif_chan.update_message = null;
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
    instance.on('ready', function() {
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
    });

    return commands;
};
