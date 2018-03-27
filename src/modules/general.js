const Splitter = require('grapheme-splitter');

const { Module } = require('../module');
const { Utils } = require('../utils');
const { Message } = require('discord.js');

class General extends Module{
    constructor() {
        super();

        this.splitter = new Splitter();
    }

    getCommands() {
        return {
            purge: this.purge.bind(this),
            ping: this.ping.bind(this),
            box: this.box.bind(this),
            rbox: this.randomBox.bind(this),
            setname: this.setName.bind(this),
            pmn: this.poorMansNitro.bind(this),
            emote: this.leaEmote.bind(this),
            lsemotes: this.listEmotes.bind(this),
            cloudlea: msg => {
                msg.channel.send('', Utils.createRichEmbed({
                    image: 'https://images-ext-1.discordapp.net/external/C8ZfRnUDaIaHkZNgR6TP81kCEbc1YJrtsnG5J-TTSzM/https/cdn.discordapp.com/attachments/373163281755537420/380813466354843649/steam-cloud-600x368.png?width=500&height=307'
                }));
            },
            sleep: msg => {
                if (Utils.isAdmin(msg.member)) {
                    instance.destroy();
                    process.exit(0);
                } else {
                    msg.reply('You don\'t have the power to kill me!');
                }
            },
            language: msg => {
                msg.channel.send('', Utils.createRichEmbed({
                    image: 'https://cdn.discordapp.com/attachments/376138665954377728/381560390384877578/Javascript_DeathStareLea.gif'
                }));
            },
            hi: msg => {
                msg.channel.send('hi!!! ' + Utils.getEmote(msg, 'leaCheese'));
            },
            bye: msg => {
                msg.channel.send('bye!!! ' + Utils.getEmote(msg, 'leaCheese'));
            },
            bugs: msg => {
                msg.channel.send('', Utils.createRichEmbed({
                    image: 'https://cdn.discordapp.com/attachments/380588134712475665/383705658731659266/tumblr_mtud5kX2T71r7fahjo1_250.gif'
                }))
            },
            BUG: msg => {
                msg.channel.send(Utils.getEmote(msg, 'emilieWhy'));
            },
            lewd: msg => {
                msg.react(Utils.getEmote(msg, "ohno").id);
            },
            react: (msg, args) => {
                for (let i = 0; i < args.length; i++) {
                    let thonk = getEmote(msg, args[i]);
                    if (thonk.id !== '')
                        msg.react(thonk.id);
                }
            },
            thinking: msg => {
                msg.react(Utils.getEmote(msg, 'mia_thinking').id)
            },
            CHEATER: msg => {
                const cheater = msg.mentions.members.first();
                if (cheater) {
                    let apolloPoint = getEmote(msg, "apolloPoint");
                    let apolloShout = getEmote(msg, "apolloShout");
                    let message = `${cheater} ${apolloPoint}${apolloShout} I GOT YOU NOW!`
                    msg.channel.send(message)
                } else {
                    msg.reply('could not find the cheater.')
                }
            },
            triggered: msg => {
                msg.channel.send(Utils.createRichEmbed({
                    title: "...WHY?!?!",
                    image: 'https://cdn.discordapp.com/attachments/374851126627008514/382063690557685760/Lea_triggered.gif'
                }))
            },
            verytriggered: msg => {
                msg.channel.send(Utils.createRichEmbed({
                    title: "何？",
                    image: "https://cdn.discordapp.com/attachments/381866628108910593/382331699213893632/triggeredlea.gif"
                }))
            },
            "HI!": msg => {
                msg.channel.send(Utils.createRichEmbed({
                    image: 'https://cdn.discordapp.com/attachments/373163281755537420/381790329550143488/Deal_with_it_Lea.gif'
                }))
            },
            vote: msg => {
                msg.react("👍")
                    .then((msgReact) => msgReact.message.react("👊"))
                    .then((msgReact) => msgReact.message.react("👎"))
    
            },
            ohno: msg => {
                msg.channel.send(":(", Utils.createRichEmbed({
                    image: "https://cdn.discordapp.com/emojis/400836365295812619.png"
                }))
            },
            work: msg => {
                msg.channel.send("...why?", Utils.createRichEmbed({
                    image: "https://cdn.discordapp.com/emojis/337987528625881090.png"
                }))
            },
            balls: msg => {
                msg.channel.send("BALLS", Utils.createRichEmbed({
                    image: "https://cdn.discordapp.com/attachments/143364538958348288/368033879162093581/balls.png"
                }))
            },
            vrps: msg => {
                msg.channel.send("VRPS", Utils.createRichEmbed({
                    image: "https://cdn.discordapp.com/attachments/143364538958348288/409861255046889472/CC_SergayVRPs_062.gif"
                }))
            },
            get: msg => {
                msg.channel.send("", Utils.createRichEmbed({
                    title: "Steam link",
                    url: "http://store.steampowered.com/app/368340/"
                }));
            },
            thanks: msg => {
                //make this a class :p
                const thankYouMessage = [
                    "Keep up the good work!",
                    "You guys are awesome."
                ];
                //Ew too long... please refractor
                msg.channel.send('', Utils.createRichEmbed({
                    description: `From ${msg.member.nickname},\n\t${thankYouMessage[parseInt((Math.random() * thankYouMessage.length))]}\nTo,\n\t\tRadical Fish Games`
                }));
            }
        }
    }
    
