

class FanArt extends Art {
  init() {
    const fanart = JSON.parse(require('./data/other-fanart.json'));

    for(var fanartConfig of fanart) {
      this.add(config);
    }
  }
  add(opts) {
        if (opts.type === "twitter") {
            super.add(this.utils.createRichEmbed({
                title: "Fan art",
                description: `[Artist twitter link](${opts.user_link})\n\n[View on Twitter](${opts.link})`,
                image: opts.image_url,
                url: opts.twitter_link
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
