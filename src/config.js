const fs = require('fs');
const { Client, GuildChannel, Role } = require('discord.js');
const { Env } = require('./env');

class Config {
    /**
     *
     * @param {string} path
     */
    constructor(path) {
        Object.assign(this, JSON.parse(fs.readFileSync(path)));

        /** @type {Module[]} */
        this.commands = [];
        for (let type of this.modules) {
            //this.commands[type] = require(`./modules/${type}.js`)[type];
        }
    }

    get roleServers() {
        return this["role-servers"];
    }

    /** @param {Client} client */
    init(client) {
        /** @type {{id: string, chans: GuildChannel[], pending: Role[], blacklist: Role[], whitelist: Role[], admin: Role[]}[]} */
        this.servers = [];
        for (let json of this.roleServers) {
            let server = this.findModServer(client, json);
            if (server)
                this.servers.push(server);
        }
    }

    /**
     *
     * @param {Client} client
     * @param {*} serverJson
     * @returns {{id: string, chans: GuildChannel[], pending: Role[], blacklist: Role[], whitelist: Role[], admin: Role[]}}
     */
    findModServer(client, serverJson) {
        let result = {id: "", chans: {}, pending: [], blacklist: [], whitelist: [], admin: []};
        let server = client.guilds.find(g => g.name === serverJson.name);
        if (!server)
            return null;

        result.id = server.id;
        result.greet = serverJson.greeting.replace(/\$PREFIX/g, Env.BOT_PREFIX);
        for (let role in serverJson.channels) {
            result.chans[role] = server.channels.find(c => c.name === serverJson.channels[role]);
        }

        if(!serverJson.roles)
            return result;

        for (let role of serverJson.roles.pending) {
            result.pending.push(server.roles.find(r => r.name === role));
        }

        for (let role of serverJson.roles.blacklist) {
            result.blacklist.push(server.roles.find(r => r.name === role).id);
        }

        for (let role of serverJson.roles.whitelist) {
            result.blacklist.push(server.roles.find(r => r.name === role).id);
        }
        for(let role of serverJson.roles.admin) {
            result.admin.push(server.roles.find(r => r.name === role).id);
        }
        return result;
    }
}

exports.Config = Config;