    /**
     * @returns {{name: string, description: string}[]}
     */
    getHelp() {
        return [
            { name: 'help', description: 'Displays a help about a command' }, //Help is hardcoded to Bot
            { name: 'purge', description: 'TODO' },
            { name: 'ping', description: 'TODO' },
            { name: 'box', description: 'TODO' },
            { name: 'rbox', description: 'TODO' },
            { name: 'setname', description: 'TODO' },
            { name: 'pmn', description: 'TODO' },
            { name: 'emote', description: 'TODO' },
            { name: 'lsemotes', description: 'TODO' },
            { name: 'cloudlea', description: 'TODO' },
            { name: 'sleep', description: 'TODO' },
            { name: 'language', description: 'TODO' },
            { name: 'hi', description: 'TODO' },
            { name: 'bye', description: 'TODO' },
            { name: 'bugs', description: 'TODO' },
            { name: 'BUG', description: 'TODO' },
            { name: 'lewd', description: 'TODO' },
            { name: 'react', description: 'TODO' },
            { name: 'thinking', description: 'TODO' },
            { name: 'CHEATER', description: 'TODO' },
            { name: 'triggered', description: 'TODO' },
            { name: 'verytriggered', description: 'TODO' },
            { name: 'HI!', description: 'TODO' },
            { name: 'vote', description: 'TODO' },
            { name: 'ohno', description: 'TODO' },
            { name: 'work', description: 'TODO' },
            { name: 'balls', description: 'TODO' },
            { name: 'vrps', description: 'TODO' },
            { name: 'get', description: 'TODO' },
            { name: 'thanks', description: 'TODO' }
        
        ];
    }

    /**
     * 
     * @param {Message} msg 
     * @param {string[]} args 
     */
    purge(msg, args) {
        if(!Utils.isAdmin(msg.member))
            return msg.reply('You cannot use this command!');

        const id = this.bot.client.user.id;
        const options = {
            limit: 100
        }

        if (args.length > 0) {
            options.after = args[0];
        }

        msg.channel.fetchMessages(options)
            .then(messages => {
                return messages.filter(message => {
                    return message.author.id === id;
                });
            }).then(messages => {
                msg.channel.bulkDelete(messages).then(() => {
                    msg.reply('Deleted the last message')
                });
            });
    }

    /**
     * 
     * @param {Message} msg 
     */
    ping(msg) {
        //this measures the time it took to get here
        const duration = Date.now() - msg.createdTimestamp;
        msg.reply(`>:) pew pew. Got here in ${duration} ms, and...`).then(function(msg) {
            //this measures the return trip time
            const newDuration = Date.now() - msg.createdTimestamp;
            msg.channel.send(`sent back in ${newDuration} ms`)
        })
    }

