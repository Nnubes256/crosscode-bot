const parser = new(require('xmldom').DOMParser);
const rp = require('request-promise');
const fs = require('fs');

const { RichEmbed, MessageEmbed } = require('discord.js');
const { Utils } = require('../../utils');

class CrossCodeFanArt {
    constructor() {
        const url = 'http://backend.deviantart.com/rss.xml?q=boost%3Apopular+in%3Afanart+crosscode&type=deviation'
        
        /** @type {(RichEmbed | MessageEmbed)[]}} */
        this.images = []
        this.defaultImage = Utils.createRichEmbed({
            title: "No art found"
        });
        
        /** @type {{discord: {type: string, username: string, description: string, image_url: string}[]}} */
        const otherFanArt = JSON.parse(fs.readFileSync('other-fanart.json', 'utf8'));
        for (let art of otherFanArt.discord) {
            this.addFanArt(art);
        }

        rp({
            uri: url,
            headers: {
                'User-Agent': 'crosscodebot'
            }
        }).then(response => {
            const fanart_xml = parser.parseFromString(response, 'text/xml');
            const fanart_items = fanart_xml.getElementsByTagName('item');
            
            for (let i = 0; i < fanart_items.length; i++) {
                const fan_item = fanart_items.item(i);

                const title = fan_item.getElementsByTagName("title")[0].textContent;
                const author = fan_item.getElementsByTagName("media:credit")[0].textContent;
                const postLink = fan_item.getElementsByTagName("link")[0].textContent;
                const link = fan_item.getElementsByTagName("media:content")[0].getAttribute("url");

                this.images.push(Utils.createRichEmbed({
                    title: `${title} - by ${author}`,
                    description: postLink,
                    image: link
                }));
            }
        })
        .catch(error => {
            console.error("Could not retrieve art: ", error);
        });
    }


    /** 
     * @param {{type: string, username: string, description: string, image_url: string}} opts 
     */
    addFanArt(opts) {
        if (opts.type === "twitter") {
            this.images.push(Utils.createRichEmbed({
                title: "Fan art",
                description: `[Artist twitter link](${opts.user_link})\n\n[View on Twitter](${opts.link})`,
                image: opts.image_url,
                url: opts.twitter_link
            }));
        } else if (opts.type === "discord") {
            this.images.push(Utils.createRichEmbed({
                title: `Fan art`,
                description: opts.description,
                image: opts.image_url
            }));
        } else if (opts.type === "deviant") {
            this.images.push(Utils.createRichEmbed({
                title: `Fan art`,
                description: opts.description,
                url: opts.user_link,
                image: opts.image_url
            }));
        }
        /*const title = opts.title || 'Fan Art';
        const description = opts.description || `Made by [${opts.author}](${opts.link})`;
        const image = opts.image_url;
        this.images.push(Utils.createRichEmbed({
            title: title,
            description: description,
            image: image
        }));*/
    }

    /**
     * 
     * @returns {RichEmbed | MessageEmbed} 
     */
    getRandomArt() {
        let index = parseInt(Math.random() * this.images.length);
        return this.images[index] || this.defaultImage;
    }
}
module.exports.CrossCodeFanArt = CrossCodeFanArt