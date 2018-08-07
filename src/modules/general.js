const { Module } = require('../module');
const { Utils } =  (require('../utils'));
const splitter = new(require('grapheme-splitter'));

class General extends Module{
    initialize(bot, cmd) {
    }
    doGreet() {
      return {
        template : "hi",
        description : "Lea says hi!",
        args : [],
        run : function(msg) {
          msg.channel.send('');
        }
      };
    }
    sendLeaCheeseArmy() {
      return {
        template : "leaCheeseArmy",
        description : "Show an array of angry :leaCheese:!",
        args : [{
          type : "number",
          name : "width",
          min : 1,
          max : 8
        },{
          type : "number",
          name : "height",
          min :1,
          max : 8
        }],
        run : function (msg, {width, height}) {
          /*const emoji = getEmote(msg, 'leaCheeseAngry').toString();
          if(!emoji)
            return;*/
          var army = ('\n' + ":leaCheese:".repeat(width)).repeat(height);
          var response = `**You are being raided!${army}**`;

          msg.channel.send(response);
        }
      };
    }

    doPurge() {
      var run = function(msg) {
        console.log("bot", this.bot.client.user.id);
        msg.channel.fetchMessages({ limit : 100 }).then(function filter(messages) {
          return messages.filter(function(message) {
            return message.author.id === this.bot.client.user.id;
          }.bind(this));
        }.bind(this)).then(function(messages) {
             let lastKey = messages.lastKey();
             for (var message of messages) {
             if (message[0] === lastKey) {
              message[1].delete().then(function() {
               console.log('Deleted the last few messages')
             })
           } else {
             message[1].delete();
           }
          }
        });
        /*
        $ purge
        */
      };
      return {
        template : "purge",
        description : "Filters last 100 message and purges all from Lea.",
        args : [],
        run : run.bind(this)
      };
    }

    doPing() {
      return {
        template : "ping",
        description : "Get the response time of Lea.",
        args : [],
        run : function(msg) {
          let duration = Date.now() - msg.createdTimestamp;
          msg.reply(`>:) pew pew. Got here in ${duration} ms, and...`).then(function(msg) {
              //this measures the return trip time
              let newDuration = Date.now() - msg.createdTimestamp;
              msg.channel.send(`sent back in ${newDuration} ms`)
          });
        }
      };
    }
    displayCloudLea() {
      return {
        template : "cloudlea",
        description : "Shows image of Lea on a cloud.",
        args : [],
        run : function(msg) {
          msg.channel.send('', Utils.createRichEmbed({
              image: 'https://images-ext-1.discordapp.net/external/C8ZfRnUDaIaHkZNgR6TP81kCEbc1YJrtsnG5J-TTSzM/https/cdn.discordapp.com/attachments/373163281755537420/380813466354843649/steam-cloud-600x368.png?width=500&height=307'
          }));
        }
      };
    }

    getLanguage() {
      return {
        template : "language",
        description : "Tells you what language CrossCode was made in.",
        args : [],
        run : function(msg) {
          msg.channel.send('', Utils.createRichEmbed({
            image : 'https://cdn.discordapp.com/attachments/376138665954377728/381560390384877578/Javascript_DeathStareLea.gif'
          }));
        }
      }

    }
     /**
     * @returns {{name: string, desciption: string}[]}
     */
    getHelp() {
        return [
            { name: 'help', desciption: 'Displays a help about a command' } //Help is hardcoded to Bot
        ];
    }
}

exports.general = new General();
