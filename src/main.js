const { Env } = require('./env');
const { Bot } = require('./bot');
//const { Config } = require('./config');

const Utils = require('./utils');


//const config = new Config('config.json');

Env.init();
const bot = new Bot(Env, Utils);

process.on('SIGINT', function () {
  bot.client.user.setStatus('dnd');
  process.exit(2);
});
process.on('unhandledRejection', up => { throw up });
