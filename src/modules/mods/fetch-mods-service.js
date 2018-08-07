


export default class FetchModsService {
  constructor(utils, embedGenerator) {
    this.utils = utils;
    this.embedGenerator = embedGenerator;
  }
  async onUpdate() {
    await this.fetch();
  }
  async fetch() {
    let response = await this.utils.fetch({
        uri: 'https://raw.githubusercontent.com/CCDirectLink/CCModDB/master/mods.json',
        headers: {
            'User-Agent': 'crosscodebot'
        },
        json : true
    });
    this.embedGenerator.setMods(response.mods);
  }
}
