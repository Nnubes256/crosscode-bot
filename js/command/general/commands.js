let generalCommands = function(instance) {
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
    let TwitchStreams = require('./crosscode-twitch-search.js');
    let streams = new TwitchStreams();
    return {
        ping: function(msg) {
            msg.reply(">:) pew pew. Back at you.")
        },
        setname: function setName(msg, args, command) {
            if (args.length < 2) {
                msg.reply("not enough arguments supplied.")
                return;
            }
            let oldName = args.shift()
            let member = findMember(msg, oldName)
            if (!member) {
                msg.reply(`could not find ${oldName}`)
                return;
            }
            member.setNickname(args.join(" ")).catch(function(error) {
                msg.reply(`${error}`)
            })
        },
        getstreams: function twitchStreams(msg) {
            msg.author.send(streams.getList())
        },
        cloudlea: function showCloudLea(msg) {
            msg.channel.send('', createRichEmbed({
                image: 'https://images-ext-1.discordapp.net/external/C8ZfRnUDaIaHkZNgR6TP81kCEbc1YJrtsnG5J-TTSzM/https/cdn.discordapp.com/attachments/373163281755537420/380813466354843649/steam-cloud-600x368.png?width=500&height=307'
            }));
        },
        sleep: function sleep() {
            instance.destroy();
        },
        hug: function hugUser(msg) {
            console.log('todo .cc -g hug')
        },
        language: function language(msg) {
            let image = createRichEmbed({
                image: 'https://cdn.discordapp.com/attachments/376138665954377728/381560390384877578/Javascript_DeathStareLea.gif'
            });
            msg.channel.send('', image)
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
            msg.channel.send('', image).catch(function(error) {
                console.log("streamart error:\n${error}")
            })
        },
        fanart: function showFanArt(msg) {
            msg.channel.send('', fanArt.getRandomArt())
        },
        thinking: function think(msg) {
            msg.react('🤔')
        },
        CHEATER: function exposeCheater(msg, args, command) {
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
        triggered: function(msg) {
            msg.channel.send(createRichEmbed({
                image: 'https://cdn.discordapp.com/attachments/376138665954377728/381565961582411777/Lea_triggered.png'
            }))
        },
        lea: function(msg, args, command) {
            if (args[0] === "glasses")
                msg.channel.send(createRichEmbed({
                    image: 'https://cdn.discordapp.com/attachments/373163281755537420/381790329550143488/Deal_with_it_Lea.gif'
                }))
        }
    }
};
module.exports = generalCommands
