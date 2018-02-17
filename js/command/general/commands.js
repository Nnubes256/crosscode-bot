module.exports = function(instance) {
    const splitter = new(require('grapheme-splitter'));
    const Discord = require("discord.js");
    const {
        getEmoji,
        findMember,
        createRichEmbed,
        getHelpText,
        isFromAdmin
    } = require('./../../discord-util.js');
    const database = require('sqlite3');
    const {
        readFileSync
    } = require('fs');

    const StrawPoll = require('./poll/strawpoll');

    function boxGenerate(phrase, characterArray) {
        let maxMessageLength = 1960;
        let maxPhraseLength = phrase.length;
        let currentMessage = "";
        let messagePayloads = [];
        for (var i = 0, currCharLength = 0; i < characterArray.length; i++) {
            let substr = phrase.substring(currCharLength) + '\n';
            // currentLength + nextSubstring + newline char
            if (currentMessage.length + maxPhraseLength + 1 <= maxMessageLength) {
                currentMessage += substr;
            } else {
                messagePayloads.push(currentMessage);
                currentMessage = substr;
            }
            currCharLength += characterArray[i].length;
            maxPhraseLength -= characterArray[i].length;
        }
        messagePayloads.push(currentMessage);
        return messagePayloads;
    }

    let commands = {
        poll: function createPoll(msg, args) {
            //let title = args.shift();
            /*let poll = new StrawPoll(title, args);
            poll.makeRequest()
                .then(function(response) {
                    console.log(response);
                }).catch(function(err) {
                    console.log(err);
                });*/

        },
        purge: function(msg, args) {
            let options = {
                limit: 100
            }
            if (!isNaN(args[0])) {
                options['after'] = args[0]
            }
            msg.channel.fetchMessages(options)
                .then(function(messages) {
                    return messages.filter(function(message) {
                        return message.author.id === instance.user.id;
                    });
                }).then(function(messages) {
                    let lastKey = messages.lastKey();
                    for (var message of messages) {
                        if (message[0] === lastKey) {
                            message[1].delete().then(function() {
                                msg.reply('Deleted the last message')
                            })
                        } else {
                            message[1].delete()
                        }
                    }
                })
        },
        ping: function(msg) {
            //this measures the time it took to get here
            let duration = Date.now() - msg.createdTimestamp;
            msg.reply(`>:) pew pew. Got here in ${duration} ms, and...`).then(function(msg) {
                //this measures the return trip time
                let newDuration = Date.now() - msg.createdTimestamp;
                msg.channel.send(`sent back in ${newDuration} ms`)
            })
        },
        box: function(msg, args) {
            if (msg.channel.name !== "spam")
                return;
            let phrase = args.join(' ');
            let charLimit = 80;
            if (phrase.length > charLimit) {
                msg.reply(`Due to complaints by users, it has now been nerfed to max of ${charLimit} characters (emojis lengths vary). Sorry about that.`);
                return;
            }
            let arr = splitter.splitGraphemes(phrase);
            boxGenerate(phrase, arr).forEach(function(message) {
                msg.channel.send('```js\n' + message + '```');
            });
        },
        rbox: function randomBox(msg, args) {
            if (msg.channel.name !== "spam")
                return;
            let phrase = args.join(' ');
            let charLimit = 80;
            if (phrase.length > charLimit) {
                msg.reply(`Due to complaints by users, it has now been nerfed to max of ${charLimit} characters (emojis lengths vary). Sorry about that.`);
                return;
            }
            let arr = splitter.splitGraphemes(phrase).reverse();
            boxGenerate(arr.join(''), arr).forEach(function(message) {
                msg.channel.send('```js\n' + message + '```');
            });
        },
        setname: function setName(msg, args, command) {
            if (!isFromAdmin(msg))
                return;
            if (args.length < 2) {
                msg.reply("not enough arguments supplied.");
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
                msg.reply("You don't have the power to kill me!");
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
        bugs: function(msg) {
            msg.channel.send('', createRichEmbed({
                image: 'https://cdn.discordapp.com/attachments/380588134712475665/383705658731659266/tumblr_mtud5kX2T71r7fahjo1_250.gif'
            }))
        },
        BUG: function scareEmilie(msg) {
            let message = getEmoji(msg, 'emilieWhy').toString()
            msg.channel.send(message)
        },
        emote: function leaEmote(msg, args) {
            let reply = '';
            for(let i=0;i<args.length;i++) {
                let thonk = getEmoji(msg, args[i]);
                if(thonk.id !== '')
                    reply += thonk.toString() + ' ';
            }
            if(reply !== '')
                msg.channel.send(reply);
        },
        react: function leaReact(msg, args) {
            for(let i=0;i<args.length;i++) {
                let thonk = getEmoji(msg, args[i]);
                if(thonk.id !== '')
                    msg.react(thonk.id);
            }
        },
        thinking: function think(msg) {
            let thonk = getEmoji(msg, 'mia_thinking');
//            console.log(thonk);
            msg.react(thonk.id)
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
        verytriggered: function getMoreTriggered(msg) {
            msg.channel.send(createRichEmbed({
                title: "何？",
                image: "https://cdn.discordapp.com/attachments/381866628108910593/382331699213893632/triggeredlea.gif"
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
        ohno: function ohNo(msg) {
            msg.channel.send(":(", createRichEmbed({
                image: "https://cdn.discordapp.com/emojis/400836365295812619.png"
            }))
        },
        work: function plsWork(msg) {
            msg.channel.send("...why?", createRichEmbed({
                image: "https://cdn.discordapp.com/emojis/337987528625881090.png"
            }))
        },
        balls: function blueBalls(msg) {
            msg.channel.send("BALLS", createRichEmbed({
                image: "https://cdn.discordapp.com/attachments/143364538958348288/368033879162093581/balls.png"
            }))
        },
        vrps: function blueVrps(msg) {
           msg.channel.send("VRPS", createRichEmbed({
               image : "https://cdn.discordapp.com/attachments/143364538958348288/409861255046889472/CC_SergayVRPs_062.gif"
           }))
        },
        get: function getGame(msg, args) {
            if (args[0] === "it") {
                msg.channel.send("", createRichEmbed({
                    title: "Steam link",
                    url: "http://store.steampowered.com/app/368340/"
                }));
            } else if (args[0] === "out") {

            }
        },
        thanks: function doThank(msg) {
            //make this a class :p
            let thankYouMessage = [
                "Keep up the good work!",
                "You guys are awesome."];
            //Ew too long... please refractor
            msg.channel.send('', createRichEmbed({
                description: `From ${msg.member.nickname},\n\t${thankYouMessage[parseInt((Math.random() * thankYouMessage.length))]}\nTo,\n\t\tRadical Fish Games`
            }));
        }
    }
    let helpText = getHelpText(commands);
    return commands
};
