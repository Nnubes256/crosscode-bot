module.exports = function(instance) {
    const Discord = require("discord.js");
    const {
        getEmoji,
        findMember,
        createRichEmbed,
        getHelpText,
        isFromAdmin
    } = require('./../../discord-util.js');
    const {
        readFileSync
    } = require('fs');
    const FanArt = require('./crosscode-fanart.js');
    const TwitchStreams = require('./crosscode-twitch-search.js');

    let streamArtLink = function getStreamArt() {
        let data = readFileSync('stream.txt', 'utf8')
        return data.split("\n");
    }();
    let fanArt = new FanArt();
    let streams = new TwitchStreams();
    let commands = {
        ping: function(msg) {
            let duration = Date.now() - msg.createdTimestamp;
            msg.reply(`>:) pew pew. Got here in ${duration} ms, and...`).then(function(msg) {
                let newDuration = Date.now() - msg.createdTimestamp;
                msg.channel.send(`sent back in ${newDuration + duration} ms`)
            })
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
        sleep: function sleep(msg) {
            if (isFromAdmin(msg)) {
                instance.destroy();
                process.exit(0);
            } else {
                msg.reply('You don\'t have the power to kill me!')
            }

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
        help: function getHelp(msg) {
            //DM user help message
            msg.author.send(helpText)
        },
        triggered: function getTriggered(msg) {
            msg.channel.send(createRichEmbed({
                title: "...WHY?!?!",
                image: 'https://cdn.discordapp.com/attachments/374851126627008514/382063690557685760/Lea_triggered.gif'
            }))
        },
        "HI!": function dealWithIt(msg, args, command) {
            msg.channel.send(createRichEmbed({
                image: 'https://cdn.discordapp.com/attachments/373163281755537420/381790329550143488/Deal_with_it_Lea.gif'
            }))
        },
        vote: function vote(msg) {
            msg.react("👍")
                .then((msgReact) => msgReact.message.react("👊"))
                .then((msgReact) => msgReact.message.react("👎"))

        },
        work: function plsWork(msg) {
            msg.channel.send("...why?", createRichEmbed({
                image: "https://cdn.discordapp.com/emojis/337987528625881090.png"
            }))
        }
    }
    let helpText = getHelpText(commands);
    return commands
};
