


export default class ModsEmbedGenerator {
  constructor(utils) {
    this.mods = [];
    this.utils = utils;
  }
  setMods(mods) [
    this.mods = mods;
  ]
  createPageEmbed(pageNum) {
    let [startIndex, endIndex] = this.getPageRange(pageNum);
    var options = {
      title : "Verified Mods",
      description : "Note: All mods require [CCLoader](https://github.com/CCDirectLink/CCLoader) to work"
      fields : [],
      footer : {
        text : 'From CCModDB'
      },
      timestamp : new Date()
    };

    if(startIndex !== endIndex) {

        let mods = this.mods.slice(startIndex, endIndex + 1);
        options.fields = mods.map(function(mod){
          return this.createField(mod);
        }.bind(this));

    } else {
      return null;

    }
    return this.utils.createRichEmbed(options);

  }
  createField(mod) {
    let field = {};
    field.name = `${mod.name} (${mod.version})`;
    field.value = `${mod.description}\n`
                  + mod.page
                     .map(({name, url}) => `View on [${name}](${url})`)
                     .join("\n");
    return field;
  }
  getPageCount() {
    if(!this.mods.length)
      return 0;
    return Math.ceil(this.mods.length/25) + 1;
  }
  getPageRange(pageNum) {
    var pages = this.getPageCount();
    if(pages < pageNum)
      return [-1, -1];
    var startIndex = (pageNum - 1) * 25;
    var endIndex;
    if(pages === pageNum) {
      endIndex = this.mods.length - 1;
    } else {
      endIndex = startIndex + 24;
    }
    return [startIndex, endIndex];

  }
}
