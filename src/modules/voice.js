const { Module } = require('../module');

class Voice extends Module {
    getCommands(){
        return {
            join: function joinVoiceChannel(msg) {
                if (msg.member.voiceChannel) {
                    msg.member.voiceChannel.join().then((success) => {
                        msg.reply('I joined.');
                    }).catch((error) => {
                        msg.reply(`${error}`);
                    });
                } else {
                    msg.reply('you are not in a voice channel.');
                }
            },
            play: (msg, args) => {
                if (msg.member.voiceChannel) {
                    let voiceChannel = msg.member.voiceChannel.members.find(member => {
                        return member.user.id === this.bot.client.user.id;
                    });
                    if (voiceChannel) {
                        try {
                            msg.member.voiceChannel.connection.play('./music/' + args.join(' ') + '.mp3');
                            msg.reply('am I playing music?');
                        } catch (e) {
                            console.log(e);
                        }
    
                    } else {
                        msg.reply('not in your voice channel.');
                    }
                } else {
                    msg.reply('dude. You have to be in a voice chat.');
                }
            },
            leave: (msg) => {
                let voiceConnection = this.bot.client.channels.findAll('type', 'voice').find(channel => {
                    return channel.guild.id === msg.guild.id;
                });
                if (voiceConnection) {
                    voiceConnection.leave();
                    msg.reply('left the voice channel!');
                } else {
                    msg.reply('but I\'m not in a voice channel!');
                }
            },
        };
    }

    getHelp() {
        return [
            { name: 'join', description: 'Joins the voice channel that the caller is in' },
            { name: 'play', description: 'Play a song (invoke as `<...> play <songname>`), where <songname> (as of writing) is one of `bad_ascend`, `emilie_e`, `not_jazz`, and `wrong_hi`' },
            { name: 'leave', description: 'Leave the voicechat' }
        ];
    }
}

exports.voice = new Voice();