const rp = require('request-promise');

const { Utils } = require('../../utils');


class ModInfo {
    constructor() {
        this.embed = null;
        //update every hour
        const timer = (1 * 3600 * 1000);

        this.getModData();
        setInterval(this.getModData.bind(this), timer);
    }

    createModFromString(mod, gitName) {
        const config = {
            name: `${mod.name} (${mod.version})`,
            value: '' + mod.description
        };

        if (mod.license) {
            config.value += `\nLicense: ${mod.license}`;
        }

        mod.page.forEach((page) => {
            config.value += `\n[View on ${page.name}](${page.url})`;
        });

        return config;
    }

    getMods() {
        return this.embed;
    }

    getModData() {
        const url = 'https://raw.githubusercontent.com/CCDirectLink/CCModDB/master/mods.json';

        //get the static data
        rp({
            uri: url,
            headers: {
                'User-Agent': 'crosscodebot'
            }
        }).then(response => {
            const CCLoaderLink = 'https://github.com/CCDirectLink/CCLoader';
            const CCModDB = 'https://github.com/CCDirectLink/CCModDB';

            response = JSON.parse(response);

            const mods = [];
            const embed = {
                title: 'Verified Mods',
                fields: []
            };

            for (let githubName in response.mods) {
                const mod = response.mods[githubName];
                if (embed.fields.length <= 25) {
                    embed.fields.push(this.createModFromString(mod, githubName));
                } else {
                    embed.fields.push({});
                }
            }

            if (embed.fields.length > 25)
                embed.description = `Showing 25 out of ${embed.fields.length} mods.`;
            else
                embed.description = 'Showing all mods.';

            embed.description += `\nNote: All mods require [CCLoader](${CCLoaderLink}) to work.`;
            embed.timestamp = new Date();
            embed.footer = {
                text: 'From CCModDB'
            };

            this.embed = Utils.createRichEmbed(embed);
        })
            .catch(error => {
                console.error('Could not retrieve mod data: ', error);
            });
    }
}

exports.ModInfo = ModInfo;