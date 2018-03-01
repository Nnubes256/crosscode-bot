let parser = new(require('xmldom').DOMParser);
let rp = require('request-promise');
const fs = require('fs');
//name, link, image url
let {
    createRichEmbed
} = require('./../../discord-util.js');
class CrossCodeFanArt {
    constructor() {
        let url = 'http://backend.deviantart.com/rss.xml?q=boost%3Apopular+in%3Afanart+crosscode&type=deviation'
        this.images = []
        this.defaultImage = createRichEmbed({
            title: "No art found"
        });
        let _instance = this;
        let otherFanArt = JSON.parse(fs.readFileSync('./modules/art.d/other-fanart.json', 'utf8'));
        for (var src in otherFanArt) {
            otherFanArt[src].forEach(function(element) {
                _instance.addFanArt(element);
            });
        }
        rp({
            uri: url,
            headers: {
                'User-Agent': 'crosscodebot'
            }
        }).then(function(response) {
            let fanart_xml = parser.parseFromString(response, 'text/xml');
            let fanart_items = fanart_xml.getElementsByTagName('item')
            for (let index = 0; index < fanart_items.length; index++) {
                let fan_item = fanart_items.item(index)
                let title = fan_item.getElementsByTagName("title")[0].textContent;
                let author = fan_item.getElementsByTagName("media:credit")[0].textContent;
                let postLink = fan_item.getElementsByTagName("link")[0].textContent;
                let link = fan_item.getElementsByTagName("media:content")[0].getAttribute("url");
                _instance.images.push(createRichEmbed({
                    title: `${title} - by ${author}`,
                    description: postLink,
                    image: link
                }));
            }
        });
    }
    addFanArt(opts) {
        if (opts.type === "twitter") {
            this.images.push(createRichEmbed({
                title: "Fan art",
                description: `[Artist twitter link](${opts.user_link})\n\n[View on Twitter](${opts.link})`,
                image: opts.image_url,
                url: opts.twitter_link
            }));
        } else if (opts.type === "discord") {
            this.images.push(createRichEmbed({
                title: `Fan art`,
                description: opts.description,
                image: opts.image_url
            }));
        } else if (opts.type === "deviant") {
            this.images.push(createRichEmbed({
                title: `Fan art`,
                description: opts.description,
                url: opts.user_link,
                image: opts.image_url
            }));
        }
        /*let title = opts.title || 'Fan Art';
        let description = opts.description || `Made by [${opts.author}](${opts.link})`;
        let image = opts.image_url;
        this.images.push(createRichEmbed({
            title: title,
            description: description,
            image: image
        }));*/
    }
    getRandomArt() {
        let index = parseInt(Math.random() * this.images.length);
        return this.images[index] || this.defaultImage;
    }
}
module.exports = CrossCodeFanArt