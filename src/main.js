const { Env } = require('./env');
const { Bot } = require('./bot');
const { Config } = require('./config');



Array.prototype.random = function() {
    return this[parseInt(Math.random() * this.length)];
}



const config = new Config('config.json');
const bot = new Bot(Env.BOT_PREFIX, Env.BOT_TOKEN, config); 