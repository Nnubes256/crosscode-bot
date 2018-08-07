

export default class Mods {
  constructor({utils}) {
    this.utils = utils;
  }
  init() {

  }
  onMessage(msg) {
      var {content, embed} = this.process();
      msg.channel.send(content, embed);
  }
}
