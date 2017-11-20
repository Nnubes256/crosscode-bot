module.exports = function(instance) {
    return {
        join: function joinVoiceChannel(msg) {
            if (msg.member.voiceChannel) {
                msg.member.voiceChannel.join().then(function(success) {
                    msg.reply('I joined.');
                }).catch(function(error) {
                    msg.reply(`${error}`);
                })
            } else {
                msg.reply('you are not in a voice channel.');
            }
        },
        play: function playMusic(msg, args) {
            if (msg.member.voiceChannel) {
                let voiceChannel = instance.channels.find("id", msg.member.voiceChannel.id);
                if (voiceChannel) {
                    try {
                        voiceChannel.connection.playFile('./music/' + args.join(" ") + '.mp3');
                    } catch (e) {
                        console.log(e)
                    }
                    msg.reply('am I playing music?')
                } else {
                    msg.reply("not in your voice channel.")
                }
            } else {
                msg.reply('dude. You have to be in a voice chat.')
            }
        },
        leave: function stopMusic(msg) {
            let voiceConnection = instance.channels.findAll("type", "voice").find(function(channel) {
                return channel.guild.id === msg.guild.id;
            })
            console.log("Voice connection", voiceConnection)
            if (voiceConnection) {
                voiceConnection.leave()
                msg.reply("left the voice channel!");
            } else {
                msg.reply("but I'm not in a voice channel!");
            }
        }
    };
}
