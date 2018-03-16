module.exports = function(instance) {
    let commands = {
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
                let voiceChannel = msg.member.voiceChannel.members.find(function(member) {
                    return member.user.id === instance.user.id;
                });
                if (voiceChannel) {
                    try {
                        msg.member.voiceChannel.connection.play('./music/' + args.join(" ") + '.mp3');
                        msg.reply('am I playing music?');
                    } catch (e) {
                        console.log(e)
                    }

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
            if (voiceConnection) {
                voiceConnection.leave()
                msg.reply("left the voice channel!");
            } else {
                msg.reply("but I'm not in a voice channel!");
            }
        },
    };
    return commands;
}