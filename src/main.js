const { Env } = require('./env');
const { Bot } = require('./bot');
const { Config } = require('./config');

import Utils from './utils';

Array.prototype.random = function() {
    return this[parseInt(Math.random() * this.length)];
}


const config = new Config('config.json');

Env.init();
const bot = new Bot(Env, config, Utils);

process.on('SIGINT', function () {
  bot.client.user.setStatus('dnd');
  process.exit(2);
});
