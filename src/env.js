const fs = require('fs');

function getFileData(path) {
    try {
        return JSON.parse(fs.readFileSync(path, 'utf8'));
    } catch (err) {
        return {};
    }
}

class Env {

    static get BOT_TOKEN() {
        return getFileData('.env').BOT_TOKEN || process.env.BOT_TOKEN;
    }
    
    static get BOT_PREFIX() {
        return getFileData('.env').BOT_PREFIX || process.env.BOT_PREFIX;
    }
}

exports.Env = Env;