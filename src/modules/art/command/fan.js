const {Art} = require('./template/art');

class FanArt extends Art {

  init() {

    this.name = "fanart";
    const fanart = require('../data/other-fanart.json').discord;

    for(var fanartConfig of fanart) {
      this.add(fanartConfig);
    }
  }
  add(opts) {
        if (opts.type === "twitter") {
            super.add(this.utils.createRichEmbed({
                title: "Fan art",
                description: `[Artist twitter link](${opts.user_link})\n\n[View on Twitter](${opts.status_link})`,
                image: opts.image_url
            }));
        } else if (opts.type === "discord") {
            super.add(this.utils.createRichEmbed({
                title: `Fan art`,
                description: opts.description,
                image: opts.image_url
            }));
        } else if (opts.type === "deviant") {
            super.add(this.utils.createRichEmbed({
                title: `Fan art`,
                description: opts.description,
                url: opts.user_link,
                image: opts.image_url
            }));
        }
    }
}
module.exports = FanArt;
