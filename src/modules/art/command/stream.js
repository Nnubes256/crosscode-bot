const {Art} = require('./template/art');
const fs = require('fs');
const path = require('path');
class StreamArt extends Art {
  init() {

    this.name = "streamart";
    let streamLinksAbs = path.join(__dirname, '..', 'data/', 'stream.txt');
    const streamLinks = fs.readFileSync(streamLinksAbs, 'utf8').split("\n");
    for(let link of streamLinks) {
      this.add(this.utils.createRichEmbed({
        image : link
      }));
    }

  }
};

module.exports = StreamArt;
