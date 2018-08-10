const Section = require('../section');

class ArtSection extends Section {
  constructor({cmdManager, utils}) {
    super({cmdManager, name: "art"});
    super.loadCommands(__dirname, {utils});
  }

  onMessage(msg, text) {
    let regex = /\s?get\s*(.*)/;
    if(regex.test(text)) {
      let artType = text.match(regex)[1];
      var cmd = this.findCommand(artType);
      cmd && cmd.onMessage(msg, text);
    }
  }
}

module.exports = ArtSection;
