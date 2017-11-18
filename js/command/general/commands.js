let generalCommands = function() {
    const Discord = require("discord.js");
    let {
        getEmoji,
        findMember,
        createRichEmbed
    } = require('./../../discord-util.js');
    let {
        readFileSync
    } = require('fs');
    let streamArtLink = function getStreamArt() {
        data = readFileSync('stream.txt', 'utf8')
        return data.split("\n");
    }();
    let helpText = readFileSync('js/command/general/help.txt', 'utf8');
    let FanArt = require('./crosscode-fanart.js');
    let fanArt = new FanArt();
    return {
        cloudlea: function showCloudLea(msg) {
            let image = new(Discord.RichEmbed || Discord.MessageEmbed);
            image.setImage('https://images-ext-1.discordapp.net/external/C8ZfRnUDaIaHkZNgR6TP81kCEbc1YJrtsnG5J-TTSzM/https/cdn.discordapp.com/attachments/373163281755537420/380813466354843649/steam-cloud-600x368.png?width=500&height=307')
            msg.channel.send('', image);
        },
        sleep: function sleep(msg, command, args, instance) {
            instance.destroy();
        },
        joinvoice: function joinVoiceChannel(msg) {
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
        hug: function hugUser(msg) {
            console.log('todo .cc -g hug')
        },
        language: function language(msg) {
            let image = createRichEmbed({
                image: 'https://crosscode.gamepedia.com/media/crosscode.gamepedia.com/thumb/a/a8/Javascript.png/1200px-Javascript.png?version=b86bd949c87fff5ccf1480ec0038508a'
            });
            msg.channel.send('', image)
        },
        game: function setGame(msg, command, args, instance) {
            instance.user.setGame(args.join(" "))
        },
        hi: function greetUser(msg) {
            let emoji = getEmoji(msg, 'leaCheese')
            let message = 'hi!!! ' + emoji.toString()
            msg.channel.send(message)
        },
        bye: function farewellUser(msg) {
            let message = 'bye!!! ' + getEmoji(msg, 'leaCheese').toString()
            msg.channel.send(message)
        },
        BUG: function scareEmilie(msg) {
            let message = getEmoji(msg, 'emilieWhy').toString()
            msg.channel.send(message)
        },
        streamart: function showStreamArt(msg) {
            let index = parseInt(Math.random() * streamArtLink.length)
            let image = createRichEmbed({
                description: "Random stream art",
                image: streamArtLink[index]
            });
            msg.channel.send('', image).then(function(result) {
                console.log("Success", result)
            }).catch(function(error) {
                console.log("Image", error)
            })
        },
        fanart: function showFanArt(msg) {
            msg.channel.send('', fanArt.getRandomArt())
        },
        thinking: function think(msg) {
            msg.react('🤔')
        },
        CHEATER: function exposeCheater(msg, command, args) {
            let cheater = findMember(msg, args[0])
            if (cheater) {
                let apolloPoint = getEmoji(msg, "apolloPoint").toString()
                let apolloShout = getEmoji(msg, "apolloShout").toString()
                let message = `${cheater.toString()} ${apolloPoint}${apolloShout} I GOT YOU NOW!`
                msg.channel.send(message)
            } else {
                msg.reply('could not find the cheater.')
            }
        },
        help: function(msg) {
            //DM user help message
            msg.author.send(helpText)
        },
        error: function(msg, command) {
            msg.reply(`I do not know how to do "${command}"`)
        }
    }
}();
module.exports = generalCommands
