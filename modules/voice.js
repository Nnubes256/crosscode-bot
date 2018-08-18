var currentlyConnectedToChannel = false;
var currentVoiceChannel = null;

var greetTracks = [
    "hi", "hi-2", "hi-3", "haaaaii", "haaaaii-2"
];

var leaveTracks = [
    "bye", "bye-question"
];

var leaTracks = [
    "lea", "lea-2", "lea-3"
];

module.exports = function(instance) {
    instance.on('voiceStateUpdate', (oldM, newM) => {
        if(oldM.voiceChannel === undefined && newM.voiceChannel !== undefined) {
            // Join
            if (!currentVoiceChannel) return;
            if (newM.voiceChannel.id === currentVoiceChannel.channel.id) {
                setTimeout(() => {
                    currentVoiceChannel.playFile('./music/voice/' + greetTracks[Math.floor(Math.random()*greetTracks.length)] + '.ogg', {volume: 4});
                }, 500);
            }
        } else if(newM.voiceChannel === undefined){
            // Leave
            if (!currentVoiceChannel) return;
            if (oldM.voiceChannel.id === currentVoiceChannel.channel.id) {
                currentVoiceChannel.playFile('./music/voice/' + leaveTracks[Math.floor(Math.random()*leaveTracks.length)] + '.ogg', {volume: 4});
            }
        }
    });

    instance.on('message', (msg) => {
        if (!currentVoiceChannel) return;
        if (
            msg.isMentioned(instance.user) &&
            /what is your name/.test(msg.content.toLowerCase()) &&
            msg.member.voiceChannel.id === currentVoiceChannel.channel.id
        ) {
            currentVoiceChannel.playFile('./music/voice/' + leaTracks[Math.floor(Math.random()*leaTracks.length)] + '.ogg', {volume: 4});
        }
    });

    let commands = {
        join: function joinVoiceChannel(msg) {
            if (msg.member.voiceChannel && !currentlyConnectedToChannel) {
                msg.member.voiceChannel.join().then((connection) => {
                    currentVoiceChannel = connection;
                    msg.reply('I joined.');

                    setTimeout(() => {
                        currentVoiceChannel.playFile('./music/voice/' + greetTracks[Math.floor(Math.random()*greetTracks.length)] + '.ogg', {volume: 4});
                    }, 300);
                }).catch(function(error) {
                    msg.reply(`${error}`);
                });

                currentlyConnectedToChannel = true;
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
                        msg.member.voiceChannel.connection.playFile('./music/' + args.join(" ") + '.mp3');
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
                currentVoiceChannel.playFile('./music/voice/' + leaveTracks[Math.floor(Math.random()*leaveTracks.length)] + '.ogg', {volume: 4});
                setTimeout(() => {
                    voiceConnection.leave();
                    msg.reply("left the voice channel!");
                    currentlyConnectedToChannel = false;
                }, 1200);
            } else {
                msg.reply("but I'm not in a voice channel!");
            }
        },
    };
    return commands;
}
