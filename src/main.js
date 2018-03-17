const { Env } = require('./env');
const { Bot } = require('./bot');
const { Config } = require('./config');
const { Utils } = require('./utils');



Array.prototype.random = function() {
    return this[parseInt(Math.random() * this.length)];
}



const config = new Config('config.json');
Utils.setConfig(config);
const bot = new Bot(Env.BOT_PREFIX, Env.BOT_TOKEN, config); 