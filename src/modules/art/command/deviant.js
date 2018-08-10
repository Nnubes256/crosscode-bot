const {Art} = require('./template/art');

var DOMParser = require('xmldom').DOMParser;

const parser = new DOMParser();

class DeviantArt extends Art {
  constructor(args) {
    super(args);
  }
  async init() {
    // set the name to go by
    this.name = "deviantart";

    const response = await this.utils.fetch({
      uri : 'http://backend.deviantart.com/rss.xml?q=boost%3Apopular+in%3Afanart+crosscode&type=deviation',
      headers : {
        'User-Agent' : 'crosscodebot'
      }
    });

    const documentWrapperFactory = (doc) => {
        return {
           getElement : (name) => doc.getElementsByTagName(name)[0],
           getTextContentOf : (name) => doc.getElementsByTagName(name)[0].textContent,
           getAttributeOf : (name, attr) => doc.getElementsByTagName(name)[0].getAttribute(attr)
        };
    };

    let fanart_xml = parser.parseFromString(response, 'text/xml');
    let doc = documentWrapperFactory(fanart_xml);
    let fanart_items = fanart_xml.getElementsByTagName("item");
    for (let index = 0; index < fanart_items.length; index++) {
        let fan_item = fanart_items.item(index);
        let fanDoc = documentWrapperFactory(fan_item);
        let title = fanDoc.getTextContentOf("title");
        let author = fanDoc.getTextContentOf("media:credit");
        let postLink = fanDoc.getTextContentOf("link");
        let link = fanDoc.getAttributeOf("media:content", "url");

        this.add(this.utils.createRichEmbed({
            title : `${title} - by ${author}`,
            description : postLink,
            image : link
        }));
    }
  }
  get helpText() {
     return
  }
}

module.exports = DeviantArt;
