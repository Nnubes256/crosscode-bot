const voiceChans = {};

var greetTracks = [
    "hi", "hi-2", "hi-3", "haaaaii", "haaaaii-2"
];

var leaveTracks = [
    "bye", "bye-question"
];

var leaTracks = [
    "lea", "lea-2", "lea-3"
];

const playVoice = (tracks, vc) => vc.connection.playFile('./music/voice/' + tracks[Math.floor(Math.random()*tracks.length)] + '.ogg', {volume: 4});

module.exports = function(instance) {
    instance.on('voiceStateUpdate', (oldM, newM) => {
        const vc = voiceChans[newM.guild.id];
        if (!vc) return;
        if (!oldM.voiceChannel && newM.voiceChannel) {
            // Join
            if (newM.voiceChannelID === vc.id) {
                setTimeout(() => playVoice(greetTracks, vc), 500);
            }
        } else if (oldM.voiceChannel && !newM.voiceChannel){
            // Leave
            if (oldM.voiceChannelID === vc.id) {
                playVoice(leaveTracks, vc);
            }
        }
    });

    instance.on('message', (msg) => {
        if (
            msg.guild &&
            msg.isMentioned(instance.user) &&
            /wh?at(\s+i|')[sz]\s+y(ou|[ae])r?\s+nae?me?/i.test(msg.content) &&
            msg.member.voiceChannelID === voiceChans[msg.guild.id].id
        ) {
            playVoice(leaTracks, vc);
        }
    });

    let commands = {
        join: function joinVoiceChannel(msg) {
            if (!msg.guild) return;
            let vc = voiceChans[msg.guild.id];
            if (!msg.member.voiceChannel) {
                msg.reply("you aren't in a voice channel!");
                return;
            }
            if (vc) {
                msg.reply("I'm already in a voice channel!");
                return;
            }
            msg.member.voiceChannel.join().then((connection) => {
                vc = voiceChans[msg.guild.id] = msg.member.voiceChannel;
		console.log(vc);
                msg.reply('I joined.');

                setTimeout(() => playVoice(greetTracks, vc), 300);
            }).catch(function(error) {
                msg.reply(`${error}`);
            });

        },
        play: function playMusic(msg, args) {
            if (!msg.guild) return;
            const vc = voiceChans[msg.guild.id];
            if (!vc) {
                msg.reply("I'm not in a voice channel!");
                return;
            }
            if (msg.member.voiceChannelID !== vc.id) {
                msg.reply("you're not in the voice channel I'm in!");
                return;
            }
            var name = args.join(" ");
            if (name.indexOf("http") > -1) {
                vc.connection.playFile(name);
                msg.reply('am I playing music?');
            } else {
                try {
                    vc.connection.playFile('./music/' + name + '.mp3');
                    msg.reply('am I playing music?');
                } catch (e) {
                    console.log(e)
                }
            }
        },
        leave: function stopMusic(msg) {
            if (!msg.guild) return;
            const vc = voiceChans[msg.guild.id];
            if (!vc) {
                msg.reply("I'm not in a voice channel!");
                return;
            }
            
            playVoice(leaveTracks, vc);
            setTimeout(() => {
                vc.leave();
                delete voiceChans[msg.guild.id];
                msg.reply("left the voice channel!");
            }, 1200);
        },
    };
    return commands;
}
