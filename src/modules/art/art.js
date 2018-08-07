

export default class Art {
  constructor({utils}) {
    this.art = [];
    this.utils = utils;
  }
  init() {

  }
  add(richEmbed) {
    this.art.push(richEmbed);
  }
  get(index) {
    if(index < 0 || this.art.length <= index)
      throw new RangeError(`${index} is not in range`);
    return this.art[index];
  }
  getRandom() {
    var indexChoice = parseInt(Math.random() * this.art.length);
    return this.get(indexChoice);
  }
  onMessage(msg, text) {
    var {content, embed} = this.process();
    msg.channel.send(content, embed);
  }
  process() {
    return {
      content : '',
      embed : this.getRandom()
    }
  }
}
