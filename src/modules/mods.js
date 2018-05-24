const { Utils } = require('../utils');
const { Module } = require('../module');

const { ModInfo } = require('./mods.d/mods');

class Mods extends Module{
    constructor() {
        super();

        this.modInfo = new ModInfo();
    }

    getCommands() {
        const modInfo = this.modInfo;

        return {
            get: function getMods(msg) {
                msg.channel.send('', modInfo.getMods() || Utils.createRichEmbed({
                    title: 'Mods not Available'
                }));
            },
            install: function getInstallationGuide(msg) {
                msg.channel.send('', Utils.createRichEmbed({
                    title: 'Installation guide',
                    url: 'https://github.com/CCDirectLink/CCLoader/wiki/Install-mods'
                }));
            }
        };
    }

    getHelp() {
        return [
            { name: 'get', description: 'Get a list of mods'},
            { name: 'install', description: 'Get a link to the installation guide for CrossCode mods'}
        ];
    }
}

exports.mods = new Mods();