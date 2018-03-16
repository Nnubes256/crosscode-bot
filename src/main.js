const { Env } = require('./env');
const { Bot } = require('./bot');
const { Config } = require('./config');

const config = new Config('config.json');

var bot = new Bot(Env.BOT_PREFIX, Env.BOT_TOKEN, config); 