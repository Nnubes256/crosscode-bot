import Mods from './mods';
import ModsEmbedGenerator from './mods-embed-generator';
import FetchModsService from './fetch-mods-service';

class ListMods extends Mods {
  constructor({client, utils}) {
    this.client = client;
    this.embedGenerator = new ModsEmbedGenerator(utils);
    this.service = new FetchModsService(utils, this.embedGenerator);
  }
  onMessage(msg) {
    var index = 0;
    var {content, embed} = this.process(index);
    if(!embed) {
      return;
    }

    const filterReactions = function({emoji}, {id}) {
        return id !== this.client.user.id
               && emoji.name === '⬅'
               || emoji.name === '➡';
    }.bind(this);

    msg.channel.send(content, embed)
         .then(function(msg) {
           msg.createReactionCollector(filter, {time : 15000})
              .on('collect', function({emoji}) {
                  if(emoji.name === '⬅') {
                    if(index === 0){
                      return;
                    }
                    index--;
                  }
                  if(emoji.name === '➡') {
                    if(index > this.embedGenerator.getPageCount()) {
                      return;
                    }
                    index++;
                  }
                  var {embed} = this.process(index);
                  if(embed) {
                    responsePromise
                  }
              }.bind(this));
          }.bind(this));
  }
  process(num) {
    var embed = this.embedGenerator.create(num);
    if(embed) {
      return {
        content : '',
        embed
      };
    }
    return {
      content : ``,
      embed : null
    };

  }

}
