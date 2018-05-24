const fs = require('fs');
const { Client, GuildChannel, Role } = require('discord.js');
const { Env } = require('./env');
const { Module } = require('./module');

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
            this.commands[type] = require(`./modules/${type}.js`)[type];
        }
    }

    get roleServers() {
        return this['role-servers'];
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
        let result = {id: '', chans: {}, pending: [], member: [], blacklist: [], whitelist: [], admin: []};
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
            const roleEntry = server.roles.find(r => r.name === role);
            if (!roleEntry) {
                console.warn('pending role missing (skiped) - role: %s, server: %s', role, server.name);
                continue;
            }
            result.pending.push(roleEntry);
        }

        for (let role of serverJson.roles.member) {
            const roleEntry = server.roles.find(r => r.name === role);
            if (!roleEntry) {
                console.warn('member role missing (skiped) - role: %s, server: %s', role, server.name);
                continue;
            }
            result.member.push(roleEntry);
        }

        for (let role of serverJson.roles.blacklist) {
            const roleEntry = server.roles.find(r => r.name === role);
            if (!roleEntry) {
                console.warn('blacklist role missing (skiped) - role: %s, server: %s', role, server.name);
                continue;
            }
            result.blacklist.push(roleEntry);
        }

        for (let role of serverJson.roles.whitelist) {
            const roleEntry = server.roles.find(r => r.name === role);
            if (!roleEntry) {
                console.warn('whitelist role missing (skiped) - role: %s, server: %s', role, server.name);
                continue;
            }
            result.whitelist.push(roleEntry);
        }

        for(let role of serverJson.roles.admin) {
            const roleEntry = server.roles.find(r => r.name === role);
            if (!roleEntry) {
                console.warn('admin role missing (skiped) - role: %s, server: %s', role, server.name);
                continue;
            }
            result.admin.push(roleEntry);
        }
        return result;
    }
}

exports.Config = Config;