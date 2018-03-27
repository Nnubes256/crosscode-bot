const fs = require('fs');

class Env {

    static get BOT_TOKEN() {
        return Env.getFileData('.env').BOT_TOKEN || process.env.BOT_TOKEN;
    }
    
    static get BOT_PREFIX() {
        return Env.getFileData('.env').BOT_PREFIX || process.env.BOT_PREFIX;
    }

    static get TWITCH_CLIENT_ID() {
        return Env.getFileData('.env').TWITCH_CLIENT_ID || process.env.TWITCH_CLIENT_ID;
    }

    /**
     * 
     * @param {string} path
     */
    static getFileData(path) { //Maybe prefetch this data once
        try {
            return JSON.parse(fs.readFileSync(path, 'utf8'));
        } catch (err) {
            return {};
        }
    }
}

exports.Env = Env;