    /**
     * 
     * @param {Message} msg 
     * @param {string[]} args 
     */
    box(msg, args) {
        if (msg.channel.name !== 'spam') //TODO: Maybe change to read spam channel from config?
            return;

        const phrase = args.join(' ');
        const charLimit = 80;
        if (phrase.length > charLimit) {
            msg.reply(`Due to complaints by users, it has now been nerfed to max of ${charLimit} characters (emojis lengths vary). Sorry about that.`);
            return;
        }
        const arr = this.splitter.splitGraphemes(phrase);
        this.boxGenerate(phrase, arr).forEach(message => {
            msg.channel.send('```js\n' + message + '```');
        });
    }

    /**
     * 
     * @param {string} phrase 
     * @param {any[]} characterArray 
     */
    boxGenerate(phrase, characterArray) {
        const maxMessageLength = 1960;
        const maxPhraseLength = phrase.length;
        const currentMessage = '';
        const messagePayloads = [];

        let currCharLength = 0;
        for (let i = 0; i < characterArray.length; i++) {
            const substr = phrase.substring(currCharLength) + '\n';
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

    /**
     * 
     * @param {Message} msg 
     * @param {string[]} args 
     */
    randomBox(msg, args) {
        if (msg.channel.name !== 'spam') //TODO: Maybe change to read spam channel from config?
            return;

        const phrase = args.join(' ');
        const charLimit = 80;
        if (phrase.length > charLimit) {
            msg.reply(`Due to complaints by users, it has now been nerfed to max of ${charLimit} characters (emojis lengths vary). Sorry about that.`);
            return;
        }
        const arr = splitter.splitGraphemes(phrase).reverse();
        this.boxGenerate(arr.join(''), arr).forEach(message => {
            msg.channel.send('```js\n' + message + '```');
        });
    }

    /**
     * 
     * @param {Message} msg 
     * @param {string[]} args 
     * @param {string} command
     */
    setName(msg, args, command) {
        if (!Utils.isAdmin(msg.member))
            return msg.reply('You cannot use this command!');

        if (args.length < 2) 
            return msg.reply('Not enough arguments supplied.');
        
        const oldName = args.shift()
        const member = msg.mentions.members.first();
        if (!member) 
            return msg.reply(`Could not find ${oldName}. Did you mentioned the user?`);
        
        member.setNickname(args.join(' ')).catch(error => {
            msg.reply(`${error}`);
        })
    }

    /**
     * 
     * @param {Message} msg 
     * @param {string[]} args 
     */
    poorMansNitro(msg, args) {
        const delim = '/';
        const pieces = args.join(' ').split(delim);
        for (let i = 0; i < pieces.length - 1; i++) {
            const thonk = Utils.getEmote(msg, pieces[i]);
            if (thonk.id !== '') {
                if (i > 0) {
                    pieces.splice(i - 1, 3, [pieces[i - 1], thonk, pieces[i + 1]].join(''));
                    i--;
                }
            }

        }
        msg.channel.send(`*${msg.author} says:*\n${pieces.join(delim)}`);
        if (msg.deletable)
            msg.delete();
    }

    /**
     * 
     * @param {Message} msg 
     * @param {string[]} args 
     */
    leaEmote(msg, args) {
        let reply = '';
        for (let i = 0; i < args.length; i++) {
            const thonk = Utils.getEmote(args[i]);
            if (thonk.id !== '')
                reply += thonk + ' ';
        }
        if (reply !== '')
            msg.channel.send(reply);
    }

    /**
     * 
     * @param {Message} msg 
     * @param {string[]} args 
     */
    listEmotes(msg, args) {
        let em = this.bot.client.emojis.map(e => e.name);
        //lets add animated emotes
        em = em.concat(msg.guild.emojis.findAll('animated', true).map(e => e.name));
        let message = "\n";
        let count = 0;
        for (let emote of em) {
            const thonk = Utils.getEmote(emote);
            const emojiLine = emote + ' ' + thonk + '\n';
            if (message.length + emojiLine.length > 2000) {
                msg.channel.send(message);
                message = "\n";
            }
            message += emojiLine;
        }
        msg.channel.send(message);
    }
}

exports.general = new General();