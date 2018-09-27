const TwitchStreams = require('./streams.d/crosscode-twitch-search.js');
const {
    createRichEmbed
} = require('./../discord-util.js');

let streams = new TwitchStreams();
module.exports = function(instance, util, config, console) {
    let notify_channels = {}, oldStreamerIds = [];

    streams.init(console);

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
    function updateIdsList(streamData) {
      oldStreamerIds = [];
      for(var [userId, streamInfo]  of streamData) {
          oldStreamerIds.push(userId + '|' + streamInfo.start);
      }
    }
    function streamRichEmbedField(stream) {
        return {
          name : `${stream.title} by ${stream.user.display_name}`,
          value : `Stream language: ${stream.language}\n[Join Stream](https://www.twitch.tv/${stream.user.login})`
        };
    }
    setInterval(async function() {

        var streamData = streams.getStreamers();
        if(streamData.size === 0)
          return;

        var fields = [];

        for(var [userId, streamInfo] of streamData) {
          if(oldStreamerIds.indexOf(userId + '|' + streamInfo.start) === -1)
              fields.push(streamRichEmbedField(streamInfo));
        }
        // no new streams
        if(fields.length === 0)
          return;

        var streamEmbed = createRichEmbed({
            title: "CrossCode Twitch Streams",
            fields,
            timestamp: new Date()
        });

        for (var id in notify_channels) {
            var channel = notify_channels[id];
            if (channel) {

                let message = await channel.chan_handle.send('', streamEmbed);

                // Watch out for race conditions!
                if (notify_channels[id]) {
                    notify_channels[id].update_message = message;
                }
            }
       }
       updateIdsList(streamData);
    }, (15 * 60 * 1000)); //Update every 15 minutes

    let commands = {
        set: function(msg) {
            var chan_id = msg.channel.id;
            let notif_chan = notify_channels[chan_id + "|" + msg.guild.id] = notify_channels[chan_id] || {};
            notif_chan.chan_handle = msg.channel;
            notif_chan.update_message = null;
        },
        remove: function(msg) {
            var chan_id = msg.channel.id;
            delete notify_channels[chan_id + "|" + msg.guild.id];
            msg.channel.send('This channel will no longer be notified of streams');
        }
    };
    return commands;
};
