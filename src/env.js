var fs = require('fs');
class Env {
	static init() {
		if(!process.env.BOT_TOKEN) {
			var vars = fs.readFileSync('.env', 'utf8').split("\n");
			for(var line of vars) {
				var data = line.split("=");
				process.env[data[0]] = data[1];
			}
		}
	}
    static get BOT_TOKEN() {
        return process.env.BOT_TOKEN;
    }
    
    static get BOT_PREFIX() {
        return process.env.BOT_PREFIX;
    }
}

exports.Env = Env;