let rp = require('request-promise');
const {
    createRichEmbed
} = require('./../../discord-util.js');
module.exports = class Mods {
    constructor() {
        let _this = this;
        this.embed = null;
        //update every hour
        let timer = (1 * 3600 * 1000);
        let url = 'https://raw.githubusercontent.com/CCDirectLink/CCModDB/master/mods.json';

        function getMods() {
            //get the static data
            rp({
                uri: url,
                headers: {
                    'User-Agent': 'crosscodebot'
                }
            }).then(function(response) {
                response = JSON.parse(response);
                let mods = [];
                let _embed = {
                    fields: []
                };
                _embed.title = 'Verified Mods';
                for (let githubName in response.mods) {
                    let mod = response.mods[githubName];
                    if (_embed.fields.length <= 25) {
                        _embed.fields.push(_this.createModFromString(mod, githubName));
                    } else {
                        _embed.fields.push({});
                    }
                }
                if (_embed.fields.length > 25)
                    _embed.description = `Showing 25 out of ${_embed.fields.length} mods.`;
                else
                    _embed.description = `Showing all mods.`;
                let CCLoaderLink = 'https://github.com/CCDirectLink/CCLoader';
                _embed.description += `Note: All mods require [CCLoader](${CCLoaderLink}) to work.`;
                _embed.timestamp = new Date();
                let CCModDB = 'https://github.com/CCDirectLink/CCModDB';
                _embed.footer = {
                    text: `From CCModDB`
                };
                _this.embed = createRichEmbed(_embed);
            });

        };
        getMods();
        setInterval(getMods, timer);
    }
    createModFromString(mod, gitName) {
        let config = {
            name: `${mod.name} (${mod.version})`
        };
        if (typeof mod.description === "string") {
            config.value = mod.description;
        }
        if (mod.license) {
            config.value += `\nLicense: ${mod.license}`;
        }
        mod.page.forEach(function(page) {
            config.value += `\n[View on ${page.name}](${page.url})`;
        });
        return config;
    }
    getMods() {
        return this.embed;
    }
}