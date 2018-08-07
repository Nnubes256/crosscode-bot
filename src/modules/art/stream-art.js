import Art from './art';

export default class StreamArt extends Art {
  init() {
    const streamLinks =require('./data/stream.txt').split("\n");

    for(let link of streamLinks) {
      this.add(this.utils.createRichEmbed({
        image : link
      }));
    }

  }
};
